import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { motion } from 'framer-motion'

const BASE = '/activity/skillizee-character'

export default function ChapterNav({ currentChapterId, onComplete }) {
  const navigate = useNavigate()
  const { getNextChapter, getPrevChapter, isCompleted, markComplete } = useProgress()

  const next = getNextChapter(currentChapterId)
  const prev = getPrevChapter(currentChapterId)
  const done = isCompleted(currentChapterId)

  const handleComplete = () => {
    markComplete(currentChapterId)
    if (onComplete) onComplete()
  }

  const handleNext = () => {
    if (!done) markComplete(currentChapterId)
    if (next) {
      navigate(`${BASE}/${next.moduleSlug}/${next.slug}`)
    }
  }

  const handlePrev = () => {
    if (prev) {
      navigate(`${BASE}/${prev.moduleSlug}/${prev.slug}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/40"
    >
      {/* Previous */}
      <motion.button
        onClick={handlePrev}
        disabled={!prev}
        whileHover={{ scale: prev ? 1.05 : 1 }}
        whileTap={{ scale: prev ? 0.95 : 1 }}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-baloo font-bold text-lg transition-all
          ${prev
            ? 'bg-white/80 text-gray-700 hover:bg-white shadow-md hover:shadow-lg'
            : 'bg-white/30 text-gray-400 cursor-not-allowed'}`}
      >
        <span>←</span>
        <span className="hidden sm:block">{prev ? prev.title : 'Start'}</span>
      </motion.button>

      {/* Mark complete / completed badge */}
      {done ? (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-2xl font-baloo font-bold text-base border border-green-300">
          <span>✅</span> Chapter Complete!
        </div>
      ) : (
        <motion.button
          onClick={handleComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl font-baloo font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          ✓ Mark Complete
        </motion.button>
      )}

      {/* Next */}
      <motion.button
        onClick={handleNext}
        disabled={!next}
        whileHover={{ scale: next ? 1.05 : 1 }}
        whileTap={{ scale: next ? 0.95 : 1 }}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-baloo font-bold text-lg transition-all
          ${next
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-xl'
            : 'bg-white/30 text-gray-400 cursor-not-allowed'}`}
      >
        <span className="hidden sm:block">{next ? next.title : 'Done!'}</span>
        <span>→</span>
      </motion.button>
    </motion.div>
  )
}
