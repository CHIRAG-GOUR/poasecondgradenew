import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { taskInstructions } from '../../data/activityData'
import ChapterNav from '../../components/ui/ChapterNav'

// ─── Simple Canvas Drawing Tool ─────────────────────────────
function DrawingCanvas() {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#FF6B9D')
  const [size, setSize] = useState(6)
  const [tool, setTool] = useState('pen') // pen | eraser

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDraw = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setDrawing(true)
    e.preventDefault()
  }

  const draw = (e) => {
    if (!drawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    e.preventDefault()
  }

  const stopDraw = () => setDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Redraw white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const colors = ['#FF6B9D', '#C77DFF', '#4ECDC4', '#FFD93D', '#FF8C42', '#5DBB41', '#74B9FF', '#2D3436', '#FFFFFF']

  return (
    <div className="glass-card p-5">
      <p className="font-baloo font-bold text-gray-700 text-lg mb-3 flex items-center gap-2">
        <span>🖌️</span> Draw Your Character Here
      </p>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex gap-1.5">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pen') }}
              style={{ backgroundColor: c, border: color === c && tool === 'pen' ? '3px solid #6B21A8' : '2px solid #E5E7EB' }}
              className="w-7 h-7 rounded-full transition-transform hover:scale-125 shadow-sm"
            />
          ))}
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setTool('pen')}
            className={`px-3 py-1.5 rounded-xl font-nunito font-bold text-xs transition-all ${tool === 'pen' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >✏️ Pen</button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1.5 rounded-xl font-nunito font-bold text-xs transition-all ${tool === 'eraser' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >🧹 Eraser</button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="font-nunito text-xs text-gray-500">Size: {size}</label>
          <input type="range" min={2} max={20} value={size} onChange={e => setSize(Number(e.target.value))} className="w-20 accent-purple-500" />
        </div>
        <button onClick={clearCanvas} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl font-nunito font-bold text-xs hover:bg-red-200 transition-colors">
          🗑️ Clear
        </button>
      </div>
      {/* Canvas */}
      <canvas
        id="character-canvas"
        ref={canvasRef}
        width={640}
        height={340}
        style={{ background: '#FFFFFF', touchAction: 'none' }}
        className="w-full rounded-2xl border-2 border-purple-200 cursor-crosshair shadow-inner"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </div>
  )
}

// ─── Image Upload ───────────────────────────────────────────
function ImageUpload({ onImage }) {
  const [preview, setPreview] = useState(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onImage(url)
  }

  return (
    <div className="glass-card p-5 flex flex-col items-center gap-4">
      <p className="font-baloo font-bold text-gray-700 text-lg flex items-center gap-2">
        <span>📸</span> Or Upload an Image
      </p>
      {preview ? (
        <div className="relative">
          <img id="uploaded-character-img" src={preview} alt="Uploaded character" className="max-h-48 rounded-2xl shadow-lg object-contain" />
          <button
            onClick={() => { setPreview(null); onImage(null) }}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold hover:bg-red-600 transition-colors shadow-md"
          >✕</button>
        </div>
      ) : (
        <label className="w-full border-2 border-dashed border-purple-300 rounded-2xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
          <span className="text-4xl mb-2">🖼️</span>
          <span className="font-nunito font-bold text-purple-500 text-sm">Click to upload image</span>
          <span className="font-nunito text-gray-400 text-xs mt-1">PNG, JPG, GIF supported</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  )
}

// ─── Main Chapter Component ─────────────────────────────────
export default function Chapter21() {
  const [form, setForm] = useState({ name: '', relate: '', action: '' })
  const [mode, setMode] = useState('draw') // draw | upload
  const [uploadedImage, setUploadedImage] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleDownload = () => {
    if (!form.name.trim()) return alert('Please enter your character\'s name first!')
    
    let downloadUrl = ''
    if (mode === 'draw') {
      const canvas = document.getElementById('character-canvas')
      if (canvas) downloadUrl = canvas.toDataURL('image/png')
    } else if (mode === 'upload' && uploadedImage) {
      downloadUrl = uploadedImage
    }

    if (!downloadUrl) return alert('Please draw or upload an image first!')

    const link = document.createElement('a')
    link.download = `${form.name.replace(/\s+/g, '_')}_Character.png`
    link.href = downloadUrl
    link.click()

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-card p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">🖼️</span>
            <div>
              <p className="text-orange-500 font-nunito font-bold text-sm uppercase tracking-widest">Chapter 2.1</p>
              <h1 className="chapter-title text-gray-800">Problem Statement</h1>
            </div>
          </div>
          <p className="body-text text-gray-600 ml-[4.5rem]">
            Time to create! Choose your favourite character and show us who they are. 🎨
          </p>
        </div>
      </motion.div>

      {/* Task Board */}
      <section className="mb-8">
        <h2 className="section-title text-gray-800 mb-4 flex items-center gap-2"><span>📋</span> Your Tasks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {taskInstructions.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${t.color} rounded-3xl p-4 text-white shadow-lg relative overflow-hidden`}
            >
              <div className="absolute top-2 right-3 font-baloo font-black text-white/20 text-5xl">{t.step}</div>
              <div className="text-3xl mb-2 relative z-10">{t.emoji}</div>
              <p className="font-baloo font-bold text-base relative z-10 leading-tight">{t.title}</p>
              <p className="font-nunito text-white/80 text-xs mt-1 relative z-10">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Character Form */}
      <section className="mb-8">
        <h2 className="section-title text-gray-800 mb-4 flex items-center gap-2"><span>✍️</span> About My Character</h2>
        <div className="glass-card p-6 space-y-5">
          {[
            { key: 'name', label: '🎭 Character Name', placeholder: 'e.g. Simba, Hermione, SpongeBob…' },
            { key: 'relate', label: '💭 Why do you relate to them?', placeholder: 'Tell us what makes this character feel like you…', multi: true },
            { key: 'action', label: '🦸 What would you do like them?', placeholder: 'If you were this character, what would you do?', multi: true },
          ].map(({ key, label, placeholder, multi }) => (
            <div key={key}>
              <label className="font-baloo font-bold text-gray-700 text-lg block mb-2">{label}</label>
              {multi ? (
                <textarea
                  rows={3}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white border-2 border-gray-200 focus:border-purple-400 rounded-2xl px-4 py-3 font-nunito text-gray-700 resize-none focus:outline-none transition-all text-base"
                />
              ) : (
                <input
                  type="text"
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white border-2 border-gray-200 focus:border-purple-400 rounded-2xl px-4 py-3 font-nunito text-gray-700 focus:outline-none transition-all text-base"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Draw / Upload toggle */}
      <section className="mb-8">
        <h2 className="section-title text-gray-800 mb-4 flex items-center gap-2"><span>🎨</span> Show Your Character</h2>
        <div className="flex gap-3 mb-4">
          {['draw', 'upload'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-baloo font-bold text-base transition-all ${mode === m ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/70 text-gray-600 hover:bg-white'}`}
            >
              {m === 'draw' ? '✏️ Draw Character' : '📸 Upload Image'}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {mode === 'draw' ? <DrawingCanvas /> : <ImageUpload onImage={setUploadedImage} />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Submit */}
      <section className="mb-8 text-center">
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 border border-green-300 text-green-800 font-baloo font-bold text-lg rounded-2xl px-6 py-4 mb-4 flex items-center justify-center gap-3"
            >
              <span>🎉</span> Download started! Awesome character! <span>🌟</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleDownload}
          className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-baloo font-bold text-2xl px-12 py-5 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          ⬇️ Download My Character
        </motion.button>
        <p className="font-nunito text-gray-400 text-sm mt-3">
          Save your masterpiece to your computer!
        </p>
      </section>

      <ChapterNav currentChapterId="chapter-2-1" />
    </div>
  )
}
