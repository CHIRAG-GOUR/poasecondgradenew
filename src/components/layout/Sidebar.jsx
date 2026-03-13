import { useNavigate, useLocation } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { activityData } from '../../data/activityData'
import { motion } from 'framer-motion'

const BASE = '/activity/skillizee-character'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isCompleted, progressPercent, completedCount, totalChapters } = useProgress()

  return (
    <aside className="hidden md:flex flex-col w-72 h-full bg-white/70 backdrop-blur-lg border-r border-white/60 shadow-xl z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-5 bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌟</span>
          <div>
            <p className="font-baloo font-bold text-white text-sm leading-tight">My Favourite</p>
            <p className="font-baloo font-bold text-white text-sm leading-tight">Character</p>
          </div>
        </div>
        {/* Progress ring/bar */}
        <div className="bg-white/20 rounded-2xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/90 text-xs font-nunito font-bold">Overall Progress</span>
            <span className="text-white font-baloo font-bold text-sm">{completedCount}/{totalChapters}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <motion.div
              className="bg-white rounded-full h-3"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="text-white/80 text-xs mt-1 text-right font-nunito">{progressPercent}% complete</p>
        </div>
      </div>

      {/* Module list */}
      <nav className="flex-1 p-4 space-y-4">
        {activityData.modules.map((mod) => {
          const modPath = `${BASE}/${mod.slug}`
          const isModActive = location.pathname.startsWith(modPath)

          return (
            <div key={mod.id}>
              {/* Module header */}
              <button
                onClick={() => navigate(modPath)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-baloo font-bold text-sm transition-all duration-200
                  ${isModActive
                    ? 'bg-gradient-to-r ' + mod.color + ' text-white shadow-lg scale-[1.02]'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90 hover:scale-[1.01]'}
                `}
              >
                <span className="text-xl">{mod.emoji}</span>
                <span className="text-left">{mod.title}</span>
              </button>

              {/* Chapter list */}
              <div className="mt-2 ml-3 space-y-1">
                {mod.chapters.map((ch) => {
                  const chPath = `${modPath}/${ch.slug}`
                  const isActive = location.pathname === chPath
                  const done = isCompleted(ch.id)

                  return (
                    <motion.button
                      key={ch.id}
                      onClick={() => navigate(chPath)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-nunito font-semibold transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                          : done
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-white/50 text-gray-600 hover:bg-white/80'}
                      `}
                    >
                      {/* Status icon */}
                      <span className="text-base flex-shrink-0">
                        {done ? '✅' : isActive ? '▶️' : ch.emoji}
                      </span>
                      <span className="text-left leading-tight">{ch.title}</span>
                      {done && !isActive && (
                        <span className="ml-auto text-green-500 text-xs font-bold">✓</span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/40">
        <div className="text-center text-xs text-gray-500 font-nunito">
          <p>🎓 Skillizee — Grade 2-3</p>
          <p className="text-purple-500 font-bold mt-0.5">Power of Art</p>
        </div>
      </div>
    </aside>
  )
}
