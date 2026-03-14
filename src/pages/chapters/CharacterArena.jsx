import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { characters, traitDefinitions } from '../../data/activityData'
import { useCharacter } from '../../context/CharacterContext'
import ChapterNav from '../../components/ui/ChapterNav'
import { audioSystem } from '../../utils/audio'

const BASE = '/activity/skillizee-character'

// ─── Character thumbnail with image or fallback ─────────────
function CharThumb({ char, isSelected, onClick }) {
  const [imgError, setImgError] = useState(false)
  const initials = char.name.slice(0, 2).toUpperCase()

  return (
    <motion.button
      whileHover={{ scale: 1.15, y: -4 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 border-2
        ${isSelected
          ? 'ring-3 ring-yellow-400 border-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.5)] z-20'
          : 'border-white/20 hover:border-white/60 opacity-80 hover:opacity-100'
        }`}
      title={char.name}
    >
      {char.image && !imgError ? (
        <img
          src={char.image}
          alt={char.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${char.color} flex items-center justify-center`}>
          <span className="text-white font-baloo font-black text-lg">{initials}</span>
        </div>
      )}

      {/* Selection indicator dot */}
      {isSelected && (
        <motion.div
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-yellow-400 rounded-full"
          layoutId="selector"
        />
      )}
    </motion.button>
  )
}

// ─── Trait Badge ─────────────────────────────────────────────
function TraitBadge({ traitKey }) {
  const key = traitKey.toLowerCase()
  const def = traitDefinitions[key]
  if (!def) return <span className="bg-white/30 text-white font-nunito font-bold text-xs px-3 py-1 rounded-full">{traitKey}</span>
  return (
    <span className={`bg-gradient-to-r ${def.color} text-white font-nunito font-bold text-xs px-3 py-1.5 rounded-full shadow-sm`}>
      {def.emoji} {def.name}
    </span>
  )
}

// ─── Main Character Arena Component ─────────────────────────
export default function CharacterArena() {
  const navigate = useNavigate()
  const { selectedCharacter, setSelectedCharacter } = useCharacter()
  const [confirmed, setConfirmed] = useState(false)
  const portraitRef = useRef(null)
  
  // Track image/gif loading states
  const [gifMode, setGifMode] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [showMuteBtn, setShowMuteBtn] = useState(false)
  const [isMuted, setIsMuted] = useState(audioSystem.isMuted)

  // Initialize audio and voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices()
    
    // Play BGM when user interacts or component mounts
    const playAudio = () => audioSystem.playBGM()
    window.addEventListener('click', playAudio, { once: true })
    window.addEventListener('keydown', playAudio, { once: true })
    
    // If they already interacted elsewhere, start immediately
    audioSystem.playBGM()

    const muteTimeout = setTimeout(() => setShowMuteBtn(true), 10000)

    return () => {
      audioSystem.stopBGM()
      audioSystem.stopTheme()
      clearTimeout(muteTimeout)
    }
  }, [])

  // Reset image states when character changes
  useEffect(() => {
    setGifMode(true)
    setImgError(false)
  }, [selectedCharacter?.id])

  const handleSelect = useCallback((char) => {
    if (selectedCharacter?.id !== char.id) {
      audioSystem.playClick()
      setSelectedCharacter(char)
      audioSystem.playAnnouncer(char.id, char.name)
      audioSystem.playTheme(char)
    }
  }, [selectedCharacter, setSelectedCharacter])

  const handleConfirm = useCallback(() => {
    if (!selectedCharacter) return
    audioSystem.stopBGM()
    audioSystem.stopTheme()
    audioSystem.playConfirm()
    setConfirmed(true)
    setTimeout(() => navigate(`${BASE}/module-2/chapter-2-2`), 800)
  }, [selectedCharacter, navigate])

  // Keydown listener for Arcade-style keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (confirmed) return
      
      const currentIndex = characters.findIndex(c => c.id === selectedCharacter?.id)
      
      if (e.key === 'ArrowRight') {
        const nextChar = characters[(currentIndex + 1) % characters.length]
        handleSelect(nextChar)
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = currentIndex <= 0 ? characters.length - 1 : currentIndex - 1
        handleSelect(characters[prevIdx])
      } else if (e.key === 'Enter' && selectedCharacter) {
        handleConfirm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCharacter, confirmed, handleSelect, handleConfirm])

  const displayChar = selectedCharacter
  const initials = displayChar ? displayChar.name.slice(0, 2).toUpperCase() : ''

  return (
    <div className="max-w-6xl mx-auto">
      {/* Confirmed overlay */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gray-900 border-2 border-yellow-400 rounded-3xl p-10 text-center shadow-2xl max-w-sm"
            >
              <div className="w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-3 border-yellow-400 shadow-xl">
                {selectedCharacter?.image && !imgError ? (
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${selectedCharacter?.color} flex items-center justify-center`}>
                    <span className="text-white font-baloo font-black text-3xl">{initials}</span>
                  </div>
                )}
              </div>
              <h2 className="font-baloo font-black text-3xl text-yellow-400 mb-2">{selectedCharacter?.name} Ready!</h2>
              <p className="font-nunito text-gray-400">Loading questions...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TEKKEN-STYLE LAYOUT ═══ */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative">

        {/* Top header bar */}
        <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-baloo font-black text-xl">CHARACTER ARENA</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 font-nunito text-sm">
            <span className="hidden sm:inline">Use Arrow Keys ◀ ▶ to Select, ENTER to Confirm</span>
            <span className="bg-white/20 px-3 py-1 rounded-full font-bold">{characters.length} Heroes</span>
          </div>
        </div>

        {/* Main content area — portrait left + info right */}
        <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 min-h-[340px]">

          {/* LEFT: Large Character Portrait */}
          <div className="flex-1 relative flex items-center justify-center" ref={portraitRef}>
            <AnimatePresence mode="wait">
              {displayChar ? (
                <motion.div
                  key={displayChar.id}
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="relative w-full max-w-[320px] aspect-square"
                >
                  {/* Glow behind character */}
                  <div className={`absolute inset-4 rounded-3xl bg-gradient-to-br ${displayChar.color} blur-2xl opacity-40`} />

                  {/* Portrait (GIF primary, Image fallback, Initials secondary fallback) */}
                  <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-3 border-white/20 shadow-2xl bg-gray-900/50">
                    {displayChar.gif && gifMode ? (
                      <img
                        src={displayChar.gif}
                        alt={displayChar.name}
                        className="w-full h-full object-cover"
                        onError={() => setGifMode(false)}
                      />
                    ) : displayChar.image && !imgError ? (
                      <img
                        src={displayChar.image}
                        alt={displayChar.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${displayChar.color} flex items-center justify-center`}>
                        <span className="text-white/50 font-baloo font-black text-7xl">{initials}</span>
                      </div>
                    )}
                  </div>

                  {/* Character name overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-4 left-4 z-20"
                  >
                    <h2 className="font-baloo font-black text-4xl md:text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-none tracking-tight uppercase">
                      {displayChar.name}
                    </h2>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-5xl mb-3 opacity-50"
                  >
                    🎮
                  </motion.div>
                  <p className="font-baloo font-bold text-white/40 text-xl">Press ◀ ▶ arrows or Select below</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Character Info Panel */}
          <div className="md:w-[360px] flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {displayChar ? (
                <motion.div
                  key={displayChar.id + '-info'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-3 flex-1"
                >
                  {/* Traits */}
                  <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/10">
                    <p className="text-white/50 font-nunito font-bold text-xs uppercase tracking-widest mb-2">Character Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {displayChar.traits.map((trait, i) => (
                        <motion.div
                          key={trait}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="bg-white/10 text-white font-nunito font-bold text-xs px-3 py-1.5 rounded-full"
                        >
                          {trait}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/10 flex-1">
                    <p className="text-white/50 font-nunito font-bold text-xs uppercase tracking-widest mb-2">Lore</p>
                    <p className="font-nunito text-white/80 text-xs leading-relaxed">
                      {displayChar.description}
                    </p>
                  </div>

                  {/* Combat Stats */}
                  <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/10">
                    <p className="text-white/50 font-nunito font-bold text-xs uppercase tracking-widest mb-2">Combat Stats</p>
                    <div className="space-y-1.5">
                      {Object.entries(displayChar.scores).slice(0, 5).map(([key, val], i) => {
                        const def = traitDefinitions[key]
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-xl w-6 text-center">{def?.emoji}</span>
                            <span className="text-white/70 font-nunito font-bold text-xs w-16 text-right uppercase tracking-wider">{def?.name || key}</span>
                            <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                className={`bg-gradient-to-r ${def?.color || 'from-gray-400 to-gray-500'} h-full rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${val * 10}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                              />
                            </div>
                            <span className="text-white/40 font-mono font-bold text-xs w-5">{val}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Confirm button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleConfirm}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-baloo font-black text-xl py-4 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all flex items-center justify-center gap-3"
                  >
                    <span>SELECT {displayChar.name.toUpperCase()}</span>
                    <span className="text-sm bg-black/20 px-2 py-1 rounded hidden sm:inline">ENTER</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-white/30 font-nunito text-sm">Character info will appear here</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM: Character Thumbnail Grid */}
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="bg-black/30 rounded-2xl p-3 md:p-4 border border-white/5">
            <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center">
              {characters.map((char) => (
                <CharThumb
                  key={char.id}
                  char={char}
                  isSelected={selectedCharacter?.id === char.id}
                  onClick={() => handleSelect(char)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMuteBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setIsMuted(audioSystem.toggleMute())}
            className="fixed bottom-6 right-6 z-50 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full p-4 shadow-2xl border border-white/20 transition-all text-2xl"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? "🔇" : "🔊"}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <ChapterNav currentChapterId="chapter-2-1" />
      </div>
    </div>
  )
}
