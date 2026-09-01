/**
 * AdminManager — Yönetim Merkezi (admin.js) v2
 */

class AdminManager {
  constructor() {
    this.activeAdminTab = 'users'; // users | modules | profile | seeds | backup
    this.editingUserId = null;
  }

  switchAdminTab(tab) {
    this.activeAdminTab = tab;
    this.render();
  }

  render() {
    const container = document.getElementById('tab-admin');
    if (!container) return;

    const currentProfile = window.moduleRegistry?.profileManager?.loadProfile();
    const currentPresetId = currentProfile?.presetId || 'bireysel_zen';
    const allPresets = window.moduleRegistry?.PRESETS || {};
    const allModules = window.moduleRegistry?.ALL_MODULES || {};
    const enabledModules = window.moduleRegistry?.profileManager?.enabledModules || [];
    const totalRecords = window.polymorphicStore?.records?.length || 0;
    const usersCount = window.userManager ? window.userManager.getUsers().length : 0;

    let storageBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const storageKb = (storageBytes / 1024).toFixed(1);
    const activeTab = this.activeAdminTab;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        <!-- Üst Başlık & Özet -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/50 border border-purple-500/30 shadow-xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
              <i data-lucide="settings" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-slate-100">Yönetim Merkezi</h2>
                <span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">SUPER ADMIN</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Kullanıcıları tanımlayın, modülleri atayın, profilleri ve test verilerini yönetin.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <div class="text-center px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span class="block text-lg font-mono font-bold text-purple-400">${usersCount}</span>
              <span class="text-slate-500">Kullanıcı</span>
            </div>
            <div class="text-center px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span class="block text-lg font-mono font-bold text-blue-400">${enabledModules.length}</span>
              <span class="text-slate-500">Aktif Modül</span>
            </div>
            <div class="text-center px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span class="block text-lg font-mono font-bold text-cyan-400">${totalRecords}</span>
              <span class="text-slate-500">Kayıt</span>
            </div>
          </div>
        </div>

        <!-- Alt Sekmeler -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button onclick="window.adminManager.switchAdminTab('users')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="user-check" class="w-3.5 h-3.5"></i> Kullanıcı Yönetimi</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('modules')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'modules' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="layout-grid" class="w-3.5 h-3.5"></i> Modül Havuzu</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('profile')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="users" class="w-3.5 h-3.5"></i> Meslek Şablonları</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('seeds')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'seeds' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="database" class="w-3.5 h-3.5"></i> Test Verileri</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('backup')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'backup' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="hard-drive-download" class="w-3.5 h-3.5"></i> Yedekleme</span>
          </button>
        </div>

        <!-- İÇERİK ALANI -->
        ${activeTab === 'users' ? this.renderUsersTab(allModules, allPresets) : ''}
        ${activeTab === 'modules' ? this.renderModulesTab(allModules, enabledModules) : ''}
        ${activeTab === 'profile' ? this.renderProfileTab(allPresets, currentPresetId) : ''}
        ${activeTab === 'seeds' ? this.renderSeedsTab() : ''}
        ${activeTab === 'backup' ? this.renderBackupTab() : ''}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  renderUsersTab(allModules, allPresets) {
    const users = window.userManager ? window.userManager.getUsers() : [];

    const userCards = users.map(user => {
      const assignedMods = user.assignedModules || [];
      const preset = allPresets[user.presetId];

      return `
        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-100">${window.escapeHtml(user.name)}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-medium">
                    ${preset ? preset.title : 'Özel Rol'}
                  </span>
                  ${user.pin ? '<span class="text-[10px] text-amber-400 font-mono flex items-center gap-0.5"><i data-lucide="lock" class="w-2.5 h-2.5"></i> PIN Korumalı</span>' : ''}
                </div>
              </div>
            </div>

            <!-- Aksiyon Butonları -->
            <div class="flex items-center gap-1.5">
              <button onclick="window.adminManager.openUserModal('${user.id}')" title="Düzenle" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="window.adminManager.deleteUser('${user.id}')" title="Sil" class="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 transition-all cursor-pointer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Atanan Modüller Özeti -->
          <div class="space-y-1.5">
            <div class="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Tanımlı Modüller (${assignedMods.length})</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${assignedMods.map(mId => {
                const mod = allModules[mId];
                if (!mod) return '';
                return `
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/40 text-blue-300 border border-blue-800/40 flex items-center gap-1">
                    <i data-lucide="${mod.icon || 'circle'}" class="w-2.5 h-2.5"></i>
                    ${mod.label}
                  </span>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Alt Buton: Kullanıcı Olarak Giriş Yap -->
          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span class="text-[10px] text-slate-500">Oluşturulma: ${new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
            <button onclick="window.authManager.loginAsUser('${user.id}')" class="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer">
              <span>Bu Kullanıcıyla Aç</span>
              <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="space-y-4">
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
                <i data-lucide="users" class="w-4 h-4 text-purple-400"></i>
                Tanımlı Kullanıcı ve Personel Profilleri
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Kullanıcı ekleyin, hangi modülleri kullanacağını belirleyin ve Gateway girişine ekleyin.</p>
            </div>
            <button onclick="window.adminManager.openUserModal()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>Yeni Kullanıcı Ekle</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            ${userCards.length > 0 ? userCards : '<div class="col-span-full py-8 text-center text-slate-500 text-xs">Henüz kayıtlı kullanıcı bulunmuyor. Yeni eklemek için yukarıdaki butona tıklayın.</div>'}
          </div>
        </div>

        <!-- Kullanıcı Ekle / Düzenle Modal -->
        <div id="adminUserModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 id="userModalTitle" class="text-base font-bold text-white flex items-center gap-2">
                <i data-lucide="user-plus" class="w-5 h-5 text-purple-400"></i>
                Yeni Kullanıcı Tanımla
              </h3>
              <button onclick="window.adminManager.closeUserModal()" class="text-slate-400 hover:text-white p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form id="adminUserForm" onsubmit="window.adminManager.handleSaveUser(event)" class="space-y-4 text-xs">
              <input type="hidden" id="userModalId" value="">

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="font-bold text-slate-300">Kullanıcı / Personel Adı *</label>
                  <input type="text" id="userModalName" required placeholder="Örn: Şevval Çelik (Öğretmen)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500">
                </div>
                <div class="space-y-1.5">
                  <label class="font-bold text-slate-300">Telefon (Opsiyonel)</label>
                  <input type="text" id="userModalPhone" placeholder="05xx xxx xx xx" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="font-bold text-slate-300">Giriş PIN Kodu (Opsiyonel)</label>
                  <input type="password" id="userModalPin" maxlength="6" placeholder="Boş bırakılırsa şifresiz girer" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500">
                </div>
                <div class="space-y-1.5">
                  <label class="font-bold text-slate-300">Hızlı Meslek Şablonu Uygula</label>
                  <select id="userModalPresetSelect" onchange="window.adminManager.handlePresetSelectChange(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500">
                    <option value="">-- Şablon Seç (Modülleri Doldurur) --</option>
                    ${Object.values(allPresets).map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- Modül Seçim Matrisi -->
              <div class="space-y-2 pt-2 border-t border-slate-800">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-slate-300">Bu Kullanıcıya Açılacak Modüller *</label>
                  <span class="text-[10px] text-purple-400">İstediğiniz modülleri işaretleyin</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  ${Object.values(allModules).map(mod => `
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all">
                      <input type="checkbox" name="userModules" value="${mod.id}" class="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0">
                      <span class="text-slate-200 text-[11px] font-medium truncate">${mod.label}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onclick="window.adminManager.closeUserModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 cursor-pointer">Kaydet ve Uygula</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  openUserModal(userId = null) {
    this.editingUserId = userId;
    const modal = document.getElementById('adminUserModal');
    const title = document.getElementById('userModalTitle');
    const idInput = document.getElementById('userModalId');
    const nameInput = document.getElementById('userModalName');
    const phoneInput = document.getElementById('userModalPhone');
    const pinInput = document.getElementById('userModalPin');
    const presetSelect = document.getElementById('userModalPresetSelect');
    const checkboxes = document.querySelectorAll('input[name="userModules"]');

    if (!modal) return;

    checkboxes.forEach(cb => cb.checked = false);
    if (presetSelect) presetSelect.value = '';

    if (userId && window.userManager) {
      const user = window.userManager.getUserById(userId);
      if (user) {
        if (title) title.innerHTML = '<i data-lucide="edit-3" class="w-5 h-5 text-purple-400"></i> Kullanıcıyı Düzenle';
        if (idInput) idInput.value = user.id;
        if (nameInput) nameInput.value = user.name || '';
        if (phoneInput) phoneInput.value = user.phone || '';
        if (pinInput) pinInput.value = user.pin || '';
        if (presetSelect && user.presetId) presetSelect.value = user.presetId;

        const assigned = user.assignedModules || [];
        checkboxes.forEach(cb => {
          if (assigned.includes(cb.value)) cb.checked = true;
        });
      }
    } else {
      if (title) title.innerHTML = '<i data-lucide="user-plus" class="w-5 h-5 text-purple-400"></i> Yeni Kullanıcı Tanımla';
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      if (pinInput) pinInput.value = '';
      checkboxes.forEach(cb => {
        if (['dashboard', 'tasks', 'notes'].includes(cb.value)) cb.checked = true;
      });
    }

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeUserModal() {
    const modal = document.getElementById('adminUserModal');
    if (modal) modal.classList.add('hidden');
    this.editingUserId = null;
  }

  handlePresetSelectChange(presetId) {
    if (!presetId || !window.moduleRegistry) return;
    const preset = window.moduleRegistry.PRESETS[presetId];
    if (!preset) return;

    const checkboxes = document.querySelectorAll('input[name="userModules"]');
    checkboxes.forEach(cb => {
      cb.checked = preset.defaultModules.includes(cb.value);
    });
  }

  handleSaveUser(e) {
    e.preventDefault();
    const id = document.getElementById('userModalId')?.value;
    const name = document.getElementById('userModalName')?.value;
    const phone = document.getElementById('userModalPhone')?.value;
    const pin = document.getElementById('userModalPin')?.value;
    const presetId = document.getElementById('userModalPresetSelect')?.value;

    const checkboxes = document.querySelectorAll('input[name="userModules"]:checked');
    const assignedModules = Array.from(checkboxes).map(cb => cb.value);

    if (assignedModules.length === 0) {
      alert('Lütfen kullanıcı için en az 1 modül seçin!');
      return;
    }

    if (!assignedModules.includes('dashboard')) {
      assignedModules.unshift('dashboard');
    }

    const userData = {
      name,
      phone,
      pin: pin || null,
      presetId: presetId || null,
      assignedModules
    };

    if (id && window.userManager) {
      window.userManager.updateUser(id, userData);
      if (window.app && window.app.showToast) window.app.showToast('Kullanıcı güncellendi', 'success');
    } else if (window.userManager) {
      window.userManager.createUser(userData);
      if (window.app && window.app.showToast) window.app.showToast('Yeni kullanıcı oluşturuldu', 'success');
    }

    this.closeUserModal();
    this.render();
  }

  deleteUser(userId) {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    if (window.userManager) {
      window.userManager.deleteUser(userId);
      if (window.app && window.app.showToast) window.app.showToast('Kullanıcı silindi', 'info');
      this.render();
    }
  }

  renderModulesTab(allModules, enabledModules) {
    const cards = Object.values(allModules).filter(m => m.id !== 'dashboard').map(mod => {
      const on = enabledModules.includes(mod.id);
      return `
        <div class="flex items-center justify-between p-4 rounded-2xl border transition-all ${on ? 'bg-blue-950/30 border-blue-500/40' : 'bg-slate-900/40 border-slate-800'}">
          <div class="flex items-center gap-3 min-w-0">
            <div class="p-2.5 rounded-xl ${on ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
              <i data-lucide="${mod.icon || 'circle'}" class="w-5 h-5"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold ${on ? 'text-blue-200' : 'text-slate-300'} truncate">${window.escapeHtml(mod.label)}</h4>
              <p class="text-[11px] ${on ? 'text-blue-400/60' : 'text-slate-500'} truncate">${mod.desc || mod.category || ''}</p>
            </div>
          </div>
          <button onclick="window.adminManager.toggleModuleAdmin('${mod.id}')" class="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${on ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'}">
            ${on ? 'Kaldır' : 'Ekle'}
          </button>
        </div>`;
    }).join('');

    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="layout-grid" class="w-4 h-4 text-blue-400"></i> Sistem Geneli Modül Havuzu
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Genel açık olan modülleri kontrol edin.</p>
          </div>
          <span class="px-3 py-1 rounded-xl bg-blue-600/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/30">${enabledModules.length} aktif</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${cards}</div>
      </div>`;
  }

  renderProfileTab(allPresets, currentPresetId) {
    const cards = Object.values(allPresets).map(p => {
      const cur = (p.id === currentPresetId);
      return `
        <div onclick="window.adminManager.switchRole('${p.id}')" class="cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3 group ${cur ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/50' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}">
          <div class="p-2.5 rounded-xl ${cur ? 'bg-purple-600/30 text-purple-300' : 'bg-slate-800 text-slate-400'} border border-slate-700">
            <i data-lucide="${p.icon || 'circle'}" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-slate-100 truncate">${p.title}</h4>
            <span class="text-[10px] ${cur ? 'text-purple-400 font-bold' : 'text-slate-500'}">${cur ? 'Aktif Profil' : 'Geçiş yap'}</span>
          </div>
          ${cur ? '<span class="w-3 h-3 rounded-full bg-purple-400 animate-pulse flex-shrink-0"></span>' : ''}
        </div>`;
    }).join('');

    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="users" class="w-4 h-4 text-purple-400"></i> Meslek Şablonları & Rol Seçimi
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Bir profil seçtiğinizde, o mesleğe ait varsayılan modüller otomatik yüklenir.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">${cards}</div>
        <div class="pt-3 border-t border-slate-800/60">
          <button onclick="window.onboardingManager?.open()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Kurulum Sihirbazını Yeniden Başlat
          </button>
        </div>
      </div>`;
  }

  renderSeedsTab() {
    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="database" class="w-4 h-4 text-cyan-400"></i> Test Verisi Fabrikası
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Tek tıkla zengin test verileri yükleyerek modülleri deneyimleyin.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button onclick="window.adminManager.seedEsnafData()" class="p-4 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-emerald-400 flex items-center gap-2"><i data-lucide="shopping-cart" class="w-4 h-4"></i> Bakkal / Esnaf</h4>
            <p class="text-[11px] text-slate-400 mt-1">3 veresiye müşterisi ve ödeme kayıtları</p>
          </button>
          <button onclick="window.adminManager.seedDoctorData()" class="p-4 rounded-2xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-cyan-400 flex items-center gap-2"><i data-lucide="stethoscope" class="w-4 h-4"></i> Doktor / Sağlıkçı</h4>
            <p class="text-[11px] text-slate-400 mt-1">3 nöbet ve 1 icap kaydı</p>
          </button>
          <button onclick="window.adminManager.seedCoachData()" class="p-4 rounded-2xl bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-blue-400 flex items-center gap-2"><i data-lucide="graduation-cap" class="w-4 h-4"></i> Koçluk & Özel Ders</h4>
            <p class="text-[11px] text-slate-400 mt-1">Öğrenci, 5 deneme neti ve görüşme notu</p>
          </button>
          <button onclick="window.adminManager.seedLawyerData()" class="p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-purple-400 flex items-center gap-2"><i data-lucide="scale" class="w-4 h-4"></i> Avukat / Dava</h4>
            <p class="text-[11px] text-slate-400 mt-1">2 duruşma, 1 istinaf süre sayacı</p>
          </button>
          <button onclick="window.adminManager.seedRealEstateData()" class="p-4 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-amber-400 flex items-center gap-2"><i data-lucide="building-2" class="w-4 h-4"></i> Emlakçı Portföy</h4>
            <p class="text-[11px] text-slate-400 mt-1">3 satılık/kiralık daire kaydı</p>
          </button>
          <button onclick="window.adminManager.clearAllData()" class="p-4 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-rose-400 flex items-center gap-2"><i data-lucide="trash-2" class="w-4 h-4"></i> Tüm Verileri Temizle</h4>
            <p class="text-[11px] text-slate-400 mt-1">Veritabanını sıfırlar</p>
          </button>
        </div>
      </div>`;
  }

  renderBackupTab() {
    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="hard-drive-download" class="w-4 h-4 text-emerald-400"></i> Veri Yedekleme & Geri Yükleme
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Tüm portal verilerini ve kullanıcıları tek tıkla bilgisayarınıza indirin veya yedeği geri yükleyin.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.adminManager.exportData()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
            <i data-lucide="download" class="w-4 h-4"></i> JSON Yedeği İndir
          </button>
          <label class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="upload" class="w-4 h-4"></i> Yedeği Geri Yükle
            <input type="file" accept=".json" onchange="window.adminManager.importData(event)" class="hidden">
          </label>
        </div>
      </div>`;
  }

  toggleModuleAdmin(modId) {
    window.moduleRegistry.profileManager.toggleModule(modId);
    this.render();
  }

  switchRole(presetId) {
    window.moduleRegistry.profileManager.setPreset(presetId);
    if (window.soundManager && window.soundManager.playClick) window.soundManager.playClick();
    if (window.menuManager) window.menuManager.refreshByProfile();
    this.render();
  }

  seedEsnafData() {
    const store = window.polymorphicStore;
    const c1 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Ahmet Yılmaz (Terzi)', phone: '0532 111 22 33', role: 'Musteri', initialBalance: 0 });
    const c2 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Mehmet Demir (Taksici)', phone: '0544 222 33 44', role: 'Musteri', initialBalance: 0 });
    const c3 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Ayşe Teyze (No: 12)', phone: '0555 333 44 55', role: 'Musteri', initialBalance: 0 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c1.id, flow: 'outflow', amount: 450, category: 'Veresiye', occurredAt: Date.now() - 86400000 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c2.id, flow: 'outflow', amount: 1200, category: 'Veresiye', occurredAt: Date.now() - 172800000 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c3.id, flow: 'outflow', amount: 280, category: 'Veresiye', occurredAt: Date.now() });
    if (window.app && window.app.showToast) window.app.showToast('Bakkal test verileri yüklendi', 'success');
    this.render();
  }

  seedDoctorData() {
    const store = window.polymorphicStore;
    const today = new Date();
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
    const d3 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11);
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Acil Servis 24s Nöbeti', startAt: d1.getTime(), endAt: d1.getTime() + 86400000, allDay: true, location: 'Şehir Hastanesi Acil', customAttributes: { shiftType: '24 Saat Nöbet' } });
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Dahiliye İcap Görevi', startAt: d2.getTime(), endAt: d2.getTime() + 86400000, allDay: true, location: 'Evde Çağrı', customAttributes: { shiftType: 'İcap Nöbeti' } });
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Yoğun Bakım 24s Nöbeti', startAt: d3.getTime(), endAt: d3.getTime() + 86400000, allDay: true, location: 'Genel Yoğun Bakım B Blok', customAttributes: { shiftType: '24 Saat Nöbet' } });
    if (window.app && window.app.showToast) window.app.showToast('Doktor nöbet verileri yüklendi', 'success');
    this.render();
  }

  seedCoachData() {
    const store = window.polymorphicStore;
    const s1 = store.addRecord({ moduleId: 'ogretmen', primitiveType: 'CONTACT', displayName: 'Şevval Çelik', phone: '0533 999 88 77', role: 'Ogrenci', customAttributes: { parentPhone: '0532 888 77 66', target: 'YKS Sayısal / Tıp', grade: '12. Sınıf', packageLessons: 10, completedLessons: 6, remainingLessons: 4, hourlyRate: '1500', weeklyTarget: 1500, weeklySolved: 1240, nextCallDate: new Date().toISOString().split('T')[0] } });
    const now = Date.now();
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Özdebir TYT-1', category: 'DenemeSinavi', valuation: { amount: 68.5 }, createdAt: now - (20 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'TÖDER TYT-2', category: 'DenemeSinavi', valuation: { amount: 73.0 }, createdAt: now - (15 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: '3D Simülasyon TYT-3', category: 'DenemeSinavi', valuation: { amount: 79.25 }, createdAt: now - (10 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Bilgi Sarmal TYT-4', category: 'DenemeSinavi', valuation: { amount: 84.5 }, createdAt: now - (5 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Özdebir Genel TYT-5', category: 'DenemeSinavi', valuation: { amount: 89.0 }, createdAt: now });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'TIMELINE_EVENT', relatedContactId: s1.id, title: 'Türev testleri ve zaman yönetimi kontrol edildi.', startAt: now, endAt: now + 1800000, customAttributes: { hwStatus: 'Tam Yapıldı', nextGoal: '200 Soru İntegral + 1 AYT Mat Denemesi' } });
    if (window.app && window.app.showToast) window.app.showToast('Eğitim koçluğu test verileri yüklendi', 'success');
    this.render();
  }

  seedLawyerData() {
    const store = window.polymorphicStore;
    const now = Date.now();
    store.addRecord({ moduleId: 'durusma', primitiveType: 'TIMELINE_EVENT', title: 'İstanbul 4. Asliye Hukuk - 2024/182 E.', startAt: now + (3 * 86400000), endAt: now + (3 * 86400000) + 3600000, allDay: false, location: 'Çağlayan C Blok Salon 14' });
    store.addRecord({ moduleId: 'durusma', primitiveType: 'COMPLIANCE_EXPIRY', title: 'İstinaf Başvuru Kesin Süresi (Yılmaz Ltd.)', deadlineAt: now + (4 * 86400000), severity: 'critical', isResolved: false });
    if (window.app && window.app.showToast) window.app.showToast('Avukat test verileri yüklendi', 'success');
    this.render();
  }

  seedRealEstateData() {
    const store = window.polymorphicStore;
    store.addRecord({ moduleId: 'emlak', primitiveType: 'ENTITY', title: 'Kadıköy Moda 3+1 Deniz Manzaralı Arakat', category: 'Satılık Daire', valuation: { amount: 8500000 }, customAttributes: { ownerName: 'Kemal Bey 0532 999 11 22', keyStatus: 'Ofiste' } });
    store.addRecord({ moduleId: 'emlak', primitiveType: 'ENTITY', title: 'Beşiktaş Çarşı 2+1 Eşyalı Masrafsız', category: 'Kiralık Daire', valuation: { amount: 35000 }, customAttributes: { ownerName: 'Fatma Hanım 0542 888 22 33', keyStatus: 'Mal Sahibinde' } });
    if (window.app && window.app.showToast) window.app.showToast('Emlak portföy test verileri yüklendi', 'success');
    this.render();
  }

  clearAllData() {
    if (confirm('DİKKAT: Tüm kayıtlı veriler silinecektir. Emin misiniz?')) {
      window.polymorphicStore.records = [];
      window.polymorphicStore.saveRecords();
      if (window.app && window.app.showToast) window.app.showToast('Tüm veritabanı temizlendi', 'info');
      this.render();
    }
  }

  exportData() {
    const fullBackup = {
      users: window.userManager ? window.userManager.getUsers() : [],
      profile: window.moduleRegistry?.profileManager?.loadProfile(),
      enabledModules: window.moduleRegistry?.profileManager?.enabledModules,
      polymorphicRecords: window.polymorphicStore?.records || [],
      portfolio: JSON.parse(localStorage.getItem('finance_portfolio_v2') || '[]'),
      watchlist: JSON.parse(localStorage.getItem('finance_watchlist_v2') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "Portal_Backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    if (window.app && window.app.showToast) window.app.showToast('Yedek dosyası indirildi', 'success');
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        if (backup.users && window.userManager) {
          window.userManager.users = backup.users;
          window.userManager.saveUsers();
        }
        if (backup.polymorphicRecords) { window.polymorphicStore.records = backup.polymorphicRecords; window.polymorphicStore.saveRecords(); }
        if (backup.profile) { localStorage.setItem('portal_active_user_profile_v2', JSON.stringify(backup.profile)); }
        if (backup.enabledModules) { localStorage.setItem('portal_user_enabled_modules_v2', JSON.stringify(backup.enabledModules)); }
        if (window.app && window.app.showToast) window.app.showToast('Yedek başarıyla geri yüklendi!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        if (window.app && window.app.showToast) window.app.showToast('Geçersiz JSON dosyası!', 'error');
      }
    };
    reader.readAsText(file);
  }
}

window.adminManager = new AdminManager();
