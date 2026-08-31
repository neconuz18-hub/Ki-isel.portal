/**
 * Menu Manager Module - Sol Kenar Menüsü & Hiyerarşik Alt Menü Yönetimi (menus.js)
 */

const STORAGE_MENU_KEY = 'assistant_custom_menus_v2';
const STORAGE_OPEN_GROUPS_KEY = 'assistant_sidebar_open_groups';

const DEFAULT_STRUCTURED_MENUS = [
  // 1. Ana Kokpit
  { 
    id: 'dashboard', 
    label: 'Ana Sayfa', 
    icon: 'home', 
    type: 'tab' 
  },

  // 2. Finans & Yatırım (Grup)
  {
    id: 'group_finance',
    label: 'Finans & Yatırım',
    icon: 'trending-up',
    type: 'group',
    children: [
      { id: 'finance', label: 'Borsa & Canlı Piyasalar', icon: 'trending-up', type: 'tab' },
      { id: 'ipo', label: 'Halka Arz Takvimi', icon: 'pie-chart', type: 'tab' },
      { id: 'subscriptions', label: 'Abonelik & Ödemeler', icon: 'credit-card', type: 'tab' }
    ]
  },

  // 3. Kişisel Verimlilik & Planlama (Grup)
  {
    id: 'group_productivity',
    label: 'Kişisel Verimlilik',
    icon: 'check-circle',
    type: 'group',
    children: [
      { id: 'tasks', label: 'Görevler & İş Takibi', icon: 'check-circle', type: 'tab' },
      { id: 'reminders', label: 'Hatırlatıcılar', icon: 'alarm-clock', type: 'tab' },
      { id: 'notes', label: 'Toplantı & Notlar', icon: 'book-open', type: 'tab' },
      { id: 'routines', label: 'Odaklanma & Rutin', icon: 'target', type: 'tab' }
    ]
  },

  // 4. Canlı Gündem
  { 
    id: 'news', 
    label: 'Gündem & Haberler', 
    icon: 'newspaper', 
    type: 'tab' 
  },

  // 5. Güvenlik & Sistem (Grup)
  {
    id: 'group_system',
    label: 'Güvenlik & Sistem',
    icon: 'shield-check',
    type: 'group',
    children: [
      { id: 'vault', label: 'Güvenli Kasa & Profil', icon: 'shield-check', type: 'tab' },
      { id: 'settings', label: 'Ayarlar & Yedek', icon: 'settings', type: 'tab' }
    ]
  }
];

class MenuManager {
  constructor() {
    this.openGroups = window.appStorage.get(STORAGE_OPEN_GROUPS_KEY, ['group_finance', 'group_productivity']);
    this.menus = this.loadMenus();
  }

  loadMenus() {
    return JSON.parse(JSON.stringify(DEFAULT_STRUCTURED_MENUS));
  }

  toggleGroup(groupId) {
    if (this.openGroups.includes(groupId)) {
      this.openGroups = this.openGroups.filter(g => g !== groupId);
    } else {
      this.openGroups.push(groupId);
    }
    window.appStorage.save(STORAGE_OPEN_GROUPS_KEY, this.openGroups, false);
    this.renderSidebar();
  }

  ensureGroupOpen(tabId) {
    for (const item of this.menus) {
      if (item.type === 'group' && item.children) {
        if (item.children.some(c => c.id === tabId)) {
          if (!this.openGroups.includes(item.id)) {
            this.openGroups.push(item.id);
            window.appStorage.save(STORAGE_OPEN_GROUPS_KEY, this.openGroups, false);
          }
          break;
        }
      }
    }
  }

  renderSidebar() {
    const container = document.getElementById('sidebarNavContainer');
    if (!container) return;

    const currentTab = window.app ? window.app.currentTab : 'dashboard';
    this.ensureGroupOpen(currentTab);

    const taskStats = window.taskManager ? window.taskManager.getStats() : { pending: 0 };
    const reminders = window.reminderManager ? window.reminderManager.getReminders().filter(r => !r.completed) : [];

    let html = '';

    this.menus.forEach(item => {
      // 1. TEKİL MENÜ ELEMANI
      if (item.type === 'tab') {
        const isActive = (item.id === currentTab);
        html += `
          <button type="button" data-tab="${item.id}"
                  class="tab-btn sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group cursor-pointer ${isActive ? 'active' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}">
            <i data-lucide="${item.icon || 'circle'}" class="w-4 h-4 flex-shrink-0 pointer-events-none ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}"></i>
            <span class="sidebar-label truncate text-left flex-1 pointer-events-none">${escapeHtml(item.label)}</span>
          </button>
        `;
      }

      // 2. AÇILIR ALT MENÜLÜ GRUP
      else if (item.type === 'group' && item.children) {
        const isOpen = this.openGroups.includes(item.id);
        const hasActiveChild = item.children.some(c => c.id === currentTab);

        html += `
          <div class="sidebar-group-wrapper space-y-1 pt-1">
            <!-- Grup Başlığı / Açma-Kapama Butonu -->
            <button type="button" onclick="window.menuManager.toggleGroup('${item.id}')"
                    class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all group cursor-pointer ${hasActiveChild ? 'text-amber-400 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}">
              <div class="flex items-center gap-2.5 min-w-0 pointer-events-none">
                <i data-lucide="${item.icon}" class="w-4 h-4 ${hasActiveChild ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300'}"></i>
                <span class="sidebar-label truncate tracking-wide text-left">${escapeHtml(item.label)}</span>
              </div>
              <i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}" class="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform flex-shrink-0"></i>
            </button>

            <!-- Alt Menü Elemanları (Sub-menus) -->
            <div class="${isOpen ? 'block' : 'hidden'} pl-3 ml-3 border-l border-slate-700/50 space-y-1 transition-all duration-200">
              ${item.children.map(child => {
                const isChildActive = (child.id === currentTab);
                let badgeHtml = '';

                if (child.id === 'tasks' && taskStats.pending > 0) {
                  badgeHtml = `<span class="ml-auto px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">${taskStats.pending}</span>`;
                } else if (child.id === 'reminders' && reminders.length > 0) {
                  badgeHtml = `<span class="ml-auto px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">${reminders.length}</span>`;
                }

                return `
                  <button type="button" data-tab="${child.id}"
                          class="tab-btn sidebar-sub-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${isChildActive ? 'bg-amber-500/15 text-amber-300 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}">
                    <i data-lucide="${child.icon || 'circle'}" class="w-3.5 h-3.5 flex-shrink-0 pointer-events-none ${isChildActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}"></i>
                    <span class="truncate text-left flex-1 pointer-events-none">${escapeHtml(child.label)}</span>
                    ${badgeHtml}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  save() {
    this.renderSidebar();
  }

  getMenus() {
    return this.menus;
  }
}

window.menuManager = new MenuManager();

// Use event delegation to guarantee clicks are caught even if HTML is regenerated or adblockers strip inline handlers
document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn && window.app) {
        const tabId = tabBtn.getAttribute('data-tab');
        if (tabId) {
            window.app.switchTab(tabId);
        }
    }
});
