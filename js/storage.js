// Global Güvenli HTML Kaçış Fonksiyonu
window.escapeHtml = function(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/**
 * Storage Module - LocalStorage ve Python Web Sunucusu REST API Senkronizasyonu
 */

function normalizeTurkishText(str) {
  if (!str) return '';
  return str
    .toString()
    .trim()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase();
}
window.normalizeTurkishText = normalizeTurkishText;

function escapeHtml(str) {
  if (!str) return '';
  return str
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

const STORAGE_KEYS = {
  WIDGET_COLLAPSE: 'assistant_widget_collapse',
  TASKS: 'assistant_tasks',
  REMINDERS: 'assistant_reminders',
  NOTES: 'assistant_notes',
  ROUTINES: 'assistant_routines',
  ROUTINE_DATE: 'assistant_routine_date',
  SETTINGS: 'assistant_settings',
  QUICK_LINKS: 'assistant_quick_links',
  WEATHER_CITY: 'assistant_weather_city',
  FINANCE_WATCHLIST: 'assistant_finance_watchlist',
  NEWS_SOURCES: 'assistant_news_sources',
  WIDGETS: 'assistant_widgets',
  API_KEYS: 'assistant_api_keys',
  AUTH: 'assistant_auth_session',
  CREDENTIALS: 'assistant_user_credentials',
  AUTH_ENABLED: 'assistant_auth_enabled',
  VAULT: 'assistant_secure_vault',
  VAULT_PIN: 'assistant_vault_pin'
};

const DEFAULT_VAULT_PIN = '1234';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
  name: 'Sayın Yöneticim'
};

const DEFAULT_WIDGETS = {
  weather: true,
  finance: true,
  news: true,
  tasks: true,
  reminders: true,
  notes: true,
  routines: true,
  focus: true,
  quickTools: true
};

const DEFAULT_SETTINGS = {
  assistantName: 'Yönetici Asistanı',
  userName: 'Sayın Yöneticim',
  popupEnabled: true,
  soundEnabled: true,
  toastEnabled: true,
  browserNotifyEnabled: true,
  theme: 'dark',
  pomodoroWork: 25,
  pomodoroBreak: 5
};

const INITIAL_DATA = {
  tasks: [
    {
      id: 'task-1',
      title: 'Haftalık yönetim toplantısı gündemini hazırla',
      category: 'Toplantı',
      priority: 'urgent',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '11:00',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Önemli iş ortaklığı e-postalarını yanıtla',
      category: 'E-posta',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:30',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Aylık bütçe ve harcama raporunu incele',
      category: 'Takip',
      priority: 'normal',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '16:00',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ],
  reminders: [
    {
      id: 'rem-1',
      title: 'Ekip Durum Değerlendirmesi',
      datetime: new Date(Date.now() + 3600 * 1000 * 2).toISOString().slice(0, 16),
      notifyType: 'both',
      triggered: false,
      createdAt: new Date().toISOString()
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Toplantı Notları - Strateji 2026',
      content: '1. Yeni operasyonel hedeflerin belirlenmesi.\n2. Otomasyon ve asistan araçlarının aktif kullanımı.\n3. Haftalık ilerleme raporlarının cuma günü toplanması.',
      color: 'blue',
      pinned: true,
      updatedAt: new Date().toISOString()
    }
  ],
  routines: [
    { id: 'rout-1', title: 'Sabah gelen e-postalarını tara & filtrele', completed: false },
    { id: 'rout-2', title: 'Günün öncelikli 3 kritik görevini belirle', completed: false },
    { id: 'rout-3', title: 'Önemli toplantı takvimini gözden geçir', completed: false },
    { id: 'rout-4', title: 'Gün ortası mola & su tüketimi', completed: false },
    { id: 'rout-5', title: 'Gün sonu özetini tamamla & yarını planla', completed: false }
  ],
  quickLinks: [
    { id: 'link-1', title: 'Google Takvim', url: 'https://calendar.google.com', icon: 'calendar' },
    { id: 'link-2', title: 'Gmail / E-posta', url: 'https://mail.google.com', icon: 'mail' },
    { id: 'link-3', title: 'Google Drive', url: 'https://drive.google.com', icon: 'hard-drive' },
    { id: 'link-4', title: 'Notion / Notlar', url: 'https://notion.so', icon: 'file-text' }
  ]
};

class StorageService {
  constructor() {
    this.isServerConnected = false;
    this.initDefaults();
    this.syncWithServer();
  }

  getApiUrl() {
    if (window.location.protocol === 'file:') {
      return 'http://localhost:5050/api/data';
    }
    return '/api/data';
  }

  initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      this.save(STORAGE_KEYS.TASKS, INITIAL_DATA.tasks, false);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
      this.save(STORAGE_KEYS.REMINDERS, INITIAL_DATA.reminders, false);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
      this.save(STORAGE_KEYS.NOTES, INITIAL_DATA.notes, false);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROUTINES)) {
      this.save(STORAGE_KEYS.ROUTINES, INITIAL_DATA.routines, false);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUICK_LINKS)) {
      this.save(STORAGE_KEYS.QUICK_LINKS, INITIAL_DATA.quickLinks, false);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS, false);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const savedRoutineDate = localStorage.getItem(STORAGE_KEYS.ROUTINE_DATE);
    if (savedRoutineDate !== todayStr) {
      const routines = this.get(STORAGE_KEYS.ROUTINES, INITIAL_DATA.routines);
      const resetRoutines = routines.map(r => ({ ...r, completed: false }));
      this.save(STORAGE_KEYS.ROUTINES, resetRoutines, false);
      localStorage.setItem(STORAGE_KEYS.ROUTINE_DATE, todayStr);
    }
  }

  async syncWithServer() {
    try {
      const apiUrl = this.getApiUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(apiUrl, { 
        cache: 'no-store',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isServerConnected = true;
        
        if (data.tasks && data.tasks.length > 0) {
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
        }
        if (data.reminders) localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(data.reminders));
        if (data.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
        if (data.routines) localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(data.routines));
        if (data.quickLinks) localStorage.setItem(STORAGE_KEYS.QUICK_LINKS, JSON.stringify(data.quickLinks));
        if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));

        if (window.app) {
          window.app.renderAll();
        }

        const serverStatusEl = document.getElementById('serverStatusBadge');
        if (serverStatusEl) {
          serverStatusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="text-emerald-300 font-medium">Web Sunucusu Aktif (:5050)</span>';
        }
      } else {
        throw new Error('Server response not ok');
      }
    } catch (e) {
      // Local mode fallback
      this.isServerConnected = false;
      const serverStatusEl = document.getElementById('serverStatusBadge');
      if (serverStatusEl) {
        serverStatusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-400"></span><span class="text-slate-300 font-medium">Yerel Tarayıcı Modu</span>';
      }
    }
  }

  get(key, defaultValue = []) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  save(key, data, syncServer = true) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if (syncServer) {
        this.pushAllToServer();
      }
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  }

  async pushAllToServer() {
    try {
      const apiUrl = this.getApiUrl();
      const payload = {
        tasks: this.get(STORAGE_KEYS.TASKS),
        reminders: this.get(STORAGE_KEYS.REMINDERS),
        notes: this.get(STORAGE_KEYS.NOTES),
        routines: this.get(STORAGE_KEYS.ROUTINES),
        quickLinks: this.get(STORAGE_KEYS.QUICK_LINKS),
        settings: this.get(STORAGE_KEYS.SETTINGS)
      };

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Offline mode silent
    }
  }

  exportAllData() {
    const backupData = {
      exportDate: new Date().toISOString(),
      version: '2.6',
      tasks: this.get(STORAGE_KEYS.TASKS),
      reminders: this.get(STORAGE_KEYS.REMINDERS),
      notes: this.get(STORAGE_KEYS.NOTES),
      routines: this.get(STORAGE_KEYS.ROUTINES),
      quickLinks: this.get(STORAGE_KEYS.QUICK_LINKS),
      settings: this.get(STORAGE_KEYS.SETTINGS),
      vault: this.get(STORAGE_KEYS.VAULT, null),
      ipoPortfolio: this.get('assistant_ipo_portfolio', []),
      customMenus: this.get('assistant_custom_menus', []),
      watchlist: this.get(STORAGE_KEYS.FINANCE_WATCHLIST, [])
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateFormatted = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `Yonetici_Asistani_PRO_Yedek_${dateFormatted}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importData(jsonContent) {
    try {
      const data = JSON.parse(jsonContent);
      if (data.tasks) this.save(STORAGE_KEYS.TASKS, data.tasks);
      if (data.reminders) this.save(STORAGE_KEYS.REMINDERS, data.reminders);
      if (data.notes) this.save(STORAGE_KEYS.NOTES, data.notes);
      if (data.routines) this.save(STORAGE_KEYS.ROUTINES, data.routines);
      if (data.quickLinks) this.save(STORAGE_KEYS.QUICK_LINKS, data.quickLinks);
      if (data.settings) this.save(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS, ...data.settings });
      if (data.vault) this.save(STORAGE_KEYS.VAULT, data.vault, false);
      if (data.ipoPortfolio) this.save('assistant_ipo_portfolio', data.ipoPortfolio, false);
      if (data.customMenus) this.save('assistant_custom_menus', data.customMenus, false);
      if (data.watchlist) this.save(STORAGE_KEYS.FINANCE_WATCHLIST, data.watchlist, false);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetAllData() {
    localStorage.clear();
    this.initDefaults();
    this.pushAllToServer();
  }
}

window.appStorage = new StorageService();
