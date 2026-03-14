import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCharacter } from '../../context/CharacterContext'

const BASE = '/activity/skillizee-character'

export default function StudentInfo() {
  const navigate = useNavigate()
  const { setStudentInfo } = useCharacter()
  
  const [formData, setFormData] = useState({
    name: '',
    className: '2nd Grade',
    section: 'Aura'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    setStudentInfo(formData)
    navigate(`${BASE}/module-2/chapter-2-1`)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 sm:p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 pointer-events-none" />
        
        <div className="relative z-10 text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
            <span className="text-5xl">🎒</span>
          </div>
          <h1 className="font-baloo font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Welcome to Character Quest!
          </h1>
          <p className="font-nunito text-gray-600 text-lg">
            Before we find your perfect hero, tell us who you are!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          
          <div>
            <label className="block font-baloo font-bold text-gray-700 text-xl mb-2 ml-2">What's your Name?</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Alex"
              className="w-full font-nunito text-lg px-6 py-4 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white/80 shadow-inner outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-baloo font-bold text-gray-700 text-xl mb-2 ml-2">Class Name</label>
              <input 
                type="text" 
                value={formData.className}
                onChange={e => setFormData(p => ({ ...p, className: e.target.value }))}
                className="w-full font-nunito text-lg px-6 py-4 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white/80 shadow-inner outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block font-baloo font-bold text-gray-700 text-xl mb-2 ml-2">Section</label>
              <div className="relative">
                <select 
                  value={formData.section}
                  onChange={e => setFormData(p => ({ ...p, section: e.target.value }))}
                  className="w-full appearance-none font-nunito text-lg px-6 py-4 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white/80 shadow-inner outline-none transition-all cursor-pointer"
                >
                  <option value="Aura">🌟 Aura</option>
                  <option value="Zen">🧘 Zen</option>
                </select>
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                  <span className="text-gray-400 select-none">▼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!formData.name.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-baloo font-bold text-2xl px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Let's Go! 🚀
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  )
}
