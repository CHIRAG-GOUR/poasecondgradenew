import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { personalityQuestions } from '../../data/activityData'
import { useCharacter } from '../../context/CharacterContext'
import ChapterNav from '../../components/ui/ChapterNav'
import { generateCharacterQuestions } from '../../utils/ai'

const BASE = '/activity/skillizee-character'

// ─── Single Option Button ───────────────────────────────────
function OptionButton({ option, isSelected, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.04, x: 6 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`w-full text-left p-4 md:p-5 rounded-2xl border-3 transition-all duration-200 flex items-center gap-4
        ${isSelected
          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-lg ring-2 ring-purple-300'
          : 'bg-white/80 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 shadow-md hover:shadow-lg'
        }`}
    >
      <span className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${isSelected ? 'from-purple-500 to-pink-500' : 'from-gray-300 to-gray-400'} rounded-full flex items-center justify-center text-white font-baloo font-bold text-lg flex-shrink-0 transition-all duration-200 ${isSelected ? 'scale-110' : ''}`}>
        {String.fromCharCode(65 + index)}
      </span>
      <span className={`font-nunito font-bold text-base md:text-lg leading-snug ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
        {option?.text || "Unknown Option"}
      </span>
      {isSelected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-2xl flex-shrink-0"
        >
          ✅
        </motion.span>
      )}
    </motion.button>
  )
}

// ─── Question Slide ─────────────────────────────────────────
function QuestionSlide({ question, selectedOptions, onSelect, questionNumber, totalQuestions }) {
  const isMulti = question.type === 'multi'
  const maxSelect = question.maxSelect || 1

  const handleOptionClick = (option, idx) => {
    const optId = option.id !== undefined ? option.id : idx
    if (isMulti) {
      // Toggle for multi-select
      const current = selectedOptions || []
      if (current.includes(optId)) {
        onSelect(current.filter(id => id !== optId))
      } else if (current.length < maxSelect) {
        onSelect([...current, optId])
      }
    } else {
      onSelect([optId])
    }
  }

  const isOptionSelected = (optId) => {
    return (selectedOptions || []).includes(optId)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Question header */}
      <div className="glass-card p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-100 text-purple-600 font-nunito font-bold text-xs px-3 py-1 rounded-full">
              Question {questionNumber} of {totalQuestions}
            </span>
            {isMulti && (
              <span className="bg-blue-100 text-blue-600 font-nunito font-bold text-xs px-3 py-1 rounded-full">
                Pick up to {maxSelect}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-baloo font-bold text-xl flex-shrink-0">
              Q{questionNumber}
            </div>
            <h2 className="font-baloo font-bold text-2xl md:text-3xl text-gray-800 leading-tight">
              {question.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {(question?.options || []).map((opt, i) => {
          if (!opt) return null;
          return (
            <OptionButton
              key={opt?.id || i}
              option={opt}
              index={i}
              isSelected={isOptionSelected(opt?.id || i)}
              onClick={() => handleOptionClick(opt, i)}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────────
export default function PersonalityQuestions() {
  const navigate = useNavigate()
  const { selectedCharacter, recordAnswer, dynamicQuestions, setDynamicQuestions } = useCharacter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [localAnswers, setLocalAnswers] = useState({}) // { questionId: [optionIds] }
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchQuestions() {
      if (!selectedCharacter || dynamicQuestions) return;
      setIsGenerating(true);
      setError(null);
      const generated = await generateCharacterQuestions(selectedCharacter);
      if (generated && Array.isArray(generated) && generated.length > 0) {
        setDynamicQuestions(generated);
      } else {
        setError("Failed to generate questions. Falling back to default.");
        setDynamicQuestions(personalityQuestions); // Fallback to static
      }
      setIsGenerating(false);
    }
    fetchQuestions();
  }, [selectedCharacter, dynamicQuestions, setDynamicQuestions]);

  const questions = (dynamicQuestions && dynamicQuestions.length > 0) ? dynamicQuestions : personalityQuestions
  const currentQ = questions[currentIndex] || questions[0]
  const isLast = currentIndex >= questions.length - 1
  const isFirst = currentIndex === 0
  const progress = ((currentIndex + 1) / Math.max(questions.length, 1)) * 100

  // Check if current question has an answer
  const currentAnswer = localAnswers[currentQ?.id] || []
  const hasAnswer = currentAnswer.length > 0

  const handleSelect = (optionIds) => {
    setLocalAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIds,
    }))

    // Calculate combined traits for the selected options
    const selectedOpts = (currentQ.options || []).filter((o, i) => {
      const oid = o.id !== undefined ? o.id : i
      return optionIds.includes(oid)
    })
    const combinedTraits = {}
    selectedOpts.forEach(opt => {
      if (opt.traits) {
        Object.entries(opt.traits).forEach(([key, val]) => {
          combinedTraits[key] = (combinedTraits[key] || 0) + val
        })
      }
    })
    recordAnswer(currentQ.id || currentIndex, optionIds, combinedTraits)
  }

  const handleNext = () => {
    if (!hasAnswer) return
    if (isLast) {
      navigate(`${BASE}/module-2/chapter-2-3`)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) setCurrentIndex(i => i - 1)
  }

  if (isGenerating || !dynamicQuestions) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="text-6xl mb-6 inline-block">
          ✨
        </motion.div>
        <h2 className="font-baloo font-bold text-3xl text-purple-600 mb-4">Summoning your Quest...</h2>
        <p className="font-nunito text-gray-500 text-lg">
          Our magic AI is writing {selectedCharacter?.name}'s secret questions just for you!
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with selected character reminder */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="glass-card p-5 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-4xl"
            >
              🧠
            </motion.span>
            <div className="flex-1">
              <p className="text-blue-500 font-nunito font-bold text-sm uppercase tracking-widest">Personality Questions</p>
              <h1 className="font-baloo font-bold text-2xl md:text-3xl text-gray-800">Discover Who You Are!</h1>
            </div>
            {/* Selected character badge */}
            {selectedCharacter && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-2 bg-gradient-to-r ${selectedCharacter.color} text-white px-3 py-1.5 rounded-2xl shadow-lg`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/30">
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none' }} />
                </div>
                <span className="font-baloo font-bold text-sm hidden sm:block">{selectedCharacter.name}</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-nunito font-bold text-sm text-gray-500">Progress</span>
          <span className="font-baloo font-bold text-sm text-purple-600">{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
        <div className="flex justify-between mt-2 px-1">
          {questions.map((q, i) => (
            <motion.div
              key={q?.id || i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i < currentIndex ? 'bg-green-400' :
                i === currentIndex ? 'bg-purple-500 ring-2 ring-purple-300' :
                'bg-gray-300'
              }`}
              animate={i === currentIndex ? { scale: [1, 1.4, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {currentQ && (
          <QuestionSlide
            key={currentQ.id || currentIndex}
            question={currentQ}
            selectedOptions={currentAnswer}
            onSelect={handleSelect}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mt-8 mb-8"
      >
        <motion.button
          whileHover={{ scale: isFirst ? 1 : 1.05 }}
          whileTap={{ scale: isFirst ? 1 : 0.95 }}
          onClick={handlePrev}
          disabled={isFirst}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-baloo font-bold text-lg transition-all
            ${isFirst
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white/80 text-gray-700 hover:bg-white shadow-md hover:shadow-lg'}`}
        >
          ← Back
        </motion.button>

        <motion.button
          whileHover={{ scale: hasAnswer ? 1.05 : 1 }}
          whileTap={{ scale: hasAnswer ? 0.95 : 1 }}
          onClick={handleNext}
          disabled={!hasAnswer}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-baloo font-bold text-lg transition-all
            ${hasAnswer
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {isLast ? '🏆 See My Results!' : 'Next →'}
        </motion.button>
      </motion.div>

      <ChapterNav currentChapterId="chapter-2-2" />
    </div>
  )
}
