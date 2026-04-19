/**
 * Service for generating procedural game sounds using the Web Audio API.
 */
export class SoundManager {
  private ctx: AudioContext | null = null;

  /**
   * Initializes the AudioContext. Must be called after a user gesture.
   */
  init() {
    if (!this.ctx) this.ctx = new AudioContext();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playEat() { this.playTone(800, 'sine', 0.1, 0.1); }

  playGameOver() { this.playTone(150, 'sawtooth', 0.5, 0.2); }

  playMove() { this.playTone(200, 'square', 0.05, 0.02); }
}
