const Portal = {
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  minimizedWidgets: JSON.parse(localStorage.getItem('portal_minimized_widgets') || '[]'),
  searchQuery: '',
  
  init() {
    this.checkPersistentAuth();
    this.initClock();
    this.renderSidebarNav();
    this.loadNotes();
    this.loadMenuPool();
    this.renderFloatingWidgetDock();
    this.bindKeyboardShortcuts();
    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================
  // 1. KLAVYE KISAYOLLARI (POWER-USER SHORTCUTS)
  // ==========================================================
  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC: Not çekmecesini kapat
      if (e.key === 'Escape') {
        const drawer = document.getElementById('notionDrawer');
        if (drawer && !drawer.classList.contains('hidden')) {
          this.closeNoteDrawer();
        }
      }
      // Ctrl + Enter veya Cmd + Enter: Notu Kaydet
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const drawer = document.getElementById('notionDrawer');
        if (drawer && !drawer.classList.contains('hidden')) {
          this.saveDrawerNote();
        }
      }
      // Ctrl + /: Arama kutusuna odaklan
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('noteSearchInput');
        if (searchInput) searchInput.focus();
      }
    });
  },

  // ==========================================================
  // 2. DİNAMİK SOL MENÜ SENKRONİZASYONU (SIDEBAR NAV)
  // ==========================================================
  renderSidebarNav() {
    const nav = document.getElementById('sidebarNavList');
    if (!nav) return;

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
          title="${m.label}" 
          class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'active-nav bg-blue-600/15 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}"
        >
          <i data-lucide="${m.icon}" class="w-4 h-4 flex-shrink-0 ${m.id === 'admin' ? 'text-purple-400' : ''}"></i>
          <span class="truncate sidebar-text">${m.label}</span>
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================
  // 3. KALICI OTURUM KONTROLÜ
  // ==========================================================
  checkPersistentAuth() {
    const session = JSON.parse(localStorage.getItem('portal_active_session') || 'null');
    const overlay = document.getElementById('gatewayOverlay');
    const badgeName = document.getElementById('headerUserName');

    if (session && session.authenticated) {
      if (overlay) overlay.classList.add('hidden');
      if (badgeName) badgeName.textContent = session.name || (session.role === 'ADMIN' ? 'Sistem Yöneticisi' : 'Misafir Kullanıcı');
    } else {
      if (overlay) overlay.classList.remove('hidden');
    }
  },

  loginGuest() {
    const session = {
      authenticated: true,
      role: 'USER',
      name: 'Misafir Kullanıcı',
      id: 'guest_' + Date.now()
    };
    localStorage.setItem('portal_active_session', JSON.stringify(session));
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
      localStorage.setItem('portal_active_session', JSON.stringify(session));
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
  // 4. NOTION ZENGİN NOTLAR MOTORU (CANVAS)
  // ==========================================================
  getLocalNotes() {
    const stored = localStorage.getItem('portal_notion_notes');
    if (stored === null) {
      // Sadece ilk kurulumda 1 adet başlangıç kılavuzu
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
      localStorage.setItem('portal_notion_notes', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveLocalNotes(notes) {
    localStorage.setItem('portal_notion_notes', JSON.stringify(notes));
  },

  filterNotes() {
    const input = document.getElementById('noteSearchInput');
    this.searchQuery = input ? input.value.trim().toLowerCase() : '';
    this.loadNotes();
  },

  formatSnippet(rawText) {
    if (!rawText) return '<span class="text-slate-600 italic">Boş içerik...</span>';
    let formatted = rawText.substring(0, 160);
    if (rawText.length > 160) formatted += '...';
    
    // [x] -> yeşil tik, [ ] -> gri kutu
    formatted = formatted.replace(/\[x\]/gi, '<span class="text-emerald-400 font-bold">✓</span>');
    formatted = formatted.replace(/\[ \]/g, '<span class="text-slate-500 font-bold">◻</span>');
    return formatted;
  },

  loadNotes() {
    let notes = this.getLocalNotes();
    const countBadge = document.getElementById('noteCountBadge');
    if (countBadge) countBadge.textContent = `${notes.length} Not`;

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
                <h3 class="font-bold text-sm text-slate-100 group-hover:text-white truncate tracking-tight">${n.title || 'Başlıksız Not'}</h3>
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
  },

  handleContentInput(textarea) {
    // Auto-grow textarea
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';

    // Live word & character count
    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = textarea.value.length;
    const countEl = document.getElementById('drawerWordCount');
    if (countEl) countEl.textContent = `${words} kelime • ${chars} karakter`;
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
  },

  deleteDrawerNote() {
    const id = document.getElementById('drawerNoteId').value;
    if (!id || !confirm('Bu notu silmek istediğinize emin misiniz?')) return;

    let notes = this.getLocalNotes();
    notes = notes.filter(n => n.id !== id);
    this.saveLocalNotes(notes);

    this.closeNoteDrawer();
    this.loadNotes();
    this.toast('Not silindi', 'info');
  },

  // ==========================================================
  // 5. MENÜ HAVUZU & CANLI SIDEBAR BAĞLANTISI
  // ==========================================================
  getLocalMenus() {
    const def = [
      { id: 'dashboard', label: 'Ana Sayfa & Notlar', icon: 'layout-dashboard', is_active: 1, desc: 'Notion not çalışma alanı' },
      { id: 'admin', label: 'Geliştirici & Menü Havuzu', icon: 'terminal', is_active: 1, desc: 'Sayfa yapılandırma merkezi' }
    ];
    return JSON.parse(localStorage.getItem('portal_menu_pool') || JSON.stringify(def));
  },

  loadMenuPool() {
    const menus = this.getLocalMenus();
    const grid = document.getElementById('adminMenuPoolGrid');
    if (!grid) return;

    grid.innerHTML = menus.map(m => `
      <div class="p-4 rounded-2xl bg-slate-900/80 border ${m.is_active == 1 ? 'border-blue-500/40' : 'border-slate-800'} flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl ${m.is_active == 1 ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'} flex items-center justify-center flex-shrink-0">
            <i data-lucide="${m.icon}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-white truncate">${m.label}</h4>
            <p class="text-[10px] text-slate-400 truncate">${m.desc || m.id}</p>
          </div>
        </div>
        <button onclick="Portal.toggleMenu('${m.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${m.is_active == 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
          ${m.is_active == 1 ? 'Aktif' : 'Pasif'}
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  toggleMenu(id) {
    let menus = this.getLocalMenus();
    menus = menus.map(m => m.id === id ? { ...m, is_active: m.is_active == 1 ? 0 : 1 } : m);
    localStorage.setItem('portal_menu_pool', JSON.stringify(menus));
    this.loadMenuPool();
    this.renderSidebarNav();
    this.toast('Menü durumu güncellendi!', 'success');
  },

  // ==========================================================
  // 6. SOL MENÜ DARALTMA & SEKME GEÇİŞİ
  // ==========================================================
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

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30'));

    const tabEl = document.getElementById('tab-' + tabId);
    if (tabEl) tabEl.classList.remove('hidden');

    const navBtn = document.getElementById('nav-btn-' + tabId);
    if (navBtn) navBtn.classList.add('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30');

    this.closeMobileSidebar();
    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================
  // 7. YÜZEN WİDGET BALONCUKLARI DOCK'U
  // ==========================================================
  minimizeWidget(id, label = 'Widget') {
    if (!this.minimizedWidgets.find(w => w.id === id)) {
      this.minimizedWidgets.push({ id, label });
      localStorage.setItem('portal_minimized_widgets', JSON.stringify(this.minimizedWidgets));
    }
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) wrapper.classList.add('hidden');
    this.renderFloatingWidgetDock();
    this.toast(`${label} sağ alt baloncuk paneline eklendi`, 'info');
  },

  restoreWidget(id) {
    this.minimizedWidgets = this.minimizedWidgets.filter(w => w.id !== id);
    localStorage.setItem('portal_minimized_widgets', JSON.stringify(this.minimizedWidgets));
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) {
      wrapper.classList.remove('hidden');
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    this.renderFloatingWidgetDock();
    this.toast('Widget eski yerine geri açıldı!', 'success');
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
            <span>${w.label || w.id}</span>
            <i data-lucide="maximize-2" class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100"></i>
          </button>
        `).join('')}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
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
