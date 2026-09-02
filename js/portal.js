/**
 * Personal OS Enterprise v4.2 — Zero-Crash Bulletproof Core
 */
window.Portal = {
  version: '4.2.0-Bulletproof',
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  minimizedWidgets: [],
  searchQuery: '',
  noteFilterTab: 'active',
  sortDescending: true,
  openTaskGroups: {},

  init() {
    console.log('[Personal OS]: Sistem başlatılıyor...');
    
    // Her başlatıcıyı tamamen izole çalıştırıyoruz
    this.safeExec('Auth', () => this.checkPersistentAuth());
    this.safeExec('Saat & Tarih', () => this.initClock());
    this.safeExec('Sol Menü', () => this.renderSidebarNav());
    this.safeExec('Görevler', () => this.loadTasks());
    this.safeExec('Notlar', () => this.loadNotes());
    this.safeExec('Borsa & Finans', () => this.loadFinanceData());
    this.safeExec('Kısayollar', () => this.bindKeyboardShortcuts());
    this.safeExec('Metrikler', () => this.updateProductivityHUD());
    this.safeExec('İkonlar', () => {
      if (window.lucide) window.lucide.createIcons();
    });

    console.log('[Personal OS]: Sistem hazır!');
  },

  safeExec(moduleName, fn) {
    try {
      fn();
    } catch (e) {
      console.error(`[Modül Hatası - ${moduleName}]:`, e);
    }
  },

  // ==========================================================
  // 1. GÜVENLİK VE KAÇIŞ
  // ==========================================================
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('LocalStorage yazma uyarısı:', e);
    }
  },

  // ==========================================================
  // 2. SESLİ GERİ BİLDİRİM (WEB AUDIO)
  // ==========================================================
  playAudioFeedback(type = 'click') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'complete') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {}
  },

  // ==========================================================
  // 3. IŞIK HIZINDA YAKALAMA (QUICK CAPTURE)
  // ==========================================================
  handleQuickCapture(event) {
    if (event.key === 'Enter') {
      const input = document.getElementById('quickCaptureInput');
      if (!input) return;
      const raw = input.value.trim();
      if (!raw) return;

      const isNote = raw.toLowerCase().startsWith('not:') || raw.toLowerCase().startsWith('not ');
      const isUrgent = raw.includes('!acil') || raw.includes('!high');
      const cleanText = raw.replace(/^not:?\s*/i, '').replace(/!acil|!high/gi, '').trim();

      if (isNote) {
        let notes = this.getLocalNotes();
        notes.unshift({
          id: 'note_' + Date.now(),
          title: cleanText.substring(0, 40) || 'Hızlı Doküman',
          content: cleanText,
          icon: isUrgent ? '🔥' : '💡',
          color: isUrgent ? 'rose' : 'amber',
          pinned: isUrgent ? 1 : 0,
          updated_at: new Date().toISOString()
        });
        this.saveLocalNotes(notes);
        this.loadNotes();
        this.toast('Yeni Doküman Kaydedildi! 💡', 'success');
      } else {
        let tasks = this.getLocalTasks();
        if (!tasks[0]) tasks.unshift({ id: 'tg_quick', title: 'Öncelikli Eylemler & Odak', items: [] });
        if (!tasks[0].items) tasks[0].items = [];

        tasks[0].items.unshift({
          text: (isUrgent ? '🔥 ' : '') + cleanText,
          done: false
        });

        this.saveLocalTasks(tasks);
        this.loadTasks();
        this.toast('Yeni Eylem Eklendi! ⚡', 'success');
      }

      this.playAudioFeedback('complete');
      input.value = '';
      this.updateProductivityHUD();
    }
  },

  // ==========================================================
  // 4. GÖREVLER (TASKS) MOTORU
  // ==========================================================
  getLocalTasks() {
    try {
      const stored = localStorage.getItem('portal_tasks_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    const initial = [
      {
        id: 'tg_priority',
        title: 'Öncelikli Eylemler & Odak',
        iconType: 'pin',
        items: [
          { text: 'Personal OS v4.2 mimarisini test et', done: true },
          { text: 'Borsa ve hisse portföyünü incele', done: false },
          { text: '⌘K ile ışık hızında eylem fırlat', done: false }
        ]
      },
      {
        id: 'tg_undated',
        title: 'Stratejik İnovasyon & Ar-Ge',
        iconType: 'undated',
        items: [
          { text: 'Yeni modül entegrasyonlarını planla', done: false },
          { text: 'Kişisel veri yedeklemesini doğrula', done: true }
        ]
      }
    ];
    this.safeSetItem('portal_tasks_data', JSON.stringify(initial));
    return initial;
  },

  saveLocalTasks(tasks) {
    this.safeSetItem('portal_tasks_data', JSON.stringify(tasks));
    this.updateProductivityHUD();
  },

  loadTasks() {
    const tasks = this.getLocalTasks();
    const container = document.getElementById('tasksAccordionContainer');
    const badgeTotal = document.getElementById('tasksTotalBadge');

    let totalTasksCount = 0;
    let totalDoneCount = 0;

    tasks.forEach(g => {
      (g.items || []).forEach(item => {
        totalTasksCount++;
        if (item.done) totalDoneCount++;
      });
    });

    if (badgeTotal) badgeTotal.textContent = `${totalDoneCount}/${totalTasksCount} Eylem Tamamlandı`;
    if (!container) return;

    container.innerHTML = tasks.map(g => {
      const items = g.items || [];
      const doneCount = items.filter(i => i.done).length;
      const totalCount = items.length;
      const isOpen = this.openTaskGroups[g.id] !== false;

      let iconBadge = g.iconType === 'pin' ? '📌' : '📅';

      const itemsHtml = items.map((item, idx) => `
        <div onclick="Portal.toggleTaskItem('${g.id}', ${idx}, event)" class="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-850 transition-colors cursor-pointer group/task">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-4 h-4 rounded-md flex items-center justify-center border transition-all ${item.done ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black text-[10px]' : 'border-slate-600 group-hover/task:border-blue-400'}">
              ${item.done ? '✓' : ''}
            </div>
            <span class="text-xs ${item.done ? 'line-through text-slate-500 font-normal' : 'text-slate-200 font-medium'} truncate">${this.escapeHtml(item.text)}</span>
          </div>
          <button onclick="Portal.deleteTaskItem('${g.id}', ${idx}, event)" title="Görevi Sil" class="opacity-0 group-hover/task:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        </div>
      `).join('');

      return `
        <div class="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden transition-all shadow-md">
          <div onclick="Portal.toggleTaskGroup('${g.id}')" class="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-850 transition-colors select-none">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-base flex-shrink-0">${iconBadge}</span>
              <span class="font-bold text-xs text-white uppercase tracking-tight truncate">${this.escapeHtml(g.title)}</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0 text-slate-400 text-xs font-mono">
              <span class="${doneCount === totalCount && totalCount > 0 ? 'text-emerald-400 font-bold' : ''}">${doneCount}/${totalCount}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}"></i>
            </div>
          </div>

          <div class="${isOpen ? 'block' : 'hidden'} p-3 pt-1 border-t border-slate-800/60 space-y-2 bg-slate-950/60">
            <div class="space-y-1">
              ${itemsHtml || '<p class="text-xs text-slate-500 italic p-2">Henüz eylem eklenmedi...</p>'}
            </div>
            <div class="pt-1 flex items-center gap-2">
              <input type="text" onkeydown="Portal.addTaskToGroup('${g.id}', this, event)" placeholder="+ Yeni eylem yaz ve Enter'a bas..." class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 font-sans">
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  toggleTaskGroup(id) {
    this.openTaskGroups[id] = this.openTaskGroups[id] === false ? true : false;
    this.loadTasks();
  },

  toggleAllTaskGroups() {
    const tasks = this.getLocalTasks();
    const hasClosed = tasks.some(g => this.openTaskGroups[g.id] === false);
    tasks.forEach(g => { this.openTaskGroups[g.id] = hasClosed ? true : false; });
    this.loadTasks();
  },

  toggleTaskItem(groupId, itemIdx, event) {
    if (event) event.stopPropagation();
    let tasks = this.getLocalTasks();
    const group = tasks.find(g => g.id === groupId);
    if (!group || !group.items || !group.items[itemIdx]) return;

    group.items[itemIdx].done = !group.items[itemIdx].done;
    this.playAudioFeedback(group.items[itemIdx].done ? 'complete' : 'click');
    this.saveLocalTasks(tasks);
    this.loadTasks();
  },

  deleteTaskItem(groupId, itemIdx, event) {
    if (event) event.stopPropagation();
    let tasks = this.getLocalTasks();
    const group = tasks.find(g => g.id === groupId);
    if (!group || !group.items) return;

    group.items.splice(itemIdx, 1);
    this.saveLocalTasks(tasks);
    this.loadTasks();
    this.toast('Eylem silindi', 'info');
  },

  addTaskToGroup(groupId, inputEl, event) {
    if (event.key === 'Enter') {
      const text = inputEl.value.trim();
      if (!text) return;

      let tasks = this.getLocalTasks();
      const group = tasks.find(g => g.id === groupId);
      if (!group) return;

      if (!group.items) group.items = [];
      group.items.push({ text, done: false });
      this.saveLocalTasks(tasks);
      inputEl.value = '';
      this.loadTasks();
      this.playAudioFeedback('click');
      this.toast('Yeni eylem kaydedildi! 🎯', 'success');
    }
  },

  openNewTaskModal() {
    const titleInput = document.getElementById('newTaskGroupTitle');
    const firstItem = document.getElementById('newTaskFirstItem');
    if (titleInput) titleInput.value = '';
    if (firstItem) firstItem.value = '';
    this.openModal('newTaskModal');
    setTimeout(() => { if (titleInput) titleInput.focus(); }, 100);
  },

  handleCreateTaskGroup(e) {
    if (e) e.preventDefault();
    const title = document.getElementById('newTaskGroupTitle').value.trim();
    const firstText = document.getElementById('newTaskFirstItem').value.trim();
    if (!title) return;

    let tasks = this.getLocalTasks();
    tasks.push({
      id: 'tg_' + Date.now(),
      title,
      iconType: 'pin',
      items: firstText ? [{ text: firstText, done: false }] : []
    });

    this.openTaskGroups[tasks[tasks.length - 1].id] = true;
    this.saveLocalTasks(tasks);
    this.closeModal('newTaskModal');
    this.loadTasks();
    this.playAudioFeedback('complete');
    this.toast(`"${title}" grubu oluşturuldu!`, 'success');
  },

  // ==========================================================
  // 5. NOTLAR (NOTION) DOKÜMANTASYON MOTORU
  // ==========================================================
  getLocalNotes() {
    try {
      const stored = localStorage.getItem('portal_notion_notes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    const initial = [
      {
        id: 'note_welcome',
        title: 'Kişisel Strateji & Düşünce Notları 🚀',
        content: 'Buraya serbest düşüncelerinizi, toplantı notlarınızı ve vizyon planlarınızı Notion blokları şeklinde kaydedebilirsiniz.',
        icon: '✨',
        color: 'amber',
        pinned: 1,
        updated_at: new Date().toISOString()
      }
    ];
    this.safeSetItem('portal_notion_notes', JSON.stringify(initial));
    return initial;
  },

  saveLocalNotes(notes) {
    this.safeSetItem('portal_notion_notes', JSON.stringify(notes));
    this.updateProductivityHUD();
  },

  quickPinNote(id, event) {
    if (event) event.stopPropagation();
    let notes = this.getLocalNotes();
    notes = notes.map(n => n.id === id ? { ...n, pinned: n.pinned == 1 ? 0 : 1, updated_at: new Date().toISOString() } : n);
    this.saveLocalNotes(notes);
    this.loadNotes();
    this.toast('Sabitleme durumu güncellendi', 'info');
  },

  quickDeleteNote(id, event) {
    if (event) event.stopPropagation();
    if (!confirm('Bu dokümanı silmek istediğinize emin misiniz?')) return;
    let notes = this.getLocalNotes();
    notes = notes.filter(n => n.id !== id);
    this.saveLocalNotes(notes);
    this.loadNotes();
    this.toast('Doküman silindi', 'info');
  },

  toggleWidgetSearch() {
    const box = document.getElementById('widgetSearchBox');
    if (!box) return;
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
      const input = document.getElementById('noteSearchInput');
      if (input) input.focus();
    }
  },

  toggleSortNotes() {
    this.sortDescending = !this.sortDescending;
    this.loadNotes();
    this.toast(this.sortDescending ? 'Yeniden Eskiye Sıralandı' : 'Eskiden Yeniye Sıralandı', 'info');
  },

  setNoteFilterTab(tab) {
    this.noteFilterTab = tab;
    const btnActive = document.getElementById('filterTabActive');
    const btnPinned = document.getElementById('filterTabPinned');

    if (tab === 'active') {
      if (btnActive) btnActive.className = 'p-1.5 rounded-lg bg-blue-600 text-white transition-colors';
      if (btnPinned) btnPinned.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors';
    } else {
      if (btnActive) btnActive.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors';
      if (btnPinned) btnPinned.className = 'p-1.5 rounded-lg bg-amber-500 text-slate-950 transition-colors';
    }

    this.loadNotes();
  },

  filterNotes() {
    const input = document.getElementById('noteSearchInput');
    this.searchQuery = input ? input.value.trim().toLowerCase() : '';
    this.loadNotes();
  },

  loadNotes() {
    let notes = this.getLocalNotes();

    const countHeader = document.getElementById('notesWidgetCount');
    const countSub = document.getElementById('notesSubBadgeCount');
    if (countHeader) countHeader.textContent = `${notes.length} Doküman`;
    if (countSub) countSub.textContent = notes.length;

    if (this.noteFilterTab === 'pinned') {
      notes = notes.filter(n => n.pinned == 1);
    }

    if (this.searchQuery) {
      notes = notes.filter(n => 
        (n.title && n.title.toLowerCase().includes(this.searchQuery)) ||
        (n.content && n.content.toLowerCase().includes(this.searchQuery))
      );
    }

    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      const timeA = new Date(a.updated_at).getTime();
      const timeB = new Date(b.updated_at).getTime();
      return this.sortDescending ? timeB - timeA : timeA - timeB;
    });

    const grid = document.getElementById('notionNotesGrid');
    if (!grid) return;

    if (notes.length === 0) {
      grid.innerHTML = `
        <div class="py-14 text-center flex flex-col items-center justify-center space-y-3">
          <span class="text-4xl block select-none opacity-40">✨</span>
          <h3 class="text-sm font-bold text-slate-300">Henüz bir doküman yok</h3>
          <p class="text-xs text-slate-500 max-w-xs leading-relaxed">
            Yeni bir zihin dokümanı başlatmak için sağ üstteki (+) butonuna tıklayın.
          </p>
          <button onclick="Portal.openNewNoteDrawer()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/20">
            + Yeni Doküman Başlat
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = notes.map(n => {
      const dateStr = new Date(n.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

      return `
        <div onclick="Portal.openEditNoteDrawer('${n.id}')" class="group p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[140px]">
          <div>
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="text-xl flex-shrink-0">${n.icon || '📝'}</span>
                <h4 class="font-bold text-sm text-slate-100 group-hover:text-white truncate tracking-tight">${this.escapeHtml(n.title || 'Başlıksız Doküman')}</h4>
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="Portal.quickPinNote('${n.id}', event)" title="Sabitle" class="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 ${n.pinned == 1 ? 'text-amber-400' : 'text-slate-400'}">
                  <i data-lucide="pin" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="Portal.quickDeleteNote('${n.id}', event)" title="Sil" class="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
            
            <p class="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed line-clamp-3 font-sans mt-1">
              ${this.escapeHtml(n.content || 'Boş doküman içeriği...')}
            </p>
          </div>

          <div class="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
            <span>${dateStr}</span>
            <span class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold">
              Düzenle <i data-lucide="chevron-right" class="w-3 h-3"></i>
            </span>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================
  // 6. 📈 BORSA, PORTFÖY & HALKA ARZ MOTORU (MİDAS LEVEL)
  // ==========================================================
  async loadFinanceData() {
    try {
      // Önce anında yerel veriyi render et (Sıfır bekleme)
      const fallback = this.getLocalFallbackFinance();
      this.renderFinanceUI(fallback);

      // Sonra arkada sessizce API'yi sorgula
      const res = await this.api('finance&action=summary');
      if (res && res.success && res.data) {
        this.renderFinanceUI(res.data);
      }
    } catch (e) {
      console.warn('Finans yükleme uyarısı:', e);
    }
  },

  renderFinanceUI(data) {
    const totalValEl = document.getElementById('financeTotalValue');
    const totalCostEl = document.getElementById('financeTotalCost');
    const totalProfitEl = document.getElementById('financeTotalProfit');
    const profitPercentEl = document.getElementById('financeProfitPercent');
    const assetCountEl = document.getElementById('financeAssetCount');

    if (totalValEl) totalValEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.total_value || 0);
    if (totalCostEl) totalCostEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.total_cost || 0);
    
    const profit = data.total_profit || 0;
    const profitPercent = data.total_profit_percent || 0;
    const isPositive = profit >= 0;

    if (totalProfitEl) {
      totalProfitEl.textContent = (isPositive ? '+' : '') + new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(profit);
      totalProfitEl.className = `text-xl font-extrabold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`;
    }

    if (profitPercentEl) {
      profitPercentEl.textContent = (isPositive ? '+' : '') + `%${Number(profitPercent).toFixed(2)}`;
      profitPercentEl.className = `text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${isPositive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`;
    }

    if (assetCountEl) assetCountEl.textContent = `${(data.assets || []).length} Varlık`;

    // Piyasa Tickerları
    const tickerContainer = document.getElementById('financeMarketTickers');
    if (tickerContainer) {
      const marketItems = [
        { name: 'BIST 100', val: '9.842,50 ₺', change: '+1.85%', up: true },
        { name: 'Gram Altın', val: '2.850,20 ₺', change: '+0.92%', up: true },
        { name: 'USD / TRY', val: '34,18 ₺', change: '+0.08%', up: true },
        { name: 'Bitcoin', val: '$58.450', change: '+3.12%', up: true }
      ];

      tickerContainer.innerHTML = marketItems.map(m => `
        <div class="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${m.up ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}"></span>
            <span class="text-xs font-bold text-slate-200">${m.name}</span>
          </div>
          <div class="flex items-center gap-2 font-mono text-xs">
            <span class="text-white font-semibold">${m.val}</span>
            <span class="text-[11px] font-bold ${m.up ? 'text-emerald-400' : 'text-rose-400'}">${m.change}</span>
          </div>
        </div>
      `).join('');
    }

    // Tablo
    const tableBody = document.getElementById('portfolioTableBody');
    if (tableBody) {
      if (!data.assets || data.assets.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">Portföyünüzde henüz bir hisse bulunmuyor.</td></tr>`;
      } else {
        tableBody.innerHTML = data.assets.map(a => {
          const isAssetProfitable = a.profit >= 0;
          return `
            <tr class="hover:bg-slate-850/50 transition-colors">
              <td class="py-3 px-2 font-bold text-white flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-[10px] font-black">${a.symbol.slice(0, 2)}</span>
                <span>${a.symbol}</span>
              </td>
              <td class="py-3 px-2 font-mono text-slate-300">${a.shares}</td>
              <td class="py-3 px-2 font-mono text-slate-400">${Number(a.buy_price).toFixed(2)} ₺</td>
              <td class="py-3 px-2 font-mono text-white font-semibold">${Number(a.current_price).toFixed(2)} ₺</td>
              <td class="py-3 px-2 font-mono font-bold text-slate-100">${Number(a.current_value).toFixed(2)} ₺</td>
              <td class="py-3 px-2 font-mono font-bold ${isAssetProfitable ? 'text-emerald-400' : 'text-rose-400'}">
                ${isAssetProfitable ? '+' : ''}${Number(a.profit).toFixed(2)} ₺ (%${Number(a.profit_percent).toFixed(2)})
              </td>
              <td class="py-3 px-2 text-right">
                <button onclick="Portal.deleteAsset('${a.id}')" title="Varlığı Sil" class="p-1 text-slate-500 hover:text-rose-400 transition-colors">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Halka Arzlar
    const ipoContainer = document.getElementById('ipoListContainer');
    if (ipoContainer && data.ipos) {
      ipoContainer.innerHTML = data.ipos.map(ipo => `
        <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-purple-500/20 hover:border-purple-500/40 transition space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-xs text-white font-mono bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30 text-purple-300">${ipo.code}</span>
            <span class="text-[10px] font-mono text-emerald-400 font-bold">${ipo.price}</span>
          </div>
          <h4 class="text-xs font-bold text-slate-200 line-clamp-1">${ipo.name}</h4>
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
            <span>📅 ${ipo.date}</span>
            <span class="text-indigo-300">${ipo.distribution}</span>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  },

  getLocalFallbackFinance() {
    return {
      total_value: 65420.00,
      total_cost: 58000.00,
      total_profit: 7420.00,
      total_profit_percent: 12.79,
      assets: [
        { id: 'p_1', symbol: 'THYAO', shares: 150, buy_price: 280.50, current_price: 294.50, current_value: 44175.00, cost: 42075.00, profit: 2100.00, profit_percent: 4.99 },
        { id: 'p_2', symbol: 'ASELS', shares: 200, buy_price: 58.20, current_price: 62.80, current_value: 12560.00, cost: 11640.00, profit: 920.00, profit_percent: 7.90 },
        { id: 'p_3', symbol: 'ALTIN_GRAM', shares: 15, buy_price: 2650.00, current_price: 2850.20, current_value: 42753.00, cost: 39750.00, profit: 3003.00, profit_percent: 7.55 }
      ],
      ipos: [
        { code: 'DURK', name: 'Durukan Şekerleme Sanayi', date: '11 - 12 Eylül', price: '17.00 ₺', distribution: 'Tamamı Eşit' },
        { code: 'GNDES', name: 'Gündoğdu Gıda Süt Ürünleri', date: '15 - 16 Eylül', price: '35.00 ₺', distribution: 'Bireysele Eşit' }
      ]
    };
  },

  
  // ==========================================================
  // 6.1 CANLI HİSSE & EMTİA KATALOĞU (MİDAS AUTOCOMPLETE)
  // ==========================================================
  bistCatalog: [
    { symbol: 'THYAO', name: 'Türk Hava Yolları', price: 312.50, sector: 'Ulaştırma', change: '+2.14%' },
    { symbol: 'ASELS', name: 'Aselsan Savunma Sanayii', price: 64.80, sector: 'Savunma', change: '+1.80%' },
    { symbol: 'GARAN', name: 'Garanti BBVA', price: 122.40, sector: 'Bankacılık', change: '+0.75%' },
    { symbol: 'AKBNK', name: 'Akbank T.A.Ş.', price: 58.90, sector: 'Bankacılık', change: '-0.30%' },
    { symbol: 'ISCTR', name: 'Türkiye İş Bankası (C)', price: 14.85, sector: 'Bankacılık', change: '+1.20%' },
    { symbol: 'YKBNK', name: 'Yapı ve Kredi Bankası', price: 32.10, sector: 'Bankacılık', change: '+0.50%' },
    { symbol: 'TUPRS', name: 'Tüpraş Petrol Rafinerileri', price: 172.30, sector: 'Enerji / Petrol', change: '+1.45%' },
    { symbol: 'KCHOL', name: 'Koç Holding', price: 218.00, sector: 'Holding', change: '+0.90%' },
    { symbol: 'SAHOL', name: 'Sabancı Holding', price: 96.50, sector: 'Holding', change: '+1.10%' },
    { symbol: 'EREGL', name: 'Ereğli Demir ve Çelik', price: 52.40, sector: 'Demir Çelik', change: '-0.40%' },
    { symbol: 'SISE', name: 'Şişecam Fabrikaları', price: 48.60, sector: 'Sanayi / Cam', change: '+0.80%' },
    { symbol: 'BIMAS', name: 'BİM Birleşik Mağazalar', price: 545.00, sector: 'Perakende', change: '+1.60%' },
    { symbol: 'MGROS', name: 'Migros Ticaret', price: 492.50, sector: 'Perakende', change: '+2.40%' },
    { symbol: 'FROTO', name: 'Ford Otosan', price: 1085.00, sector: 'Otomotiv', change: '+0.60%' },
    { symbol: 'TOASO', name: 'Tofaş Türk Otomobil', price: 235.00, sector: 'Otomotiv', change: '-1.10%' },
    { symbol: 'ASTOR', name: 'Astor Enerji', price: 94.20, sector: 'Enerji', change: '+3.20%' },
    { symbol: 'PETKM', name: 'Petkim Petrokimya', price: 22.80, sector: 'Kimya', change: '+0.40%' },
    { symbol: 'SASA', name: 'Sasa Polyester', price: 4.85, sector: 'Kimya', change: '-0.80%' },
    { symbol: 'EKGYO', name: 'Emlak Konut GYO', price: 11.20, sector: 'GYO', change: '+2.00%' },
    { symbol: 'PGSUS', name: 'Pegasus Hava Taşımacılığı', price: 242.00, sector: 'Ulaştırma', change: '+1.90%' },
    { symbol: 'ALTIN_GRAM', name: 'Gram Altın (24 Ayar)', price: 2865.40, sector: 'Kıymetli Maden', change: '+0.85%' },
    { symbol: 'CEYREK_ALTIN', name: 'Çeyrek Altın', price: 4680.00, sector: 'Kıymetli Maden', change: '+0.85%' },
    { symbol: 'USD_TRY', name: 'Amerikan Doları / TL', price: 34.22, sector: 'Döviz', change: '+0.12%' },
    { symbol: 'EUR_TRY', name: 'Euro / TL', price: 37.85, sector: 'Döviz', change: '+0.18%' },
    { symbol: 'BTC_USD', name: 'Bitcoin / USD', price: 59200.00, sector: 'Kripto', change: '+2.80%' }
  ],

  handleStockSearch(query) {
    const dropdown = document.getElementById('stockSearchDropdown');
    if (!dropdown) return;

    query = (query || '').trim().toLowerCase();
    let matches = this.bistCatalog;
    if (query) {
      matches = this.bistCatalog.filter(s => 
        s.symbol.toLowerCase().includes(query) || 
        s.name.toLowerCase().includes(query) ||
        s.sector.toLowerCase().includes(query)
      );
    }

    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="p-4 text-center text-slate-500 text-xs">Eşleşen hisse veya varlık bulunamadı.</div>`;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = matches.map(s => `
      <div 
        onclick="Portal.selectStockAsset('${s.symbol}', '${this.escapeHtml(s.name)}', ${s.price})" 
        class="p-3 hover:bg-slate-850 cursor-pointer flex items-center justify-between transition-colors group"
      >
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center font-mono text-xs font-black transition-colors">
            ${s.symbol.slice(0, 2)}
          </span>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-white text-xs">${s.symbol}</span>
              <span class="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">${s.sector}</span>
            </div>
            <p class="text-[11px] text-slate-400 truncate max-w-[200px]">${s.name}</p>
          </div>
        </div>
        <div class="text-right font-mono">
          <div class="text-xs font-bold text-white">${Number(s.price).toFixed(2)} ₺</div>
          <span class="text-[10px] font-bold ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${s.change}</span>
        </div>
      </div>
    `).join('');

    dropdown.classList.remove('hidden');
  },

  selectStockAsset(symbol, name, price) {
    const symbolInput = document.getElementById('assetSymbolInput');
    const searchInput = document.getElementById('assetSearchInput');
    const buyPriceInput = document.getElementById('assetBuyPriceInput');
    const dropdown = document.getElementById('stockSearchDropdown');
    const selectedCard = document.getElementById('selectedAssetCard');
    const selectedBadge = document.getElementById('selectedAssetBadge');
    const selectedName = document.getElementById('selectedAssetName');
    const selectedPrice = document.getElementById('selectedAssetPrice');

    if (symbolInput) symbolInput.value = symbol;
    if (searchInput) searchInput.value = `${symbol} - ${name}`;
    if (buyPriceInput) buyPriceInput.value = Number(price).toFixed(2);
    if (dropdown) dropdown.classList.add('hidden');

    if (selectedCard) {
      selectedCard.classList.remove('hidden');
      if (selectedBadge) selectedBadge.textContent = symbol.slice(0, 2);
      if (selectedName) selectedName.textContent = `${symbol} — ${name}`;
      if (selectedPrice) selectedPrice.textContent = `Güncel Piyasa Fiyatı: ${Number(price).toFixed(2)} ₺`;
    }

    const sharesInput = document.getElementById('assetSharesInput');
    if (sharesInput) {
      sharesInput.focus();
      sharesInput.select();
    }
    this.playAudioFeedback('click');
  },

openAddAssetModal() {
    const searchInput = document.getElementById('assetSearchInput');
    const symbolInput = document.getElementById('assetSymbolInput');
    const sharesInput = document.getElementById('assetSharesInput');
    const buyPriceInput = document.getElementById('assetBuyPriceInput');
    const selectedCard = document.getElementById('selectedAssetCard');
    const dropdown = document.getElementById('stockSearchDropdown');

    if (searchInput) searchInput.value = '';
    if (symbolInput) symbolInput.value = '';
    if (sharesInput) sharesInput.value = '100';
    if (buyPriceInput) buyPriceInput.value = '';
    if (selectedCard) selectedCard.classList.add('hidden');
    if (dropdown) dropdown.classList.add('hidden');

    this.openModal('addAssetModal');
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
        this.handleStockSearch('');
      }
    }, 100);
  },

    const symbolInp = document.getElementById('assetSymbolInput');
    const sharesInp = document.getElementById('assetSharesInput');
    const buyPriceInp = document.getElementById('assetBuyPriceInput');
    if (symbolInp) symbolInp.value = '';
    if (sharesInp) sharesInp.value = '';
    if (buyPriceInp) buyPriceInp.value = '';
    this.openModal('addAssetModal');
    setTimeout(() => { if (symbolInp) symbolInp.focus(); }, 100);
  },

  async handleSaveAsset(e) {
    if (e) e.preventDefault();
    const symbol = document.getElementById('assetSymbolInput').value.trim().toUpperCase();
    const shares = parseFloat(document.getElementById('assetSharesInput').value);
    const buy_price = parseFloat(document.getElementById('assetBuyPriceInput').value);

    if (!symbol || isNaN(shares) || isNaN(buy_price) || shares <= 0 || buy_price <= 0) {
      this.toast('Lütfen geçerli hisse, lot ve maliyet girin', 'error');
      return;
    }

    await this.api('finance&action=add_asset', {
      method: 'POST',
      body: JSON.stringify({ symbol, shares, buy_price })
    });

    this.closeModal('addAssetModal');
    this.playAudioFeedback('complete');
    this.toast(`${symbol} portföye eklendi! 📈`, 'success');
    this.loadFinanceData();
  },

  async deleteAsset(id) {
    if (!confirm('Bu varlığı portföyden silmek istediğinize emin misiniz?')) return;
    await this.api('finance&action=delete_asset', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
    this.toast('Varlık portföyden silindi', 'info');
    this.loadFinanceData();
  },

  // ==========================================================
  // 7. METRİKLER & HUD
  // ==========================================================
  updateProductivityHUD() {
    try {
      const tasks = this.getLocalTasks();
      const notes = this.getLocalNotes();

      let totalTasks = 0;
      let completedTasks = 0;

      tasks.forEach(g => {
        (g.items || []).forEach(item => {
          totalTasks++;
          if (item.done) completedTasks++;
        });
      });

      const scoreEl = document.getElementById('statMomentumScore');
      const tasksEl = document.getElementById('statCompletedTasks');
      const notesEl = document.getElementById('statTotalNotes');

      if (tasksEl) tasksEl.textContent = `${completedTasks} / ${totalTasks}`;
      if (notesEl) notesEl.textContent = `${notes.length} Doküman`;

      if (scoreEl) {
        if (totalTasks === 0) {
          scoreEl.textContent = '%100 Hazır';
        } else {
          const ratio = Math.round((completedTasks / totalTasks) * 100);
          scoreEl.textContent = `%${ratio} Momentum`;
          scoreEl.className = `text-xl font-extrabold font-mono mt-0.5 block ${ratio >= 70 ? 'text-emerald-400' : ratio >= 40 ? 'text-amber-400' : 'text-blue-400'}`;
        }
      }
    } catch (e) {}
  },

  // ==========================================================
  // 8. SOL MENÜ YÖNETİMİ
  // ==========================================================
  getLocalMenus() {
    return [
      { id: 'dashboard', label: 'Ana Sayfa & Matris', icon: 'layout-dashboard', is_active: 1, desc: 'Eylem, not ve borsa çalışma alanı' },
      { id: 'finance', label: 'Borsa & Portföy Terminali', icon: 'trending-up', is_active: 1, desc: 'Canlı BIST, Kâr/Zarar ve Halka Arz' },
      { id: 'admin', label: 'Geliştirici & Modüller', icon: 'terminal', is_active: 1, desc: 'Sayfa ve modül yapılandırma merkezi' }
    ];
  },

  renderSidebarNav() {
    const nav = document.getElementById('sidebarNavList');
    if (!nav) return;

    const menus = this.getLocalMenus();
    nav.innerHTML = menus.map(m => {
      const isActive = this.currentTab === m.id;
      return `
        <button 
          onclick="Portal.switchTab('${m.id}')" 
          id="nav-btn-${m.id}" 
          title="${this.escapeHtml(m.label)}" 
          class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'active-nav bg-blue-600/15 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}"
        >
          <i data-lucide="${m.icon || 'folder'}" class="w-4 h-4 flex-shrink-0 ${m.id === 'finance' ? 'text-emerald-400' : m.id === 'admin' ? 'text-purple-400' : ''}"></i>
          <span class="truncate sidebar-text">${this.escapeHtml(m.label)}</span>
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30'));

    let tabEl = document.getElementById('tab-' + tabId);
    if (tabEl) tabEl.classList.remove('hidden');

    const navBtn = document.getElementById('nav-btn-' + tabId);
    if (navBtn) navBtn.classList.add('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30');

    if (tabId === 'finance') {
      this.loadFinanceData();
    }

    this.closeMobileSidebar();
    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================
  // 9. DOKÜMAN DÜZENLEME & ÇEKMECE
  // ==========================================================
  handleContentInput(textarea) {
    try {
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight) + 'px';
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = textarea.value.length;
      const countEl = document.getElementById('drawerWordCount');
      if (countEl) countEl.textContent = `${words} kelime • ${chars} karakter`;
    } catch (e) {}
  },

  openNewNoteDrawer() {
    document.getElementById('drawerNoteId').value = '';
    document.getElementById('drawerNoteTitle').value = '';
    const contentArea = document.getElementById('drawerNoteContent');
    contentArea.value = '';
    contentArea.style.height = 'auto';
    document.getElementById('drawerNoteColor').value = 'amber';
    document.getElementById('drawerNotePinned').value = '0';
    document.getElementById('noteDrawerEmojiBtn').textContent = '📝';
    document.getElementById('drawerDeleteBtn').classList.add('hidden');
    document.getElementById('drawerWordCount').textContent = '0 kelime • 0 karakter';
    this.showNoteDrawer();
  },

  openEditNoteDrawer(id) {
    const notes = this.getLocalNotes();
    const n = notes.find(item => item.id === id);
    if (!n) return;

    document.getElementById('drawerNoteId').value = n.id;
    document.getElementById('drawerNoteTitle').value = n.title;
    const contentArea = document.getElementById('drawerNoteContent');
    contentArea.value = n.content || '';
    document.getElementById('drawerNoteColor').value = n.color || 'amber';
    document.getElementById('drawerNotePinned').value = n.pinned || '0';
    document.getElementById('noteDrawerEmojiBtn').textContent = n.icon || '📝';
    document.getElementById('drawerDeleteBtn').classList.remove('hidden');

    this.handleContentInput(contentArea);
    this.showNoteDrawer();
  },

  showNoteDrawer() {
    const drawer = document.getElementById('notionDrawer');
    const content = document.getElementById('notionDrawerContent');
    if (!drawer || !content) return;
    drawer.classList.remove('hidden');
    setTimeout(() => { content.classList.remove('translate-x-full'); }, 10);
    setTimeout(() => { document.getElementById('drawerNoteTitle').focus(); }, 100);
  },

  closeNoteDrawer() {
    const drawer = document.getElementById('notionDrawer');
    const content = document.getElementById('notionDrawerContent');
    if (!drawer || !content) return;
    content.classList.add('translate-x-full');
    setTimeout(() => { drawer.classList.add('hidden'); }, 250);
  },

  cycleNoteIcon() {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.noteIcons.length;
    document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[this.currentIconIndex];
  },

  setDrawerColor(color) {
    document.getElementById('drawerNoteColor').value = color;
    this.toast(`Renk "${color}" olarak seçildi`, 'info');
  },

  toggleDrawerPin() {
    const pinInput = document.getElementById('drawerNotePinned');
    const newVal = pinInput.value === '1' ? '0' : '1';
    pinInput.value = newVal;
    this.toast(newVal === '1' ? 'Doküman tepeye sabitlendi' : 'Sabitleme kaldırıldı', 'info');
  },

  saveDrawerNote(e) {
    if (e) e.preventDefault();
    try {
      const id = document.getElementById('drawerNoteId').value;
      const title = document.getElementById('drawerNoteTitle').value.trim();
      const content = document.getElementById('drawerNoteContent').value.trim();
      const icon = document.getElementById('noteDrawerEmojiBtn').textContent.trim();
      const color = document.getElementById('drawerNoteColor').value;
      const pinned = parseInt(document.getElementById('drawerNotePinned').value) || 0;

      let notes = this.getLocalNotes();

      if (id) {
        notes = notes.map(n => n.id === id ? { ...n, title: title || 'Başlıksız Doküman', content, icon, color, pinned, updated_at: new Date().toISOString() } : n);
      } else {
        notes.unshift({
          id: 'note_' + Date.now(),
          title: title || 'Başlıksız Doküman',
          content,
          icon,
          color,
          pinned,
          updated_at: new Date().toISOString()
        });
      }

      this.saveLocalNotes(notes);
      this.closeNoteDrawer();
      this.loadNotes();
      this.playAudioFeedback('complete');
      this.toast(id ? 'Doküman güncellendi' : 'Yeni doküman oluşturuldu', 'success');
    } catch (err) {
      console.error('Kaydetme hatası:', err);
    }
  },

  deleteDrawerNote() {
    const id = document.getElementById('drawerNoteId').value;
    if (!id || !confirm('Bu dokümanı silmek istediğinize emin misiniz?')) return;

    let notes = this.getLocalNotes();
    notes = notes.filter(n => n.id !== id);
    this.saveLocalNotes(notes);
    this.closeNoteDrawer();
    this.loadNotes();
    this.toast('Doküman silindi', 'info');
  },

  // ==========================================================
  // 10. SAAT & AUTH & MODAL
  // ==========================================================
  initClock() {
    const update = () => {
      const now = new Date();
      const clock = document.getElementById('liveClock');
      const date = document.getElementById('liveDate');
      if (clock) clock.textContent = now.toLocaleTimeString('tr-TR');
      if (date) date.textContent = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    update();
    setInterval(update, 1000);
  },

  checkPersistentAuth() {
    const overlay = document.getElementById('gatewayOverlay');
    const badgeName = document.getElementById('headerUserName');
    if (overlay) overlay.classList.add('hidden');
    if (badgeName) badgeName.textContent = 'Sistem Yöneticisi';
  },

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      try {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          const qInput = document.getElementById('quickCaptureInput');
          if (qInput) { qInput.focus(); qInput.select(); }
        }
        if (e.key === 'Escape') {
          const drawer = document.getElementById('notionDrawer');
          if (drawer && !drawer.classList.contains('hidden')) this.closeNoteDrawer();
          const taskModal = document.getElementById('newTaskModal');
          if (taskModal && !taskModal.classList.contains('hidden')) this.closeModal('newTaskModal');
          const assetModal = document.getElementById('addAssetModal');
          if (assetModal && !assetModal.classList.contains('hidden')) this.closeModal('addAssetModal');
        }
      } catch (err) {}
    });
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

  toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar) return;
    if (window.innerWidth < 1024) {
      sidebar.classList.toggle('-translate-x-full');
      const overlay = document.getElementById('sidebarOverlay');
      if (overlay) overlay.classList.toggle('hidden');
    } else {
      sidebar.classList.toggle('sidebar-collapsed');
    }
  },

  closeMobileSidebar() {
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById('mainSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  },

  async api(endpoint, options = {}) {
    try {
      const res = await fetch(`/api/index.php?endpoint=${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      const json = await res.json();
      return json;
    } catch (e) {
      return { success: false, message: 'Sunucu bağlantısı yok' };
    }
  },

  toast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl transition-all duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }
};

// Sayfa Yüklendiğinde Doğrudan Başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.Portal.init());
} else {
  window.Portal.init();
}
