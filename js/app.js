
const WIDGET_META = {
  finance: { label: 'Borsa & Finans', short: 'Borsa', icon: 'trending-up', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  subscriptions: { label: 'Abonelik & Ödemeler', short: 'Abonelik', icon: 'credit-card', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  cityLife: { label: 'Şehir & Akaryakıt', short: 'Şehir', icon: 'compass', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  news: { label: 'Gündem & Haberler', short: 'Haberler', icon: 'newspaper', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  tasks: { label: 'Günün Görevleri', short: 'Görevler', icon: 'list-todo', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  notes: { label: 'Hızlı Notlar', short: 'Notlar', icon: 'book-open', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  reminders: { label: 'Hatırlatıcılar', short: 'Hatırlatıcı', icon: 'alarm-clock', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  focus: { label: 'Odaklanma & Pomodoro', short: 'Odak', icon: 'target', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
  routines: { label: 'Günlük Rutinler', short: 'Rutin', icon: 'check-circle', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' }
};

/**
 * Main Application Orchestrator - App.js
 */

class AssistantApp {
  constructor() {
    this.isAuthenticated = this.checkAuth();
    this.currentTab = this.getInitialTab();
    this.init();
  }

  checkAuth() {
    const session = window.appStorage.get(STORAGE_KEYS.AUTH, null);
    if (session && session.loggedIn) {
      return true;
    }
    return false;
  }

  getInitialTab() {
    let hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      try { hash = atob(hash); } catch(e) {}
      if (hash === 'ipo') return 'ipo';
      const validTabs = ['dashboard', 'finance', 'subscriptions', 'news', 'tasks', 'reminders', 'notes', 'routines', 'vault', 'settings', 'admin', 'veresiye', 'nobet', 'durusma', 'emlak', 'ogretmen', 'varlik_evrak', 'zimmet', 'cityLife'];
      if (validTabs.includes(hash)) return hash;
    }
    return window.appStorage.get('assistant_active_tab', 'dashboard');
  }


  minimizeWidget(widgetId) {
    let minimized = window.appStorage.get('assistant_minimized_widgets', []);
    if (!minimized.includes(widgetId)) {
      minimized.push(widgetId);
      window.appStorage.save('assistant_minimized_widgets', minimized, false);
    }

    const wrapper = document.getElementById(widgetId + 'WidgetWrapper');
    if (wrapper) {
      wrapper.classList.add('hidden');
    }

    if (window.soundManager && window.soundManager.playClick) window.soundManager.playClick();
    this.renderHeaderWidgetDock();
    const meta = WIDGET_META[widgetId];
    if (meta && this.showToast) {
      this.showToast(`${meta.label} üst panele baloncuk olarak eklendi`, 'info');
    }
  }

  restoreWidget(widgetId) {
    let minimized = window.appStorage.get('assistant_minimized_widgets', []);
    minimized = minimized.filter(id => id !== widgetId);
    window.appStorage.save('assistant_minimized_widgets', minimized, false);

    const wrapper = document.getElementById(widgetId + 'WidgetWrapper');
    if (wrapper) {
      wrapper.classList.remove('hidden');
      wrapper.classList.add('animate-fadeIn');
      setTimeout(() => wrapper.classList.remove('animate-fadeIn'), 600);
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (window.soundManager && window.soundManager.playSuccess) window.soundManager.playSuccess();
    this.renderHeaderWidgetDock();
    const meta = WIDGET_META[widgetId];
    if (meta && this.showToast) {
      this.showToast(`${meta.label} ana sayfada geri açıldı`, 'success');
    }
  }

  renderHeaderWidgetDock() {
    const dock = document.getElementById('headerWidgetDock');
    if (!dock) return;

    const minimized = window.appStorage.get('assistant_minimized_widgets', []);

    // Also apply hidden class to all minimized widgets in DOM
    minimized.forEach(widgetId => {
      const wrapper = document.getElementById(widgetId + 'WidgetWrapper');
      if (wrapper) wrapper.classList.add('hidden');
    });

    if (minimized.length === 0) {
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
        ${minimized.map(id => {
          const meta = WIDGET_META[id] || { label: id, short: id, icon: 'circle', color: 'text-slate-300 border-slate-700 bg-slate-800' };
          return `
            <button 
              type="button"
              onclick="window.app.restoreWidget('${id}')" 
              class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 hover:border-blue-500/80 text-xs font-semibold opacity-60 hover:opacity-100 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer group flex-shrink-0 animate-fadeIn"
              title="${meta.label} widget'ını geri açmak için tıklayın"
            >
              <div class="w-4 h-4 text-blue-400 group-hover:text-white flex items-center justify-center">
                <i data-lucide="${meta.icon}" class="w-3.5 h-3.5"></i>
              </div>
              <span class="text-[11px] font-bold text-slate-300 group-hover:text-white">${meta.short || meta.label}</span>
              <i data-lucide="plus" class="w-3 h-3 text-slate-500 group-hover:text-blue-400 group-hover:rotate-90 transition-transform"></i>
            </button>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  init() {
    this.initAuthUI();
    this.initClock();
    this.initGreeting();
    this.initTheme();
    this.bindEvents();

    if (window.authManager && !window.authManager.isAuthenticated()) {
      window.authManager.showGateway();
      return; // Yetkilendirme (Gateway) ekranındayız, app başlatılmasını beklet.
    }
    
    this.initAfterAuth();
  }

  initAfterAuth() {
    // Sidebar daraltılmış durumunu geri yükle
    const isSidebarCollapsed = window.appStorage.get('assistant_sidebar_collapsed', false);
    if (isSidebarCollapsed && window.innerWidth >= 1024) {
      const sidebar = document.getElementById('mainSidebar');
      if (sidebar) sidebar.classList.add('sidebar-collapsed');
    }

    this.dashboardWidgetOrder = window.appStorage.get('assistant_dashboard_widget_order', [
      'finance', 'weather', 'news', 'tasks', 'notes', 'reminders', 'focus', 'routines'
    ]);

    // Sayfa yenilendiğinde son bulunulan sekmeyi ve alt sekmeyi geri yükle
    const initialTab = this.getInitialTab();
    this.switchTab(initialTab, false);

    const savedFinanceSub = window.appStorage.get('assistant_active_finance_subtab', 'markets');
    if (this.currentTab === 'finance') {
      this.switchFinanceSubTab(savedFinanceSub);
    }

    this.renderAll();
    this.applyDashboardWidgetOrder();
    this.initDashboardSortable();
    this.updateDashboardStats();

    window.addEventListener('hashchange', () => {
      let h = window.location.hash.replace('#', '').trim();
      if (h) {
        try { h = atob(h); } catch(e) {}
        if (h !== this.currentTab) {
          this.switchTab(h, false);
        }
      }
    });

    // Lucide Icons initialization
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Otomatik Yenilikler Pop-Up'ı
    if (this.isAuthenticated && window.changelogManager) {
      setTimeout(() => {
        window.changelogManager.checkAndShow();
      }, 350);
    }
  }

  initClock() {
    const updateTime = () => {
      const now = new Date();
      
      const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

      const clockEl = document.getElementById('liveClock');
      const dateEl = document.getElementById('liveDate');

      if (clockEl) clockEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  initGreeting() {
    const hour = new Date().getHours();
    let greeting = 'İyi günler';
    if (hour >= 5 && hour < 12) greeting = 'Günaydın';
    else if (hour >= 12 && hour < 18) greeting = 'İyi günler';
    else if (hour >= 18 && hour < 23) greeting = 'İyi akşamlar';
    else greeting = 'İyi geceler';

    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    const userName = settings.userName || 'Sayın Yöneticim';

    const greetingEl = document.getElementById('greetingText');
    if (greetingEl) {
      greetingEl.innerHTML = `${greeting}, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 font-bold">${userName}</span> 👋`;
    }
  }

  initTheme() {
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    if (settings.theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  toggleTheme() {
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    const isLight = document.body.classList.toggle('light-theme');
    settings.theme = isLight ? 'light' : 'dark';
    window.appStorage.save(STORAGE_KEYS.SETTINGS, settings);
    this.showToast(`Tema değiştirildi: ${isLight ? 'Aydınlık' : 'Karanlık'} Mod`, 'info');
  }

  switchTab(tabName, updateHash = true) {
    if (tabName === 'ipo') {
      this.switchTab('finance', updateHash);
      this.switchFinanceSubTab('ipo');
      return;
    }

    this.currentTab = tabName;
    window.appStorage.save('assistant_active_tab', tabName, false);

    if (updateHash) {
      const encrypted = btoa(tabName);
      if (window.location.hash !== `#${encrypted}`) {
        try {
          history.replaceState(null, null, `#${encrypted}`);
        } catch (e) {}
      }
    }

    // Toggle tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      if (pane.id === `tab-${tabName}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    // Close mobile sidebar if open
        // Update Bottom Nav UI
    document.querySelectorAll('#mobileBottomNav .mobile-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('text-white');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('text-white');
        btn.classList.add('text-slate-400');
      }
    });

    this.closeMobileSidebar();
    this.renderAll();
  }

  switchFinanceSubTab(subTab = 'markets') {
    window.appStorage.save('assistant_active_finance_subtab', subTab, false);
    const marketsBtn = document.getElementById('financeSubTab-markets');
    const ipoBtn = document.getElementById('financeSubTab-ipo');
    const marketsPane = document.getElementById('financeSubPane-markets');
    const ipoPane = document.getElementById('financeSubPane-ipo');

    if (!marketsBtn || !ipoBtn || !marketsPane || !ipoPane) return;

    if (subTab === 'markets') {
      marketsBtn.className = 'px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer';
      ipoBtn.className = 'px-4 py-2.5 rounded-xl bg-transparent text-slate-400 hover:text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer';
      marketsPane.classList.remove('hidden');
      ipoPane.classList.add('hidden');
      if (window.financeManager) window.financeManagerV2.render();
    } else {
      ipoBtn.className = 'px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer';
      marketsBtn.className = 'px-4 py-2.5 rounded-xl bg-transparent text-slate-400 hover:text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer';
      ipoPane.classList.remove('hidden');
      marketsPane.classList.add('hidden');
      if (window.ipoManager) window.ipoManager.render();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  closeMobileSidebar() {
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById('mainSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  }

  toggleMobileSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
    }
    if (overlay) {
      overlay.classList.toggle('hidden');
    }
  }

  toggleSidebarCollapse() {
    if (window.innerWidth < 1024) {
      this.toggleMobileSidebar();
      return;
    }
    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('sidebar-collapsed');
    window.appStorage.save('assistant_sidebar_collapsed', isCollapsed, false);
    if (window.menuManager) window.menuManager.refreshByProfile();
    if (window.lucide) window.lucide.createIcons();
    this.showToast(isCollapsed ? 'Sol menü daraltıldı' : 'Sol menü genişletildi', 'info');
  }

  initDashboardSortable() {
    const grid = document.getElementById('dashboardWidgetsGrid');
    if (!grid || !window.Sortable) return;

    if (this.sortableInstance) {
      try { this.sortableInstance.destroy(); } catch (e) {}
    }

    this.sortableInstance = new window.Sortable(grid, {
      animation: 250,
      handle: '.drag-grip-handle',
      ghostClass: 'widget-sortable-ghost',
      chosenClass: 'widget-sortable-chosen',
      dragClass: 'widget-sortable-drag',
      filter: 'button, input, select, textarea, a',
      preventOnFilter: false,
      onEnd: () => {
        const order = Array.from(grid.children)
          .map(el => el.getAttribute('data-widget-id'))
          .filter(Boolean);
        this.dashboardWidgetOrder = order;
        window.appStorage.save('assistant_dashboard_widget_order', order, false);
        this.showToast('Panel yerleşimi kaydedildi', 'info');
      }
    });
  }

  applyDashboardWidgetOrder() {
    const grid = document.getElementById('dashboardWidgetsGrid');
    if (!grid) return;

    const order = this.dashboardWidgetOrder || window.appStorage.get('assistant_dashboard_widget_order', [
      'finance', 'weather', 'news', 'tasks', 'notes', 'reminders', 'focus', 'routines'
    ]);

    order.forEach(widgetId => {
      const el = grid.querySelector(`[data-widget-id="${widgetId}"]`);
      if (el) {
        grid.appendChild(el);
      }
    });

    if (window.lucide) window.lucide.createIcons();
    if (window.Sortable && !this.sortableInstance) {
      this.initDashboardSortable();
    }
  }

  renderAll() {
    this.updateDashboardStats();
    this.renderHeaderWidgetDock();
    if (window.menuManager) window.menuManager.refreshByProfile();
    
    // Finans V2
    if (window.financeManagerV2 && this.currentTab === 'finance') {
      if (window.financeManagerV2.refreshAllData) window.financeManagerV2.refreshAllData();
      else if (window.financeManagerV2.render) window.financeManagerV2.render();
    }
    if (window.ipoManager && this.currentTab === 'finance') window.ipoManager.render();
    if (window.subscriptionManager && this.currentTab === 'subscriptions') window.subscriptionManager.render();
    if (window.cityLifeManager && this.currentTab === 'cityLife') window.cityLifeManager.render();
    if (window.newsManager && this.currentTab === 'news') window.newsManager.render();
    
    // Mesleki Modüller
    if (window.professionModules) {
      if (this.currentTab === 'veresiye') window.professionModules.renderVeresiye();
      if (this.currentTab === 'nobet') window.professionModules.renderNobet();
      if (this.currentTab === 'durusma') window.professionModules.renderDurusma();
      if (this.currentTab === 'emlak') window.professionModules.renderEmlak();
      if (this.currentTab === 'ogretmen') window.professionModules.renderOgretmen();
    }

    // Admin & Geliştirici Komuta Merkezi
    if (window.adminManager && this.currentTab === 'admin') window.adminManager.render();

    // Vault (Kasa)
    if (window.vaultManager && this.currentTab === 'vault' && window.vaultManager.render) window.vaultManager.render();

    if (window.taskManager) window.taskManager.render();
    if (window.noteManager && window.noteManager.renderNotesList) window.noteManager.renderNotesList();
    if (window.reminderManager) window.reminderManager.render();
    if (window.routineManager && window.routineManager.renderRoutinesList) window.routineManager.renderRoutinesList();
    if (window.focusManager && window.focusManager.render) window.focusManager.render();
  }

  
  toggleWidgetCollapse(widgetId) {
    let states = window.appStorage.get('assistant_widget_collapse', {});
    states[widgetId] = !states[widgetId];
    window.appStorage.save('assistant_widget_collapse', states, false);
    this.applyWidgetCollapse(widgetId, states[widgetId]);
  }

  applyWidgetCollapse(widgetId, isCollapsed) {
    const wrapper = document.getElementById(widgetId + 'WidgetWrapper');
    if (!wrapper) return;
    const contentEls = wrapper.querySelectorAll('.widget-collapsible-content');
    const iconEl = wrapper.querySelector('.widget-collapse-icon');
    
    const headerEl = wrapper.querySelector('.widget-header');
    
    if (isCollapsed) {
      contentEls.forEach(el => el.classList.add('hidden'));
      wrapper.classList.add('opacity-75', 'hover:opacity-100', 'transition-opacity');
      if (headerEl) {
        headerEl.classList.remove('border-b', 'border-slate-700/50', 'pb-3', 'mb-4');
        headerEl.classList.add('pb-1');
      }
      if (iconEl) {
        iconEl.setAttribute('data-lucide', 'plus');
        iconEl.classList.add('text-amber-500');
      }
    } else {
      contentEls.forEach(el => el.classList.remove('hidden'));
      wrapper.classList.remove('opacity-75', 'hover:opacity-100', 'transition-opacity');
      if (headerEl) {
        headerEl.classList.add('border-b', 'border-slate-700/50', 'pb-3', 'mb-4');
        headerEl.classList.remove('pb-1');
      }
      if (iconEl) {
        iconEl.setAttribute('data-lucide', 'minus');
        iconEl.classList.remove('text-amber-500');
      }
    }
    if (window.lucide && iconEl) window.lucide.createIcons({ nameAttr: 'data-lucide' });
  }
  
  applyAllWidgetCollapses() {
    let states = window.appStorage.get('assistant_widget_collapse', {});
    Object.keys(states).forEach(id => {
      this.applyWidgetCollapse(id, states[id]);
    });
  }

  applyWidgetVisibility() {
    const widgets = window.appStorage.get(STORAGE_KEYS.WIDGETS, DEFAULT_WIDGETS);
    const enabledModules = window.moduleRegistry?.profileManager?.enabledModules || [];
    
    const toggleEl = (id, moduleKey, visible) => {
      const el = document.getElementById(id);
      if (el) {
        // Eğer kullanıcı bu modüle yetkili değilse widget'ı kesinlikle gizle
        if (moduleKey && !enabledModules.includes(moduleKey)) {
          el.classList.add('hidden');
          return;
        }
        if (visible === false) el.classList.add('hidden');
        else el.classList.remove('hidden');
      }
    };

    toggleEl('weatherWidgetWrapper', 'cityLife', widgets.weather);
    toggleEl('financeWidgetWrapper', 'finance', widgets.finance);
    toggleEl('newsWidgetWrapper', 'news', widgets.news);
    toggleEl('tasksWidgetWrapper', 'tasks', widgets.tasks);
    toggleEl('notesWidgetWrapper', 'notes', widgets.notes);
    toggleEl('remindersWidgetWrapper', 'reminders', widgets.reminders);
    toggleEl('focusWidgetWrapper', null, widgets.focus);
    toggleEl('routinesWidgetWrapper', 'routines', widgets.routines);
  }

  renderWidgetSettingsUI() {
    const container = document.getElementById('widgetSettingsContainer');
    if (!container) return;

    const widgets = window.appStorage.get(STORAGE_KEYS.WIDGETS, DEFAULT_WIDGETS);

    const widgetDefs = [
      { key: 'finance', label: 'Borsa & Finans Takipçisi', desc: 'Döviz, altın ve BIST hisse listesi', icon: 'trending-up' },
      { key: 'news', label: 'Gündem & Haber Akışı', desc: 'Son dakika haberler ve özel RSS kaynakları', icon: 'newspaper' },
      { key: 'tasks', label: 'Günün Görevleri', desc: 'Öncelikli yapılacaklar listesi', icon: 'check-square' },
      { key: 'reminders', label: 'Zamanlanmış Hatırlatıcılar', desc: 'Saatli randevu ve uyarılar', icon: 'bell' },
      { key: 'notes', label: 'Hızlı Notlar & Karalamalar', desc: 'Sabitlenen ve güncel notlar', icon: 'file-text' },
      { key: 'focus', label: 'Odaklanma Sayacı (Pomodoro)', desc: '25/5 çalışma ve mola zamanlayıcısı', icon: 'timer' },
      { key: 'routines', label: 'Günlük Rutinler', desc: 'Standart iş kontrol adımları', icon: 'check-check' }
    ];

    container.innerHTML = widgetDefs.map(w => `
      <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div class="flex items-center space-x-2.5 pr-2">
          <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <i data-lucide="${w.icon}" class="w-4 h-4"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-white block">${w.label}</span>
            <span class="text-[10px] text-slate-400 block">${w.desc}</span>
          </div>
        </div>

        <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input type="checkbox" onchange="window.handleToggleWidget('${w.key}', this.checked)" ${widgets[w.key] !== false ? 'checked' : ''} class="sr-only peer">
          <div class="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  initNotificationSettingsUI() {
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    
    const popupToggle = document.getElementById('settingTogglePopup');
    const soundToggle = document.getElementById('settingToggleSound');
    const toastToggle = document.getElementById('settingToggleToast');
    const browserToggle = document.getElementById('settingToggleBrowser');

    if (popupToggle) popupToggle.checked = settings.popupEnabled !== false;
    if (soundToggle) soundToggle.checked = settings.soundEnabled !== false;
    if (toastToggle) toastToggle.checked = settings.toastEnabled !== false;
    if (browserToggle) browserToggle.checked = settings.browserNotifyEnabled !== false;

    this.initApiSettingsUI();
  }

  initApiSettingsUI() {
    const keys = window.appStorage.get(STORAGE_KEYS.API_KEYS, {});
    const wInp = document.getElementById('apiKeyWeather');
    const fInp = document.getElementById('apiKeyFinance');
    const nInp = document.getElementById('apiKeyNews');

    if (wInp && keys.weather) wInp.value = keys.weather;
    if (fInp && keys.finance) fInp.value = keys.finance;
    if (nInp && keys.news) nInp.value = keys.news;
  }

  renderQuickLinks() {
    const container = document.getElementById('quickLinksContainer');
    if (!container) return;

    const links = window.appStorage.get(STORAGE_KEYS.QUICK_LINKS, []);
    container.innerHTML = links.map(link => `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-xs font-medium text-slate-200 group">
        <span class="flex items-center gap-2 truncate">
          <i data-lucide="${link.icon || 'globe'}" class="w-3.5 h-3.5 text-blue-400"></i>
          <span class="truncate">${escapeHtml(link.title)}</span>
        </span>
        <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-blue-400"></i>
      </a>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  updateDashboardStats() {
    if (!window.taskManager || !window.reminderManager || !window.noteManager) return;

    const stats = window.taskManager.getStats();
    const reminders = window.reminderManager.getReminders().filter(r => !r.completed);
    const notes = window.noteManager.getNotes();

    // Stats elements
    const statTotalEl = document.getElementById('statTotalTasks');
    const statDoneEl = document.getElementById('statDoneTasks');
    const statPendingEl = document.getElementById('statPendingTasks');
    const statRemindersEl = document.getElementById('statPendingReminders');
    const statRateEl = document.getElementById('statProgressRate');
    const progressBarEl = document.getElementById('dashboardProgressBar');

    if (statTotalEl) statTotalEl.textContent = stats.total;
    if (statDoneEl) statDoneEl.textContent = stats.completed;
    if (statPendingEl) statPendingEl.textContent = stats.pending;
    if (statRemindersEl) statRemindersEl.textContent = reminders.length;
    if (statRateEl) statRateEl.textContent = `%${stats.rate}`;
    if (progressBarEl) progressBarEl.style.width = `${stats.rate}%`;
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const colors = {
      success: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      alert: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
      info: 'bg-blue-500/20 border-blue-500/40 text-blue-300'
    };

    const icons = {
      success: 'check-circle-2',
      alert: 'bell-ring',
      info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `item-enter flex items-center space-x-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[type] || colors.info} mb-2`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 flex-shrink-0"></i>
      <span class="text-xs font-semibold">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  showReminderModal(reminder) {
    const modal = document.getElementById('reminderAlertModal');
    const titleEl = document.getElementById('alertModalTitle');
    const notesEl = document.getElementById('alertModalNotes');
    const timeEl = document.getElementById('alertModalTime');

    if (!modal) return;

    if (titleEl) titleEl.textContent = reminder.title;
    if (notesEl) {
      notesEl.textContent = reminder.notes || 'Detaylı not bulunmuyor.';
      notesEl.className = reminder.notes ? 'text-sm text-slate-300 mt-2' : 'text-xs text-slate-500 italic mt-2';
    }
    if (timeEl) {
      timeEl.textContent = new Date(reminder.datetime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }

    modal.dataset.reminderId = reminder.id;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeReminderModal() {
    const modal = document.getElementById('reminderAlertModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');

      if (modalId === 'newStockModal' && window.financeManager) {
        window.financeManagerV2.setupStockAutocomplete();
        const inp = document.getElementById('stockInputSymbol');
        if (inp) setTimeout(() => inp.focus(), 50);
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  bindEvents() {
    // Quick Add Bar Submission
    const quickAddForm = document.getElementById('quickAddForm');
    if (quickAddForm) {
      quickAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('quickAddInput');
        const text = input.value.trim();
        if (!text) return;

        window.taskManager.addTask({
          title: text,
          priority: 'normal',
          category: 'Genel'
        });

        input.value = '';
        this.renderAll();
        this.showToast('Yeni görev asistanınıza eklendi!', 'success');
        if (window.soundManager) window.soundManager.playSuccess();
      });
    }

    // New Task Modal Form Submission
    const newTaskForm = document.getElementById('newTaskForm');
    if (newTaskForm) {
      newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskInputTitle').value;
        const category = document.getElementById('taskInputCategory').value;
        const priority = document.getElementById('taskInputPriority').value;
        const dueDate = document.getElementById('taskInputDate').value;
        const dueTime = document.getElementById('taskInputTime').value;

        window.taskManager.addTask({ title, category, priority, dueDate, dueTime });
        this.closeModal('newTaskModal');
        newTaskForm.reset();
        this.renderAll();
        this.showToast('Görev başarıyla kaydedildi', 'success');
        if (window.soundManager) window.soundManager.playSuccess();
      });
    }

    // New Reminder Modal Form Submission
    const newReminderForm = document.getElementById('newReminderForm');
    if (newReminderForm) {
      newReminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('remInputTitle').value;
        const datetime = document.getElementById('remInputDateTime').value;
        const notes = document.getElementById('remInputNotes').value;

        window.reminderManager.addReminder({ title, datetime, notes });
        this.closeModal('newReminderModal');
        newReminderForm.reset();
        this.renderAll();
        this.showToast('Hatırlatıcı zamanlandı', 'success');
      });
    }

    // New Note Modal Form Submission
    const newNoteForm = document.getElementById('newNoteForm');
    if (newNoteForm) {
      newNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('noteInputTitle').value;
        const content = document.getElementById('noteInputContent').value;
        const color = document.querySelector('input[name="noteColor"]:checked')?.value || 'blue';

        window.noteManager.addNote(title, content, color);
        this.closeModal('newNoteModal');
        newNoteForm.reset();
        this.renderAll();
        this.showToast('Yeni not oluşturuldu', 'success');
      });
    }

    // New Custom Menu Form
    const newMenuForm = document.getElementById('newMenuForm');
    if (newMenuForm) {
      newMenuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const label = document.getElementById('menuInputLabel').value;
        const icon = document.getElementById('menuInputIcon').value || 'bookmark';
        const type = document.getElementById('menuInputType').value;
        const url = document.getElementById('menuInputUrl').value;

        if (window.menuManager && window.menuManager.addMenu) window.menuManager.addMenu({ label, icon, type, url });
        this.closeModal('newMenuModal');
        newMenuForm.reset();
        this.renderAll();
        this.showToast('Yeni menü başarıyla eklendi', 'success');
      });
    }

    // New Stock Form
    const newStockForm = document.getElementById('newStockForm');
    if (newStockForm) {
      newStockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sym = document.getElementById('stockInputSymbol').value;
        const name = document.getElementById('stockInputName').value;
        const price = document.getElementById('stockInputPrice').value;

        if (window.financeManagerV2 && window.financeManagerV2.addStock) {
          window.financeManagerV2.addStock(sym, name, price);
        }
        this.closeModal('newStockModal');
        newStockForm.reset();
        this.renderAll();
      });
    }

    // New RSS Feed Form
    const newRssForm = document.getElementById('newRssForm');
    if (newRssForm) {
      newRssForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rssInputName').value;
        const url = document.getElementById('rssInputUrl').value;
        const category = document.getElementById('rssInputCategory').value;

        if (window.newsManager) {
          window.newsManager.addFeed(name, url, category);
        }
        this.closeModal('newRssModal');
        newRssForm.reset();
        this.renderAll();
      });
    }

    // Change City Select
    const citySelect = document.getElementById('citySelectInput');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        if (window.weatherManager) {
          window.weatherManager.setCity(e.target.value);
        }
        this.closeModal('changeCityModal');
      });
    }

    // New Quick Routine Form
    const newRoutineForm = document.getElementById('newRoutineForm');
    if (newRoutineForm) {
      newRoutineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('routineInputTitle');
        if (!input.value.trim()) return;

        window.routineManager.addRoutine(input.value.trim());
        input.value = '';
        this.renderAll();
        this.showToast('Yeni rutin eklendi', 'success');
      });
    }

    // Task Filter Buttons
    document.querySelectorAll('.task-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.task-filter-btn').forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        btn.classList.add('bg-blue-600', 'text-white');
        window.taskManager.currentFilter = btn.dataset.filter;
        window.taskManager.renderTasksList('mainTaskList');
      });
    });

    // Task Search Input
    const taskSearchInput = document.getElementById('taskSearchInput');
    if (taskSearchInput) {
      taskSearchInput.addEventListener('input', (e) => {
        window.taskManager.searchQuery = e.target.value;
        window.taskManager.renderTasksList('mainTaskList');
      });
    }
  }

  initAuthUI() {
    const overlay = document.getElementById('loginScreenContainer');
    if (!overlay) return;

    if (this.isAuthenticated) {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
    } else {
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      this.initLoginClock();
      const userInp = document.getElementById('loginUsernameInput');
      const creds = window.appStorage.get(STORAGE_KEYS.CREDENTIALS, DEFAULT_CREDENTIALS);
      if (userInp) {
        userInp.value = creds.username || 'admin';
        setTimeout(() => userInp.focus(), 200);
      }
    }
  }

  initLoginClock() {
    const updateLoginTime = () => {
      const now = new Date();
      const clockEl = document.getElementById('loginLiveClock');
      const dateEl = document.getElementById('loginLiveDate');
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    };
    updateLoginTime();
    if (!this.loginClockInterval) {
      this.loginClockInterval = setInterval(updateLoginTime, 1000);
    }
  }

  handleLogin(e) {
    if (e) e.preventDefault();
    const userInp = document.getElementById('loginUsernameInput');
    const passInp = document.getElementById('loginPasswordInput');
    const remInp = document.getElementById('loginRememberMe');
    const errorBanner = document.getElementById('loginErrorBanner');
    const submitBtn = document.getElementById('loginSubmitBtn');

    const username = userInp ? userInp.value.trim() : '';
    const password = passInp ? passInp.value : '';
    const rememberMe = remInp ? remInp.checked : true;

    const creds = window.appStorage.get(STORAGE_KEYS.CREDENTIALS, DEFAULT_CREDENTIALS);

    if (username.toLowerCase() === (creds.username || 'admin').toLowerCase() && password === (creds.password || 'admin')) {
      if (errorBanner) errorBanner.classList.add('hidden');

      // Save session
      window.appStorage.save(STORAGE_KEYS.AUTH, {
        loggedIn: true,
        user: creds.username,
        remember: rememberMe,
        loginAt: new Date().toISOString()
      }, rememberMe);

      this.isAuthenticated = true;
      document.documentElement.classList.add('auth-authenticated');

      if (submitBtn) {
        submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-emerald-950"></i><span>Giriş Başarılı! Açılıyor...</span>';
        submitBtn.classList.remove('from-amber-500', 'to-amber-600');
        submitBtn.classList.add('bg-emerald-400');
        if (window.lucide) window.lucide.createIcons();
      }

      setTimeout(() => {
        const overlay = document.getElementById('loginScreenContainer');
        if (overlay) {
          overlay.style.opacity = '0';
          setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
          }, 300);
        }
        if (submitBtn) {
          submitBtn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i><span>Giriş Yap & Portala Eriş</span>';
          submitBtn.classList.remove('bg-emerald-400');
          submitBtn.classList.add('from-amber-500', 'to-amber-600');
        }
        this.renderAll();
        this.showToast(`Hoş geldiniz, ${creds.name || creds.username}!`, 'success');
        if (window.changelogManager) {
          setTimeout(() => window.changelogManager.checkAndShow(), 400);
        }
      }, 400);

    } else {
      if (errorBanner) {
        errorBanner.classList.remove('hidden');
        errorBanner.classList.remove('animate-shake');
        void errorBanner.offsetWidth; // trigger reflow
        errorBanner.classList.add('animate-shake');
      }
      if (passInp) {
        passInp.value = '';
        passInp.focus();
      }
    }
  }

  lockScreen() {
    window.appStorage.save(STORAGE_KEYS.AUTH, null, false);
    this.isAuthenticated = false;
    document.documentElement.classList.remove('auth-authenticated');

    const overlay = document.getElementById('loginScreenContainer');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.classList.remove('hidden');
      this.initLoginClock();

      const passInp = document.getElementById('loginPasswordInput');
      if (passInp) passInp.value = '';
      const userInp = document.getElementById('loginUsernameInput');
      const creds = window.appStorage.get(STORAGE_KEYS.CREDENTIALS, DEFAULT_CREDENTIALS);
      if (userInp) {
        userInp.value = creds.username || 'admin';
        setTimeout(() => (passInp ? passInp.focus() : userInp.focus()), 200);
      }
      const errorBanner = document.getElementById('loginErrorBanner');
      if (errorBanner) errorBanner.classList.add('hidden');
    }
    this.showToast('Oturum kilitlendi', 'info');
  }

  logout() {
    this.lockScreen();
  }

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if (btn) {
      btn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  initSecuritySettingsUI() {
    const creds = window.appStorage.get(STORAGE_KEYS.CREDENTIALS, DEFAULT_CREDENTIALS);
    const userInp = document.getElementById('settingsUsername');
    if (userInp) userInp.value = creds.username || 'admin';
  }

  handleSaveSecuritySettings(e) {
    if (e) e.preventDefault();
    const userInp = document.getElementById('settingsUsername');
    const newPassInp = document.getElementById('settingsNewPassword');
    const confirmPassInp = document.getElementById('settingsConfirmPassword');

    const username = userInp ? userInp.value.trim() : 'admin';
    const newPass = newPassInp ? newPassInp.value : '';
    const confirmPass = confirmPassInp ? confirmPassInp.value : '';

    if (!username) {
      this.showToast('Kullanıcı adı boş bırakılamaz', 'error');
      return;
    }

    const creds = window.appStorage.get(STORAGE_KEYS.CREDENTIALS, DEFAULT_CREDENTIALS);
    creds.username = username;

    if (newPass || confirmPass) {
      if (newPass !== confirmPass) {
        this.showToast('Şifreler birbiriyle eşleşmiyor!', 'error');
        return;
      }
      if (newPass.length < 3) {
        this.showToast('Şifre en az 3 karakter olmalıdır', 'error');
        return;
      }
      creds.password = newPass;
    }

    window.appStorage.save(STORAGE_KEYS.CREDENTIALS, creds);
    if (newPassInp) newPassInp.value = '';
    if (confirmPassInp) confirmPassInp.value = '';

    this.showToast('Güvenlik ve giriş bilgileri başarıyla güncellendi', 'success');
  }
}

// User helper methods attached to window for HTML buttons
window.handleExportBackup = () => {
  window.appStorage.exportAllData();
  if (window.app) window.app.showToast('Yedek dosyası indirildi (.json)', 'success');
};

window.handleImportFile = (inputElement) => {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const res = window.appStorage.importData(e.target.result);
    if (res.success) {
      window.location.reload();
    } else {
      alert('Yedek yükleme başarısız: ' + res.error);
    }
  };
  reader.readAsText(file);
};

window.handleSaveProfile = () => {
  const nameInput = document.getElementById('settingsUserName');
  if (nameInput && nameInput.value.trim()) {
    const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
    settings.userName = nameInput.value.trim();
    window.appStorage.save(STORAGE_KEYS.SETTINGS, settings);
    window.app.initGreeting();
    window.app.showToast('Profil ismi güncellendi', 'success');
  }
};

window.handleResetAll = () => {
  if (confirm('Tüm görev, hatırlatıcı ve notlarınız sıfırlanacak. Devam etmek istiyor musunuz?')) {
    window.appStorage.resetAllData();
    window.location.reload();
  }
};

window.handleToggleNotificationSetting = (key, checked) => {
  const settings = window.appStorage.get(STORAGE_KEYS.SETTINGS, {});
  settings[key] = checked;
  window.appStorage.save(STORAGE_KEYS.SETTINGS, settings);
  
  const labels = {
    popupEnabled: 'Pop-up ekran bildirimleri',
    soundEnabled: 'Sesli uyarılar',
    toastEnabled: 'Köşe tost bildirimleri',
    browserNotifyEnabled: 'Masaüstü tarayıcı bildirimleri'
  };

  const label = labels[key] || key;
  if (window.app) {
    window.app.showToast(`${label} ${checked ? 'aktif edildi' : 'kapatıldı'}`, 'info');
  }
};

window.handleToggleWidget = (key, checked) => {
  const widgets = window.appStorage.get(STORAGE_KEYS.WIDGETS, DEFAULT_WIDGETS);
  widgets[key] = checked;
  window.appStorage.save(STORAGE_KEYS.WIDGETS, widgets);
  
  if (window.app) {
    window.app.applyWidgetVisibility();
    window.app.showToast('Kart görünürlüğü güncellendi', 'info');
  }
};

window.handleSaveApiKeys = () => {
  const weatherKey = document.getElementById('apiKeyWeather')?.value.trim() || '';
  const financeKey = document.getElementById('apiKeyFinance')?.value.trim() || '';
  const newsKey = document.getElementById('apiKeyNews')?.value.trim() || '';

  const keys = {
    weather: weatherKey,
    finance: financeKey,
    news: newsKey
  };

  window.appStorage.save(STORAGE_KEYS.API_KEYS, keys);

  if (window.app) {
    window.app.showToast('API ve entegrasyon ayarları başarıyla kaydedildi', 'success');
  }
};

// ESC tuşuna basıldığında tüm açık modalları kapat
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AssistantApp();
});
