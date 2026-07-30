/**
 * Web Audio API synthesizer for interactive videography sound effects.
 * No external audio files needed; all sounds are generated programmatically.
 */

class AudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true; // Enabled by default

  private init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error('AudioContext not supported', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Camera focus tick
  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Camera shutter click
  playShutter() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // First part: high frequency metallic click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(4000, now);
    osc1.frequency.exponentialRampToValueAtTime(2000, now + 0.03);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    
    // Second part: mechanical clunk (white noise with filter)
    const bufferSize = this.ctx.sampleRate * 0.1; // 100ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(5, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.03);
    noise.start(now);
    noise.stop(now + 0.1);
  }

  // Clapperboard wood slap
  playClap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low woody body resonance
    const oscWood = this.ctx.createOscillator();
    const gainWood = this.ctx.createGain();
    oscWood.type = 'triangle';
    oscWood.frequency.setValueAtTime(150, now);
    oscWood.frequency.linearRampToValueAtTime(80, now + 0.15);
    
    gainWood.gain.setValueAtTime(0.25, now);
    gainWood.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    oscWood.connect(gainWood);
    gainWood.connect(this.ctx.destination);
    
    // Sharp wooden crack (noise spike)
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(4, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    oscWood.start(now);
    oscWood.stop(now + 0.15);
    noise.start(now);
    noise.stop(now + 0.06);
  }

  // Continuous lens focus feedback loop
  playFocusBeep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, now);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const synth = new AudioSynth();
