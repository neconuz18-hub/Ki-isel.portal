/**
 * Portal Engine (js/portal.js) — Enterprise Single-Engine Frontend
 */

const Portal = {
  currentTab: 'dashboard',
  minimizedWidgets: JSON.parse(localStorage.getItem('minimized_widgets') || '[]'),
  
  init() {
    this.initClock();
    this.bindQuickCapture();
    this.renderMinimizedDock();
    this.refreshAll();
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

  // WIDGET KÜÇÜLTME & BALONCUK DOCK
  minimizeWidget(id) {
    if (!this.minimizedWidgets.includes(id)) {
      this.minimizedWidgets.push(id);
      localStorage.setItem('minimized_widgets', JSON.stringify(this.minimizedWidgets));
    }
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) wrapper.classList.add('hidden');
    this.renderMinimizedDock();
    this.toast('Widget üst panele baloncuk olarak eklendi', 'info');
  },

  restoreWidget(id) {
    this.minimizedWidgets = this.minimizedWidgets.filter(item => item !== id);
    localStorage.setItem('minimized_widgets', JSON.stringify(this.minimizedWidgets));
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) {
      wrapper.classList.remove('hidden');
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    this.renderMinimizedDock();
    this.toast('Widget geri açıldı', 'success');
  },

  renderMinimizedDock() {
    const dock = document.getElementById('headerWidgetDock');
    if (!dock) return;

    this.minimizedWidgets.forEach(id => {
      const wrapper = document.getElementById(id + 'WidgetWrapper');
      if (wrapper) wrapper.classList.add('hidden');
    });

    if (this.minimizedWidgets.length === 0) {
      dock.innerHTML = '';
      dock.classList.add('hidden');
      return;
    }

    dock.classList.remove('hidden');
    dock.innerHTML = `
      <div class="flex items-center gap-1.5 pl-1 pr-2 py-0.5 border-r border-slate-700/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
        <i data-lucide="layers" class="w-3.5 h-3.5 text-blue-400"></i>
        <span>Küçültülenler:</span>
      </div>
      <div class="flex items-center gap-2 overflow-x-auto py-0.5">
        ${this.minimizedWidgets.map(id => `
          <button 
            type="button" 
            onclick="Portal.restoreWidget('${id}')" 
            class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 hover:border-blue-500/80 text-xs font-semibold opacity-60 hover:opacity-100 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer group flex-shrink-0 animate-fadeIn"
            title="${id} widgetını açmak için tıklayın"
          >
            <span class="text-[11px] font-bold text-slate-300 group-hover:text-white capitalize">${id}</span>
            <i data-lucide="plus" class="w-3 h-3 text-slate-500 group-hover:text-blue-400"></i>
          </button>
        `).join('')}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  // CANLI VERİ YENİLEYİCİ
  async refreshAll() {
    await Promise.all([
      this.loadTasks(),
      this.loadReminders(),
      this.loadNotes(),
      this.loadSubscriptions(),
      this.loadUsers()
    ]);
  },

  // GÖREVLER
  async loadTasks() {
    const res = await this.api('tasks');
    if (!res.success) return;
    const tasks = res.data || [];
    
    // Dashboard ve Ana Görevler listesini doldur
    const taskHtml = tasks.map(t => `
      <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group">
        <div class="flex items-center gap-3 min-w-0">
          <button onclick="Portal.toggleTask('${t.id}')" class="w-5 h-5 rounded-lg border ${t.status === 'completed' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600 hover:border-blue-400'} flex items-center justify-center transition-colors">
            ${t.status === 'completed' ? '<i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>' : ''}
          </button>
          <div class="min-w-0">
            <span class="text-xs font-medium ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'} block truncate">${t.title}</span>
            <span class="text-[10px] text-slate-500">${t.category} • ${t.priority}</span>
          </div>
        </div>
        <button onclick="Portal.deleteTask('${t.id}')" class="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    const dList = document.getElementById('dashboardTaskList');
    const mList = document.getElementById('mainTaskList');
    if (dList) dList.innerHTML = taskHtml || '<p class="text-xs text-slate-500 text-center py-4">Bekleyen görev yok.</p>';
    if (mList) mList.innerHTML = taskHtml || '<p class="text-xs text-slate-500 text-center py-4">Bekleyen görev yok.</p>';

    // Dashboard İstatistiklerini Güncelle
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const elTotal = document.getElementById('statTotalTasks');
    const elDone = document.getElementById('statDoneTasks');
    const elPending = document.getElementById('statPendingTasks');
    const elRate = document.getElementById('statProgressRate');
    const elBar = document.getElementById('dashboardProgressBar');

    if (elTotal) elTotal.textContent = total;
    if (elDone) elDone.textContent = completed;
    if (elPending) elPending.textContent = pending;
    if (elRate) elRate.textContent = '%' + rate;
    if (elBar) elBar.style.width = rate + '%';

    if (window.lucide) window.lucide.createIcons();
  },

  async handleSaveTask(e) {
    e.preventDefault();
    const title = document.getElementById('taskInputTitle')?.value;
    const category = document.getElementById('taskInputCategory')?.value;
    const priority = document.getElementById('taskInputPriority')?.value;

    const res = await this.api('tasks', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', title, category, priority })
    });

    if (res.success) {
      this.closeModal('newTaskModal');
      document.getElementById('taskInputTitle').value = '';
      this.loadTasks();
      this.toast('Görev kaydedildi', 'success');
    }
  },

  async toggleTask(id) {
    await this.api('tasks', { method: 'POST', body: JSON.stringify({ action: 'toggle', id }) });
    this.loadTasks();
  },

  async deleteTask(id) {
    if (!confirm('Görevi silmek istiyor musunuz?')) return;
    await this.api('tasks', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    this.loadTasks();
    this.toast('Görev silindi', 'info');
  },

  // HATIRLATICILAR
  async loadReminders() {
    const res = await this.api('reminders');
    if (!res.success) return;
    const list = res.data || [];
    const html = list.map(r => `
      <div class="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
        <div>
          <h4 class="text-xs font-bold text-slate-200">${r.title}</h4>
          <span class="text-[10px] text-amber-400 font-mono">${new Date(r.datetime).toLocaleString('tr-TR')}</span>
        </div>
        <button onclick="Portal.deleteReminder('${r.id}')" class="text-slate-500 hover:text-rose-400 p-1">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    const el1 = document.getElementById('dashboardRemindersList');
    const el2 = document.getElementById('mainRemindersList');
    if (el1) el1.innerHTML = html || '<p class="text-xs text-slate-500 text-center py-2">Hatırlatıcı yok.</p>';
    if (el2) el2.innerHTML = html || '<p class="text-xs text-slate-500 text-center py-4">Hatırlatıcı yok.</p>';

    const countEl = document.getElementById('statPendingReminders');
    if (countEl) countEl.textContent = list.length;

    if (window.lucide) window.lucide.createIcons();
  },

  async handleSaveReminder(e) {
    e.preventDefault();
    const title = document.getElementById('remInputTitle')?.value;
    const datetime = document.getElementById('remInputDateTime')?.value;
    const notes = document.getElementById('remInputNotes')?.value;

    const res = await this.api('reminders', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', title, datetime, notes })
    });
    if (res.success) {
      this.closeModal('newReminderModal');
      this.loadReminders();
      this.toast('Hatırlatıcı oluşturuldu', 'success');
    }
  },

  async deleteReminder(id) {
    await this.api('reminders', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    this.loadReminders();
  },

  // NOTLAR
  async loadNotes() {
    const res = await this.api('notes');
    if (!res.success) return;
    const list = res.data || [];
    const html = list.map(n => `
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative group">
        <h4 class="text-xs font-bold text-white">${n.title}</h4>
        <p class="text-[11px] text-slate-400 whitespace-pre-wrap">${n.content}</p>
        <button onclick="Portal.deleteNote('${n.id}')" class="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    const el1 = document.getElementById('dashboardNotesList');
    const el2 = document.getElementById('mainNotesList');
    if (el1) el1.innerHTML = html || '<p class="text-xs text-slate-500 text-center py-2">Not yok.</p>';
    if (el2) el2.innerHTML = html || '<p class="text-xs text-slate-500 text-center py-4">Not yok.</p>';
    if (window.lucide) window.lucide.createIcons();
  },

  async handleSaveNote(e) {
    e.preventDefault();
    const title = document.getElementById('noteInputTitle')?.value;
    const content = document.getElementById('noteInputContent')?.value;

    const res = await this.api('notes', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', title, content })
    });
    if (res.success) {
      this.closeModal('newNoteModal');
      this.loadNotes();
      this.toast('Not kaydedildi', 'success');
    }
  },

  async deleteNote(id) {
    await this.api('notes', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    this.loadNotes();
  },

  // ABONELİKLER
  async loadSubscriptions() {
    const res = await this.api('subscriptions');
    if (!res.success) return;
    const list = res.data || [];
    const html = list.map(s => `
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
        <div>
          <h4 class="text-xs font-bold text-white">${s.title}</h4>
          <span class="text-[10px] text-slate-400">Sonraki: ${s.next_billing_date}</span>
        </div>
        <div class="text-right">
          <span class="text-xs font-mono font-bold text-amber-400">₺${parseFloat(s.amount).toFixed(2)}</span>
          <button onclick="Portal.deleteSubscription('${s.id}')" class="block text-[10px] text-rose-400 hover:underline mt-1">Sil</button>
        </div>
      </div>
    `).join('');

    const el1 = document.getElementById('subscriptionsWidgetContainer');
    const el2 = document.getElementById('mainSubscriptionsList');
    if (el1) el1.innerHTML = html || '<p class="text-xs text-slate-500 text-center py-2">Abonelik yok.</p>';
    if (el2) el2.innerHTML = html || '<p class="text-xs text-slate-500 text-center py-4">Abonelik yok.</p>';
    if (window.lucide) window.lucide.createIcons();
  },

  async handleSaveSubscription(e) {
    e.preventDefault();
    const title = document.getElementById('subInputTitle')?.value;
    const amount = document.getElementById('subInputAmount')?.value;
    const next_billing_date = document.getElementById('subInputDate')?.value;

    const res = await this.api('subscriptions', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', title, amount, next_billing_date })
    });
    if (res.success) {
      this.closeModal('newSubscriptionModal');
      this.loadSubscriptions();
      this.toast('Abonelik eklendi', 'success');
    }
  },

  async deleteSubscription(id) {
    await this.api('subscriptions', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    this.loadSubscriptions();
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
        <div class="text-[10px] text-blue-400">
          ${(u.assigned_modules || []).length} Modül Yetkilendirildi
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
    const checkboxes = document.querySelectorAll('input[name="userModules"]:checked');
    const assigned_modules = Array.from(checkboxes).map(c => c.value);

    const res = await this.api('users', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', name, phone, pin, assigned_modules })
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

  // HIZLI GÖREV GİRİŞİ (QUICK CAPTURE)
  bindQuickCapture() {
    const form = document.getElementById('quickCaptureForm');
    const input = document.getElementById('quickCaptureInput');
    if (!form || !input) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      await this.api('tasks', {
        method: 'POST',
        body: JSON.stringify({ action: 'create', title: val, category: 'Genel', priority: 'Normal' })
      });
      input.value = '';
      this.loadTasks();
      this.toast('Görev hızlıca eklendi', 'success');
    });
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