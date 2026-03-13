import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { activityData } from '../data/activityData'
import { useProgress } from '../context/ProgressContext'

const BASE = '/activity/skillizee-character'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const card = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

export default function ActivityHome() {
  const navigate = useNavigate()
  const { progressPercent, completedCount, totalChapters } = useProgress()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 mb-8 text-center overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-pink-100/60 pointer-events-none" />
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl mb-4 inline-block"
          >
            🎭
          </motion.div>
          <h1 className="chapter-title text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
            My Favourite Character
          </h1>
          <p className="body-text text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore amazing characters, discover your favourite, and share what makes them special! 
            A fun activity for curious Grade 2-3 learners. 🌟
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['🦁 Bravery', '💖 Kindness', '🧠 Intelligence', '😂 Humor', '🎨 Creativity'].map(tag => (
              <span key={tag} className="bg-white/80 text-purple-700 font-nunito font-bold px-4 py-2 rounded-full text-sm border border-purple-200 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          {progressPercent > 0 && (
            <div className="bg-white/60 rounded-2xl px-6 py-3 inline-flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-baloo font-bold text-purple-700 text-sm">{completedCount}/{totalChapters} chapters done — keep going!</p>
                <div className="w-48 bg-gray-200 rounded-full h-2.5 mt-1">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Module cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        {activityData.modules.map((mod) => (
          <motion.div key={mod.id} variants={card}>
            <motion.button
              onClick={() => navigate(`${BASE}/${mod.slug}`)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="w-full glass-card p-6 text-left hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-10 pointer-events-none`} />
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${mod.color} rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                  {mod.emoji}
                </div>
                <h2 className="section-title text-gray-800 mb-1">{mod.title}</h2>
                <p className="text-gray-500 font-nunito text-sm mb-4">{mod.chapters.length} chapters to explore</p>
                <div className="space-y-2">
                  {mod.chapters.map((ch) => (
                    <div key={ch.id} className="flex items-center gap-2 text-sm font-nunito text-gray-600">
                      <span>{ch.emoji}</span>
                      <span>{ch.title}</span>
                      <span className="text-gray-400">— {ch.subtitle}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 bg-gradient-to-r ${mod.color} text-white font-baloo font-bold text-sm px-5 py-2.5 rounded-xl shadow-md`}>
                  Start Module {mod.emoji}
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Fun footer tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-500 font-nunito text-sm">
          💡 Tip: Use the sidebar to jump to any chapter anytime!
        </p>
      </motion.div>
    </div>
  )
}
