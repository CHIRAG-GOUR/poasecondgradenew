import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mentorQuestions, infographics } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'

export default function Chapter11() {
  const [activeCard, setActiveCard] = useState(null)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 mb-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="chapter-title text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Meet Your Characters!
          </h1>
          <p className="body-text text-gray-600">
            Every favourite character has special qualities. Let's discover what makes them amazing!
          </p>
        </div>
      </motion.div>

      {/* Mentor Questions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="section-title text-gray-800 mb-4">Think About This...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentorQuestions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className={`bg-gradient-to-r ${q.color} rounded-2xl p-5 text-white shadow-lg cursor-default`}
            >
              <span className="text-3xl mb-2 block">{q.emoji}</span>
              <p className="font-nunito font-bold text-lg leading-snug">{q.question}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Infographic Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="section-title text-gray-800 mb-4">Character Qualities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {infographics.map((ig, i) => (
            <motion.button
              key={ig.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCard(activeCard === ig.id ? null : ig.id)}
              className={`text-left rounded-2xl overflow-hidden shadow-lg ${ig.bgColor} border-2 ${ig.borderColor} transition-all`}
            >
              {ig.image && (
                <div className="h-40 overflow-hidden bg-white/50 flex items-center justify-center p-2">
                  <img src={ig.image} alt={ig.title} className="max-w-full max-h-full object-contain drop-shadow-md" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{ig.emoji}</span>
                  <h3 className="font-baloo font-bold text-xl text-gray-800">{ig.title}</h3>
                </div>
                <p className="font-nunito text-gray-600 text-sm mb-2">{ig.description}</p>

                <AnimatePresence>
                  {activeCard === ig.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-nunito font-bold text-sm text-gray-700 mb-1 mt-2">Examples:</p>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 font-nunito">
                        {ig.examples.map((ex, j) => (
                          <li key={j}>{ex}</li>
                        ))}
                      </ul>
                      <p className="mt-2 font-nunito text-sm text-purple-600 font-bold">
                        Character: {ig.characters.join(', ')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <ChapterNav currentChapterId="chapter-1-1" />
    </div>
  )
}
