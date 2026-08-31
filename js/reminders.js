/**
 * Reminders Module - Hatırlatıcı ve Bildirim Sistemi
 */

class ReminderManager {
  constructor() {
    this.reminders = window.appStorage.get(STORAGE_KEYS.REMINDERS, []);
    this.intervalId = null;
    this.initTicker();
  }

  getReminders() {
    return this.reminders;
  }

  addReminder(data) {
    const newReminder = {
      id: 'rem_' + Date.now(),
      title: data.title.trim(),
      datetime: data.datetime, // e.g. "2026-08-27T14:30"
      notes: data.notes ? data.notes.trim() : '',
      triggered: false,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.reminders.push(newReminder);
    this.save();
    return newReminder;
  }

  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.save();
    if (window.app) window.app.showToast('Hatırlatıcı silindi', 'info');
  }

  markCompleted(id) {
    const rem = this.reminders.find(r => r.id === id);
    if (rem) {
      rem.completed = true;
      this.save();
      if (window.app) window.app.showToast(`"${rem.title}" tamamlandı olarak işaretlendi`, 'success');
    }
  }

  snooze(id, minutes = 10) {
    const rem = this.reminders.find(r => r.id === id);
    if (rem) {
      const current = new Date(rem.datetime).getTime();
      const snoozedTime = new Date(Math.max(Date.now(), current) + minutes * 60 * 1000);
      rem.datetime = snoozedTime.toISOString().slice(0, 16);
      rem.triggered = false;
      this.save();
      
      let durationText = `${minutes} dakika`;
      if (minutes >= 1440) durationText = `${Math.round(minutes / 1440)} gün`;
      else if (minutes >= 60) durationText = `${Math.round(minutes / 60)} saat`;

      if (window.app) window.app.showToast(`Hatırlatıcı ${durationText} ertelendi`, 'info');
    }
  }

  handleSnoozeFromModal(minutes) {
    const modal = document.getElementById('reminderAlertModal');
    const id = modal ? modal.dataset.reminderId : null;
    if (id) {
      this.snooze(id, minutes);
      if (window.app) window.app.closeReminderModal();
    }
  }

  promptCustomSnooze(id) {
    const rem = this.reminders.find(r => r.id === id);
    if (!rem) return;

    const modal = document.getElementById('snoozePickerModal');
    if (modal) {
      modal.dataset.targetReminderId = id;
      const titleEl = document.getElementById('snoozePickerTitle');
      if (titleEl) titleEl.textContent = rem.title;
      if (window.app) window.app.openModal('snoozePickerModal');
    }
  }

  handleSnoozePickerSelect(minutes) {
    const modal = document.getElementById('snoozePickerModal');
    const id = modal ? modal.dataset.targetReminderId : null;
    if (id) {
      this.snooze(id, minutes);
      if (window.app) window.app.closeModal('snoozePickerModal');
    }
  }

  save() {
    window.appStorage.save(STORAGE_KEYS.REMINDERS, this.reminders);
    this.render();
    if (window.app) window.app.updateDashboardStats();
  }

  render() {
    this.renderRemindersList('dashboardReminderList');
    this.renderRemindersList('mainReminderList');
  }

  initTicker() {
    if (this.intervalId) clearInterval(this.intervalId);
    
    // Check reminders every 10 seconds
    this.intervalId = setInterval(() => {
      this.checkDueReminders();
    }, 10000);

    // Initial check
    setTimeout(() => this.checkDueReminders(), 1000);
  }

  checkDueReminders() {
    const now = new Date();

    this.reminders.forEach(rem => {
      if (rem.completed || rem.triggered) return;

      const remTime = new Date(rem.datetime);
      if (now >= remTime) {
        rem.triggered = true;
        this.save();
        this.triggerAlert(rem);
      }
    });
  }

  triggerAlert(reminder) {
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});

    // 1. Sesli Uyarı (Ayarlarda açıksa)
    if (settings.soundEnabled !== false && window.soundManager) {
      window.soundManager.playAlert();
    }

    // 2. Köşe Tost Bildirimi (Ayarlarda açıksa)
    if (settings.toastEnabled !== false && window.app) {
      window.app.showToast(`⏰ HATIRLATICI: ${reminder.title}`, 'alert');
    }

    // 3. Ekranda Açılan Pop-up Penceresi (Ayarlarda açıksa)
    if (settings.popupEnabled !== false && window.app) {
      window.app.showReminderModal(reminder);
    }

    // 4. Masaüstü / Tarayıcı Bildirimi (Ayarlarda açıksa ve izin verilmişse)
    if (settings.browserNotifyEnabled !== false && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Yönetici Asistanı Hatırlatması", {
          body: reminder.title + (reminder.notes ? `\n${reminder.notes}` : ''),
          icon: "favicon.ico"
        });
      } catch (e) {
        console.log("Notification trigger error", e);
      }
    }

    this.renderRemindersList();
  }

  requestNotificationPermission() {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted" && window.app) {
          window.app.showToast("Masaüstü bildirimleri aktif edildi.", "success");
        }
      });
    }
  }

  renderRemindersList(containerId = 'reminderListContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Filter active reminders & sort by date
    const active = this.reminders
      .filter(r => !r.completed)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    if (active.length === 0) {
      container.innerHTML = `
        <div class="text-center py-10 px-4">
          <div class="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-700/60">
            <i data-lucide="bell-off" class="w-6 h-6"></i>
          </div>
          <p class="text-slate-300 font-medium text-sm">Bekleyen aktif hatırlatıcı yok</p>
          <p class="text-slate-400 text-xs mt-1">Önemli toplantı ve işleriniz için saatli hatırlatıcı ekleyin.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = active.map(rem => {
      const remDate = new Date(rem.datetime);
      const isPast = remDate < new Date();
      const formattedDate = remDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      const formattedTime = remDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      return `
        <div class="item-enter group flex items-center justify-between p-3 rounded-xl border ${isPast ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'} transition-all mb-2">
          <div class="flex items-center space-x-3 min-w-0 pr-2">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPast ? 'bg-amber-500/20 text-amber-400 pulse-badge' : 'bg-blue-500/20 text-blue-400'}">
              <i data-lucide="${isPast ? 'alert-triangle' : 'clock'}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-100 truncate">${escapeHtml(rem.title)}</p>
              <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>${formattedDate} · ${formattedTime}</span>
                ${isPast ? '<span class="text-amber-400 font-medium">(Süresi geçti)</span>' : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-1 flex-shrink-0">
            <button onclick="window.reminderManager.markCompleted('${rem.id}')" title="Tamamlandı Olarak İşaretle" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer">
              <i data-lucide="check" class="w-4 h-4"></i>
            </button>
            <button onclick="window.reminderManager.promptCustomSnooze('${rem.id}')" title="Erteleme Süresi Seç" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer">
              <i data-lucide="timer-reset" class="w-4 h-4"></i>
            </button>
            <button onclick="window.reminderManager.deleteReminder('${rem.id}')" title="Sil" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.reminderManager = new ReminderManager();
