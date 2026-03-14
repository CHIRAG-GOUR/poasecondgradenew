import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ActivityLayout from './components/layout/ActivityLayout'
import ActivityHome from './pages/ActivityHome'
import ModuleLanding from './pages/ModuleLanding'

// Module 1 – Activity Discovery
import Chapter11 from './pages/module1/Chapter11'
import Chapter12 from './pages/module1/Chapter12'
import Chapter13 from './pages/module1/Chapter13'

// Module 2 – Character Quest
import StudentInfo from './pages/chapters/StudentInfo'
import CharacterArena from './pages/chapters/CharacterArena'
import PersonalityQuestions from './pages/chapters/PersonalityQuestions'
import CharacterReport from './pages/chapters/CharacterReport'

import WorldBackground from './components/background/WorldBackground'

const BASE = '/activity/skillizee-character'

export default function App() {
  const location = useLocation()

  return (
    <>
      <WorldBackground />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to={BASE} replace />} />
          <Route path={BASE} element={<ActivityLayout />}>
            <Route index element={<ActivityHome />} />

            {/* Module 1 – Activity Discovery */}
            <Route path="module-1" element={<ModuleLanding moduleId="module-1" />} />
            <Route path="module-1/chapter-1-1" element={<Chapter11 />} />
            <Route path="module-1/chapter-1-2" element={<Chapter12 />} />
            <Route path="module-1/chapter-1-3" element={<Chapter13 />} />

            {/* Module 2 – Character Quest */}
            <Route path="module-2" element={<ModuleLanding moduleId="module-2" />} />
            <Route path="module-2/intro" element={<StudentInfo />} />
            <Route path="module-2/chapter-2-1" element={<CharacterArena />} />
            <Route path="module-2/chapter-2-2" element={<PersonalityQuestions />} />
            <Route path="module-2/chapter-2-3" element={<CharacterReport />} />
          </Route>
          <Route path="*" element={<Navigate to={BASE} replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
