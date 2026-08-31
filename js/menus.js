const escapeHtml = window.escapeHtml || function(str) { if(!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
/**
 * Menu Manager Module — Dinamik Profil & Modül Dağıtım Yöneticisi (menus.js)
 */

const STORAGE_OPEN_GROUPS_KEY = 'assistant_sidebar_open_groups';

class MenuManager {
  constructor() {
    this.openGroups = window.appStorage?.get ? window.appStorage.get(STORAGE_OPEN_GROUPS_KEY, []) : [];
  }

  toggleGroup(groupId) {
    if (this.openGroups.includes(groupId)) {
      this.openGroups = this.openGroups.filter(g => g !== groupId);
    } else {
      this.openGroups.push(groupId);
    }
    if (window.appStorage?.save) {
      window.appStorage.save(STORAGE_OPEN_GROUPS_KEY, this.openGroups, false);
    }
    this.renderSidebar();
  }

  ensureGroupOpen(tabId) {
    const preset = window.moduleRegistry?.profileManager?.getPreset();
    if (!preset || !preset.customMenuGroups) return;

    for (const group of preset.customMenuGroups) {
      if (group.children && group.children.includes(tabId)) {
        if (!this.openGroups.includes(group.id)) {
          this.openGroups.push(group.id);
        }
        break;
      }
    }
  }

  refreshByProfile() {
    this.renderSidebar();
    this.renderUserBadge();
  }

  renderUserBadge() {
    const badgeEl = document.getElementById('userProfileHeaderBadge');
    if (!badgeEl || !window.moduleRegistry) return;

    const profile = window.moduleRegistry.profileManager.loadProfile();
    const preset = window.moduleRegistry.profileManager.getPreset();

    if (profile && preset) {
      badgeEl.innerHTML = `
        <button onclick="window.onboardingManager.open()" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 transition-all text-xs font-semibold">
          <i data-lucide="${preset.icon || 'user'}" class="w-3.5 h-3.5 text-blue-400"></i>
          <span>${profile.customName || preset.title}</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">${preset.badge}</span>
        </button>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderSidebar() {
    const container = document.getElementById('sidebarNavContainer');
    if (!container || !window.moduleRegistry) return;

    const currentTab = window.app ? window.app.currentTab : 'dashboard';
    this.ensureGroupOpen(currentTab);

    const preset = window.moduleRegistry.profileManager.getPreset();
    const enabledModules = window.moduleRegistry.profileManager.enabledModules;
    const allModules = window.moduleRegistry.ALL_MODULES;

    let html = '';

    // 1. Ana Sayfa (Her zaman en üstte)
    const isDashActive = (currentTab === 'dashboard');
    html += `
      <button type="button" data-tab="dashboard"
              class="tab-btn sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group cursor-pointer ${isDashActive ? 'active' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}">
        <i data-lucide="home" class="w-4 h-4 flex-shrink-0 pointer-events-none ${isDashActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}"></i>
        <span class="sidebar-label truncate text-left flex-1 pointer-events-none">Ana Sayfa & Özet</span>
      </button>
    `;

    // 2. Mesleğe Özel Gruplar veya Aktif Modüller
    if (preset.customMenuGroups && preset.customMenuGroups.length > 0) {
      preset.customMenuGroups.forEach(group => {
        // Gruptaki modüllerden aktif olanları filtrele
        const visibleChildren = group.children.filter(mId => enabledModules.includes(mId) && mId !== 'dashboard');
        if (visibleChildren.length === 0) return;

        const isOpen = this.openGroups.includes(group.id) || visibleChildren.includes(currentTab);
        const hasActiveChild = visibleChildren.includes(currentTab);

        html += `
          <div class="sidebar-group-wrapper space-y-1 pt-1">
            <button type="button" onclick="window.menuManager.toggleGroup('${group.id}')"
                    class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all group cursor-pointer ${hasActiveChild ? 'text-amber-400 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}">
              <div class="flex items-center gap-2.5 min-w-0 pointer-events-none">
                <i data-lucide="${group.icon || 'folder'}" class="w-4 h-4 ${hasActiveChild ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300'}"></i>
                <span class="sidebar-label truncate tracking-wide text-left">${escapeHtml(group.label)}</span>
              </div>
              <i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}" class="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform flex-shrink-0"></i>
            </button>

            <div class="${isOpen ? 'block' : 'hidden'} pl-3 ml-3 border-l border-slate-700/50 space-y-1 transition-all duration-200">
              ${visibleChildren.map(mId => {
                const mod = allModules[mId];
                if (!mod) return '';
                const isChildActive = (mId === currentTab);

                return `
                  <button type="button" data-tab="${mod.id}"
                          class="tab-btn sidebar-sub-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${isChildActive ? 'bg-amber-500/15 text-amber-300 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}">
                    <i data-lucide="${mod.icon || 'circle'}" class="w-3.5 h-3.5 flex-shrink-0 pointer-events-none ${isChildActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}"></i>
                    <span class="truncate text-left flex-1 pointer-events-none">${escapeHtml(mod.label)}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      });
    }

    // 3. Gruplarda Olmayan Diğer Aktif Modüller
    const allGroupedChildren = preset.customMenuGroups 
      ? preset.customMenuGroups.flatMap(g => g.children) 
      : [];
    
    const unGroupedActive = enabledModules.filter(mId => mId !== 'dashboard' && !allGroupedChildren.includes(mId));

    if (unGroupedActive.length > 0) {
      unGroupedActive.forEach(mId => {
        const mod = allModules[mId];
        if (!mod) return;
        const isActive = (mod.id === currentTab);
        html += `
          <button type="button" data-tab="${mod.id}"
                  class="tab-btn sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group cursor-pointer ${isActive ? 'active' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}">
            <i data-lucide="${mod.icon || 'circle'}" class="w-4 h-4 flex-shrink-0 pointer-events-none ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}"></i>
            <span class="sidebar-label truncate text-left flex-1 pointer-events-none">${escapeHtml(mod.label)}</span>
          </button>
        `;
      });
    }

    // 4. Modül Ekle / Düzenle Butonu (En altta)
    html += `
      <div class="pt-3 mt-2 border-t border-slate-800/80">
        <button type="button" onclick="window.menuManager.openModuleStore()"
                class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all border border-dashed border-blue-500/30">
          <div class="flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Modül Ekle / Çıkar</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 font-bold">${enabledModules.length}</span>
        </button>
      </div>
    `;

    
    // 5. Geliştirici & Admin Sekmesi
    const isAdminActive = (currentTab === 'admin');
    html += `
      <div class="pt-2">
        <button type="button" data-tab="admin"
                class="tab-btn sidebar-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group cursor-pointer ${
                  isAdminActive ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg' : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/30'
                }">
          <div class="flex items-center gap-2.5">
            <i data-lucide="terminal" class="w-4 h-4 text-purple-400"></i>
            <span class="truncate">Geliştirici & Admin</span>
          </div>
          <span class="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">DEV</span>
        </button>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  // --- MODÜL MAĞAZASI MODALI ---
  openModuleStore() {
    const modal = document.getElementById('moduleStoreModal');
    if (!modal || !window.moduleRegistry) return;

    const allMods = window.moduleRegistry.ALL_MODULES;
    const enabled = window.moduleRegistry.profileManager.enabledModules;
    const container = document.getElementById('moduleStoreList');

    let html = '';
    Object.values(allMods).forEach(mod => {
      if (mod.id === 'dashboard') return;
      const isEnabled = enabled.includes(mod.id);

      html += `
        <div class="flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
          isEnabled ? 'bg-blue-600/10 border-blue-500/40' : 'bg-slate-900/40 border-slate-800'
        }">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-slate-800 text-blue-400 border border-slate-700">
              <i data-lucide="${mod.icon || 'circle'}" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-100">${mod.label}</h4>
              <p class="text-[11px] text-slate-400">${mod.desc || 'Kişisel yönetim aracı'}</p>
            </div>
          </div>
          <button onclick="window.menuManager.toggleModule('${mod.id}')"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isEnabled 
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30' 
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'
                  }">
            ${isEnabled ? 'Kaldır' : 'Ekle'}
          </button>
        </div>
      `;
    });

    if (container) container.innerHTML = html;
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeModuleStore() {
    const modal = document.getElementById('moduleStoreModal');
    if (modal) modal.classList.add('hidden');
  }

  toggleModule(modId) {
    window.moduleRegistry.profileManager.toggleModule(modId);
    this.openModuleStore(); // Listeyi yenile
  }
}

window.menuManager = new MenuManager();

// Tab geçişi yakalayıcı (Event delegation)
document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn && window.app) {
    const tabId = tabBtn.getAttribute('data-tab');
    if (tabId) {
      window.app.switchTab(tabId);
    }
  }
});
