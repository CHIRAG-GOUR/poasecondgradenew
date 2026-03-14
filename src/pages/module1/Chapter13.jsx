import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { quizQuestions, riddleCards } from '../../data/activityData'
import { useProgress } from '../../context/ProgressContext'
import ChapterNav from '../../components/ui/ChapterNav'

export default function Chapter13() {
  const { markComplete } = useProgress()
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [flippedRiddles, setFlippedRiddles] = useState(new Set())

  const q = quizQuestions[currentQ]

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === q.correct) setScore(s => s + 1)
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(c => c + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setQuizDone(true)
      markComplete('chapter-1-3')
    }
  }

  const toggleRiddle = (id) => {
    setFlippedRiddles(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      {quizDone && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
        />
      )}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-8 text-center">
        <h1 className="chapter-title text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 mb-2">
          Interactive Quiz
        </h1>
        <p className="body-text text-gray-600">Test what you've learned about character qualities!</p>
      </motion.div>

      {!quizDone ? (
        <>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-nunito font-bold text-sm text-gray-500">Question {currentQ + 1}/{quizQuestions.length}</span>
              <span className="font-baloo font-bold text-sm text-purple-600">Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full"
                animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="glass-card p-6 mb-6"
            >
              {q.image && (
                <div className="h-64 rounded-xl overflow-hidden mb-6 bg-white/30 flex items-center justify-center p-2">
                  <img src={q.image} alt="" className="max-w-full max-h-full object-contain drop-shadow-lg" />
                </div>
              )}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{q.emoji}</span>
                <p className="font-baloo font-bold text-xl text-gray-800 leading-snug">{q.question}</p>
              </div>

              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left p-4 rounded-xl font-nunito font-bold text-base border-2 transition-all
                      ${selected === null
                        ? 'bg-white/80 border-gray-200 hover:border-purple-300 cursor-pointer'
                        : idx === q.correct
                          ? 'bg-green-100 border-green-400 text-green-800'
                          : idx === selected
                            ? 'bg-red-100 border-red-400 text-red-800'
                            : 'bg-white/50 border-gray-200 text-gray-400'}
                    `}
                  >
                    <span className="mr-2 text-gray-400">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </motion.button>
                ))}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-xl ${selected === q.correct ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}
                >
                  <p className="font-baloo font-bold text-lg">
                    {selected === q.correct ? 'Correct! 🎉' : 'Not quite! 🤔'}
                  </p>
                  <p className="font-nunito text-sm text-gray-600">{q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-baloo font-bold text-xl px-8 py-3 rounded-2xl shadow-lg"
              >
                {currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz! 🏆'}
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {/* Quiz Complete */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center mb-8"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="font-baloo font-black text-3xl text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="font-baloo font-bold text-xl text-purple-600 mb-4">
              You scored {score}/{quizQuestions.length}!
            </p>
            <p className="font-nunito text-gray-500">Great job learning about character qualities!</p>
          </motion.div>

          {/* Riddle Cards */}
          <div className="mb-8">
            <h2 className="section-title text-gray-800 mb-4">Bonus Riddles!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riddleCards.map((r) => (
                <motion.button
                  key={r.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleRiddle(r.id)}
                  className={`bg-gradient-to-br ${r.color} rounded-2xl p-5 text-white text-left shadow-lg min-h-[160px] flex flex-col`}
                >
                  <span className="text-3xl mb-2">{r.emoji}</span>
                  {!flippedRiddles.has(r.id) ? (
                    <>
                      <p className="font-nunito font-bold text-sm flex-1">{r.riddle}</p>
                      <p className="text-white/70 text-xs mt-2 font-nunito">Tap to reveal answer!</p>
                    </>
                  ) : (
                    <motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}>
                      <p className="font-baloo font-black text-2xl mb-2">{r.answer}</p>
                      <p className="font-nunito text-white/80 text-sm">{r.hint}</p>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}

      <ChapterNav currentChapterId="chapter-1-3" />
    </div>
  )
}
