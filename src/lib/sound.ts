// Web Audio API Synthesizer for Retro Sci-Fi SFX
// 100% Programmatic - Zero external dependencies, loading-free, low-latency.

class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientHumGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  
  private musicGain: GainNode | null = null;
  private bgMusicActive: boolean = false;
  private bgMusicInterval: any = null;
  private musicStep: number = 0;
  
  private isMuted: boolean = true;
  private initialized: boolean = false;

  constructor() {
    // Audio Context is initialized lazily upon first user interaction
  }

  private init() {
    if (this.initialized) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      // Master volume node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime); // 50% default volume
      this.masterGain.connect(this.ctx.destination);

      // Initialize ambient hum nodes
      this.setupAmbientHum();
      
      this.initialized = true;
      console.log("[SoundSystem] Initialized Web Audio Context successfully.");
    } catch (e) {
      console.warn("[SoundSystem] Web Audio API not supported in this browser:", e);
    }
  }

  private setupAmbientHum() {
    if (!this.ctx || !this.masterGain) return;

    // Ambient Hum Gain Node
    this.ambientHumGain = this.ctx.createGain();
    this.ambientHumGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start silent
    this.ambientHumGain.connect(this.masterGain);

    // Deep Low-Pass Filter to keep hum soothing and warm
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(90, this.ctx.currentTime);
    lowpass.connect(this.ambientHumGain);

    // Oscillator 1: 55Hz (A1) Sine Wave
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = "sine";
    this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);
    this.ambientOsc1.connect(lowpass);

    // Oscillator 2: 55.4Hz (Detuned Triangle wave for breathing/interference beats)
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = "triangle";
    this.ambientOsc2.frequency.setValueAtTime(55.4, this.ctx.currentTime);
    this.ambientOsc2.connect(lowpass);

    // LFO to slowly modulate volume (breathing server room effect)
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Very slow cycle (8s)
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // Modulate by 4%
    
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.ambientHumGain.gain); // Modulate the hum's gain node directly

    // Start all continuous sources
    this.ambientOsc1.start(0);
    this.ambientOsc2.start(0);
    this.lfo.start(0);
  }

  public toggleMute(mute: boolean) {
    this.isMuted = mute;
    
    if (!mute) {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.fadeHum(0.06, 1.5); // Soothing low level hum
      if (this.bgMusicActive) {
        this.startMusicSequencer();
      }
    } else {
      this.fadeHum(0, 0.5);
      this.stopMusicSequencer();
    }
  }

  public toggleMusic(active: boolean) {
    this.bgMusicActive = active;
    if (active && !this.isMuted) {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.startMusicSequencer();
    } else {
      this.stopMusicSequencer();
    }
  }

  public getMusicState(): boolean {
    return this.bgMusicActive;
  }

  private startMusicSequencer() {
    if (!this.ctx || !this.masterGain) return;
    this.stopMusicSequencer(); // clear any previous

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);
    // Smooth fade in
    this.musicGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);

    this.musicStep = 0;
    // D minor notes for arpeggio
    const notes = [146.83, 220.00, 293.66, 349.23, 440.00, 587.33, 440.00, 349.23]; // D3, A3, D4, F4, A4, D5, A4, F4
    
    this.bgMusicInterval = setInterval(() => {
      if (!this.ctx || this.isMuted || !this.bgMusicActive) return;

      try {
        const now = this.ctx.currentTime;
        
        // 1. Play Bass Note on every 4th beat
        if (this.musicStep % 4 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          const bassFilter = this.ctx.createBiquadFilter();

          bassOsc.type = "sawtooth";
          const bassPitches = [73.42, 87.31, 98.00, 55.00]; // D2, F2, G2, A1
          const chordIdx = Math.floor(this.musicStep / 4) % bassPitches.length;
          bassOsc.frequency.setValueAtTime(bassPitches[chordIdx], now);

          bassFilter.type = "lowpass";
          bassFilter.frequency.setValueAtTime(180, now);

          bassGain.gain.setValueAtTime(0.08, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

          bassOsc.connect(bassFilter);
          bassFilter.connect(bassGain);
          bassGain.connect(this.musicGain!);

          bassOsc.start(now);
          bassOsc.stop(now + 1.0);
        }

        // 2. Play Arpeggio Note on every step
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "triangle";
        
        // Change arpeggio based on chord
        const chordIndex = Math.floor(this.musicStep / 8) % 4;
        let noteFreq = notes[this.musicStep % notes.length];
        if (chordIndex === 1) noteFreq *= 1.2; // Transpose F-Major-ish
        else if (chordIndex === 2) noteFreq *= 1.33; // G-minor-ish
        else if (chordIndex === 3) noteFreq *= 1.5; // A-minor-ish

        osc.frequency.setValueAtTime(noteFreq, now);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800 + Math.sin(now * 0.1) * 300, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + 0.25);

        this.musicStep = (this.musicStep + 1) % 16;
      } catch (e) {}
    }, 250);
  }

  private stopMusicSequencer() {
    if (this.bgMusicInterval) {
      clearInterval(this.bgMusicInterval);
      this.bgMusicInterval = null;
    }
    if (this.ctx && this.musicGain) {
      try {
        const now = this.ctx.currentTime;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
      } catch (e) {}
    }
  }

  private fadeHum(targetVolume: number, duration: number) {
    if (!this.ctx || !this.ambientHumGain) return;
    
    const t = this.ctx.currentTime;
    this.ambientHumGain.gain.cancelScheduledValues(t);
    this.ambientHumGain.gain.setValueAtTime(this.ambientHumGain.gain.value, t);
    this.ambientHumGain.gain.linearRampToValueAtTime(targetVolume, t + duration);
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  // --- SCI-FI SOUND EFFECTS ---

  // Standard high-tech click for buttons and anchors
  public playClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(1000, now);

      osc.type = "sine";
      // Fast sweeping pitch downward
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Retro cyber-blip for highlights and status updates
  public playBeep() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now); // A5 note

      gain.gain.setValueAtTime(0.10, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Very short keyboard click ticking
  public playTyping() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2500, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.006);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.007);
    } catch (e) {}
  }

  // Beautiful major chord frequency sweep (Access Granted chime)
  public playChime() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Synthesize a staggering Pentatonic F-Major Chord (F4, A4, C5, F5)
      const freqs = [349.23, 440.00, 523.25, 698.46];
      
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06); // Stagger notes slightly (arpeggio)
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.85);
      });
    } catch (e) {}
  }

  // Retro modem data streams
  public playDataStream() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.6;
      const steps = 10;
      
      for (let i = 0; i < steps; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const stepTime = now + (i * (duration / steps));
        
        osc.type = "square";
        // Alternating chirping pitches
        const pitch = Math.sin(i) > 0 ? 1200 + (i * 100) : 800 - (i * 50);
        osc.frequency.setValueAtTime(pitch, stepTime);
        
        gain.gain.setValueAtTime(0.04, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.055);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(stepTime);
        osc.stop(stepTime + 0.06);
      }
    } catch (e) {}
  }
}

export const sound = new SoundSystem();
