/**
 * Sound & Haptics Service
 * Synthesizes audio using Web Audio API (Zero external mp3 files required)
 * Mimics Flutter's HapticFeedback and SoundPool
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('future_engineer_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch {
      // Local storage fallback
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('future_engineer_muted', String(this.muted));
    } catch {}
    if (!this.muted) {
      this.playTap();
    }
    return this.muted;
  }

  private playTone(
    freq: number,
    delay: number = 0,
    duration: number = 0.15,
    type: OscillatorType = 'triangle',
    volume: number = 0.12
  ) {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + delay;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // Audio play error handled safely
    }
  }

  public vibrate(pattern: number | number[] = 15) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }

  public playTap() {
    this.playTone(540, 0, 0.07, 'sine', 0.09);
    this.vibrate(8);
  }

  public playPick() {
    this.playTone(420, 0, 0.08, 'sine', 0.1);
    this.vibrate(12);
  }

  public playSuccess() {
    [660, 880].forEach((freq, idx) => {
      this.playTone(freq, idx * 0.08, 0.18, 'triangle', 0.14);
    });
    this.vibrate([20, 30, 20]);
  }

  public playError() {
    this.playTone(200, 0, 0.18, 'sawtooth', 0.08);
    this.playTone(160, 0.08, 0.2, 'sawtooth', 0.06);
    this.vibrate([40, 50, 40]);
  }

  public playStar() {
    [659, 784, 988, 1319].forEach((freq, idx) => {
      this.playTone(freq, idx * 0.075, 0.2, 'triangle', 0.15);
    });
    this.vibrate([15, 30, 40]);
  }

  public playCelebration() {
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, idx) => {
      this.playTone(freq, idx * 0.11, 0.35, 'triangle', 0.18);
    });
    this.vibrate([50, 50, 80, 50, 120]);
  }
}

export const soundService = new SoundService();
