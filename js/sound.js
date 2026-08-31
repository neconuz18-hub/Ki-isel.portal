/**
 * Sound Module - Web Audio API ile sıfır harici dosya bağımlılığıyla ses efektleri
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.3, delay = 0, gainLevel = 0.15) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime + delay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.log('Audio playback error', e);
    }
  }

  // Hatırlatıcı / Alarm sesi (Çift tonlu zarif zil)
  playAlert() {
    this.playTone(659.25, 'sine', 0.25, 0, 0.2);     // E5
    this.playTone(880.00, 'sine', 0.45, 0.18, 0.25); // A5
    this.playTone(1046.50, 'sine', 0.6, 0.4, 0.25);  // C6
  }

  // Görev tamamlama / Başarı sesi
  playSuccess() {
    this.playTone(523.25, 'sine', 0.15, 0, 0.15);    // C5
    this.playTone(659.25, 'sine', 0.15, 0.1, 0.15);  // E5
    this.playTone(783.99, 'sine', 0.3, 0.2, 0.2);    // G5
  }

  // Hafif tıklama sesi
  playClick() {
    this.playTone(800, 'triangle', 0.04, 0, 0.06);
  }

  // Pomodoro bitiş zili
  playTimerDone() {
    this.playTone(587.33, 'sine', 0.3, 0, 0.2);     // D5
    this.playTone(739.99, 'sine', 0.3, 0.25, 0.2);  // F#5
    this.playTone(880.00, 'sine', 0.5, 0.5, 0.25);  // A5
  }
}

window.soundManager = new SoundManager();
