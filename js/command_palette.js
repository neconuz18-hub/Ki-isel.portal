/**
 * Executive Command Palette & Universal Search Engine (js/command_palette.js)
 * Spotlight / Raycast benzeri hızlı işlem, satır içi anlık arama ve evrensel komut motoru
 */

function normalizeTrText(str) {
  if (!str) return '';
  return str.toString().toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .trim();
}

class CommandPaletteManager {
  constructor() {
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredItems = [];
    this.inlineFiltered = [];
    this.bindKeyboardShortcuts();
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl + K veya Cmd + K: Komut Paletini Aç/Kapat
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }

      // Escape tuşu ile kapat
      if (e.key === 'Escape') {
        if (this.isOpen) this.close();
        const dropdown = document.getElementById('headerSearchResultsDropdown');
        if (dropdown) dropdown.classList.add('hidden');
      }

      // ? tuşu (Input dışında): Kısayol rehberini aç
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        if (window.app) window.app.openModal('shortcutsModal');
      }
    });

    // Sayfa dışına tıklandığında anlık arama menüsünü kapat
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('headerSearchWrapper');
      const dropdown = document.getElementById('headerSearchResultsDropdown');
      if (dropdown && wrapper && !wrapper.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open(initialQuery = '') {
    this.isOpen = true;
    const modal = document.getElementById('commandPaletteModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const input = document.getElementById('commandPaletteInput');
    if (input) {
      input.value = initialQuery;
      setTimeout(() => input.focus(), 50);
    }

    this.selectedIndex = 0;
    this.search(initialQuery);
    if (window.lucide) window.lucide.createIcons();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('commandPaletteModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  getAllCommands() {
    const commands = [
      // Ana Menüler
      { title: 'Ana Sayfaya Git', category: 'Navigasyon', icon: 'home', action: () => window.app.switchTab('dashboard') },
      { title: 'Borsa & Finans Piyasaları', category: 'Navigasyon', icon: 'trending-up', action: () => window.app.switchTab('finance') },
      { title: 'Abonelik & Ödemeler Radarı', category: 'Navigasyon', icon: 'credit-card', action: () => window.app.switchTab('subscriptions') },
      { title: 'Halka Arz Takvimi & Simülatör', category: 'Navigasyon', icon: 'pie-chart', action: () => { window.app.switchTab('finance'); window.app.switchFinanceSubTab('ipo'); } },
      { title: 'Gündem & Canlı Haberler', category: 'Navigasyon', icon: 'newspaper', action: () => window.app.switchTab('news') },
      { title: 'Görevler & İş Takibi', category: 'Navigasyon', icon: 'check-circle', action: () => window.app.switchTab('tasks') },
      { title: 'Zamanlanmış Hatırlatıcılar', category: 'Navigasyon', icon: 'alarm-clock', action: () => window.app.switchTab('reminders') },
      { title: 'Toplantı Notları & Defter', category: 'Navigasyon', icon: 'book-open', action: () => window.app.switchTab('notes') },
      { title: 'Odaklanma & Günlük Rutinler', category: 'Navigasyon', icon: 'target', action: () => window.app.switchTab('routines') },
      { title: 'VIP Güvenli Kasa & Profil', category: 'Navigasyon', icon: 'shield-check', action: () => window.app.switchTab('vault') },
      { title: 'Ayarlar & Sistem Yönetimi', category: 'Navigasyon', icon: 'settings', action: () => window.app.switchTab('settings') },

      // Hızlı Aksiyonlar
      { title: 'Yeni Abonelik / Fatura Ekle', category: 'Hızlı İşlem', icon: 'credit-card', action: () => window.app.openModal('newSubscriptionModal') },
      { title: 'Yeni Görev Ekle', category: 'Hızlı İşlem', icon: 'plus-circle', action: () => window.app.openModal('newTaskModal') },
      { title: 'Yeni Hatırlatıcı Oluştur', category: 'Hızlı İşlem', icon: 'bell', action: () => window.app.openModal('newReminderModal') },
      { title: 'Yeni Not Yaz', category: 'Hızlı İşlem', icon: 'file-plus', action: () => window.app.openModal('newNoteModal') },
      { title: 'Şehir Değiştir (Hava Durumu)', category: 'Hızlı İşlem', icon: 'map-pin', action: () => window.weatherManager.openCityModal() },
      { title: 'Arka Plan Manzarasını Değiştir', category: 'Hızlı İşlem', icon: 'image', action: () => window.wallpaperManager.nextWallpaper() },
      { title: 'Düzeni & Kartları Özelleştir', category: 'Hızlı İşlem', icon: 'sliders', action: () => window.layoutManager.openModal() },
      { title: 'Yenilikler & Güncelleme Notları', category: 'Hızlı İşlem', icon: 'sparkles', action: () => window.changelogManager.showPopup() },
      { title: 'Klavye Kısayolları Rehberi', category: 'Hızlı İşlem', icon: 'help-circle', action: () => window.app.openModal('shortcutsModal') },
      { title: 'Tüm Verileri Bilgisayara Yedekle (.json)', category: 'Sistem', icon: 'download', action: () => window.handleExportBackup() },
      { title: 'Oturumu Kilitle', category: 'Güvenlik', icon: 'lock', action: () => window.app.lockScreen() }
    ];

    // BIST Hisseleri
    if (window.financeManager && Array.isArray(window.financeManager.watchlist)) {
      window.financeManager.watchlist.forEach(st => {
        commands.push({
          title: `${st.symbol} - ${st.name} (${st.price ? st.price.toFixed(2) + ' ₺' : 'Canlı'})`,
          category: 'Borsa Hissesi',
          icon: 'trending-up',
          action: () => window.app.switchTab('finance')
        });
      });
    }

    // Görevler
    if (window.taskManager && Array.isArray(window.taskManager.tasks)) {
      window.taskManager.tasks.forEach(t => {
        commands.push({
          title: `Görev: ${t.title}`,
          category: 'Kişisel Görev',
          icon: 'check-circle',
          action: () => window.app.switchTab('tasks')
        });
      });
    }

    // Abonelikler
    if (window.subscriptionManager && Array.isArray(window.subscriptionManager.subscriptions)) {
      window.subscriptionManager.subscriptions.forEach(s => {
        commands.push({
          title: `Abonelik: ${s.title} (${s.amount} ${s.currency})`,
          category: 'Abonelik & Ödeme',
          icon: 'credit-card',
          action: () => window.app.switchTab('subscriptions')
        });
      });
    }

    return commands;
  }

  // --- HEADER SATIR İÇİ ANLIK ARAMA ---
  handleHeaderSearch(query) {
    const dropdown = document.getElementById('headerSearchResultsDropdown');
    if (!dropdown) return;

    const q = normalizeTrText(query);
    if (!q) {
      dropdown.innerHTML = '';
      dropdown.classList.add('hidden');
      this.inlineFiltered = [];
      return;
    }

    const all = this.getAllCommands();
    const filtered = all.filter(item => {
      return normalizeTrText(item.title).includes(q) || normalizeTrText(item.category).includes(q);
    }).slice(0, 6);

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <div class="p-3 text-center text-xs text-slate-400">
          <i data-lucide="search-x" class="w-4 h-4 mx-auto mb-1 text-slate-500"></i>
          "${query}" için sonuç bulunamadı.
        </div>
      `;
      dropdown.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
      this.inlineFiltered = [];
      return;
    }

    dropdown.innerHTML = `
      <div class="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center border-b border-slate-800/80 mb-1">
        <span>Sonuçlar (${filtered.length})</span>
        <span class="text-amber-400 hover:underline cursor-pointer" onclick="window.commandPalette.open('${query}')">Tam Menü ↗</span>
      </div>
      ${filtered.map((item, idx) => `
        <div 
          onclick="window.commandPalette.executeInline(${idx})"
          class="flex items-center justify-between p-2 rounded-xl hover:bg-amber-500/15 hover:border-amber-500/30 border border-transparent transition-all cursor-pointer text-xs group"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div class="p-1 rounded-lg bg-slate-800 text-slate-400 group-hover:text-amber-400 transition-colors flex-shrink-0">
              <i data-lucide="${item.icon || 'arrow-right'}" class="w-3.5 h-3.5"></i>
            </div>
            <span class="font-bold text-white group-hover:text-amber-300 truncate">${item.title}</span>
          </div>
          <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium flex-shrink-0 ml-1.5">
            ${item.category}
          </span>
        </div>
      `).join('')}
    `;

    dropdown.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
    this.inlineFiltered = filtered;
  }

  handleHeaderSearchKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.inlineFiltered && this.inlineFiltered.length > 0) {
        this.executeInline(0);
      } else {
        const input = document.getElementById('headerSearchInput');
        this.open(input ? input.value : '');
      }
    } else if (e.key === 'Escape') {
      const dropdown = document.getElementById('headerSearchResultsDropdown');
      if (dropdown) dropdown.classList.add('hidden');
    }
  }

  executeInline(index) {
    if (this.inlineFiltered && this.inlineFiltered[index]) {
      const item = this.inlineFiltered[index];
      const dropdown = document.getElementById('headerSearchResultsDropdown');
      const input = document.getElementById('headerSearchInput');
      if (dropdown) dropdown.classList.add('hidden');
      if (input) input.value = '';
      
      if (typeof item.action === 'function') {
        item.action();
      }
    }
  }

  // --- BÜYÜK MODAL ARAMASI ---
  search(query) {
    const q = normalizeTrText(query);
    const all = this.getAllCommands();

    if (!q) {
      this.filteredItems = all.slice(0, 10);
    } else {
      this.filteredItems = all.filter(item => {
        return normalizeTrText(item.title).includes(q) || normalizeTrText(item.category).includes(q);
      });
    }

    this.renderResults();
  }

  renderResults() {
    const container = document.getElementById('commandPaletteResults');
    if (!container) return;

    if (this.filteredItems.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-slate-400">
          <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 text-slate-500"></i>
          <p class="text-sm font-medium">Eşleşen komut veya veri bulunamadı.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = this.filteredItems.map((item, index) => {
      const isSelected = index === this.selectedIndex;
      return `
        <div 
          onclick="window.commandPalette.execute(${index})"
          class="flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border ${
            isSelected 
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/5' 
              : 'hover:bg-slate-800/60 border-transparent text-slate-300 hover:text-white'
          }"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="p-2 rounded-xl ${isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-white">${item.title}</div>
              <div class="text-[11px] text-slate-400">${item.category}</div>
            </div>
          </div>
          <div class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/40">
            SEÇ ↵
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  execute(index) {
    if (this.filteredItems[index]) {
      this.close();
      if (typeof this.filteredItems[index].action === 'function') {
        this.filteredItems[index].action();
      }
    }
  }
}

window.commandPalette = new CommandPaletteManager();
