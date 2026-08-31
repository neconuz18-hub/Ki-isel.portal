/**
 * Focus Module - Kişiselleştirilebilir Odaklanma & Pomodoro Sayacı
 */

class FocusManager {
  constructor() {
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    this.workMinutes = parseInt(settings.focusWorkMinutes) || 25;
    this.breakMinutes = parseInt(settings.focusBreakMinutes) || 5;

    this.workDuration = this.workMinutes * 60;
    this.breakDuration = this.breakMinutes * 60;

    this.mode = 'work'; // 'work' or 'break'
    this.timeLeft = this.workDuration;
    this.isRunning = false;
    this.timerId = null;
  }

  setCustomDurations(workMins, breakMins) {
    this.pause();
    this.workMinutes = Math.max(1, parseInt(workMins) || 25);
    this.breakMinutes = Math.max(1, parseInt(breakMins) || 5);

    this.workDuration = this.workMinutes * 60;
    this.breakDuration = this.breakMinutes * 60;

    // Save to settings
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    settings.focusWorkMinutes = this.workMinutes;
    settings.focusBreakMinutes = this.breakMinutes;
    window.appStorage.save(STORAGE_KEYS.SETTINGS, settings);

    this.timeLeft = this.mode === 'work' ? this.workDuration : this.breakDuration;
    this.updateDisplay();
    this.renderButtons();

    if (window.app) {
      window.app.showToast(`Odaklanma: ${this.workMinutes} dk, Mola: ${this.breakMinutes} dk olarak ayarlandı`, 'success');
      window.app.closeModal('customFocusModal');
    }
  }

  setMode(mode) {
    this.pause();
    this.mode = mode;
    this.timeLeft = mode === 'work' ? this.workDuration : this.breakDuration;
    this.updateDisplay();
    this.renderButtons();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timerId = setInterval(() => {
      this.tick();
    }, 1000);
    this.updateControls();
  }

  pause() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.updateControls();
  }

  reset() {
    this.pause();
    this.timeLeft = this.mode === 'work' ? this.workDuration : this.breakDuration;
    this.updateDisplay();
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.updateDisplay();
    } else {
      this.pause();
      if (window.soundManager) window.soundManager.playTimerDone();
      
      const nextMode = this.mode === 'work' ? 'break' : 'work';
      const nextMins = nextMode === 'work' ? this.workMinutes : this.breakMinutes;
      const msg = this.mode === 'work' 
        ? `Tebrikler! ${this.workMinutes} dakikalık odaklanma bitti. Şimdi ${this.breakMinutes} dakikalık mola zamanı!` 
        : `Mola bitti! ${this.workMinutes} dakikalık yeni odaklanma seansına başlayabilirsiniz.`;
      
      if (window.app) window.app.showToast(msg, 'success');
      this.setMode(nextMode);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  updateDisplay() {
    const timeEl = document.getElementById('focusTimerDisplay');
    const labelEl = document.getElementById('focusModeLabel');
    if (timeEl) timeEl.textContent = this.formatTime(this.timeLeft);
    if (labelEl) {
      labelEl.textContent = this.mode === 'work' 
        ? `🎯 Odaklanma Zamanı (${this.workMinutes} Dk)` 
        : `☕ Dinlenme Molası (${this.breakMinutes} Dk)`;
      labelEl.className = this.mode === 'work' ? 'text-xs font-bold text-amber-400' : 'text-xs font-bold text-emerald-400';
    }
    this.renderButtons();
  }

  renderButtons() {
    const workBtn = document.getElementById('focusWorkModeBtn');
    const breakBtn = document.getElementById('focusBreakModeBtn');

    if (workBtn) {
      workBtn.textContent = `${this.workMinutes} Dk Odak`;
      if (this.mode === 'work') {
        workBtn.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-slate-950 shadow transition-all cursor-pointer';
      } else {
        workBtn.className = 'px-2.5 py-1 text-[11px] font-semibold rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer';
      }
    }

    if (breakBtn) {
      breakBtn.textContent = `${this.breakMinutes} Dk Mola`;
      if (this.mode === 'break') {
        breakBtn.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500 text-slate-950 shadow transition-all cursor-pointer';
      } else {
        breakBtn.className = 'px-2.5 py-1 text-[11px] font-semibold rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer';
      }
    }
  }

  openSettingsModal() {
    const workInp = document.getElementById('customFocusWorkInput');
    const breakInp = document.getElementById('customFocusBreakInput');

    if (workInp) workInp.value = this.workMinutes;
    if (breakInp) breakInp.value = this.breakMinutes;

    if (window.app) window.app.openModal('customFocusModal');
  }

  updateControls() {
    const btn = document.getElementById('focusToggleBtn');
    if (btn) {
      if (this.isRunning) {
        btn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 mr-1.5"></i> Duraklat';
        btn.className = 'px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold flex items-center transition-all cursor-pointer';
      } else {
        btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 mr-1.5"></i> Başlat';
        btn.className = 'px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center transition-all shadow-md shadow-amber-500/10 cursor-pointer';
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

window.focusManager = new FocusManager();
