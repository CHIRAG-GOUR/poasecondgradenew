import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { activityData, characters } from '../data/activityData'
import { useProgress } from '../context/ProgressContext'

const BASE = '/activity/skillizee-character'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
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
          <h1 className="chapter-title text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
            My Favourite Character
          </h1>
          <p className="body-text text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover amazing character qualities, choose your favourite hero, and find out which character YOU are most like!
          </p>

          {/* Character preview row */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {characters.slice(0, 8).map((char, i) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-white/60"
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.classList.add('bg-gradient-to-br', ...char.color.split(' '))
                    e.target.parentElement.innerHTML = `<span class="text-white font-baloo font-bold text-sm flex items-center justify-center h-full">${char.name.slice(0,2)}</span>`
                  }}
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-baloo font-bold text-gray-500 shadow-md border-2 border-white/60"
            >
              +{characters.length - 8}
            </motion.div>
          </div>

          {progressPercent > 0 && (
            <div className="bg-white/60 rounded-2xl px-6 py-3 inline-flex items-center gap-3">
              <div>
                <p className="font-baloo font-bold text-purple-700 text-sm">{completedCount}/{totalChapters} chapters done</p>
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
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
                <div className={`w-14 h-14 bg-gradient-to-br ${mod.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {mod.emoji}
                </div>
                <h2 className="section-title text-gray-800 mb-1">{mod.title}</h2>
                <p className="text-gray-500 font-nunito text-sm mb-4">{mod.chapters.length} chapters</p>
                <div className="space-y-1.5">
                  {mod.chapters.map((ch) => (
                    <div key={ch.id} className="flex items-center gap-2 text-sm font-nunito text-gray-600">
                      <span className="text-base">{ch.emoji}</span>
                      <span>{ch.title}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 bg-gradient-to-r ${mod.color} text-white font-baloo font-bold text-sm px-5 py-2.5 rounded-xl shadow-md`}>
                  Start {mod.title}
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
