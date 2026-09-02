const Portal = {
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  
  init() {
    this.initClock();
    this.loadNotes();
    this.loadMenuPool();
    this.loadUsers();
    if (window.lucide) window.lucide.createIcons();
  },

  async api(endpoint, options = {}) {
    try {
      const res = await fetch(`/api/index.php?endpoint=${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      const json = await res.json();
      if (!json.success && json.message) {
        this.toast(json.message, 'error');
      }
      return json;
    } catch (e) {
      console.error('API Error:', e);
      return { success: false, message: 'Sunucuya bağlanılamadı' };
    }
  },

  async loadNotes() {
    const res = await this.api('notes');
    if (!res.success) return;
    const notes = res.data || [];
    const grid = document.getElementById('notionNotesGrid');
    if (!grid) return;

    if (notes.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
          <span class="text-4xl block mb-3">📝</span>
          <h3 class="text-base font-bold text-slate-300 mb-1">Henüz bir not oluşturulmadı</h3>
          <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Notion ergonomisine sahip ilk notunuzu eklemek için yukarıdaki butona tıklayın.</p>
          <button onclick="Portal.openNewNoteDrawer()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer">
            + İlk Notu Yaz
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
      const snippet = n.content ? n.content.substring(0, 140) + (n.content.length > 140 ? '...' : '') : 'Boş içerik...';
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
              ${snippet}
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

  openNewNoteDrawer() {
    document.getElementById('drawerNoteId').value = '';
    document.getElementById('drawerNoteTitle').value = '';
    document.getElementById('drawerNoteContent').value = '';
    document.getElementById('drawerNoteColor').value = 'blue';
    document.getElementById('drawerNotePinned').value = '0';
    document.getElementById('noteDrawerEmojiBtn').textContent = '📝';
    document.getElementById('drawerDeleteBtn').classList.add('hidden');
    this.showNoteDrawer();
  },

  async openEditNoteDrawer(id) {
    const res = await this.api(`notes&id=${id}`);
    if (!res.success || !res.data) return;
    const n = res.data;

    document.getElementById('drawerNoteId').value = n.id;
    document.getElementById('drawerNoteTitle').value = n.title;
    document.getElementById('drawerNoteContent').value = n.content || '';
    document.getElementById('drawerNoteColor').value = n.color || 'blue';
    document.getElementById('drawerNotePinned').value = n.pinned || '0';
    document.getElementById('noteDrawerEmojiBtn').textContent = n.icon || '📝';
    document.getElementById('drawerDeleteBtn').classList.remove('hidden');

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
    this.toast(newVal === '1' ? 'Not tepeye sabitlenecek' : 'Sabitleme kaldırıldı', 'info');
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
    contentArea.focus();
  },

  async saveDrawerNote(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('drawerNoteId').value;
    const title = document.getElementById('drawerNoteTitle').value.trim();
    const content = document.getElementById('drawerNoteContent').value.trim();
    const icon = document.getElementById('noteDrawerEmojiBtn').textContent.trim();
    const color = document.getElementById('drawerNoteColor').value;
    const pinned = parseInt(document.getElementById('drawerNotePinned').value) || 0;

    const action = id ? 'update' : 'create';
    const payload = { action, id, title, content, icon, color, pinned };

    const res = await this.api('notes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.success) {
      this.closeNoteDrawer();
      this.loadNotes();
      this.toast(id ? 'Not güncellendi' : 'Yeni not kaydedildi', 'success');
    }
  },

  async deleteDrawerNote() {
    const id = document.getElementById('drawerNoteId').value;
    if (!id || !confirm('Bu notu silmek istediğinize emin misiniz?')) return;

    const res = await this.api('notes', {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id })
    });

    if (res.success) {
      this.closeNoteDrawer();
      this.loadNotes();
      this.toast('Not silindi', 'info');
    }
  },

  async loadMenuPool() {
    const res = await this.api('menus');
    if (!res.success) return;
    const menus = res.data || [];
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
            <p class="text-[10px] text-slate-400 truncate">${m.description || m.id}</p>
          </div>
        </div>
        <button onclick="Portal.toggleMenu('${m.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${m.is_active == 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
          ${m.is_active == 1 ? 'Aktif' : 'Pasif'}
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async toggleMenu(id) {
    const res = await this.api('menus', {
      method: 'POST',
      body: JSON.stringify({ action: 'toggle', id })
    });
    if (res.success) {
      this.loadMenuPool();
      this.toast('Menü güncellendi', 'success');
      setTimeout(() => location.reload(), 500);
    }
  },

  openNewMenuModal() {
    this.openModal('newMenuModal');
  },

  async handleCreateMenu(e) {
    e.preventDefault();
    const id = document.getElementById('newMenuId').value.trim();
    const label = document.getElementById('newMenuLabel').value.trim();
    const icon = document.getElementById('newMenuIcon').value.trim();
    const order_index = parseInt(document.getElementById('newMenuOrder').value) || 10;
    const description = document.getElementById('newMenuDesc').value.trim();

    const res = await this.api('menus', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', id, label, icon, order_index, description })
    });

    if (res.success) {
      this.closeModal('newMenuModal');
      this.loadMenuPool();
      this.toast('Yeni menü oluşturuldu!', 'success');
      setTimeout(() => location.reload(), 500);
    }
  },

  async loadUsers() {
    const res = await this.api('users');
    if (!res.success) return;
    const users = res.data || [];
    const grid = document.getElementById('adminUserCardsGrid');
    if (!grid) return;

    grid.innerHTML = users.map(u => `
      <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
        <div>
          <h4 class="text-xs font-bold text-white">${u.name}</h4>
          <span class="text-[10px] text-slate-400">${u.phone || 'Telefon yok'}</span>
        </div>
        ${u.id !== 'usr_admin' ? `
          <button onclick="Portal.deleteUser('${u.id}')" class="text-rose-400 hover:text-rose-300 p-1">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        ` : '<span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">ADMIN</span>'}
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  openUserModal() {
    this.openModal('adminUserModal');
  },

  async handleSaveUser(e) {
    e.preventDefault();
    const name = document.getElementById('userModalName')?.value;
    const phone = document.getElementById('userModalPhone')?.value;
    const pin = document.getElementById('userModalPin')?.value;

    const res = await this.api('users', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', name, phone, pin })
    });
    if (res.success) {
      this.closeModal('adminUserModal');
      this.loadUsers();
      this.toast('Kullanıcı oluşturuldu', 'success');
    }
  },

  async deleteUser(id) {
    if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
    await this.api('users', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    this.loadUsers();
    this.toast('Kullanıcı silindi', 'info');
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

  async promptAdminLogin() {
    const pin = prompt('Yönetici PIN Kodunu Giriniz (1234):');
    if (!pin) return;
    const res = await this.api('auth&action=login_admin', { method: 'POST', body: JSON.stringify({ pin }) });
    if (res.success) location.reload();
    else alert('Hatalı PIN!');
  },

  async loginGuest() {
    const res = await this.api('auth&action=login_user', { method: 'POST', body: JSON.stringify({}) });
    if (res.success) location.reload();
  },

  async loginUser(userId, hasPin) {
    let pin = null;
    if (hasPin) {
      pin = prompt('PIN Kodunu Giriniz:');
      if (!pin) return;
    }
    const res = await this.api('auth&action=login_user', { method: 'POST', body: JSON.stringify({ userId, pin }) });
    if (res.success) location.reload();
    else alert(res.message || 'Hatalı PIN!');
  },

  async logout() {
    await this.api('auth&action=logout');
    location.reload();
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
