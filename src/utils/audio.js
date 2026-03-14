class RetroAudio {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.bgmOscs = []
    this.currentThemeTimeouts = []
    this.announcerSource = null
    this.themeAudio = null
    this.isMuted = false
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    
    // Mute Web Audio API context
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 1
    }
    
    // Mute HTML5 Theme Audio
    if (this.themeAudio) {
      this.themeAudio.muted = this.isMuted
    }
    
    // Mute browser generic TTS fallback
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    
    return this.isMuted
  }

  // ─── BACKGROUND MUSIC (Retro Arpeggio) ────────
  playBGM() {
    this.init()
    if (this.isPlayingBGM) return
    this.isPlayingBGM = true

    this.bgmGain = this.ctx.createGain()
    this.bgmGain.gain.value = 0.05
    this.bgmGain.connect(this.masterGain)

    const notes = [261.63, 329.63, 392.00, 523.25] // C E G C
    let noteIndex = 0

    const playNextNote = () => {
      if (!this.isPlayingBGM) return

      const osc = this.ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = notes[noteIndex]
      
      const vca = this.ctx.createGain()
      vca.gain.setValueAtTime(0.05, this.ctx.currentTime)
      vca.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)
      
      osc.connect(vca)
      vca.connect(this.masterGain)
      
      osc.start()
      osc.stop(this.ctx.currentTime + 0.2)
      
      noteIndex = (noteIndex + 1) % notes.length
      this.bgmTimeout = setTimeout(playNextNote, 250)
    }

    playNextNote()
  }

  stopBGM() {
    this.isPlayingBGM = false
    clearTimeout(this.bgmTimeout)
  }

  // ─── UI CLICK SOUND (Blip) ────────
  playClick() {
    this.init()
    const osc = this.ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(880, this.ctx.currentTime) // A5
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  // ─── CONFIRM SOUND (Power Up) ────────
  playConfirm() {
    this.init()
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.1)
    osc.frequency.linearRampToValueAtTime(1760, this.ctx.currentTime + 0.3)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.4)
  }

  // ─── CHARACTER THEME JINGLE (HTML5 Audio Playback) ────────
  playTheme(char) {
    this.stopTheme() // Stop any currently playing theme
    if (!char || !char.id) return
    
    // Dynamically look for the downloaded theme
    this.themeAudio = new Audio(`/sounds/themes/${char.id}.mp3`)
    this.themeAudio.loop = true
    this.themeAudio.volume = 0.3
    
    this.themeAudio.play().catch(e => {
      console.info("Theme audio not found or autoplay blocked for", char.name, e)
    })
  }

  stopTheme() {
    // Stop HTML5 Audio
    if (this.themeAudio) {
      this.themeAudio.pause()
      this.themeAudio.currentTime = 0
      this.themeAudio = null
    }
  }

  // ─── TEKKEN-STYLE ANNOUNCER ────────
  playAnnouncer(charId, fallbackName) {
    this.init()
    if (this.announcerSource) {
      this.announcerSource.stop()
    }
    
    fetch(`/sounds/announcements/${charId}.mp3`)
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.arrayBuffer();
      })
      .then(buffer => this.ctx.decodeAudioData(buffer))
      .then(audioBuffer => {
        const source = this.ctx.createBufferSource();
        source.buffer = audioBuffer;
        
        // Tekken Announcer Recipe: Lower pitch, boost bass, slight echo
        source.playbackRate.value = 0.85; 
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowshelf';
        filter.frequency.value = 200;
        filter.gain.value = 5; // Boost bass
        
        const delay = this.ctx.createDelay();
        delay.delayTime.value = 0.15;
        const delayFeedback = this.ctx.createGain();
        delayFeedback.gain.value = 0.3;
        
        source.connect(filter);
        filter.connect(this.masterGain);
        
        filter.connect(delay);
        delay.connect(delayFeedback);
        delayFeedback.connect(delay);
        delayFeedback.connect(this.masterGain);
        
        source.start();
        this.announcerSource = source;
      })
      .catch(e => {
        console.warn("No announcer audio found, using fallback", e);
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(fallbackName);
        utter.rate = 0.85;
        utter.pitch = 0.6;
        const voices = window.speechSynthesis.getVoices();
        const deepVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('google uk english male'));
        if (deepVoice) utter.voice = deepVoice;
        window.speechSynthesis.speak(utter);
      });
  }
}

export const audioSystem = new RetroAudio()
