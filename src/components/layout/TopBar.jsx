import { useLocation, useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { activityData } from '../../data/activityData'
import { motion } from 'framer-motion'

const BASE = '/activity/skillizee-character'

function getChapterInfo(pathname) {
  for (const mod of activityData.modules) {
    for (const ch of mod.chapters) {
      if (pathname.includes(ch.slug)) {
        return { module: mod, chapter: ch }
      }
    }
  }
  return null
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { progressPercent, completedCount, totalChapters } = useProgress()

  const info = getChapterInfo(location.pathname)

  return (
    <header className="relative z-30 h-[70px] bg-white/70 backdrop-blur-lg border-b border-white/60 shadow-md flex items-center px-4 md:px-6 gap-4">
      {/* Logo / Home */}
      <motion.button
        onClick={() => navigate(BASE)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 flex-shrink-0"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-white text-lg">🌟</span>
        </div>
        <span className="hidden sm:block font-baloo font-bold text-purple-700 text-lg leading-tight">
          Skillizee
        </span>
      </motion.button>

      <div className="w-px h-8 bg-gray-200" />

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        {info ? (
          <div className="flex flex-col">
            <p className="text-xs font-nunito text-gray-500 uppercase tracking-wide leading-none mb-0.5">
              {info.module.emoji} {info.module.title}
            </p>
            <p className="font-baloo font-bold text-gray-800 text-base md:text-lg leading-tight truncate">
              {info.chapter.emoji} {info.chapter.title}
            </p>
          </div>
        ) : (
          <p className="font-baloo font-bold text-gray-800 text-lg">
            🎭 My Favourite Character
          </p>
        )}
      </div>

      {/* Progress pill */}
      <div className="flex-shrink-0 flex items-center gap-3 bg-white/80 rounded-2xl px-4 py-2 shadow-sm border border-white/60">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-baloo font-bold text-purple-700 text-sm leading-none">
            {completedCount}/{totalChapters} done
          </span>
          <span className="text-xs text-gray-500 font-nunito">{progressPercent}%</span>
        </div>
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="4" />
            <motion.circle
              cx="20" cy="20" r="16"
              fill="none"
              stroke="url(#prog)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 16}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - progressPercent / 100) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-baloo font-bold text-purple-700">
            {progressPercent}%
          </span>
        </div>
      </div>
    </header>
  )
}
