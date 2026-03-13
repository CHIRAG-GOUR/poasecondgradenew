import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import { quizQuestions, riddleCards } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'
import { useProgress } from '../../context/ProgressContext'

const BASE = '/activity/skillizee-character'

// ─── MCQ Card ──────────────────────────────────────────────
function MCQCard({ q, idx, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (i) => {
    if (selected !== null) return
    setSelected(i)
    onAnswer(i === q.correct)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.12 }}
      className="glass-card p-6"
    >
      <div className="flex items-start gap-4 mb-5">
        <span className="text-4xl flex-shrink-0">{q.emoji}</span>
        <div className="flex-1">
          <span className="text-xs font-nunito font-bold text-purple-500 uppercase tracking-widest">Question {idx + 1}</span>
          <p className="font-baloo font-bold text-gray-800 text-xl mt-1 leading-snug">{q.question}</p>
        </div>
        {q.image && <img src={q.image} alt="character" className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-gray-100 flex-shrink-0" />}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === q.correct
          let cls = 'border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
          if (selected !== null) {
            if (isCorrect) cls = 'border-green-400 bg-green-100 text-green-800'
            else if (isSelected && !isCorrect) cls = 'border-red-400 bg-red-100 text-red-700'
            else cls = 'border-gray-200 bg-gray-50 text-gray-400'
          }
          return (
            <motion.button
              key={i}
              whileHover={{ scale: selected === null ? 1.04 : 1 }}
              whileTap={{ scale: selected === null ? 0.96 : 1 }}
              onClick={() => handleSelect(i)}
              className={`p-3 rounded-2xl font-nunito font-bold text-sm text-left transition-all ${cls}`}
            >
              <span className="mr-2">{['A', 'B', 'C', 'D'][i]}.</span>{opt}
            </motion.button>
          )
        })}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-2xl flex items-center gap-3 ${selected === q.correct ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
        >
          <span className="text-2xl">{selected === q.correct ? '🎉' : '💡'}</span>
          <p className="font-nunito font-bold text-sm">{q.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Riddle Card (flip) ─────────────────────────────────────
function RiddleCard({ riddle, idx }) {
  const [flipped, setFlipped] = useState(false)
  const [hinted, setHinted] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.15 }}
      className="relative h-64 cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 bg-gradient-to-br ${riddle.color} rounded-3xl p-6 flex flex-col justify-between shadow-xl`}
        >
          <div className="text-4xl">{riddle.emoji}</div>
          <div>
            <p className="font-baloo font-bold text-white text-lg leading-snug mb-3">{riddle.riddle}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={(e) => { e.stopPropagation(); setHinted(h => !h) }}
                className="bg-white/30 text-white font-nunito font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-white/50 transition"
              >
                {hinted ? `💡 ${riddle.hint}` : '💡 Get a hint'}
              </button>
              <span className="text-white/70 font-nunito text-xs">Tap to reveal!</span>
            </div>
          </div>
        </div>
        {/* Back */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 bg-white rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl border-4 border-green-400"
        >
          <span className="text-5xl mb-3">{riddle.emoji}</span>
          <p className="font-baloo font-bold text-green-700 text-3xl mb-2">{riddle.answer}</p>
          <p className="font-nunito text-gray-500 text-sm">Tap to go back</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Score Counter ──────────────────────────────────────────
function ScoreCounter({ score, total }) {
  return (
    <div className="flex items-center justify-center gap-4 glass-card px-8 py-4 mb-6 mx-auto w-fit">
      <span className="text-3xl">⭐</span>
      <div className="text-center">
        <p className="font-baloo font-bold text-purple-700 text-3xl">{score} / {total}</p>
        <p className="font-nunito text-gray-500 text-sm">Correct Answers</p>
      </div>
      <span className="text-3xl">🏆</span>
    </div>
  )
}

// ─── Completion Screen ──────────────────────────────────────
function CompletionBanner({ score, total }) {
  const navigate = useNavigate()
  const { markComplete } = useProgress()
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    markComplete('chapter-1-3')
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8"
    >
      <ReactConfetti width={size.w} height={size.h} recycle={false} numberOfPieces={300} />
      <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: 3 }} className="text-8xl mb-6">🎉</motion.div>
      <h2 className="font-baloo font-bold text-5xl text-purple-700 mb-3">Amazing Work!</h2>
      <p className="font-nunito text-gray-700 text-xl mb-2">You scored <strong className="text-green-600">{score}/{total}</strong> on the quiz!</p>
      <p className="font-baloo font-bold text-2xl text-gray-800 mb-8">Great! Now you are ready to choose your character. 🌟</p>
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`${BASE}/module-2/chapter-2-1`)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-baloo font-bold text-2xl px-12 py-5 rounded-3xl shadow-2xl"
      >
        Continue to Module 2 →
      </motion.button>
    </motion.div>
  )
}

// ─── Main Chapter Component ─────────────────────────────────
export default function Chapter13() {
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === quizQuestions.length

  const handleAnswer = (qId, correct) => {
    if (answers[qId] !== undefined) return
    setAnswers(prev => ({ ...prev, [qId]: correct }))
    if (correct) setScore(s => s + 1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {showCompletion && <CompletionBanner score={score} total={quizQuestions.length} />}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-card p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">🧩</span>
            <div>
              <p className="text-orange-500 font-nunito font-bold text-sm uppercase tracking-widest">Chapter 1.3</p>
              <h1 className="chapter-title text-gray-800">Interactive Quiz</h1>
            </div>
          </div>
          <p className="body-text text-gray-600 ml-[4.5rem]">
            Test what you know about character qualities! Answer all questions to unlock Module 2. 🚀
          </p>
        </div>
      </motion.div>

      {/* Score */}
      <ScoreCounter score={score} total={quizQuestions.length} />

      {/* MCQ Section */}
      <section className="mb-10">
        <h2 className="section-title text-gray-800 mb-5 flex items-center gap-3">
          <span>🎯</span> Multiple Choice Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quizQuestions.map((q, idx) => (
            <MCQCard
              key={q.id}
              q={q}
              idx={idx}
              answered={answers[q.id] !== undefined}
              onAnswer={(correct) => handleAnswer(q.id, correct)}
            />
          ))}
        </div>
      </section>

      {/* Riddle Section */}
      <section className="mb-10">
        <h2 className="section-title text-gray-800 mb-2 flex items-center gap-3">
          <span>🎴</span> Riddle Cards
        </h2>
        <p className="font-nunito text-gray-500 mb-5">Tap each card to reveal the answer!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riddleCards.map((r, idx) => <RiddleCard key={r.id} riddle={r} idx={idx} />)}
        </div>
      </section>

      {/* Finish button */}
      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowCompletion(true)}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-baloo font-bold text-2xl px-12 py-5 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
          >
            🎉 See My Results!
          </motion.button>
        </motion.div>
      )}

      <ChapterNav currentChapterId="chapter-1-3" />
    </div>
  )
}
