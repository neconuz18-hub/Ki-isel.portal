/**
 * Portal Engine (js/portal.js) — Sadeleştirilmiş Geliştirici & Yönetici Motoru
 */

const Portal = {
  currentTab: 'dashboard',
  
  init() {
    this.initClock();
    this.loadUsers();
    if (window.lucide) window.lucide.createIcons();
  },

  // API İSTEMCİSİ
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

  // GİRİŞ / ÇIKIŞ METODLARI
  async promptAdminLogin() {
    const pin = prompt('Yönetici PIN Kodunu Giriniz (1234):');
    if (!pin) return;
    const res = await this.api('auth&action=login_admin', {
      method: 'POST',
      body: JSON.stringify({ pin })
    });
    if (res.success) {
      location.reload();
    } else {
      alert('Hatalı PIN!');
    }
  },

  async loginGuest() {
    const res = await this.api('auth&action=login_user', {
      method: 'POST',
      body: JSON.stringify({})
    });
    if (res.success) location.reload();
  },

  async loginUser(userId, hasPin) {
    let pin = null;
    if (hasPin) {
      pin = prompt('PIN Kodunu Giriniz:');
      if (!pin) return;
    }
    const res = await this.api('auth&action=login_user', {
      method: 'POST',
      body: JSON.stringify({ userId, pin })
    });
    if (res.success) {
      location.reload();
    } else {
      alert(res.message || 'Hatalı PIN!');
    }
  },

  async logout() {
    await this.api('auth&action=logout');
    location.reload();
  },

  // SEKME YÖNLENDİRİCİ
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

  // MENÜ DARALTMA & MOBİL
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

  // KULLANICILAR (ADMIN)
  async loadUsers() {
    const res = await this.api('users');
    if (!res.success) return;
    const users = res.data || [];
    const grid = document.getElementById('adminUserCardsGrid');
    if (!grid) return;

    grid.innerHTML = users.map(u => `
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div class="flex justify-between items-start">
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
      this.toast('Yeni kullanıcı oluşturuldu', 'success');
    }
  },

  async deleteUser(id) {
    if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
    await this.api('users', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    this.loadUsers();
    this.toast('Kullanıcı silindi', 'info');
  },

  // MODAL KONTROLLERİ
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

  // CANLI SAAT
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

  // TOAST BİLDİRİMLERİ
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