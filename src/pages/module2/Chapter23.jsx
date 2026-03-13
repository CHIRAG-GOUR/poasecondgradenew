import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import { reflectionCards } from '../../data/activityData'
import { useProgress } from '../../context/ProgressContext'

const BASE = '/activity/skillizee-character'

// ─── Reflection Card ────────────────────────────────────────
function ReflectionCard({ card, idx }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      className="relative h-48 cursor-pointer w-full group"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full shadow-lg rounded-3xl"
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-3xl p-5 flex flex-col justify-between items-center text-white text-center border overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-4 -mt-4 pointer-events-none" />
          {card.image ? (
            <img src={card.image} alt={card.title} className="h-20 w-20 rounded-full object-contain shadow-md border-4 border-white/50 mt-2 bg-white/50" />
          ) : (
            <span className="text-5xl mt-2">{card.emoji}</span>
          )}
          <h3 className="font-baloo font-bold text-xl leading-tight">{card.title}</h3>
          <p className="font-nunito text-xs text-white/80 uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full">Tap to read</p>
        </div>
        {/* Back */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className={`absolute inset-0 bg-white border-2 border-gray-100 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-inner`}
        >
          <p className="font-nunito text-gray-600 text-sm leading-relaxed mb-3">{card.desc}</p>
          <div className={`bg-gradient-to-r ${card.color} text-transparent bg-clip-text font-baloo font-bold text-base leading-tight`}>
            {card.insight}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Completion Banner ──────────────────────────────────────
function FinalCompletionBanner() {
  const navigate = useNavigate()
  const { markComplete } = useProgress()
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    markComplete('chapter-2-3')
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-8 overflow-y-auto"
    >
      <ReactConfetti width={size.w} height={size.h} recycle={true} numberOfPieces={400} />
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className="max-w-2xl w-full bg-gradient-to-br from-purple-100 to-pink-100 p-8 md:p-12 rounded-[3rem] shadow-2xl relative"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl text-6xl">
          🎓
        </div>
        
        <h2 className="font-baloo font-black text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-6 mb-4">
          Activity Complete!
        </h2>
        
        <p className="font-nunito text-gray-700 text-xl mb-8 leading-relaxed">
          You are a superstar! 🌟 You discovered your favourite character, created amazing art, and shared your brilliant thoughts with the class.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="bg-white text-purple-600 font-baloo font-bold text-xl px-8 py-4 rounded-2xl shadow-md border-2 border-purple-100"
          >
            ← Back to Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(BASE)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-baloo font-bold text-xl px-8 py-4 rounded-2xl shadow-xl"
          >
            🏠 Return Home
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Chapter Component ─────────────────────────────────
export default function Chapter23() {
  const [reflection, setReflection] = useState('')
  const [showCompletion, setShowCompletion] = useState(false)

  const handleComplete = () => {
    if (!reflection.trim()) return alert('Please write a quick reflection before completing!')
    setShowCompletion(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {showCompletion && <FinalCompletionBanner />}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="glass-card p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">⭐</span>
            <div>
              <p className="text-red-500 font-nunito font-bold text-sm uppercase tracking-widest">Chapter 2.3</p>
              <h1 className="chapter-title text-gray-800">Key Takeaways</h1>
            </div>
          </div>
          <p className="body-text text-gray-600 ml-[4.5rem]">
            You've done an amazing job! Let's reflect on what you learned today. 🧠
          </p>
        </div>
      </motion.div>

      {/* Reflection Cards */}
      <section className="mb-10">
        <h2 className="section-title text-gray-800 mb-2 flex items-center gap-3">
          <span>🎯</span> What did we learn?
        </h2>
        <p className="font-nunito text-gray-500 mb-6">Tap each card to flip it over and read about the skills you practiced!</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reflectionCards.map((card, idx) => (
            <ReflectionCard key={card.id} card={card} idx={idx} />
          ))}
        </div>
      </section>

      {/* Final Input Form */}
      <section className="mb-10">
        <div className="glass-card p-8 border-2 border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 opacity-50 rounded-bl-full pointer-events-none" />
          
          <h2 className="font-baloo font-bold text-2xl text-gray-800 mb-4 relative z-10 flex items-center gap-2">
            <span>✍️</span> Your Final Thought
          </h2>
          <label className="font-nunito font-bold text-gray-600 text-lg block mb-3 relative z-10">
            What is ONE quality from your character that you will try to use tomorrow?
          </label>
          <textarea
            rows={3}
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="I will try to be brave like..."
            className="w-full bg-white/80 border-2 border-purple-200 focus:border-purple-400 rounded-2xl px-5 py-4 font-nunito text-gray-700 text-lg resize-none focus:outline-none transition-all shadow-inner relative z-10"
          />
        </div>
      </section>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-baloo font-black text-3xl px-16 py-6 rounded-[2rem] shadow-2xl hover:shadow-3xl transition-all border-4 border-white/20"
        >
          🎉 Complete Activity!
        </motion.button>
      </motion.div>
    </div>
  )
}
