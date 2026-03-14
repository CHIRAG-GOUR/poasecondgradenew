import { useState } from 'react'
import { motion } from 'framer-motion'
import { videos, observationQuestions } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'

export default function Chapter12() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [responses, setResponses] = useState({})

  const current = videos[activeVideo]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-8 text-center">
        <h1 className="chapter-title text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
          Watch & Learn
        </h1>
        <p className="body-text text-gray-600">Watch the videos and observe how characters behave!</p>
      </motion.div>

      {/* Video Tabs */}
      <div className="flex gap-3 mb-6">
        {videos.map((v, i) => (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveVideo(i)}
            className={`flex-1 p-3 rounded-xl font-baloo font-bold text-sm transition-all ${
              activeVideo === i
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white/70 text-gray-600 hover:bg-white'
            }`}
          >
            <span className="text-xl mr-1">{v.emoji}</span> {v.title.slice(0, 30)}...
          </motion.button>
        ))}
      </div>

      {/* Video Player */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="font-baloo font-bold text-xl text-gray-800 mb-4">{current.title}</h2>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-xl mb-4">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${current.youtubeId}`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="font-nunito text-gray-500 text-sm">{current.description}</p>

        {/* Video Questions */}
        <div className="mt-6 space-y-3">
          <h3 className="font-baloo font-bold text-lg text-gray-700">After watching, think about:</h3>
          {current.questions.map((q, i) => (
            <div key={i} className="bg-blue-50 rounded-xl p-3 flex items-start gap-3">
              <span className="text-blue-500 font-bold">{i + 1}.</span>
              <p className="font-nunito text-gray-700 text-sm">{q}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Observation Questions */}
      <div className="space-y-4 mb-8">
        <h2 className="section-title text-gray-800">Your Observations</h2>
        {observationQuestions.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 border-2 ${q.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{q.emoji}</span>
              <p className="font-baloo font-bold text-gray-800">{q.question}</p>
            </div>
            <textarea
              placeholder={q.placeholder}
              value={responses[q.id] || ''}
              onChange={(e) => setResponses(prev => ({ ...prev, [q.id]: e.target.value }))}
              className="w-full bg-white/80 rounded-xl p-3 text-sm font-nunito text-gray-700 border-0 outline-none focus:ring-2 focus:ring-purple-300 h-20 resize-none"
            />
          </motion.div>
        ))}
      </div>

      <ChapterNav currentChapterId="chapter-1-2" />
    </div>
  )
}
