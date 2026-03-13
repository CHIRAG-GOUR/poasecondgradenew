import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ActivityLayout from './components/layout/ActivityLayout'
import ActivityHome from './pages/ActivityHome'
import ModuleLanding from './pages/ModuleLanding'
import Chapter11 from './pages/module1/Chapter11'
import Chapter12 from './pages/module1/Chapter12'
import Chapter13 from './pages/module1/Chapter13'
import Chapter21 from './pages/module2/Chapter21'
import Chapter22 from './pages/module2/Chapter22'
import Chapter23 from './pages/module2/Chapter23'
import WorldBackground from './components/background/WorldBackground'

const BASE = '/activity/skillizee-character'

export default function App() {
  const location = useLocation()

  return (
    <>
      {/* 3D World Background – fixed, behind everything */}
      <WorldBackground />

      {/* Router */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to={BASE} replace />} />
          <Route path={BASE} element={<ActivityLayout />}>
            <Route index element={<ActivityHome />} />
            <Route path="module-1" element={<ModuleLanding moduleId="module-1" />} />
            <Route path="module-1/chapter-1-1" element={<Chapter11 />} />
            <Route path="module-1/chapter-1-2" element={<Chapter12 />} />
            <Route path="module-1/chapter-1-3" element={<Chapter13 />} />
            <Route path="module-2" element={<ModuleLanding moduleId="module-2" />} />
            <Route path="module-2/chapter-2-1" element={<Chapter21 />} />
            <Route path="module-2/chapter-2-2" element={<Chapter22 />} />
            <Route path="module-2/chapter-2-3" element={<Chapter23 />} />
          </Route>
          <Route path="*" element={<Navigate to={BASE} replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
