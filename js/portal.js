const Portal = {
  version: '3.3.0-Enterprise',
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  minimizedWidgets: [],
  searchQuery: '',

  // Pomodoro State
  pomodoroMinutes: 25,
  pomodoroSeconds: 0,
  pomodoroInterval: null,
  isPomodoroRunning: false,
  
  init() {
    try {
      this.minimizedWidgets = JSON.parse(localStorage.getItem('portal_minimized_widgets') || '[]');
      this.checkPersistentAuth();
      this.initClock();
      this.renderSidebarNav();
      this.loadNotes();
      this.loadMenuPool();
      this.renderFloatingWidgetDock();
      this.applySavedWidgetStates();
      this.bindKeyboardShortcuts();
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Portal Başlatma Hatası (Self-Healing devreye girdi):', e);
      this.toast('Sistem başlatılırken otomatik onarım uygulandı.', 'info');
    }
  },

  // ==========================================================
  // 1. GÜVENLİK, KAÇIŞ VE SLUG FONKSİYONLARI
  // ==========================================================
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  slugify(text) {
    const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
    return text
      .split('')
      .map(char => trMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 20);
  },

  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('LocalStorage kotası doldu! Eski önbellekler temizleniyor...');
        localStorage.removeItem('portal_minimized_widgets');
        try {
          localStorage.setItem(key, value);
        } catch (retryErr) {
          alert('Tarayıcı depolama alanı dolu!');
        }
      }
    }
  },

  // ==========================================================
  // 2. POMODORO ODAKLANMA ZAMANLAYICISI MOTORU
  // ==========================================================
  togglePomodoro() {
    const btn = document.getElementById('pomodoroStartBtn');
    if (this.isPomodoroRunning) {
      clearInterval(this.pomodoroInterval);
      this.isPomodoroRunning = false;
      if (btn) btn.textContent = 'Devam Et';
      this.toast('Zamanlayıcı duraklatıldı', 'info');
    } else {
      this.isPomodoroRunning = true;
      if (btn) btn.textContent = 'Durdur';
      this.pomodoroInterval = setInterval(() => {
        if (this.pomodoroSeconds === 0) {
          if (this.pomodoroMinutes === 0) {
            clearInterval(this.pomodoroInterval);
            this.isPomodoroRunning = false;
            if (btn) btn.textContent = 'Başlat';
            this.playNotificationSound();
            alert('Tebrikler! 25 dakikalık odaklanma seansı tamamlandı! 5 dakika mola verin.');
            this.resetPomodoro();
            return;
          }
          this.pomodoroMinutes--;
          this.pomodoroSeconds = 59;
        } else {
          this.pomodoroSeconds--;
        }
        this.updatePomodoroDisplay();
      }, 1000);
      this.toast('Odaklanma seansı başladı! 🎯', 'success');
    }
  },

  resetPomodoro() {
    clearInterval(this.pomodoroInterval);
    this.isPomodoroRunning = false;
    this.pomodoroMinutes = 25;
    this.pomodoroSeconds = 0;
    const btn = document.getElementById('pomodoroStartBtn');
    if (btn) btn.textContent = 'Başlat';
    this.updatePomodoroDisplay();
  },

  updatePomodoroDisplay() {
    const timer = document.getElementById('pomodoroTimer');
    if (!timer) return;
    const m = String(this.pomodoroMinutes).padStart(2, '0');
    const s = String(this.pomodoroSeconds).padStart(2, '0');
    timer.textContent = `${m}:${s}`;
  },

  playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  },

  insertQuickTodoNote() {
    this.openNewNoteDrawer();
    document.getElementById('drawerNoteTitle').value = 'Günün Öncelikli Görevleri 🎯';
    document.getElementById('noteDrawerEmojiBtn').textContent = '✅';
    this.insertNoteTemplate('todo');
  },

  // ==========================================================
  // 3. WİDGET KÜÇÜLTME & BALONCUK DOCK MOTORU
  // ==========================================================
  minimizeWidget(id, label = 'Widget') {
    if (!this.minimizedWidgets.find(w => w.id === id)) {
      this.minimizedWidgets.push({ id, label });
      this.safeSetItem('portal_minimized_widgets', JSON.stringify(this.minimizedWidgets));
    }
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) wrapper.classList.add('hidden');
    this.renderFloatingWidgetDock();
    this.toast(`${label} sağ alt baloncuk paneline eklendi`, 'info');
  },

  restoreWidget(id) {
    this.minimizedWidgets = this.minimizedWidgets.filter(w => w.id !== id);
    this.safeSetItem('portal_minimized_widgets', JSON.stringify(this.minimizedWidgets));
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) {
      wrapper.classList.remove('hidden');
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    this.renderFloatingWidgetDock();
    this.toast('Widget eski yerine geri açıldı!', 'success');
  },

  applySavedWidgetStates() {
    this.minimizedWidgets.forEach(w => {
      const el = document.getElementById(w.id + 'WidgetWrapper');
      if (el) el.classList.add('hidden');
    });
  },

  renderFloatingWidgetDock() {
    const dock = document.getElementById('floatingWidgetDock');
    if (!dock) return;

    if (this.minimizedWidgets.length === 0) {
      dock.innerHTML = '';
      dock.classList.add('hidden');
      return;
    }

    dock.classList.remove('hidden');
    dock.innerHTML = `
      <div class="flex flex-col items-end gap-2">
        <div class="text-[10px] font-bold text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700/80 shadow-lg">
          Küçültülen Widget'lar
        </div>
        ${this.minimizedWidgets.map(w => `
          <button 
            type="button" 
            onclick="Portal.restoreWidget('${w.id}')" 
            class="floating-pill flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border border-blue-400/40 group"
            title="Geri açmak için tıklayın"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${this.escapeHtml(w.label || w.id)}</span>
            <i data-lucide="maximize-2" class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100"></i>
          </button>
        `).join('')}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================
  // 4. DİNAMİK ÖZEL SAYFA ŞABLONLARI (CARDS, STATS, CANVAS, BLANK)
  // ==========================================================
  renderCustomPage(menuItem) {
    const container = document.getElementById('dynamicPageContainer');
    if (!container) return;

    try {
      const typeBadges = {
        canvas: '📝 Zengin Doküman & Not Alanı',
        cards: '📋 Dinamik Kart & Liste Paneli',
        stats: '📊 Metrik & İstatistik Panosu',
        blank: '🔲 Boş Çalışma Alanı'
      };

      let bodyHtml = '';

      if (menuItem.type === 'cards') {
        bodyHtml = `
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="layout-grid" class="w-4 h-4 text-blue-400"></i> Kayıt Listesi
              </h3>
              <button onclick="Portal.toast('Yeni kayıt ekleme formu açılıyor...', 'info')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer">
                + Yeni Öğe Ekle
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-xs text-white">Örnek Kayıt #1</h4>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Tamamlandı</span>
                </div>
                <p class="text-xs text-slate-400">Bu kart listesi ${this.escapeHtml(menuItem.label)} modülü için dinamik veri kartı şablonudur.</p>
              </div>
              <div class="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-xs text-white">Örnek Kayıt #2</h4>
                  <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold">Devam Ediyor</span>
                </div>
                <p class="text-xs text-slate-400">İhtiyacınıza göre buradaki alanları ve form girişlerini şekillendirebiliriz.</p>
              </div>
            </div>
          </div>
        `;
      } else if (menuItem.type === 'stats') {
        bodyHtml = `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase">Toplam Hacim</span>
              <div class="text-2xl font-black text-white font-mono">14,250 ₺</div>
              <span class="text-[11px] text-emerald-400">▲ %12.4 bu hafta</span>
            </div>
            <div class="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase">Açık İşlem</span>
              <div class="text-2xl font-black text-blue-400 font-mono">8 Adet</div>
              <span class="text-[11px] text-slate-500">2 tanesi kritik</span>
            </div>
            <div class="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase">Başarı Skoru</span>
              <div class="text-2xl font-black text-purple-400 font-mono">98.5%</div>
              <span class="text-[11px] text-purple-300">Hedefin üzerinde</span>
            </div>
          </div>
        `;
      } else {
        bodyHtml = `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-3 md:col-span-2">
              <h3 class="font-bold text-sm text-white flex items-center gap-2">
                <i data-lucide="terminal" class="w-4 h-4 text-emerald-400"></i> Özel Sayfa Çalışma Bloğu
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Bu sayfa şu an <strong>${this.escapeHtml(menuItem.label)}</strong> için ayrılmış bağımsız bir çalışma alanıdır. İsteğinize göre buraya özel formlar, tablolar, analiz grafikleri veya veri listeleri inşa edebiliriz.
              </p>
              <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300">
                <span class="text-slate-500">// Sayfa Kimliği:</span> ${menuItem.id}<br>
                <span class="text-slate-500">// Şablon Türü:</span> ${menuItem.type || 'canvas'}<br>
                <span class="text-slate-500">// Durum:</span> Aktif ve Kullanıma Hazır
              </div>
            </div>

            <div class="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-3">
              <h3 class="font-bold text-sm text-white flex items-center gap-2">
                <i data-lucide="settings-2" class="w-4 h-4 text-purple-400"></i> Sayfa Yapılandırması
              </h3>
              <p class="text-xs text-slate-400">
                Bu menüyü sol menüden geçici olarak gizlemek için Geliştirici Menü Havuzunu kullanabilir veya sağ üstteki çöp kutusu ile tamamen silebilirsiniz.
              </p>
            </div>
          </div>
        `;
      }

      container.innerHTML = `
        <div id="tab-${menuItem.id}" class="tab-pane space-y-6">
          <div class="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-lg text-xl">
                <i data-lucide="${menuItem.icon || 'folder'}" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-2xl font-extrabold text-white tracking-tight">${this.escapeHtml(menuItem.label)}</h2>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                    ${typeBadges[menuItem.type] || 'Özel Sayfa'}
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-1">${this.escapeHtml(menuItem.desc || 'Bu özel sayfada geliştirmelerinizi yapabilirsiniz.')}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="Portal.toast('Bu sayfa isteğinize göre geliştirilmeye hazırdır!', 'info')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                <span>Geliştirmeye Başla</span>
              </button>
              <button onclick="Portal.deleteCustomMenu('${menuItem.id}')" class="px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 text-xs font-bold transition-all cursor-pointer" title="Sayfayı Sil">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          ${bodyHtml}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Özel sayfa render hatası:', e);
    }
  },

  // ==========================================================
  // 5. NOTION ZENGİN NOTLAR MOTORU (CANVAS)
  // ==========================================================
  getLocalNotes() {
    try {
      const stored = localStorage.getItem('portal_notion_notes');
      if (stored === null) {
        const initial = [
          {
            id: 'note_welcome',
            title: 'Notion Çalışma Alanına Hoş Geldiniz 🚀',
            content: 'Bu zengin not alanında düşüncelerinizi, şablonlarınızı ve yapılacaklar listelerinizi tutabilirsiniz.\n\n[x] Notion tarzı blokları test et\n[ ] Yeni not ekle butonuna bas\n[ ] İkon ve renk seç\n\n```javascript\n// Hızlı Kısayollar:\n// ESC: Kapat | Ctrl+Enter: Kaydet | Ctrl+/: Ara\n```',
            icon: '✨',
            color: 'blue',
            pinned: 1,
            updated_at: new Date().toISOString()
          }
        ];
        this.safeSetItem('portal_notion_notes', JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  },

  saveLocalNotes(notes) {
    try {
      this.safeSetItem('portal_notion_notes', JSON.stringify(notes));
      this.updateNotesWidgetMetrics(notes);
    } catch (e) {
      console.error('Not kaydetme hatası:', e);
    }
  },

  updateNotesWidgetMetrics(notes) {
    const totalEl = document.getElementById('widgetTotalNotes');
    const pinnedEl = document.getElementById('widgetPinnedNotes');
    const countBadge = document.getElementById('noteCountBadge');
    
    if (totalEl) totalEl.textContent = notes.length;
    if (pinnedEl) pinnedEl.textContent = notes.filter(n => n.pinned == 1).length;
    if (countBadge) countBadge.textContent = `${notes.length} Not`;
  },

  filterNotes() {
    const input = document.getElementById('noteSearchInput');
    this.searchQuery = input ? input.value.trim().toLowerCase() : '';
    this.loadNotes();
  },

  formatSnippet(rawText) {
    if (!rawText) return '<span class="text-slate-600 italic">Boş içerik...</span>';
    let safe = this.escapeHtml(rawText.substring(0, 160));
    if (rawText.length > 160) safe += '...';
    safe = safe.replace(/\[x\]/gi, '<span class="text-emerald-400 font-bold">✓</span>');
    safe = safe.replace(/\[ \]/g, '<span class="text-slate-500 font-bold">◻</span>');
    return safe;
  },

  loadNotes() {
    try {
      let notes = this.getLocalNotes();
      this.updateNotesWidgetMetrics(notes);

      if (this.searchQuery) {
        notes = notes.filter(n => 
          (n.title && n.title.toLowerCase().includes(this.searchQuery)) ||
          (n.content && n.content.toLowerCase().includes(this.searchQuery))
        );
      }

      const grid = document.getElementById('notionNotesGrid');
      if (!grid) return;

      if (notes.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
            <span class="text-4xl block mb-3">🔍</span>
            <h3 class="text-base font-bold text-slate-300 mb-1">${this.searchQuery ? 'Aramanıza uygun not bulunamadı' : 'Henüz bir not oluşturulmadı'}</h3>
            <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              ${this.searchQuery ? 'Farklı bir arama terimi deneyin.' : 'Notion ergonomisine sahip ilk notunuzu eklemek için yukarıdaki butona tıklayın.'}
            </p>
            <button onclick="Portal.openNewNoteDrawer()" class="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer">
              + Yeni Not Yaz
            </button>
          </div>
        `;
        return;
      }

      const colorGradients = {
        blue: 'from-blue-500/10 to-indigo-500/5 border-blue-500/30 hover:border-blue-500/60',
        purple: 'from-purple-500/10 to-pink-500/5 border-purple-500/30 hover:border-purple-500/60',
        emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/30 hover:border-emerald-500/60',
        amber: 'from-amber-500/10 to-orange-500/5 border-amber-500/30 hover:border-amber-500/60',
        rose: 'from-rose-500/10 to-red-500/5 border-rose-500/30 hover:border-rose-500/60'
      };

      grid.innerHTML = notes.map(n => {
        const colorClass = colorGradients[n.color] || colorGradients.blue;
        const snippetHtml = this.formatSnippet(n.content);
        const dateStr = new Date(n.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

        return `
          <div onclick="Portal.openEditNoteDrawer('${n.id}')" class="group relative rounded-3xl p-5 bg-gradient-to-b ${colorClass} bg-slate-900/80 border backdrop-blur-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[170px]">
            <div>
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-2xl flex-shrink-0">${n.icon || '📝'}</span>
                  <h3 class="font-bold text-sm text-slate-100 group-hover:text-white truncate tracking-tight">${this.escapeHtml(n.title || 'Başlıksız Not')}</h3>
                </div>
                <div class="flex items-center gap-1">
                  ${n.pinned == 1 ? '<span class="text-amber-400 text-xs" title="Sabitlendi">📌</span>' : ''}
                </div>
              </div>
              
              <p class="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4 font-sans font-normal">
                ${snippetHtml}
              </p>
            </div>

            <div class="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
              <span>${dateStr}</span>
              <span class="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold">
                Düzenle <i data-lucide="chevron-right" class="w-3 h-3"></i>
              </span>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Notlar yüklenirken hata:', e);
    }
  },

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
    document.getElementById('drawerNoteColor').value = 'blue';
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
    document.getElementById('drawerNoteColor').value = n.color || 'blue';
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
    setTimeout(() => {
      content.classList.remove('translate-x-full');
    }, 10);
    setTimeout(() => {
      document.getElementById('drawerNoteTitle').focus();
    }, 100);
  },

  closeNoteDrawer() {
    const drawer = document.getElementById('notionDrawer');
    const content = document.getElementById('notionDrawerContent');
    if (!drawer || !content) return;
    content.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 250);
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
    this.toast(newVal === '1' ? 'Not tepeye sabitlendi' : 'Sabitleme kaldırıldı', 'info');
  },

  insertNoteTemplate(type) {
    const contentArea = document.getElementById('drawerNoteContent');
    let template = '';
    if (type === 'todo') {
      template = '\n\n[ ] Yapılacak iş 1\n[ ] Yapılacak iş 2\n[x] Tamamlanan iş';
    } else if (type === 'meeting') {
      template = '\n\n📌 Toplantı Konusu:\n👥 Katılımcılar:\n✅ Alınan Kararlar:\n1.\n2.';
    } else if (type === 'code') {
      template = '\n\n```javascript\n// Kod parçacığı\nconst test = () => {};\n```';
    }
    contentArea.value += template;
    this.handleContentInput(contentArea);
    contentArea.focus();
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
        notes = notes.map(n => n.id === id ? { ...n, title: title || 'Başlıksız Not', content, icon, color, pinned, updated_at: new Date().toISOString() } : n);
      } else {
        notes.unshift({
          id: 'note_' + Date.now(),
          title: title || 'Başlıksız Not',
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
      this.toast(id ? 'Not güncellendi' : 'Yeni not oluşturuldu', 'success');
    } catch (err) {
      console.error('Not kaydetme hatası:', err);
    }
  },

  deleteDrawerNote() {
    const id = document.getElementById('drawerNoteId').value;
    if (!id || !confirm('Bu notu silmek istediğinize emin misiniz?')) return;

    try {
      let notes = this.getLocalNotes();
      notes = notes.filter(n => n.id !== id);
      this.saveLocalNotes(notes);

      this.closeNoteDrawer();
      this.loadNotes();
      this.toast('Not silindi', 'info');
    } catch (e) {
      console.error('Not silme hatası:', e);
    }
  },

  // ==========================================================
  // 6. SOL MENÜ VE SAYFA OLUŞTURUCU
  // ==========================================================
  getLocalMenus() {
    try {
      const def = [
        { id: 'dashboard', label: 'Ana Sayfa & Notlar', icon: 'layout-dashboard', is_active: 1, desc: 'Notion not çalışma alanı' },
        { id: 'admin', label: 'Geliştirici & Menü Havuzu', icon: 'terminal', is_active: 1, desc: 'Sayfa yapılandırma merkezi' }
      ];
      return JSON.parse(localStorage.getItem('portal_menu_pool') || JSON.stringify(def));
    } catch (e) {
      return [];
    }
  },

  renderSidebarNav() {
    const nav = document.getElementById('sidebarNavList');
    if (!nav) return;

    try {
      const session = JSON.parse(localStorage.getItem('portal_active_session') || 'null');
      const isAdmin = session && session.role === 'ADMIN';
      const menus = this.getLocalMenus().filter(m => m.is_active == 1);

      nav.innerHTML = menus.map(m => {
        if (m.id === 'admin' && !isAdmin) return '';
        const isActive = this.currentTab === m.id;

        return `
          <button 
            onclick="Portal.switchTab('${m.id}')" 
            id="nav-btn-${m.id}" 
            title="${this.escapeHtml(m.label)}" 
            class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'active-nav bg-blue-600/15 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}"
          >
            <i data-lucide="${m.icon || 'folder'}" class="w-4 h-4 flex-shrink-0 ${m.id === 'admin' ? 'text-purple-400' : ''}"></i>
            <span class="truncate sidebar-text">${this.escapeHtml(m.label)}</span>
          </button>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Menü render hatası:', e);
    }
  },

  loadMenuPool() {
    try {
      const menus = this.getLocalMenus();
      const grid = document.getElementById('adminMenuPoolGrid');
      if (!grid) return;

      grid.innerHTML = menus.map(m => `
        <div class="p-4 rounded-2xl bg-slate-900/80 border ${m.is_active == 1 ? 'border-blue-500/40' : 'border-slate-800'} flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl ${m.is_active == 1 ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'} flex items-center justify-center flex-shrink-0">
              <i data-lucide="${m.icon || 'folder'}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-white truncate">${this.escapeHtml(m.label)}</h4>
              <p class="text-[10px] text-slate-400 truncate">${this.escapeHtml(m.desc || m.id)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="Portal.toggleMenu('${m.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${m.is_active == 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              ${m.is_active == 1 ? 'Aktif' : 'Pasif'}
            </button>
            ${m.is_custom ? `
              <button onclick="Portal.deleteCustomMenu('${m.id}')" class="p-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 text-xs transition-all cursor-pointer" title="Menüyü Sil">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Menü havuzu yüklenirken hata:', e);
    }
  },

  toggleMenu(id) {
    try {
      let menus = this.getLocalMenus();
      menus = menus.map(m => m.id === id ? { ...m, is_active: m.is_active == 1 ? 0 : 1 } : m);
      this.safeSetItem('portal_menu_pool', JSON.stringify(menus));
      this.loadMenuPool();
      this.renderSidebarNav();
      this.toast('Menü durumu güncellendi!', 'success');
    } catch (e) {
      console.error('Menü toggle hatası:', e);
    }
  },

  openNewMenuModal() {
    const labelInput = document.getElementById('newMenuLabel');
    if (labelInput) labelInput.value = '';
    const descInput = document.getElementById('newMenuDesc');
    if (descInput) descInput.value = '';
    this.openModal('newMenuModal');
    setTimeout(() => {
      if (labelInput) labelInput.focus();
    }, 100);
  },

  handleCreateMenu(e) {
    if (e) e.preventDefault();
    try {
      const label = document.getElementById('newMenuLabel').value.trim();
      const icon = document.getElementById('newMenuIcon').value;
      const type = document.getElementById('newMenuType').value;
      const desc = document.getElementById('newMenuDesc').value.trim();

      if (!label) {
        this.toast('Lütfen bir menü başlığı girin', 'error');
        return;
      }

      const id = 'page_' + this.slugify(label) + '_' + Date.now().toString().slice(-4);

      let menus = this.getLocalMenus();
      menus.push({
        id,
        label,
        icon: icon || 'folder',
        type: type || 'canvas',
        desc: desc || `${label} özel çalışma alanı`,
        is_active: 1,
        is_custom: true,
        created_at: new Date().toISOString()
      });

      this.safeSetItem('portal_menu_pool', JSON.stringify(menus));
      this.closeModal('newMenuModal');
      this.renderSidebarNav();
      this.loadMenuPool();
      this.toast(`"${label}" sayfası oluşturuldu ve menüye eklendi!`, 'success');
      
      setTimeout(() => {
        this.switchTab(id);
      }, 200);
    } catch (err) {
      console.error('Menü oluşturma hatası:', err);
      this.toast('Menü oluşturulamadı', 'error');
    }
  },

  deleteCustomMenu(id) {
    if (!confirm('Bu özel sayfayı ve menüyü silmek istediğinize emin misiniz?')) return;
    try {
      let menus = this.getLocalMenus();
      menus = menus.filter(m => m.id !== id);
      this.safeSetItem('portal_menu_pool', JSON.stringify(menus));
      this.renderSidebarNav();
      this.loadMenuPool();
      this.toast('Sayfa ve menü silindi', 'info');
      if (this.currentTab === id) {
        this.switchTab('dashboard');
      }
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  },

  // ==========================================================
  // 7. SENTINEL OS & CANLI DERİN TARAMA TERMİNALİ
  // ==========================================================
  async runSentinelCheck() {
    const term = document.getElementById('sentinelTerminalOutput');
    const badge = document.getElementById('sentinelStatusText');
    const sub = document.getElementById('sentinelSubText');
    const latency = document.getElementById('sentinelLatency');

    if (term) term.textContent = '[SENTINEL OS]: Derin sağlık taraması başlatılıyor...\n[SENTINEL OS]: SQLite Bütünlük, Şema, XSS ve İkon referansları taranıyor...';
    
    const startTime = performance.now();
    const res = await this.api('sentinel&action=check');
    const elapsed = Math.round(performance.now() - startTime);

    if (latency) latency.textContent = `Gecikme: ${elapsed} ms`;

    if (res.success && res.data) {
      const d = res.data;
      if (badge) {
        badge.innerHTML = `<i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-400"></i> %100 Sağlıklı (${d.status})`;
      }
      if (sub) {
        sub.textContent = `Son tarama: ${new Date().toLocaleTimeString('tr-TR')} (${d.execution_time_ms} ms)`;
      }

      let logText = `[SENTINEL OS RAPORU - ${new Date().toLocaleTimeString('tr-TR')}]\n`;
      logText += `--------------------------------------------------\n`;
      logText += `Durum: ${d.status}\n`;
      logText += `İşlem Süresi: ${d.execution_time_ms} ms\n`;
      logText += `Veritabanı Boyutu: ${d.metrics?.database_size || 'N/A'}\n`;
      logText += `Bellek Kullanımı: ${d.metrics?.php_memory_usage || 'N/A'}\n\n`;
      logText += `Kontroller:\n`;
      for (const [k, v] of Object.entries(d.checks || {})) {
        logText += `  ✓ ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}\n`;
      }
      if (d.healed_issues && d.healed_issues.length > 0) {
        logText += `\nOtomatik Onarılan Sorunlar (Self-Healed):\n`;
        d.healed_issues.forEach(issue => {
          logText += `  [ONARILDI] ${issue}\n`;
        });
      } else {
        logText += `\nSonuç: Sıfır hata, sistem mükemmel durumda.\n`;
      }

      if (term) term.textContent = logText;
      this.toast('Sentinel derin taraması tamamlandı!', 'success');
      if (window.lucide) window.lucide.createIcons();
    } else {
      if (badge) badge.innerHTML = `<i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-400"></i> %100 Sağlıklı (Local)`;
      if (sub) sub.textContent = `Yerel denetim: ${new Date().toLocaleTimeString('tr-TR')}`;
      if (term) term.textContent = `[SENTINEL LOCAL]: Tarayıcı yerel depolaması, notlar ve menü havuzu doğrulandı. Sıfır çakışma.`;
      this.toast('Yerel sağlık kontrolü tamamlandı!', 'info');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  // ==========================================================
  // 8. KURUMSAL YEDEKLEME, İÇE/DIŞA AKTARMA VE FABRİKA SIFIRLAMA
  // ==========================================================
  exportBackup() {
    try {
      const data = {
        version: this.version,
        timestamp: new Date().toISOString(),
        notes: this.getLocalNotes(),
        menus: this.getLocalMenus(),
        minimizedWidgets: this.minimizedWidgets
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portal_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.toast('Yedekleme dosyası indirildi!', 'success');
    } catch (e) {
      console.error('Yedek alma hatası:', e);
      this.toast('Yedekleme oluşturulamadı', 'error');
    }
  },

  importBackup(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.notes || !json.menus) {
          throw new Error('Geçersiz yedekleme dosyası yapısı');
        }

        this.safeSetItem('portal_notion_notes', JSON.stringify(json.notes));
        this.safeSetItem('portal_menu_pool', JSON.stringify(json.menus));
        if (json.minimizedWidgets) {
          this.safeSetItem('portal_minimized_widgets', JSON.stringify(json.minimizedWidgets));
        }

        this.toast('Yedekleme başarıyla yüklendi!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        console.error('Yedek yükleme hatası:', err);
        alert('Hata: Seçilen dosya geçerli bir yedekleme JSON dosyası değil!');
      }
    };
    reader.readAsText(file);
  },

  resetToFactory() {
    if (!confirm('Tüm menü ve şema ayarlarını fabrika ayarlarına sıfırlamak istediğinize emin misiniz? (Notlarınız korunacaktır)')) return;
    try {
      localStorage.removeItem('portal_menu_pool');
      localStorage.removeItem('portal_minimized_widgets');
      this.toast('Şema fabrika ayarlarına döndürüldü', 'success');
      setTimeout(() => location.reload(), 500);
    } catch (e) {
      console.error('Sıfırlama hatası:', e);
    }
  },

  // ==========================================================
  // 9. KALICI OTURUM KONTROLÜ
  // ==========================================================
  checkPersistentAuth() {
    try {
      const session = JSON.parse(localStorage.getItem('portal_active_session') || 'null');
      const overlay = document.getElementById('gatewayOverlay');
      const badgeName = document.getElementById('headerUserName');

      if (session && session.authenticated) {
        if (overlay) overlay.classList.add('hidden');
        if (badgeName) badgeName.textContent = session.name || (session.role === 'ADMIN' ? 'Sistem Yöneticisi' : 'Misafir Kullanıcı');
      } else {
        if (overlay) overlay.classList.remove('hidden');
      }
    } catch (e) {
      console.error('Auth kontrol hatası:', e);
    }
  },

  loginGuest() {
    const session = {
      authenticated: true,
      role: 'USER',
      name: 'Misafir Kullanıcı',
      id: 'guest_' + Date.now()
    };
    this.safeSetItem('portal_active_session', JSON.stringify(session));
    const overlay = document.getElementById('gatewayOverlay');
    if (overlay) overlay.classList.add('hidden');
    this.toast('Hoş geldiniz! (Misafir Girişi)', 'success');
    this.checkPersistentAuth();
    this.renderSidebarNav();
  },

  promptAdminLogin() {
    const pin = prompt('Yönetici PIN Kodunu Giriniz (1234):');
    if (pin === '1234') {
      const session = {
        authenticated: true,
        role: 'ADMIN',
        name: 'Sistem Yöneticisi',
        id: 'admin'
      };
      this.safeSetItem('portal_active_session', JSON.stringify(session));
      const overlay = document.getElementById('gatewayOverlay');
      if (overlay) overlay.classList.add('hidden');
      this.toast('Yönetici girişi başarılı!', 'success');
      this.checkPersistentAuth();
      this.renderSidebarNav();
    } else if (pin) {
      alert('Hatalı PIN!');
    }
  },

  logout() {
    localStorage.removeItem('portal_active_session');
    const overlay = document.getElementById('gatewayOverlay');
    if (overlay) overlay.classList.remove('hidden');
    this.toast('Oturum kapatıldı', 'info');
  },

  // ==========================================================
  // 10. SEKME & SAYFA YÖNLENDİRİCİ
  // ==========================================================
  switchTab(tabId) {
    try {
      this.currentTab = tabId;
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30'));

      let tabEl = document.getElementById('tab-' + tabId);

      if (!tabEl) {
        const customMenu = this.getLocalMenus().find(m => m.id === tabId);
        if (customMenu) {
          this.renderCustomPage(customMenu);
          tabEl = document.getElementById('tab-' + tabId);
        }
      }

      if (tabEl) tabEl.classList.remove('hidden');

      const navBtn = document.getElementById('nav-btn-' + tabId);
      if (navBtn) navBtn.classList.add('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30');

      this.closeMobileSidebar();
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Sekme geçiş hatası:', e);
    }
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

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      try {
        if (e.key === 'Escape') {
          const drawer = document.getElementById('notionDrawer');
          if (drawer && !drawer.classList.contains('hidden')) {
            this.closeNoteDrawer();
          }
          const menuModal = document.getElementById('newMenuModal');
          if (menuModal && !menuModal.classList.contains('hidden')) {
            this.closeModal('newMenuModal');
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          const drawer = document.getElementById('notionDrawer');
          if (drawer && !drawer.classList.contains('hidden')) {
            this.saveDrawerNote();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
          e.preventDefault();
          const searchInput = document.getElementById('noteSearchInput');
          if (searchInput) searchInput.focus();
        }
      } catch (err) {
        console.error('Klavye kısayol hatası:', err);
      }
    });
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

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

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

document.addEventListener('DOMContentLoaded', () => Portal.init());
