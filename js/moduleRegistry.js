/**
 * ModuleRegistry — Mesleki Modül Kütüphanesi & Profil Yöneticisi
 * 
 * 8 Temel Meslek Şablonu ve Bağımsız Modül Yapılandırması
 */

// 1. TÜM KULLANILABİLİR MODÜLLERİN LİSTESİ
const ALL_PORTAL_MODULES = {
  // --- Çekirdek Verimlilik ---
  dashboard: { id: 'dashboard', label: 'Ana Sayfa & Özet', icon: 'home', category: 'core', type: 'tab' },
  tasks: { id: 'tasks', label: 'Görevler & İş Takibi', icon: 'check-circle', category: 'productivity', type: 'tab' },
  reminders: { id: 'reminders', label: 'Hatırlatıcılar', icon: 'alarm-clock', category: 'productivity', type: 'tab' },
  notes: { id: 'notes', label: 'Toplantı & Notlar', icon: 'book-open', category: 'productivity', type: 'tab' },
  routines: { id: 'routines', label: 'Odaklanma & Rutin', icon: 'target', category: 'productivity', type: 'tab' },

  // --- Finans & Yatırım ---
  finance: { id: 'finance', label: 'Borsa & Canlı Piyasalar', icon: 'trending-up', category: 'finance', type: 'tab' },
  subscriptions: { id: 'subscriptions', label: 'Abonelikler & Ödemeler', icon: 'credit-card', category: 'finance', type: 'tab' },

  // --- Sektörel / Mesleki Dikey Modüller ---
  veresiye: { 
    id: 'veresiye', 
    label: 'Veresiye & Toptancı Defteri', 
    icon: 'book-marked', 
    category: 'profession', 
    type: 'tab',
    desc: 'Müşteri borçları, tahsilatlar ve toptancı ödeme vadesi takibi.'
  },
  nobet: { 
    id: 'nobet', 
    label: 'Nöbet & Vardiya Çizelgesi', 
    icon: 'calendar-days', 
    category: 'profession', 
    type: 'tab',
    desc: 'Nöbet günleri, icaplar, takas yönetimi ve vaka notları.'
  },
  durusma: { 
    id: 'durusma', 
    label: 'Duruşma & Süre Sayacı', 
    icon: 'scale', 
    category: 'profession', 
    type: 'tab',
    desc: 'Mahkeme duruşma saatleri ve kesin itiraz süreleri geri sayımı.'
  },
  emlak: { 
    id: 'emlak', 
    label: 'İlan Portföyü & Emlak CRM', 
    icon: 'building-2', 
    category: 'profession', 
    type: 'tab',
    desc: 'Satılık/kiralık mülkler, alıcı kriterleri ve tapu randevuları.'
  },
  ogretmen: { 
    id: 'ogretmen', 
    label: 'Ders Programı & Özel Ders', 
    icon: 'graduation-cap', 
    category: 'profession', 
    type: 'tab',
    desc: 'Haftalık dersler, özel ders paket ücretleri ve veli iletişim notları.'
  },
  varlik_evrak: { 
    id: 'varlik_evrak', 
    label: 'Varlık, Kasko & Resmi Evrak', 
    icon: 'shield-alert', 
    category: 'profession', 
    type: 'tab',
    desc: 'Araç kaskosu, muayene, pasaport/vize ve sözleşme süreleri.'
  },
  zimmet: {
    id: 'zimmet',
    label: 'Zimmet & Teçhizat Takibi',
    icon: 'shield',
    category: 'profession',
    type: 'tab',
    desc: 'Zimmetli silah, telsiz, donanım ve periyodik bakım takvimi.'
  },

  // --- Genel & Güvenlik ---
  news: { id: 'news', label: 'Gündem & Haberler', icon: 'newspaper', category: 'general', type: 'tab' },
  cityLife: { id: 'cityLife', label: 'Şehir & Yaşam Rehberi', icon: 'map-pin', category: 'general', type: 'tab' },
  vault: { id: 'vault', label: 'Şifreli Güvenli Kasa', icon: 'lock', category: 'system', type: 'tab' }
};

// 2. 8 TEMEL MESLEK ŞABLONU (PRESETS)
const PROFESSION_PRESETS = {
  bakkal_esnaf: {
    id: 'bakkal_esnaf',
    title: 'Bakkal, Market & Esnaf',
    icon: 'shopping-cart',
    color: 'emerald',
    badge: 'Ticari',
    desc: 'Veresiye defteri, toptancı ödeme günleri ve hızlı borç-alacak takibi.',
    activeModules: ['dashboard', 'veresiye', 'subscriptions', 'tasks', 'reminders', 'news'],
    customMenuGroups: [
      { id: 'group_esnaf', label: 'Dükkan & Kasa', icon: 'store', children: ['veresiye', 'subscriptions'] },
      { id: 'group_gunluk', label: 'Günlük Planlama', icon: 'check-circle', children: ['tasks', 'reminders', 'news'] }
    ]
  },

  doktor_saglik: {
    id: 'doktor_saglik',
    title: 'Doktor & Sağlık Çalışanı',
    icon: 'stethoscope',
    color: 'cyan',
    badge: 'Sağlık',
    desc: '24 saatlik nöbetler, nöbet takasları, ameliyat ve kritik hasta notları.',
    activeModules: ['dashboard', 'nobet', 'tasks', 'notes', 'reminders', 'routines', 'news'],
    customMenuGroups: [
      { id: 'group_nobet', label: 'Klinik & Nöbetler', icon: 'activity', children: ['nobet', 'notes'] },
      { id: 'group_plan', label: 'Kişisel Verimlilik', icon: 'target', children: ['tasks', 'reminders', 'routines'] }
    ]
  },

  asker_polis: {
    id: 'asker_polis',
    title: 'Asker, Polis & Güvenlik',
    icon: 'shield-check',
    color: 'indigo',
    badge: 'Güvenlik',
    desc: '12/36 vardiyaları, zimmetli teçhizat bakımı, şark puanı ve izin takibi.',
    activeModules: ['dashboard', 'nobet', 'zimmet', 'varlik_evrak', 'tasks', 'reminders', 'vault'],
    customMenuGroups: [
      { id: 'group_gorev', label: 'Görev & Vardiya', icon: 'shield', children: ['nobet', 'zimmet', 'varlik_evrak'] },
      { id: 'group_kisisel', label: 'Kişisel & Kasa', icon: 'lock', children: ['tasks', 'reminders', 'vault'] }
    ]
  },

  emlakci: {
    id: 'emlakci',
    title: 'Emlak & Gayrimenkul Danışmanı',
    icon: 'building-2',
    color: 'amber',
    badge: 'Gayrimenkul',
    desc: 'Satılık/kiralık portföy, alıcı müşteri eşleme ve tapu randevuları.',
    activeModules: ['dashboard', 'emlak', 'tasks', 'reminders', 'notes', 'finance', 'news'],
    customMenuGroups: [
      { id: 'group_emlak', label: 'Portföy & Müşteri', icon: 'building', children: ['emlak', 'notes'] },
      { id: 'group_finans_emlak', label: 'Piyasa & İş Takibi', icon: 'trending-up', children: ['finance', 'tasks', 'reminders'] }
    ]
  },

  avukat_hukuk: {
    id: 'avukat_hukuk',
    title: 'Avukat & Hukukçu',
    icon: 'scale',
    color: 'purple',
    badge: 'Hukuk',
    desc: 'Duruşma takvimi, kesin itiraz/istinaf süre sayacı ve müvekkil masrafları.',
    activeModules: ['dashboard', 'durusma', 'notes', 'tasks', 'reminders', 'varlik_evrak', 'vault'],
    customMenuGroups: [
      { id: 'group_dava', label: 'Duruşma & Dosyalar', icon: 'briefcase', children: ['durusma', 'notes', 'varlik_evrak'] },
      { id: 'group_hukuk_is', label: 'Ofis & Güvenlik', icon: 'shield-check', children: ['tasks', 'reminders', 'vault'] }
    ]
  },

  ogretmen_egitmen: {
    id: 'ogretmen_egitmen',
    title: 'Öğretmen & Eğitmen',
    icon: 'graduation-cap',
    color: 'blue',
    badge: 'Eğitim',
    desc: 'Haftalık ders programı, özel ders paket saatleri ve veli iletişim notları.',
    activeModules: ['dashboard', 'ogretmen', 'tasks', 'notes', 'reminders', 'routines', 'news'],
    customMenuGroups: [
      { id: 'group_ders', label: 'Ders & Öğrenciler', icon: 'book', children: ['ogretmen', 'notes'] },
      { id: 'group_egitim_is', label: 'Planlama & Notlar', icon: 'calendar', children: ['tasks', 'reminders', 'routines'] }
    ]
  },

  yonetici_ceo: {
    id: 'yonetici_ceo',
    title: 'Yönetici & İş İnsanı (Executive)',
    icon: 'crown',
    color: 'yellow',
    badge: 'Yönetim',
    desc: 'Canlı Borsa ve Yatırım Portföyü, Sabah Brifingi, VIP Kişi Ağı ve Kasa.',
    activeModules: ['dashboard', 'finance', 'subscriptions', 'varlik_evrak', 'notes', 'tasks', 'vault'],
    customMenuGroups: [
      { id: 'group_yonetim_finans', label: 'Finans & Yatırım', icon: 'trending-up', children: ['finance', 'subscriptions'] },
      { id: 'group_yonetim_strateji', label: 'Strateji & Kasa', icon: 'shield-check', children: ['varlik_evrak', 'notes', 'vault', 'tasks'] }
    ]
  },

  bireysel_zen: {
    id: 'bireysel_zen',
    title: 'Bireysel & Sade Yaşam (Zen)',
    icon: 'feather',
    color: 'teal',
    badge: 'Kişisel',
    desc: 'Günün 3 kritik görevi, alışkanlık zinciri, hava durumu ve sade günlük.',
    activeModules: ['dashboard', 'tasks', 'routines', 'reminders', 'notes', 'news', 'cityLife'],
    customMenuGroups: [
      { id: 'group_zen_gunluk', label: 'Günün Odak Noktaları', icon: 'sun', children: ['tasks', 'routines'] },
      { id: 'group_zen_yasam', label: 'Kişisel Yaşam', icon: 'compass', children: ['reminders', 'notes', 'news', 'cityLife'] }
    ]
  }
};

// 3. PROFİL & AKTİF MODÜL YÖNETİCİSİ (ProfileManager)
class ProfileManager {
  constructor() {
    this.STORAGE_PROFILE_KEY = 'portal_active_user_profile_v2';
    this.STORAGE_ACTIVE_MODULES_KEY = 'portal_user_enabled_modules_v2';
    
    this.profile = this.loadProfile();
    this.enabledModules = this.loadEnabledModules();
  }

  loadProfile() {
    try {
      const p = localStorage.getItem(this.STORAGE_PROFILE_KEY);
      return p ? JSON.parse(p) : null;
    } catch (e) {
      return null;
    }
  }

  loadEnabledModules() {
    try {
      const m = localStorage.getItem(this.STORAGE_ACTIVE_MODULES_KEY);
      if (m) return JSON.parse(m);
      if (this.profile && PROFESSION_PRESETS[this.profile.presetId]) {
        return [...PROFESSION_PRESETS[this.profile.presetId].activeModules];
      }
      return ['dashboard', 'finance', 'tasks', 'reminders', 'notes', 'routines', 'news', 'vault'];
    } catch (e) {
      return ['dashboard', 'finance', 'tasks', 'reminders', 'notes'];
    }
  }

  /**
   * Yeni meslek profili seçildiğinde
   */
  setPreset(presetId, extraAnswers = {}) {
    const preset = PROFESSION_PRESETS[presetId];
    if (!preset) return false;

    this.profile = {
      presetId,
      title: preset.title,
      customName: extraAnswers.name || '',
      configuredAt: Date.now(),
      answers: extraAnswers
    };

    this.enabledModules = [...preset.activeModules];

    localStorage.setItem(this.STORAGE_PROFILE_KEY, JSON.stringify(this.profile));
    localStorage.setItem(this.STORAGE_ACTIVE_MODULES_KEY, JSON.stringify(this.enabledModules));

    // Menüyü anında güncelle
    if (window.menuManager) {
      window.menuManager.refreshByProfile();
    }
    return true;
  }

  /**
   * Modül aç/kapat (Modül Mağazası için)
   */
  toggleModule(moduleId) {
    if (this.enabledModules.includes(moduleId)) {
      this.enabledModules = this.enabledModules.filter(m => m !== moduleId);
    } else {
      this.enabledModules.push(moduleId);
    }
    localStorage.setItem(this.STORAGE_ACTIVE_MODULES_KEY, JSON.stringify(this.enabledModules));

    if (window.menuManager) {
      window.menuManager.refreshByProfile();
    }
  }

  isModuleEnabled(moduleId) {
    return this.enabledModules.includes(moduleId);
  }

  getPreset() {
    return this.profile && PROFESSION_PRESETS[this.profile.presetId] 
      ? PROFESSION_PRESETS[this.profile.presetId] 
      : PROFESSION_PRESETS.bireysel_zen;
  }
}

// Global Singleton
window.moduleRegistry = {
  ALL_MODULES: ALL_PORTAL_MODULES,
  PRESETS: PROFESSION_PRESETS,
  profileManager: new ProfileManager()
};

console.log('[ModuleRegistry] ✅ 8 Meslek Şablonu ve Modül Kütüphanesi Hazır.');
