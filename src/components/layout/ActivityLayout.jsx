import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.25 } },
}

export default function ActivityLayout() {
  const location = useLocation()

  return (
    <div className="relative z-10 flex flex-col h-screen w-screen overflow-hidden">
      {/* Frosted glass overlay so 3D bg is softened */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-none z-0" />

      {/* Top bar */}
      <TopBar />

      {/* Body: sidebar + main */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full p-4 md:p-8 pb-24"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
