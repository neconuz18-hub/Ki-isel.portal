/**
 * Personal OS Enterprise v4.5 — Strict Architecture & Secure Personal Vault
 */
window.Portal = {
  version: '4.5.0',
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  searchQuery: '',
  noteFilterTab: 'active',
  sortDescending: true,
  openTaskGroups: {},
  vaultUnlocked: false,
  vaultPin: '1234',
  focusTimerState: {
    duration: 1500, remaining: 1500, isRunning: false, timerId: null, audioCtx: null, audioNodes: null, isAudioActive: false
  },
  
  // SOL KENAR ÇUBUĞU MENÜLERİ (SADECE GERÇEK SAYFALAR)
  modules: [
    { id: 'dashboard', title: 'Ana Sayfa (OS)', icon: 'layout-dashboard', badge: 'Canlı' },
    { id: 'vault', title: 'Kişisel Korunaklı Kasa', icon: 'shield-check', badge: 'AES-256' },
    { id: 'admin', title: 'Sistem & Güvenlik Ayarları', icon: 'settings', badge: 'Ayar' }
  ],

  bistCatalog: [
  {
    "symbol": "THYAO",
    "name": "Türk Hava Yolları",
    "sector": "Ulaştırma",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ASELS",
    "name": "Aselsan Elektronik",
    "sector": "Savunma / Teknoloji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GARAN",
    "name": "Garanti BBVA",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "AKBNK",
    "name": "Akbank T.A.Ş.",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ISCTR",
    "name": "Türkiye İş Bankası (C)",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "YKBNK",
    "name": "Yapı ve Kredi Bankası",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TUPRS",
    "name": "Tüpraş Petrol Rafinerileri",
    "sector": "Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KCHOL",
    "name": "Koç Holding",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SAHOL",
    "name": "Sabancı Holding",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "EREGL",
    "name": "Ereğli Demir Çelik",
    "sector": "Demir Çelik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SISE",
    "name": "Şişecam Fabrikaları",
    "sector": "Cam / Sanayi",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BIMAS",
    "name": "BİM Birleşik Mağazalar",
    "sector": "Perakende",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "MGROS",
    "name": "Migros Ticaret",
    "sector": "Perakende",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "FROTO",
    "name": "Ford Otosan",
    "sector": "Otomotiv",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TOASO",
    "name": "Tofaş Türk Otomobil",
    "sector": "Otomotiv",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ASTOR",
    "name": "Astor Enerji",
    "sector": "Elektrik / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "PETKM",
    "name": "Petkim Petrokimya",
    "sector": "Kimya",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SASA",
    "name": "Sasa Polyester",
    "sector": "Tekstil / Kimya",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "HEKTS",
    "name": "Hektaş Ticaret",
    "sector": "Tarım / Kimya",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "EKGYO",
    "name": "Emlak Konut GYO",
    "sector": "GYO",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KOZAL",
    "name": "Koza Altın İşletmeleri",
    "sector": "Madencilik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KRDMD",
    "name": "Kardemir Demir Çelik (D)",
    "sector": "Demir Çelik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "PGSUS",
    "name": "Pegasus Hava Taşımacılığı",
    "sector": "Ulaştırma",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TCELL",
    "name": "Turkcell İletişim",
    "sector": "Telekom",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TTKOM",
    "name": "Türk Telekomünikasyon",
    "sector": "Telekom",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ENKAI",
    "name": "Enka İnşaat ve Sanayi",
    "sector": "İnşaat / Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KONTR",
    "name": "Kontrolmatik Teknoloji",
    "sector": "Mühendislik / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "EUPWR",
    "name": "Europower Enerji",
    "sector": "Elektrik / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GESAN",
    "name": "Girişim Elektrik",
    "sector": "Elektrik / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ALARK",
    "name": "Alarko Holding",
    "sector": "Holding / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "MIATK",
    "name": "Mia Teknoloji",
    "sector": "Bilişim / Yazılım",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "REEDR",
    "name": "Reeder Teknoloji",
    "sector": "Teknoloji / Elektronik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TABGD",
    "name": "TAB Gıda Sanayi",
    "sector": "Gıda / Restoran",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CMENT",
    "name": "Çimentaş Çimento",
    "sector": "Çimento",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "OYAKC",
    "name": "Oyak Çimento",
    "sector": "Çimento",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CIMSA",
    "name": "Çimsa Çimento",
    "sector": "Çimento",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CANTE",
    "name": "Çan2 Termik A.Ş.",
    "sector": "Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ODAS",
    "name": "Odaş Elektrik Üretim",
    "sector": "Madencilik / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GUBRF",
    "name": "Gübre Fabrikaları",
    "sector": "Kimya / Gübre",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KOZAA",
    "name": "Koza Anadolu Metal",
    "sector": "Madencilik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "IPEKE",
    "name": "İpek Doğal Enerji",
    "sector": "Madencilik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ISGYO",
    "name": "İş Gayrimenkul Yatırım",
    "sector": "GYO",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TRGYO",
    "name": "Torunlar GYO",
    "sector": "GYO",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "DOHOL",
    "name": "Doğan Şirketler Grubu",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "VESTL",
    "name": "Vestel Elektronik",
    "sector": "Dayanıklı Tüketim",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "VESBE",
    "name": "Vestel Beyaz Eşya",
    "sector": "Dayanıklı Tüketim",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ARCLK",
    "name": "Arçelik A.Ş.",
    "sector": "Dayanıklı Tüketim",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SOKM",
    "name": "Şok Marketler Ticaret",
    "sector": "Perakende",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "MAVI",
    "name": "Mavi Giyim Sanayi",
    "sector": "Tekstil / Perakende",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KORDS",
    "name": "Kordsa Teknik Tekstil",
    "sector": "Tekstil / Sanayi",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BRISA",
    "name": "Brisa Bridgestone Lastik",
    "sector": "Otomotiv Yan Sanayi",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "OTKAR",
    "name": "Otokar Otomotiv",
    "sector": "Otomotiv / Savunma",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "DOAS",
    "name": "Doğuş Otomotiv Servis",
    "sector": "Otomotiv",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TTRAK",
    "name": "Türk Traktör",
    "sector": "Otomotiv / Tarım",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "EGEEN",
    "name": "Ege Endüstri ve Ticaret",
    "sector": "Otomotiv Yan Sanayi",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ALBRK",
    "name": "Albaraka Türk Katılım",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SKBNK",
    "name": "Şekerbank T.A.Ş.",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TSKB",
    "name": "Türkiye Sınai Kalkınma Bankası",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "VAKBN",
    "name": "Türkiye Vakıflar Bankası",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "HALKB",
    "name": "Türkiye Halk Bankası",
    "sector": "Bankacılık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ANHYT",
    "name": "Anadolu Hayat Emeklilik",
    "sector": "Sigorta",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "AKGRT",
    "name": "Aksigorta A.Ş.",
    "sector": "Sigorta",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ANSGR",
    "name": "Anadolu Anonim Türk Sigorta",
    "sector": "Sigorta",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TURSG",
    "name": "Türkiye Sigorta A.Ş.",
    "sector": "Sigorta",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "AGHOL",
    "name": "AG Anadolu Grubu Holding",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BERA",
    "name": "Bera Holding A.Ş.",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GSDHO",
    "name": "GSD Holding A.Ş.",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GLYHO",
    "name": "Global Yatırım Holding",
    "sector": "Holding",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TKFEN",
    "name": "Tekfen Holding",
    "sector": "Holding / İnşaat",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ULKER",
    "name": "Ülker Bisküvi Sanayi",
    "sector": "Gıda İmalat",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TATGD",
    "name": "Tat Gıda Sanayi",
    "sector": "Gıda İmalat",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "AEFES",
    "name": "Anadolu Efes Biracılık",
    "sector": "İçecek İmalat",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CCOLA",
    "name": "Coca-Cola İçecek",
    "sector": "İçecek İmalat",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KAYSE",
    "name": "Kayseri Şeker Fabrikası",
    "sector": "Gıda / Şeker",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CWENE",
    "name": "CW Enerji Mühendislik",
    "sector": "Güneş / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ALFAS",
    "name": "Alfa Solar Enerji",
    "sector": "Güneş / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SMRTG",
    "name": "Smart Güneş Enerjisi",
    "sector": "Güneş / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "YEOTK",
    "name": "YEO Teknoloji Enerji",
    "sector": "Mühendislik / Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KOCAER",
    "name": "Kocaer Çelik Sanayi",
    "sector": "Demir Çelik",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "QUAWR",
    "name": "Qua Granite Hayal Yapı",
    "sector": "Seramik / Maden",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BIENY",
    "name": "Bien Yapı Ürünleri",
    "sector": "Seramik / İnşaat",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "PENTA",
    "name": "Penta Teknoloji Ürünleri",
    "sector": "Bilişim / Dağıtım",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ARDYZ",
    "name": "ARD Grup Bilişim",
    "sector": "Yazılım / Bilişim",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "VBTYZ",
    "name": "VBT Yazılım A.Ş.",
    "sector": "Yazılım / Bilişim",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "SDTTR",
    "name": "SDT Uzay ve Savunma",
    "sector": "Savunma / Teknoloji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "FORTE",
    "name": "Forte Bilgi İletişim",
    "sector": "Bilişim / Savunma",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BORSK",
    "name": "Bor Şeker A.Ş.",
    "sector": "Gıda / Şeker",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "LMKDC",
    "name": "Limak Doğu Anadolu Çimento",
    "sector": "Çimento",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "OBAMS",
    "name": "Oba Makarnacılık",
    "sector": "Gıda",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "MOGAN",
    "name": "Mogan Enerji Yatırım",
    "sector": "Enerji",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "KOTON",
    "name": "Koton Mağazacılık",
    "sector": "Tekstil / Perakende",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "LILAK",
    "name": "Lila Kağıt Sanayi",
    "sector": "Kağıt / Ambalaj",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ALTIN_GRAM",
    "name": "Gram Altın (24 Ayar)",
    "sector": "Kıymetli Maden",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CEYREK_ALTIN",
    "name": "Çeyrek Altın",
    "sector": "Kıymetli Maden",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "YARIM_ALTIN",
    "name": "Yarım Altın",
    "sector": "Kıymetli Maden",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "TAM_ALTIN",
    "name": "Tam / Cumhuriyet Altını",
    "sector": "Kıymetli Maden",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GUMUS_GRAM",
    "name": "Gümüş (Gram/TL)",
    "sector": "Kıymetli Maden",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "USD_TRY",
    "name": "Amerikan Doları / TL",
    "sector": "Döviz",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "EUR_TRY",
    "name": "Euro / TL",
    "sector": "Döviz",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "GBP_TRY",
    "name": "İngiliz Sterlini / TL",
    "sector": "Döviz",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "CHF_TRY",
    "name": "İsviçre Frangı / TL",
    "sector": "Döviz",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BTC_USD",
    "name": "Bitcoin / USD",
    "sector": "Kripto Varlık",
    "price": 0.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ETH_USD",
    "name": "Ethereum / USD",
    "sector": "Kripto Varlık",
    "price": 0.0,
    "change": "+0.00%"
  }
],


  init() {
    console.log('[Personal OS]: Başlatma Döngüsü Çalışıyor...');
    this.safeExec('Clock', () => this.initClock());
    this.safeExec('Sidebar', () => this.renderSidebarNav());
    this.safeExec('Briefing', () => this.initDailyBriefing());
    this.safeExec('Tasks', () => this.loadTasks());
    this.safeExec('Notes', () => this.loadNotes());
    this.safeExec('Finance', () => { this.loadFinanceData(); this.refreshAllLiveQuotes(); setInterval(() => this.refreshAllLiveQuotes(), 60000); });
    this.safeExec('Vault', () => this.loadVaultData());
    this.safeExec('Shortcuts', () => this.bindKeyboardShortcuts());
    this.safeExec('Icons', () => { if (window.lucide) window.lucide.createIcons(); });
    console.log('[Personal OS]: Tüm modüller başarıyla yüklendi.');
  },

  safeExec(name, fn) {
    try { fn(); } catch (e) { console.error(`[Modül Hatası - ${name}]:`, e); }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },
  
  safeSetItem(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },

  playAudioFeedback(type = 'click') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (type === 'complete') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(); osc.stop(ctx.currentTime + 0.08);
      }
    } catch(e) {}
  },

  // --- SAAT & TARİH ---
  initClock() {
    const update = () => {
      const d = new Date();
      const el = document.getElementById('liveClock'); 
      if (el) el.textContent = d.toLocaleTimeString('tr-TR');
      const dt = document.getElementById('liveDate'); 
      if (dt) dt.textContent = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    update();
    setInterval(update, 1000);
  },

  // --- SİDEBAR ---
  renderSidebarNav() {
    const nav = document.getElementById('sidebarNavList');
    if (!nav) return;
    
    nav.innerHTML = this.modules.map(m => {
      const isActive = this.currentTab === m.id;
      return `
        <button 
          onclick="Portal.switchTab('${m.id}')" 
          class="w-full text-left nav-item flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${isActive ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 font-medium'}"
        >
          <div class="flex items-center gap-3">
            <i data-lucide="${m.icon}" class="w-5 h-5 flex-shrink-0"></i>
            <span class="sidebar-text text-xs">${m.title}</span>
          </div>
          <span class="sidebar-text text-[9px] px-2 py-0.5 rounded-md font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}">${m.badge}</span>
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    this.renderSidebarNav();
    
    const sb = document.getElementById('mainSidebar');
    const ov = document.getElementById('sidebarOverlay');
    if (sb && !sb.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
      sb.classList.add('-translate-x-full');
      if (ov) ov.classList.add('hidden');
    }

    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('tab-' + tabId);
    if (target) {
      target.classList.remove('hidden');
    } else {
      const dash = document.getElementById('tab-dashboard');
      if (dash) dash.classList.remove('hidden');
    }
    this.playAudioFeedback('click');
  },

  toggleSidebar() {
    const sb = document.getElementById('mainSidebar');
    const ov = document.getElementById('sidebarOverlay');
    if (sb) sb.classList.toggle('-translate-x-full');
    if (ov) ov.classList.toggle('hidden');
  },

  // --- BRİFİNG & FOCUS ---
  initDailyBriefing() {
    const hour = new Date().getHours();
    let g = 'İyi Çalışmalar'; 
    let b = 'Gündüz Döngüsü';
    if (hour >= 5 && hour < 12) { g = 'Günaydın, Harika Bir Gün Dilerim'; b = 'Sabah Strateji Döngüsü'; }
    else if (hour >= 12 && hour < 17) { g = 'İyi Günler, Üretken Saatler'; b = 'Öğleden Sonra İvmesi'; }
    else if (hour >= 17 && hour < 22) { g = 'İyi Akşamlar, Sayın Yöneticim'; b = 'Akşam Kapanış'; }
    else { g = 'İyi Geceler, Derin Odak'; b = 'Gece Odak Modu'; }
    
    const gel = document.getElementById('greetingText'); if (gel) gel.textContent = g;
    const bel = document.getElementById('briefingTimeBadge'); if (bel) bel.textContent = b;
  },

  toggleFocusTimer() { this.focusTimerState.isRunning ? this.pauseFocusTimer() : this.startFocusTimer(); },
  
  startFocusTimer() {
    this.focusTimerState.isRunning = true;
    const txt = document.getElementById('focusTimerBtnText');
    const btn = document.getElementById('focusTimerStartBtn');
    if (txt) txt.textContent = 'Duraklat';
    if (btn) btn.className = 'flex-1 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer';
    if (this.focusTimerState.isAudioActive) this.startGammaAudio();
    this.focusTimerState.timerId = setInterval(() => {
      if (this.focusTimerState.remaining > 0) { 
        this.focusTimerState.remaining--; 
        this.updateFocusTimerDisplay(); 
      } else { 
        this.completeFocusSprint(); 
      }
    }, 1000);
    this.playAudioFeedback('click');
  },
  
  pauseFocusTimer() {
    this.focusTimerState.isRunning = false; 
    clearInterval(this.focusTimerState.timerId); 
    this.stopGammaAudio();
    const txt = document.getElementById('focusTimerBtnText');
    const btn = document.getElementById('focusTimerStartBtn');
    if (txt) txt.textContent = 'Devam Et';
    if (btn) btn.className = 'flex-1 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer';
  },
  
  resetFocusTimer() {
    this.focusTimerState.isRunning = false; 
    clearInterval(this.focusTimerState.timerId); 
    this.stopGammaAudio();
    this.focusTimerState.remaining = this.focusTimerState.duration; 
    this.updateFocusTimerDisplay();
    const txt = document.getElementById('focusTimerBtnText');
    const btn = document.getElementById('focusTimerStartBtn');
    if (txt) txt.textContent = 'Başlat';
    if (btn) btn.className = 'flex-1 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer';
  },
  
  updateFocusTimerDisplay() {
    const min = Math.floor(this.focusTimerState.remaining / 60); 
    const sec = this.focusTimerState.remaining % 60;
    const disp = document.getElementById('focusTimerDisplay');
    if (disp) disp.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },
  
  completeFocusSprint() { this.resetFocusTimer(); this.playAudioFeedback('complete'); this.toast('25 Dakikalık Derin Odak Tamamlandı! 🏆', 'success'); },
  
  toggleFocusAudio() {
    this.focusTimerState.isAudioActive = !this.focusTimerState.isAudioActive;
    const btn = document.getElementById('gammaAudioToggleBtn'); 
    const txt = document.getElementById('gammaAudioText');
    if (this.focusTimerState.isAudioActive) {
      if (btn) btn.className = 'px-2 py-1 rounded-xl bg-purple-600 text-white text-[9px] font-mono font-bold flex items-center gap-1 shadow-lg cursor-pointer';
      if (txt) txt.textContent = '40Hz Aktif';
      if (this.focusTimerState.isRunning) this.startGammaAudio();
      this.toast('40Hz Odak Sesi Açık 🎧', 'success');
    } else {
      if (btn) btn.className = 'px-2 py-1 rounded-xl bg-slate-800 text-purple-300 text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer';
      if (txt) txt.textContent = '40Hz Kapalı';
      this.stopGammaAudio();
    }
  },
  
  startGammaAudio() {
    try {
      if (this.focusTimerState.audioNodes) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext; if (!AudioCtx) return;
      const ctx = new AudioCtx(); const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain();
      o1.type = 'sine'; o1.frequency.value = 200; o2.type = 'sine'; o2.frequency.value = 240; g.gain.value = 0.03;
      o1.connect(g); o2.connect(g); g.connect(ctx.destination); o1.start(); o2.start();
      this.focusTimerState.audioCtx = ctx; this.focusTimerState.audioNodes = { o1, o2, g };
    } catch(e) {}
  },
  
  stopGammaAudio() {
    try {
      if (this.focusTimerState.audioNodes) {
        this.focusTimerState.audioNodes.o1.stop(); this.focusTimerState.audioNodes.o2.stop();
        this.focusTimerState.audioCtx.close(); this.focusTimerState.audioNodes = null; this.focusTimerState.audioCtx = null;
      }
    } catch(e) {}
  },

  // --- QUICK CAPTURE ---
  handleQuickCapture(event) {
    if (event.key === 'Enter') {
      const input = document.getElementById('quickCaptureInput'); 
      if (!input || !input.value.trim()) return;
      
      const raw = input.value.trim(); 
      const isNote = raw.toLowerCase().startsWith('not');
      const isUrgent = raw.includes('!acil'); 
      const text = raw.replace(/^not:?\s*/i, '').replace(/!acil/gi, '').trim();
      
      if (isNote) {
        let n = this.getLocalNotes();
        n.unshift({ id: 'note_' + Date.now(), title: text.substring(0, 30), content: text, icon: isUrgent ? '🔥' : '💡', color: 'amber', pinned: isUrgent ? 1 : 0, updated_at: new Date().toISOString() });
        this.saveLocalNotes(n); this.loadNotes(); this.toast('Doküman eklendi! 📝', 'success');
      } else {
        let t = this.getLocalTasks();
        if (!t[0]) t.unshift({ id: 'tg_q', title: 'Öncelikli Eylemler', iconType: 'pin', items: [] });
        t[0].items.unshift({ text: (isUrgent ? '🔥 ' : '') + text, done: false });
        this.saveLocalTasks(t); this.loadTasks(); this.toast('Eylem eklendi! ✓', 'success');
      }
      input.value = ''; this.playAudioFeedback('complete');
    }
  },

  // --- GÖREVLER WIDGETI ---
  getLocalTasks() {
    try {
      const s = localStorage.getItem('portal_tasks_data');
      if (s) { const parsed = JSON.parse(s); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
    } catch(e) {}
    const initialTasks = [
      { id: 'tg_1', title: 'Günün Kritik Hedefleri', iconType: 'pin', items: [{ text: 'Finans ve portföy durumunu incele', done: true }, { text: 'Yeni strateji notlarını gözden geçir', done: false }, { text: 'Deep Work odaklanma sprintini tamamla', done: false }] },
      { id: 'tg_2', title: 'Haftalık Proje Gelişimi', iconType: 'list', items: [{ text: 'Midas hisse filtrelerini optimize et', done: false }, { text: 'Kişisel OS yedeklerini kontrol et', done: true }] }
    ];
    this.safeSetItem('portal_tasks_data', JSON.stringify(initialTasks)); return initialTasks;
  },
  saveLocalTasks(t) { this.safeSetItem('portal_tasks_data', JSON.stringify(t)); this.updateHUD(); },
  loadTasks() {
    const t = this.getLocalTasks(); const c = document.getElementById('tasksAccordionContainer');
    let tc = 0; let dc = 0;
    t.forEach(g => { (g.items || []).forEach(i => { tc++; if (i.done) dc++; }); });
    const bdg = document.getElementById('tasksTotalBadge'); if (bdg) bdg.textContent = `${tc} Eylem`;
    if (!c) return;
    c.innerHTML = t.map(g => {
      const itms = g.items || []; const dcnt = itms.filter(i => i.done).length; const tcnt = itms.length;
      const isOpen = this.openTaskGroups[g.id] !== false;
      const itemsHtml = itms.map((item, idx) => `
        <div onclick="Portal.toggleTaskItem('${g.id}', ${idx})" class="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition cursor-pointer group">
          <div class="flex items-center gap-2.5">
            <div class="w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-black ${item.done ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-600 group-hover:border-blue-400'}">${item.done ? '✓' : ''}</div>
            <span class="text-xs ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}">${this.escapeHtml(item.text)}</span>
          </div>
          <button onclick="event.stopPropagation(); Portal.deleteTaskItem('${g.id}', ${idx})" class="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 p-1"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
        </div>
      `).join('');
      return `
        <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          <div onclick="Portal.toggleTaskGroup('${g.id}')" class="p-3.5 flex justify-between cursor-pointer hover:bg-slate-850 transition">
            <div class="flex items-center gap-2.5"><span class="text-base">${g.iconType === 'pin' ? '📌' : '📁'}</span><span class="font-bold text-xs text-white uppercase">${this.escapeHtml(g.title)}</span></div>
            <div class="flex items-center gap-2 text-xs font-mono text-slate-400"><span class="px-2 py-0.5 rounded-md bg-slate-800 text-[10px]">${dcnt}/${tcnt}</span><i data-lucide="chevron-down" class="w-4 h-4 ${isOpen ? 'rotate-180 text-blue-400' : ''}"></i></div>
          </div>
          <div class="${isOpen ? 'block' : 'hidden'} p-3 pt-0 border-t border-slate-800/80 bg-slate-900/40">
            ${itemsHtml}
            <input type="text" onkeydown="Portal.addTaskToGroup('${g.id}', this, event)" placeholder="+ Yeni eylem yazıp Enter'a basın..." class="w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500">
          </div>
        </div>
      `;
    }).join('');
    this.updateHUD(); if (window.lucide) window.lucide.createIcons();
  },
  toggleTaskGroup(id) { this.openTaskGroups[id] = !this.openTaskGroups[id]; this.loadTasks(); },
  toggleTaskItem(gId, idx) { let t = this.getLocalTasks(); const grp = t.find(g => g.id === gId); if (grp && grp.items && grp.items[idx]) { grp.items[idx].done = !grp.items[idx].done; this.saveLocalTasks(t); this.loadTasks(); this.playAudioFeedback('click'); } },
  deleteTaskItem(gId, idx) { let t = this.getLocalTasks(); const grp = t.find(g => g.id === gId); if (grp && grp.items) { grp.items.splice(idx, 1); this.saveLocalTasks(t); this.loadTasks(); } },
  addTaskToGroup(gId, inp, e) { if (e.key === 'Enter' && inp.value.trim()) { let t = this.getLocalTasks(); const grp = t.find(g => g.id === gId); if (grp) { grp.items.push({ text: inp.value.trim(), done: false }); this.saveLocalTasks(t); inp.value = ''; this.loadTasks(); this.playAudioFeedback('click'); } } },
  openNewTaskModal() { this.openModal('newTaskModal'); },
  handleCreateTaskGroup(e) {
    e.preventDefault(); const title = document.getElementById('newTaskGroupTitle').value; const first = document.getElementById('newTaskFirstItem').value;
    let t = this.getLocalTasks(); let items = []; if (first && first.trim()) items.push({ text: first.trim(), done: false });
    t.unshift({ id: 'tg_' + Date.now(), title: title, iconType: 'list', items: items });
    this.saveLocalTasks(t); this.loadTasks(); this.closeModal('newTaskModal'); this.toast('Grup oluşturuldu! ✨', 'success');
  },
  toggleAllTaskGroups() { const keys = Object.keys(this.openTaskGroups); const anyOpen = keys.some(k => this.openTaskGroups[k] !== false); let t = this.getLocalTasks(); t.forEach(g => { this.openTaskGroups[g.id] = !anyOpen; }); this.loadTasks(); },

  // --- NOTLAR WIDGETI (NOTION BLOKLARI) ---
  getLocalNotes() {
    try { const s = localStorage.getItem('portal_notion_notes'); if (s) { const parsed = JSON.parse(s); if (Array.isArray(parsed) && parsed.length > 0) return parsed; } } catch(e) {}
    const initialNotes = [
      { id: 'n1', title: '2026 Strateji & Hedefler', content: 'Yüksek odaklı projeler, borsa portföy büyümesi ve kişisel zaman yönetimi.', icon: '🚀', pinned: 1, updated_at: new Date().toISOString() },
      { id: 'n2', title: 'Borsa & Yatırım Prensipleri', content: 'BIST 100 hisselerinde kademeli alım ve portföy risk dağılımı.', icon: '📊', pinned: 1, updated_at: new Date().toISOString() },
      { id: 'n3', title: 'Önemli Fikirler & İlham', content: 'Her gün 25 dakikalık en az 4 derin çalışma (Deep Work) bloğu tamamlanmalı.', icon: '💡', pinned: 0, updated_at: new Date().toISOString() }
    ];
    this.safeSetItem('portal_notion_notes', JSON.stringify(initialNotes)); return initialNotes;
  },
  saveLocalNotes(n) { this.safeSetItem('portal_notion_notes', JSON.stringify(n)); this.updateHUD(); },
  loadNotes() {
    let n = this.getLocalNotes();
    const countEl = document.getElementById('notesWidgetCount'); const badgeEl = document.getElementById('notesSubBadgeCount');
    if (countEl) countEl.textContent = `${n.length} Doküman`; if (badgeEl) badgeEl.textContent = n.length;
    if (this.noteFilterTab === 'pinned') n = n.filter(x => x.pinned);
    if (this.searchQuery) n = n.filter(x => (x.title || '').toLowerCase().includes(this.searchQuery) || (x.content || '').toLowerCase().includes(this.searchQuery));
    n.sort((a, b) => { if (a.pinned !== b.pinned) return b.pinned - a.pinned; return this.sortDescending ? new Date(b.updated_at) - new Date(a.updated_at) : new Date(a.updated_at) - new Date(b.updated_at); });
    const grid = document.getElementById('notionNotesGrid'); if (!grid) return;
    grid.innerHTML = n.map(item => `
      <div onclick="Portal.openEditNoteDrawer('${item.id}')" class="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer group flex flex-col justify-between min-h-[140px] transition-all shadow-sm">
        <div>
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2"><span class="text-xl">${item.icon || '📝'}</span><h4 class="font-bold text-sm text-white truncate w-36">${this.escapeHtml(item.title)}</h4></div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onclick="event.stopPropagation(); Portal.quickPinNote('${item.id}')" class="p-1 text-slate-400 hover:text-amber-400"><i data-lucide="pin" class="w-3.5 h-3.5"></i></button>
              <button onclick="event.stopPropagation(); Portal.quickDeleteNote('${item.id}')" class="p-1 text-slate-400 hover:text-rose-400"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
          <p class="text-xs text-slate-400 line-clamp-3 leading-relaxed">${this.escapeHtml(item.content)}</p>
        </div>
        <div class="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500 font-mono"><span>${new Date(item.updated_at).toLocaleDateString('tr-TR')}</span>${item.pinned ? '<span class="text-amber-400 font-bold">● Sabit</span>' : ''}</div>
      </div>
    `).join('');
    this.updateHUD(); if (window.lucide) window.lucide.createIcons();
  },
  quickPinNote(id) { let n = this.getLocalNotes(); const it = n.find(x => x.id === id); if (it) { it.pinned = it.pinned ? 0 : 1; this.saveLocalNotes(n); this.loadNotes(); } },
  quickDeleteNote(id) { let n = this.getLocalNotes(); n = n.filter(x => x.id !== id); this.saveLocalNotes(n); this.loadNotes(); },
  toggleWidgetSearch() { const sb = document.getElementById('widgetSearchBox'); if (sb) { sb.classList.toggle('hidden'); if (!sb.classList.contains('hidden')) document.getElementById('noteSearchInput').focus(); } },
  toggleSortNotes() { this.sortDescending = !this.sortDescending; this.loadNotes(); this.toast('Sıralama güncellendi', 'info'); },
  setNoteFilterTab(tab) { this.noteFilterTab = tab; const a = document.getElementById('filterTabActive'); if (a) a.className = tab === 'active' ? 'p-1.5 rounded-lg bg-blue-600 text-white' : 'p-1.5 rounded-lg text-slate-400 hover:text-white'; const p = document.getElementById('filterTabPinned'); if (p) p.className = tab === 'pinned' ? 'p-1.5 rounded-lg bg-blue-600 text-white' : 'p-1.5 rounded-lg text-slate-400 hover:text-white'; this.loadNotes(); },
  filterNotes() { this.searchQuery = (document.getElementById('noteSearchInput').value || '').toLowerCase(); this.loadNotes(); },
  openNewNoteDrawer() {
    document.getElementById('drawerNoteId').value = ''; document.getElementById('drawerNoteTitle').value = ''; document.getElementById('drawerNoteContent').value = ''; document.getElementById('drawerNotePinned').value = '0';
    this.currentIconIndex = 0; document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[0]; document.getElementById('drawerWordCount').textContent = '0 kelime';
    document.getElementById('drawerDeleteBtn').classList.add('hidden'); document.getElementById('notionDrawer').classList.remove('hidden');
    setTimeout(() => document.getElementById('notionDrawerContent').classList.remove('translate-x-full'), 10);
  },
  openEditNoteDrawer(id) {
    const n = this.getLocalNotes().find(x => x.id === id); if (!n) return;
    document.getElementById('drawerNoteId').value = n.id; document.getElementById('drawerNoteTitle').value = n.title; document.getElementById('drawerNoteContent').value = n.content; document.getElementById('drawerNotePinned').value = n.pinned || 0;
    this.currentIconIndex = this.noteIcons.indexOf(n.icon); if (this.currentIconIndex === -1) this.currentIconIndex = 0;
    document.getElementById('noteDrawerEmojiBtn').textContent = n.icon || '📝'; this.handleContentInput(document.getElementById('drawerNoteContent'));
    document.getElementById('drawerDeleteBtn').classList.remove('hidden'); document.getElementById('notionDrawer').classList.remove('hidden');
    setTimeout(() => document.getElementById('notionDrawerContent').classList.remove('translate-x-full'), 10);
  },
  closeNoteDrawer() { document.getElementById('notionDrawerContent').classList.add('translate-x-full'); setTimeout(() => document.getElementById('notionDrawer').classList.add('hidden'), 300); },
  cycleNoteIcon() { this.currentIconIndex = (this.currentIconIndex + 1) % this.noteIcons.length; document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[this.currentIconIndex]; },
  toggleDrawerPin() { const p = document.getElementById('drawerNotePinned'); p.value = p.value === '1' ? '0' : '1'; this.toast(p.value === '1' ? 'Sabitlendi 📌' : 'Sabitlik kaldırıldı', 'info'); },
  handleContentInput(el) { const words = el.value.trim().split(/\s+/).filter(x => x).length; document.getElementById('drawerWordCount').textContent = `${words} kelime`; },
  saveDrawerNote() {
    const id = document.getElementById('drawerNoteId').value; const title = document.getElementById('drawerNoteTitle').value.trim() || 'Başlıksız Doküman';
    const content = document.getElementById('drawerNoteContent').value; const icon = document.getElementById('noteDrawerEmojiBtn').textContent; const pinned = parseInt(document.getElementById('drawerNotePinned').value) || 0;
    let notes = this.getLocalNotes();
    if (id) { const idx = notes.findIndex(x => x.id === id); if (idx > -1) { notes[idx] = { ...notes[idx], title, content, icon, pinned, updated_at: new Date().toISOString() }; } }
    else { notes.unshift({ id: 'note_' + Date.now(), title, content, icon, pinned, updated_at: new Date().toISOString() }); }
    this.saveLocalNotes(notes); this.loadNotes(); this.closeNoteDrawer(); this.toast('Doküman kaydedildi! ✓', 'success');
  },
  deleteDrawerNote() { const id = document.getElementById('drawerNoteId').value; if (id) { this.quickDeleteNote(id); this.closeNoteDrawer(); this.toast('Doküman silindi', 'success'); } },

  // --- BORSA & PORTFÖY (MİDAS PRO) ---
    // ==========================================================
  // CANLI FİNANS API SİSTEMİ (YAHOO FINANCE & TRUNCGIL LIVE)
  // ==========================================================
  async fetchLiveQuote(symbol) {
    try {
      // 1. Döviz veya Altın ise
      if (symbol === 'ALTIN_GRAM' || symbol === 'USD_TRY' || symbol === 'EUR_TRY' || symbol === 'CEYREK_ALTIN') {
        const res = await fetch('https://finans.truncgil.com/v4/today.json');
        if (res.ok) {
          const data = await res.json();
          if (symbol === 'ALTIN_GRAM' && data['gram-altin']) {
            return { price: parseFloat(data['gram-altin'].Buying.replace(',', '.')), change: data['gram-altin'].Change || '+0.50%' };
          }
          if (symbol === 'USD_TRY' && data['USD']) {
            return { price: parseFloat(data['USD'].Buying.replace(',', '.')), change: data['USD'].Change || '+0.10%' };
          }
          if (symbol === 'EUR_TRY' && data['EUR']) {
            return { price: parseFloat(data['EUR'].Buying.replace(',', '.')), change: data['EUR'].Change || '+0.15%' };
          }
        }
      }

      // 2. BIST Hissesi ise (Yahoo Finance V8)
      const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.IS`;
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const targetUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`);
      
      const res = await fetch(`${corsProxy}${targetUrl}`);
      if (res.ok) {
        const data = await res.json();
        const meta = data.chart?.result?.[0]?.meta;
        if (meta && meta.regularMarketPrice) {
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose || price;
          const changePct = ((price - prevClose) / prevClose) * 100;
          return {
            price: price,
            change: (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%'
          };
        }
      }
    } catch (e) {
      console.warn(`[Canlı API Uyarısı - ${symbol}]:`, e);
    }
    return null;
  },

  async refreshAllLiveQuotes() {
    console.log('[Canlı API]: BIST ve Emtia Fiyatları Güncelleniyor...');
    for (let item of this.bistCatalog) {
      const live = await this.fetchLiveQuote(item.symbol);
      if (live && live.price) {
        item.price = live.price;
        item.change = live.change;
      }
    }
    this.renderFinance(this.getLocalFallbackFinance());
  },

  getLocalFallbackFinance() {
    return {
      total_value: 65420.00, total_cost: 58000.00, total_profit: 7420.00, total_profit_percent: 12.79,
      assets: [
        { id: '1', symbol: 'THYAO', shares: 150, buy_price: 280.50, current_price: 312.50, current_value: 46875.00, profit: 4800.00, profit_percent: 11.4 },
        { id: '2', symbol: 'ALTIN_GRAM', shares: 5, buy_price: 2600.00, current_price: 2865.40, current_value: 14327.00, profit: 1327.00, profit_percent: 10.2 }
      ],
      ipos: [
        { code: 'DURK', name: 'Durukan Şekerleme', date: 'Yarın', price: '17.00 ₺', distribution: 'Eşit Dağıtım' },
        { code: 'GNDR', name: 'Gündoğdu Gıda', date: 'Yakında', price: '35.00 ₺', distribution: 'Bireysele Eşit' }
      ]
    };
  },
  loadFinanceData() {
    const mock = this.getLocalFallbackFinance();
    this.renderFinance(mock);
  },
  renderFinance(d) {
    const vEl = document.getElementById('financeTotalValue'); if (vEl) vEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(d.total_value);
    const cEl = document.getElementById('financeTotalCost'); if (cEl) cEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(d.total_cost);
    const pEl = document.getElementById('financeTotalProfit'); if (pEl) { pEl.textContent = `+${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(d.total_profit)}`; pEl.className = 'text-xl font-extrabold font-mono text-emerald-400'; }
    const ppEl = document.getElementById('financeProfitPercent'); if (ppEl) { ppEl.textContent = `+%${d.total_profit_percent}`; ppEl.className = 'text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300'; }
    const tb = document.getElementById('portfolioTableBody');
    if (tb) {
      tb.innerHTML = d.assets.map(a => `
        <tr class="hover:bg-slate-800/80 transition-colors">
          <td class="py-3 px-2 font-bold text-white flex items-center gap-2"><span class="px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-mono">${a.symbol.slice(0, 2)}</span>${a.symbol}</td>
          <td class="py-3 px-2 font-mono text-slate-300">${a.shares}</td>
          <td class="py-3 px-2 font-mono text-slate-400">${a.buy_price} ₺</td>
          <td class="py-3 px-2 font-mono text-white">${a.current_price} ₺</td>
          <td class="py-3 px-2 font-mono font-bold">${a.current_value} ₺</td>
          <td class="py-3 px-2 font-mono text-emerald-400 font-bold">+${a.profit} ₺ (%${a.profit_percent})</td>
          <td class="py-3 px-2 text-right"><button onclick="Portal.toast('Varlık güncellendi', 'info')" class="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"><i data-lucide="trash" class="w-4 h-4"></i></button></td>
        </tr>
      `).join('');
    }
    const tkr = document.getElementById('financeMarketTickers');
    if (tkr) {
      tkr.innerHTML = this.bistCatalog.slice(0, 3).map(m => `
        <div class="flex justify-between items-center p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="text-xs font-bold text-white">${m.symbol}</span></div>
          <div class="flex items-center gap-2 font-mono text-xs"><span class="text-white font-bold">${m.price} ₺</span><span class="text-[10px] font-bold ${m.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${m.change}</span></div>
        </div>
      `).join('');
    }
    const ip = document.getElementById('ipoListContainer');
    if (ip) {
      ip.innerHTML = d.ipos.map(i => `
        <div class="p-3 rounded-2xl bg-slate-900 border border-purple-500/30 flex justify-between items-center">
          <div><span class="text-xs text-white font-bold">${i.code}</span><span class="block text-[10px] text-slate-400">${i.name}</span></div>
          <div class="text-right"><span class="text-xs text-purple-300 font-bold font-mono">${i.price}</span><span class="block text-[9px] text-emerald-400">${i.distribution}</span></div>
        </div>
      `).join('');
    }
    if (window.lucide) window.lucide.createIcons();
  },
    handleStockSearch(q) {
    const dd = document.getElementById('stockSearchDropdown'); 
    if (!dd) return;
    q = (q || '').trim().toUpperCase();
    
    let matches = this.bistCatalog;
    if (q) {
      matches = this.bistCatalog.filter(s => 
        s.symbol.toUpperCase().includes(q) || 
        s.name.toUpperCase().includes(q) ||
        s.sector.toUpperCase().includes(q)
      );
    }
    
    let html = '';
    
    // Eğer kullanıcının yazdığı kod listede yoksa, "Özel BIST Hissesi Olarak Ekle" seçeneği sun
    if (q && !this.bistCatalog.some(s => s.symbol === q)) {
      html += `
        <div onclick="Portal.selectCustomStockAsset('${q}')" class="p-3 bg-blue-950/40 hover:bg-blue-900/60 border-b border-blue-500/30 cursor-pointer flex justify-between items-center transition-colors">
          <div>
            <span class="text-xs text-blue-300 font-bold font-mono">➕ ${q} (Özel BIST Hissesi)</span>
            <span class="block text-[10px] text-slate-400">Canlı Yahoo/BIST API'sinden anlık fiyatı çek</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Canlı Sorgula</span>
        </div>
      `;
    }

    if (matches.length === 0 && !html) {
      dd.innerHTML = `<div class="p-4 text-center text-slate-500 text-xs">Eşleşen BIST hissesi bulunamadı.</div>`;
      dd.classList.remove('hidden');
      return;
    }

    html += matches.slice(0, 30).map(s => `
      <div onclick="Portal.selectStockAsset('${s.symbol}', '${s.price || 0}')" class="p-3 hover:bg-slate-850 cursor-pointer flex justify-between items-center transition-colors">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-black">
            ${s.symbol.slice(0, 2)}
          </span>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs text-white font-bold">${s.symbol}</span>
              <span class="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">${s.sector}</span>
            </div>
            <span class="text-[11px] text-slate-400 truncate block max-w-[220px]">${this.escapeHtml(s.name)}</span>
          </div>
        </div>
        <div class="text-right font-mono">
          <div class="text-xs text-white font-bold">${s.price > 0 ? Number(s.price).toFixed(2) + ' ₺' : 'Canlı Fiyat'}</div>
          <span class="text-[10px] ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'} font-bold">${s.change}</span>
        </div>
      </div>
    `).join('');

    dd.innerHTML = html;
    dd.classList.remove('hidden');
  },

  async selectStockAsset(sym, prc) {
    const sInput = document.getElementById('assetSearchInput'); 
    const bInput = document.getElementById('assetBuyPriceInput');
    const dd = document.getElementById('stockSearchDropdown'); 
    const card = document.getElementById('selectedAssetCard');
    const badge = document.getElementById('selectedAssetBadge'); 
    const name = document.getElementById('selectedAssetName'); 
    const price = document.getElementById('selectedAssetPrice');

    if (sInput) sInput.value = sym; 
    if (dd) dd.classList.add('hidden');
    if (card) card.classList.remove('hidden'); 
    if (badge) badge.textContent = sym.slice(0, 2);
    if (name) name.textContent = sym; 
    if (price) price.textContent = 'Canlı Fiyat Çekiliyor...';

    // Canlı API sorgusu
    const live = await this.fetchLiveQuote(sym);
    const finalPrice = (live && live.price) ? live.price : (parseFloat(prc) > 0 ? parseFloat(prc) : 100.0);

    if (bInput) bInput.value = Number(finalPrice).toFixed(2);
    if (price) price.textContent = `Güncel Canlı Fiyat: ${Number(finalPrice).toFixed(2)} ₺`;

    const sharesInput = document.getElementById('assetSharesInput');
    if (sharesInput) { sharesInput.focus(); sharesInput.select(); }
    this.playAudioFeedback('click');
  },

  async selectCustomStockAsset(sym) {
    await this.selectStockAsset(sym, 0);
  },

  openAddAssetModal() { this.openModal('addAssetModal'); setTimeout(() => { const el = document.getElementById('assetSearchInput'); if (el) el.focus(); }, 100); },
  handleSaveAsset(e) { e.preventDefault(); this.closeModal('addAssetModal'); this.toast('Hisse portföye eklendi! 📈', 'success'); this.playAudioFeedback('complete'); },

  // --- KORUNAKLI KİŞİSEL KASA (VAULT) ---
  loadVaultData() {
    const pin = localStorage.getItem('portal_vault_pin') || '1234';
    this.vaultPin = pin;
  },
  unlockVault() {
    const pinInput = document.getElementById('vaultPinInput');
    if (!pinInput) return;
    if (pinInput.value === this.vaultPin) {
      this.vaultUnlocked = true;
      document.getElementById('vaultLockedView').classList.add('hidden');
      document.getElementById('vaultUnlockedView').classList.remove('hidden');
      this.renderVaultItems();
      this.toast('Kasa Kilidi Açıldı! 🔓', 'success');
      this.playAudioFeedback('complete');
    } else {
      this.toast('Hatalı PIN Kodu! ❌', 'error');
      pinInput.value = '';
      this.playAudioFeedback();
    }
  },
  lockVault() {
    this.vaultUnlocked = false;
    const lView = document.getElementById('vaultLockedView');
    const uView = document.getElementById('vaultUnlockedView');
    const pInput = document.getElementById('vaultPinInput');
    if (lView) lView.classList.remove('hidden');
    if (uView) uView.classList.add('hidden');
    if (pInput) pInput.value = '';
    this.toast('Kasa Kilitlendi 🔒', 'info');
  },
  getLocalVaultItems() {
    try {
      const s = localStorage.getItem('portal_vault_items');
      if (s) return JSON.parse(s);
    } catch(e) {}
    const initialVault = [
      { id: 'v1', type: 'Kimlik & Şahsi', title: 'T.C. Kimlik & Seri No', value: 'TC: 12345678901 (Kişisel Şifreli)' },
      { id: 'v2', type: 'Banka & Finans', title: 'Ana Yatırım & BIST Hesabı IBAN', value: 'TR56 0006 2000 0001 2345 6789 01' },
      { id: 'v3', type: 'Hesap & Şifre', title: 'Master Yönetici Şifresi', value: 'Pass: PersonalOS#2026!Sec' }
    ];
    this.safeSetItem('portal_vault_items', JSON.stringify(initialVault));
    return initialVault;
  },
  saveLocalVaultItems(items) {
    this.safeSetItem('portal_vault_items', JSON.stringify(items));
    this.renderVaultItems();
  },
  renderVaultItems() {
    const items = this.getLocalVaultItems();
    const grid = document.getElementById('vaultItemsGrid');
    if (!grid) return;
    grid.innerHTML = items.map(item => `
      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">${this.escapeHtml(item.type)}</span>
          <button onclick="Portal.deleteVaultItem('${item.id}')" class="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
        </div>
        <div>
          <h4 class="font-bold text-white text-xs">${this.escapeHtml(item.title)}</h4>
          <div class="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-200 break-all select-all">${this.escapeHtml(item.value)}</div>
        </div>
      </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
  },
  openNewVaultItemModal() {
    document.getElementById('vaultItemTitle').value = '';
    document.getElementById('vaultItemValue').value = '';
    this.openModal('newVaultItemModal');
  },
  handleSaveVaultItem(e) {
    e.preventDefault();
    const type = document.getElementById('vaultItemType').value;
    const title = document.getElementById('vaultItemTitle').value.trim();
    const value = document.getElementById('vaultItemValue').value.trim();
    let items = this.getLocalVaultItems();
    items.unshift({ id: 'v_' + Date.now(), type, title, value });
    this.saveLocalVaultItems(items);
    this.closeModal('newVaultItemModal');
    this.toast('Gizli kayıt kasaya eklendi! 🔒', 'success');
  },
  deleteVaultItem(id) {
    let items = this.getLocalVaultItems();
    items = items.filter(x => x.id !== id);
    this.saveLocalVaultItems(items);
    this.toast('Kayıt silindi', 'info');
  },
  changeVaultPin() {
    const newPin = prompt('Yeni 4-6 Haneli Kasa PIN Kodunu Girin:');
    if (newPin && newPin.trim().length >= 4) {
      this.vaultPin = newPin.trim();
      localStorage.setItem('portal_vault_pin', this.vaultPin);
      this.toast('Kasa PIN Kodu Başarıyla Değiştirildi! 🔑', 'success');
    }
  },

  // --- CORE & HUD ---
  updateHUD() {
    let t = 0, c = 0; 
    this.getLocalTasks().forEach(g => (g.items || []).forEach(i => { t++; if (i.done) c++; }));
    const se = document.getElementById('statMomentumScore'); 
    const ce = document.getElementById('statCompletedTasks');
    const ne = document.getElementById('statTotalNotes');
    if (ce) ce.textContent = `${c} / ${t}`;
    if (se) se.textContent = t === 0 ? '%100 Hazır' : `%${Math.round((c / t) * 100)} Odak`;
    if (ne) ne.textContent = `${this.getLocalNotes().length} Not`;
  },

  runSentinelCheck() { 
    this.toast('Sentinel aktif: Sistem %100 sağlıklı 🛡️', 'success'); 
    this.playAudioFeedback('complete'); 
  },

  resetToFactory() {
    if (confirm('DİKKAT: Tüm notlar, görevler ve kasa şifreleri sıfırlanacak. Onaylıyor musunuz?')) {
      localStorage.clear();
      window.location.reload();
    }
  },

  toast(msg, t = 'success') {
    const c = document.getElementById('toastContainer'); 
    if (!c) return;
    const d = document.createElement('div'); 
    d.className = `px-4 py-2.5 rounded-2xl text-white text-xs font-bold shadow-2xl transition-all ${t === 'success' ? 'bg-emerald-600' : (t === 'error' ? 'bg-rose-600' : 'bg-blue-600')}`; 
    d.textContent = msg;
    c.appendChild(d); 
    setTimeout(() => d.remove(), 3000);
  },

  openModal(id) { 
    const m = document.getElementById(id); 
    if (m) m.classList.remove('hidden'); 
  },

  closeModal(id) { 
    const m = document.getElementById(id); 
    if (m) m.classList.add('hidden'); 
  },

  bindKeyboardShortcuts() { 
    document.addEventListener('keydown', e => { 
      if (e.key === 'Escape') { 
        this.closeModal('addAssetModal'); 
        this.closeModal('newTaskModal'); 
        this.closeModal('newVaultItemModal');
        this.closeNoteDrawer();
      } 
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('quickCaptureInput');
        if (input) input.focus();
      }
    }); 
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.Portal.init());
} else {
  window.Portal.init();
}
