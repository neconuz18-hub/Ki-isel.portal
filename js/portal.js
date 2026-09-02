/**
 * Personal OS Enterprise v4.3 — Absolute Zero-Crash Architecture
 */
window.Portal = {
  version: '4.3.0',
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  searchQuery: '',
  noteFilterTab: 'active',
  sortDescending: true,
  openTaskGroups: {},
  focusTimerState: {
    duration: 1500, remaining: 1500, isRunning: false, timerId: null, audioCtx: null, audioNodes: null, isAudioActive: false
  },
  bistCatalog: [
    { symbol: 'THYAO', name: 'Türk Hava Yolları', price: 312.50, sector: 'Ulaştırma', change: '+2.14%' },
    { symbol: 'ASELS', name: 'Aselsan Savunma', price: 64.80, sector: 'Savunma', change: '+1.80%' },
    { symbol: 'GARAN', name: 'Garanti BBVA', price: 122.40, sector: 'Bankacılık', change: '+0.75%' },
    { symbol: 'AKBNK', name: 'Akbank T.A.Ş.', price: 58.90, sector: 'Bankacılık', change: '-0.30%' },
    { symbol: 'ISCTR', name: 'Türkiye İş Bankası (C)', price: 14.85, sector: 'Bankacılık', change: '+1.20%' },
    { symbol: 'TUPRS', name: 'Tüpraş Petrol Rafinerileri', price: 172.30, sector: 'Enerji', change: '+1.45%' },
    { symbol: 'KCHOL', name: 'Koç Holding', price: 218.00, sector: 'Holding', change: '+0.90%' },
    { symbol: 'BIMAS', name: 'BİM Birleşik Mağazalar', price: 545.00, sector: 'Perakende', change: '+1.60%' },
    { symbol: 'ASTOR', name: 'Astor Enerji', price: 94.20, sector: 'Enerji', change: '+3.20%' },
    { symbol: 'ALTIN_GRAM', name: 'Gram Altın', price: 2865.40, sector: 'Emtia', change: '+0.85%' },
    { symbol: 'USD_TRY', name: 'Amerikan Doları', price: 34.22, sector: 'Döviz', change: '+0.12%' },
    { symbol: 'BTC_USD', name: 'Bitcoin', price: 59200.00, sector: 'Kripto', change: '+2.80%' }
  ],

  init() {
    console.log('[Personal OS]: Mükemmel Başlatma Döngüsü Aktif...');
    this.safeExec('Clock', () => this.initClock());
    this.safeExec('Auth', () => this.checkPersistentAuth());
    this.safeExec('Sidebar', () => this.renderSidebarNav());
    this.safeExec('Briefing', () => this.initDailyBriefing());
    this.safeExec('Tasks', () => this.loadTasks());
    this.safeExec('Notes', () => this.loadNotes());
    this.safeExec('Finance', () => this.loadFinanceData());
    this.safeExec('Keys', () => this.bindKeyboardShortcuts());
    this.safeExec('Icons', () => { if (window.lucide) window.lucide.createIcons(); });
    console.log('[Personal OS]: Sistem Başarıyla Yüklendi.');
  },

  safeExec(name, fn) {
    try { fn(); } catch (e) { console.error(`[Modül Hatası - ${name}]:`, e); }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },
  
  safeSetItem(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },

  playAudioFeedback(type = 'click') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (type === 'complete') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(); osc.stop(ctx.currentTime + 0.08);
      }
    } catch(e) {}
  },

  // --- BRIEFING & FOCUS ---
  initDailyBriefing() {
    const hour = new Date().getHours();
    let g = 'İyi Çalışmalar'; let b = 'Gündüz Döngüsü';
    if (hour >= 5 && hour < 12) { g = 'Günaydın, Harika Bir Gün Dilerim'; b = 'Sabah Strateji Döngüsü'; }
    else if (hour >= 12 && hour < 17) { g = 'İyi Günler, Üretken Saatler'; b = 'Öğleden Sonra İvmesi'; }
    else if (hour >= 17 && hour < 22) { g = 'İyi Akşamlar, Sayın Yöneticim'; b = 'Akşam Kapanış'; }
    else { g = 'İyi Geceler, Derin Odak'; b = 'Gece Odak Modu'; }
    const gel = document.getElementById('greetingText'); if (gel) gel.textContent = g;
    const bel = document.getElementById('briefingTimeBadge'); if (bel) bel.textContent = b;
  },

  toggleFocusTimer() { this.focusTimerState.isRunning ? this.pauseFocusTimer() : this.startFocusTimer(); },
  
  startFocusTimer() {
    this.focusTimerState.isRunning = true;
    document.getElementById('focusTimerBtnText').textContent = 'Duraklat';
    document.getElementById('focusTimerStartBtn').className = 'flex-1 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5';
    if (this.focusTimerState.isAudioActive) this.startGammaAudio();
    this.focusTimerState.timerId = setInterval(() => {
      if (this.focusTimerState.remaining > 0) { this.focusTimerState.remaining--; this.updateFocusTimerDisplay(); }
      else { this.completeFocusSprint(); }
    }, 1000);
    this.playAudioFeedback('click');
  },
  
  pauseFocusTimer() {
    this.focusTimerState.isRunning = false; clearInterval(this.focusTimerState.timerId); this.stopGammaAudio();
    document.getElementById('focusTimerBtnText').textContent = 'Devam Et';
    document.getElementById('focusTimerStartBtn').className = 'flex-1 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5';
  },
  
  resetFocusTimer() {
    this.focusTimerState.isRunning = false; clearInterval(this.focusTimerState.timerId); this.stopGammaAudio();
    this.focusTimerState.remaining = this.focusTimerState.duration; this.updateFocusTimerDisplay();
    document.getElementById('focusTimerBtnText').textContent = 'Başlat';
    document.getElementById('focusTimerStartBtn').className = 'flex-1 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5';
  },
  
  updateFocusTimerDisplay() {
    const min = Math.floor(this.focusTimerState.remaining / 60); const sec = this.focusTimerState.remaining % 60;
    const disp = document.getElementById('focusTimerDisplay');
    if (disp) disp.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },
  
  completeFocusSprint() { this.resetFocusTimer(); this.playAudioFeedback('complete'); this.toast('25 Dakikalık Derin Odak Tamamlandı! 🏆', 'success'); },
  
  toggleFocusAudio() {
    this.focusTimerState.isAudioActive = !this.focusTimerState.isAudioActive;
    const btn = document.getElementById('gammaAudioToggleBtn'); const txt = document.getElementById('gammaAudioText');
    if (this.focusTimerState.isAudioActive) {
      if (btn) btn.className = 'px-2 py-1 rounded-xl bg-purple-600 text-white text-[9px] font-mono font-bold flex items-center gap-1 shadow-lg';
      if (txt) txt.textContent = '40Hz Aktif';
      if (this.focusTimerState.isRunning) this.startGammaAudio();
      this.toast('40Hz Odak Sesi Açık', 'success');
    } else {
      if (btn) btn.className = 'px-2 py-1 rounded-xl bg-slate-800 text-purple-300 text-[9px] font-mono font-bold flex items-center gap-1';
      if (txt) txt.textContent = '40Hz Kapalı';
      this.stopGammaAudio();
    }
  },
  
  startGammaAudio() {
    try {
      if (this.focusTimerState.audioNodes) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext; if (!AudioCtx) return;
      const ctx = new AudioCtx(); const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain();
      o1.type = 'sine'; o1.frequency.value = 200; o2.type = 'sine'; o2.frequency.value = 240; g.gain.value = 0.03;
      o1.connect(g); o2.connect(g); g.connect(ctx.destination); o1.start(); o2.start();
      this.focusTimerState.audioCtx = ctx; this.focusTimerState.audioNodes = { o1, o2, g };
    } catch(e) {}
  },
  
  stopGammaAudio() {
    try {
      if (this.focusTimerState.audioNodes) {
        this.focusTimerState.audioNodes.o1.stop(); this.focusTimerState.audioNodes.o2.stop();
        this.focusTimerState.audioCtx.close(); this.focusTimerState.audioNodes = null; this.focusTimerState.audioCtx = null;
      }
    } catch(e) {}
  },

  // --- QUICK CAPTURE ---
  handleQuickCapture(event) {
    if (event.key === 'Enter') {
      const input = document.getElementById('quickCaptureInput'); if (!input || !input.value.trim()) return;
      const raw = input.value.trim(); const isNote = raw.toLowerCase().startsWith('not');
      const isUrgent = raw.includes('!acil'); const text = raw.replace(/^not:?\s*/i, '').replace(/!acil/gi, '').trim();
      
      if (isNote) {
        let n = this.getLocalNotes();
        n.unshift({ id: 'note_'+Date.now(), title: text.substring(0,30), content: text, icon: isUrgent?'🔥':'💡', color: 'amber', pinned: isUrgent?1:0, updated_at: new Date().toISOString() });
        this.saveLocalNotes(n); this.loadNotes(); this.toast('Doküman eklendi!', 'success');
      } else {
        let t = this.getLocalTasks();
        if (!t[0]) t.unshift({ id: 'tg_q', title: 'Hızlı Eylemler', iconType: 'pin', items: [] });
        t[0].items.unshift({ text: (isUrgent?'🔥 ':'')+text, done: false });
        this.saveLocalTasks(t); this.loadTasks(); this.toast('Eylem eklendi!', 'success');
      }
      input.value = ''; this.playAudioFeedback('complete');
    }
  },

  // --- TASKS ---
  getLocalTasks() {
    try {
      const s = localStorage.getItem('portal_tasks_data');
      if (s) return JSON.parse(s);
    } catch(e) {}
    const init = [{ id: 'tg_1', title: 'Öncelikli Eylemler & Odak', iconType: 'pin', items: [{text: 'Sistemi kur', done: true}, {text: 'Piyasaları incele', done: false}] }];
    this.safeSetItem('portal_tasks_data', JSON.stringify(init)); return init;
  },
  saveLocalTasks(t) { this.safeSetItem('portal_tasks_data', JSON.stringify(t)); this.updateHUD(); },
  loadTasks() {
    const t = this.getLocalTasks(); const c = document.getElementById('tasksAccordionContainer');
    let tc = 0; let dc = 0;
    t.forEach(g => { (g.items||[]).forEach(i => { tc++; if (i.done) dc++; }); });
    const bdg = document.getElementById('tasksTotalBadge'); if (bdg) bdg.textContent = `${tc} Eylem`;
    
    if (!c) return;
    c.innerHTML = t.map(g => {
      const itms = g.items || []; const dcnt = itms.filter(i=>i.done).length; const tcnt = itms.length;
      const isOpen = this.openTaskGroups[g.id] !== false;
      const itemsHtml = itms.map((item, idx) => `
        <div onclick="Portal.toggleTaskItem('${g.id}', ${idx})" class="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer group">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-black ${item.done ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-600 group-hover:border-blue-400'}">${item.done ? '✓' : ''}</div>
            <span class="text-xs ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}">${this.escapeHtml(item.text)}</span>
          </div>
          <button onclick="event.stopPropagation(); Portal.deleteTaskItem('${g.id}', ${idx})" class="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400"><i data-lucide="x" class="w-3 h-3"></i></button>
        </div>
      `).join('');
      return `
        <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div onclick="Portal.toggleTaskGroup('${g.id}')" class="p-3.5 flex justify-between cursor-pointer hover:bg-slate-800 transition">
            <div class="flex items-center gap-2.5"><span class="text-base">${g.iconType==='pin'?'📌':'📅'}</span><span class="font-bold text-xs text-white uppercase">${this.escapeHtml(g.title)}</span></div>
            <div class="flex items-center gap-2 text-xs font-mono text-slate-400"><span>${dcnt}/${tcnt}</span><i data-lucide="chevron-down" class="w-4 h-4 ${isOpen?'rotate-180 text-blue-400':''}"></i></div>
          </div>
          <div class="${isOpen?'block':'hidden'} p-3 pt-0 border-t border-slate-800 bg-slate-900/50">
            ${itemsHtml}
            <input type="text" onkeydown="Portal.addTaskToGroup('${g.id}', this, event)" placeholder="+ Yeni eylem..." class="w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>
      `;
    }).join('');
    this.updateHUD(); if (window.lucide) window.lucide.createIcons();
  },
  toggleTaskGroup(id) { this.openTaskGroups[id] = !this.openTaskGroups[id]; this.loadTasks(); },
  toggleTaskItem(gId, idx) { let t = this.getLocalTasks(); t.find(g=>g.id===gId).items[idx].done = !t.find(g=>g.id===gId).items[idx].done; this.saveLocalTasks(t); this.loadTasks(); this.playAudioFeedback(); },
  deleteTaskItem(gId, idx) { let t = this.getLocalTasks(); t.find(g=>g.id===gId).items.splice(idx, 1); this.saveLocalTasks(t); this.loadTasks(); },
  addTaskToGroup(gId, inp, e) {
    if (e.key === 'Enter' && inp.value.trim()) {
      let t = this.getLocalTasks(); t.find(g=>g.id===gId).items.push({text: inp.value.trim(), done: false});
      this.saveLocalTasks(t); inp.value = ''; this.loadTasks(); this.playAudioFeedback();
    }
  },

  // --- NOTES ---
  getLocalNotes() {
    try { const s = localStorage.getItem('portal_notion_notes'); if (s) return JSON.parse(s); } catch(e) {}
    const init = [{ id: 'n1', title: 'Strateji Dokümanı', content: 'Notion blokları buraya.', icon: '🚀', pinned: 1, updated_at: new Date().toISOString() }];
    this.safeSetItem('portal_notion_notes', JSON.stringify(init)); return init;
  },
  saveLocalNotes(n) { this.safeSetItem('portal_notion_notes', JSON.stringify(n)); this.updateHUD(); },
  loadNotes() {
    let n = this.getLocalNotes();
    document.getElementById('notesWidgetCount').textContent = `${n.length} Doküman`;
    document.getElementById('notesSubBadgeCount').textContent = n.length;
    if (this.noteFilterTab === 'pinned') n = n.filter(x => x.pinned);
    if (this.searchQuery) n = n.filter(x => (x.title||'').toLowerCase().includes(this.searchQuery) || (x.content||'').toLowerCase().includes(this.searchQuery));
    n.sort((a,b) => { if (a.pinned !== b.pinned) return b.pinned - a.pinned; return this.sortDescending ? new Date(b.updated_at) - new Date(a.updated_at) : new Date(a.updated_at) - new Date(b.updated_at); });
    
    const grid = document.getElementById('notionNotesGrid'); if (!grid) return;
    grid.innerHTML = n.map(item => `
      <div onclick="Portal.openEditNoteDrawer('${item.id}')" class="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer group flex flex-col justify-between min-h-[140px]">
        <div>
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2"><span class="text-xl">${item.icon}</span><h4 class="font-bold text-sm text-white truncate w-32">${this.escapeHtml(item.title)}</h4></div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100">
              <button onclick="event.stopPropagation(); Portal.quickPinNote('${item.id}')" class="p-1 text-slate-400 hover:text-amber-400"><i data-lucide="pin" class="w-3.5 h-3.5"></i></button>
              <button onclick="event.stopPropagation(); Portal.quickDeleteNote('${item.id}')" class="p-1 text-slate-400 hover:text-rose-400"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
          <p class="text-xs text-slate-400 line-clamp-3">${this.escapeHtml(item.content)}</p>
        </div>
      </div>
    `).join('');
    this.updateHUD(); if (window.lucide) window.lucide.createIcons();
  },
  quickPinNote(id) { let n = this.getLocalNotes(); const it = n.find(x=>x.id===id); it.pinned = it.pinned ? 0 : 1; this.saveLocalNotes(n); this.loadNotes(); },
  quickDeleteNote(id) { let n = this.getLocalNotes(); n = n.filter(x=>x.id!==id); this.saveLocalNotes(n); this.loadNotes(); },

  // --- FINANCE (MIDAS) ---
  getLocalFallbackFinance() {
    return {
      total_value: 65420.00, total_cost: 58000.00, total_profit: 7420.00, total_profit_percent: 12.79,
      assets: [
        { id: '1', symbol: 'THYAO', shares: 150, buy_price: 280.50, current_price: 312.50, current_value: 46875, profit: 4800, profit_percent: 11.4 },
        { id: '2', symbol: 'ALTIN_GRAM', shares: 5, buy_price: 2600.00, current_price: 2865.40, current_value: 14327, profit: 1327, profit_percent: 10.2 }
      ],
      ipos: [{ code: 'DURK', name: 'Durukan Şekerleme', date: 'Yarın', price: '17.00 ₺', distribution: 'Eşit' }]
    };
  },
  loadFinanceData() {
    const mock = this.getLocalFallbackFinance();
      total_value: 65420.00, total_cost: 58000.00, total_profit: 7420.00, total_profit_percent: 12.79,
      assets: [
        { id: '1', symbol: 'THYAO', shares: 150, buy_price: 280.50, current_price: 312.50, current_value: 46875, profit: 4800, profit_percent: 11.4 },
        { id: '2', symbol: 'ALTIN_GRAM', shares: 5, buy_price: 2600.00, current_price: 2865.40, current_value: 14327, profit: 1327, profit_percent: 10.2 }
      ],
      ipos: [{ code: 'DURK', name: 'Durukan Şekerleme', date: 'Yarın', price: '17.00 ₺', distribution: 'Eşit' }]
    };
    this.renderFinance(mock);
  },
  renderFinance(d) {
    const vEl = document.getElementById('financeTotalValue'); if(vEl) vEl.textContent = new Intl.NumberFormat('tr-TR', {style:'currency',currency:'TRY'}).format(d.total_value);
    const cEl = document.getElementById('financeTotalCost'); if(cEl) cEl.textContent = new Intl.NumberFormat('tr-TR', {style:'currency',currency:'TRY'}).format(d.total_cost);
    const pEl = document.getElementById('financeTotalProfit'); if(pEl) { pEl.textContent = `+${new Intl.NumberFormat('tr-TR', {style:'currency',currency:'TRY'}).format(d.total_profit)}`; pEl.className = 'text-xl font-extrabold font-mono text-emerald-400'; }
    const ppEl = document.getElementById('financeProfitPercent'); if(ppEl) { ppEl.textContent = `+%${d.total_profit_percent}`; ppEl.className = 'text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300'; }
    
    const tb = document.getElementById('portfolioTableBody');
    if (tb) tb.innerHTML = d.assets.map(a => `
      <tr class="hover:bg-slate-800">
        <td class="py-3 px-2 font-bold text-white"><span class="mr-2 px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px]">${a.symbol.slice(0,2)}</span>${a.symbol}</td>
        <td class="py-3 px-2 font-mono text-slate-300">${a.shares}</td>
        <td class="py-3 px-2 font-mono text-slate-400">${a.buy_price} ₺</td>
        <td class="py-3 px-2 font-mono text-white">${a.current_price} ₺</td>
        <td class="py-3 px-2 font-mono font-bold">${a.current_value} ₺</td>
        <td class="py-3 px-2 font-mono text-emerald-400">+${a.profit} ₺ (%${a.profit_percent})</td>
        <td class="py-3 px-2 text-right"><button class="text-rose-400"><i data-lucide="trash" class="w-4 h-4"></i></button></td>
      </tr>
    `).join('');
    
    const tkr = document.getElementById('financeMarketTickers');
    if (tkr) tkr.innerHTML = this.bistCatalog.slice(0,3).map(m => `
      <div class="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="text-xs font-bold text-white">${m.symbol}</span></div>
        <div class="flex items-center gap-2 font-mono text-xs"><span class="text-white">${m.price} ₺</span><span class="text-[10px] text-emerald-400">${m.change}</span></div>
      </div>
    `).join('');

    const ip = document.getElementById('ipoListContainer');
    if (ip) ip.innerHTML = d.ipos.map(i => `<div class="p-3 rounded-xl bg-slate-900 border border-purple-500/30 flex justify-between"><div class="text-xs text-white font-bold">${i.code} <span class="block text-[10px] text-slate-400 font-normal">${i.name}</span></div><div class="text-right text-[10px] text-emerald-400 font-bold">${i.price}</div></div>`).join('');
    if (window.lucide) window.lucide.createIcons();
  },
  handleStockSearch(q) {
    const dd = document.getElementById('stockSearchDropdown'); if (!dd) return;
    q = (q||'').toLowerCase(); let m = this.bistCatalog;
    if (q) m = m.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    dd.innerHTML = m.map(s => `<div onclick="Portal.selectStockAsset('${s.symbol}', '${s.price}')" class="p-3 hover:bg-slate-800 cursor-pointer flex justify-between"><div class="text-xs text-white font-bold">${s.symbol} <span class="text-slate-400 font-normal ml-2">${s.name}</span></div><div class="text-xs text-emerald-400 font-mono">${s.price} ₺</div></div>`).join('');
    dd.classList.remove('hidden');
  },
  selectStockAsset(sym, prc) {
    document.getElementById('assetSearchInput').value = sym;
    document.getElementById('assetBuyPriceInput').value = prc;
    document.getElementById('stockSearchDropdown').classList.add('hidden');
    document.getElementById('selectedAssetCard').classList.remove('hidden');
    document.getElementById('selectedAssetBadge').textContent = sym.slice(0,2);
    document.getElementById('selectedAssetName').textContent = sym;
    document.getElementById('selectedAssetPrice').textContent = `Canlı: ${prc} ₺`;
  },
  openAddAssetModal() { this.openModal('addAssetModal'); setTimeout(()=>document.getElementById('assetSearchInput').focus(), 100); },

  // --- CORE & HUD ---
  updateHUD() {
    let t=0, c=0; this.getLocalTasks().forEach(g => (g.items||[]).forEach(i => { t++; if(i.done)c++; }));
    const se = document.getElementById('statMomentumScore'); const ce = document.getElementById('statCompletedTasks');
    if (ce) ce.textContent = `${c} / ${t}`;
    if (se) se.textContent = t === 0 ? '%100 Hazır' : `%${Math.round((c/t)*100)} Odak`;
  },
  initClock() {
    setInterval(() => {
      const d = new Date();
      const el = document.getElementById('liveClock'); if (el) el.textContent = d.toLocaleTimeString('tr-TR');
      const dt = document.getElementById('liveDate'); if (dt) dt.textContent = d.toLocaleDateString('tr-TR', {day:'numeric', month:'long', year:'numeric'});
    }, 1000);
  },
  checkPersistentAuth() { },
  toast(msg, t='success') {
    const c = document.getElementById('toastContainer'); if (!c) return;
    const d = document.createElement('div'); d.className = `px-4 py-2 rounded-xl text-white text-xs font-bold shadow-2xl ${t==='success'?'bg-emerald-600':'bg-blue-600'}`; d.textContent = msg;
    c.appendChild(d); setTimeout(() => d.remove(), 3000);
  },
  openModal(id) { document.getElementById(id).classList.remove('hidden'); },
  closeModal(id) { document.getElementById(id).classList.add('hidden'); },
  
  // --- UI & LAYOUT ---
  toggleSidebar() {
    const sb = document.getElementById('mainSidebar');
    const ov = document.getElementById('sidebarOverlay');
    if(sb) sb.classList.toggle('-translate-x-full');
    if(ov) ov.classList.toggle('hidden');
  },
  renderSidebarNav() {
    const nav = document.getElementById('sidebarNavList');
    if(!nav) return;
    nav.innerHTML = `
      <a href="#" onclick="Portal.switchTab('dashboard')" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20">
        <i data-lucide="layout-dashboard" class="w-5 h-5"></i> <span class="sidebar-text">Dashboard</span>
      </a>
      <a href="#" onclick="Portal.switchTab('admin')" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium transition-colors">
        <i data-lucide="settings" class="w-5 h-5"></i> <span class="sidebar-text">Ayarlar</span>
      </a>
    `;
    if(window.lucide) window.lucide.createIcons();
  },
  switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    const active = document.getElementById('tab-' + tabId);
    if(active) active.classList.remove('hidden');
    this.currentTab = tabId;
  },
  logout() { this.toast('Çıkış yapılıyor...', 'info'); setTimeout(()=>window.location.reload(), 1000); },
  runSentinelCheck() { this.toast('Sentinel aktif. Sistem taranıyor...', 'info'); this.playAudioFeedback(); },
  resetToFactory() { if(confirm('Tüm veriler silinecek!')) { localStorage.clear(); window.location.reload(); } },

  // --- MODALS & FORMS ---
  openNewMenuModal() { this.openModal('newMenuModal'); },
  handleCreateMenu(e) { e.preventDefault(); this.closeModal('newMenuModal'); this.toast('Modül eklendi', 'success'); },
  openNewTaskModal() { this.openModal('newTaskModal'); },
  handleCreateTaskGroup(e) {
    e.preventDefault();
    const title = document.getElementById('newTaskGroupTitle').value;
    const first = document.getElementById('newTaskFirstItem').value;
    let t = this.getLocalTasks();
    let items = [];
    if(first.trim()) items.push({text: first.trim(), done: false});
    t.unshift({ id: 'tg_'+Date.now(), title: title, iconType: 'list', items: items });
    this.saveLocalTasks(t); this.loadTasks(); this.closeModal('newTaskModal'); this.toast('Grup oluşturuldu', 'success');
  },
  toggleAllTaskGroups() {
    const keys = Object.keys(this.openTaskGroups);
    const anyOpen = keys.some(k => this.openTaskGroups[k] !== false);
    let t = this.getLocalTasks();
    t.forEach(g => { this.openTaskGroups[g.id] = !anyOpen; });
    this.loadTasks();
  },

  // --- NOTES DRAWER ---
  toggleWidgetSearch() {
    const sb = document.getElementById('widgetSearchBox');
    if(sb) { sb.classList.toggle('hidden'); if(!sb.classList.contains('hidden')) document.getElementById('noteSearchInput').focus(); }
  },
  toggleSortNotes() { this.sortDescending = !this.sortDescending; this.loadNotes(); this.toast('Sıralama değiştirildi', 'info'); },
  setNoteFilterTab(tab) {
    this.noteFilterTab = tab;
    const a = document.getElementById('filterTabActive'); if(a) a.className = tab === 'active' ? 'p-1.5 rounded-lg bg-blue-600 text-white' : 'p-1.5 rounded-lg text-slate-400 hover:text-white';
    const p = document.getElementById('filterTabPinned'); if(p) p.className = tab === 'pinned' ? 'p-1.5 rounded-lg bg-blue-600 text-white' : 'p-1.5 rounded-lg text-slate-400 hover:text-white';
    this.loadNotes();
  },
  filterNotes() { this.searchQuery = document.getElementById('noteSearchInput').value.toLowerCase(); this.loadNotes(); },
  
  openNewNoteDrawer() {
    document.getElementById('drawerNoteId').value = ''; document.getElementById('drawerNoteTitle').value = '';
    document.getElementById('drawerNoteContent').value = ''; document.getElementById('drawerNotePinned').value = '0';
    this.currentIconIndex = 0; document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[0];
    document.getElementById('drawerWordCount').textContent = '0 kelime';
    document.getElementById('drawerDeleteBtn').classList.add('hidden');
    document.getElementById('notionDrawer').classList.remove('hidden');
    setTimeout(() => document.getElementById('notionDrawerContent').classList.remove('translate-x-full'), 10);
  },
  openEditNoteDrawer(id) {
    const n = this.getLocalNotes().find(x=>x.id===id); if(!n) return;
    document.getElementById('drawerNoteId').value = n.id; document.getElementById('drawerNoteTitle').value = n.title;
    document.getElementById('drawerNoteContent').value = n.content; document.getElementById('drawerNotePinned').value = n.pinned || 0;
    this.currentIconIndex = this.noteIcons.indexOf(n.icon); if(this.currentIconIndex===-1) this.currentIconIndex=0;
    document.getElementById('noteDrawerEmojiBtn').textContent = n.icon;
    this.handleContentInput(document.getElementById('drawerNoteContent'));
    document.getElementById('drawerDeleteBtn').classList.remove('hidden');
    document.getElementById('notionDrawer').classList.remove('hidden');
    setTimeout(() => document.getElementById('notionDrawerContent').classList.remove('translate-x-full'), 10);
  },
  closeNoteDrawer() {
    document.getElementById('notionDrawerContent').classList.add('translate-x-full');
    setTimeout(() => document.getElementById('notionDrawer').classList.add('hidden'), 300);
  },
  cycleNoteIcon() { this.currentIconIndex = (this.currentIconIndex + 1) % this.noteIcons.length; document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[this.currentIconIndex]; },
  toggleDrawerPin() { const p = document.getElementById('drawerNotePinned'); p.value = p.value === '1' ? '0' : '1'; this.toast(p.value==='1'?'Sabitlendi':'Sabitlik kaldırıldı', 'info'); },
  handleContentInput(el) { document.getElementById('drawerWordCount').textContent = (el.value.trim().split(/\s+/).filter(x=>x).length) + ' kelime'; },
  saveDrawerNote() {
    const id = document.getElementById('drawerNoteId').value;
    const title = document.getElementById('drawerNoteTitle').value || 'Başlıksız Doküman';
    const content = document.getElementById('drawerNoteContent').value;
    const icon = document.getElementById('noteDrawerEmojiBtn').textContent;
    const pinned = parseInt(document.getElementById('drawerNotePinned').value) || 0;
    let notes = this.getLocalNotes();
    if(id) { const idx = notes.findIndex(x=>x.id===id); if(idx>-1) { notes[idx] = {...notes[idx], title, content, icon, pinned, updated_at: new Date().toISOString()}; } }
    else { notes.unshift({id: 'note_'+Date.now(), title, content, icon, pinned, color: 'blue', updated_at: new Date().toISOString()}); }
    this.saveLocalNotes(notes); this.loadNotes(); this.closeNoteDrawer(); this.toast('Doküman kaydedildi', 'success');
  },
  deleteDrawerNote() { const id = document.getElementById('drawerNoteId').value; if(id) { this.quickDeleteNote(id); this.closeNoteDrawer(); this.toast('Doküman silindi', 'success'); } },

  bindKeyboardShortcuts() {
 document.addEventListener('keydown', e => { if(e.key==='Escape') { this.closeModal('addAssetModal'); } }); }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.Portal.init());
else window.Portal.init();
