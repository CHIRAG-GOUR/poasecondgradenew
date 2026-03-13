import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { activityData } from '../data/activityData'

const BASE = '/activity/skillizee-character'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }

export default function ModuleLanding({ moduleId }) {
  const navigate = useNavigate()
  const mod = activityData.modules.find(m => m.id === moduleId)
  if (!mod) return null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Module hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-8 relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-10`} />
        <div className="relative z-10 flex items-center gap-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${mod.color} rounded-3xl flex items-center justify-center text-4xl shadow-xl flex-shrink-0`}>
            {mod.emoji}
          </div>
          <div>
            <p className="text-gray-500 font-nunito text-sm uppercase tracking-widest mb-1">Module</p>
            <h1 className="chapter-title text-gray-800">{mod.title}</h1>
            <p className="text-gray-600 font-nunito mt-1">{mod.chapters.length} chapters · Click any chapter to start!</p>
          </div>
        </div>
      </motion.div>

      {/* Chapter cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {mod.chapters.map((ch, idx) => (
          <motion.div key={ch.id} variants={item}>
            <motion.button
              onClick={() => navigate(`${BASE}/${mod.slug}/${ch.slug}`)}
              whileHover={{ scale: 1.02, x: 8 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-card p-5 text-left hover:shadow-xl transition-shadow flex items-center gap-5"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${mod.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                {ch.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gray-100 text-gray-500 font-nunito font-bold text-xs px-2 py-0.5 rounded-lg">
                    {idx + 1} of {mod.chapters.length}
                  </span>
                </div>
                <h3 className="font-baloo font-bold text-gray-800 text-xl">{ch.title}</h3>
                <p className="text-gray-500 font-nunito text-sm">{ch.subtitle}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${mod.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                →
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center"
      >
        <motion.button
          onClick={() => navigate(`${BASE}/${mod.slug}/${mod.chapters[0].slug}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-r ${mod.color} text-white font-baloo font-bold text-xl px-10 py-4 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow`}
        >
          {mod.emoji} Start {mod.title}!
        </motion.button>
      </motion.div>
    </div>
  )
}
