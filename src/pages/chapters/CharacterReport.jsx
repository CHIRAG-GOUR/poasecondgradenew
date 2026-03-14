import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ReactConfetti from 'react-confetti'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { traitDefinitions, personalityQuestions } from '../../data/activityData'
import { useCharacter } from '../../context/CharacterContext'
import { useProgress } from '../../context/ProgressContext'
import { generateDynamicReport } from '../../utils/ai'

const BASE = '/activity/skillizee-character'

// ─── Animated Counter ───────────────────────────────────────
function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.round(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span ref={ref}>{count}%</span>
}

// ─── Circular Progress Ring ─────────────────────────────────
function ProgressRing({ percent, color, image, name, size = 180 }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#gradient)"
          strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-purple-200 shadow-md mb-1 bg-white flex items-center justify-center">
          <img src={image} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none' }} />
        </div>
        <span className="font-baloo font-black text-3xl text-purple-600">
          <AnimatedCounter target={percent} />
        </span>
      </div>
    </div>
  )
}

// ─── Trait Match Row ────────────────────────────────────────
function TraitRow({ traitKey, score, maxScore, delay }) {
  const def = traitDefinitions[traitKey]
  if (!def) return null
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-center gap-3">
      <span className="text-2xl w-8 text-center">{def.emoji}</span>
      <span className="font-nunito font-bold text-gray-700 w-24 text-xs uppercase tracking-wider">{def.name}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`bg-gradient-to-r ${def.color} h-full rounded-full`}
          initial={{ width: 0 }} animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
        />
      </div>
      <span className="font-baloo font-bold text-gray-500 text-sm w-10 text-right">{percent}%</span>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────────
export default function CharacterReport() {
  const navigate = useNavigate()
  const { studentInfo, selectedCharacter, similarityPercent, answers, dynamicQuestions, dynamicReport, setDynamicReport, reset } = useCharacter()
  const { markComplete } = useProgress()
  const [showConfetti, setShowConfetti] = useState(false)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const reportRef = useRef(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    markComplete('chapter-2-3')
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)

    let confettiTimer;
    async function fetchReport() {
      if (!selectedCharacter || !studentInfo || dynamicReport) {
        if (dynamicReport) setShowConfetti(true);
        return;
      }
      
      setIsGenerating(true)
      
      // Map user answers for context
      const userQuestions = dynamicQuestions || personalityQuestions;
      const history = userQuestions.map(q => {
        const userAns = answers[q.id]
        if (!userAns) return null
        const opt = q.options.find(o => userAns.optionIds.includes(o.id))
        return { question: q.question, answer: opt?.text }
      }).filter(Boolean)

      const rep = await generateDynamicReport(studentInfo, selectedCharacter, history)
      if (rep) {
        setDynamicReport(rep)
        setShowConfetti(true)
        confettiTimer = setTimeout(() => setShowConfetti(false), 8000)
      }
      setIsGenerating(false)
    }
    
    fetchReport()

    return () => {
      window.removeEventListener('resize', handler)
      if (confettiTimer) clearTimeout(confettiTimer)
    }
  }, [studentInfo, selectedCharacter, answers, dynamicQuestions, dynamicReport, setDynamicReport])

  const handleTryAgain = () => {
    reset()
    navigate(`${BASE}/module-2/chapter-2-1`)
  }

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return
    setIsGeneratingPDF(true)
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F3F4F6' // Match bg-gray-100
      })
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('My-Character-Report.pdf')
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      alert("Oops! Couldn't generate the PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {showConfetti && !isGeneratingPDF && (
        <ReactConfetti width={size.w} height={size.h} recycle={false} numberOfPieces={400} style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }} />
      )}

      {/* Main Report Container (For PDF Export) */}
      <div ref={reportRef} className="bg-gray-50 rounded-[40px] p-6 sm:p-10 shadow-xl border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 px-8 py-4 rounded-3xl border-2 border-yellow-200/50 shadow-sm mb-4">
            <span className="text-6xl inline-block mb-2">🏆</span>
            <h1 className="font-baloo font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {studentInfo?.name || "Hero"}'s Report Card
            </h1>
          </div>
          <p className="font-nunito text-gray-500 font-bold tracking-widest uppercase text-sm">
            {studentInfo?.grade && `${studentInfo.grade} | `}Class: {studentInfo?.className || "Hero Academy"} {studentInfo?.section ? `| Section: ${studentInfo.section}` : ''}
          </p>
        </div>

        {isGenerating || !dynamicReport ? (
          <div className="py-20 text-center">
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="text-6xl mb-6 inline-block">
              ✨
            </motion.div>
            <h2 className="font-baloo font-bold text-3xl text-purple-600 mb-4">Crafting Your Legend...</h2>
            <p className="font-nunito text-gray-500 text-lg">
              Our AI is checking your answers to create a personalized report!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Character Match & Relationship */}
          <div className="space-y-8">
            {selectedCharacter && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 relative overflow-hidden text-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedCharacter.color} opacity-[0.03] pointer-events-none`} />
                
                <h2 className="font-baloo font-bold text-2xl text-gray-800 mb-6 flex items-center justify-center gap-2">
                  <span>🎯</span> Your Similarity to {selectedCharacter.name}
                </h2>

                <ProgressRing percent={dynamicReport?.matchPercentage || similarityPercent} color={selectedCharacter.color} image={selectedCharacter.image} name={selectedCharacter.name} />

                <div className="mt-6">
                  <p className="font-baloo font-black text-3xl text-purple-700 mb-2">
                    {dynamicReport?.matchPercentage || similarityPercent}% Match!
                  </p>
                  
                  {/* Relationship / Why this character suits you */}
                  <div className={`mt-6 p-4 rounded-2xl bg-gradient-to-r ${selectedCharacter.color} text-white shadow-inner relative overflow-hidden`}>
                    <p className="font-baloo font-bold text-lg mb-1 flex items-center justify-center gap-2 relative z-20">
                      <span>✨</span> Why {selectedCharacter.name}?
                    </p>
                    <p className="font-nunito text-sm leading-relaxed text-white/95 relative z-20">
                      {dynamicReport.relationship}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Combat Stats Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 relative overflow-hidden">
              <h2 className="font-baloo font-bold text-2xl text-gray-800 mb-6 flex items-center gap-2 relative z-20">
                <span>📊</span> Stats
              </h2>
              <div className="space-y-4">
                {['power', 'fightIq', 'speed', 'cuteness', 'humour', 'bravery'].map((statKey, i) => {
                  return (
                    <TraitRow 
                      key={statKey} 
                      traitKey={statKey} 
                      score={dynamicReport.combatStats?.[statKey] || 0} 
                      maxScore={100} 
                      delay={1.0 + i * 0.1} 
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: User's Answers & Top Qualities */}
          <div className="space-y-8">
            
            {/* Top Qualities */}
            {dynamicReport.topQualities && dynamicReport.topQualities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100">
                <h2 className="font-baloo font-bold text-2xl text-gray-800 mb-4 flex items-center gap-2">
                  <span>⚡</span> Your Superpowers
                </h2>
                <div className="flex flex-col gap-3">
                  {dynamicReport.topQualities.map((trait, i) => (
                    <div key={i} className={`bg-gradient-to-r from-purple-400 to-pink-500 text-white font-nunito font-bold px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3`}>
                      <span className="text-2xl">{trait.emoji || '✨'}</span>
                      <span className="text-lg">{trait.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Answers Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100">
              <h2 className="font-baloo font-bold text-2xl text-gray-800 mb-6 flex items-center gap-2">
                <span>📝</span> How You Answered
              </h2>
              <div className="space-y-5">
                {(dynamicQuestions || personalityQuestions).map((q, idx) => {
                  const userAns = answers[q.id]
                  if (!userAns) return null
                  
                  // For display, we just show the first selected option's text
                  const selectedOption = q.options.find(opt => userAns.optionIds.includes(opt.id))
                  if (!selectedOption) return null

                  return (
                    <div key={q.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <p className="font-nunito font-bold text-gray-600 text-sm mb-1">{idx + 1}. {q.question}</p>
                      <p className="font-nunito text-purple-600 font-bold flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">↳</span> {selectedOption.text}
                      </p>
                    </div>
                  )
                })}
                {Object.keys(answers).length === 0 && (
                  <p className="text-gray-400 font-nunito italic text-center py-4">No answers recorded.</p>
                )}
              </div>
            </div>

            {/* Skillizee Certified Badge - Placed below How You Answered */}
            <div className="flex justify-center sm:justify-end mt-4 pr-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rotate-[15deg] drop-shadow-lg flex items-center justify-center pointer-events-none">
                 <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path id="curve2" fill="transparent" d="M 40 100 A 60 60 0 1 1 160 100 A 60 60 0 1 1 40 100" />
                  <circle cx="100" cy="100" r="80" fill="#F3E8FF" stroke="#A855F7" strokeWidth="8" strokeDasharray="10 5" />
                  <circle cx="100" cy="100" r="65" fill="#A855F7" />
                  <text width="500" font-family="Arial" font-weight="900">
                    <textPath xlinkHref="#curve2" startOffset="50%" textAnchor="middle" fill="#7E22CE" fontSize="22" letterSpacing="3">
                      SKILLIZEE CERTIFIED
                    </textPath>
                  </text>
                  <path d="M 100 50 L 115 85 L 150 90 L 125 115 L 130 150 L 100 135 L 70 150 L 75 115 L 50 90 L 85 85 Z" fill="#FBBF24" stroke="#FFF" strokeWidth="3" />
                  <text x="100" y="112" fontFamily="Arial" fontSize="40" fontWeight="900" fill="#A855F7" textAnchor="middle" alignmentBaseline="middle">⭐</text>
                </svg>
              </div>
            </div>

          </div>
        </div>
        )}

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="font-baloo font-bold text-gray-400">Skillizee Learning — Be Your Own Hero!</p>
        </div>
      </div>

      {/* Action Buttons (Not included in PDF) */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF || isGenerating || !dynamicReport}
          className="bg-blue-600 text-white font-baloo font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {isGeneratingPDF ? '⏳ Generating...' : '📥 Download Report PDF'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTryAgain}
          className="bg-white text-purple-600 font-baloo font-bold text-lg px-8 py-4 rounded-2xl shadow-md border-2 border-purple-100 hover:border-purple-300 transition"
        >
          🔄 Try Another Character
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(BASE)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-baloo font-bold text-lg px-8 py-4 rounded-2xl shadow-xl"
        >
          🏠 Back to Activity Home
        </motion.button>
      </div>
    </div>
  )
}
