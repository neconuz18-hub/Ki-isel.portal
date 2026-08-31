/**
 * Smart Context & Daily Command Bar Module (js/smartContext.js)
 * Günün saatine ve iş yoğunluğuna göre şekil alan Akıllı Adaptif Karşılama Barı
 */

class SmartContextManager {
  constructor() {
    this.init();
  }

  init() {
    setTimeout(() => {
      this.render();
    }, 150);

    // Her 5 dakikada bir saati ve mod durumunu güncelle
    setInterval(() => {
      this.render();
    }, 300000);
  }

  // Günün saatine göre karşılama ve mod tespiti
  getTimeContext() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 11.5) {
      return {
        mode: 'morning',
        greeting: 'Günaydın',
        subtitle: 'Bugünün gündemi ve öncelikleri hazır. Verimli ve harika bir gün dileriz!',
        icon: 'sunrise',
        color: 'amber',
        themeQuote: 'Bugünün en kritik 3 adımına odaklanarak güne güçlü bir başlangıç yapın.'
      };
    } else if (hour >= 11.5 && hour < 17.5) {
      return {
        mode: 'focus',
        greeting: 'İyi Çalışmalar',
        subtitle: 'Derin odaklanma ve yüksek tempolu çalışma zamanı. Akışta kalın!',
        icon: 'zap',
        color: 'sky',
        themeQuote: 'Büyük hedefler, tamamlanan küçük görevlerin birikimidir.'
      };
    } else if (hour >= 17.5 && hour < 23) {
      return {
        mode: 'evening',
        greeting: 'İyi Akşamlar',
        subtitle: 'Günün yoğunluğu geride kalıyor. Tamamlanan işleri gözden geçirme zamanı.',
        icon: 'sunset',
        color: 'indigo',
        themeQuote: 'Bugün harika işler başardınız. Yarının planı için birkaç dakika ayırabilirsiniz.'
      };
    } else {
      return {
        mode: 'night',
        greeting: 'Huzurlu Geceler',
        subtitle: 'Zihninizi dinlendirme ve yenilenme vakti. İyi uykular dileriz.',
        icon: 'moon',
        color: 'purple',
        themeQuote: 'Yarın, bugünden daha verimli olmak için yeni bir fırsat.'
      };
    }
  }

  // Sistemden anlık özet verileri toplama
  getSystemMetrics() {
    let pendingTasks = 0;
    let todayTasks = [];
    let completedToday = 0;
    let urgentSubscriptions = 0;
    let nextReminder = null;

    // Görevler
    if (window.taskManager && Array.isArray(window.taskManager.tasks)) {
      const todayStr = new Date().toISOString().split('T')[0];
      window.taskManager.tasks.forEach(t => {
        if (!t.completed) {
          pendingTasks++;
          if (t.dueDate === todayStr || t.priority === 'urgent' || t.priority === 'high') {
            todayTasks.push(t);
          }
        } else {
          completedToday++;
        }
      });
    }

    // Abonelikler
    if (window.subscriptionManager && Array.isArray(window.subscriptionManager.subscriptions)) {
      urgentSubscriptions = window.subscriptionManager.getStats().criticalCount;
    }

    // Hatırlatıcılar
    if (window.reminderManager && Array.isArray(window.reminderManager.reminders)) {
      const active = window.reminderManager.reminders.filter(r => !r.completed);
      if (active.length > 0) {
        nextReminder = active[0];
      }
    }

    return {
      pendingTasks,
      todayTasks: todayTasks.slice(0, 3), // En kritik 3 görev
      completedToday,
      urgentSubscriptions,
      nextReminder
    };
  }

  // Hızlı görev tamamlama
  quickCompleteTask(taskId) {
    if (window.taskManager) {
      window.taskManager.toggleTask(taskId);
      this.render();
      if (window.app) window.app.renderAll();
    }
  }

  render() {
    const container = document.getElementById('smartContextContainer');
    if (!container) return;

    const ctx = this.getTimeContext();
    const metrics = this.getSystemMetrics();

    // Kullanıcı adı
    const userCreds = window.appStorage.get('assistant_user_credentials', null);
    const userName = userCreds?.name || 'Yönetici';

    // En kritik öncelikler HTML
    let prioritiesHtml = '';
    if (metrics.todayTasks.length === 0) {
      prioritiesHtml = `
        <div class="flex items-center gap-2 text-xs text-slate-400 py-1">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
          <span>Bugün için acil bekleyen bir öncelik bulunmuyor. Harika durumdasınız!</span>
        </div>
      `;
    } else {
      prioritiesHtml = `
        <div class="space-y-1.5 w-full">
          ${metrics.todayTasks.map(t => `
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all text-xs group">
              <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                <input 
                  type="checkbox" 
                  onchange="window.smartContextManager.quickCompleteTask('${t.id}')"
                  class="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
                >
                <span class="text-slate-200 group-hover:text-amber-400 transition-colors font-medium truncate">${t.title}</span>
              </label>
              <span class="text-[10px] px-2 py-0.5 rounded-md ${t.priority === 'urgent' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'} flex-shrink-0 ml-2 font-bold">
                ${t.priority === 'urgent' ? 'ACİL' : (t.priority === 'high' ? 'YÜKSEK' : 'ÖNCELİKLİ')}
              </span>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
        <!-- Ambient Glow -->
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-${ctx.color}-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-${ctx.color}-500/15 transition-all"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">
          <!-- Sol: Karşılama ve Durum -->
          <div class="lg:col-span-7 space-y-3">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-2xl bg-${ctx.color}-500/15 text-${ctx.color}-400 border border-${ctx.color}-500/30 shadow-lg shadow-${ctx.color}-500/10 flex-shrink-0">
                <i data-lucide="${ctx.icon}" class="w-6 h-6"></i>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  ${ctx.greeting}, <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">${userName}</span>
                </h2>
                <p class="text-xs text-slate-400 mt-0.5 font-medium">${ctx.subtitle}</p>
              </div>
            </div>

            <!-- Akıllı Durum Rozetleri (Smart Pills) -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span class="w-2 h-2 rounded-full ${metrics.pendingTasks > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}"></span>
                <strong>${metrics.pendingTasks}</strong> Bekleyen Görev
              </span>

              ${metrics.urgentSubscriptions > 0 ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-bold">
                  <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-rose-400"></i>
                  ${metrics.urgentSubscriptions} Acil Ödeme/Muayene
                </span>
              ` : ''}

              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i>
                <strong>${metrics.completedToday}</strong> Tamamlandı
              </span>

              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 italic hidden sm:inline-flex">
                "${ctx.themeQuote}"
              </span>
            </div>
          </div>

          <!-- Sağ: Günün Kritik Öncelikleri (Focus Capsule) -->
          <div class="lg:col-span-5 bg-slate-950/50 backdrop-blur-md rounded-xl border border-slate-800/80 p-3.5 space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs font-bold text-white">
                <i data-lucide="target" class="w-4 h-4 text-amber-400"></i>
                <span>Günün Odak Öncelikleri</span>
              </div>
              <button onclick="window.app.switchTab('tasks', true)" class="text-[10px] font-bold text-slate-400 hover:text-amber-400 transition-colors">
                Tüm Görevler →
              </button>
            </div>

            ${prioritiesHtml}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
}

window.smartContextManager = new SmartContextManager();
