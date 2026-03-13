import { useState } from 'react'
import { motion } from 'framer-motion'
import { videos, observationQuestions } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'

// ─── Video Player ───────────────────────────────────────────
function VideoPlayer({ video }) {
  const [loaded, setLoaded] = useState(false)
  const [answers, setAnswers] = useState({})

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{video.emoji}</span>
        <div>
          <h3 className="font-baloo font-bold text-gray-800 text-xl">{video.title}</h3>
          <p className="font-nunito text-gray-500 text-sm">{video.description}</p>
        </div>
      </div>

      {/* YouTube iframe */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-5" style={{ paddingBottom: '56.25%' }}>
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">▶</span>
            </div>
            <p className="text-gray-500 font-nunito font-bold text-sm">Loading video...</p>
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <p className="font-baloo font-bold text-gray-700 text-lg flex items-center gap-2">
          <span>💬</span> After watching, think about…
        </p>
        {video.questions.map((q, i) => (
          <div key={i} className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <label className="font-nunito font-bold text-blue-800 text-sm mb-2 block">
              {['🌟', '🤔', '🪞'][i]} {q}
            </label>
            <textarea
              rows={2}
              value={answers[i] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
              placeholder="Write your answer here..."
              className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 font-nunito text-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Observation Section ────────────────────────────────────
function ObservationSection() {
  const [answers, setAnswers] = useState({})

  return (
    <div className="glass-card p-6 mb-6">
      <h2 className="section-title text-gray-800 mb-2 flex items-center gap-3">
        <span>🔍</span> Observe the Characters Carefully
      </h2>
      <p className="font-nunito text-gray-500 mb-5">After watching all the videos, answer these big questions:</p>
      <div className="space-y-4">
        {observationQuestions.map((q) => (
          <motion.div
            key={q.id}
            whileHover={{ scale: 1.01 }}
            className={`rounded-2xl p-5 border-2 ${q.color}`}
          >
            <label className="font-baloo font-bold text-gray-800 text-lg mb-3 flex items-center gap-2 block">
              <span>{q.emoji}</span> {q.question}
            </label>
            <textarea
              rows={3}
              value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder={q.placeholder}
              className="w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 font-nunito text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 transition-shadow"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Chapter Component ─────────────────────────────────
export default function Chapter12() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-card p-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">🎬</span>
            <div>
              <p className="text-purple-500 font-nunito font-bold text-sm uppercase tracking-widest">Chapter 1.2</p>
              <h1 className="chapter-title text-gray-800">Watch & Learn</h1>
            </div>
          </div>
          <p className="body-text text-gray-600 ml-[4.5rem]">
            Watch these exciting videos and observe the characters carefully! Notice their qualities and behaviour. 🎥
          </p>
        </div>
      </motion.div>

      {/* Videos */}
      <section className="mb-6">
        <h2 className="section-title text-gray-800 mb-5 flex items-center gap-3">
          <span className="text-2xl">📺</span> Videos to Watch
        </h2>
        {videos.map((v) => <VideoPlayer key={v.id} video={v} />)}
      </section>

      {/* Observation Questions */}
      <ObservationSection />

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl p-5 text-white flex items-center gap-4 mb-8"
      >
        <span className="text-4xl flex-shrink-0 animate-bounce">🌈</span>
        <div>
          <p className="font-baloo font-bold text-xl">Great watching!</p>
          <p className="font-nunito text-white/90">Now let's test what you learned in the quiz! ➡️</p>
        </div>
      </motion.div>

      <ChapterNav currentChapterId="chapter-1-2" />
    </div>
  )
}
