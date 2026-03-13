import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { presentationPrompts, peerQuestions } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'

// ─── 60-Second Countdown Timer ──────────────────────────────
function PresentationTimer() {
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => { setIsActive(false); setTimeLeft(60) }

  const min = Math.floor(timeLeft / 60)
  const sec = timeLeft % 60
  const isDanger = timeLeft <= 15
  const isDone = timeLeft === 0

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <p className="font-baloo font-bold text-gray-700 text-lg mb-2 flex items-center gap-2">
        <span>⏱️</span> Practice Presentation Timer
      </p>
      <div className={`text-6xl font-baloo font-black tabular-nums transition-colors duration-300 mb-4 ${isDone ? 'text-red-500' : isDanger ? 'text-orange-500' : 'text-purple-600'}`}>
        {min}:{sec.toString().padStart(2, '0')}
      </div>
      <div className="flex gap-3">
        {isDone ? (
          <button onClick={resetTimer} className="bg-gray-200 text-gray-700 font-baloo text-base px-6 py-2 rounded-xl hover:bg-gray-300">
            Reset Timer
          </button>
        ) : (
          <>
            <button
              onClick={toggleTimer}
              className={`font-baloo font-bold text-base px-6 py-2 rounded-xl transition-all text-white shadow-md ${isActive ? 'bg-orange-400 hover:bg-orange-500' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isActive ? '⏸️ Pause' : '▶️ Start'}
            </button>
            <button onClick={resetTimer} className="bg-gray-200 text-gray-700 font-baloo text-base px-6 py-2 rounded-xl hover:bg-gray-300">
              Reset
            </button>
          </>
        )}
      </div>
      {isDone && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 font-baloo text-red-500 font-bold text-lg">
          ⏰ Time's up! Great job!
        </motion.p>
      )}
    </div>
  )
}

// ─── Main Chapter Component ─────────────────────────────────
export default function Chapter22() {
  const [browniePoints, setBrowniePoints] = useState(0)

  // Track which peer questions were asked so we don't double count
  const [askedQuestions, setAskedQuestions] = useState(new Set())

  const handleAskQuestion = (qId) => {
    if (askedQuestions.has(qId)) return
    
    // Add point and mark as asked
    setAskedQuestions(prev => new Set([...prev, qId]))
    setBrowniePoints(p => Math.min(p + 1, 5))
  }

  const progressPercent = (browniePoints / 5) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">🗣️</span>
            <div>
              <p className="text-blue-500 font-nunito font-bold text-sm uppercase tracking-widest">Chapter 2.2</p>
              <h1 className="chapter-title text-gray-800">Discussion Time</h1>
            </div>
          </div>
          <p className="body-text text-gray-600 ml-[4.5rem]">
            Get ready to present your character to the class! Use the points below to help you.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-6 mb-8">
        {/* Left: Presentation Prep */}
        <div className="md:col-span-3 space-y-6">
          <section>
            <h2 className="section-title text-gray-800 mb-4 flex items-center gap-2"><span>📝</span> What to Share</h2>
            <div className="space-y-3">
              {presentationPrompts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${p.color}`}
                >
                  <span className="text-3xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                    {p.emoji}
                  </span>
                  <p className="font-nunito font-bold text-gray-800 text-lg leading-tight">{p.prompt}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <PresentationTimer />
        </div>

        {/* Right: Peer Interaction & Brownie Points */}
        <div className="md:col-span-2 space-y-6">
          <section className="glass-card p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 text-center">
            <h2 className="font-baloo font-bold text-gray-800 text-xl mb-1 flex justify-center items-center gap-2">
              <span>🍪</span> Brownie Points
            </h2>
            <p className="font-nunito text-xs text-gray-500 mb-4">Ask your friends questions to earn points!</p>
            
            <div className="relative w-32 h-32 mx-auto mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#FEF3C7" strokeWidth="12" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#F59E0B" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progressPercent / 100) }}
                  transition={{ type: 'spring', bounce: 0, duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-baloo font-black text-4xl text-yellow-600 leading-none">{browniePoints}</span>
                <span className="font-nunito text-xs text-yellow-600 font-bold">/ 5 pts</span>
              </div>
            </div>

            {browniePoints === 5 ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-yellow-100 text-yellow-800 text-sm font-baloo font-bold py-2 rounded-xl">
                🏆 Legend! You reached 5 pts!
              </motion.div>
            ) : (
              <p className="text-xs font-nunito text-yellow-700 font-bold">{5 - browniePoints} more to go!</p>
            )}
          </section>

          <section>
            <h3 className="font-baloo font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Ask a friend:</h3>
            <div className="space-y-2">
              {peerQuestions.map(pq => {
                const asked = askedQuestions.has(pq.id)
                return (
                  <button
                    key={pq.id}
                    onClick={() => handleAskQuestion(pq.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3
                      ${asked ? 'bg-green-50 border-green-200 cursor-default' : 'bg-white border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 shadow-sm cursor-pointer hover:shadow-md'}`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{asked ? '✅' : pq.emoji}</span>
                    <span className={`font-nunito text-sm font-bold leading-tight ${asked ? 'text-green-700' : 'text-gray-700'}`}>
                      {pq.question}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

        </div>
      </div>

      <ChapterNav currentChapterId="chapter-2-2" />
    </div>
  )
}
