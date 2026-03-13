import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mentorQuestions, infographics } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'

// ─── Infographic Modal ─────────────────────────────────────
function InfoModal({ item, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-4xl shadow-2xl max-w-lg w-full p-8 relative"
          style={{ borderRadius: '2rem' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors font-bold text-lg"
          >✕</button>

          <div className="flex items-center gap-4 mb-5">
            <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center text-4xl shadow-xl flex-shrink-0`}>
              {item.emoji}
            </div>
            {item.image && (
              <img src={item.image} alt={item.title} className="w-28 h-28 rounded-full object-contain shadow-md border-4 border-white bg-white/50" />
            )}
            <h2 className="font-baloo font-bold text-3xl text-gray-800">{item.title}</h2>
          </div>
          <p className="font-nunito text-gray-600 text-lg mb-5 leading-relaxed">{item.description}</p>

          <div className="mb-5">
            <p className="font-baloo font-bold text-gray-700 mb-2">✨ Examples:</p>
            <ul className="space-y-1.5">
              {item.examples.map((ex, i) => (
                <li key={i} className="flex items-center gap-2 font-nunito text-gray-600">
                  <span className="text-green-500 font-bold">•</span> {ex}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-baloo font-bold text-gray-700 mb-2">🎬 Characters with this quality:</p>
            <div className="flex flex-wrap gap-2">
              {item.characters.map((ch, i) => (
                <span key={i} className={`bg-gradient-to-r ${item.color} text-white font-nunito font-bold text-sm px-3 py-1.5 rounded-full shadow-sm`}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Mentor Question Card ───────────────────────────────────
function MentorCard({ q, idx }) {
  const [raised, setRaised] = useState(false)
  const [answered, setAnswered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`bg-gradient-to-br ${q.color} p-6 rounded-3xl shadow-lg text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-4 -mb-4" />
      <div className="relative z-10">
        <div className="text-4xl mb-3">{q.emoji}</div>
        <p className="font-baloo font-bold text-xl md:text-2xl leading-snug mb-5">{q.question}</p>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setRaised(r => !r)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-baloo font-bold text-base transition-all
              ${raised ? 'bg-white text-purple-600 shadow-lg' : 'bg-white/30 text-white hover:bg-white/50'}`}
          >
            <span>{raised ? '🙌' : '✋'}</span>
            {raised ? 'Hand Raised!' : 'Raise Hand'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setAnswered(a => !a)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-baloo font-bold text-base transition-all
              ${answered ? 'bg-yellow-300 text-yellow-900 shadow-lg' : 'bg-white/30 text-white hover:bg-white/50'}`}
          >
            <span>{answered ? '⭐' : '💬'}</span>
            {answered ? 'I Answered!' : 'I Want to Answer'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Infographic Card ───────────────────────────────────────
function InfographicCard({ item, onClick, idx }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(item)}
      className={`glass-card p-6 text-left flex flex-col items-center gap-3 hover:shadow-2xl transition-shadow cursor-pointer border-2 ${item.borderColor}`}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
        {item.emoji}
      </div>
      {item.image && (
        <img src={item.image} alt={item.title} className="w-full h-36 object-contain rounded-xl shadow-inner mt-1 mb-1 bg-white/50" />
      )}
      <h3 className="font-baloo font-bold text-gray-800 text-xl">{item.title}</h3>
      <p className="font-nunito text-gray-500 text-sm text-center leading-relaxed line-clamp-2">
        {item.description}
      </p>
      <span className={`text-xs font-nunito font-bold bg-gradient-to-r ${item.color} text-white px-4 py-1.5 rounded-full shadow`}>
        Tap to explore →
      </span>
    </motion.button>
  )
}

// ─── Main Chapter Component ─────────────────────────────────
export default function Chapter11() {
  const [modalItem, setModalItem] = useState(null)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">👋</span>
            <div>
              <p className="text-blue-500 font-nunito font-bold text-sm uppercase tracking-widest">Chapter 1.1</p>
              <h1 className="chapter-title text-gray-800">Introduction</h1>
            </div>
          </div>
          <p className="body-text text-gray-600 ml-[4.5rem]">
            Let's meet some amazing characters! Think about your favourite character and what makes them special. 🌟
          </p>
        </div>
      </motion.div>

      {/* Mentor Questions */}
      <section className="mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="section-title text-gray-800 mb-5 flex items-center gap-3"
        >
          <span className="text-3xl">🤔</span> Think About These…
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mentorQuestions.map((q, idx) => (
            <MentorCard key={q.id} q={q} idx={idx} />
          ))}
        </div>
      </section>

      {/* Infographics */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-3xl">📚</span> Character Qualities
          </h2>
          <p className="body-text text-gray-500 mb-6">
            Tap any card to learn more about each quality!
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {infographics.map((item, idx) => (
            <InfographicCard key={item.id} item={item} onClick={setModalItem} idx={idx} />
          ))}
        </div>
      </section>

      {/* Fun fact strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-5 text-white flex items-center gap-4 mb-8"
      >
        <span className="text-4xl flex-shrink-0">💡</span>
        <div>
          <p className="font-baloo font-bold text-xl">Did you know?</p>
          <p className="font-nunito text-white/90">Every character has at least one of these 5 amazing qualities — and so do YOU! 🌈</p>
        </div>
      </motion.div>

      {/* Chapter Navigation */}
      <ChapterNav currentChapterId="chapter-1-1" />

      {/* Modal */}
      {modalItem && <InfoModal item={modalItem} onClose={() => setModalItem(null)} />}
    </div>
  )
}
