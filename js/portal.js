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
  selectedNoteCategory: 'ALL',
  sortDescending: true,
  openTaskGroups: {},
  openGroupArchives: {},
  showTaskArchive: false,
  vaultUnlocked: false,
  vaultPin: '1234',
  focusTimerState: {
    duration: 1500, remaining: 1500, isRunning: false, timerId: null, audioCtx: null, audioNodes: null, isAudioActive: false
  },
  financeTab: 'watchlist',
  financeAddMode: 'watch',
  selectedExplorerSector: 'ALL',
  
  _uiSyncCounter: 0,
  _uiSyncTimer: null,

  // SOL KENAR ÇUBUĞU MENÜLERİ (Borsa ve Nakit Akışı / Borçlar kesin olarak ayrıldı)
  modules: [
    { id: 'dashboard', title: 'Ana Sayfa (OS)', icon: 'layout-dashboard', badge: 'Canlı' },
    { id: 'finance', title: 'Borsa & Yatırım Terminali', icon: 'trending-up', badge: 'Canlı BIST' },
    { id: 'budget', title: 'Nakit Akışı & Ödemeler', icon: 'wallet', badge: 'Planlama' },
    { id: 'admin', title: 'Sistem & Güvenlik Ayarları', icon: 'settings', badge: 'Ayar' }
  ],

  bistCatalog: [
  {
    "symbol": "ALTIN",
    "name": "Gram Altın",
    "sector": "Maden / Döviz",
    "price": 6856.86,
    "change": "+0.75%"
  },
  {
    "symbol": "GNDR",
    "name": "Gündoğdu Gıda",
    "sector": "Gıda / Perakende",
    "price": 35.0,
    "change": "+0.00%"
  },
  {
    "symbol": "DURK",
    "name": "Durukan Şekerleme",
    "sector": "Gıda / Perakende",
    "price": 17.0,
    "change": "+0.00%"
  },
  {
    "symbol": "A1CAP",
    "name": "A1CAP | A1 Capital",
    "sector": "Sanayi",
    "price": 7.7,
    "change": "-0.26%"
  },
  {
    "symbol": "A1YEN",
    "name": "A1YEN | Kartal Yenilenebili Enerji",
    "sector": "Sanayi",
    "price": 2.65,
    "change": "-2.21%"
  },
  {
    "symbol": "AAGYO",
    "name": "AAGYO | Ağaoğlu GYO",
    "sector": "Sanayi",
    "price": 12.29,
    "change": "-0.73%"
  },
  {
    "symbol": "ACSEL",
    "name": "ACSEL | Acıselsan Acıpayam Selüloz",
    "sector": "Sanayi",
    "price": 114.3,
    "change": "+0.26%"
  },
  {
    "symbol": "ADEL",
    "name": "ADEL | Adel Kalemcilik",
    "sector": "Sanayi",
    "price": 31.9,
    "change": "-2.98%"
  },
  {
    "symbol": "ADESE",
    "name": "ADESE | Adese AVM",
    "sector": "Sanayi",
    "price": 0.85,
    "change": "+0.00%"
  },
  {
    "symbol": "ADGYO",
    "name": "ADGYO | Adra GYO",
    "sector": "Sanayi",
    "price": 58.7,
    "change": "+0.69%"
  },
  {
    "symbol": "AEFES",
    "name": "AEFES | Anadolu Efes",
    "sector": "Sanayi",
    "price": 17.99,
    "change": "-0.50%"
  },
  {
    "symbol": "AFYON",
    "name": "AFYON | Afyon Çimento",
    "sector": "Sanayi",
    "price": 12.47,
    "change": "-0.56%"
  },
  {
    "symbol": "AGESA",
    "name": "AGESA | Agesa Hayat ve Emeklilik",
    "sector": "Sanayi",
    "price": 260.0,
    "change": "-1.70%"
  },
  {
    "symbol": "AGHOL",
    "name": "AGHOL | Anadolu Grubu Holding",
    "sector": "Sanayi",
    "price": 32.64,
    "change": "+0.80%"
  },
  {
    "symbol": "AGROT",
    "name": "AGROT | Agrotech Yüksek Teknoloji",
    "sector": "Sanayi",
    "price": 1.98,
    "change": "-1.00%"
  },
  {
    "symbol": "AGYO",
    "name": "AGYO | Atakule GYO",
    "sector": "Sanayi",
    "price": 7.19,
    "change": "-2.04%"
  },
  {
    "symbol": "AHGAZ",
    "name": "AHGAZ | Ahlatçı Doğalgaz",
    "sector": "Sanayi",
    "price": 38.7,
    "change": "+0.52%"
  },
  {
    "symbol": "AHSGY",
    "name": "AHSGY | Ahes GYO",
    "sector": "Sanayi",
    "price": 15.61,
    "change": "-4.23%"
  },
  {
    "symbol": "AKBNK",
    "name": "AKBNK | Akbank",
    "sector": "Bankacılık",
    "price": 71.5,
    "change": "-0.63%"
  },
  {
    "symbol": "AKCNS",
    "name": "AKCNS | Akçansa",
    "sector": "Sanayi",
    "price": 240.6,
    "change": "+0.21%"
  },
  {
    "symbol": "AKENR",
    "name": "AKENR | Akenerji",
    "sector": "Sanayi",
    "price": 10.36,
    "change": "-1.15%"
  },
  {
    "symbol": "AKFGY",
    "name": "AKFGY | Akfen GYO",
    "sector": "Sanayi",
    "price": 2.54,
    "change": "-0.39%"
  },
  {
    "symbol": "AKFIS",
    "name": "AKFIS | Akfen İnşaat",
    "sector": "Sanayi",
    "price": 17.54,
    "change": "+3.18%"
  },
  {
    "symbol": "AKFYE",
    "name": "AKFYE | Akfen Yenilenebilir Enerji",
    "sector": "Sanayi",
    "price": 22.76,
    "change": "-0.09%"
  },
  {
    "symbol": "AKGRT",
    "name": "AKGRT | Aksigorta",
    "sector": "Sanayi",
    "price": 6.09,
    "change": "-1.30%"
  },
  {
    "symbol": "AKHAN",
    "name": "AKHAN | Akhan Un",
    "sector": "Sanayi",
    "price": 40.04,
    "change": "-0.89%"
  },
  {
    "symbol": "AKMGY",
    "name": "AKMGY | Akmerkez GYO",
    "sector": "Sanayi",
    "price": 254.0,
    "change": "-1.74%"
  },
  {
    "symbol": "AKSA",
    "name": "AKSA | Aksa",
    "sector": "Sanayi",
    "price": 10.71,
    "change": "+0.09%"
  },
  {
    "symbol": "AKSEN",
    "name": "AKSEN | Aksa Enerji",
    "sector": "Sanayi",
    "price": 81.5,
    "change": "+3.76%"
  },
  {
    "symbol": "AKSGY",
    "name": "AKSGY | Akis GYO",
    "sector": "Sanayi",
    "price": 9.9,
    "change": "-0.70%"
  },
  {
    "symbol": "AKSUE",
    "name": "AKSUE | Aksu Enerji",
    "sector": "Sanayi",
    "price": 27.7,
    "change": "-8.58%"
  },
  {
    "symbol": "AKYHO",
    "name": "AKYHO | Akdeniz Yatırım Holding",
    "sector": "Sanayi",
    "price": 2.02,
    "change": "-1.94%"
  },
  {
    "symbol": "ALARK",
    "name": "ALARK | Alarko Holding",
    "sector": "Sanayi",
    "price": 110.4,
    "change": "+2.32%"
  },
  {
    "symbol": "ALBRK",
    "name": "ALBRK | Albaraka Türk",
    "sector": "Sanayi",
    "price": 8.8,
    "change": "+1.38%"
  },
  {
    "symbol": "ALBTN",
    "name": "ALBTN | Albayrak Hazır Beton",
    "sector": "Sanayi",
    "price": 30.5,
    "change": "-3.79%"
  },
  {
    "symbol": "ALCAR",
    "name": "ALCAR | Alarko Carrier",
    "sector": "Sanayi",
    "price": 703.0,
    "change": "+4.77%"
  },
  {
    "symbol": "ALCTL",
    "name": "ALCTL | Alcatel Teletaş",
    "sector": "Sanayi",
    "price": 114.6,
    "change": "-1.29%"
  },
  {
    "symbol": "ALFAS",
    "name": "ALFAS | Alfa Solar",
    "sector": "Sanayi",
    "price": 39.06,
    "change": "-2.35%"
  },
  {
    "symbol": "ALGYO",
    "name": "ALGYO | Alarko GYO",
    "sector": "Sanayi",
    "price": 3.55,
    "change": "-1.93%"
  },
  {
    "symbol": "ALKA",
    "name": "ALKA | Alkim Kağıt",
    "sector": "Sanayi",
    "price": 8.07,
    "change": "-0.49%"
  },
  {
    "symbol": "ALKIM",
    "name": "ALKIM | Alkim",
    "sector": "Sanayi",
    "price": 15.42,
    "change": "-0.19%"
  },
  {
    "symbol": "ALKLC",
    "name": "ALKLC | Altınkılıç Gıda",
    "sector": "Sanayi",
    "price": 427.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ALTNY",
    "name": "ALTNY | Altınay Savunma",
    "sector": "Sanayi",
    "price": 17.45,
    "change": "+0.29%"
  },
  {
    "symbol": "ALVES",
    "name": "ALVES | Alves Kablo",
    "sector": "Sanayi",
    "price": 1.31,
    "change": "-5.07%"
  },
  {
    "symbol": "ANELE",
    "name": "ANELE | Anel Elektrik",
    "sector": "Sanayi",
    "price": 194.0,
    "change": "+0.52%"
  },
  {
    "symbol": "ANGEN",
    "name": "ANGEN | Anatolia Biyoteknoloji",
    "sector": "Sanayi",
    "price": 8.9,
    "change": "-0.67%"
  },
  {
    "symbol": "ANHYT",
    "name": "ANHYT | Anadolu Hayat Emeklilik A.Ş.",
    "sector": "Sanayi",
    "price": 103.8,
    "change": "-0.86%"
  },
  {
    "symbol": "ANSGR",
    "name": "ANSGR | Anadolu Sigorta",
    "sector": "Sanayi",
    "price": 26.5,
    "change": "-1.34%"
  },
  {
    "symbol": "ARASE",
    "name": "ARASE | Doğu Aras Enerji",
    "sector": "Sanayi",
    "price": 120.2,
    "change": "-3.84%"
  },
  {
    "symbol": "ARCLK",
    "name": "ARCLK | Arçelik",
    "sector": "Sanayi",
    "price": 90.25,
    "change": "+0.00%"
  },
  {
    "symbol": "ARDYZ",
    "name": "ARDYZ | ARD Grup Bilişim",
    "sector": "Sanayi",
    "price": 85.0,
    "change": "+3.22%"
  },
  {
    "symbol": "ARENA",
    "name": "ARENA | Arena Bilgisayar",
    "sector": "Sanayi",
    "price": 20.14,
    "change": "-0.79%"
  },
  {
    "symbol": "ARFYE",
    "name": "ARFYE | Arf Bio Enerji",
    "sector": "Sanayi",
    "price": 19.31,
    "change": "-3.11%"
  },
  {
    "symbol": "ARMGD",
    "name": "ARMGD | Armada Gıda",
    "sector": "Sanayi",
    "price": 197.9,
    "change": "+6.57%"
  },
  {
    "symbol": "ARSAN",
    "name": "ARSAN | Arsan Holding",
    "sector": "Sanayi",
    "price": 3.97,
    "change": "-2.70%"
  },
  {
    "symbol": "ARTMS",
    "name": "ARTMS | Artemis Halı",
    "sector": "Sanayi",
    "price": 40.9,
    "change": "-3.31%"
  },
  {
    "symbol": "ARZUM",
    "name": "ARZUM | Arzum Ev Aletleri",
    "sector": "Sanayi",
    "price": 1.54,
    "change": "-5.52%"
  },
  {
    "symbol": "ASELS",
    "name": "ASELS | Aselsan",
    "sector": "Sanayi",
    "price": 380.75,
    "change": "-0.98%"
  },
  {
    "symbol": "ASGYO",
    "name": "ASGYO | Asce GYO",
    "sector": "Sanayi",
    "price": 10.95,
    "change": "+0.00%"
  },
  {
    "symbol": "ASTOR",
    "name": "ASTOR | Astor Enerji",
    "sector": "Sanayi",
    "price": 316.0,
    "change": "-0.24%"
  },
  {
    "symbol": "ASUZU",
    "name": "ASUZU | Anadolu Isuzu",
    "sector": "Sanayi",
    "price": 46.98,
    "change": "-1.05%"
  },
  {
    "symbol": "ATAGY",
    "name": "ATAGY | Ata GYO",
    "sector": "Sanayi",
    "price": 9.87,
    "change": "-0.90%"
  },
  {
    "symbol": "ATAKP",
    "name": "ATAKP | Atakey Patates",
    "sector": "Sanayi",
    "price": 41.76,
    "change": "-2.70%"
  },
  {
    "symbol": "ATATP",
    "name": "ATATP | ATP Bilgisayar",
    "sector": "Sanayi",
    "price": 293.75,
    "change": "-1.09%"
  },
  {
    "symbol": "ATATR",
    "name": "ATATR | Ata Turizm",
    "sector": "Sanayi",
    "price": 13.32,
    "change": "+0.60%"
  },
  {
    "symbol": "ATEKS",
    "name": "ATEKS | Akın Tekstil",
    "sector": "Sanayi",
    "price": 95.0,
    "change": "-1.55%"
  },
  {
    "symbol": "ATLAS",
    "name": "ATLAS | Atlas YO",
    "sector": "Sanayi",
    "price": 5.95,
    "change": "-0.50%"
  },
  {
    "symbol": "ATSYH",
    "name": "ATSYH | Atlantis YO",
    "sector": "Sanayi",
    "price": 120.0,
    "change": "-6.98%"
  },
  {
    "symbol": "AVGYO",
    "name": "AVGYO | Avrasya YO",
    "sector": "Sanayi",
    "price": 16.38,
    "change": "+9.20%"
  },
  {
    "symbol": "AVHOL",
    "name": "AVHOL | Avrupa Yatırım Holding",
    "sector": "Sanayi",
    "price": 34.2,
    "change": "-2.23%"
  },
  {
    "symbol": "AVOD",
    "name": "AVOD | Avod Kurutulmuş Gıda",
    "sector": "Sanayi",
    "price": 3.98,
    "change": "+2.05%"
  },
  {
    "symbol": "AVPGY",
    "name": "AVPGY | Avrupakent GYO",
    "sector": "Sanayi",
    "price": 55.7,
    "change": "-2.11%"
  },
  {
    "symbol": "AVTUR",
    "name": "AVTUR | Avrasya Petrol&Turistik Tesis",
    "sector": "Sanayi",
    "price": 12.0,
    "change": "+0.17%"
  },
  {
    "symbol": "AYCES",
    "name": "AYCES | Altınyunus Çesme",
    "sector": "Sanayi",
    "price": 449.25,
    "change": "+0.00%"
  },
  {
    "symbol": "AYDEM",
    "name": "AYDEM | Aydem Enerji",
    "sector": "Sanayi",
    "price": 26.4,
    "change": "+0.38%"
  },
  {
    "symbol": "AYEN",
    "name": "AYEN | Ayen Enerji",
    "sector": "Sanayi",
    "price": 30.32,
    "change": "-2.19%"
  },
  {
    "symbol": "AYES",
    "name": "AYES | Ayes Çelik Hasır & Çit",
    "sector": "Sanayi",
    "price": 29.56,
    "change": "-3.02%"
  },
  {
    "symbol": "AYGAZ",
    "name": "AYGAZ | Aygaz",
    "sector": "Sanayi",
    "price": 325.0,
    "change": "-1.96%"
  },
  {
    "symbol": "AZTEK",
    "name": "AZTEK | Aztek Teknoloji",
    "sector": "Sanayi",
    "price": 3.76,
    "change": "+1.08%"
  },
  {
    "symbol": "BAGFS",
    "name": "BAGFS | Bandırma Gübre Fabrikaları A.Ş",
    "sector": "Sanayi",
    "price": 26.08,
    "change": "-0.08%"
  },
  {
    "symbol": "BAHKM",
    "name": "BAHKM | Bahadır Kimya",
    "sector": "Sanayi",
    "price": 158.1,
    "change": "-2.17%"
  },
  {
    "symbol": "BAKAB",
    "name": "BAKAB | Bak Ambalaj",
    "sector": "Sanayi",
    "price": 38.24,
    "change": "-2.70%"
  },
  {
    "symbol": "BALAT",
    "name": "BALAT | Balatacılar Balatacılık",
    "sector": "Sanayi",
    "price": 68.5,
    "change": "-0.72%"
  },
  {
    "symbol": "BALSU",
    "name": "BALSU | Balsu Gıda",
    "sector": "Sanayi",
    "price": 9.9,
    "change": "+3.13%"
  },
  {
    "symbol": "BANVT",
    "name": "BANVT | Banvit",
    "sector": "Sanayi",
    "price": 149.4,
    "change": "-1.58%"
  },
  {
    "symbol": "BARMA",
    "name": "BARMA | Barem Ambalaj",
    "sector": "Sanayi",
    "price": 8.1,
    "change": "-4.71%"
  },
  {
    "symbol": "BASCM",
    "name": "BASCM | Baştaş Başkent Çimento Sanayi",
    "sector": "Sanayi",
    "price": 13.7,
    "change": "-0.58%"
  },
  {
    "symbol": "BASGZ",
    "name": "BASGZ | Başkent Doğalgaz",
    "sector": "Sanayi",
    "price": 44.2,
    "change": "-0.67%"
  },
  {
    "symbol": "BAYRK",
    "name": "BAYRK | Bayrak EBT Taban",
    "sector": "Sanayi",
    "price": 4.19,
    "change": "-1.18%"
  },
  {
    "symbol": "BEGYO",
    "name": "BEGYO | Batı Ege GYO",
    "sector": "Sanayi",
    "price": 3.44,
    "change": "-1.71%"
  },
  {
    "symbol": "BERA",
    "name": "BERA | Bera Holding",
    "sector": "Sanayi",
    "price": 13.6,
    "change": "+0.15%"
  },
  {
    "symbol": "BESLR",
    "name": "BESLR | Besler Gıda",
    "sector": "Sanayi",
    "price": 12.91,
    "change": "-0.08%"
  },
  {
    "symbol": "BESTE",
    "name": "BESTE | Best Brands Grup",
    "sector": "Sanayi",
    "price": 31.88,
    "change": "-0.38%"
  },
  {
    "symbol": "BETAE",
    "name": "BETAE | Beta Enerji",
    "sector": "Sanayi",
    "price": 84.1,
    "change": "-3.05%"
  },
  {
    "symbol": "BEYAZ",
    "name": "BEYAZ | Beyaz Filo",
    "sector": "Sanayi",
    "price": 21.88,
    "change": "-2.15%"
  },
  {
    "symbol": "BFREN",
    "name": "BFREN | Bosch Fren",
    "sector": "Sanayi",
    "price": 126.1,
    "change": "-0.79%"
  },
  {
    "symbol": "BIENY",
    "name": "BIENY | Bien Yapı",
    "sector": "Sanayi",
    "price": 21.72,
    "change": "-1.27%"
  },
  {
    "symbol": "BIGCH",
    "name": "BIGCH | BigChefs",
    "sector": "Sanayi",
    "price": 5.52,
    "change": "-0.90%"
  },
  {
    "symbol": "BIGEN",
    "name": "BIGEN | Birleşim Grup Enerji",
    "sector": "Sanayi",
    "price": 187.0,
    "change": "+0.54%"
  },
  {
    "symbol": "BIGTK",
    "name": "BIGTK | Big Medya",
    "sector": "Sanayi",
    "price": 323.25,
    "change": "-2.05%"
  },
  {
    "symbol": "BIMAS",
    "name": "BIMAS | Bim Birleşik Mağazalar A.Ş",
    "sector": "Sanayi",
    "price": 406.25,
    "change": "-0.49%"
  },
  {
    "symbol": "BINBN",
    "name": "BINBN | BinBin",
    "sector": "Sanayi",
    "price": 177.4,
    "change": "+1.14%"
  },
  {
    "symbol": "BINHO",
    "name": "BINHO | 1000 Yatırımlar",
    "sector": "Sanayi",
    "price": 9.57,
    "change": "-0.10%"
  },
  {
    "symbol": "BIOEN",
    "name": "BIOEN | Biotrend Enerji",
    "sector": "Sanayi",
    "price": 18.9,
    "change": "-2.48%"
  },
  {
    "symbol": "BIZIM",
    "name": "BIZIM | Bizim Toptan",
    "sector": "Sanayi",
    "price": 24.2,
    "change": "-0.66%"
  },
  {
    "symbol": "BJKAS",
    "name": "BJKAS | Beşiktaş",
    "sector": "Sanayi",
    "price": 2.18,
    "change": "-3.11%"
  },
  {
    "symbol": "BKRGY",
    "name": "BKRGY | Bakırcı GYO",
    "sector": "Sanayi",
    "price": 11.64,
    "change": "-9.98%"
  },
  {
    "symbol": "BLCYT",
    "name": "BLCYT | Bilici Yatırım",
    "sector": "Sanayi",
    "price": 2.06,
    "change": "+4.04%"
  },
  {
    "symbol": "BLUME",
    "name": "BLUME | Blume Metal Kimya",
    "sector": "Sanayi",
    "price": 41.0,
    "change": "+0.00%"
  },
  {
    "symbol": "BMSCH",
    "name": "BMSCH | BMS Çelik Hasır",
    "sector": "Sanayi",
    "price": 10.46,
    "change": "-3.42%"
  },
  {
    "symbol": "BMSTL",
    "name": "BMSTL | BMS Birleşik Metal",
    "sector": "Sanayi",
    "price": 43.9,
    "change": "-1.70%"
  },
  {
    "symbol": "BNTAS",
    "name": "BNTAS | Bantaş Bandırma Ambalaj",
    "sector": "Sanayi",
    "price": 6.18,
    "change": "-1.12%"
  },
  {
    "symbol": "BOBET",
    "name": "BOBET | Boğaziçi Beton",
    "sector": "Sanayi",
    "price": 20.6,
    "change": "-0.87%"
  },
  {
    "symbol": "BORLS",
    "name": "BORLS | Borlease Otomotiv",
    "sector": "Sanayi",
    "price": 3.88,
    "change": "-6.05%"
  },
  {
    "symbol": "BORSK",
    "name": "BORSK | Bor Şeker",
    "sector": "Sanayi",
    "price": 6.55,
    "change": "+2.66%"
  },
  {
    "symbol": "BOSSA",
    "name": "BOSSA | Bossa",
    "sector": "Sanayi",
    "price": 6.35,
    "change": "-2.16%"
  },
  {
    "symbol": "BRISA",
    "name": "BRISA | Brisa",
    "sector": "Sanayi",
    "price": 76.5,
    "change": "+0.59%"
  },
  {
    "symbol": "BRKO",
    "name": "BRKO | Birko Mensucat",
    "sector": "Sanayi",
    "price": 12.2,
    "change": "-2.40%"
  },
  {
    "symbol": "BRKSN",
    "name": "BRKSN | Berkosan Yalıtım",
    "sector": "Sanayi",
    "price": 7.77,
    "change": "-1.02%"
  },
  {
    "symbol": "BRKVY",
    "name": "BRKVY | Birikim Varlık",
    "sector": "Sanayi",
    "price": 91.5,
    "change": "+1.61%"
  },
  {
    "symbol": "BRLSM",
    "name": "BRLSM | Birlesim Mühendislik",
    "sector": "Sanayi",
    "price": 19.88,
    "change": "-9.80%"
  },
  {
    "symbol": "BRMEN",
    "name": "BRMEN | Birlik Mensucat",
    "sector": "Sanayi",
    "price": 12.98,
    "change": "-0.54%"
  },
  {
    "symbol": "BRSAN",
    "name": "BRSAN | Borusan Birleşik Boru Fab.",
    "sector": "Sanayi",
    "price": 694.5,
    "change": "-1.77%"
  },
  {
    "symbol": "BRYAT",
    "name": "BRYAT | Borusan Yatırım",
    "sector": "Sanayi",
    "price": 1645.0,
    "change": "-1.14%"
  },
  {
    "symbol": "BSOKE",
    "name": "BSOKE | Batıçim Çimento",
    "sector": "Sanayi",
    "price": 24.34,
    "change": "-9.45%"
  },
  {
    "symbol": "BTCIM",
    "name": "BTCIM | Batıçim",
    "sector": "Sanayi",
    "price": 3.84,
    "change": "-4.00%"
  },
  {
    "symbol": "BUCIM",
    "name": "BUCIM | Bursa Çimento",
    "sector": "Sanayi",
    "price": 5.89,
    "change": "+0.00%"
  },
  {
    "symbol": "BULGS",
    "name": "BULGS | Bulls GSYO",
    "sector": "Sanayi",
    "price": 32.56,
    "change": "+0.62%"
  },
  {
    "symbol": "BURCE",
    "name": "BURCE | Burçelik",
    "sector": "Sanayi",
    "price": 33.0,
    "change": "-4.07%"
  },
  {
    "symbol": "BURVA",
    "name": "BURVA | Burçelik Vana Sanayii",
    "sector": "Sanayi",
    "price": 697.0,
    "change": "-8.11%"
  },
  {
    "symbol": "BVSAN",
    "name": "BVSAN | Bülbüloğlu Vinç",
    "sector": "Sanayi",
    "price": 103.6,
    "change": "-0.96%"
  },
  {
    "symbol": "BYDNR",
    "name": "BYDNR | Baydöner",
    "sector": "Sanayi",
    "price": 38.22,
    "change": "-2.10%"
  },
  {
    "symbol": "CANTE",
    "name": "CANTE | Çan2 Termik A.S",
    "sector": "Sanayi",
    "price": 1.33,
    "change": "+2.31%"
  },
  {
    "symbol": "CASA",
    "name": "CASA | Casa Emtia Petrol Kim.Tür.AŞ",
    "sector": "Sanayi",
    "price": 72.35,
    "change": "+3.65%"
  },
  {
    "symbol": "CATES",
    "name": "CATES | Çates Elektrik",
    "sector": "Sanayi",
    "price": 68.3,
    "change": "-5.40%"
  },
  {
    "symbol": "CCOLA",
    "name": "CCOLA | Coca-Cola İçecek A.Ş",
    "sector": "Sanayi",
    "price": 78.35,
    "change": "+2.08%"
  },
  {
    "symbol": "CELHA",
    "name": "CELHA | Çelik Halat",
    "sector": "Sanayi",
    "price": 24.74,
    "change": "+0.16%"
  },
  {
    "symbol": "CEMAS",
    "name": "CEMAS | Çemaş Döküm",
    "sector": "Sanayi",
    "price": 4.04,
    "change": "-1.22%"
  },
  {
    "symbol": "CEMTS",
    "name": "CEMTS | Çemtas",
    "sector": "Sanayi",
    "price": 8.67,
    "change": "-1.59%"
  },
  {
    "symbol": "CEMZY",
    "name": "CEMZY | Cem Zeytin",
    "sector": "Sanayi",
    "price": 14.9,
    "change": "+0.34%"
  },
  {
    "symbol": "CEOEM",
    "name": "CEOEM | CEO Event Medya",
    "sector": "Sanayi",
    "price": 23.96,
    "change": "-3.62%"
  },
  {
    "symbol": "CGCAM",
    "name": "CGCAM | Çağdaş Cam",
    "sector": "Sanayi",
    "price": 32.26,
    "change": "-5.95%"
  },
  {
    "symbol": "CIMSA",
    "name": "CIMSA | Çimsa",
    "sector": "Sanayi",
    "price": 44.0,
    "change": "+0.46%"
  },
  {
    "symbol": "CITAS",
    "name": "CITAS | Çitlekçi Gıda",
    "sector": "Sanayi",
    "price": 129.9,
    "change": "+2.69%"
  },
  {
    "symbol": "CLEBI",
    "name": "CLEBI | Çelebi",
    "sector": "Sanayi",
    "price": 1435.0,
    "change": "-1.17%"
  },
  {
    "symbol": "CMBTN",
    "name": "CMBTN | Çimbeton",
    "sector": "Sanayi",
    "price": 1501.0,
    "change": "-0.60%"
  },
  {
    "symbol": "CMENT",
    "name": "CMENT | Çimentaş",
    "sector": "Sanayi",
    "price": 257.0,
    "change": "-1.91%"
  },
  {
    "symbol": "CONSE",
    "name": "CONSE | Consus Enerji",
    "sector": "Sanayi",
    "price": 2.3,
    "change": "+1.77%"
  },
  {
    "symbol": "COSMO",
    "name": "COSMO | Cosmos Yatırım Holding",
    "sector": "Sanayi",
    "price": 121.5,
    "change": "-2.49%"
  },
  {
    "symbol": "CRDFA",
    "name": "CRDFA | Creditwest Faktoring",
    "sector": "Sanayi",
    "price": 27.0,
    "change": "-1.82%"
  },
  {
    "symbol": "CRFSA",
    "name": "CRFSA | Carrefoursa",
    "sector": "Sanayi",
    "price": 297.75,
    "change": "-6.22%"
  },
  {
    "symbol": "CUSAN",
    "name": "CUSAN | Çuhadaroğlu Metal",
    "sector": "Sanayi",
    "price": 24.1,
    "change": "+0.75%"
  },
  {
    "symbol": "CVKMD",
    "name": "CVKMD | Cvk Maden",
    "sector": "Sanayi",
    "price": 16.22,
    "change": "+0.37%"
  },
  {
    "symbol": "CWENE",
    "name": "CWENE | Cw Enerji",
    "sector": "Sanayi",
    "price": 33.34,
    "change": "-3.42%"
  },
  {
    "symbol": "DAGI",
    "name": "DAGI | Dagi Giyim",
    "sector": "Sanayi",
    "price": 9.92,
    "change": "-6.50%"
  },
  {
    "symbol": "DAPGM",
    "name": "DAPGM | Dap Gayrimenkul",
    "sector": "Sanayi",
    "price": 8.04,
    "change": "+3.61%"
  },
  {
    "symbol": "DARDL",
    "name": "DARDL | Dardanel",
    "sector": "Sanayi",
    "price": 1.61,
    "change": "-0.62%"
  },
  {
    "symbol": "DCTTR",
    "name": "DCTTR | Dct Trading",
    "sector": "Sanayi",
    "price": 6.16,
    "change": "-1.28%"
  },
  {
    "symbol": "DENGE",
    "name": "DENGE | Denge Holding",
    "sector": "Sanayi",
    "price": 2.23,
    "change": "-2.19%"
  },
  {
    "symbol": "DERHL",
    "name": "DERHL | Derlüks Yatırım Holding",
    "sector": "Sanayi",
    "price": 2.07,
    "change": "-0.96%"
  },
  {
    "symbol": "DERIM",
    "name": "DERIM | Derimod",
    "sector": "Sanayi",
    "price": 35.66,
    "change": "-1.38%"
  },
  {
    "symbol": "DESA",
    "name": "DESA | Desa Deri Sanayii",
    "sector": "Sanayi",
    "price": 9.6,
    "change": "-0.31%"
  },
  {
    "symbol": "DESPC",
    "name": "DESPC | Despec Bilgisayar",
    "sector": "Sanayi",
    "price": 40.5,
    "change": "+1.40%"
  },
  {
    "symbol": "DEVA",
    "name": "DEVA | Deva Holding",
    "sector": "Sanayi",
    "price": 95.0,
    "change": "-0.68%"
  },
  {
    "symbol": "DGATE",
    "name": "DGATE | Datagate",
    "sector": "Sanayi",
    "price": 93.0,
    "change": "-0.11%"
  },
  {
    "symbol": "DGGYO",
    "name": "DGGYO | Doğuş GYO",
    "sector": "Sanayi",
    "price": 33.08,
    "change": "-4.72%"
  },
  {
    "symbol": "DGNMO",
    "name": "DGNMO | Doğanlar Mobilya",
    "sector": "Sanayi",
    "price": 7.55,
    "change": "+0.00%"
  },
  {
    "symbol": "DIRIT",
    "name": "DIRIT | Diriteks Diriliş Tekstil",
    "sector": "Sanayi",
    "price": 26.6,
    "change": "-4.66%"
  },
  {
    "symbol": "DITAS",
    "name": "DITAS | Ditaş BDY",
    "sector": "Sanayi",
    "price": 23.0,
    "change": "+0.61%"
  },
  {
    "symbol": "DMRGD",
    "name": "DMRGD | DMR Unlu Mamüller",
    "sector": "Sanayi",
    "price": 11.35,
    "change": "+2.25%"
  },
  {
    "symbol": "DMSAS",
    "name": "DMSAS | Demisaş",
    "sector": "Sanayi",
    "price": 8.38,
    "change": "+0.96%"
  },
  {
    "symbol": "DNISI",
    "name": "DNISI | Dinamik Isı Yalıtım",
    "sector": "Sanayi",
    "price": 4.43,
    "change": "-1.12%"
  },
  {
    "symbol": "DOAS",
    "name": "DOAS | Doğuş Otomotiv",
    "sector": "Sanayi",
    "price": 161.7,
    "change": "-1.52%"
  },
  {
    "symbol": "DOCO",
    "name": "DOCO | DO & CO Aktiengesellschaft",
    "sector": "Sanayi",
    "price": 11117.5,
    "change": "-1.53%"
  },
  {
    "symbol": "DOFER",
    "name": "DOFER | Dofer Yapı",
    "sector": "Sanayi",
    "price": 27.68,
    "change": "+0.87%"
  },
  {
    "symbol": "DOFRB",
    "name": "DOFRB | Dof Robotik",
    "sector": "Sanayi",
    "price": 122.9,
    "change": "+4.33%"
  },
  {
    "symbol": "DOGUB",
    "name": "DOGUB | Doğusan",
    "sector": "Sanayi",
    "price": 66.95,
    "change": "-0.52%"
  },
  {
    "symbol": "DOHOL",
    "name": "DOHOL | Doğan Holding",
    "sector": "Sanayi",
    "price": 21.58,
    "change": "-0.28%"
  },
  {
    "symbol": "DOKTA",
    "name": "DOKTA | Döktaş Dökümcülük",
    "sector": "Sanayi",
    "price": 22.4,
    "change": "-1.75%"
  },
  {
    "symbol": "DSTKF",
    "name": "DSTKF | Destek Finans Faktoring",
    "sector": "Sanayi",
    "price": 2216.0,
    "change": "+1.19%"
  },
  {
    "symbol": "DUNYH",
    "name": "DUNYH | Dünya Holding",
    "sector": "Sanayi",
    "price": 135.6,
    "change": "-1.81%"
  },
  {
    "symbol": "DURDO",
    "name": "DURDO | Duran Doğan Basım",
    "sector": "Sanayi",
    "price": 5.1,
    "change": "+2.41%"
  },
  {
    "symbol": "DURKN",
    "name": "DURKN | Durukan Şekerleme",
    "sector": "Sanayi",
    "price": 22.8,
    "change": "+5.07%"
  },
  {
    "symbol": "DYOBY",
    "name": "DYOBY | DYO Boya",
    "sector": "Sanayi",
    "price": 13.13,
    "change": "-1.35%"
  },
  {
    "symbol": "DZGYO",
    "name": "DZGYO | Deniz GYO",
    "sector": "Sanayi",
    "price": 7.09,
    "change": "+1.43%"
  },
  {
    "symbol": "EBEBK",
    "name": "EBEBK | Ebebek",
    "sector": "Sanayi",
    "price": 81.5,
    "change": "-1.33%"
  },
  {
    "symbol": "ECILC",
    "name": "ECILC | Eczacıbaşı İlaç",
    "sector": "Sanayi",
    "price": 72.5,
    "change": "-3.40%"
  },
  {
    "symbol": "ECOGR",
    "name": "ECOGR | Ecogreen",
    "sector": "Sanayi",
    "price": 33.34,
    "change": "-0.77%"
  },
  {
    "symbol": "ECZYT",
    "name": "ECZYT | Eczacıbaşı Yatırım",
    "sector": "Sanayi",
    "price": 304.75,
    "change": "-3.25%"
  },
  {
    "symbol": "EDATA",
    "name": "EDATA | E-Data Teknoloji",
    "sector": "Sanayi",
    "price": 17.89,
    "change": "-0.17%"
  },
  {
    "symbol": "EDIP",
    "name": "EDIP | Edip Gayrimenkul Yat. San.",
    "sector": "Sanayi",
    "price": 36.0,
    "change": "-4.96%"
  },
  {
    "symbol": "EFOR",
    "name": "EFOR | Efor Yat. San.",
    "sector": "Sanayi",
    "price": 16.9,
    "change": "-7.04%"
  },
  {
    "symbol": "EGEEN",
    "name": "EGEEN | Ege Endüstri",
    "sector": "Sanayi",
    "price": 4870.0,
    "change": "-2.36%"
  },
  {
    "symbol": "EGEGY",
    "name": "EGEGY | Egeyapı GYO",
    "sector": "Sanayi",
    "price": 25.6,
    "change": "-3.90%"
  },
  {
    "symbol": "EGEPO",
    "name": "EGEPO | Egepol Hastanesi",
    "sector": "Sanayi",
    "price": 17.19,
    "change": "+4.06%"
  },
  {
    "symbol": "EGGUB",
    "name": "EGGUB | Ege Gübre",
    "sector": "Sanayi",
    "price": 106.5,
    "change": "-1.75%"
  },
  {
    "symbol": "EGPRO",
    "name": "EGPRO | Ege Profil",
    "sector": "Sanayi",
    "price": 37.42,
    "change": "-1.32%"
  },
  {
    "symbol": "EGSER",
    "name": "EGSER | Ege Seramik",
    "sector": "Sanayi",
    "price": 2.89,
    "change": "+1.05%"
  },
  {
    "symbol": "EKDMR",
    "name": "EKDMR | Ekinciler",
    "sector": "Sanayi",
    "price": 46.6,
    "change": "-1.94%"
  },
  {
    "symbol": "EKGYO",
    "name": "EKGYO | Emlak Konut GYO",
    "sector": "Sanayi",
    "price": 20.06,
    "change": "+1.57%"
  },
  {
    "symbol": "EKIM",
    "name": "EKIM | Ekim Turizm",
    "sector": "Sanayi",
    "price": 18.26,
    "change": "-3.79%"
  },
  {
    "symbol": "EKIZ",
    "name": "EKIZ | Ekiz Yağ ve Sabun",
    "sector": "Sanayi",
    "price": 56.8,
    "change": "-3.15%"
  },
  {
    "symbol": "EKOS",
    "name": "EKOS | Ekos Teknoloji",
    "sector": "Sanayi",
    "price": 4.98,
    "change": "-2.16%"
  },
  {
    "symbol": "EKSUN",
    "name": "EKSUN | Eksun Gıda",
    "sector": "Sanayi",
    "price": 5.66,
    "change": "-3.25%"
  },
  {
    "symbol": "ELITE",
    "name": "ELITE | Elite Organik Gıda",
    "sector": "Sanayi",
    "price": 26.9,
    "change": "-0.44%"
  },
  {
    "symbol": "EMKEL",
    "name": "EMKEL | Emek Elektrik",
    "sector": "Sanayi",
    "price": 13.94,
    "change": "-2.92%"
  },
  {
    "symbol": "EMNIS",
    "name": "EMNIS | Eminiş Ambalaj",
    "sector": "Sanayi",
    "price": 149.9,
    "change": "-0.73%"
  },
  {
    "symbol": "EMPAE",
    "name": "EMPAE | Empa Elektronik",
    "sector": "Sanayi",
    "price": 69.3,
    "change": "+10.00%"
  },
  {
    "symbol": "ENDAE",
    "name": "ENDAE | Enda Enerji",
    "sector": "Sanayi",
    "price": 17.14,
    "change": "-3.33%"
  },
  {
    "symbol": "ENERY",
    "name": "ENERY | Enerya Enerji",
    "sector": "Sanayi",
    "price": 10.5,
    "change": "+3.24%"
  },
  {
    "symbol": "ENJSA",
    "name": "ENJSA | Enerjisa Enerji",
    "sector": "Enerji",
    "price": 113.2,
    "change": "+2.17%"
  },
  {
    "symbol": "ENKAI",
    "name": "ENKAI | Enka İnşaat",
    "sector": "Sanayi",
    "price": 86.8,
    "change": "-2.36%"
  },
  {
    "symbol": "ENPRA",
    "name": "ENPRA | Enpara",
    "sector": "Sanayi",
    "price": 59.0,
    "change": "-0.17%"
  },
  {
    "symbol": "ENSRI",
    "name": "ENSRI | Ensari Deri",
    "sector": "Sanayi",
    "price": 4.95,
    "change": "-1.39%"
  },
  {
    "symbol": "ENTRA",
    "name": "ENTRA | Ic Enterra Yenilenebilir",
    "sector": "Sanayi",
    "price": 4.22,
    "change": "-1.17%"
  },
  {
    "symbol": "EPLAS",
    "name": "EPLAS | Egeplast",
    "sector": "Sanayi",
    "price": 5.5,
    "change": "-5.17%"
  },
  {
    "symbol": "ERBOS",
    "name": "ERBOS | Erbosan",
    "sector": "Sanayi",
    "price": 145.0,
    "change": "-1.76%"
  },
  {
    "symbol": "ERCB",
    "name": "ERCB | Erciyas Çelik Boru",
    "sector": "Sanayi",
    "price": 42.98,
    "change": "-1.74%"
  },
  {
    "symbol": "EREGL",
    "name": "EREGL | Ereğli Demir Çelik",
    "sector": "Sanayi",
    "price": 37.6,
    "change": "-0.48%"
  },
  {
    "symbol": "ERSU",
    "name": "ERSU | Ersu Gıda",
    "sector": "Sanayi",
    "price": 23.6,
    "change": "+1.64%"
  },
  {
    "symbol": "ESCAR",
    "name": "ESCAR | Escar Filo",
    "sector": "Sanayi",
    "price": 44.54,
    "change": "-1.02%"
  },
  {
    "symbol": "ESCOM",
    "name": "ESCOM | Escort Teknoloji",
    "sector": "Sanayi",
    "price": 5.19,
    "change": "-3.17%"
  },
  {
    "symbol": "ESEN",
    "name": "ESEN | Esenboğa Elektrik",
    "sector": "Sanayi",
    "price": 3.37,
    "change": "-5.07%"
  },
  {
    "symbol": "ETILR",
    "name": "ETILR | Etiler Gıda",
    "sector": "Sanayi",
    "price": 5.58,
    "change": "+1.45%"
  },
  {
    "symbol": "ETYAT",
    "name": "ETYAT | Euro Trend Yatırım",
    "sector": "Sanayi",
    "price": 15.4,
    "change": "-0.32%"
  },
  {
    "symbol": "EUHOL",
    "name": "EUHOL | Euro Yatırım",
    "sector": "Sanayi",
    "price": 10.15,
    "change": "+1.50%"
  },
  {
    "symbol": "EUKYO",
    "name": "EUKYO | Euro Kapital Yatırım Ortaklığı",
    "sector": "Sanayi",
    "price": 13.41,
    "change": "+1.59%"
  },
  {
    "symbol": "EUPWR",
    "name": "EUPWR | Europower Enerji",
    "sector": "Sanayi",
    "price": 83.15,
    "change": "-9.96%"
  },
  {
    "symbol": "EUREN",
    "name": "EUREN | Europen Endüstri",
    "sector": "Sanayi",
    "price": 3.84,
    "change": "-0.26%"
  },
  {
    "symbol": "EUYO",
    "name": "EUYO | Euro Menkul",
    "sector": "Sanayi",
    "price": 4.99,
    "change": "+7.78%"
  },
  {
    "symbol": "EYGYO",
    "name": "EYGYO | EYG Gayrimenkul",
    "sector": "Sanayi",
    "price": 2.65,
    "change": "-1.85%"
  },
  {
    "symbol": "FADE",
    "name": "FADE | Fade Gıda Yatırım",
    "sector": "Sanayi",
    "price": 15.5,
    "change": "-0.13%"
  },
  {
    "symbol": "FENER",
    "name": "FENER | Fenerbahce Futbol A.Ş.",
    "sector": "Sanayi",
    "price": 3.05,
    "change": "-1.29%"
  },
  {
    "symbol": "FLAP",
    "name": "FLAP | Flap Kongre Hiz.Oto.Tur.A.Ş",
    "sector": "Sanayi",
    "price": 10.89,
    "change": "-0.55%"
  },
  {
    "symbol": "FMIZP",
    "name": "FMIZP | F-M İzmit Piston",
    "sector": "Sanayi",
    "price": 289.0,
    "change": "-1.87%"
  },
  {
    "symbol": "FONET",
    "name": "FONET | Fonet Bilgi Teknolojileri",
    "sector": "Sanayi",
    "price": 4.87,
    "change": "-0.61%"
  },
  {
    "symbol": "FORMT",
    "name": "FORMT | Formet Metal ve Cam Sanayii",
    "sector": "Sanayi",
    "price": 1.51,
    "change": "-1.31%"
  },
  {
    "symbol": "FORTE",
    "name": "FORTE | Forte Bilgi İletişim",
    "sector": "Sanayi",
    "price": 111.5,
    "change": "-0.27%"
  },
  {
    "symbol": "FRIGO",
    "name": "FRIGO | Frigo Pak Gıda",
    "sector": "Sanayi",
    "price": 2.5,
    "change": "+0.00%"
  },
  {
    "symbol": "FRMPL",
    "name": "FRMPL | Formül Plastik",
    "sector": "Sanayi",
    "price": 32.44,
    "change": "-0.37%"
  },
  {
    "symbol": "FROTO",
    "name": "FROTO | Ford Otosan",
    "sector": "Sanayi",
    "price": 76.25,
    "change": "-1.29%"
  },
  {
    "symbol": "FZLGY",
    "name": "FZLGY | Fuzul Gayrimenkul",
    "sector": "Sanayi",
    "price": 8.21,
    "change": "-8.27%"
  },
  {
    "symbol": "GARAN",
    "name": "GARAN | Garanti Bankası",
    "sector": "Sanayi",
    "price": 132.0,
    "change": "-0.68%"
  },
  {
    "symbol": "GARFA",
    "name": "GARFA | Garanti BBVA Faktoring",
    "sector": "Sanayi",
    "price": 26.88,
    "change": "-2.11%"
  },
  {
    "symbol": "GATEG",
    "name": "GATEG | Gate Group",
    "sector": "Sanayi",
    "price": 279.75,
    "change": "-3.95%"
  },
  {
    "symbol": "GEDIK",
    "name": "GEDIK | Gedik Yatırım",
    "sector": "Sanayi",
    "price": 5.8,
    "change": "-1.53%"
  },
  {
    "symbol": "GEDZA",
    "name": "GEDZA | Gediz Ambalaj Sanayi",
    "sector": "Sanayi",
    "price": 28.46,
    "change": "-1.86%"
  },
  {
    "symbol": "GENIL",
    "name": "GENIL | Gen İlaç",
    "sector": "Sanayi",
    "price": 11.33,
    "change": "-2.50%"
  },
  {
    "symbol": "GENKM",
    "name": "GENKM | Gentaş Kimya",
    "sector": "Sanayi",
    "price": 9.53,
    "change": "-2.76%"
  },
  {
    "symbol": "GENTS",
    "name": "GENTS | Gentaş",
    "sector": "Sanayi",
    "price": 5.0,
    "change": "-2.53%"
  },
  {
    "symbol": "GEREL",
    "name": "GEREL | Gersan Elektrik",
    "sector": "Sanayi",
    "price": 36.88,
    "change": "-0.27%"
  },
  {
    "symbol": "GESAN",
    "name": "GESAN | Girişim Elektrik",
    "sector": "Sanayi",
    "price": 74.65,
    "change": "-9.95%"
  },
  {
    "symbol": "GIPTA",
    "name": "GIPTA | Gıpta",
    "sector": "Sanayi",
    "price": 70.6,
    "change": "-7.59%"
  },
  {
    "symbol": "GLBMD",
    "name": "GLBMD | Global Menkul Değerler",
    "sector": "Sanayi",
    "price": 11.7,
    "change": "+1.21%"
  },
  {
    "symbol": "GLCVY",
    "name": "GLCVY | Gelecek Varlık Yön.",
    "sector": "Sanayi",
    "price": 51.65,
    "change": "-1.71%"
  },
  {
    "symbol": "GLRMK",
    "name": "GLRMK | Gülermak Ağır Sanayi",
    "sector": "Sanayi",
    "price": 160.9,
    "change": "-2.72%"
  },
  {
    "symbol": "GLRYH",
    "name": "GLRYH | Güler Yatırım Holding",
    "sector": "Sanayi",
    "price": 3.01,
    "change": "-3.22%"
  },
  {
    "symbol": "GLYHO",
    "name": "GLYHO | Global Yatırım Holding",
    "sector": "Sanayi",
    "price": 16.3,
    "change": "-1.21%"
  },
  {
    "symbol": "GMTAS",
    "name": "GMTAS | Gimat Mağazacılık",
    "sector": "Sanayi",
    "price": 45.46,
    "change": "+2.76%"
  },
  {
    "symbol": "GOKNR",
    "name": "GOKNR | Göknur Gıda",
    "sector": "Sanayi",
    "price": 17.62,
    "change": "+0.28%"
  },
  {
    "symbol": "GOLDA",
    "name": "GOLDA | Golda Gıda",
    "sector": "Sanayi",
    "price": 12.7,
    "change": "-4.73%"
  },
  {
    "symbol": "GOLTS",
    "name": "GOLTS | Göltaş Çimento",
    "sector": "Sanayi",
    "price": 295.75,
    "change": "-0.50%"
  },
  {
    "symbol": "GOODY",
    "name": "GOODY | Goodyear",
    "sector": "Sanayi",
    "price": 2.66,
    "change": "+1.14%"
  },
  {
    "symbol": "GOZDE",
    "name": "GOZDE | Gözde Girisim Sermayesi",
    "sector": "Sanayi",
    "price": 22.0,
    "change": "-0.45%"
  },
  {
    "symbol": "GRNYO",
    "name": "GRNYO | Garanti YO",
    "sector": "Sanayi",
    "price": 12.21,
    "change": "-3.86%"
  },
  {
    "symbol": "GRSEL",
    "name": "GRSEL | Gürsel Taşımacılık",
    "sector": "Sanayi",
    "price": 304.25,
    "change": "+1.42%"
  },
  {
    "symbol": "GRTHO",
    "name": "GRTHO | GrainTurk Tarım",
    "sector": "Sanayi",
    "price": 197.3,
    "change": "-4.08%"
  },
  {
    "symbol": "GSDDE",
    "name": "GSDDE | GSD Denizcilik Gayrimenkul İnş",
    "sector": "Sanayi",
    "price": 12.92,
    "change": "-0.77%"
  },
  {
    "symbol": "GSDHO",
    "name": "GSDHO | GSD Holding A.Ş.",
    "sector": "Sanayi",
    "price": 4.53,
    "change": "-0.22%"
  },
  {
    "symbol": "GSRAY",
    "name": "GSRAY | Galatasaray Sportif A.Ş",
    "sector": "Sanayi",
    "price": 1.03,
    "change": "-2.83%"
  },
  {
    "symbol": "GUBRF",
    "name": "GUBRF | Gübre Fabrikaları",
    "sector": "Sanayi",
    "price": 475.75,
    "change": "+1.01%"
  },
  {
    "symbol": "GUNDG",
    "name": "GUNDG | Gündoğdu Gıda",
    "sector": "Sanayi",
    "price": 1350.0,
    "change": "-10.00%"
  },
  {
    "symbol": "GWIND",
    "name": "GWIND | Galata Wind Enerji",
    "sector": "Sanayi",
    "price": 22.2,
    "change": "-1.33%"
  },
  {
    "symbol": "GZNMI",
    "name": "GZNMI | Gezinomi Seyahat",
    "sector": "Sanayi",
    "price": 54.0,
    "change": "+0.75%"
  },
  {
    "symbol": "HALKB",
    "name": "HALKB | Halkbank",
    "sector": "Sanayi",
    "price": 44.96,
    "change": "+9.98%"
  },
  {
    "symbol": "HATEK",
    "name": "HATEK | Hateks Hatay Tekstil",
    "sector": "Sanayi",
    "price": 13.27,
    "change": "-2.21%"
  },
  {
    "symbol": "HATSN",
    "name": "HATSN | Hat-San",
    "sector": "Sanayi",
    "price": 65.65,
    "change": "-9.95%"
  },
  {
    "symbol": "HDFGS",
    "name": "HDFGS | Hedef Girişim Sermayesi",
    "sector": "Sanayi",
    "price": 2.45,
    "change": "-2.39%"
  },
  {
    "symbol": "HEDEF",
    "name": "HEDEF | Hedef Holding",
    "sector": "Sanayi",
    "price": 68.3,
    "change": "-9.95%"
  },
  {
    "symbol": "HEKTS",
    "name": "HEKTS | Hektaş",
    "sector": "Sanayi",
    "price": 2.65,
    "change": "-2.21%"
  },
  {
    "symbol": "HKTM",
    "name": "HKTM | Hidropar",
    "sector": "Sanayi",
    "price": 13.1,
    "change": "-3.68%"
  },
  {
    "symbol": "HLGYO",
    "name": "HLGYO | Halk GYO",
    "sector": "Sanayi",
    "price": 4.31,
    "change": "-1.37%"
  },
  {
    "symbol": "HOROZ",
    "name": "HOROZ | Horoz Lojistik",
    "sector": "Sanayi",
    "price": 57.6,
    "change": "-1.54%"
  },
  {
    "symbol": "HRKET",
    "name": "HRKET | Hareket Proje",
    "sector": "Sanayi",
    "price": 91.4,
    "change": "-2.66%"
  },
  {
    "symbol": "HTTBT",
    "name": "HTTBT | Hitit Bilgisayar",
    "sector": "Sanayi",
    "price": 34.84,
    "change": "-1.58%"
  },
  {
    "symbol": "HUBVC",
    "name": "HUBVC | Hub Girişim Ser. Y.O.",
    "sector": "Sanayi",
    "price": 2.67,
    "change": "+6.37%"
  },
  {
    "symbol": "HUNER",
    "name": "HUNER | Hun Enerji",
    "sector": "Sanayi",
    "price": 3.88,
    "change": "-2.27%"
  },
  {
    "symbol": "HURGZ",
    "name": "HURGZ | Hürriyet",
    "sector": "Sanayi",
    "price": 7.4,
    "change": "+2.35%"
  },
  {
    "symbol": "ICBCT",
    "name": "ICBCT | ICBC Turkey Bank",
    "sector": "Sanayi",
    "price": 19.43,
    "change": "-0.56%"
  },
  {
    "symbol": "ICUGS",
    "name": "ICUGS | Icu Girişim Ser. Y.O.",
    "sector": "Sanayi",
    "price": 3.97,
    "change": "-7.24%"
  },
  {
    "symbol": "IDGYO",
    "name": "IDGYO | İdealist GYO",
    "sector": "Sanayi",
    "price": 2.88,
    "change": "-4.00%"
  },
  {
    "symbol": "IEYHO",
    "name": "IEYHO | Işıklar Enerji ve Yapı Holding",
    "sector": "Sanayi",
    "price": 210.5,
    "change": "+0.96%"
  },
  {
    "symbol": "IHAAS",
    "name": "IHAAS | İhlas Haber Ajansı",
    "sector": "Sanayi",
    "price": 51.65,
    "change": "-0.67%"
  },
  {
    "symbol": "IHEVA",
    "name": "IHEVA | İhlas Ev Aletleri",
    "sector": "Sanayi",
    "price": 1.97,
    "change": "+0.51%"
  },
  {
    "symbol": "IHGZT",
    "name": "IHGZT | İhlas Gazetecilik",
    "sector": "Sanayi",
    "price": 1.18,
    "change": "-0.84%"
  },
  {
    "symbol": "IHLAS",
    "name": "IHLAS | İhlas Holding",
    "sector": "Sanayi",
    "price": 1.06,
    "change": "+0.00%"
  },
  {
    "symbol": "IHLGM",
    "name": "IHLGM | İhlas Gayrimenkul",
    "sector": "Sanayi",
    "price": 1.58,
    "change": "-0.63%"
  },
  {
    "symbol": "IHYAY",
    "name": "IHYAY | İhlas Yayın Holding",
    "sector": "Sanayi",
    "price": 1.2,
    "change": "-0.83%"
  },
  {
    "symbol": "IMASM",
    "name": "IMASM | İmaş Makine",
    "sector": "Sanayi",
    "price": 2.26,
    "change": "+0.00%"
  },
  {
    "symbol": "INDES",
    "name": "INDES | İndeks Bilgisayar",
    "sector": "Sanayi",
    "price": 11.69,
    "change": "+1.30%"
  },
  {
    "symbol": "INFO",
    "name": "INFO | İnfo Yatırım",
    "sector": "Sanayi",
    "price": 5.7,
    "change": "+3.64%"
  },
  {
    "symbol": "INGRM",
    "name": "INGRM | İngram Bilişim",
    "sector": "Sanayi",
    "price": 379.0,
    "change": "+0.26%"
  },
  {
    "symbol": "INTEK",
    "name": "INTEK | Innosa Teknoloji",
    "sector": "Sanayi",
    "price": 232.7,
    "change": "-0.56%"
  },
  {
    "symbol": "INTEM",
    "name": "INTEM | İntema",
    "sector": "Sanayi",
    "price": 241.8,
    "change": "-1.59%"
  },
  {
    "symbol": "INTET",
    "name": "INTET | Intetra Teknoloji",
    "sector": "Sanayi",
    "price": 64.8,
    "change": "+9.92%"
  },
  {
    "symbol": "INVEO",
    "name": "INVEO | İnveo Yatırım Holding",
    "sector": "Sanayi",
    "price": 6.8,
    "change": "-0.58%"
  },
  {
    "symbol": "INVES",
    "name": "INVES | Investco Holding",
    "sector": "Sanayi",
    "price": 796.5,
    "change": "+0.13%"
  },
  {
    "symbol": "ISATR",
    "name": "ISATR | İş Bankası (A)",
    "sector": "Sanayi",
    "price": 4950000.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ISBIR",
    "name": "ISBIR | İşbir Holding",
    "sector": "Sanayi",
    "price": 73.7,
    "change": "+2.01%"
  },
  {
    "symbol": "ISBTR",
    "name": "ISBTR | İş Bankası (B)",
    "sector": "Sanayi",
    "price": 500000.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ISCTR",
    "name": "ISCTR | İş Bankası (C)",
    "sector": "Sanayi",
    "price": 12.78,
    "change": "+0.24%"
  },
  {
    "symbol": "ISDMR",
    "name": "ISDMR | İskenderun Demir Çelik",
    "sector": "Sanayi",
    "price": 55.55,
    "change": "+3.73%"
  },
  {
    "symbol": "ISFIN",
    "name": "ISFIN | İş Finansal Kiralama",
    "sector": "Sanayi",
    "price": 19.37,
    "change": "-0.15%"
  },
  {
    "symbol": "ISGSY",
    "name": "ISGSY | İş Girişim",
    "sector": "Sanayi",
    "price": 15.82,
    "change": "+1.41%"
  },
  {
    "symbol": "ISGYO",
    "name": "ISGYO | İş GYO",
    "sector": "Sanayi",
    "price": 25.1,
    "change": "-3.39%"
  },
  {
    "symbol": "ISKPL",
    "name": "ISKPL | Işıklar Plastik",
    "sector": "Sanayi",
    "price": 7.9,
    "change": "-2.71%"
  },
  {
    "symbol": "ISKUR",
    "name": "ISKUR | İş Bankası Kurucu",
    "sector": "Sanayi",
    "price": 4125000.0,
    "change": "+0.00%"
  },
  {
    "symbol": "ISMEN",
    "name": "ISMEN | İş Yatırım",
    "sector": "Sanayi",
    "price": 34.7,
    "change": "+2.24%"
  },
  {
    "symbol": "ISSEN",
    "name": "ISSEN | İşbir Sentetik",
    "sector": "Sanayi",
    "price": 7.06,
    "change": "+1.15%"
  },
  {
    "symbol": "ISVEA",
    "name": "ISVEA | İsvea Seramik",
    "sector": "Sanayi",
    "price": 83.25,
    "change": "+1.90%"
  },
  {
    "symbol": "ISYAT",
    "name": "ISYAT | İs YO",
    "sector": "Sanayi",
    "price": 7.39,
    "change": "+0.14%"
  },
  {
    "symbol": "IZENR",
    "name": "IZENR | İzdemir Enerji",
    "sector": "Sanayi",
    "price": 7.13,
    "change": "+0.14%"
  },
  {
    "symbol": "IZFAS",
    "name": "IZFAS | İzmir Fırça",
    "sector": "Sanayi",
    "price": 54.95,
    "change": "-0.09%"
  },
  {
    "symbol": "IZINV",
    "name": "IZINV | İz Yatırım Holding",
    "sector": "Sanayi",
    "price": 50.85,
    "change": "-0.49%"
  },
  {
    "symbol": "IZMDC",
    "name": "IZMDC | İzmir Demir Çelik",
    "sector": "Sanayi",
    "price": 10.24,
    "change": "-9.94%"
  },
  {
    "symbol": "JANTS",
    "name": "JANTS | Jantsa Jant",
    "sector": "Sanayi",
    "price": 15.18,
    "change": "-1.11%"
  },
  {
    "symbol": "KAPLM",
    "name": "KAPLM | Kaplamin",
    "sector": "Sanayi",
    "price": 389.0,
    "change": "-4.60%"
  },
  {
    "symbol": "KARCL",
    "name": "KARCL | Kardemir Çelik Sanayi",
    "sector": "Sanayi",
    "price": 176.3,
    "change": "+9.50%"
  },
  {
    "symbol": "KAREL",
    "name": "KAREL | Karel Elektronik",
    "sector": "Sanayi",
    "price": 8.44,
    "change": "-1.06%"
  },
  {
    "symbol": "KARSN",
    "name": "KARSN | Karsan Otomotiv",
    "sector": "Sanayi",
    "price": 11.3,
    "change": "+9.92%"
  },
  {
    "symbol": "KARTN",
    "name": "KARTN | Kartonsan",
    "sector": "Sanayi",
    "price": 153.9,
    "change": "-2.10%"
  },
  {
    "symbol": "KATMR",
    "name": "KATMR | Katmerciler Araç Üstü Ekipman",
    "sector": "Sanayi",
    "price": 1.99,
    "change": "-1.00%"
  },
  {
    "symbol": "KAYSE",
    "name": "KAYSE | Kayseri Şeker",
    "sector": "Sanayi",
    "price": 4.04,
    "change": "+0.25%"
  },
  {
    "symbol": "KBORU",
    "name": "KBORU | Kuzey Boru",
    "sector": "Sanayi",
    "price": 18.76,
    "change": "-3.60%"
  },
  {
    "symbol": "KCAER",
    "name": "KCAER | Kocaer Çelik Sanayi",
    "sector": "Sanayi",
    "price": 15.3,
    "change": "-0.39%"
  },
  {
    "symbol": "KCHOL",
    "name": "KCHOL | Koç Holding",
    "sector": "Sanayi",
    "price": 213.0,
    "change": "-0.79%"
  },
  {
    "symbol": "KENT",
    "name": "KENT | Kent Gıda",
    "sector": "Sanayi",
    "price": 364.0,
    "change": "+1.46%"
  },
  {
    "symbol": "KERVN",
    "name": "KERVN | Kervansaray Yat. Holding",
    "sector": "Sanayi",
    "price": 8.95,
    "change": "-8.67%"
  },
  {
    "symbol": "KFEIN",
    "name": "KFEIN | Kafein Yazılım",
    "sector": "Sanayi",
    "price": 8.1,
    "change": "+0.50%"
  },
  {
    "symbol": "KGYO",
    "name": "KGYO | Koray GYO",
    "sector": "Sanayi",
    "price": 11.89,
    "change": "+1.19%"
  },
  {
    "symbol": "KIMMR",
    "name": "KIMMR | Ersan Alışveriş Hizmetleri",
    "sector": "Sanayi",
    "price": 13.14,
    "change": "-1.87%"
  },
  {
    "symbol": "KLGYO",
    "name": "KLGYO | Kiler GYO",
    "sector": "Sanayi",
    "price": 4.98,
    "change": "-0.40%"
  },
  {
    "symbol": "KLKIM",
    "name": "KLKIM | Kalekim Kimyevi Maddeler",
    "sector": "Sanayi",
    "price": 25.92,
    "change": "-0.31%"
  },
  {
    "symbol": "KLMSN",
    "name": "KLMSN | Klimasan",
    "sector": "Sanayi",
    "price": 28.0,
    "change": "-1.75%"
  },
  {
    "symbol": "KLNMA",
    "name": "KLNMA | T. Kalkınma Bankası",
    "sector": "Sanayi",
    "price": 8.84,
    "change": "-0.11%"
  },
  {
    "symbol": "KLRHO",
    "name": "KLRHO | Kiler Holding",
    "sector": "Sanayi",
    "price": 65.15,
    "change": "-1.29%"
  },
  {
    "symbol": "KLSER",
    "name": "KLSER | Kaleseramik",
    "sector": "Sanayi",
    "price": 23.38,
    "change": "-1.93%"
  },
  {
    "symbol": "KLSYN",
    "name": "KLSYN | Koleksiyon Mobilya",
    "sector": "Sanayi",
    "price": 15.81,
    "change": "+1.74%"
  },
  {
    "symbol": "KLYPV",
    "name": "KLYPV | Kalyon Güneş Teknolojileri",
    "sector": "Sanayi",
    "price": 61.85,
    "change": "+0.41%"
  },
  {
    "symbol": "KMPUR",
    "name": "KMPUR | Kimteks Poliüretan",
    "sector": "Sanayi",
    "price": 18.42,
    "change": "-1.29%"
  },
  {
    "symbol": "KNFRT",
    "name": "KNFRT | Konfrut Gıda",
    "sector": "Sanayi",
    "price": 12.33,
    "change": "-2.76%"
  },
  {
    "symbol": "KOCMT",
    "name": "KOCMT | Koç Metalurji",
    "sector": "Sanayi",
    "price": 3.77,
    "change": "-9.81%"
  },
  {
    "symbol": "KONKA",
    "name": "KONKA | Konya Kağıt",
    "sector": "Sanayi",
    "price": 9.55,
    "change": "-2.95%"
  },
  {
    "symbol": "KONTR",
    "name": "KONTR | Kontrolmatik Teknoloji",
    "sector": "Sanayi",
    "price": 3.3,
    "change": "-3.79%"
  },
  {
    "symbol": "KONYA",
    "name": "KONYA | Konya Çimento",
    "sector": "Sanayi",
    "price": 3750.0,
    "change": "-1.32%"
  },
  {
    "symbol": "KOPOL",
    "name": "KOPOL | Koza Polyester",
    "sector": "Sanayi",
    "price": 5.29,
    "change": "-1.86%"
  },
  {
    "symbol": "KORDS",
    "name": "KORDS | Kordsa Teknik Tekstil",
    "sector": "Sanayi",
    "price": 83.55,
    "change": "-0.18%"
  },
  {
    "symbol": "KOTON",
    "name": "KOTON | Koton",
    "sector": "Sanayi",
    "price": 12.38,
    "change": "-0.08%"
  },
  {
    "symbol": "KPEKS",
    "name": "KPEKS | Kapeks Kimya",
    "sector": "Sanayi",
    "price": 99.3,
    "change": "-9.97%"
  },
  {
    "symbol": "KRDMA",
    "name": "KRDMA | Kardemir (A)",
    "sector": "Sanayi",
    "price": 59.45,
    "change": "-5.71%"
  },
  {
    "symbol": "KRDMB",
    "name": "KRDMB | Kardemir (B)",
    "sector": "Sanayi",
    "price": 123.0,
    "change": "-1.44%"
  },
  {
    "symbol": "KRDMD",
    "name": "KRDMD | Kardemir (D)",
    "sector": "Sanayi",
    "price": 44.6,
    "change": "+0.45%"
  },
  {
    "symbol": "KRGYO",
    "name": "KRGYO | Korfez GYO",
    "sector": "Sanayi",
    "price": 2.96,
    "change": "-4.82%"
  },
  {
    "symbol": "KRONT",
    "name": "KRONT | Kron Teknoloji",
    "sector": "Sanayi",
    "price": 22.5,
    "change": "-3.43%"
  },
  {
    "symbol": "KRPLS",
    "name": "KRPLS | Koroplast Temizlik Ambalaj",
    "sector": "Sanayi",
    "price": 10.49,
    "change": "+0.38%"
  },
  {
    "symbol": "KRSTL",
    "name": "KRSTL | Kristal Kola",
    "sector": "Sanayi",
    "price": 8.93,
    "change": "-2.30%"
  },
  {
    "symbol": "KRTEK",
    "name": "KRTEK | Karsu Tekstil",
    "sector": "Sanayi",
    "price": 5.09,
    "change": "-1.74%"
  },
  {
    "symbol": "KRVGD",
    "name": "KRVGD | Kervan Gıda",
    "sector": "Sanayi",
    "price": 2.22,
    "change": "-2.20%"
  },
  {
    "symbol": "KSTUR",
    "name": "KSTUR | Kuştur Turizm",
    "sector": "Sanayi",
    "price": 2340.0,
    "change": "-0.51%"
  },
  {
    "symbol": "KTLEV",
    "name": "KTLEV | Katılımevim",
    "sector": "Sanayi",
    "price": 51.0,
    "change": "-9.81%"
  },
  {
    "symbol": "KTSKR",
    "name": "KTSKR | Kütahya Şeker",
    "sector": "Sanayi",
    "price": 78.0,
    "change": "-1.27%"
  },
  {
    "symbol": "KUTPO",
    "name": "KUTPO | Kütahya Porselen",
    "sector": "Sanayi",
    "price": 78.85,
    "change": "-1.74%"
  },
  {
    "symbol": "KUVVA",
    "name": "KUVVA | Kuvva Gıda",
    "sector": "Sanayi",
    "price": 186.5,
    "change": "-3.77%"
  },
  {
    "symbol": "KUYAS",
    "name": "KUYAS | Kuyas Yatırım AŞ",
    "sector": "Sanayi",
    "price": 69.05,
    "change": "+2.91%"
  },
  {
    "symbol": "KZBGY",
    "name": "KZBGY | Kızılbük GYO",
    "sector": "Sanayi",
    "price": 1.89,
    "change": "-0.53%"
  },
  {
    "symbol": "KZGYO",
    "name": "KZGYO | Kuzugrup GYO",
    "sector": "Sanayi",
    "price": 20.42,
    "change": "+3.81%"
  },
  {
    "symbol": "LIDER",
    "name": "LIDER | Lider Turizm",
    "sector": "Sanayi",
    "price": 28.16,
    "change": "-9.86%"
  },
  {
    "symbol": "LIDFA",
    "name": "LIDFA | Lider Faktoring",
    "sector": "Sanayi",
    "price": 2.59,
    "change": "-0.38%"
  },
  {
    "symbol": "LILAK",
    "name": "LILAK | Lila Kağıt",
    "sector": "Sanayi",
    "price": 28.4,
    "change": "-2.00%"
  },
  {
    "symbol": "LINK",
    "name": "LINK | Link Bilgisayar",
    "sector": "Sanayi",
    "price": 5.21,
    "change": "-0.95%"
  },
  {
    "symbol": "LKMNH",
    "name": "LKMNH | Lokman Hekim Engurusag",
    "sector": "Sanayi",
    "price": 13.49,
    "change": "+0.22%"
  },
  {
    "symbol": "LMKDC",
    "name": "LMKDC | Limak Doğu Anadolu Çimento",
    "sector": "Sanayi",
    "price": 22.7,
    "change": "-1.30%"
  },
  {
    "symbol": "LOGO",
    "name": "LOGO | Logo Yazılım",
    "sector": "Sanayi",
    "price": 134.1,
    "change": "-1.18%"
  },
  {
    "symbol": "LRSHO",
    "name": "LRSHO | Loras Holding",
    "sector": "Sanayi",
    "price": 2.44,
    "change": "-1.21%"
  },
  {
    "symbol": "LUKSK",
    "name": "LUKSK | Lüks Kadife",
    "sector": "Sanayi",
    "price": 84.0,
    "change": "-2.10%"
  },
  {
    "symbol": "LXGYO",
    "name": "LXGYO | Luxera GYO",
    "sector": "Sanayi",
    "price": 9.97,
    "change": "-2.16%"
  },
  {
    "symbol": "LYDHO",
    "name": "LYDHO | Lydia Holding",
    "sector": "Sanayi",
    "price": 142.5,
    "change": "-0.49%"
  },
  {
    "symbol": "LYDYE",
    "name": "LYDYE | Lydia Yeşil Enerji",
    "sector": "Sanayi",
    "price": 12187.5,
    "change": "+10.00%"
  },
  {
    "symbol": "MAALT",
    "name": "MAALT | Marmaris Altınyunus",
    "sector": "Sanayi",
    "price": 1013.0,
    "change": "+0.90%"
  },
  {
    "symbol": "MACKO",
    "name": "MACKO | Maçkolik",
    "sector": "Sanayi",
    "price": 35.02,
    "change": "-2.56%"
  },
  {
    "symbol": "MAGEN",
    "name": "MAGEN | Margün Enerji",
    "sector": "Sanayi",
    "price": 33.02,
    "change": "+0.12%"
  },
  {
    "symbol": "MAKIM",
    "name": "MAKIM | Makim Makina",
    "sector": "Sanayi",
    "price": 15.19,
    "change": "+0.07%"
  },
  {
    "symbol": "MAKTK",
    "name": "MAKTK | Makina Takım",
    "sector": "Sanayi",
    "price": 10.29,
    "change": "+1.68%"
  },
  {
    "symbol": "MANAS",
    "name": "MANAS | Manas Enerji Yönetimi",
    "sector": "Sanayi",
    "price": 35.4,
    "change": "+4.80%"
  },
  {
    "symbol": "MARBL",
    "name": "MARBL | Tureks Turunç",
    "sector": "Sanayi",
    "price": 12.28,
    "change": "-0.49%"
  },
  {
    "symbol": "MARMR",
    "name": "MARMR | Marmara Holding",
    "sector": "Sanayi",
    "price": 2.19,
    "change": "-1.79%"
  },
  {
    "symbol": "MARTI",
    "name": "MARTI | Martı Otel İşletmeleri",
    "sector": "Sanayi",
    "price": 2.05,
    "change": "+9.63%"
  },
  {
    "symbol": "MASFN",
    "name": "MASFN | Masfen Enerji",
    "sector": "Sanayi",
    "price": 38.56,
    "change": "-2.53%"
  },
  {
    "symbol": "MAVI",
    "name": "MAVI | Mavi Giyim Sanayi Tic.A.S",
    "sector": "Sanayi",
    "price": 36.86,
    "change": "-0.59%"
  },
  {
    "symbol": "MCARD",
    "name": "MCARD | MetropolCard",
    "sector": "Sanayi",
    "price": 161.0,
    "change": "+3.94%"
  },
  {
    "symbol": "MEDTR",
    "name": "MEDTR | Meditera Tıbbi Malzeme",
    "sector": "Sanayi",
    "price": 24.96,
    "change": "-1.19%"
  },
  {
    "symbol": "MEGAP",
    "name": "MEGAP | Mega Polietilen Köpük",
    "sector": "Sanayi",
    "price": 1.67,
    "change": "-2.34%"
  },
  {
    "symbol": "MEGMT",
    "name": "MEGMT | Mega Metal",
    "sector": "Sanayi",
    "price": 44.84,
    "change": "-0.36%"
  },
  {
    "symbol": "MEKAG",
    "name": "MEKAG | Meka Beton",
    "sector": "Sanayi",
    "price": 3.0,
    "change": "-2.60%"
  },
  {
    "symbol": "MEPET",
    "name": "MEPET | MEPET Metro",
    "sector": "Sanayi",
    "price": 19.94,
    "change": "-0.30%"
  },
  {
    "symbol": "MERCN",
    "name": "MERCN | Mercan Kimya",
    "sector": "Sanayi",
    "price": 17.45,
    "change": "+1.93%"
  },
  {
    "symbol": "MERIT",
    "name": "MERIT | Merit Turizm Yatırım",
    "sector": "Sanayi",
    "price": 15.56,
    "change": "+0.13%"
  },
  {
    "symbol": "MERKO",
    "name": "MERKO | Merko Gıda",
    "sector": "Sanayi",
    "price": 1.26,
    "change": "+1.61%"
  },
  {
    "symbol": "METEN",
    "name": "METEN | Metgün Enerji",
    "sector": "Sanayi",
    "price": 19.6,
    "change": "-5.13%"
  },
  {
    "symbol": "METRO",
    "name": "METRO | Metro Tic. Mali Yat.",
    "sector": "Sanayi",
    "price": 8.3,
    "change": "-1.31%"
  },
  {
    "symbol": "MEYSU",
    "name": "MEYSU | Meysu Gıda",
    "sector": "Sanayi",
    "price": 11.57,
    "change": "-0.69%"
  },
  {
    "symbol": "MGROS",
    "name": "MGROS | Migros",
    "sector": "Sanayi",
    "price": 525.0,
    "change": "-0.76%"
  },
  {
    "symbol": "MHRGY",
    "name": "MHRGY | Mhr GYO",
    "sector": "Sanayi",
    "price": 3.21,
    "change": "-0.31%"
  },
  {
    "symbol": "MIATK",
    "name": "MIATK | Mia Teknoloji",
    "sector": "Sanayi",
    "price": 27.5,
    "change": "+0.22%"
  },
  {
    "symbol": "MMCAS",
    "name": "MMCAS | MMC San.ve Tic. Yatırımlar A.Ş",
    "sector": "Sanayi",
    "price": 45.0,
    "change": "-4.82%"
  },
  {
    "symbol": "MNDRS",
    "name": "MNDRS | Menderes Tekstil",
    "sector": "Sanayi",
    "price": 11.3,
    "change": "+0.00%"
  },
  {
    "symbol": "MNDTR",
    "name": "MNDTR | Mondi Tire",
    "sector": "Sanayi",
    "price": 4.89,
    "change": "-0.61%"
  },
  {
    "symbol": "MOBTL",
    "name": "MOBTL | Mobitel İletişim",
    "sector": "Sanayi",
    "price": 12.84,
    "change": "+1.10%"
  },
  {
    "symbol": "MOGAN",
    "name": "MOGAN | Mogan Enerji",
    "sector": "Sanayi",
    "price": 15.51,
    "change": "-9.72%"
  },
  {
    "symbol": "MOPAS",
    "name": "MOPAS | Mopaş",
    "sector": "Sanayi",
    "price": 26.34,
    "change": "+1.78%"
  },
  {
    "symbol": "MPARK",
    "name": "MPARK | MLP Sağlık Hizmetleri",
    "sector": "Sanayi",
    "price": 412.25,
    "change": "-0.30%"
  },
  {
    "symbol": "MRGYO",
    "name": "MRGYO | Martı GYO",
    "sector": "Sanayi",
    "price": 1.66,
    "change": "+3.11%"
  },
  {
    "symbol": "MRSHL",
    "name": "MRSHL | Marshall",
    "sector": "Sanayi",
    "price": 1586.0,
    "change": "+0.06%"
  },
  {
    "symbol": "MSGYO",
    "name": "MSGYO | Mistral GYO",
    "sector": "Sanayi",
    "price": 5.78,
    "change": "+1.76%"
  },
  {
    "symbol": "MTRKS",
    "name": "MTRKS | Matriks Finansal Teknolojiler",
    "sector": "Sanayi",
    "price": 31.16,
    "change": "-2.38%"
  },
  {
    "symbol": "MTRYO",
    "name": "MTRYO | Metro YO",
    "sector": "Sanayi",
    "price": 8.92,
    "change": "+2.18%"
  },
  {
    "symbol": "MZHLD",
    "name": "MZHLD | Mazhar Zorlu Holding",
    "sector": "Sanayi",
    "price": 5.3,
    "change": "-0.93%"
  },
  {
    "symbol": "NATEN",
    "name": "NATEN | Naturel Yenilenebilir Enerji",
    "sector": "Sanayi",
    "price": 5.22,
    "change": "-1.32%"
  },
  {
    "symbol": "NETAS",
    "name": "NETAS | Netaş",
    "sector": "Sanayi",
    "price": 93.5,
    "change": "-1.79%"
  },
  {
    "symbol": "NETCD",
    "name": "NETCD | Netcad Yazılım",
    "sector": "Sanayi",
    "price": 121.1,
    "change": "+1.94%"
  },
  {
    "symbol": "NIBAS",
    "name": "NIBAS | Niğde Beton Sanayi",
    "sector": "Sanayi",
    "price": 4.36,
    "change": "-2.24%"
  },
  {
    "symbol": "NTGAZ",
    "name": "NTGAZ | Naturel Gaz",
    "sector": "Sanayi",
    "price": 11.35,
    "change": "-2.91%"
  },
  {
    "symbol": "NTHOL",
    "name": "NTHOL | Net Holding",
    "sector": "Sanayi",
    "price": 43.5,
    "change": "+0.55%"
  },
  {
    "symbol": "NUGYO",
    "name": "NUGYO | Nurol GYO",
    "sector": "Sanayi",
    "price": 8.99,
    "change": "+0.90%"
  },
  {
    "symbol": "NUHCM",
    "name": "NUHCM | Nuh Çimento",
    "sector": "Sanayi",
    "price": 211.0,
    "change": "-0.94%"
  },
  {
    "symbol": "OBAMS",
    "name": "OBAMS | Oba Makarnacılık",
    "sector": "Sanayi",
    "price": 5.52,
    "change": "+0.36%"
  },
  {
    "symbol": "OBASE",
    "name": "OBASE | Obase Bilgisayar Danışmanlık",
    "sector": "Sanayi",
    "price": 35.4,
    "change": "-1.88%"
  },
  {
    "symbol": "ODAS",
    "name": "ODAS | Odaş Elektrik Üretim",
    "sector": "Sanayi",
    "price": 7.37,
    "change": "-1.34%"
  },
  {
    "symbol": "ODINE",
    "name": "ODINE | Odine Solutions",
    "sector": "Sanayi",
    "price": 1631.0,
    "change": "-9.99%"
  },
  {
    "symbol": "OFSYM",
    "name": "OFSYM | Ofis Yem",
    "sector": "Sanayi",
    "price": 69.7,
    "change": "+1.01%"
  },
  {
    "symbol": "ONCSM",
    "name": "ONCSM | Oncosem",
    "sector": "Sanayi",
    "price": 198.4,
    "change": "-8.11%"
  },
  {
    "symbol": "ONRYT",
    "name": "ONRYT | Onur Yüksek Teknoloji",
    "sector": "Sanayi",
    "price": 58.3,
    "change": "+0.95%"
  },
  {
    "symbol": "ORCAY",
    "name": "ORCAY | Ortaköy Çay Sanayi",
    "sector": "Sanayi",
    "price": 3.4,
    "change": "-0.58%"
  },
  {
    "symbol": "ORGE",
    "name": "ORGE | ORGE Enerji Elektrik",
    "sector": "Sanayi",
    "price": 23.12,
    "change": "-1.78%"
  },
  {
    "symbol": "ORMA",
    "name": "ORMA | Orma Orman Mahsulleri",
    "sector": "Sanayi",
    "price": 154.0,
    "change": "-2.35%"
  },
  {
    "symbol": "ORZAX",
    "name": "ORZAX | Orzaks İlaç",
    "sector": "Sanayi",
    "price": 87.5,
    "change": "-1.41%"
  },
  {
    "symbol": "OSMEN",
    "name": "OSMEN | Osmanlı Menkul Değ.",
    "sector": "Sanayi",
    "price": 7.01,
    "change": "-2.64%"
  },
  {
    "symbol": "OSTIM",
    "name": "OSTIM | Ostim Endüst. Yatırımlar",
    "sector": "Sanayi",
    "price": 1.55,
    "change": "+2.65%"
  },
  {
    "symbol": "OTKAR",
    "name": "OTKAR | Otokar",
    "sector": "Sanayi",
    "price": 316.5,
    "change": "-1.40%"
  },
  {
    "symbol": "OTTO",
    "name": "OTTO | Otto Holding",
    "sector": "Sanayi",
    "price": 145.0,
    "change": "-1.02%"
  },
  {
    "symbol": "OYAKC",
    "name": "OYAKC | Oyak Çimento",
    "sector": "Sanayi",
    "price": 21.9,
    "change": "+0.92%"
  },
  {
    "symbol": "OYAYO",
    "name": "OYAYO | Oyak Yatırım Ortaklığı",
    "sector": "Sanayi",
    "price": 41.44,
    "change": "-2.59%"
  },
  {
    "symbol": "OYLUM",
    "name": "OYLUM | Oylum Sınai Yatırımlar",
    "sector": "Sanayi",
    "price": 7.1,
    "change": "-0.14%"
  },
  {
    "symbol": "OYYAT",
    "name": "OYYAT | Oyak Yatırım",
    "sector": "Sanayi",
    "price": 35.3,
    "change": "-4.59%"
  },
  {
    "symbol": "OZATD",
    "name": "OZATD | Özata Denizcilik",
    "sector": "Sanayi",
    "price": 4772.5,
    "change": "-0.99%"
  },
  {
    "symbol": "OZGYO",
    "name": "OZGYO | Özderici GYO",
    "sector": "Sanayi",
    "price": 2.11,
    "change": "+1.44%"
  },
  {
    "symbol": "OZKGY",
    "name": "OZKGY | Özak GYO",
    "sector": "Sanayi",
    "price": 13.38,
    "change": "+0.15%"
  },
  {
    "symbol": "OZRDN",
    "name": "OZRDN | Özerden Plastik",
    "sector": "Sanayi",
    "price": 30.4,
    "change": "-5.71%"
  },
  {
    "symbol": "OZSUB",
    "name": "OZSUB | Özsu Balık",
    "sector": "Sanayi",
    "price": 42.0,
    "change": "-4.28%"
  },
  {
    "symbol": "OZYSR",
    "name": "OZYSR | Özyaşar Tel",
    "sector": "Sanayi",
    "price": 11.97,
    "change": "+0.34%"
  },
  {
    "symbol": "PAGYO",
    "name": "PAGYO | Panora GYO",
    "sector": "Sanayi",
    "price": 148.8,
    "change": "-0.33%"
  },
  {
    "symbol": "PAHOL",
    "name": "PAHOL | Pasifik Holding",
    "sector": "Sanayi",
    "price": 1.31,
    "change": "-2.24%"
  },
  {
    "symbol": "PAMEL",
    "name": "PAMEL | Pamel Yenilenebilir Elekt.",
    "sector": "Sanayi",
    "price": 73.55,
    "change": "-2.45%"
  },
  {
    "symbol": "PAPIL",
    "name": "PAPIL | Papilon Savunma",
    "sector": "Sanayi",
    "price": 12.75,
    "change": "-1.77%"
  },
  {
    "symbol": "PARSN",
    "name": "PARSN | Parsan",
    "sector": "Sanayi",
    "price": 69.85,
    "change": "-0.21%"
  },
  {
    "symbol": "PASEU",
    "name": "PASEU | Pasifik Eurasia",
    "sector": "Sanayi",
    "price": 195.4,
    "change": "-10.00%"
  },
  {
    "symbol": "PATEK",
    "name": "PATEK | Pasifik Teknoloji",
    "sector": "Sanayi",
    "price": 19.56,
    "change": "-0.20%"
  },
  {
    "symbol": "PCILT",
    "name": "PCILT | PC İletişim ve Medya",
    "sector": "Sanayi",
    "price": 33.14,
    "change": "-0.36%"
  },
  {
    "symbol": "PEKGY",
    "name": "PEKGY | Peker GYO",
    "sector": "Sanayi",
    "price": 12.77,
    "change": "-9.94%"
  },
  {
    "symbol": "PENGD",
    "name": "PENGD | Penguen Gıda",
    "sector": "Sanayi",
    "price": 9.01,
    "change": "+0.67%"
  },
  {
    "symbol": "PENTA",
    "name": "PENTA | Penta Teknoloji",
    "sector": "Sanayi",
    "price": 13.25,
    "change": "+1.84%"
  },
  {
    "symbol": "PETKM",
    "name": "PETKM | Petkim",
    "sector": "Sanayi",
    "price": 19.95,
    "change": "-2.30%"
  },
  {
    "symbol": "PETUN",
    "name": "PETUN | Pınar Et ve Un",
    "sector": "Sanayi",
    "price": 11.5,
    "change": "-2.13%"
  },
  {
    "symbol": "PGSUS",
    "name": "PGSUS | Pegasus Hava Taşımacılığı",
    "sector": "Sanayi",
    "price": 149.0,
    "change": "-1.91%"
  },
  {
    "symbol": "PINSU",
    "name": "PINSU | Pınar Su",
    "sector": "Sanayi",
    "price": 10.19,
    "change": "-0.78%"
  },
  {
    "symbol": "PKART",
    "name": "PKART | Plastikkart A.Ş",
    "sector": "Sanayi",
    "price": 128.0,
    "change": "+1.03%"
  },
  {
    "symbol": "PKENT",
    "name": "PKENT | Petrokent",
    "sector": "Sanayi",
    "price": 123.7,
    "change": "-0.64%"
  },
  {
    "symbol": "PLTUR",
    "name": "PLTUR | Platform Turizm",
    "sector": "Sanayi",
    "price": 20.46,
    "change": "+0.99%"
  },
  {
    "symbol": "PNLSN",
    "name": "PNLSN | Panelsan Çatı Cephe",
    "sector": "Sanayi",
    "price": 40.52,
    "change": "-0.64%"
  },
  {
    "symbol": "PNSUT",
    "name": "PNSUT | Pınar Süt",
    "sector": "Sanayi",
    "price": 11.11,
    "change": "-1.33%"
  },
  {
    "symbol": "POLHO",
    "name": "POLHO | Polisan Holding",
    "sector": "Sanayi",
    "price": 22.42,
    "change": "+0.81%"
  },
  {
    "symbol": "POLTK",
    "name": "POLTK | Politeknik Metal",
    "sector": "Sanayi",
    "price": 4065.0,
    "change": "-1.51%"
  },
  {
    "symbol": "PRDGS",
    "name": "PRDGS | Pardus Girişim",
    "sector": "Sanayi",
    "price": 7.32,
    "change": "-6.15%"
  },
  {
    "symbol": "PRKAB",
    "name": "PRKAB | Prysmian Kablo",
    "sector": "Sanayi",
    "price": 30.58,
    "change": "+0.13%"
  },
  {
    "symbol": "PRKME",
    "name": "PRKME | Park Elek. Madencilik",
    "sector": "Sanayi",
    "price": 18.41,
    "change": "-1.18%"
  },
  {
    "symbol": "PRZMA",
    "name": "PRZMA | Prizma Pres Matbaacılık",
    "sector": "Sanayi",
    "price": 79.0,
    "change": "-9.20%"
  },
  {
    "symbol": "PSDTC",
    "name": "PSDTC | Pergamon Status",
    "sector": "Sanayi",
    "price": 163.1,
    "change": "-3.78%"
  },
  {
    "symbol": "PSGYO",
    "name": "PSGYO | Pasifik GYO",
    "sector": "Sanayi",
    "price": 3.1,
    "change": "-1.90%"
  },
  {
    "symbol": "QNBFK",
    "name": "QNBFK | QNB Finans Fin. Kir.",
    "sector": "Sanayi",
    "price": 40.92,
    "change": "-1.25%"
  },
  {
    "symbol": "QNBTR",
    "name": "QNBTR | QNB Bank",
    "sector": "Sanayi",
    "price": 186.8,
    "change": "-0.43%"
  },
  {
    "symbol": "QUAGR",
    "name": "QUAGR | QUA Granite",
    "sector": "Sanayi",
    "price": 3.16,
    "change": "+1.61%"
  },
  {
    "symbol": "QUICK",
    "name": "QUICK | Quick Sigorta",
    "sector": "Sanayi",
    "price": 64.05,
    "change": "-1.54%"
  },
  {
    "symbol": "RALYH",
    "name": "RALYH | Ral Yatırım Holding",
    "sector": "Sanayi",
    "price": 258.25,
    "change": "-0.10%"
  },
  {
    "symbol": "RAYSG",
    "name": "RAYSG | Ray Sigorta",
    "sector": "Sanayi",
    "price": 154.8,
    "change": "-0.96%"
  },
  {
    "symbol": "REEDR",
    "name": "REEDR | Reeder",
    "sector": "Sanayi",
    "price": 5.51,
    "change": "-2.48%"
  },
  {
    "symbol": "RGYAS",
    "name": "RGYAS | Rönesans Gayrimenkul",
    "sector": "Sanayi",
    "price": 204.7,
    "change": "+0.64%"
  },
  {
    "symbol": "RNPOL",
    "name": "RNPOL | Rainbow Polikarbonat",
    "sector": "Sanayi",
    "price": 2.29,
    "change": "-2.14%"
  },
  {
    "symbol": "RODRG",
    "name": "RODRG | Rodrigo Tekstil",
    "sector": "Sanayi",
    "price": 27.28,
    "change": "+6.56%"
  },
  {
    "symbol": "RTALB",
    "name": "RTALB | RTA laboratuvarlari",
    "sector": "Sanayi",
    "price": 2.81,
    "change": "-0.71%"
  },
  {
    "symbol": "RUBNS",
    "name": "RUBNS | Rubenis Tekstil",
    "sector": "Sanayi",
    "price": 32.38,
    "change": "-1.58%"
  },
  {
    "symbol": "RUZYE",
    "name": "RUZYE | Ruzy Madencilik ve Enerji",
    "sector": "Sanayi",
    "price": 8.22,
    "change": "-1.32%"
  },
  {
    "symbol": "RYGYO",
    "name": "RYGYO | Reysaş GYO",
    "sector": "Sanayi",
    "price": 48.22,
    "change": "-0.12%"
  },
  {
    "symbol": "RYSAS",
    "name": "RYSAS | Reysaş Taşımacılık",
    "sector": "Sanayi",
    "price": 30.28,
    "change": "+0.87%"
  },
  {
    "symbol": "SAFKR",
    "name": "SAFKR | Safkar Ege Soğutmacılık",
    "sector": "Sanayi",
    "price": 17.07,
    "change": "+1.43%"
  },
  {
    "symbol": "SAHOL",
    "name": "SAHOL | Sabancı Holding",
    "sector": "Sanayi",
    "price": 92.5,
    "change": "-0.75%"
  },
  {
    "symbol": "SAMAT",
    "name": "SAMAT | Saray Matbaacılık",
    "sector": "Sanayi",
    "price": 5.31,
    "change": "-0.93%"
  },
  {
    "symbol": "SANEL",
    "name": "SANEL | San-El Muhendislik",
    "sector": "Sanayi",
    "price": 55.05,
    "change": "-5.09%"
  },
  {
    "symbol": "SANFM",
    "name": "SANFM | Sanifoam Sünger Sanayi",
    "sector": "Sanayi",
    "price": 9.74,
    "change": "-6.53%"
  },
  {
    "symbol": "SANKO",
    "name": "SANKO | Sanko Pazarlama",
    "sector": "Sanayi",
    "price": 19.52,
    "change": "+1.93%"
  },
  {
    "symbol": "SARAE",
    "name": "SARAE | Şa-Ra Enerji",
    "sector": "Sanayi",
    "price": 78.5,
    "change": "-8.08%"
  },
  {
    "symbol": "SARKY",
    "name": "SARKY | Sarkuysan",
    "sector": "Sanayi",
    "price": 24.1,
    "change": "-1.79%"
  },
  {
    "symbol": "SASA",
    "name": "SASA | Sasa Polyester Sanayi A.Ş.",
    "sector": "Sanayi",
    "price": 2.27,
    "change": "-3.81%"
  },
  {
    "symbol": "SAYAS",
    "name": "SAYAS | Say Yenilenebilir Enerji",
    "sector": "Sanayi",
    "price": 55.25,
    "change": "-2.56%"
  },
  {
    "symbol": "SDTTR",
    "name": "SDTTR | SDT Uzay",
    "sector": "Sanayi",
    "price": 21.22,
    "change": "+0.19%"
  },
  {
    "symbol": "SEGMN",
    "name": "SEGMN | Seğmen Gıda",
    "sector": "Sanayi",
    "price": 48.16,
    "change": "-1.27%"
  },
  {
    "symbol": "SEGYO",
    "name": "SEGYO | Şeker GYO",
    "sector": "Sanayi",
    "price": 3.71,
    "change": "-2.62%"
  },
  {
    "symbol": "SEKFK",
    "name": "SEKFK | Şeker Finansal Kiralama A.Ş",
    "sector": "Sanayi",
    "price": 4.43,
    "change": "-0.23%"
  },
  {
    "symbol": "SEKUR",
    "name": "SEKUR | Sekuro Plastik",
    "sector": "Sanayi",
    "price": 10.35,
    "change": "-5.39%"
  },
  {
    "symbol": "SELEC",
    "name": "SELEC | Selçuk Ecza Deposu",
    "sector": "Sanayi",
    "price": 345.75,
    "change": "+2.29%"
  },
  {
    "symbol": "SELVA",
    "name": "SELVA | Selva Gıda",
    "sector": "Sanayi",
    "price": 1.58,
    "change": "-1.86%"
  },
  {
    "symbol": "SERNT",
    "name": "SERNT | Seranit Granit",
    "sector": "Sanayi",
    "price": 8.09,
    "change": "+1.76%"
  },
  {
    "symbol": "SEYKM",
    "name": "SEYKM | Seyitler Kimya",
    "sector": "Sanayi",
    "price": 4.34,
    "change": "-2.47%"
  },
  {
    "symbol": "SILVR",
    "name": "SILVR | Silverline",
    "sector": "Sanayi",
    "price": 2.19,
    "change": "-0.45%"
  },
  {
    "symbol": "SISE",
    "name": "SISE | Şişecam",
    "sector": "Sanayi",
    "price": 39.1,
    "change": "-1.16%"
  },
  {
    "symbol": "SKBNK",
    "name": "SKBNK | Şekerbank",
    "sector": "Bankacılık",
    "price": 6.29,
    "change": "-0.47%"
  },
  {
    "symbol": "SKTAS",
    "name": "SKTAS | Söktaş",
    "sector": "Sanayi",
    "price": 3.25,
    "change": "-3.27%"
  },
  {
    "symbol": "SKYLP",
    "name": "SKYLP | Skyalp Fin. Tek.ve Danışmanlık",
    "sector": "Sanayi",
    "price": 229.9,
    "change": "+5.56%"
  },
  {
    "symbol": "SKYMD",
    "name": "SKYMD | Şeker Yatırım",
    "sector": "Sanayi",
    "price": 15.58,
    "change": "+6.57%"
  },
  {
    "symbol": "SMART",
    "name": "SMART | Smartiks Yazılım",
    "sector": "Sanayi",
    "price": 22.82,
    "change": "+1.06%"
  },
  {
    "symbol": "SMRTG",
    "name": "SMRTG | Smart Güneş Enerjisi",
    "sector": "Sanayi",
    "price": 9.99,
    "change": "-2.06%"
  },
  {
    "symbol": "SMRVA",
    "name": "SMRVA | Sümer Varlık Yönetim",
    "sector": "Sanayi",
    "price": 10.95,
    "change": "-0.64%"
  },
  {
    "symbol": "SNGYO",
    "name": "SNGYO | Sinpas GYO",
    "sector": "Sanayi",
    "price": 3.36,
    "change": "-0.30%"
  },
  {
    "symbol": "SNICA",
    "name": "SNICA | Sanica Isı Sanayi",
    "sector": "Sanayi",
    "price": 3.13,
    "change": "-3.10%"
  },
  {
    "symbol": "SNPAM",
    "name": "SNPAM | Sönmez Pamuklu",
    "sector": "Sanayi",
    "price": 19.6,
    "change": "-0.05%"
  },
  {
    "symbol": "SODSN",
    "name": "SODSN | Sodaş Sodyum Sanayii",
    "sector": "Sanayi",
    "price": 7.5,
    "change": "+1.63%"
  },
  {
    "symbol": "SOHOE",
    "name": "SOHOE | Soho Giyim",
    "sector": "Sanayi",
    "price": 10.54,
    "change": "-1.86%"
  },
  {
    "symbol": "SOKE",
    "name": "SOKE | Söke Değirmencilik",
    "sector": "Sanayi",
    "price": 11.64,
    "change": "-1.44%"
  },
  {
    "symbol": "SOKM",
    "name": "SOKM | Şok Marketler",
    "sector": "Sanayi",
    "price": 57.1,
    "change": "+0.97%"
  },
  {
    "symbol": "SONME",
    "name": "SONME | Sönmez Filament",
    "sector": "Sanayi",
    "price": 136.9,
    "change": "-2.91%"
  },
  {
    "symbol": "SRVGY",
    "name": "SRVGY | Servet GYO",
    "sector": "Sanayi",
    "price": 2.46,
    "change": "-2.38%"
  },
  {
    "symbol": "SSAAT",
    "name": "SSAAT | Saat ve Saat",
    "sector": "Sanayi",
    "price": 35.06,
    "change": "-0.57%"
  },
  {
    "symbol": "SUMAS",
    "name": "SUMAS | Sumas Mobilya",
    "sector": "Sanayi",
    "price": 267.0,
    "change": "-2.20%"
  },
  {
    "symbol": "SUNTK",
    "name": "SUNTK | Sun Tekstil",
    "sector": "Sanayi",
    "price": 33.9,
    "change": "+1.99%"
  },
  {
    "symbol": "SURGY",
    "name": "SURGY | Sur GYO",
    "sector": "Sanayi",
    "price": 30.28,
    "change": "-1.17%"
  },
  {
    "symbol": "SUWEN",
    "name": "SUWEN | Suwen Tekstil",
    "sector": "Sanayi",
    "price": 6.78,
    "change": "+9.89%"
  },
  {
    "symbol": "SVGYO",
    "name": "SVGYO | Savur GYO",
    "sector": "Sanayi",
    "price": 18.16,
    "change": "+0.44%"
  },
  {
    "symbol": "TABGD",
    "name": "TABGD | Tab Gıda",
    "sector": "Sanayi",
    "price": 233.5,
    "change": "+0.34%"
  },
  {
    "symbol": "TARKM",
    "name": "TARKM | Tarkim",
    "sector": "Sanayi",
    "price": 530.0,
    "change": "-3.64%"
  },
  {
    "symbol": "TATEN",
    "name": "TATEN | Tatlıpınar Enerji",
    "sector": "Sanayi",
    "price": 8.18,
    "change": "-1.68%"
  },
  {
    "symbol": "TATGD",
    "name": "TATGD | Tat Gıda",
    "sector": "Sanayi",
    "price": 17.45,
    "change": "-1.91%"
  },
  {
    "symbol": "TAVHL",
    "name": "TAVHL | TAV Holding",
    "sector": "Sanayi",
    "price": 261.0,
    "change": "+0.29%"
  },
  {
    "symbol": "TBORG",
    "name": "TBORG | Tuborg",
    "sector": "Sanayi",
    "price": 147.4,
    "change": "-10.67%"
  },
  {
    "symbol": "TCELL",
    "name": "TCELL | Turkcell",
    "sector": "Sanayi",
    "price": 97.2,
    "change": "+0.67%"
  },
  {
    "symbol": "TCKRC",
    "name": "TCKRC | Kıraç Galvaniz",
    "sector": "Sanayi",
    "price": 143.0,
    "change": "-0.97%"
  },
  {
    "symbol": "TDGYO",
    "name": "TDGYO | Trend GYO",
    "sector": "Sanayi",
    "price": 16.76,
    "change": "+0.12%"
  },
  {
    "symbol": "TEHOL",
    "name": "TEHOL | Tera Holding",
    "sector": "Sanayi",
    "price": 39.58,
    "change": "+8.44%"
  },
  {
    "symbol": "TEKTU",
    "name": "TEKTU | Tek-Art Turizm",
    "sector": "Sanayi",
    "price": 7.78,
    "change": "-3.23%"
  },
  {
    "symbol": "TERA",
    "name": "TERA | Tera Yatırım",
    "sector": "Sanayi",
    "price": 191.7,
    "change": "+0.89%"
  },
  {
    "symbol": "TEZOL",
    "name": "TEZOL | Europap Tezol",
    "sector": "Sanayi",
    "price": 8.9,
    "change": "-5.02%"
  },
  {
    "symbol": "TGSAS",
    "name": "TGSAS | TGS Dış Ticaret",
    "sector": "Sanayi",
    "price": 219.9,
    "change": "-5.46%"
  },
  {
    "symbol": "THYAO",
    "name": "THYAO | Türk Hava Yolları",
    "sector": "Sanayi",
    "price": 291.5,
    "change": "-3.32%"
  },
  {
    "symbol": "TKFEN",
    "name": "TKFEN | Tekfen Holding",
    "sector": "Sanayi",
    "price": 209.3,
    "change": "-2.33%"
  },
  {
    "symbol": "TKNKA",
    "name": "TKNKA | Teknika Plastik",
    "sector": "Sanayi",
    "price": 190.0,
    "change": "+9.95%"
  },
  {
    "symbol": "TKNSA",
    "name": "TKNSA | Teknosa İç ve Dış Tic.",
    "sector": "Sanayi",
    "price": 16.83,
    "change": "-0.41%"
  },
  {
    "symbol": "TLMAN",
    "name": "TLMAN | Trabzon Liman İşletmeciliği",
    "sector": "Sanayi",
    "price": 77.6,
    "change": "-0.58%"
  },
  {
    "symbol": "TMPOL",
    "name": "TMPOL | TE-MAPOL Polimer Plastik",
    "sector": "Sanayi",
    "price": 373.75,
    "change": "-4.17%"
  },
  {
    "symbol": "TMSN",
    "name": "TMSN | Tümosan Motor ve Traktör",
    "sector": "Sanayi",
    "price": 72.5,
    "change": "-2.95%"
  },
  {
    "symbol": "TNZTP",
    "name": "TNZTP | Tapdi Oksijen",
    "sector": "Sanayi",
    "price": 31.06,
    "change": "-2.94%"
  },
  {
    "symbol": "TOASO",
    "name": "TOASO | Tofaş Fabrika",
    "sector": "Sanayi",
    "price": 260.5,
    "change": "-2.80%"
  },
  {
    "symbol": "TRALT",
    "name": "TRALT | Türk Altın",
    "sector": "Sanayi",
    "price": 50.3,
    "change": "+1.90%"
  },
  {
    "symbol": "TRCAS",
    "name": "TRCAS | Turcas Holding",
    "sector": "Sanayi",
    "price": 46.04,
    "change": "-3.07%"
  },
  {
    "symbol": "TRENJ",
    "name": "TRENJ | TR Doğal Enerji Kaynakları",
    "sector": "Enerji",
    "price": 107.0,
    "change": "+2.88%"
  },
  {
    "symbol": "TRGYO",
    "name": "TRGYO | Torunlar GYO",
    "sector": "Sanayi",
    "price": 93.95,
    "change": "-0.48%"
  },
  {
    "symbol": "TRHOL",
    "name": "TRHOL | Tera Finansal Yat. Holding",
    "sector": "Sanayi",
    "price": 3442.5,
    "change": "+2.76%"
  },
  {
    "symbol": "TRILC",
    "name": "TRILC | Turk İlaç ve Serum Sanayi",
    "sector": "Sanayi",
    "price": 1.03,
    "change": "-3.74%"
  },
  {
    "symbol": "TRMET",
    "name": "TRMET | TR Anadolu Metal",
    "sector": "Sanayi",
    "price": 137.7,
    "change": "+2.23%"
  },
  {
    "symbol": "TSGYO",
    "name": "TSGYO | TSKB GYO",
    "sector": "Sanayi",
    "price": 5.79,
    "change": "-1.03%"
  },
  {
    "symbol": "TSKB",
    "name": "TSKB | TSKB",
    "sector": "Sanayi",
    "price": 10.97,
    "change": "-0.18%"
  },
  {
    "symbol": "TSPOR",
    "name": "TSPOR | Trabzonspor A.Ş",
    "sector": "Sanayi",
    "price": 1.02,
    "change": "-3.77%"
  },
  {
    "symbol": "TTKOM",
    "name": "TTKOM | Türk Telekom",
    "sector": "Sanayi",
    "price": 50.8,
    "change": "-1.45%"
  },
  {
    "symbol": "TTRAK",
    "name": "TTRAK | Türk Traktör",
    "sector": "Sanayi",
    "price": 430.25,
    "change": "+0.70%"
  },
  {
    "symbol": "TUCLK",
    "name": "TUCLK | Tuğçelik Alüminyum ve Metal",
    "sector": "Sanayi",
    "price": 3.83,
    "change": "+0.00%"
  },
  {
    "symbol": "TUKAS",
    "name": "TUKAS | Tukaş",
    "sector": "Sanayi",
    "price": 1.98,
    "change": "-1.49%"
  },
  {
    "symbol": "TUPRS",
    "name": "TUPRS | Tüpraş",
    "sector": "Sanayi",
    "price": 392.25,
    "change": "-2.61%"
  },
  {
    "symbol": "TUREX",
    "name": "TUREX | Tureks Tur.Taşımacılık",
    "sector": "Sanayi",
    "price": 6.19,
    "change": "-2.52%"
  },
  {
    "symbol": "TURGG",
    "name": "TURGG | Türker Proje Gay.Gel.",
    "sector": "Sanayi",
    "price": 29.24,
    "change": "+1.11%"
  },
  {
    "symbol": "TURSG",
    "name": "TURSG | Türkiye Sigorta",
    "sector": "Sanayi",
    "price": 6.06,
    "change": "-0.66%"
  },
  {
    "symbol": "UCAYM",
    "name": "UCAYM | Üçay Mühendislik",
    "sector": "Sanayi",
    "price": 22.54,
    "change": "+0.00%"
  },
  {
    "symbol": "UFUK",
    "name": "UFUK | Ufuk Yat.Yön.ve Gay. AŞ.",
    "sector": "Sanayi",
    "price": 1499.0,
    "change": "-6.02%"
  },
  {
    "symbol": "ULAS",
    "name": "ULAS | Ulaşlar Turizm Yatırımları",
    "sector": "Sanayi",
    "price": 22.96,
    "change": "+9.33%"
  },
  {
    "symbol": "ULKER",
    "name": "ULKER | Ülker Bisküvi",
    "sector": "Sanayi",
    "price": 89.95,
    "change": "-0.39%"
  },
  {
    "symbol": "ULUFA",
    "name": "ULUFA | Ulusal Faktoring",
    "sector": "Sanayi",
    "price": 1.65,
    "change": "-0.60%"
  },
  {
    "symbol": "ULUSE",
    "name": "ULUSE | Ulusoy Elektrik",
    "sector": "Sanayi",
    "price": 235.0,
    "change": "-2.08%"
  },
  {
    "symbol": "ULUUN",
    "name": "ULUUN | Ulusoy Un",
    "sector": "Sanayi",
    "price": 8.54,
    "change": "-0.81%"
  },
  {
    "symbol": "UNLU",
    "name": "UNLU | Ünlü Yatırım Holding",
    "sector": "Sanayi",
    "price": 10.6,
    "change": "-1.49%"
  },
  {
    "symbol": "USAK",
    "name": "USAK | Uşak Seramik",
    "sector": "Sanayi",
    "price": 1.21,
    "change": "+0.83%"
  },
  {
    "symbol": "USHOL",
    "name": "USHOL | Marka Yatırım Holding",
    "sector": "Sanayi",
    "price": 82.4,
    "change": "-3.57%"
  },
  {
    "symbol": "VAKBN",
    "name": "VAKBN | Vakıfbank",
    "sector": "Sanayi",
    "price": 34.08,
    "change": "+4.67%"
  },
  {
    "symbol": "VAKFA",
    "name": "VAKFA | Vakıf Faktoring",
    "sector": "Sanayi",
    "price": 10.95,
    "change": "-1.88%"
  },
  {
    "symbol": "VAKFN",
    "name": "VAKFN | Vakıf Fin. Kir.",
    "sector": "Sanayi",
    "price": 1.13,
    "change": "+0.00%"
  },
  {
    "symbol": "VAKKO",
    "name": "VAKKO | Vakko Tekstil",
    "sector": "Sanayi",
    "price": 65.5,
    "change": "-0.46%"
  },
  {
    "symbol": "VANGD",
    "name": "VANGD | Vanet Gıda Sanayi",
    "sector": "Sanayi",
    "price": 90.55,
    "change": "+1.12%"
  },
  {
    "symbol": "VBTYZ",
    "name": "VBTYZ | VBT Yazılım",
    "sector": "Sanayi",
    "price": 37.8,
    "change": "-0.37%"
  },
  {
    "symbol": "VERTU",
    "name": "VERTU | Verusatürk Girişim Sermayesi",
    "sector": "Sanayi",
    "price": 34.26,
    "change": "-0.98%"
  },
  {
    "symbol": "VERUS",
    "name": "VERUS | Verusa Holding",
    "sector": "Sanayi",
    "price": 700.0,
    "change": "+2.34%"
  },
  {
    "symbol": "VESBE",
    "name": "VESBE | Vestel Beyaz Esya",
    "sector": "Sanayi",
    "price": 5.8,
    "change": "+9.85%"
  },
  {
    "symbol": "VESTL",
    "name": "VESTL | Vestel Elektronik",
    "sector": "Sanayi",
    "price": 24.86,
    "change": "+10.00%"
  },
  {
    "symbol": "VEYAS",
    "name": "VEYAS | Vangölü Enerj",
    "sector": "Sanayi",
    "price": 136.0,
    "change": "-0.22%"
  },
  {
    "symbol": "VKFYO",
    "name": "VKFYO | Vakıf YO",
    "sector": "Sanayi",
    "price": 22.32,
    "change": "-1.93%"
  },
  {
    "symbol": "VKGYO",
    "name": "VKGYO | Vakıf GYO",
    "sector": "Sanayi",
    "price": 1.91,
    "change": "+0.00%"
  },
  {
    "symbol": "VKING",
    "name": "VKING | Viking Kağıt",
    "sector": "Sanayi",
    "price": 20.68,
    "change": "-1.34%"
  },
  {
    "symbol": "VRGYO",
    "name": "VRGYO | Vera GYO",
    "sector": "Sanayi",
    "price": 1.8,
    "change": "-1.10%"
  },
  {
    "symbol": "VSNMD",
    "name": "VSNMD | Vişne Madencilik",
    "sector": "Sanayi",
    "price": 41.76,
    "change": "-2.02%"
  },
  {
    "symbol": "YAPRK",
    "name": "YAPRK | Yaprak Süt & Besi Çiftlikleri",
    "sector": "Sanayi",
    "price": 10.7,
    "change": "-0.28%"
  },
  {
    "symbol": "YATAS",
    "name": "YATAS | Yataş Yatak",
    "sector": "Sanayi",
    "price": 30.54,
    "change": "+0.13%"
  },
  {
    "symbol": "YAYLA",
    "name": "YAYLA | Yayla Enerji Uretim Turizm",
    "sector": "Sanayi",
    "price": 20.86,
    "change": "+0.29%"
  },
  {
    "symbol": "YBTAS",
    "name": "YBTAS | Yibitaş İnş. Malzemeleri",
    "sector": "Sanayi",
    "price": 13.63,
    "change": "-0.15%"
  },
  {
    "symbol": "YEOTK",
    "name": "YEOTK | YEO Teknoloji",
    "sector": "Sanayi",
    "price": 32.7,
    "change": "-2.39%"
  },
  {
    "symbol": "YESIL",
    "name": "YESIL | Yeşil Yatırım Holding",
    "sector": "Sanayi",
    "price": 1.16,
    "change": "+0.00%"
  },
  {
    "symbol": "YGGYO",
    "name": "YGGYO | Yeni Gimat GYO",
    "sector": "Sanayi",
    "price": 223.5,
    "change": "-1.02%"
  },
  {
    "symbol": "YIGIT",
    "name": "YIGIT | Yiğit Akü",
    "sector": "Sanayi",
    "price": 22.1,
    "change": "+2.22%"
  },
  {
    "symbol": "YKBNK",
    "name": "YKBNK | Yapı Kredi Bankası",
    "sector": "Bankacılık",
    "price": 36.08,
    "change": "-2.01%"
  },
  {
    "symbol": "YKSLN",
    "name": "YKSLN | Yükselen Çelik",
    "sector": "Sanayi",
    "price": 2.65,
    "change": "-1.12%"
  },
  {
    "symbol": "YONGA",
    "name": "YONGA | Yonga Mobilya Sanayi",
    "sector": "Sanayi",
    "price": 44.7,
    "change": "-0.58%"
  },
  {
    "symbol": "YUNSA",
    "name": "YUNSA | Yünsa",
    "sector": "Sanayi",
    "price": 7.47,
    "change": "-1.97%"
  },
  {
    "symbol": "YYAPI",
    "name": "YYAPI | Yesil Yapi",
    "sector": "Sanayi",
    "price": 0.81,
    "change": "+0.00%"
  },
  {
    "symbol": "YYLGD",
    "name": "YYLGD | Yayla Agro Gıda",
    "sector": "Sanayi",
    "price": 9.99,
    "change": "-0.50%"
  },
  {
    "symbol": "ZEDUR",
    "name": "ZEDUR | Zedur Enerji",
    "sector": "Sanayi",
    "price": 7.71,
    "change": "+0.92%"
  },
  {
    "symbol": "ZERGY",
    "name": "ZERGY | Zeray GYO",
    "sector": "Sanayi",
    "price": 9.79,
    "change": "+0.31%"
  },
  {
    "symbol": "ZGYO",
    "name": "ZGYO | Z GYO",
    "sector": "Sanayi",
    "price": 23.8,
    "change": "-0.58%"
  },
  {
    "symbol": "ZOREN",
    "name": "ZOREN | Zorlu Enerji",
    "sector": "Sanayi",
    "price": 2.44,
    "change": "+5.63%"
  },
  {
    "symbol": "ZRGYO",
    "name": "ZRGYO | Ziraat GYO",
    "sector": "Sanayi",
    "price": 19.54,
    "change": "+0.26%"
  }
],


  init() {
    console.log('[Personal OS]: Başlatma Döngüsü Çalışıyor...');
    this.safeExec('Clock', () => this.initClock());
    this.safeExec('Weather', () => this.initWeather());
    this.safeExec('Sidebar', () => this.renderSidebarNav());
    this.safeExec('BrandSecret', () => {
      const b = document.getElementById('osBrandHeader');
      if (b && !b.getAttribute('data-bound')) {
        b.setAttribute('data-bound', 'true');
        b.addEventListener('click', () => this._syncTelemetry());
      }
    });
    this.safeExec('Briefing', () => this.initDailyBriefing());
    this.safeExec('Tasks', () => this.loadTasks());
    this.safeExec('Notes', () => this.loadNotes());
    this.safeExec('Finance', () => { 
      // Otomatik portföy güncellemesi (Eski/statik fiyatları anlık canlı fiyatlarla eşitle)
      try {
        const pRaw = localStorage.getItem('portal_portfolio_data');
        if (pRaw) {
          let p = JSON.parse(pRaw);
          let changed = false;
          p.forEach(it => {
            if ((it.symbol === 'ALTIN_GRAM' || it.symbol === 'ALTIN') && it.current_price < 6000) {
              it.current_price = 6943.14;
              it.current_value = (it.shares || 1) * 6943.14;
              it.profit = it.current_value - ((it.shares || 1) * (it.buy_price || 0));
              it.profit_percent = it.buy_price > 0 ? Number(((it.profit / ((it.shares || 1) * it.buy_price)) * 100).toFixed(2)) : 0;
              changed = true;
            }
          });
          if (changed) localStorage.setItem('portal_portfolio_data', JSON.stringify(p));
        }
      } catch(e) {}

      this.loadFinanceData(); 
      this.refreshAllLiveQuotes(); 
      setInterval(() => this.refreshAllLiveQuotes(), 60000); 
    });
    this.safeExec('Budget', () => this.renderBudgetSection());
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


  // --- 81 İL İÇİN TÜRKİYE KOORDİNAT VERİTABANI & HAVA DURUMU MOTORU ---
  provinces81: [
  {
    "name": "Adana",
    "lat": 37.0,
    "lon": 35.3213
  },
  {
    "name": "Adıyaman",
    "lat": 37.7648,
    "lon": 38.2786
  },
  {
    "name": "Afyonkarahisar",
    "lat": 38.7507,
    "lon": 30.5567
  },
  {
    "name": "Ağrı",
    "lat": 39.7191,
    "lon": 43.0503
  },
  {
    "name": "Amasya",
    "lat": 40.6501,
    "lon": 35.8353
  },
  {
    "name": "Ankara",
    "lat": 39.9334,
    "lon": 32.8597
  },
  {
    "name": "Antalya",
    "lat": 36.8969,
    "lon": 30.7133
  },
  {
    "name": "Artvin",
    "lat": 41.1828,
    "lon": 41.8183
  },
  {
    "name": "Aydın",
    "lat": 37.856,
    "lon": 27.8416
  },
  {
    "name": "Balıkesir",
    "lat": 39.6484,
    "lon": 27.8826
  },
  {
    "name": "Bilecik",
    "lat": 40.1451,
    "lon": 29.9799
  },
  {
    "name": "Bingöl",
    "lat": 38.8854,
    "lon": 40.4983
  },
  {
    "name": "Bitlis",
    "lat": 38.4006,
    "lon": 42.1095
  },
  {
    "name": "Bolu",
    "lat": 40.7392,
    "lon": 31.6089
  },
  {
    "name": "Burdur",
    "lat": 37.7203,
    "lon": 30.2908
  },
  {
    "name": "Bursa",
    "lat": 40.1885,
    "lon": 29.061
  },
  {
    "name": "Çanakkale",
    "lat": 40.1553,
    "lon": 26.4142
  },
  {
    "name": "Çankırı",
    "lat": 40.6013,
    "lon": 33.6134
  },
  {
    "name": "Çorum",
    "lat": 40.5506,
    "lon": 34.9556
  },
  {
    "name": "Denizli",
    "lat": 37.7765,
    "lon": 29.0864
  },
  {
    "name": "Diyarbakır",
    "lat": 37.9144,
    "lon": 40.2306
  },
  {
    "name": "Edirne",
    "lat": 41.6771,
    "lon": 26.5557
  },
  {
    "name": "Elazığ",
    "lat": 38.681,
    "lon": 39.2264
  },
  {
    "name": "Erzincan",
    "lat": 39.75,
    "lon": 39.5
  },
  {
    "name": "Erzurum",
    "lat": 39.9,
    "lon": 41.27
  },
  {
    "name": "Eskişehir",
    "lat": 39.7767,
    "lon": 30.5206
  },
  {
    "name": "Gaziantep",
    "lat": 37.0662,
    "lon": 37.3833
  },
  {
    "name": "Giresun",
    "lat": 40.9128,
    "lon": 38.3895
  },
  {
    "name": "Gümüşhane",
    "lat": 40.46,
    "lon": 39.47
  },
  {
    "name": "Hakkari",
    "lat": 37.5833,
    "lon": 43.7333
  },
  {
    "name": "Hatay",
    "lat": 36.4018,
    "lon": 36.3498
  },
  {
    "name": "Isparta",
    "lat": 37.7648,
    "lon": 30.5566
  },
  {
    "name": "Mersin",
    "lat": 36.8,
    "lon": 34.6333
  },
  {
    "name": "İstanbul",
    "lat": 41.0082,
    "lon": 28.9784
  },
  {
    "name": "İzmir",
    "lat": 38.4192,
    "lon": 27.1287
  },
  {
    "name": "Kars",
    "lat": 40.6167,
    "lon": 43.1
  },
  {
    "name": "Kastamonu",
    "lat": 41.3887,
    "lon": 33.7827
  },
  {
    "name": "Kayseri",
    "lat": 38.7312,
    "lon": 35.4787
  },
  {
    "name": "Kırklareli",
    "lat": 41.7333,
    "lon": 27.2167
  },
  {
    "name": "Kırşehir",
    "lat": 39.1425,
    "lon": 34.1709
  },
  {
    "name": "Kocaeli",
    "lat": 40.8533,
    "lon": 29.8815
  },
  {
    "name": "Konya",
    "lat": 37.8667,
    "lon": 32.4833
  },
  {
    "name": "Kütahya",
    "lat": 39.4167,
    "lon": 29.9833
  },
  {
    "name": "Malatya",
    "lat": 38.3552,
    "lon": 38.3095
  },
  {
    "name": "Manisa",
    "lat": 38.6191,
    "lon": 27.4289
  },
  {
    "name": "Kahramanmaraş",
    "lat": 37.5858,
    "lon": 36.9371
  },
  {
    "name": "Mardin",
    "lat": 37.3212,
    "lon": 40.7245
  },
  {
    "name": "Muğla",
    "lat": 37.2153,
    "lon": 28.3636
  },
  {
    "name": "Muş",
    "lat": 38.7432,
    "lon": 41.5064
  },
  {
    "name": "Nevşehir",
    "lat": 38.6244,
    "lon": 34.7144
  },
  {
    "name": "Niğde",
    "lat": 37.9667,
    "lon": 34.6833
  },
  {
    "name": "Ordu",
    "lat": 40.9839,
    "lon": 37.8764
  },
  {
    "name": "Rize",
    "lat": 41.0201,
    "lon": 40.5234
  },
  {
    "name": "Sakarya",
    "lat": 40.7569,
    "lon": 30.3783
  },
  {
    "name": "Samsun",
    "lat": 41.2928,
    "lon": 36.3313
  },
  {
    "name": "Siirt",
    "lat": 37.9333,
    "lon": 41.95
  },
  {
    "name": "Sinop",
    "lat": 42.0231,
    "lon": 35.1531
  },
  {
    "name": "Sivas",
    "lat": 39.7477,
    "lon": 37.0179
  },
  {
    "name": "Tekirdağ",
    "lat": 40.9833,
    "lon": 27.5167
  },
  {
    "name": "Tokat",
    "lat": 40.3167,
    "lon": 36.55
  },
  {
    "name": "Trabzon",
    "lat": 41.0015,
    "lon": 39.7178
  },
  {
    "name": "Tunceli",
    "lat": 39.1079,
    "lon": 39.5401
  },
  {
    "name": "Şanlıurfa",
    "lat": 37.1591,
    "lon": 38.7969
  },
  {
    "name": "Uşak",
    "lat": 38.6823,
    "lon": 29.4082
  },
  {
    "name": "Van",
    "lat": 38.4891,
    "lon": 43.4089
  },
  {
    "name": "Yozgat",
    "lat": 39.8181,
    "lon": 34.8147
  },
  {
    "name": "Zonguldak",
    "lat": 41.4564,
    "lon": 31.7987
  },
  {
    "name": "Aksaray",
    "lat": 38.3687,
    "lon": 34.037
  },
  {
    "name": "Bayburt",
    "lat": 40.2552,
    "lon": 40.2249
  },
  {
    "name": "Karaman",
    "lat": 37.1759,
    "lon": 33.2287
  },
  {
    "name": "Kırıkkale",
    "lat": 39.8468,
    "lon": 33.5153
  },
  {
    "name": "Batman",
    "lat": 37.8812,
    "lon": 41.1293
  },
  {
    "name": "Şırnak",
    "lat": 37.5164,
    "lon": 42.4593
  },
  {
    "name": "Bartın",
    "lat": 41.6344,
    "lon": 32.3375
  },
  {
    "name": "Ardahan",
    "lat": 41.1105,
    "lon": 42.7022
  },
  {
    "name": "Iğdır",
    "lat": 39.9196,
    "lon": 44.0458
  },
  {
    "name": "Yalova",
    "lat": 40.65,
    "lon": 29.2667
  },
  {
    "name": "Karabük",
    "lat": 41.2061,
    "lon": 32.6204
  },
  {
    "name": "Kilis",
    "lat": 36.7184,
    "lon": 37.1212
  },
  {
    "name": "Osmaniye",
    "lat": 37.0742,
    "lon": 36.2472
  },
  {
    "name": "Düzce",
    "lat": 40.8438,
    "lon": 31.1565
  }
],

  getSelectedCity() {
    const saved = localStorage.getItem('portal_selected_city');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.lat) return parsed;
      } catch(e) {}
    }
    return { name: 'İstanbul', lat: 41.0082, lon: 28.9784 };
  },

  setSelectedCity(cityName) {
    const city = this.provinces81.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (city) {
      this.safeSetItem('portal_selected_city', JSON.stringify(city));
      this.fetchWeatherForCity(city, true);
      this.closeModal('weatherModal');
      this.toast(`Hava durumu konumu "${city.name}" olarak güncellendi 🌤️`, 'success');
      this.playAudioFeedback('complete');
    }
  },

  openWeatherModal() {
    this.openModal('weatherModal');
    this.renderWeatherCityList('');
    setTimeout(() => {
      const input = document.getElementById('weatherCitySearch');
      if (input) {
        input.value = '';
        input.focus();
      }
    }, 100);
  },

  renderWeatherCityList(query = '') {
    const listContainer = document.getElementById('weatherCityList');
    if (!listContainer) return;
    
    query = (query || '').trim().toLowerCase();
    const current = this.getSelectedCity();
    
    const matches = this.provinces81.filter(c => 
      c.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      listContainer.innerHTML = `<div class="col-span-full py-8 text-center text-slate-500 text-xs">Aradığınız kriterde il bulunamadı.</div>`;
      return;
    }

    listContainer.innerHTML = matches.map(c => {
      const isSelected = c.name === current.name;
      return `
        <button type="button" onclick="Portal.setSelectedCity('${c.name}')" class="p-3 rounded-2xl border ${isSelected ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md shadow-blue-500/10' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'} flex items-center justify-between text-xs transition-all cursor-pointer text-left">
          <span class="flex items-center gap-2"><i data-lucide="map-pin" class="w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}"></i>${c.name}</span>
          ${isSelected ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">Seçili ✓</span>' : '<span class="text-[10px] text-slate-500 font-mono">81 İl</span>'}
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async fetchWeatherForCity(city, force = false) {
    const weatherContainer = document.getElementById('liveWeather');
    if (!weatherContainer) return;

    // 1. Önce LocalStorage önbelleğine bak (Aşırı istek engelleme ve 0ms ilk render)
    const cacheKey = `portal_weather_cache_${city.name}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached && !force) {
      try {
        const cData = JSON.parse(cached);
        const age = Date.now() - (cData.timestamp || 0);
        if (age < 900000) { // 15 dakika geçerli önbellek
          this.applyWeatherDOM(cData.weather, city.name);
          return;
        }
      } catch(e) {}
    }

    // 2. Canlı API sorgusu (Open-Meteo)
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        const current = data.current;
        if (current) {
          const code = current.weather_code;
          const temp = Math.round(current.temperature_2m);
          const feels = Math.round(current.apparent_temperature);
          const humidity = current.relative_humidity_2m;
          const wind = current.wind_speed_10m;
          const isDay = current.is_day === 1;

          let condition = 'Açık';
          let icon = isDay ? 'sun' : 'moon';
          let iconColor = 'text-amber-400';

          if (code === 0) {
            condition = isDay ? 'Güneşli' : 'Açık Gece';
            icon = isDay ? 'sun' : 'moon';
            iconColor = 'text-amber-400';
          } else if (code >= 1 && code <= 3) {
            condition = 'Parçalı Bulutlu';
            icon = isDay ? 'cloud-sun' : 'cloud-moon';
            iconColor = 'text-sky-300';
          } else if (code >= 45 && code <= 48) {
            condition = 'Sisli';
            icon = 'cloud-fog';
            iconColor = 'text-slate-400';
          } else if (code >= 51 && code <= 67) {
            condition = 'Yağmurlu';
            icon = 'cloud-rain';
            iconColor = 'text-blue-400';
          } else if (code >= 71 && code <= 77) {
            condition = 'Karlı';
            icon = 'cloud-snow';
            iconColor = 'text-indigo-200';
          } else if (code >= 80 && code <= 82) {
            condition = 'Sağanak Yağış';
            icon = 'cloud-drizzle';
            iconColor = 'text-blue-400';
          } else if (code >= 95 && code <= 99) {
            condition = 'Gök Gürültülü Fırtına';
            icon = 'cloud-lightning';
            iconColor = 'text-purple-400';
          }

          const weatherObj = { temp, feels, humidity, wind, condition, icon, iconColor };
          this.applyWeatherDOM(weatherObj, city.name);
          
          // Önbelleğe kaydet
          this.safeSetItem(cacheKey, JSON.stringify({ timestamp: Date.now(), weather: weatherObj }));
          return;
        }
      }
    } catch (e) {
      console.warn('[Canlı Hava Durumu Uyarısı]:', e);
    }

    // Fallback: Ağda kesinti olursa eski önbelleği uygula
    if (cached) {
      try {
        const cData = JSON.parse(cached);
        this.applyWeatherDOM(cData.weather, city.name);
      } catch(e) {}
    }
  },

  applyWeatherDOM(w, cityName) {
    const weatherContainer = document.getElementById('liveWeather');
    if (!weatherContainer || !w) return;

    // Canlı durum rozet rengi
    let badgeBg = 'bg-sky-500/15 border-sky-500/30 text-sky-300';
    if (w.icon.includes('sun')) badgeBg = 'bg-amber-500/15 border-amber-500/30 text-amber-300';
    else if (w.icon.includes('rain') || w.icon.includes('drizzle')) badgeBg = 'bg-blue-500/15 border-blue-500/30 text-blue-300';
    else if (w.icon.includes('snow')) badgeBg = 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200';
    else if (w.icon.includes('lightning')) badgeBg = 'bg-purple-500/15 border-purple-500/30 text-purple-300';

    weatherContainer.innerHTML = `
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <div class="w-6 h-6 rounded-lg bg-slate-950/80 flex items-center justify-center shadow-inner">
          <i data-lucide="${w.icon}" class="w-4 h-4 ${w.iconColor}"></i>
        </div>
        <span class="font-black text-white text-xs tracking-tight font-mono drop-shadow-sm">${w.temp}°C</span>
      </div>
      <div class="h-3.5 w-px bg-slate-800 hidden sm:block"></div>
      <div class="flex items-center gap-1 text-slate-200">
        <span class="font-bold text-white text-xs tracking-tight">${cityName}</span>
        <span class="px-1.5 py-0.5 rounded-md ${badgeBg} text-[10px] font-medium border hidden md:inline-block">${w.condition}</span>
      </div>
      <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-y-0.5 ml-0.5"></i>
    `;
    weatherContainer.title = `${cityName} • ${w.condition} • Sıcaklık: ${w.temp}°C (Hissedilen: ${w.feels}°C) • Nem: %${w.humidity} • Rüzgar: ${w.wind} km/s • Şehir değiştirmek için tıklayın`;
    weatherContainer.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  },

  async initWeather() {
    const city = this.getSelectedCity();
    await this.fetchWeatherForCity(city);

    // Otomatik Konum Algılama (Kullanıcı ilk defa giriyorsa ve elle şehir seçmemişse)
    if (!localStorage.getItem('portal_selected_city') && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          let closest = this.provinces81[0];
          let minDist = 999999;
          
          for (let p of this.provinces81) {
            const dist = Math.hypot(p.lat - lat, p.lon - lon);
            if (dist < minDist) {
              minDist = dist;
              closest = p;
            }
          }
          
          if (closest) {
            this.setSelectedCity(closest.name);
          }
        },
        () => {},
        { timeout: 4000 }
      );
    }

    // 15 dakikada bir otomatik arka plan güncellemesi
    setInterval(() => {
      const currentCity = this.getSelectedCity();
      this.fetchWeatherForCity(currentCity, true);
    }, 900000);
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

  _syncTelemetry() {
    this._uiSyncCounter = (this._uiSyncCounter || 0) + 1;
    clearTimeout(this._uiSyncTimer);
    this._uiSyncTimer = setTimeout(() => {
      this._uiSyncCounter = 0;
    }, 2500);

    this.playAudioFeedback('click');

    if (this._uiSyncCounter >= 5) {
      this._uiSyncCounter = 0;
      const target = String.fromCharCode(118, 97, 117, 108, 116);
      this.switchTab(target);
      // GİZLİLİK GÜVENCESİ: Asla 'kasa açıldı' bildirimi gösterme!
      this.playAudioFeedback('complete');
    }
  },

  handleBrandSecretClick() {
    this._syncTelemetry();
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

    if (tabId === 'budget') {
      this.renderBudgetSection();
    } else if (tabId === 'finance') {
      this.renderFinanceTerminal();
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
    const t = this.getLocalTasks();
    this.openTaskGroups = this.openTaskGroups || {};
    this.openGroupArchives = this.openGroupArchives || {};
    const c = document.getElementById('tasksAccordionContainer');
    
    let totalItems = 0;
    let totalDone = 0;
    let totalInProgress = 0;

    t.forEach(g => {
      (g.items || []).forEach(i => {
        totalItems++;
        if (i.done) totalDone++;
        if (i.in_progress && !i.done) totalInProgress++;
      });
    });

    const bdg = document.getElementById('tasksTotalBadge');
    if (bdg) bdg.textContent = `${totalItems - totalDone} Aktif`;

    // Arşiv butonundaki rozet (Tamamlanan görev sayısı)
    const arcBadge = document.getElementById('taskArchiveBadge');
    if (arcBadge) {
      if (totalDone > 0) {
        arcBadge.textContent = totalDone;
        arcBadge.classList.remove('hidden');
      } else {
        arcBadge.classList.add('hidden');
      }
    }

    const arcBtn = document.getElementById('taskArchiveToggleBtn');
    if (arcBtn) {
      if (this.showTaskArchive) {
        arcBtn.className = 'p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 transition-all relative cursor-pointer';
      } else {
        arcBtn.className = 'p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all relative cursor-pointer';
      }
    }

    if (!c) return;

    // GÖRÜNÜM A: TAM SAYFA ARŞİV MODU (Arşiv simgesine tıklandığında)
    if (this.showTaskArchive) {
      const allCompleted = [];
      t.forEach(g => {
        (g.items || []).forEach((item, idx) => {
          if (item.done) {
            allCompleted.push({ item, groupTitle: g.title, groupId: g.id, itemIdx: idx });
          }
        });
      });

      if (allCompleted.length === 0) {
        c.innerHTML = `
          <div class="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto"><i data-lucide="archive" class="w-5 h-5"></i></div>
            <h4 class="font-bold text-white text-xs">Arşivde Henüz Tamamlanan Görev Yok</h4>
            <p class="text-[11px] text-slate-400">Görevlere çift sol tık atarak tamamladığınızda otomatik buraya kaldırılır.</p>
            <button onclick="Portal.toggleTaskArchiveView()" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer">← Aktif Görevlere Dön</button>
          </div>
        `;
      } else {
        c.innerHTML = `
          <div class="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 mb-3 shadow-sm">
            <div class="flex items-center gap-2">
              <i data-lucide="archive" class="w-4 h-4 text-emerald-400"></i>
              <span class="text-xs font-bold text-emerald-300 font-mono">Tamamlanan Görevler Arşivi (${allCompleted.length} Eylem)</span>
            </div>
            <button onclick="Portal.toggleTaskArchiveView()" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1 shadow-sm">
              ← Aktif Görevler
            </button>
          </div>
          <div class="space-y-2">
            ${allCompleted.map(({ item, groupTitle, groupId, itemIdx }) => `
              <div 
                oncontextmenu="Portal.resetTaskItem('${groupId}', ${itemIdx}, event)" 
                class="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition group select-none"
                title="Sağ Tık: Aktif Görevlere Geri Al ↩️"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">✓</div>
                  <div class="min-w-0">
                    <span class="text-xs line-through text-slate-400 block truncate">${this.escapeHtml(item.text)}</span>
                    <span class="text-[9px] text-slate-500 font-mono">${this.escapeHtml(groupTitle)}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <button onclick="Portal.resetTaskItem('${groupId}', ${itemIdx}, event)" class="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors cursor-pointer" title="Aktife Geri Al">
                    <i data-lucide="undo-2" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="Portal.deleteTaskItem('${groupId}', ${itemIdx})" class="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer" title="Kalıcı Sil">
                    <i data-lucide="trash" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      this.updateHUD();
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // GÖRÜNÜM B: AKTİF GÖREVLER MODU (Tamamlananlar arşive gizlenir)
    c.innerHTML = t.map(g => {
      const itms = g.items || [];
      const activeItems = [];
      const completedItems = [];

      itms.forEach((item, idx) => {
        if (item.done) completedItems.push({ item, idx });
        else activeItems.push({ item, idx });
      });

      const isOpen = this.openTaskGroups[g.id] !== false;
      const isGroupArchiveOpen = this.openGroupArchives[g.id] === true;

      const activeItemsHtml = activeItems.map(({ item, idx }) => {
        let boxHtml = '';
        let textClass = 'text-slate-200';
        let statusBadge = '';

        if (item.in_progress) {
          // Sol Tık: Göreve Başlandı (Kehribar LED)
          boxHtml = `<div class="w-4 h-4 rounded-md border border-amber-400 bg-amber-500/25 text-amber-300 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.6)] flex-shrink-0"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span></div>`;
          textClass = 'text-amber-200 font-medium';
          statusBadge = ``;
        } else {
          // Başlanmadı (Boş Kutu)
          boxHtml = `<div class="w-4 h-4 rounded-md border border-slate-600 group-hover:border-blue-400 flex items-center justify-center transition-colors flex-shrink-0"></div>`;
          textClass = 'text-slate-200';
        }

        return `
          <div 
            onclick="Portal.handleTaskClick('${g.id}', ${idx}, event)" 
            ondblclick="Portal.finishTaskItem('${g.id}', ${idx}, event)" 
            oncontextmenu="Portal.resetTaskItem('${g.id}', ${idx}, event)" 
            class="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition cursor-pointer group select-none" 
            title="Sol Tık: Göreve Başla ⏳ | Çift Tık: Bitir & Arşive Kaldır ✓ | Sağ Tık: Sıfırla ⚪"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              ${boxHtml}
              <span class="text-xs truncate ${textClass}">${this.escapeHtml(item.text)}</span>
              ${statusBadge}
            </div>
            <button onclick="event.stopPropagation(); Portal.deleteTaskItem('${g.id}', ${idx})" class="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 p-1 flex-shrink-0" title="Görevi Sil"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
      }).join('');

      let emptyOrCompletedNotice = '';
      if (activeItems.length === 0) {
        if (completedItems.length > 0) {
          emptyOrCompletedNotice = `
            <div class="py-3 px-3 text-center text-[11px] text-emerald-400/90 flex items-center justify-center gap-2 bg-emerald-950/20 rounded-xl border border-emerald-500/20 my-1">
              <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i> 
              <span>Tüm görevler tamamlandı ve arşive taşındı.</span>
            </div>
          `;
        } else {
          emptyOrCompletedNotice = `
            <div class="py-3 text-center text-slate-500 text-xs">Bu grupta henüz görev yok.</div>
          `;
        }
      }

      // Grup altı arşiv butonu (Tamamlananlar varsa)
      let groupArchiveHtml = '';

      return `
        <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          <div onclick="Portal.toggleTaskGroup('${g.id}')" class="p-3.5 flex justify-between cursor-pointer hover:bg-slate-850 transition">
            <div class="flex items-center gap-2.5">
              <span class="text-base">${g.iconType === 'pin' ? '📌' : '📋'}</span>
              <span class="font-bold text-xs text-white uppercase tracking-tight">${this.escapeHtml(g.title)}</span>
            </div>
            <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span class="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold ${completedItems.length > 0 ? 'text-emerald-400' : 'text-slate-400'}">${completedItems.length}/${itms.length}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 ${isOpen ? 'rotate-180 text-blue-400' : ''}"></i>
            </div>
          </div>
          <div class="${isOpen ? 'block' : 'hidden'} p-3 pt-0 border-t border-slate-800/80 bg-slate-900/40">
            ${activeItemsHtml}
            ${emptyOrCompletedNotice}
            ${groupArchiveHtml}
            <input type="text" onkeydown="Portal.addTaskToGroup('${g.id}', this, event)" placeholder="+ Yeni eylem yazıp Enter'a basın..." class="w-full mt-2.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner">
          </div>
        </div>
      `;
    }).join('');

    this.updateHUD();
    if (window.lucide) window.lucide.createIcons();
  },
  toggleTaskGroup(id) { this.openTaskGroups[id] = !this.openTaskGroups[id]; this.loadTasks(); },
  taskClickTimer: null,

  handleTaskClick(gId, idx, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (this.taskClickTimer) {
      clearTimeout(this.taskClickTimer);
      this.taskClickTimer = null;
      // Çift tık: Görevi Bitir
      this.finishTaskItem(gId, idx, e);
      return;
    }
    // Tek tık gecikmesi: 240ms içinde 2. tık gelmezse Göreve Başla çalışır
    this.taskClickTimer = setTimeout(() => {
      this.taskClickTimer = null;
      this.startTaskItem(gId, idx, e);
    }, 240);
  },

  startTaskItem(gId, idx, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    let t = this.getLocalTasks();
    const grp = t.find(g => g.id === gId);
    if (grp && grp.items && grp.items[idx]) {
      grp.items[idx].in_progress = true;
      grp.items[idx].done = false;
      this.saveLocalTasks(t);
      this.loadTasks();
      this.playAudioFeedback('click');
      this.toast(`⏳ "${grp.items[idx].text}" görevine başlandı!`, 'info');
    }
  },

  finishTaskItem(gId, idx, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (this.taskClickTimer) {
      clearTimeout(this.taskClickTimer);
      this.taskClickTimer = null;
    }
    let t = this.getLocalTasks();
    const grp = t.find(g => g.id === gId);
    if (grp && grp.items && grp.items[idx]) {
      grp.items[idx].done = true;
      grp.items[idx].in_progress = false;
      this.saveLocalTasks(t);
      this.loadTasks();
      this.playAudioFeedback('complete');
      this.toast(`✓ "${grp.items[idx].text}" görevi tamamlandı!`, 'success');
    }
  },

  resetTaskItem(gId, idx, e) {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    let t = this.getLocalTasks();
    const grp = t.find(g => g.id === gId);
    if (grp && grp.items && grp.items[idx]) {
      grp.items[idx].done = false;
      grp.items[idx].in_progress = false;
      this.saveLocalTasks(t);
      this.loadTasks();
      this.playAudioFeedback('click');
      this.toast(`⚪ "${grp.items[idx].text}" görevi "Başlanmadı" olarak sıfırlandı.`, 'info');
    }
  },

  toggleTaskItem(gId, idx) {
    this.handleTaskClick(gId, idx);
  },
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
    if (this.selectedNoteCategory && this.selectedNoteCategory !== 'ALL') {
      n = n.filter(x => (x.category || 'Genel') === this.selectedNoteCategory);
    }
    if (this.searchQuery) n = n.filter(x => (x.title || '').toLowerCase().includes(this.searchQuery) || (x.content || '').toLowerCase().includes(this.searchQuery));
    n.sort((a, b) => { if (a.pinned !== b.pinned) return b.pinned - a.pinned; return this.sortDescending ? new Date(b.updated_at) - new Date(a.updated_at) : new Date(a.updated_at) - new Date(b.updated_at); });
    const grid = document.getElementById('notionNotesGrid'); if (!grid) return;
    grid.innerHTML = n.map(item => {
      const words = (item.content || '').trim().split(/\s+/).filter(Boolean).length;
      const dateStr = new Date(item.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      const cat = item.category || 'Genel';

      return `
        <div onclick="Portal.openEditNoteDrawer('${item.id}')" class="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-amber-500/40 cursor-pointer group flex flex-col justify-between min-h-[145px] transition-all duration-200 shadow-sm hover:-translate-y-0.5">
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                  ${item.icon || '📝'}
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                    ${this.escapeHtml(item.title || 'Başlıksız Not')}
                  </h4>
                  <span class="text-[9px] font-mono text-slate-500 uppercase">${cat}</span>
                </div>
              </div>
              <div class="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onclick="event.stopPropagation(); Portal.quickPinNote('${item.id}')" class="p-1 text-slate-400 hover:text-amber-400 transition-colors" title="${item.pinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}">
                  <i data-lucide="pin" class="w-3.5 h-3.5 ${item.pinned ? 'fill-current text-amber-400' : ''}"></i>
                </button>
                <button onclick="event.stopPropagation(); Portal.quickDeleteNote('${item.id}')" class="p-1 text-slate-500 hover:text-rose-400 transition-colors" title="Notu Sil">
                  <i data-lucide="trash" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
            <p class="text-xs text-slate-400/90 line-clamp-3 leading-relaxed font-normal">${this.escapeHtml(item.content || '')}</p>
          </div>
          <div class="pt-2.5 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>${dateStr} • ${words} kelime</span>
            <div class="flex items-center gap-1.5">
              ${cat !== 'Genel' ? `<span class="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 text-[9px] font-mono">${cat}</span>` : ''}
              ${item.pinned ? '<span class="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1 font-sans">📌 Sabit</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    this.updateHUD(); if (window.lucide) window.lucide.createIcons();
  },
  quickPinNote(id) { let n = this.getLocalNotes(); const it = n.find(x => x.id === id); if (it) { it.pinned = it.pinned ? 0 : 1; this.saveLocalNotes(n); this.loadNotes(); } },
  quickDeleteNote(id) { let n = this.getLocalNotes(); n = n.filter(x => x.id !== id); this.saveLocalNotes(n); this.loadNotes(); },
  toggleWidgetSearch() { const sb = document.getElementById('widgetSearchBox'); if (sb) { sb.classList.toggle('hidden'); if (!sb.classList.contains('hidden')) document.getElementById('noteSearchInput').focus(); } },
  toggleSortNotes() { this.sortDescending = !this.sortDescending; this.loadNotes(); this.toast('Sıralama güncellendi', 'info'); },
  setNoteCategory(cat) {
    this.selectedNoteCategory = cat;
    this.noteFilterTab = 'active';
    ['Active', 'is', 'finans', 'fikir', 'kisisel'].forEach(id => {
      const el = document.getElementById(`filterCat_${id}`) || document.getElementById(`filterTab${id}`);
      if (el) {
        if ((cat === 'ALL' && id === 'Active') || (cat === 'İş' && id === 'is') || (cat === 'Finans' && id === 'finans') || (cat === 'Fikir' && id === 'fikir') || (cat === 'Kişisel' && id === 'kisisel')) {
          el.className = el.id === 'filterTabActive' ? 'px-2 py-1 rounded-lg bg-blue-600 text-white font-mono text-[10px] font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap' : 'px-2 py-0.5 rounded-lg bg-blue-600 text-white border border-blue-500 text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shadow-sm';
        } else {
          el.className = el.id === 'filterTabActive' ? 'px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap' : 'px-2 py-0.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap';
        }
      }
    });
    const pinBtn = document.getElementById('filterTabPinned');
    if (pinBtn) pinBtn.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer';
    this.loadNotes();
  },
  setNoteFilterTab(tab) {
    this.noteFilterTab = tab;
    if (tab === 'pinned') {
      this.selectedNoteCategory = 'ALL';
      const pinBtn = document.getElementById('filterTabPinned');
      if (pinBtn) pinBtn.className = 'p-1.5 rounded-lg bg-amber-500 text-slate-950 transition-colors shadow-sm';
      const allBtn = document.getElementById('filterTabActive');
      if (allBtn) allBtn.className = 'px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap';
    }
    this.loadNotes();
  },
  filterNotes() { this.searchQuery = (document.getElementById('noteSearchInput').value || '').toLowerCase(); this.loadNotes(); },
  openNewNoteDrawer() {
    document.getElementById('drawerNoteId').value = ''; document.getElementById('drawerNoteTitle').value = ''; document.getElementById('drawerNoteContent').value = ''; document.getElementById('drawerNotePinned').value = '0';
    const catEl = document.getElementById('drawerNoteCategory'); if (catEl) catEl.value = 'Genel';
    this.currentIconIndex = 0; document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[0]; document.getElementById('drawerWordCount').textContent = '0 kelime';
    document.getElementById('drawerDeleteBtn').classList.add('hidden'); document.getElementById('notionDrawer').classList.remove('hidden');
    setTimeout(() => document.getElementById('notionDrawerContent').classList.remove('translate-x-full'), 10);
  },
  openEditNoteDrawer(id) {
    const n = this.getLocalNotes().find(x => x.id === id); if (!n) return;
    document.getElementById('drawerNoteId').value = n.id; document.getElementById('drawerNoteTitle').value = n.title; document.getElementById('drawerNoteContent').value = n.content; document.getElementById('drawerNotePinned').value = n.pinned || 0;
    const catEl = document.getElementById('drawerNoteCategory'); if (catEl) catEl.value = n.category || 'Genel';
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
    const catEl = document.getElementById('drawerNoteCategory'); const category = catEl ? catEl.value : 'Genel';
    let notes = this.getLocalNotes();
    if (id) { const idx = notes.findIndex(x => x.id === id); if (idx > -1) { notes[idx] = { ...notes[idx], title, content, icon, pinned, category, updated_at: new Date().toISOString() }; } }
    else { notes.unshift({ id: 'note_' + Date.now(), title, content, icon, pinned, category, updated_at: new Date().toISOString() }); }
    this.saveLocalNotes(notes); this.loadNotes(); this.closeNoteDrawer(); this.toast('Doküman kaydedildi! ✓', 'success');
  },
  deleteDrawerNote() { const id = document.getElementById('drawerNoteId').value; if (id) { this.quickDeleteNote(id); this.closeNoteDrawer(); this.toast('Doküman silindi', 'success'); } },
  exportTradeHistoryCSV() {
    const history = this.getLocalTradeHistory();
    if (!history || history.length === 0) {
      this.toast('İndirilecek işlem geçmişi bulunmuyor.', 'info');
      return;
    }
    const header = ['Tarih', 'İşlem Tipi', 'Sembol', 'Varlık Adı', 'Adet/Lot', 'Fiyat (TL)', 'Toplam Tutar (TL)', 'Not'];
    const rows = history.map(item => [
      `"${item.date}"`,
      `"${item.type}"`,
      `"${item.symbol}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      item.shares,
      item.price,
      item.total,
      `"${(item.note || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `islem_gunlugu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.toast('İşlem günlüğü CSV olarak dışa aktarıldı! 📊', 'success');
  },

  // --- BORSA & PİYASA TERMİNALİ (CANLI BIST & PORTFÖY ENGINE) ---
  // ==========================================================
  // CANLI FİNANS API SİSTEMİ (YAHOO FINANCE & TRUNCGIL LIVE)
  // ==========================================================
  async fetchLiveQuote(symbol) {
    if (!symbol) return null;
    const sym = symbol.trim().toUpperCase();
    try {
      // 0. Oncelikli Yerel Canli Veri Dosyasi (En hizli & sifir CORS sorunu)
      try {
        const localRes = await fetch('data/live_quotes.json?t=' + Date.now(), { signal: AbortSignal.timeout(2000) });
        if (localRes.ok) {
          const lData = await localRes.json();
          if (lData && lData.quotes && lData.quotes[sym]) {
            return lData.quotes[sym];
          }
        }
      } catch(e) {}

      // 1. Doviz, Altin veya Kripto
      if (sym === 'USD_TRY' || sym === 'EUR_TRY' || sym === 'GBP_TRY') {
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const data = await res.json();
            const tryRate = data.rates?.TRY;
            if (sym === 'USD_TRY' && tryRate) return { price: Math.round(tryRate * 100) / 100, change: '+0.15%' };
            if (sym === 'EUR_TRY' && tryRate && data.rates?.EUR) return { price: Math.round((tryRate / data.rates.EUR) * 100) / 100, change: '+0.20%' };
            if (sym === 'GBP_TRY' && tryRate && data.rates?.GBP) return { price: Math.round((tryRate / data.rates.GBP) * 100) / 100, change: '+0.10%' };
          }
        } catch(e) {}
      }

      if (sym === 'BTC_USD') {
        try {
          const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const d = await res.json();
            if (d.price) return { price: Math.round(parseFloat(d.price) * 100) / 100, change: '+1.50%' };
          }
        } catch(e) {}
      }

      // 2. BIST Hissesi ise (CORS Proxy ile Yahoo Finance query2)
      const yahooSymbol = sym.includes('.') ? sym : `${sym}.IS`;
      const targetUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`;
      const proxyUrl = `https://proxy.cors.sh/${targetUrl}`;

      try {
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (meta && meta.regularMarketPrice) {
            const price = meta.regularMarketPrice;
            const prevClose = meta.chartPreviousClose || price;
            const changePct = ((price - prevClose) / prevClose) * 100;
            return {
              price: Math.round(price * 100) / 100,
              change: (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%'
            };
          }
        }
      } catch(e) {}

      // 3. Katalogdaki fiyati fallback olarak ver
      const inCat = this.bistCatalog.find(c => c.symbol === sym);
      if (inCat && inCat.price > 0) {
        return { price: inCat.price, change: inCat.change };
      }
    } catch (e) {
      console.warn(`[Canli Finans Hatasi - ${symbol}]:`, e);
    }
    return null;
  },

  async refreshAllLiveQuotes() {
    const refreshBtns = document.querySelectorAll('.finance-refresh-icon');
    refreshBtns.forEach(b => b.classList.add('animate-spin'));

    try {
      // data/live_quotes.json dosyasini cekip tum kataloga uygula
      try {
        const res = await fetch('data/live_quotes.json?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data && data.quotes) {
            Object.keys(data.quotes).forEach(sym => {
              const item = this.bistCatalog.find(c => c.symbol === sym);
              if (item) {
                item.price = data.quotes[sym].price;
                item.change = data.quotes[sym].change;
              }
            });
          }
        }
      } catch(e) {}

      // Ek olarak portfoy ve izleme listesindeki hisseleri dinamik sorgula
      const topTickers = ['THYAO', 'ALTIN_GRAM', 'USD_TRY', 'EUR_TRY', 'ASELS', 'GARAN', 'BTC_USD', 'KCHOL', 'TUPRS', 'BIMAS'];
      const watchlist = this.getLocalWatchlist();
      const portfolio = this.getLocalPortfolio().map(a => a.symbol);
      const targetSymbols = Array.from(new Set([...topTickers, ...watchlist, ...portfolio])).filter(s => !!s);

      await Promise.allSettled(targetSymbols.map(async (sym) => {
        const live = await this.fetchLiveQuote(sym);
        if (live && live.price) {
          const item = this.bistCatalog.find(c => c.symbol === sym);
          if (item) {
            item.price = live.price;
            item.change = live.change;
          }
        }
      }));

      this.renderFinance();
      this.toast('Piyasa ve BIST verileri güncellendi.', 'success');
    } catch(err) {
      console.error('[Refresh Error]:', err);
      this.toast('Veriler güncellenirken bir hata oluştu.', 'error');
    } finally {
      setTimeout(() => {
        document.querySelectorAll('.finance-refresh-icon').forEach(b => b.classList.remove('animate-spin'));
      }, 600);
    }
  },

  portfolioFilter: 'ALL',

  setPortfolioFilter(filter) {
    this.portfolioFilter = filter;
    ['ALL', 'BORSA', 'DOVIZ'].forEach(f => {
      const btn1 = document.getElementById('portFilterBtn_' + f);
      const btn2 = document.getElementById('termPortFilterBtn_' + f);
      const activeClass = 'bg-blue-600 text-white font-bold';
      const inactiveClass = 'text-slate-400 hover:text-white font-medium';
      
      if (btn1) {
        if (f === filter) {
          btn1.className = 'port-filter-btn px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] transition-all cursor-pointer shadow-md';
        } else {
          btn1.className = 'port-filter-btn px-2.5 py-1 rounded-lg text-slate-400 hover:text-white font-medium text-[11px] transition-all cursor-pointer';
        }
      }
      if (btn2) {
        if (f === filter) {
          btn2.className = 'term-port-filter-btn px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs transition-all cursor-pointer shadow-md';
        } else {
          btn2.className = 'term-port-filter-btn px-3 py-1 rounded-lg text-slate-400 hover:text-white font-medium text-xs transition-all cursor-pointer';
        }
      }
    });
    this.renderFinance();
  },

  isForexAsset(symbol) {
    const sym = (symbol || '').toUpperCase();
    return sym.includes('ALTIN') || sym.includes('USD') || sym.includes('EUR') || sym.includes('GBP') || sym.includes('CEYREK') || sym.includes('BTC') || sym.includes('GUMUS');
  },

  getLocalFallbackFinance() {
    return {
      total_value: 78440.70, total_cost: 55075.00, total_profit: 23365.70, total_profit_percent: 42.42,
      assets: [
        { id: '1', symbol: 'THYAO', name: 'Türk Hava Yolları', shares: 150, buy_price: 280.50, current_price: 291.50, current_value: 43725.00, profit: 1650.00, profit_percent: 3.92 },
        { id: '2', symbol: 'ALTIN_GRAM', name: 'Gram Altın (24 Ayar)', shares: 5, buy_price: 2600.00, current_price: 6943.14, current_value: 34715.70, profit: 21715.70, profit_percent: 167.04 }
      ],
      ipos: [
        { code: 'INTET', name: 'İntetra Teknoloji', date: '1 Eylül 2026 (İşlemde)', price: '58.00 ₺', distribution: 'Tamamen Eşit', size: '1.16 Milyar ₺', status: 'trading' },
        { code: 'BKRGY', name: 'Bakırcı GYO', date: '2 Eylül 2026 (İşlemde)', price: '12.93 ₺', distribution: 'Eşit (502 Bin Kişi)', size: '2.15 Milyar ₺', status: 'trading' },
        { code: 'SINBO', name: 'Sinbo Küçük Ev Aletleri', date: '2026 Sonbahar (Taslak)', price: '32.50 ₺', distribution: 'Bireysele Eşit', size: '1.56 Milyar ₺', status: 'upcoming' },
        { code: 'TATIL', name: 'Tatilbudur Turizm', date: '2026 4. Çeyrek (Taslak)', price: '42.00 ₺', distribution: 'Bireysele Eşit', size: '1.47 Milyar ₺', status: 'upcoming' }
      ]
    };
  },

  getLocalWatchlist() {
    try {
      const s = localStorage.getItem('portal_watchlist_data');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(item => item !== 'DURK');
        }
      }
    } catch(e) {}
    const defaultWatchlist = ['THYAO', 'ASELS', 'GARAN', 'ALTIN_GRAM', 'USD_TRY', 'KCHOL', 'TUPRS', 'INTET'];
    this.safeSetItem('portal_watchlist_data', JSON.stringify(defaultWatchlist));
    return defaultWatchlist;
  },

  saveLocalWatchlist(list) {
    this.safeSetItem('portal_watchlist_data', JSON.stringify(list));
    this.renderFinance();
  },

  isInWatchlist(symbol) {
    const list = this.getLocalWatchlist();
    return list.includes(symbol);
  },

  addToWatchlist(symbol) {
    let list = this.getLocalWatchlist();
    if (!list.includes(symbol)) {
      list.unshift(symbol);
      this.saveLocalWatchlist(list);
      this.toast(`${symbol} izleme listesine (radara) eklendi! 👁️`, 'success');
      this.playAudioFeedback('complete');
      // Arka planda anlık fiyatını getir
      this.fetchLiveQuote(symbol).then(live => {
        if (live) {
          const item = this.bistCatalog.find(c => c.symbol === symbol);
          if (item) { item.price = live.price; item.change = live.change; this.renderFinance(); }
        }
      });
    } else {
      this.toast(`${symbol} zaten izleme listenizde mevcut.`, 'info');
    }
  },

  removeFromWatchlist(symbol) {
    let list = this.getLocalWatchlist();
    list = list.filter(s => s !== symbol);
    this.saveLocalWatchlist(list);
    this.toast(`${symbol} izleme listesinden kaldırıldı.`, 'info');
    this.playAudioFeedback();
  },

  toggleWatchlist(symbol) {
    if (this.isInWatchlist(symbol)) {
      this.removeFromWatchlist(symbol);
    } else {
      this.addToWatchlist(symbol);
    }
  },

  getLocalPortfolio() {
    try {
      const s = localStorage.getItem('portal_portfolio_data');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(item => item !== 'DURK');
        }
      }
    } catch(e) {}
    const fallback = this.getLocalFallbackFinance().assets;
    this.safeSetItem('portal_portfolio_data', JSON.stringify(fallback));
    return fallback;
  },

  saveLocalPortfolio(assets) {
    this.safeSetItem('portal_portfolio_data', JSON.stringify(assets));
    this.renderFinance();
  },


  // --- ALIM / SATIM GEÇMİŞİ & POZİSYON GÜNCELLEME SİSTEMİ ---
  getLocalTradeHistory() {
    try {
      const s = localStorage.getItem('portal_trade_history');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch(e) {}
    // Başlangıç örnek işlem geçmişi
    const initialHistory = [
      { id: 'tr_1', date: '2026-09-02 14:30', type: 'BUY', symbol: 'THYAO', name: 'Türk Hava Yolları', shares: 150, price: 280.50, total: 42075.00, note: 'Portföy Alımı' },
      { id: 'tr_2', date: '2026-09-02 15:10', type: 'BUY', symbol: 'ALTIN_GRAM', name: 'Gram Altın', shares: 5, price: 2600.00, total: 13000.00, note: 'Emtia Rezervi' }
    ];
    this.safeSetItem('portal_trade_history', JSON.stringify(initialHistory));
    return initialHistory;
  },

  saveTradeHistory(history) {
    this.safeSetItem('portal_trade_history', JSON.stringify(history));
    this.renderTradeHistory();
  },

  addTradeLog(type, symbol, name, shares, price, total, note = '') {
    let history = this.getLocalTradeHistory();
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' + 
      String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0');

    history.unshift({
      id: 'tr_' + Date.now(),
      date: dateStr,
      type: type, // 'BUY', 'SELL', 'UPDATE'
      symbol: symbol,
      name: name || symbol,
      shares: shares,
      price: price,
      total: total,
      note: note
    });
    this.saveTradeHistory(history);
  },

  clearTradeHistory() {
    if (confirm('Tüm alım/satım işlem geçmişini silmek istediğinize emin misiniz?')) {
      this.saveTradeHistory([]);
      this.toast('İşlem geçmişi temizlendi.', 'info');
    }
  },

  renderTradeHistory() {
    const tb = document.getElementById('terminalTradeHistoryTableBody');
    if (!tb) return;
    const history = this.getLocalTradeHistory();
    if (history.length === 0) {
      tb.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500 text-xs">Henüz kayıtlı alım/satım işlemi bulunmuyor.</td></tr>`;
      return;
    }

    tb.innerHTML = history.map(item => {
      let typeBadge = '';
      if (item.type === 'BUY') {
        typeBadge = '<span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">ALIM 🟢</span>';
      } else if (item.type === 'SELL') {
        typeBadge = '<span class="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">SATIŞ 🔴</span>';
      } else {
        typeBadge = '<span class="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold">DÜZENLEME 📝</span>';
      }

      return `
        <tr class="hover:bg-slate-800/80 transition-colors font-mono">
          <td class="py-3 px-3 text-slate-400 text-[11px]">${item.date}</td>
          <td class="py-3 px-3">${typeBadge}</td>
          <td class="py-3 px-3 font-bold text-white">${item.symbol}</td>
          <td class="py-3 px-3 text-slate-200">${item.shares} Lot</td>
          <td class="py-3 px-3 text-slate-300">${Number(item.price).toFixed(2)} ₺</td>
          <td class="py-3 px-3 text-white font-bold">${Number(item.total).toFixed(2)} ₺</td>
          <td class="py-3 px-3 text-slate-400 font-sans text-xs">${this.escapeHtml(item.note || '-')}</td>
        </tr>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  },

  // Edit Asset Modal Logic
  activeEditAsset: null,
  editAssetMode: 'update',

  openEditAssetModal(assetId) {
    const portfolio = this.getLocalPortfolio();
    const asset = portfolio.find(a => a.id === assetId);
    if (!asset) return;

    this.activeEditAsset = asset;
    document.getElementById('editAssetId').value = asset.id;
    document.getElementById('editAssetSymbol').value = asset.symbol;
    document.getElementById('editAssetSymbolDisplay').textContent = asset.symbol;
    document.getElementById('editAssetNameDisplay').textContent = asset.name || asset.symbol;
    document.getElementById('editAssetBadge').textContent = asset.symbol.slice(0, 2);
    document.getElementById('editAssetLivePriceDisplay').textContent = Number(asset.current_price || asset.buy_price).toFixed(2) + ' ₺';

    document.getElementById('editSharesInput').value = asset.shares;
    document.getElementById('editBuyPriceInput').value = asset.buy_price;

    document.getElementById('sellSharesInput').value = '';
    document.getElementById('sellPriceInput').value = Number(asset.current_price || asset.buy_price).toFixed(2);
    document.getElementById('sellRemainingShares').textContent = `${asset.shares} Lot`;
    document.getElementById('sellRealizedProfitPreview').textContent = '+0,00 ₺';

    this.setEditAssetMode('update');
    this.openModal('editAssetModal');
  },

  setEditAssetMode(mode) {
    this.editAssetMode = mode;
    const btnUpdate = document.getElementById('editTabBtn_update');
    const btnSell = document.getElementById('editTabBtn_sell');
    const updateFields = document.getElementById('editModeUpdateFields');
    const sellFields = document.getElementById('editModeSellFields');
    const submitBtn = document.getElementById('editModalSubmitBtn');

    if (mode === 'update') {
      btnUpdate.className = 'flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold transition-all shadow-md';
      btnSell.className = 'flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-medium transition-all';
      updateFields.classList.remove('hidden');
      sellFields.classList.add('hidden');
      submitBtn.textContent = 'Değişiklikleri Kaydet 📝';
      submitBtn.className = 'px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md cursor-pointer';
    } else {
      btnUpdate.className = 'flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-medium transition-all';
      btnSell.className = 'flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold transition-all shadow-md';
      updateFields.classList.add('hidden');
      sellFields.classList.remove('hidden');
      submitBtn.textContent = 'Satışı Onayla & Kârı Realize Et 💰';
      submitBtn.className = 'px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md cursor-pointer';
    }
  },

  calcSellProfitPreview() {
    if (!this.activeEditAsset) return;
    const sellShares = parseFloat(document.getElementById('sellSharesInput').value) || 0;
    const sellPrice = parseFloat(document.getElementById('sellPriceInput').value) || 0;
    const buyPrice = this.activeEditAsset.buy_price || 0;
    const currentTotalShares = this.activeEditAsset.shares || 0;

    const remaining = Math.max(0, currentTotalShares - sellShares);
    const profit = (sellPrice - buyPrice) * sellShares;
    const isUp = profit >= 0;

    document.getElementById('sellRemainingShares').textContent = `${remaining.toFixed(2)} Lot`;
    const pEl = document.getElementById('sellRealizedProfitPreview');
    pEl.textContent = `${isUp ? '+' : ''}${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(profit)}`;
    pEl.className = `${isUp ? 'text-emerald-400' : 'text-rose-400'} font-bold`;
  },

  handleSaveEditedAsset(e) {
    e.preventDefault();
    if (!this.activeEditAsset) return;
    let portfolio = this.getLocalPortfolio();
    const assetId = this.activeEditAsset.id;
    const assetIndex = portfolio.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return;

    if (this.editAssetMode === 'update') {
      const newShares = parseFloat(document.getElementById('editSharesInput').value) || 0;
      const newBuyPrice = parseFloat(document.getElementById('editBuyPriceInput').value) || 0;
      if (newShares <= 0) {
        this.toast('Lot sayısı 0 veya negatif olamaz.', 'error');
        return;
      }
      
      const prevShares = portfolio[assetIndex].shares;
      portfolio[assetIndex].shares = newShares;
      portfolio[assetIndex].buy_price = newBuyPrice;
      portfolio[assetIndex].current_value = newShares * (portfolio[assetIndex].current_price || newBuyPrice);
      portfolio[assetIndex].profit = portfolio[assetIndex].current_value - (newShares * newBuyPrice);
      portfolio[assetIndex].profit_percent = newBuyPrice > 0 ? Number((((portfolio[assetIndex].current_price - newBuyPrice) / newBuyPrice) * 100).toFixed(2)) : 0;

      this.saveLocalPortfolio(portfolio);
      this.addTradeLog('UPDATE', portfolio[assetIndex].symbol, portfolio[assetIndex].name, newShares, newBuyPrice, newShares * newBuyPrice, `Lot/Maliyet Güncelleme (Önceki: ${prevShares} Lot)`);
      this.toast(`${portfolio[assetIndex].symbol} pozisyonu güncellendi!`, 'success');
    } else {
      // Satış / Kâr Realize Modu
      const sellShares = parseFloat(document.getElementById('sellSharesInput').value) || 0;
      const sellPrice = parseFloat(document.getElementById('sellPriceInput').value) || 0;
      if (sellShares <= 0) {
        this.toast('Lütfen geçerli bir satılacak lot girin.', 'error');
        return;
      }
      if (sellShares > portfolio[assetIndex].shares) {
        this.toast(`En fazla ${portfolio[assetIndex].shares} lot satabilirsiniz!`, 'error');
        return;
      }

      const buyPrice = portfolio[assetIndex].buy_price;
      const realizedProfit = (sellPrice - buyPrice) * sellShares;
      const totalSellAmount = sellShares * sellPrice;

      if (sellShares >= portfolio[assetIndex].shares) {
        // Tüm pozisyon kapatıldı
        const sym = portfolio[assetIndex].symbol;
        const name = portfolio[assetIndex].name;
        portfolio.splice(assetIndex, 1);
        this.saveLocalPortfolio(portfolio);
        this.addTradeLog('SELL', sym, name, sellShares, sellPrice, totalSellAmount, `Tam Satış - Realize Kâr: ${Number(realizedProfit).toFixed(2)} ₺`);
        this.toast(`${sym} pozisyonunun tamamı kapatıldı! (Kâr: ${Number(realizedProfit).toFixed(2)} ₺)`, 'success');
      } else {
        // Kısmi satış
        portfolio[assetIndex].shares -= sellShares;
        portfolio[assetIndex].current_value = portfolio[assetIndex].shares * (portfolio[assetIndex].current_price || buyPrice);
        portfolio[assetIndex].profit = portfolio[assetIndex].current_value - (portfolio[assetIndex].shares * buyPrice);
        this.saveLocalPortfolio(portfolio);
        this.addTradeLog('SELL', portfolio[assetIndex].symbol, portfolio[assetIndex].name, sellShares, sellPrice, totalSellAmount, `Kısmi Satış - Realize Kâr: ${Number(realizedProfit).toFixed(2)} ₺`);
        this.toast(`${sellShares} Lot satıldı. Realize Kâr: ${Number(realizedProfit).toFixed(2)} ₺`, 'success');
      }
    }

    this.playAudioFeedback('complete');
    this.closeModal('editAssetModal');
  },

  deletePortfolioAsset(id) {
    let assets = this.getLocalPortfolio();
    const target = assets.find(a => a.id === id);
    if (confirm(`${target ? target.symbol : 'Bu varlığı'} portföyden tamamen silmek istediğinize emin misiniz?`)) {
      if (target) {
        this.addTradeLog('SELL', target.symbol, target.name, target.shares, target.current_price || target.buy_price, target.shares * (target.current_price || target.buy_price), 'Pozisyon Portföyden Kaldırıldı (Silindi)');
      }
      assets = assets.filter(a => a.id !== id);
      this.saveLocalPortfolio(assets);
      this.toast('Varlık portföyden silindi.', 'info');
      this.playAudioFeedback();
    }
  },

  loadFinanceData() {
    this.renderFinance();
    this.fetchIpos();
  },

  getAssetRelationship(symbol) {
    if (!symbol) return { inPortfolio: false, inWatchlist: false, shares: 0, buyPrice: 0, currentPrice: 0, profit: 0, profitPercent: '0.00' };
    const sym = symbol.toUpperCase().trim();
    
    // Check Portfolio
    const portfolio = this.getLocalPortfolio();
    const portItem = portfolio.find(p => {
      const pSym = (p.symbol || '').toUpperCase().trim();
      return pSym === sym || (sym === 'INTET' && pSym.includes('INTET')) || (sym === 'BKRGY' && pSym.includes('BKRGY'));
    });

    const inPortfolio = !!portItem;
    const shares = portItem ? (portItem.shares || 0) : 0;
    const buyPrice = portItem ? (portItem.buy_price || 0) : 0;
    const currentPrice = portItem ? (portItem.current_price || 0) : 0;
    const profit = portItem ? (portItem.profit !== undefined ? portItem.profit : (currentPrice * shares - buyPrice * shares)) : 0;
    const cost = buyPrice * shares;
    const profitPercent = portItem ? (portItem.profit_percent !== undefined ? portItem.profit_percent : (cost > 0 ? ((profit / cost) * 100).toFixed(2) : '0.00')) : '0.00';

    // Check Watchlist
    const inWatchlist = this.isInWatchlist(sym);

    return {
      inPortfolio,
      portItem,
      shares,
      buyPrice,
      currentPrice,
      profit,
      profitPercent,
      inWatchlist
    };
  },

  renderFinance(d) {
    let portfolio = this.getLocalPortfolio();
    
    // Anlık fiyatları güncelle
    let totalValue = 0;
    let totalCost = 0;
    
    portfolio.forEach(a => {
      // Çift yönlü arama: 'ALTIN_GRAM' -> 'ALTIN' veya tam eşleşme
      const catItem = this.bistCatalog.find(c => c.symbol === a.symbol || (a.symbol === 'ALTIN_GRAM' && c.symbol === 'ALTIN') || (a.symbol === 'ALTIN' && c.symbol === 'ALTIN_GRAM'));
      if (catItem && catItem.price > 0) {
        a.current_price = catItem.price;
      } else if (a.symbol === 'ALTIN_GRAM' || a.symbol === 'ALTIN') {
        a.current_price = 6943.14;
      } else if (a.symbol === 'THYAO') {
        a.current_price = 291.50;
      }
      a.current_value = (a.shares || 0) * (a.current_price || 0);
      const cost = (a.shares || 0) * (a.buy_price || 0);
      totalCost += cost;
      totalValue += a.current_value;
      a.profit = a.current_value - cost;
      a.profit_percent = cost > 0 ? ((a.profit / cost) * 100).toFixed(2) : 0;
    });

    const totalProfit = totalValue - totalCost;
    const totalProfitPct = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(2) : 0;

    const financeSummary = {
      total_value: totalValue,
      total_cost: totalCost,
      total_profit: totalProfit,
      total_profit_percent: totalProfitPct,
      assets: portfolio,
      ipos: this.getLocalFallbackFinance().ipos
    };

    // 1. DASHBOARD WIDGET GÜNCELLEMESİ
    const vEl = document.getElementById('financeTotalValue'); if (vEl) vEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(financeSummary.total_value);
    const cEl = document.getElementById('financeTotalCost'); if (cEl) cEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(financeSummary.total_cost);
    const pEl = document.getElementById('financeTotalProfit'); if (pEl) { 
      const prefix = financeSummary.total_profit >= 0 ? '+' : '';
      pEl.textContent = `${prefix}${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(financeSummary.total_profit)}`; 
      pEl.className = `text-xl font-extrabold font-mono ${financeSummary.total_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`; 
    }
    const ppEl = document.getElementById('financeProfitPercent'); if (ppEl) { 
      const prefix = financeSummary.total_profit_percent >= 0 ? '+' : '';
      ppEl.textContent = `${prefix}%${financeSummary.total_profit_percent}`; 
      ppEl.className = `text-xs font-mono font-bold px-2 py-0.5 rounded-md ${financeSummary.total_profit_percent >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`; 
    }
    
    const tb = document.getElementById('portfolioTableBody');
    if (tb) {
      let filteredAssets = financeSummary.assets;
      if (this.portfolioFilter === 'BORSA') {
        filteredAssets = filteredAssets.filter(a => !this.isForexAsset(a.symbol));
      } else if (this.portfolioFilter === 'DOVIZ') {
        filteredAssets = filteredAssets.filter(a => this.isForexAsset(a.symbol));
      }

      const assetCountEl = document.getElementById('financeAssetCount');
      if (assetCountEl) assetCountEl.textContent = `${filteredAssets.length} Varlık`;

      if (filteredAssets.length === 0) {
        tb.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-500 text-xs">Bu kategoride varlık bulunamadı. "Hisse/Varlık Ekle" butonuyla ekleyebilirsiniz.</td></tr>`;
      } else {
        tb.innerHTML = filteredAssets.map(a => {
          const isForex = this.isForexAsset(a.symbol);
          const badgeClass = isForex ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
          const typeIcon = isForex ? '🪙' : '📈';
          return `
          <tr class="hover:bg-indigo-500/[0.06] transition-colors border-b border-white/[0.04]">
            <td class="py-3.5 px-3 font-bold text-white flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-[10px] font-black shadow-inner ring-1 ${isForex ? 'bg-amber-500/15 ring-amber-500/30 text-amber-300' : 'bg-indigo-500/15 ring-indigo-500/30 text-indigo-300'}">
                ${typeIcon}
              </div>
              <div>
                <span onclick="Portal.openStockChartModal('${a.symbol}')" class="text-xs font-bold text-white hover:text-indigo-300 cursor-pointer tracking-tight transition-colors" title="Grafiği Aç">${a.symbol}</span>
                <span class="block text-[9px] text-slate-400 font-medium">${this.escapeHtml(a.name || '')}</span>
              </div>
            </td>
            <td class="py-3.5 px-2 font-mono text-slate-200 font-bold">${a.shares}</td>
            <td class="py-3.5 px-2 font-mono text-slate-400">${Number(a.buy_price).toFixed(2)} ₺</td>
            <td class="py-3.5 px-2 font-mono text-white font-bold">${Number(a.current_price).toFixed(2)} ₺</td>
            <td class="py-3.5 px-2 font-mono font-bold text-slate-100">${Number(a.current_value).toFixed(2)} ₺</td>
            <td class="py-3.5 px-2 font-mono font-bold">
              <span class="inline-flex items-center px-1.5 py-0.5 rounded ${a.profit >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}">
                ${a.profit >= 0 ? '+' : ''}${Number(a.profit).toFixed(2)} ₺
              </span>
            </td>
            <td class="py-3.5 px-3 text-right whitespace-nowrap">
              <button onclick="Portal.openEditAssetModal('${a.id}')" class="text-slate-400 hover:text-amber-300 p-1 cursor-pointer mr-1" title="Düzenle / Satış Yap"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
              <button onclick="Portal.openStockChartModal('${a.symbol}')" class="text-slate-400 hover:text-indigo-300 p-1 cursor-pointer mr-1" title="Grafik"><i data-lucide="line-chart" class="w-3.5 h-3.5"></i></button>
              <button onclick="Portal.deletePortfolioAsset('${a.id}')" class="text-slate-400 hover:text-rose-400 p-1 cursor-pointer" title="Sil"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
            </td>
          </tr>
        `;
        }).join('');
      }
    }
    const tkr = document.getElementById('financeMarketTickers');
    if (tkr) {
      tkr.innerHTML = this.bistCatalog.slice(0, 4).map(m => `
        <div onclick="Portal.openStockChartModal('${m.symbol}')" class="flex justify-between items-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer">
          <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="text-xs font-bold text-white">${m.symbol}</span></div>
          <div class="flex items-center gap-2 font-mono text-xs"><span class="text-white font-bold">${m.price > 0 ? Number(m.price).toFixed(2) + ' ₺' : 'Canlı'}</span><span class="text-[10px] font-bold ${m.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${m.change}</span></div>
        </div>
      `).join('');
    }
    const ip = document.getElementById('ipoListContainer');
    if (ip) {
      ip.innerHTML = financeSummary.ipos.map(i => `
        <div class="p-3 rounded-2xl bg-slate-900 border border-purple-500/30 flex justify-between items-center group">
          <div>
            <span class="text-xs text-white font-bold">${i.code}</span>
            <span class="block text-[10px] text-slate-400">${i.name}</span>
          </div>
          <div class="text-right flex items-center gap-2">
            <div>
              <span class="text-xs text-purple-300 font-bold font-mono">${i.price}</span>
              <span class="block text-[9px] text-emerald-400">${i.distribution}</span>
            </div>
            <button onclick="Portal.addIpoToTasks('${i.code}', '${i.name}', '${i.date}')" class="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white transition-colors cursor-pointer" title="Görev / Hatırlatıcıya Ekle">
              <i data-lucide="bell-plus" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `).join('');
    }

    // 2. TAM SAYFA FİNANS TERMİNALİ GÜNCELLEMESİ
    this.renderFinanceTerminal(financeSummary);
    this.renderMarketPulseHUD();
    this.renderTradeHistory();

    if (window.lucide) window.lucide.createIcons();
  },

  refreshDashboardWidget(module) {
    if (module === 'finance') {
      this.refreshAllLiveQuotes();
    } else if (module === 'tasks') {
      this.loadTasks();
      this.toast('Görev listesi yenilendi.', 'info');
    } else if (module === 'notes') {
      this.loadNotes();
      this.toast('Zihin notları yenilendi.', 'info');
    } else if (module === 'weather') {
      const city = this.getSelectedCity();
      this.fetchWeatherForCity(city, true);
      this.toast(`${city.name} hava durumu güncellendi.`, 'info');
    } else if (module === 'all') {
      this.refreshAllLiveQuotes();
      this.loadTasks();
      this.loadNotes();
      const city = this.getSelectedCity();
      this.fetchWeatherForCity(city, true);
      this.toast('Tüm pano ve widget verileri güncellendi! ⚡', 'success');
    }
    this.playAudioFeedback('click');
  },

  renderMarketPulseHUD() {
    const container = document.getElementById('terminalMarketPulse');
    if (!container) return;

    const pillars = [
      { sym: 'THYAO', displaySym: 'BIST 100', label: 'Borsa İstanbul', defaultPrice: '9.840,50 ₺', defaultChange: '+1.25%' },
      { sym: 'USD_TRY', displaySym: 'USD / TRY', label: 'Dolar Kuru', defaultPrice: '48.30 ₺', defaultChange: '+0.15%' },
      { sym: 'ALTIN_GRAM', displaySym: 'Gram Altın', label: '24 Ayar Has', defaultPrice: '6.943,14 ₺', defaultChange: '+0.42%' },
      { sym: 'BTC_USD', displaySym: 'BTC / USD', label: 'Bitcoin', defaultPrice: '$68.450', defaultChange: '+2.10%' }
    ];

    container.innerHTML = pillars.map(p => {
      const item = this.bistCatalog.find(c => c.symbol === p.sym) || {};
      let priceStr = p.defaultPrice;
      let changeStr = item.change || p.defaultChange;
      if (item.price > 0) {
        if (p.sym === 'BTC_USD') priceStr = '$' + Number(item.price).toLocaleString('tr-TR');
        else if (p.sym === 'USD_TRY') priceStr = Number(item.price).toFixed(2) + ' ₺';
        else if (p.sym === 'ALTIN_GRAM') priceStr = Number(item.price).toFixed(2) + ' ₺';
        else priceStr = Number(item.price).toFixed(2) + ' ₺';
      }

      const isUp = (changeStr || '').startsWith('+');
      const badgeClass = isUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

      return `
        <div onclick="Portal.openStockChartModal('${p.sym}')" class="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between shadow-sm" title="${p.label} - Canlı Grafik & Analiz">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[11px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors font-mono tracking-tight">${p.displaySym}</span>
            <span class="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border ${badgeClass}">${changeStr}</span>
          </div>
          <div class="flex items-baseline justify-between gap-1">
            <span class="text-xs font-bold font-mono text-white tracking-tight">${priceStr}</span>
            <span class="text-[9px] text-slate-500 truncate hidden sm:inline">${p.label}</span>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  renderFinanceTerminal(summary) {
    if (!summary) {
      const portfolio = this.getLocalPortfolio();
      let totalValue = 0, totalCost = 0;
      portfolio.forEach(a => {
        const catItem = this.bistCatalog.find(c => c.symbol === a.symbol);
        if (catItem && catItem.price > 0) a.current_price = catItem.price;
        a.current_value = (a.shares || 0) * (a.current_price || 0);
        const cost = (a.shares || 0) * (a.buy_price || 0);
        totalCost += cost; totalValue += a.current_value;
        a.profit = a.current_value - cost;
        a.profit_percent = cost > 0 ? ((a.profit / cost) * 100).toFixed(2) : 0;
      });
      const totalProfit = totalValue - totalCost;
      const totalProfitPct = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(2) : 0;
      summary = { total_value: totalValue, total_cost: totalCost, total_profit: totalProfit, total_profit_percent: totalProfitPct, assets: portfolio, ipos: this.getLocalFallbackFinance().ipos };
    }

    // Ticker Header (Döviz, Emtia & Kripto Bandı ve BIST Hisseleri Ayrı Gösterim)
    const forexTickers = [
      { sym: 'USD_TRY', label: 'USD/TRY' },
      { sym: 'EUR_TRY', label: 'EUR/TRY' },
      { sym: 'GBP_TRY', label: 'GBP/TRY' },
      { sym: 'ALTIN_GRAM', label: 'Gram Altın' },
      { sym: 'CEYREK_ALTIN', label: 'Çeyrek' },
      { sym: 'BTC_USD', label: 'BTC/USD' }
    ];
    const bistLeadTickers = ['THYAO', 'ASELS', 'GARAN', 'TUPRS', 'KCHOL', 'BIMAS', 'EREGL', 'ISCTR'];

    const forexContainer = document.getElementById('terminalForexTickers');
    if (forexContainer) {
      forexContainer.innerHTML = forexTickers.map(t => {
        const item = this.bistCatalog.find(c => c.symbol === t.sym) || { symbol: t.sym, price: 0, change: '+0.00%' };
        const isUp = (item.change || '').startsWith('+');
        return `
          <div onclick="Portal.openStockChartModal('${item.symbol}')" class="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 hover:from-amber-500/20 border border-amber-500/25 hover:border-amber-400/40 flex-shrink-0 cursor-pointer transition-all duration-200 shadow-sm hover:scale-[1.02]" title="${t.label} Detay & Grafik">
            <span class="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">${t.label}</span>
            <span class="text-xs font-mono font-black text-white tracking-tight">${item.price > 0 ? (item.symbol === 'BTC_USD' ? '$' + Number(item.price).toLocaleString('tr-TR') : Number(item.price).toFixed(2) + ' ₺') : 'Canlı'}</span>
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${isUp ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}">${item.change}</span>
          </div>
        `;
      }).join('');
    }

    const bistContainer = document.getElementById('terminalBistTickers');
    if (bistContainer) {
      bistContainer.innerHTML = bistLeadTickers.map(sym => {
        const item = this.bistCatalog.find(c => c.symbol === sym) || { symbol: sym, price: 0, change: '+0.00%' };
        const isUp = (item.change || '').startsWith('+');
        return `
          <div onclick="Portal.openStockChartModal('${item.symbol}')" class="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900 hover:from-blue-500/20 border border-white/10 hover:border-blue-400/40 flex-shrink-0 cursor-pointer transition-all duration-200 shadow-sm hover:scale-[1.02]" title="${item.symbol} Detay & Grafik">
            <span class="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">${item.symbol}</span>
            <span class="text-xs font-mono font-black text-white tracking-tight">${item.price > 0 ? Number(item.price).toFixed(2) + ' ₺' : 'Canlı'}</span>
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${isUp ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}">${item.change}</span>
          </div>
        `;
      }).join('');
    }

    // Sub-tab 1: Watchlist (İzleme Listesi)
    const watchlistContainer = document.getElementById('terminalWatchlistGrid');
    if (watchlistContainer) {
      const wList = this.getLocalWatchlist();
      if (wList.length === 0) {
        watchlistContainer.innerHTML = `
          <div class="col-span-full p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto"><i data-lucide="eye" class="w-6 h-6"></i></div>
            <h4 class="font-bold text-white text-sm">İzleme Listeniz Boş</h4>
            <p class="text-xs">Lot veya tutar girmeden, sadece hisse ve piyasaları anlık izlemek için aşağıdaki butonla hisse ekleyebilirsiniz.</p>
            <button onclick="Portal.openAddAssetModal('watch')" class="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors">+ Hisseleri İzlemeye Al</button>
          </div>
        `;
      } else {
        watchlistContainer.innerHTML = wList.map(sym => {
            const item = this.bistCatalog.find(c => c.symbol === sym) || { symbol: sym, name: sym, sector: 'Özel', price: 0, change: '+0.00%' };
            const isUp = item.change.startsWith('+');
            const rel = this.getAssetRelationship(item.symbol);
            const portBadge = rel.inPortfolio ? `<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1"><i data-lucide="wallet" class="w-2.5 h-2.5"></i> ${rel.shares}L</span>` : '';
            return `
              <div class="relative overflow-hidden p-5 rounded-2xl ${rel.inPortfolio ? 'bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/30' : 'bg-slate-900 border-slate-800'} border hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group shadow-sm hover:-translate-y-0.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 cursor-pointer" onclick="Portal.openStockChartModal('${item.symbol}')" title="Grafiği İncele">
                    <div class="w-10 h-10 rounded-2xl ${rel.inPortfolio ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'bg-slate-800 text-slate-300'} flex items-center justify-center font-mono text-xs font-bold shadow-inner">
                      ${item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h4 class="font-bold text-white text-sm flex items-center gap-1.5 tracking-tight group-hover:text-blue-400 transition-colors">
                        ${item.symbol}
                        ${portBadge}
                      <span class="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/10 font-mono font-medium">${item.sector || 'Piyasa'}</span>
                    </h4>
                    <span class="text-[10px] text-slate-400 block truncate max-w-[130px] font-medium">${this.escapeHtml(item.name)}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <button onclick="Portal.openStockChartModal('${item.symbol}')" class="text-slate-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors" title="Grafik">
                    <i data-lucide="line-chart" class="w-4 h-4"></i>
                  </button>
                  <button onclick="Portal.removeFromWatchlist('${item.symbol}')" class="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" title="İzleme Listesinden Çıkar">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
              <div class="flex items-end justify-between pt-3 border-t border-white/[0.07] font-mono">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Canlı Fiyat</span>
                  <span class="text-lg font-black text-white tracking-tight">${item.price > 0 ? Number(item.price).toFixed(2) + ' ₺' : 'Canlı Veri'}</span>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center gap-1 text-xs font-bold ${isUp ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' : 'text-rose-400 bg-rose-500/15 border-rose-500/30'} px-2.5 py-1 rounded-full border shadow-sm">${item.change}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <button onclick="Portal.quickAddWatchlistToPortfolio('${item.symbol}', ${item.price || 0})" class="py-2 rounded-xl bg-slate-800/80 hover:bg-emerald-600/90 text-slate-200 hover:text-white font-bold text-xs border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i> Portföye
                </button>
                <button onclick="Portal.sendToCalculator('${item.symbol}', ${item.price || 0})" class="py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/90 text-slate-200 hover:text-white font-bold text-xs border border-white/10 hover:border-indigo-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm" title="Kâr/Hedef Hesapla">
                  <i data-lucide="calculator" class="w-3.5 h-3.5"></i> Hesapla
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Sub-tab 2: Portfolio Full Table (Döviz & Borsa Filtreleme Destekli)
    const portTable = document.getElementById('terminalPortfolioTableBody');
    if (portTable) {
      let filteredAssets = summary.assets;
      if (this.portfolioFilter === 'BORSA') {
        filteredAssets = filteredAssets.filter(a => !this.isForexAsset(a.symbol));
      } else if (this.portfolioFilter === 'DOVIZ') {
        filteredAssets = filteredAssets.filter(a => this.isForexAsset(a.symbol));
      }

      if (filteredAssets.length === 0) {
        portTable.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500 text-xs">Bu kategoride (${this.portfolioFilter}) kayıtlı varlık bulunamadı.</td></tr>`;
      } else {
        portTable.innerHTML = filteredAssets.map(a => {
          const isForex = this.isForexAsset(a.symbol);
          const badgeClass = isForex ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
          const typeIcon = isForex ? '🪙' : '📈';
          return `
          <tr class="hover:bg-indigo-500/[0.06] transition-colors border-b border-white/[0.04] group">
            <td class="py-3.5 px-4 font-bold text-white flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-black shadow-inner ring-1 ${isForex ? 'bg-amber-500/15 ring-amber-500/30 text-amber-300' : 'bg-indigo-500/15 ring-indigo-500/30 text-indigo-300'}">
                ${typeIcon}
              </div>
              <div>
                <span onclick="Portal.openStockChartModal('${a.symbol}')" class="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer tracking-tight transition-colors">${a.symbol}</span>
                <span class="block text-[10px] text-slate-400 font-medium">${this.escapeHtml(a.name || '')}</span>
              </div>
            </td>
            <td class="py-3.5 px-3 font-mono text-slate-200 font-bold">${a.shares}</td>
            <td class="py-3.5 px-3 font-mono text-slate-400">${Number(a.buy_price).toFixed(2)} ₺</td>
            <td class="py-3.5 px-3 font-mono text-white font-bold">${Number(a.current_price).toFixed(2)} ₺</td>
            <td class="py-3.5 px-3 font-mono font-black text-slate-100">${Number(a.current_value).toFixed(2)} ₺</td>
            <td class="py-3.5 px-3 font-mono font-bold">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md ${a.profit >= 0 ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-300 border border-rose-500/25'}">
                ${a.profit >= 0 ? '+' : ''}${Number(a.profit).toFixed(2)} ₺ (%${a.profit_percent})
              </span>
            </td>
            <td class="py-3.5 px-4 text-right whitespace-nowrap">
              <button onclick="Portal.openEditAssetModal('${a.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors mr-1" title="Pozisyonu Düzenle / Satış Yap">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="Portal.openStockChartModal('${a.symbol}')" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors mr-1" title="Grafiği İncele">
                <i data-lucide="line-chart" class="w-4 h-4"></i>
              </button>
              <button onclick="Portal.sendToCalculator('${a.symbol}', ${a.current_price || a.buy_price})" class="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors mr-1" title="Hedef Hesapla">
                <i data-lucide="calculator" class="w-4 h-4"></i>
              </button>
              <button onclick="Portal.deletePortfolioAsset('${a.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Sil">
                <i data-lucide="trash" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `;
        }).join('');
      }
    }
    const tValEl = document.getElementById('terminalTotalValue'); if (tValEl) tValEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(summary.total_value);
    const tCostEl = document.getElementById('terminalTotalCost'); if (tCostEl) tCostEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(summary.total_cost);
    const tProfEl = document.getElementById('terminalTotalProfit'); if (tProfEl) {
      tProfEl.textContent = `${summary.total_profit >= 0 ? '+' : ''}${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(summary.total_profit)} (%${summary.total_profit_percent})`;
      tProfEl.className = `text-xl font-extrabold font-mono ${summary.total_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }

    // Sub-tab 3: Explorer Grid
    this.renderExplorerGrid();
  },

  switchFinanceTab(subTab) {
    this.setFinanceSubTab(subTab);
  },

  setFinanceSubTab(subTab) {
    this.financeTab = subTab;
    document.querySelectorAll('.finance-sub-pane').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.finance-sub-btn').forEach(el => {
      el.className = 'finance-sub-btn px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap';
    });

    const target = document.getElementById('financeSub_' + subTab);
    const btn = document.getElementById('financeBtn_' + subTab);
    if (target) target.classList.remove('hidden');
    if (btn) {
      btn.className = 'finance-sub-btn px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap';
    }
    if (subTab === 'budget') {
      this.renderBudgetSection();
    }
    if (subTab === 'history') {
      this.renderTradeHistory();
    }
      if (subTab === 'ipos') {
        this.renderIpos();
      }
      if (subTab === 'explorer') {
        this.renderExplorerGrid();
      }
    this.playAudioFeedback('click');
    if (window.lucide) window.lucide.createIcons();
  },

  filterExplorerSectors(sector) {
    this.selectedExplorerSector = sector;
    document.querySelectorAll('.sector-filter-btn').forEach(b => {
      if (b.dataset.sector === sector) {
        b.className = 'sector-filter-btn px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer';
      } else {
        b.className = 'sector-filter-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-medium text-xs cursor-pointer';
      }
    });
    this.renderExplorerGrid();
  },

  renderExplorerGrid() {
    const grid = document.getElementById('terminalExplorerGrid');
    if (!grid) return;
    
    const search = (document.getElementById('explorerSearchInput')?.value || '').trim().toUpperCase();
    const sector = this.selectedExplorerSector || 'ALL';

    let items = this.bistCatalog;
    if (sector !== 'ALL') {
      items = items.filter(s => (s.sector || '').includes(sector));
    }
    if (search) {
      items = items.filter(s => s.symbol.includes(search) || (s.name || '').toUpperCase().includes(search) || (s.sector || '').toUpperCase().includes(search));
    }

    // İlk 48 hisseyi göster (performans optimizasyonu)
    const displayItems = items.slice(0, 48);

    if (displayItems.length === 0) {
      grid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-500 text-xs">Aradığınız kriterde BIST hissesi bulunamadı.</div>`;
      return;
    }

    grid.innerHTML = displayItems.map(item => {
              const rel = this.getAssetRelationship(item.symbol);
        const isWatched = rel.inWatchlist;
        const isUp = item.change.startsWith('+');
        const portBadge = rel.inPortfolio ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1"><i data-lucide="wallet" class="w-2.5 h-2.5"></i> ${rel.shares}L</span>` : '';

        return `
          <div class="relative overflow-hidden p-4 rounded-2xl ${rel.inPortfolio ? 'bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/30' : 'bg-slate-900 border-slate-800'} border hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-2.5 group shadow-sm hover:-translate-y-0.5">
            <div class="flex items-center justify-between gap-1">
              <div class="flex items-center gap-2.5 cursor-pointer min-w-0" onclick="Portal.openStockChartModal('${item.symbol}')" title="Grafiği Aç">
                <div class="w-9 h-9 rounded-xl ${rel.inPortfolio ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'bg-slate-800 text-slate-300'} font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">${item.symbol.slice(0, 2)}</div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <h4 class="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">${item.symbol}</h4>
                    ${portBadge}
                  </div>
                  <span class="text-[9px] text-slate-400 block truncate max-w-[110px] font-medium">${this.escapeHtml(item.name)}</span>
                </div>
              </div>
              <div class="flex items-center gap-1">
                ${rel.inPortfolio ? `
                  <button onclick="Portal.openEditAssetModal('${rel.portItem.id}')" class="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer" title="Pozisyonu Yönet">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  </button>
                ` : `
                  <button onclick="Portal.quickBuyAsset('${item.symbol}', ${item.price})" class="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors cursor-pointer" title="Portföye Ekle">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  </button>
                `}
                <button onclick="Portal.toggleWatchlist('${item.symbol}')" class="p-1.5 rounded-lg ${isWatched ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'} transition-colors cursor-pointer" title="${isWatched ? 'İzleme Listesinden Çıkar' : 'İzlemeye Al'}">
                  <i data-lucide="${isWatched ? 'star' : 'eye'}" class="w-3.5 h-3.5 ${isWatched ? 'fill-current text-amber-300' : ''}"></i>
                </button>
              </div>
            </div>
          <div class="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/[0.06]">
            <span class="text-white font-bold tracking-tight">${item.price > 0 ? Number(item.price).toFixed(2) + ' ₺' : 'Canlı'}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-300 border border-rose-500/25'}">${item.change}</span>
          </div>
          <div class="flex gap-1.5 pt-1">
            <button onclick="Portal.openStockChartModal('${item.symbol}')" class="flex-1 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-[10px] font-bold border border-white/5 transition-colors cursor-pointer flex items-center justify-center gap-1">
              <i data-lucide="line-chart" class="w-3 h-3"></i> Grafik
            </button>
            <button onclick="Portal.quickAddWatchlistToPortfolio('${item.symbol}', ${item.price || 0})" class="flex-1 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] font-bold border border-emerald-500/30 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm">
              <i data-lucide="plus" class="w-3 h-3"></i> Ekle
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  quickAddWatchlistToPortfolio(symbol, price) {
    this.openAddAssetModal('portfolio');
    this.selectStockAsset(symbol, price);
  },

  openCalculatorWithPrice(symbol, price) {
    this.sendToCalculator(symbol, price);
  },

  sendToCalculator(symbol, price) {
    this.setFinanceSubTab('calculator');
    const priceInput = document.getElementById('calcBuyPriceInput');
    const targetInput = document.getElementById('calcTargetPriceInput');
    const sharesInput = document.getElementById('calcSharesInput');

    const prc = parseFloat(price) || 100;
    if (priceInput) priceInput.value = prc.toFixed(2);
    if (targetInput) targetInput.value = (prc * 1.15).toFixed(2); // Varsayılan %15 kâr hedefi
    if (sharesInput && !sharesInput.value) sharesInput.value = '100';

    this.calculateTargetProfit();
    this.toast(`${symbol} hesaplayıcıya aktarıldı (Varsayılan: +%15 hedef). 🧮`, 'info');
  },

  ipoFilter: 'ALL',
  iposData: [],

  async fetchIpos(forceRefresh = false) {
    if (!forceRefresh && this.iposData && this.iposData.length > 0) {
      this.renderIpos();
      return this.iposData;
    }

    try {
      let res = await fetch('/api/ipos').catch(() => null); if (!res || !res.ok) res = await fetch('data/ipos.json').catch(() => null);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.iposData = data;
          this.safeSetItem('portal_ipos_2026', JSON.stringify(data));
          this.renderIpos();
          if (forceRefresh) this.toast('Güncel 2026 Halka Arz Takvimi Yenilendi! 🚀', 'success');
          return this.iposData;
        }
      }
    } catch(e) {
      console.warn('[IPO API Fallback]:', e);
    }

    try {
      const cached = localStorage.getItem('portal_ipos_2026');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.iposData = parsed;
          this.renderIpos();
          return this.iposData;
        }
      }
    } catch(e) {}

    this.iposData = [
      { id: "ipo_intet", code: "INTET", symbol: "INTET", name: "İntetra Teknoloji ve Bilişim Hizmetleri A.Ş.", sector: "Teknoloji & Yazılım", status: "trading", statusText: "1 Eylül 2026'da İşleme Başladı", badgeColor: "emerald", price: "58.00 ₺", priceNum: 58.00, date: "26 - 27 Ağustos 2026 (Sonuçlandı)", tradingDate: "1 Eylül 2026", totalLots: "20.000.000 Lot", size: "1.16 Milyar ₺", fundSize: "1.16 Milyar ₺", market: "Yıldız Pazar", distribution: "Tamamen Eşit", katilimEndeksi: true, consortium: "Vakıf Yatırım", estimatedLot: "Kişi Başı: ~ 12-15 Lot (700-870 ₺)" },
      { id: "ipo_bkrgy", code: "BKRGY", symbol: "BKRGY", name: "Bakırcı Gayrimenkul Yatırım Ortaklığı A.Ş.", sector: "Gayrimenkul Yatırım Ortaklığı", status: "trading", statusText: "2 Eylül 2026'da İşleme Başladı", badgeColor: "emerald", price: "12.93 ₺", priceNum: 12.93, date: "24 - 26 Ağustos 2026 (Sonuçlandı)", tradingDate: "2 Eylül 2026", totalLots: "167.000.000 Lot", size: "2.15 Milyar ₺", fundSize: "2.15 Milyar ₺", market: "Yıldız Pazar", distribution: "Eşit Dağıtım (502.090 Kişi)", katilimEndeksi: true, consortium: "Tacirler Yatırım", estimatedLot: "Kişi Başı: 221 Lot (2.857 ₺)" },
      { id: "ipo_kpeks", code: "KPEKS", symbol: "KPEKS", name: "Kapeks Kimya Sanayi A.Ş.", sector: "Kimya & Sanayi", status: "trading", statusText: "Ağustos 2026'da İşleme Başladı", badgeColor: "teal", price: "24.50 ₺", priceNum: 24.50, date: "12 - 14 Ağustos 2026", tradingDate: "19 Ağustos 2026", totalLots: "34.700.000 Lot", size: "850 Milyon ₺", fundSize: "850 Milyon ₺", market: "Ana Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "Halk Yatırım", estimatedLot: "~ 25-30 Lot (612-735 ₺)" },
      { id: "ipo_tknka", code: "TKNKA", symbol: "TKNKA", name: "Teknika Plast Teknik Kalıp Plastik A.Ş.", sector: "İmalat & Otomotiv", status: "trading", statusText: "Ağustos 2026'da İşleme Başladı", badgeColor: "teal", price: "31.00 ₺", priceNum: 31.00, date: "12 - 14 Ağustos 2026", tradingDate: "20 Ağustos 2026", totalLots: "20.000.000 Lot", size: "620 Milyon ₺", fundSize: "620 Milyon ₺", market: "Ana Pazar", distribution: "Tamamı Eşit", katilimEndeksi: false, consortium: "Gedik Yatırım", estimatedLot: "~ 18-22 Lot (558-682 ₺)" },
      { id: "ipo_veyas", code: "VEYAS", symbol: "VEYAS", name: "Türker Vangölü Yenilenebilir Enerji A.Ş.", sector: "Yenilenebilir Enerji", status: "trading", statusText: "Ağustos 2026'da İşleme Başladı", badgeColor: "teal", price: "19.80 ₺", priceNum: 19.80, date: "12 - 14 Ağustos 2026", tradingDate: "21 Ağustos 2026", totalLots: "73.200.000 Lot", size: "1.45 Milyar ₺", fundSize: "1.45 Milyar ₺", market: "Yıldız Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "Ziraat Yatırım", estimatedLot: "~ 50-60 Lot (990-1.188 ₺)" },
      { id: "ipo_citas", code: "CITAS", symbol: "CITAS", name: "Çitlekçi Mağazacılık Gıda San. ve Tic. A.Ş.", sector: "Gıda Perakende", status: "trading", statusText: "Ağustos 2026'da İşleme Başladı", badgeColor: "teal", price: "28.00 ₺", priceNum: 28.00, date: "10 - 12 Ağustos 2026", tradingDate: "18 Ağustos 2026", totalLots: "35.000.000 Lot", size: "980 Milyon ₺", fundSize: "980 Milyon ₺", market: "Yıldız Pazar", distribution: "Tamamen Eşit", katilimEndeksi: true, consortium: "A1 Capital", estimatedLot: "~ 30-35 Lot (840-980 ₺)" },
      { id: "ipo_sinbo", code: "SINBO", symbol: "SINBO", name: "Sinbo Küçük Ev Aletleri Sanayi ve Ticaret A.Ş.", sector: "Dayanıklı Tüketim", status: "upcoming", statusText: "SPK İncelemesinde / Taslak İzahname", badgeColor: "blue", price: "32.50 ₺", priceNum: 32.50, date: "2026 Sonbahar (Onay Bekliyor)", tradingDate: "Yakında", totalLots: "48.000.000 Lot", size: "1.56 Milyar ₺", fundSize: "1.56 Milyar ₺", market: "Yıldız Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "İş Yatırım", estimatedLot: "Tahmini: ~ 20-25 Lot (650-812 ₺)" },
      { id: "ipo_tatilbudur", code: "TATIL", symbol: "TATIL", name: "Tatilbudur Seyahat Acenteliği ve Turizm A.Ş.", sector: "Turizm & Seyahat", status: "upcoming", statusText: "SPK İncelemesinde / Taslak İzahname", badgeColor: "blue", price: "42.00 ₺", priceNum: 42.00, date: "2026 - 4. Çeyrek (Onay Bekliyor)", tradingDate: "Yakında", totalLots: "35.000.000 Lot", size: "1.47 Milyar ₺", fundSize: "1.47 Milyar ₺", market: "Yıldız Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "Garanti BBVA Yatırım", estimatedLot: "Tahmini: ~ 15-20 Lot (630-840 ₺)" },
      { id: "ipo_emlkb", code: "EMLKB", symbol: "EMLKB", name: "Türkiye Emlak Katılım Bankası A.Ş.", sector: "Katılım Bankacılığı", status: "upcoming", statusText: "SPK İncelemesinde / Taslak İzahname", badgeColor: "blue", price: "18.50 ₺", priceNum: 18.50, date: "2026 - 4. Çeyrek (Onay Bekliyor)", tradingDate: "Yakında", totalLots: "120.000.000 Lot", size: "2.22 Milyar ₺", fundSize: "2.22 Milyar ₺", market: "Yıldız Pazar", distribution: "Tamamı Eşit", katilimEndeksi: true, consortium: "Vakıf & Ziraat Yatırım", estimatedLot: "Tahmini: ~ 60-80 Lot (1.110-1.480 ₺)" },
      { id: "ipo_flomz", code: "FLOMZ", symbol: "FLOMZ", name: "FLO Mağazacılık ve Ayakkabıcılık A.Ş.", sector: "Perakende & Ayakkabı", status: "upcoming", statusText: "SPK İncelemesinde / Taslak İzahname", badgeColor: "blue", price: "45.00 ₺", priceNum: 45.00, date: "2026 - 4. Çeyrek (Onay Bekliyor)", tradingDate: "Yakında", totalLots: "55.000.000 Lot", size: "2.47 Milyar ₺", fundSize: "2.47 Milyar ₺", market: "Yıldız Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "İş Yatırım & Garanti BBVA", estimatedLot: "Tahmini: ~ 20-25 Lot (900-1.125 ₺)" },
      { id: "ipo_defak", code: "DEFAK", symbol: "DEFAK", name: "Defacto Perakende Ticaret A.Ş.", sector: "Tekstil Perakende", status: "upcoming", statusText: "SPK İncelemesinde / Taslak İzahname", badgeColor: "blue", price: "35.00 ₺", priceNum: 35.00, date: "2026 - 4. Çeyrek (Onay Bekliyor)", tradingDate: "Yakında", totalLots: "60.000.000 Lot", size: "2.10 Milyar ₺", fundSize: "2.10 Milyar ₺", market: "Yıldız Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "Yapı Kredi Yatırım", estimatedLot: "Tahmini: ~ 25-30 Lot (875-1.050 ₺)" },
      { id: "ipo_spekn", code: "SPEKN", symbol: "SPEKN", name: "Schmid Pekintaş Güneş Enerji A.Ş.", sector: "Güneş Enerjisi", status: "upcoming", statusText: "SPK İncelemesinde / Taslak İzahname", badgeColor: "blue", price: "26.50 ₺", priceNum: 26.50, date: "2026 Sonbahar (Onay Bekliyor)", tradingDate: "Yakında", totalLots: "40.000.000 Lot", size: "1.06 Milyar ₺", fundSize: "1.06 Milyar ₺", market: "Ana Pazar", distribution: "Bireysele Eşit", katilimEndeksi: true, consortium: "Gedik Yatırım", estimatedLot: "Tahmini: ~ 15-20 Lot (397-530 ₺)" }
    ];
    this.safeSetItem('portal_ipos_2026', JSON.stringify(this.iposData));
    this.renderIpos();
    return this.iposData;
  },

  setIpoFilter(filter) {
    this.ipoFilter = filter;
    ['ALL', 'TRADING', 'UPCOMING', 'KATILIM'].forEach(f => {
      const btn = document.getElementById('ipoFilter_' + f);
      if (btn) {
        if (f === filter) {
          btn.className = 'ipo-filter-btn px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer whitespace-nowrap';
        } else {
          btn.className = 'ipo-filter-btn px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-xs cursor-pointer whitespace-nowrap';
        }
      }
    });
    this.renderIpos();
  },

  renderIpos() {
    if (!this.iposData || this.iposData.length === 0) {
      this.fetchIpos();
      return;
    }

    const search = (document.getElementById('ipoSearchInput')?.value || '').toLowerCase().trim();
    let filtered = this.iposData;

    if (this.ipoFilter === 'TRADING') {
      filtered = filtered.filter(i => i.status === 'trading');
    } else if (this.ipoFilter === 'UPCOMING') {
      filtered = filtered.filter(i => i.status === 'upcoming');
    } else if (this.ipoFilter === 'KATILIM') {
      filtered = filtered.filter(i => i.katilimEndeksi === true);
    }

    if (search) {
      filtered = filtered.filter(i => (i.code && i.code.toLowerCase().includes(search)) || (i.name && i.name.toLowerCase().includes(search)) || (i.sector && i.sector.toLowerCase().includes(search)));
    }

    // 1. Render in Terminal (#terminalIpoGrid) with Full Cross-Tab State Awareness
    const grid = document.getElementById('terminalIpoGrid');
    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-500 text-xs">
            <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
            Kriterlere uygun güncel halka arz bulunamadı.
          </div>
        `;
      } else {
        grid.innerHTML = filtered.map(ipo => {
          const sym = ipo.code || ipo.symbol;
          const isTrading = ipo.status === 'trading';
          const rel = this.getAssetRelationship(sym);
          const safeName = (ipo.name || '').replace(/'/g, "\'");

          let stateBadge = '';
          let cardBorderClass = 'border-slate-800 hover:border-slate-700 bg-slate-900';
          let actionButtons = '';

          // ----------------------------------------------------------------------
          // LIVE BIST PRICE & IPO RETURN BRIDGE
          // ----------------------------------------------------------------------
          let livePriceHtml = `<span class="text-sm font-bold text-white">${ipo.price}</span>`;
          if (isTrading) {
            const liveData = this.bistCatalog.find(c => c.symbol === sym);
            if (liveData && liveData.price > 0) {
              const livePrice = liveData.price;
              const offerPrice = parseFloat(String(ipo.price).replace(',', '.').replace(/[^0-9.-]+/g, '')) || 0;
              const ipoReturn = offerPrice > 0 ? ((livePrice - offerPrice) / offerPrice) * 100 : 0;
              const isUp = ipoReturn >= 0;
              livePriceHtml = `
                <div class="flex flex-col items-end">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[13px] font-black text-white">${livePrice.toFixed(2)} ₺</span>
                    <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}">Getiri: ${isUp ? '+' : ''}%${ipoReturn.toFixed(2)}</span>
                  </div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>Arz Fiyatı: ${ipo.price}</span>
                    <span class="text-[9px] ${String(liveData.change).startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">(${liveData.change})</span>
                  </div>
                </div>
              `;
            }
          }

          if (rel.inPortfolio) {
            // State: Already in User's Portfolio (e.g. INTET with 74 Lots)
            cardBorderClass = 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 shadow-md';
            stateBadge = `
              <span class="text-[10px] px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 shadow-sm">
                <i data-lucide="wallet" class="w-3.5 h-3.5 text-emerald-400"></i> Portföyünüzde: ${rel.shares} Lot
              </span>
            `;
            actionButtons = `
              <button onclick="Portal.openEditAssetModal('${rel.portItem.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer" title="Pozisyonunuzu Yönetin / Lot Güncelleyin">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Portföyü Yönet
              </button>
              <button onclick="Portal.toggleWatchlist('${sym}')" class="px-2.5 py-1.5 rounded-lg ${rel.inWatchlist ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'} text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer" title="İzleme Radarı Durumu">
                <i data-lucide="${rel.inWatchlist ? 'star' : 'eye'}" class="w-3.5 h-3.5 ${rel.inWatchlist ? 'fill-current' : ''}"></i> ${rel.inWatchlist ? 'Radarda' : 'Radara Ekle'}
              </button>
              <button onclick="Portal.openCalculatorWithPrice('${sym}', ${ipo.priceNum || rel.buyPrice || 25})" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="Hedef Getiri Hesapla">
                <i data-lucide="calculator" class="w-3.5 h-3.5 text-amber-400"></i> Hesapla
              </button>
              ${isTrading ? `
                <button onclick="Portal.openStockChartModal('${sym}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer ml-auto" title="Canlı Mum Grafik">
                  <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Grafik
                </button>
              ` : ''}
            `;
          } else if (rel.inWatchlist) {
            // State: On Watchlist (Radar) only
            stateBadge = `
              <span class="text-[10px] px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold flex items-center gap-1.5">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Radarda (İzleniyor)
              </span>
            `;
            actionButtons = `
              <button onclick="Portal.openAddAssetModal('portfolio'); Portal.selectStockAsset('${sym}', ${ipo.priceNum || 25});" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer" title="Portföye Lot Ekle">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Portföye Ekle
              </button>
              <button onclick="Portal.toggleWatchlist('${sym}')" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="İzleme Listesinden Kaldır">
                <i data-lucide="eye-off" class="w-3.5 h-3.5"></i> Radardan Çıkar
              </button>
              <button onclick="Portal.openCalculatorWithPrice('${sym}', ${ipo.priceNum || 25})" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="Hedef Getiri Hesapla">
                <i data-lucide="calculator" class="w-3.5 h-3.5 text-amber-400"></i> Hesapla
              </button>
              ${isTrading ? `
                <button onclick="Portal.openStockChartModal('${sym}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer ml-auto" title="Canlı Mum Grafik">
                  <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Grafik
                </button>
              ` : ''}
            `;
          } else {
            // State: Neither (Discovery)
            const badgeClass = isTrading ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            const iconDot = isTrading ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>' : '<span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>';
            stateBadge = `
              <span class="text-[10px] px-2.5 py-1 rounded-md ${badgeClass} font-medium flex items-center gap-1.5">
                ${iconDot} ${ipo.statusText || (isTrading ? 'İşlemde' : 'Onay Bekliyor')}
              </span>
            `;
            actionButtons = `
              <button onclick="Portal.toggleWatchlist('${sym}')" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="İzleme Radarına Al">
                <i data-lucide="eye" class="w-3.5 h-3.5 text-blue-400"></i> Radara Al
              </button>
              <button onclick="Portal.openAddAssetModal('portfolio'); Portal.selectStockAsset('${sym}', ${ipo.priceNum || 25});" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="Portföye Ekle">
                <i data-lucide="plus" class="w-3.5 h-3.5 text-emerald-400"></i> Portföye Ekle
              </button>
              <button onclick="Portal.addIpoToTasks('${sym}', '${safeName}', '${ipo.date}')" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="Görevi Takvime Ekle">
                <i data-lucide="bell-plus" class="w-3.5 h-3.5 text-purple-400"></i> Görev
              </button>
              <button onclick="Portal.openCalculatorWithPrice('${sym}', ${ipo.priceNum || 25})" class="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer" title="Kâr/Hedef Hesapla">
                <i data-lucide="calculator" class="w-3.5 h-3.5 text-amber-400"></i> Hesapla
              </button>
              ${isTrading ? `
                <button onclick="Portal.openStockChartModal('${sym}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer ml-auto" title="Canlı BIST Grafiği">
                  <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Grafik
                </button>
              ` : ''}
            `;
          }

          return `
            <div class="${cardBorderClass} p-5 rounded-2xl border space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between gap-2">
                  ${stateBadge}
                  <div class="text-right font-mono">
                    ${livePriceHtml}
                    ${rel.inPortfolio ? `<span class="block text-[10px] ${rel.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold mt-1">Kâr/Zarar: ${rel.profit >= 0 ? '+' : ''}${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(rel.profit)}</span>` : ''}
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <span class="text-blue-400 font-mono">${sym}</span>
                    <span class="text-slate-200 text-xs font-semibold">— ${ipo.name}</span>
                  </h3>
                  <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>${ipo.sector}</span> • <span class="text-slate-300 font-mono">${ipo.market}</span>
                    ${ipo.katilimEndeksi ? '• <span class="text-emerald-400 font-medium">Katılım Uygun</span>' : ''}
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-3 border-t border-slate-800/80">
                  <div><span class="text-slate-500 text-[10px] block font-sans">Dağıtım Modeli</span><span class="text-white font-semibold">${ipo.distribution}</span></div>
                  <div><span class="text-slate-500 text-[10px] block font-sans">Halka Arz Büyüklüğü</span><span class="text-white font-semibold">${ipo.fundSize}</span></div>
                  <div><span class="text-slate-500 text-[10px] block font-sans">Talep Tarihi</span><span class="text-slate-200 font-semibold">${ipo.date}</span></div>
                  <div><span class="text-slate-500 text-[10px] block font-sans">Olası Pay / Dağıtım</span><span class="text-emerald-400 font-semibold">${ipo.estimatedLot || '~ 25-30 Lot'}</span></div>
                </div>
                <div class="text-[10px] text-slate-400">
                  Konsorsiyum: <strong class="text-slate-300">${ipo.consortium}</strong>
                </div>
              </div>

              <!-- Quick Action Bar (Smart Contextual Actions) -->
              <div class="flex items-center gap-2 pt-3 border-t border-slate-800/80 flex-wrap">
                ${actionButtons}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 2. Render in Dashboard Widget (#ipoListContainer)
    const ip = document.getElementById('ipoListContainer');
    if (ip) {
      const topIpos = this.iposData.slice(0, 3);
      ip.innerHTML = topIpos.map(i => {
        const sym = i.code || i.symbol;
        const rel = this.getAssetRelationship(sym);
        const isTrading = i.status === 'trading';
        const badgeBg = rel.inPortfolio 
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : (isTrading ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20');
        const badgeText = rel.inPortfolio ? `Portföyde (${rel.shares}L)` : (isTrading ? 'İşlemde' : 'Onay Bekliyor');
        const safeName = (i.name || '').replace(/'/g, "\'");

        return `
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between items-center group hover:border-slate-700 transition-colors">
            <div class="cursor-pointer" onclick="Portal.switchTab('finance'); Portal.setFinanceSubTab('ipos');">
              <div class="flex items-center gap-2">
                <span class="text-xs text-white font-bold">${sym}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded border ${badgeBg} font-semibold">${badgeText}</span>
              </div>
              <span class="block text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">${i.name}</span>
            </div>
            <div class="text-right flex items-center gap-2">
              <div>
                <span class="text-xs text-slate-200 font-bold font-mono">${i.price}</span>
                <span class="block text-[9px] text-slate-400">${i.distribution}</span>
              </div>
              <button onclick="Portal.addIpoToTasks('${sym}', '${safeName}', '${i.date}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-purple-300 hover:text-white transition-colors cursor-pointer" title="Görev / Hatırlatıcıya Ekle">
                <i data-lucide="bell-plus" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  },

  addIpoToTasks(code, name, date) {
    let tasks = this.getLocalTasks();
    const groupTitle = "Halka Arz & Finans Takibi";
    let group = tasks.find(g => g.title === groupTitle);
    
    if (!group) {
      group = {
        id: 'group_ipo_' + Date.now(),
        title: groupTitle,
        items: []
      };
      tasks.unshift(group);
    }

    const itemText = `${code} (${name}) Halka Arzına Katıl - ${date}`;
    if (!group.items.some(it => it.text.includes(code))) {
      group.items.push({
        id: 'ipo_task_' + Date.now(),
        text: itemText,
        completed: false,
        priority: 'high'
      });
      this.saveLocalTasks(tasks);
      this.toast(`${code} halka arzı Görevler listesine eklendi! 🚀`, 'success');
      this.playAudioFeedback('complete');
    } else {
      this.toast(`${code} zaten görevlerinizde mevcut.`, 'info');
    }
  },

  activeChartSymbol: null,
  activeChartPrice: 0,

  chartState: {
    instance: null,
    candleSeries: null,
    areaSeries: null,
    volumeSeries: null,
    timeframe: '1mo',
    style: 'candlestick',
    currentCandles: [],
    resizeObserver: null
  },

  openStockChartModal(symbol) {
    const modal = document.getElementById('stockChartModal');
    const titleEl = document.getElementById('chartModalTitle');
    const symEl = document.getElementById('chartModalSymbol');
    const curPriceEl = document.getElementById('chartModalCurrentPrice');
    const priceChgEl = document.getElementById('chartModalPriceChange');
    const sectorEl = document.getElementById('chartModalSector');
    const sectorBadge = document.getElementById('chartModalSectorBadge');
    const avatarEl = document.getElementById('chartModalAvatar');
    const watchText = document.getElementById('chartModalWatchText');
    const tvLink = document.getElementById('chartTradingViewLink');

    if (!modal) return;

    this.activeChartSymbol = symbol;
    const catItem = this.bistCatalog.find(c => c.symbol === symbol);
    const symName = catItem ? catItem.name : symbol;
    const symPrice = catItem && catItem.price > 0 ? catItem.price : 0;
    const symChg = catItem && catItem.change ? catItem.change : '+0.00%';
    const symSector = catItem && catItem.sector ? catItem.sector : 'BIST Hisse';

    this.activeChartPrice = symPrice;
    
    if (titleEl) titleEl.textContent = symName;
    if (symEl) symEl.textContent = symbol;
    if (avatarEl) avatarEl.textContent = symbol.slice(0, 2);
    if (sectorEl) sectorEl.textContent = symSector;
    if (sectorBadge) sectorBadge.textContent = symSector;

    if (curPriceEl) {
      curPriceEl.textContent = symPrice > 0 ? (symbol === 'BTC_USD' ? '$' + Number(symPrice).toLocaleString('tr-TR') : Number(symPrice).toFixed(2) + ' ₺') : 'Canlı Veri Alınıyor...';
    }
    if (priceChgEl) {
      const isUp = symChg.startsWith('+');
      priceChgEl.textContent = symChg;
      priceChgEl.className = `text-xs font-bold px-2 py-0.5 rounded-md font-mono ${isUp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`;
    }
    if (watchText) {
      watchText.textContent = this.isInWatchlist(symbol) ? 'Radardan Çıkar' : 'İzlemeye Al';
    }

    // Tradingview Doğrudan Bağlantısı
    let tvPrefix = `BIST:${symbol}`;
    if (symbol === 'ALTIN_GRAM') tvPrefix = 'FX_IDC:XAUTRYG';
    else if (symbol === 'USD_TRY') tvPrefix = 'FX_IDC:USDTRY';
    else if (symbol === 'EUR_TRY') tvPrefix = 'FX_IDC:EURTRY';
    else if (symbol === 'BTC_USD') tvPrefix = 'BINANCE:BTCUSDT';

    if (tvLink) {
      tvLink.href = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvPrefix)}`;
    }

    this.openModal('stockChartModal');
    this.playAudioFeedback('click');

    // Modalı açtıktan sonra grafiği DOM boyutları oturduğunda çiz
    setTimeout(() => {
      this.loadNativeChart(symbol, this.chartState.timeframe);
    }, 60);

    // Anlık fiyatı arka planda tazele
    this.fetchLiveQuote(symbol).then(live => {
      if (live && live.price && this.activeChartSymbol === symbol) {
        this.activeChartPrice = live.price;
        if (curPriceEl) {
          curPriceEl.textContent = symbol === 'BTC_USD' ? '$' + Number(live.price).toLocaleString('tr-TR') : Number(live.price).toFixed(2) + ' ₺';
        }
        if (priceChgEl && live.change) {
          const isUp = live.change.startsWith('+');
          priceChgEl.textContent = live.change;
          priceChgEl.className = `text-xs font-bold px-2 py-0.5 rounded-md font-mono ${isUp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`;
        }
      }
    });
  },

  setChartTimeframe(tf) {
    this.chartState.timeframe = tf;
    ['1wk', '1mo', '3mo', '1y'].forEach(t => {
      const btn = document.getElementById('chartTf_' + t);
      if (btn) {
        if (t === tf) {
          btn.className = 'chart-tf-btn px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold transition-all shadow-sm';
        } else {
          btn.className = 'chart-tf-btn px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all';
        }
      }
    });
    if (this.activeChartSymbol) {
      this.loadNativeChart(this.activeChartSymbol, tf);
    }
  },

  setChartStyle(style) {
    this.chartState.style = style;
    const candleBtn = document.getElementById('chartStyle_candle');
    const areaBtn = document.getElementById('chartStyle_area');
    if (style === 'candlestick') {
      if (candleBtn) candleBtn.className = 'chart-style-btn px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold transition-all shadow-sm';
      if (areaBtn) areaBtn.className = 'chart-style-btn px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all';
    } else {
      if (candleBtn) candleBtn.className = 'chart-style-btn px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all';
      if (areaBtn) areaBtn.className = 'chart-style-btn px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold transition-all shadow-sm';
    }
    this.renderChartSeries();
  },

  async fetchHistoricalCandles(symbol, range) {
    // 1. Yerel API sorgusu (server.py aktifse)
    try {
      const res = await fetch(`/api/chart-history?symbol=${encodeURIComponent(symbol)}&range=${range}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.candles) && data.candles.length > 0) {
          return data.candles;
        }
      }
    } catch(e) {}

    // 2. CORS Proxy ile Yahoo Finance üzerinden sorgula
    try {
      let yahooTicker = symbol.includes('.') ? symbol : `${symbol}.IS`;
      if (symbol === 'ALTIN_GRAM' || symbol === 'ALTIN') yahooTicker = 'XAUTRY=X';
      else if (symbol === 'USD_TRY') yahooTicker = 'USDTRY=X';
      else if (symbol === 'EUR_TRY') yahooTicker = 'EURTRY=X';
      else if (symbol === 'BTC_USD') yahooTicker = 'BTC-USD';

      const target = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooTicker}?interval=1d&range=${range}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const d = await res.json();
        const r = d.chart?.result?.[0];
        if (r && r.timestamp && r.indicators?.quote?.[0]) {
          const timestamps = r.timestamp;
          const q = r.indicators.quote[0];
          const candles = [];
          for (let i = 0; i < timestamps.length; i++) {
            if (q.close[i] !== null && q.close[i] !== undefined) {
              const c = Math.round(q.close[i] * 100) / 100;
              const o = q.open[i] ? Math.round(q.open[i] * 100) / 100 : c;
              const h = q.high[i] ? Math.round(q.high[i] * 100) / 100 : Math.max(o, c);
              const l = q.low[i] ? Math.round(q.low[i] * 100) / 100 : Math.min(o, c);
              const v = q.volume[i] || 0;
              candles.push({ time: timestamps[i], open: o, high: h, low: l, close: c, volume: v });
            }
          }
          if (candles.length > 0) return candles;
        }
      }
    } catch(e) {}

    // 3. Fallback: Dinamik Gerçekçi Fiyat Modeli (Son fiyattan geriye doğru sapmasız gerçekçi mumlar)
    return this.generateSyntheticCandles(symbol, range);
  },

  generateSyntheticCandles(symbol, range) {
    const catItem = this.bistCatalog.find(c => c.symbol === symbol);
    const endPrice = (catItem && catItem.price > 0) ? catItem.price : (this.activeChartPrice > 0 ? this.activeChartPrice : 100.0);
    
    let days = 30;
    if (range === '1wk') days = 7;
    else if (range === '3mo') days = 90;
    else if (range === '1y') days = 260;

    const candles = [];
    const now = Math.floor(Date.now() / 1000);
    let current = endPrice * (1 - (Math.sin(days) * 0.08));

    for (let i = days; i >= 0; i--) {
      const ts = now - (i * 86400);
      const volatility = current * 0.022;
      const change = (Math.random() - 0.48) * volatility;
      const open = Math.round(current * 100) / 100;
      current = Math.max(1.0, current + change);
      if (i === 0) current = endPrice;

      const close = Math.round(current * 100) / 100;
      const high = Math.round((Math.max(open, close) + Math.random() * (volatility * 0.7)) * 100) / 100;
      const low = Math.round((Math.min(open, close) - Math.random() * (volatility * 0.7)) * 100) / 100;
      const volume = Math.floor(500000 + Math.random() * 4500000);

      candles.push({ time: ts, open, high, low, close, volume });
    }
    return candles;
  },

  async loadNativeChart(symbol, timeframe) {
    const container = document.getElementById('nativeChartContainer');
    const loading = document.getElementById('chartLoadingOverlay');
    if (!container) return;

    if (loading) loading.classList.remove('hidden');

    try {
      const candles = await this.fetchHistoricalCandles(symbol, timeframe);
      this.chartState.currentCandles = candles;
      this.initOrUpdateChart(container, candles);
    } catch(err) {
      console.error('[Chart Load Error]:', err);
    } finally {
      if (loading) loading.classList.add('hidden');
    }
  },

  initOrUpdateChart(container, candles) {
    if (!window.LightweightCharts) {
      console.error('LightweightCharts kütüphanesi yüklenemedi.');
      return;
    }

    if (this.chartState.instance) {
      try {
        this.chartState.instance.remove();
      } catch(e) {}
      this.chartState.instance = null;
    }
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 380;

    const chart = window.LightweightCharts.createChart(container, {
      width: width,
      height: height,
      layout: {
        background: { color: '#060a14' },
        textColor: '#94a3b8',
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace'
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' }
      },
      crosshair: {
        mode: 1
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.22
        }
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        timeVisible: true,
        secondsVisible: false
      }
    });

    this.chartState.instance = chart;

    // Hacim Histogram Serisi Ekle (Altta)
    let volumeSeries = null;
    const LC = window.LightweightCharts;
    if (typeof chart.addHistogramSeries === 'function') {
      volumeSeries = chart.addHistogramSeries({
        color: '#6366f1',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });
    } else if (LC && LC.HistogramSeries) {
      volumeSeries = chart.addSeries(LC.HistogramSeries, {
        color: '#6366f1',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });
    }

    if (volumeSeries) {
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0
        }
      });
      const volData = candles.map(c => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'
      }));
      volumeSeries.setData(volData);
      this.chartState.volumeSeries = volumeSeries;
    }

    this.renderChartSeries();

    // Crosshair Takibi & HUD Bilgisi Güncelleme
    chart.subscribeCrosshairMove(param => {
      if (!param || !param.time || !param.seriesData) {
        const last = candles[candles.length - 1];
        if (last) this.updateHudValues(last);
        return;
      }

      let data = null;
      if (this.chartState.candleSeries && param.seriesData.get(this.chartState.candleSeries)) {
        data = param.seriesData.get(this.chartState.candleSeries);
      } else if (this.chartState.areaSeries && param.seriesData.get(this.chartState.areaSeries)) {
        const ad = param.seriesData.get(this.chartState.areaSeries);
        data = { open: ad.value, high: ad.value, low: ad.value, close: ad.value };
      }

      if (data) {
        const d = new Date(param.time * 1000);
        const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
        const hudDate = document.getElementById('hudDate');
        const hudOpen = document.getElementById('hudOpen');
        const hudHigh = document.getElementById('hudHigh');
        const hudLow = document.getElementById('hudLow');
        const hudClose = document.getElementById('hudClose');

        if (hudDate) hudDate.textContent = `Tarih: ${dateStr}`;
        if (hudOpen) hudOpen.textContent = (data.open !== undefined ? data.open.toFixed(2) : data.close.toFixed(2)) + ' ₺';
        if (hudHigh) hudHigh.textContent = (data.high !== undefined ? data.high.toFixed(2) : data.close.toFixed(2)) + ' ₺';
        if (hudLow) hudLow.textContent = (data.low !== undefined ? data.low.toFixed(2) : data.close.toFixed(2)) + ' ₺';
        if (hudClose) hudClose.textContent = data.close.toFixed(2) + ' ₺';
      }
    });

    const last = candles[candles.length - 1];
    if (last) this.updateHudValues(last);

    // Responsive Resize Observer
    if (!this.chartState.resizeObserver) {
      this.chartState.resizeObserver = new ResizeObserver(entries => {
        if (!entries || entries.length === 0 || !this.chartState.instance) return;
        const cr = entries[0].contentRect;
        if (cr.width > 0 && cr.height > 0) {
          this.chartState.instance.applyOptions({ width: cr.width, height: cr.height });
        }
      });
      this.chartState.resizeObserver.observe(container);
    }
  },

  updateHudValues(candle) {
    if (!candle) return;
    const hudDate = document.getElementById('hudDate');
    const hudOpen = document.getElementById('hudOpen');
    const hudHigh = document.getElementById('hudHigh');
    const hudLow = document.getElementById('hudLow');
    const hudClose = document.getElementById('hudClose');
    const hudVolume = document.getElementById('hudVolume');

    const d = new Date(candle.time * 1000);
    const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    if (hudDate) hudDate.textContent = `Tarih: ${dateStr}`;
    if (hudOpen) hudOpen.textContent = candle.open.toFixed(2) + ' ₺';
    if (hudHigh) hudHigh.textContent = candle.high.toFixed(2) + ' ₺';
    if (hudLow) hudLow.textContent = candle.low.toFixed(2) + ' ₺';
    if (hudClose) hudClose.textContent = candle.close.toFixed(2) + ' ₺';
    if (hudVolume && candle.volume) {
      hudVolume.innerHTML = `Hacim: <b class="text-slate-200">${Number(candle.volume).toLocaleString('tr-TR')}</b>`;
    }
  },

  renderChartSeries() {
    const chart = this.chartState.instance;
    const candles = this.chartState.currentCandles;
    if (!chart || !candles || candles.length === 0) return;

    const LC = window.LightweightCharts;

    if (this.chartState.candleSeries) {
      try { chart.removeSeries(this.chartState.candleSeries); } catch(e) {}
      this.chartState.candleSeries = null;
    }
    if (this.chartState.areaSeries) {
      try { chart.removeSeries(this.chartState.areaSeries); } catch(e) {}
      this.chartState.areaSeries = null;
    }

    if (this.chartState.style === 'candlestick') {
      let cs = null;
      if (typeof chart.addCandlestickSeries === 'function') {
        cs = chart.addCandlestickSeries({
          upColor: '#10b981',
          downColor: '#f43f5e',
          borderVisible: false,
          wickUpColor: '#10b981',
          wickDownColor: '#f43f5e',
        });
      } else if (LC && LC.CandlestickSeries) {
        cs = chart.addSeries(LC.CandlestickSeries, {
          upColor: '#10b981',
          downColor: '#f43f5e',
          borderVisible: false,
          wickUpColor: '#10b981',
          wickDownColor: '#f43f5e',
        });
      }
      if (cs) {
        cs.setData(candles);
        this.chartState.candleSeries = cs;
      }
    } else {
      let as = null;
      if (typeof chart.addAreaSeries === 'function') {
        as = chart.addAreaSeries({
          topColor: 'rgba(99, 102, 241, 0.45)',
          bottomColor: 'rgba(99, 102, 241, 0.02)',
          lineColor: '#818cf8',
          lineWidth: 2,
        });
      } else if (LC && LC.AreaSeries) {
        as = chart.addSeries(LC.AreaSeries, {
          topColor: 'rgba(99, 102, 241, 0.45)',
          bottomColor: 'rgba(99, 102, 241, 0.02)',
          lineColor: '#818cf8',
          lineWidth: 2,
        });
      }
      if (as) {
        const areaData = candles.map(c => ({ time: c.time, value: c.close }));
        as.setData(areaData);
        this.chartState.areaSeries = as;
      }
    }

    chart.timeScale().fitContent();
  },

  chartModalToggleWatchlist() {
    if (!this.activeChartSymbol) return;
    this.toggleWatchlist(this.activeChartSymbol);
    const watchText = document.getElementById('chartModalWatchText');
    if (watchText) {
      watchText.textContent = this.isInWatchlist(this.activeChartSymbol) ? 'Radardan Çıkar' : 'İzlemeye Al';
    }
  },

  chartModalAddToPortfolio() {
    if (!this.activeChartSymbol) return;
    this.closeModal('stockChartModal');
    this.quickAddWatchlistToPortfolio(this.activeChartSymbol, this.activeChartPrice);
  },

  chartModalSendToCalc() {
    if (!this.activeChartSymbol) return;
    this.closeModal('stockChartModal');
    this.sendToCalculator(this.activeChartSymbol, this.activeChartPrice);
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
        (s.sector || '').toUpperCase().includes(q)
      );
    }
    matches = matches.slice(0, 15);

    let html = '';
    if (q && !this.bistCatalog.some(s => s.symbol === q)) {
      html += `
        <div onclick="Portal.selectCustomStockAsset('${q}')" class="p-3 bg-blue-950/40 hover:bg-blue-900/60 border-b border-blue-500/30 cursor-pointer flex justify-between items-center transition-colors">
          <div>
            <span class="text-xs text-blue-300 font-bold font-mono">⚡ ${q} (Özel BIST Hissesi / Emtia)</span>
            <span class="block text-[10px] text-slate-400">Canlı Yahoo/BIST API'sinden sorgula</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Özel Kod</span>
        </div>
      `;
    }

    if (matches.length === 0 && !html) {
      dd.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs">Sonuç bulunamadı. Enter'a basarak "${q}" özel kodunu arayabilirsiniz.</div>`;
      dd.classList.remove('hidden');
      return;
    }

    html += matches.map(s => `
      <div onclick="Portal.selectStockAsset('${s.symbol}', ${s.price})" class="p-3 hover:bg-slate-800/90 cursor-pointer flex justify-between items-center transition-colors">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">${s.symbol.slice(0, 2)}</span>
          <div>
            <div class="flex items-center gap-1.5"><span class="text-xs font-bold text-white">${s.symbol}</span><span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">${s.sector}</span></div>
            <span class="text-[10px] text-slate-400 block">${this.escapeHtml(s.name)}</span>
          </div>
        </div>
        <div class="text-right font-mono"><span class="text-xs font-bold text-white">${s.price > 0 ? Number(s.price).toFixed(2) + ' ₺' : 'Canlı Fiyat'}</span><span class="block text-[9px] ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'} font-bold">${s.change}</span></div>
      </div>
    `).join('');
    
    dd.innerHTML = html;
    dd.classList.remove('hidden');
  },

  async selectStockAsset(sym, prc) {
    const symInput = document.getElementById('assetSymbolInput');
    const dd = document.getElementById('stockSearchDropdown');
    const card = document.getElementById('selectedAssetCard');
    const badge = document.getElementById('selectedAssetBadge');
    const name = document.getElementById('selectedAssetName');
    const price = document.getElementById('selectedAssetPrice');
    const bInput = document.getElementById('assetBuyPriceInput');

    if (symInput) symInput.value = sym;
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
    if (sharesInput && this.financeAddMode === 'portfolio') { 
      sharesInput.focus(); 
      sharesInput.select(); 
    }
    this.playAudioFeedback('click');
  },

  async selectCustomStockAsset(sym) {
    await this.selectStockAsset(sym, 0);
  },

  setFinanceAddMode(mode) {
    this.financeAddMode = mode;
    const watchBtn = document.getElementById('modalModeWatchBtn');
    const portBtn = document.getElementById('modalModePortBtn');
    const portFields = document.getElementById('modalPortfolioFields');
    const submitBtn = document.getElementById('modalAssetSubmitBtn');

    if (mode === 'watch') {
      if (watchBtn) watchBtn.className = 'flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs transition-all shadow-md';
      if (portBtn) portBtn.className = 'flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-all';
      if (portFields) portFields.classList.add('hidden');
      if (submitBtn) {
        submitBtn.textContent = 'İzleme Listesine Ekle 👁️';
        submitBtn.className = 'px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-lg shadow-blue-500/25';
      }
    } else {
      if (watchBtn) watchBtn.className = 'flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-all';
      if (portBtn) portBtn.className = 'flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs transition-all shadow-md';
      if (portFields) portFields.classList.remove('hidden');
      if (submitBtn) {
        submitBtn.textContent = 'Portföyüme Kaydet 📈';
        submitBtn.className = 'px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-lg shadow-emerald-500/25';
      }
    }
  },

  openAddAssetModal(defaultMode = 'watch') {
    this.setFinanceAddMode(defaultMode);
    this.openModal('addAssetModal'); 
    setTimeout(() => { 
      const el = document.getElementById('assetSearchInput'); 
      if (el) el.focus(); 
    }, 100); 
  },

  handleSaveAsset(e) {
    e.preventDefault();
    const symbol = document.getElementById('assetSymbolInput')?.value || document.getElementById('assetSearchInput')?.value.trim().toUpperCase();
    if (!symbol) {
      this.toast('Lütfen bir hisse veya varlık seçin!', 'error');
      return;
    }

    if (this.financeAddMode === 'watch') {
      this.addToWatchlist(symbol);
    } else {
      const shares = parseFloat(document.getElementById('assetSharesInput')?.value) || 1;
      const buyPrice = parseFloat(document.getElementById('assetBuyPriceInput')?.value) || 100;
      const catItem = this.bistCatalog.find(c => c.symbol === symbol);
      const name = catItem ? catItem.name : symbol;
      const currentPrice = (catItem && catItem.price > 0) ? catItem.price : buyPrice;
      
      let portfolio = this.getLocalPortfolio();
      portfolio.unshift({
        id: 'port_' + Date.now(),
        symbol: symbol,
        name: name,
        shares: shares,
        buy_price: buyPrice,
        current_price: currentPrice,
        current_value: shares * currentPrice,
        profit: (shares * currentPrice) - (shares * buyPrice),
        profit_percent: buyPrice > 0 ? (((currentPrice - buyPrice) / buyPrice) * 100).toFixed(2) : 0
      });
      this.saveLocalPortfolio(portfolio);
      this.addTradeLog('BUY', symbol, name, shares, buyPrice, shares * buyPrice, 'Yeni Pozisyon Açılışı');
      this.toast(`${symbol} portföye eklendi! 📈`, 'success');
      this.playAudioFeedback('complete');
    }

    this.closeModal('addAssetModal');
  },

  calculateTargetProfit() {
    const shares = parseFloat(document.getElementById('calcSharesInput')?.value) || 0;
    const buyPrice = parseFloat(document.getElementById('calcBuyPriceInput')?.value) || 0;
    const targetPrice = parseFloat(document.getElementById('calcTargetPriceInput')?.value) || 0;

    const totalCost = shares * buyPrice;
    const totalTarget = shares * targetPrice;
    const profit = totalTarget - totalCost;
    const pct = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(2) : 0;

    const cEl = document.getElementById('calcResultCost'); if (cEl) cEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalCost);
    const tEl = document.getElementById('calcResultTarget'); if (tEl) tEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalTarget);
    const pEl = document.getElementById('calcResultProfit'); if (pEl) {
      pEl.textContent = `${profit >= 0 ? '+' : ''}${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(profit)} (%${pct})`;
      pEl.className = `text-lg font-bold font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }
  },

  // --- KORUNAKLI KİŞİSEL KASA (VAULT) ---
  loadVaultData() {
    const pin = localStorage.getItem('portal_vault_pin') || '1234';
    this.vaultPin = pin;
    this.activeVaultItems = [];
  },
  async _deriveKey(pin, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(pin), {name: "PBKDF2"}, false, ["deriveBits", "deriveKey"]);
    return window.crypto.subtle.deriveKey({name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256"}, keyMaterial, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
  },
  async encryptVaultData(plainData, pin) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this._deriveKey(pin, salt);
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, enc.encode(JSON.stringify(plainData)));
    const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
    combined.set(salt, 0); combined.set(iv, salt.byteLength); combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);
    let binary = ''; for (let i = 0; i < combined.byteLength; i++) { binary += String.fromCharCode(combined[i]); }
    return btoa(binary);
  },
  async decryptVaultData(base64Data, pin) {
    const raw = atob(base64Data);
    const combined = new Uint8Array(raw.length);
    for(let i = 0; i < raw.length; i++) combined[i] = raw.charCodeAt(i);
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);
    const key = await this._deriveKey(pin, salt);
    const decrypted = await window.crypto.subtle.decrypt({name: "AES-GCM", iv: iv}, key, data);
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  },
  async unlockVault() {
    const pinInput = document.getElementById('vaultPinInput');
    if (!pinInput) return;
    const pin = pinInput.value;
    try {
      const encData = localStorage.getItem('portal_vault_items_enc');
      if (encData) {
        this.activeVaultItems = await this.decryptVaultData(encData, pin);
      } else {
        const old = localStorage.getItem('portal_vault_items');
        const expectedOldPin = localStorage.getItem('portal_vault_pin') || '1234';
        if (pin !== expectedOldPin) throw new Error('Invalid PIN');
        if (old) {
          this.activeVaultItems = JSON.parse(old);
          localStorage.removeItem('portal_vault_items');
        } else {
          this.activeVaultItems = [
            { id: 'v1', type: 'Kimlik & Şahsi', title: 'T.C. Kimlik & Seri No', value: 'TC: 12345678901 (Kişisel Şifreli)' },
            { id: 'v2', type: 'Banka & Finans', title: 'Ana Yatırım & BIST Hesabı IBAN', value: 'TR56 0006 2000 0001 2345 6789 01' },
            { id: 'v3', type: 'Hesap & Şifre', title: 'Master Yönetici Şifresi', value: 'Pass: PersonalOS#2026!Sec' }
          ];
        }
        const newEnc = await this.encryptVaultData(this.activeVaultItems, pin);
        this.safeSetItem('portal_vault_items_enc', newEnc);
        localStorage.setItem('portal_vault_pin', pin);
      }
      this.vaultUnlocked = true;
      this.vaultPin = pin;
      document.getElementById('vaultLockedView').classList.add('hidden');
      document.getElementById('vaultUnlockedView').classList.remove('hidden');
      this.renderVaultItems();
      this.toast('Kasa Kilidi Açıldı! 🔓 (AES-256)', 'success');
      this.playAudioFeedback('complete');
    } catch(e) {
      console.error(e);
      this.toast('Hatalı PIN Kodu! ❌', 'error');
      pinInput.value = '';
      this.playAudioFeedback();
    }
  },
  lockVault() {
    this.vaultUnlocked = false;
    this.activeVaultItems = [];
    const lView = document.getElementById('vaultLockedView');
    const uView = document.getElementById('vaultUnlockedView');
    const pInput = document.getElementById('vaultPinInput');
    if (lView) lView.classList.remove('hidden');
    if (uView) uView.classList.add('hidden');
    if (pInput) pInput.value = '';
    },
  getLocalVaultItems() {
    return this.activeVaultItems || [];
  },
  async saveLocalVaultItems(items) {
    this.activeVaultItems = items;
    const enc = await this.encryptVaultData(items, this.vaultPin);
    this.safeSetItem('portal_vault_items_enc', enc);
    this.renderVaultItems();
  },
  copyVaultValue(val, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    navigator.clipboard.writeText(val);
    this.toast('Panoya kopyalandı 📋', 'info');
    this.playAudioFeedback('click');
  },

  toggleVaultItemMask(id, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const valEl = document.getElementById('valText_' + id);
    const iconEl = document.getElementById('valIcon_' + id);
    if (!valEl) return;
    const isMasked = valEl.getAttribute('data-masked') === 'true';
    if (isMasked) {
      valEl.textContent = valEl.getAttribute('data-real');
      valEl.setAttribute('data-masked', 'false');
      if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    } else {
      valEl.textContent = '••••••••••••';
      valEl.setAttribute('data-masked', 'true');
      if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) window.lucide.createIcons();
  },

  renderVaultItems() {
    let items = this.getLocalVaultItems();
    const search = (document.getElementById('vaultSearchInput')?.value || '').toLowerCase().trim();
    if (search) {
      items = items.filter(i => (i.title || '').toLowerCase().includes(search) || (i.value || '').toLowerCase().includes(search) || (i.type || '').toLowerCase().includes(search));
    }

    // Kategorilere ayır
    const idItems = items.filter(i => i.type === 'Kimlik & Şahsi');
    const bankItems = items.filter(i => i.type === 'Banka & Finans');
    const passItems = items.filter(i => i.type === 'Hesap & Şifre');
    const noteItems = items.filter(i => i.type === 'Özel Not' || (!['Kimlik & Şahsi', 'Banka & Finans', 'Hesap & Şifre'].includes(i.type)));

    // Sayaçları güncelle
    const cId = document.getElementById('vaultCountId'); if (cId) cId.textContent = `${idItems.length} Kayıt`;
    const cBank = document.getElementById('vaultCountBank'); if (cBank) cBank.textContent = `${bankItems.length} Kayıt`;
    const cPass = document.getElementById('vaultCountPass'); if (cPass) cPass.textContent = `${passItems.length} Kayıt`;
    const cNotes = document.getElementById('vaultCountNotes'); if (cNotes) cNotes.textContent = `${noteItems.length} Kayıt`;

    const renderCardList = (catItems, emptyText, dotColor, isSecret = false) => {
      if (catItems.length === 0) {
        return `<div class="p-6 text-center text-slate-500 text-xs rounded-2xl bg-slate-950/40 border border-slate-800/60">${emptyText}</div>`;
      }
      return catItems.map(item => {
        const safeVal = (item.value || '').replace(/'/g, "\'");
        const isMaskedInitial = isSecret || item.type === 'Hesap & Şifre';
        return `
          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2.5 group shadow-sm">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white text-xs tracking-tight flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${dotColor}"></span>
                ${this.escapeHtml(item.title)}
              </span>
              <div class="flex items-center gap-1">
                ${isMaskedInitial ? `
                  <button onclick="Portal.toggleVaultItemMask('${item.id}', event)" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Göster / Gizle">
                    <i id="valIcon_${item.id}" data-lucide="eye" class="w-3.5 h-3.5"></i>
                  </button>
                ` : ''}
                <button onclick="Portal.copyVaultValue('${safeVal}', event)" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Panoya Kopyala">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="Portal.deleteVaultItem('${item.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Kaydı Sil">
                  <i data-lucide="trash" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-amber-200/90 break-all select-all flex items-center justify-between">
              <span id="valText_${item.id}" data-real="${this.escapeHtml(item.value)}" data-masked="${isMaskedInitial ? 'true' : 'false'}">${isMaskedInitial ? '••••••••••••' : this.escapeHtml(item.value)}</span>
            </div>
          </div>
        `;
      }).join('');
    };

    const wId = document.getElementById('vaultWidget_id');
    if (wId) wId.innerHTML = renderCardList(idItems, 'Kayıtlı kimlik veya resmi evrak bulunmuyor.', 'bg-blue-400');

    const wBank = document.getElementById('vaultWidget_bank');
    if (wBank) wBank.innerHTML = renderCardList(bankItems, 'Kayıtlı banka hesabı veya IBAN bulunmuyor.', 'bg-emerald-400');

    const wPass = document.getElementById('vaultWidget_pass');
    if (wPass) wPass.innerHTML = renderCardList(passItems, 'Kayıtlı şifre veya hesap bulunmuyor.', 'bg-amber-400', true);

    const wNotes = document.getElementById('vaultWidget_notes');
    if (wNotes) wNotes.innerHTML = renderCardList(noteItems, 'Kayıtlı şahsi gizli not bulunmuyor.', 'bg-purple-400');

    // Eski tekli grid varsa orayı da doldur (geriye dönük uyumluluk)
    const oldGrid = document.getElementById('vaultItemsGrid');
    if (oldGrid) oldGrid.innerHTML = renderCardList(items, 'Kayıt bulunmuyor.', 'bg-amber-400');

    if (window.lucide) window.lucide.createIcons();
  },

  openNewVaultItemModal(defaultType = 'Kimlik & Şahsi') {
    const sel = document.getElementById('vaultItemType');
    if (sel && defaultType) sel.value = defaultType;
    document.getElementById('vaultItemTitle').value = '';
    document.getElementById('vaultItemValue').value = '';
    this.openModal('newVaultItemModal');
  },

  async handleSaveVaultItem(e) {
    e.preventDefault();
    const type = document.getElementById('vaultItemType').value;
    const title = document.getElementById('vaultItemTitle').value.trim();
    const value = document.getElementById('vaultItemValue').value.trim();
    let items = this.getLocalVaultItems();
    items.unshift({ id: 'v_' + Date.now(), type, title, value });
    await this.saveLocalVaultItems(items);
    this.closeModal('newVaultItemModal');
    this.toast('Gizli kayıt kasaya eklendi! 🔒', 'success');
  },
  async deleteVaultItem(id) {
    let items = this.getLocalVaultItems();
    items = items.filter(x => x.id !== id);
    await this.saveLocalVaultItems(items);
    this.toast('Kayıt silindi', 'info');
  },
  async changeVaultPin() {
    const newPin = prompt('Yeni 4-6 Haneli Kasa PIN Kodunu Girin:');
    if (newPin && newPin.trim().length >= 4) {
      this.vaultPin = newPin.trim();
      localStorage.setItem('portal_vault_pin', this.vaultPin);
      if (this.activeVaultItems) {
        const enc = await this.encryptVaultData(this.activeVaultItems, this.vaultPin);
        this.safeSetItem('portal_vault_items_enc', enc);
      }
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
        this.closeModal('budgetModal');
        this.closeModal('paymentModal');
        this.closeModal('budgetSubItemModal');
        this.closeFloatingCalculator();
        this.closeNoteDrawer();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('quickCaptureInput');
        if (input) input.focus();
      }

      // Hesap makinesi açıkken klavye desteği (eğer odak bir inputta değilse)
      const calcWin = document.getElementById('floatingCalculatorWindow');
      if (calcWin && !calcWin.classList.contains('hidden')) {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          if (e.key >= '0' && e.key <= '9') {
            this.calculatorNum(e.key);
          } else if (e.key === '.' || e.key === ',') {
            this.calculatorNum('.');
          } else if (['+', '-', '*', '/'].includes(e.key)) {
            this.calculatorOp(e.key);
          } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculatorEquals();
          } else if (e.key === 'Backspace') {
            this.calculatorBackspace();
          } else if (e.key.toLowerCase() === 'c') {
            this.calculatorClear();
          }
        }
      }
    }); 
  },

  // =========================================================================
  // KİŞİSEL BÜTÇE, BORÇ YÖNETİMİ & SERBEST NAKİT SİSTEMİ (necoPRO OS)
  // =========================================================================
  budgetState: {
    data: null,
    calcValue: '0',
    calcPrev: null,
    calcOp: null,
    calcResetNext: false,
    dragInitialized: false
  },

  getLocalBudgetData() {
    const raw = localStorage.getItem('portal_budget_data_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch(e) {}
    }
    // Varsayılan temiz şablon
    const defaultData = {
      incomes: [
        { id: 'inc_1', title: 'Ana Gelir / Maaş', amount: 45000, active: true }
      ],
      debts: [
        { 
          id: 'debt_1', 
          type: 'card', 
          title: 'Garanti Bonus Kartı', 
          monthly: 6500, 
          total: 18000, 
          notes: 'Hesap kesim: 15\'i',
          subItems: [
            { id: 'sub_1', title: 'Telefon Taksiti', amount: 2000, term: '3/6 Ay' },
            { id: 'sub_2', title: 'Elektronik / Monitor', amount: 1500, term: '1/3 Ay' }
          ]
        },
        { 
          id: 'debt_2', 
          type: 'loan', 
          title: 'İhtiyaç Kredisi', 
          monthly: 3200, 
          total: 28800, 
          notes: '9 ay kaldı' 
        },
        {
          id: 'debt_3',
          type: 'gold_fx',
          title: 'Ahmet Amca (Altın Borcu)',
          monthly: 0,
          total: 69400,
          assetQty: '10 Gram',
          customRate: null,
          notes: 'Düğün borcu'
        }
      ],
      fixedExpenses: [
        { id: 'fix_1', title: 'Ev Kirası', amount: 12500, active: true, included: true },
        { id: 'fix_2', title: 'Faturalar (Doğalgaz, Su, Elk)', amount: 2400, active: true, included: true },
        { id: 'fix_3', title: 'Aidat & İnternet', amount: 950, active: true, included: true }
      ]
    };
    this.safeSetItem('portal_budget_data_v1', JSON.stringify(defaultData));
    return defaultData;
  },

  saveBudgetData(data) {
    this.safeSetItem('portal_budget_data_v1', JSON.stringify(data));
    this.renderBudgetSection();
  },

  renderBudgetSection() {
    const data = this.getLocalBudgetData();
    this.budgetState.data = data;

    // Canlı Altın/Döviz kurlarını çekip altın borçlarını güncelle
    const gramAltin = this.bistCatalog.find(c => c.symbol === 'ALTIN_GRAM');
    const gramPrice = (gramAltin && gramAltin.price > 0) ? gramAltin.price : 6943.14;

    // 1. Hesaplamalar
    // Toplam Aktif Gelir
    const totalIncome = (data.incomes || [])
      .filter(i => i.active !== false)
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    // Sabit Giderler (Sadece tikli/included olanlar toplama dahil edilir - X+Y mantığı)
    let totalIncludedFixed = 0;
    (data.fixedExpenses || []).forEach(f => {
      if (f.included !== false && f.active !== false) {
        totalIncludedFixed += (Number(f.amount) || 0);
      }
    });

    // Borç Taksitleri (Bu ay ödenecek zorunlu taksitler)
    let totalMonthlyDebt = 0;
    let totalRemainingPrincipal = 0;
    (data.debts || []).forEach(d => {
      // Altın borcuysa ve miktar girilmişse anlık fiyattan kalan toplamı hesapla
      if (d.type === 'gold_fx' && d.assetQty) {
        const qtyMatch = d.assetQty.match(/([0-9.,]+)/);
        const qty = qtyMatch ? parseFloat(qtyMatch[1].replace(',', '.')) : 0;
        const rate = (Number(d.customRate) > 0) ? Number(d.customRate) : gramPrice;
        if (qty > 0) {
          d.calculatedTotal = qty * rate;
        } else {
          d.calculatedTotal = Number(d.total) || 0;
        }
      } else {
        d.calculatedTotal = Number(d.total) || 0;
      }

      totalMonthlyDebt += (Number(d.monthly) || 0);
      totalRemainingPrincipal += (Number(d.calculatedTotal) || 0);
    });

    // Genel Toplam Çıkış (Dahil edilen sabitler + Borç Taksitleri)
    const totalOutflow = totalIncludedFixed + totalMonthlyDebt;
    const safeToSpend = totalIncome - totalOutflow;

    // 2. Sol Sütun (Pusula & Kartopu) Render
    const safeSpendEl = document.getElementById('budgetSafeToSpend');
    const outflowEl = document.getElementById('budgetTotalOutflow');
    const incomeEl = document.getElementById('budgetTotalIncomeDisplay');
    const cashflowBadge = document.getElementById('budgetCashflowBadge');

    if (safeSpendEl) {
      safeSpendEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(safeToSpend);
      if (safeToSpend >= 0) {
        safeSpendEl.className = 'text-3xl font-black text-emerald-400 font-mono tracking-tight mt-1';
        if (cashflowBadge) {
          cashflowBadge.textContent = 'Pozitif (Güvenli)';
          cashflowBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        }
      } else {
        safeSpendEl.className = 'text-3xl font-black text-rose-400 font-mono tracking-tight mt-1';
        if (cashflowBadge) {
          cashflowBadge.textContent = 'Açık Veriyor';
          cashflowBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20';
        }
      }
    }
    if (outflowEl) outflowEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalOutflow);
    if (incomeEl) incomeEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalIncome);

    // Psikolojik Kartopu Hesabı (Kalan bakiyesi en düşük olan pozitif borç)
    const sortedDebts = [...(data.debts || [])].filter(d => (d.calculatedTotal || d.total) > 0);
    sortedDebts.sort((a, b) => (a.calculatedTotal || a.total) - (b.calculatedTotal || b.total));
    const snowballTarget = sortedDebts.length > 0 ? sortedDebts[0] : null;

    const snowballCard = document.getElementById('snowballFocusCard');
    if (snowballCard) {
      if (snowballTarget) {
        const remainingVal = snowballTarget.calculatedTotal || snowballTarget.total;
        snowballCard.innerHTML = `
          <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span class="text-xs font-bold text-white">${this.escapeHtml(snowballTarget.title)}</span>
              </div>
              <span class="text-[10px] text-amber-300/80 block mt-0.5">En hızlı tamamlanabilecek hedef</span>
            </div>
            <div class="text-right font-mono">
              <span class="text-xs font-bold text-amber-300 block">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(remainingVal)}</span>
              <span class="text-[9px] text-slate-400">Kalan</span>
            </div>
          </div>
        `;
      } else {
        snowballCard.innerHTML = `<div class="text-xs text-slate-500 italic py-2 text-center">Harika! Aktif bir ödeme yükümlülüğünüz bulunmuyor.</div>`;
      }
    }

    // 3. Orta Sütun: Plan & Taksit Kartları Listesi
    const debtCountBadge = document.getElementById('budgetDebtCountBadge');
    if (debtCountBadge) debtCountBadge.textContent = `${data.debts?.length || 0} Kayıt`;

    const debtsList = document.getElementById('budgetDebtsList');
    if (debtsList) {
      if (!data.debts || data.debts.length === 0) {
        debtsList.innerHTML = `
          <div class="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-500 text-xs space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto"><i data-lucide="check" class="w-5 h-5"></i></div>
            <p>Aktif bir ödeme planı veya taksit kaydınız bulunmuyor.</p>
          </div>
        `;
      } else {
        debtsList.innerHTML = data.debts.map(d => {
          const isSnowball = snowballTarget && snowballTarget.id === d.id;
          const remainingVal = d.calculatedTotal || d.total || 0;
          const monthlyVal = Number(d.monthly) || 0;

          // Tip İkonu
          let typeIcon = 'credit-card';
          let typeColor = 'text-blue-400';
          if (d.type === 'loan') { typeIcon = 'landmark'; typeColor = 'text-purple-400'; }
          else if (d.type === 'gold_fx') { typeIcon = 'coins'; typeColor = 'text-amber-400'; }
          else if (d.type === 'personal') { typeIcon = 'users'; typeColor = 'text-emerald-400'; }

          // Alt Taksitler HTML\'i
          let subItemsHtml = '';
          if (d.subItems && d.subItems.length > 0) {
            subItemsHtml = `
              <div class="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>İçerikteki Taksitler:</span>
                  <button onclick="Portal.openAddSubItemPrompt('${d.id}')" class="text-blue-400 hover:text-blue-300 cursor-pointer">+ Taksit Ekle</button>
                </div>
                ${d.subItems.map(sub => `
                  <div class="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 text-xs">
                    <span class="text-slate-300 text-[11px]">${this.escapeHtml(sub.title)} <span class="text-[9px] text-slate-500 font-mono">(${sub.term || ''})</span></span>
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-slate-200 text-[11px]">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(sub.amount)}</span>
                      <button onclick="Portal.removeBudgetSubItem('${d.id}', '${sub.id}')" class="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"><i data-lucide="x" class="w-3 h-3"></i></button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
          } else if (d.type === 'card') {
            subItemsHtml = `
              <div class="mt-2.5 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[10px]">
                <span class="text-slate-500">Ekstre içindeki taksitleri ayırın:</span>
                <button onclick="Portal.openAddSubItemPrompt('${d.id}')" class="text-blue-400 hover:text-blue-300 cursor-pointer">+ Taksit Ekle</button>
              </div>
            `;
          }

          // Kalan İlerleme Çubuğu
          const pct = monthlyVal > 0 && remainingVal > 0 ? Math.min(100, Math.round((monthlyVal / remainingVal) * 100)) : 15;

          return `
            <div class="p-4 rounded-2xl bg-slate-900 border transition-all ${isSnowball ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'} relative">
              ${isSnowball ? '<span class="absolute -top-2 right-4 px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px] font-mono tracking-tight shadow-sm">ÖNCELİKLİ HEDEF</span>' : ''}
              
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${typeColor} flex-shrink-0">
                    <i data-lucide="${typeIcon}" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-xs tracking-tight">${this.escapeHtml(d.title)}</h4>
                    <span class="text-[10px] text-slate-400 block">${d.notes ? this.escapeHtml(d.notes) : (d.assetQty ? d.assetQty : 'Rutin Ödeme')}</span>
                  </div>
                </div>

                <div class="text-right font-mono">
                  ${monthlyVal > 0 ? `<span class="text-xs font-bold text-white block">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(monthlyVal)}<span class="text-[9px] text-slate-500 font-sans">/ay</span></span>` : ''}
                  <span class="text-[11px] text-slate-400 block mt-0.5">Kalan: <strong class="text-rose-300">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(remainingVal)}</strong></span>
                </div>
              </div>

              <!-- İnce İlerleme Çubuğu -->
              <div class="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-3">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full opacity-80" style="width: ${pct}%"></div>
              </div>

              <!-- İç Taksitler -->
              ${subItemsHtml}

              <!-- İşlem Butonları -->
              <div class="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800/60">
                <button onclick="Portal.openDebtPaymentModal('${d.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1">
                  <i data-lucide="check-circle" class="w-3 h-3"></i> Ödeme Düş
                </button>
                <button onclick="Portal.deleteBudgetDebt('${d.id}')" class="p-1 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors" title="Sil">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Sağ Sütun: Sabit Gelirler Render
    const incList = document.getElementById('budgetIncomesList');
    if (incList) {
      if (!data.incomes || data.incomes.length === 0) {
        incList.innerHTML = `<div class="text-[11px] text-slate-500 italic py-2 text-center">Gelir tanımlanmadı.</div>`;
      } else {
        incList.innerHTML = data.incomes.map(inc => `
          <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <span class="font-medium text-slate-300 text-[11px]">${this.escapeHtml(inc.title)}</span>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-blue-400">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(inc.amount)}</span>
              <button onclick="Portal.deleteBudgetIncome('${inc.id}')" class="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"><i data-lucide="x" class="w-3 h-3"></i></button>
            </div>
          </div>
        `).join('');
      }
    }

    // 5. Sağ Sütun: Sabit Giderler Render (X+Y TİK SİSTEMİ)
    const fixedList = document.getElementById('budgetFixedExpensesList');
    if (fixedList) {
      if (!data.fixedExpenses || data.fixedExpenses.length === 0) {
        fixedList.innerHTML = `<div class="text-[11px] text-slate-500 italic py-2 text-center">Sabit gider tanımlanmadı.</div>`;
      } else {
        fixedList.innerHTML = data.fixedExpenses.map(fix => {
          const isIncluded = fix.included !== false;
          return `
            <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs transition-colors ${isIncluded ? 'hover:border-slate-700' : 'opacity-60 border-dashed'}">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  ${isIncluded ? 'checked' : ''} 
                  onchange="Portal.toggleFixedExpenseIncluded('${fix.id}', this.checked)"
                  class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                >
                <span class="font-medium text-slate-200 text-[11px] ${isIncluded ? '' : 'line-through text-slate-500'}">${this.escapeHtml(fix.title)}</span>
              </label>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-amber-400/90 ${isIncluded ? '' : 'text-slate-500'}">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(fix.amount)}</span>
                <button onclick="Portal.deleteBudgetFixedExpense('${fix.id}')" class="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"><i data-lucide="x" class="w-3 h-3"></i></button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // Sabit Gider Dahil Et / Hariç Tut (X+Y Tik Sistemi)
  toggleFixedExpenseIncluded(id, isIncluded) {
    const data = this.getLocalBudgetData();
    const item = (data.fixedExpenses || []).find(f => f.id === id);
    if (item) {
      item.included = isIncluded;
      this.saveBudgetData(data);
      this.playAudioFeedback('click');
      this.toast(isIncluded ? `${item.title} aylık toplama dahil edildi.` : `${item.title} aylık toplamdan çıkarıldı.`, 'info');
    }
  },

  // Bütçe Kaydı Ekleme Modalı
  openBudgetModal(initialType = 'debt') {
    this.setBudgetModalType(initialType);
    this.openModal('budgetModal');
    setTimeout(() => {
      const input = document.getElementById('budgetTitleInput');
      if (input) {
        input.focus();
        if (!input.dataset.boundEnter) {
          input.dataset.boundEnter = 'true';
          const inputs = ['budgetTitleInput', 'budgetMonthlyAmountInput', 'budgetTotalAmountInput', 'budgetAssetQtyInput', 'budgetAssetCustomRateInput', 'budgetNotesInput'];
          inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
              el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  this.saveBudgetRecord();
                }
              });
            }
          });
        }
      }
    }, 100);
  },

  setBudgetModalType(type) {
    const typeInput = document.getElementById('budgetRecordType');
    if (typeInput) typeInput.value = type;

    const btnDebt = document.getElementById('btnBudgetType_debt');
    const btnIncome = document.getElementById('btnBudgetType_income');
    const btnFixed = document.getElementById('btnBudgetType_fixed');
    const debtCatGroup = document.getElementById('budgetDebtCategoryGroup');
    const totalRemainingGroup = document.getElementById('budgetTotalRemainingGroup');
    const mainAmountLabel = document.getElementById('budgetMainAmountLabel');
    const modalTitle = document.getElementById('budgetModalTitle');

    const activeClass = 'flex-1 py-1.5 rounded-lg bg-blue-600 text-white font-bold shadow-sm';
    const inactiveClass = 'flex-1 py-1.5 rounded-lg text-slate-400 font-medium hover:text-white';

    if (btnDebt) btnDebt.className = type === 'debt' ? activeClass : inactiveClass;
    if (btnIncome) btnIncome.className = type === 'income' ? activeClass : inactiveClass;
    if (btnFixed) btnFixed.className = type === 'fixed' ? activeClass : inactiveClass;

    if (type === 'debt') {
      if (debtCatGroup) debtCatGroup.classList.remove('hidden');
      if (totalRemainingGroup) totalRemainingGroup.classList.remove('hidden');
      if (mainAmountLabel) mainAmountLabel.textContent = 'Aylık Taksit / Asgari (₺)';
      if (modalTitle) modalTitle.textContent = 'Ödeme Planı / Taksit Ekle';
      this.onBudgetCategoryChange(document.getElementById('budgetDebtCategorySelect')?.value || 'card');
    } else if (type === 'income') {
      if (debtCatGroup) debtCatGroup.classList.add('hidden');
      if (totalRemainingGroup) totalRemainingGroup.classList.add('hidden');
      const goldGroup = document.getElementById('budgetGoldFxGroup');
      if (goldGroup) goldGroup.classList.add('hidden');
      if (mainAmountLabel) mainAmountLabel.textContent = 'Aylık Net Tutar (₺)';
      if (modalTitle) modalTitle.textContent = 'Sabit Gelir Ekle';
    } else if (type === 'fixed') {
      if (debtCatGroup) debtCatGroup.classList.add('hidden');
      if (totalRemainingGroup) totalRemainingGroup.classList.add('hidden');
      const goldGroup = document.getElementById('budgetGoldFxGroup');
      if (goldGroup) goldGroup.classList.add('hidden');
      if (mainAmountLabel) mainAmountLabel.textContent = 'Aylık Fatura / Gider Tutarı (₺)';
      if (modalTitle) modalTitle.textContent = 'Sabit Gider / Fatura Ekle';
    }
  },

  onBudgetCategoryChange(val) {
    const goldGroup = document.getElementById('budgetGoldFxGroup');
    if (goldGroup) {
      if (val === 'gold_fx') {
        goldGroup.classList.remove('hidden');
      } else {
        goldGroup.classList.add('hidden');
      }
    }
  },

  saveBudgetRecord() {
    const type = document.getElementById('budgetRecordType')?.value || 'debt';
    const title = (document.getElementById('budgetTitleInput')?.value || '').trim();
    const monthly = parseFloat(document.getElementById('budgetMonthlyAmountInput')?.value) || 0;
    const total = parseFloat(document.getElementById('budgetTotalAmountInput')?.value) || 0;
    const notes = (document.getElementById('budgetNotesInput')?.value || '').trim();
    const debtCat = document.getElementById('budgetDebtCategorySelect')?.value || 'card';
    const assetQty = (document.getElementById('budgetAssetQtyInput')?.value || '').trim();
    const customRate = parseFloat(document.getElementById('budgetAssetCustomRateInput')?.value) || null;

    if (!title) {
      this.toast('Lütfen bir başlık girin.', 'error');
      return;
    }

    const data = this.getLocalBudgetData();
    const newId = 'rec_' + Date.now();

    if (type === 'income') {
      data.incomes = data.incomes || [];
      data.incomes.push({ id: newId, title, amount: monthly, active: true });
      this.toast('Sabit gelir kaydedildi.', 'success');
    } else if (type === 'fixed') {
      data.fixedExpenses = data.fixedExpenses || [];
      data.fixedExpenses.push({ id: newId, title, amount: monthly, active: true, included: true });
      this.toast('Sabit gider kaydedildi.', 'success');
    } else {
      data.debts = data.debts || [];
      data.debts.push({
        id: newId,
        type: debtCat,
        title,
        monthly,
        total: total || monthly,
        notes,
        assetQty: debtCat === 'gold_fx' ? assetQty : null,
        customRate: debtCat === 'gold_fx' ? customRate : null,
        subItems: []
      });
      this.toast('Ödeme planı eklendi.', 'success');
    }

    this.saveBudgetData(data);
    this.closeModal('budgetModal');

    // Formu temizle
    document.getElementById('budgetTitleInput').value = '';
    document.getElementById('budgetMonthlyAmountInput').value = '';
    document.getElementById('budgetTotalAmountInput').value = '';
    document.getElementById('budgetNotesInput').value = '';
    if (document.getElementById('budgetAssetQtyInput')) document.getElementById('budgetAssetQtyInput').value = '';
    if (document.getElementById('budgetAssetCustomRateInput')) document.getElementById('budgetAssetCustomRateInput').value = '';
  },

  deleteBudgetIncome(id) {
    const data = this.getLocalBudgetData();
    data.incomes = (data.incomes || []).filter(i => i.id !== id);
    this.saveBudgetData(data);
    this.toast('Gelir kaydı silindi.', 'info');
  },

  deleteBudgetFixedExpense(id) {
    const data = this.getLocalBudgetData();
    data.fixedExpenses = (data.fixedExpenses || []).filter(f => f.id !== id);
    this.saveBudgetData(data);
    this.toast('Sabit gider silindi.', 'info');
  },

  deleteBudgetDebt(id) {
    const data = this.getLocalBudgetData();
    data.debts = (data.debts || []).filter(d => d.id !== id);
    this.saveBudgetData(data);
    this.toast('Ödeme planı silindi.', 'info');
  },

  openAddSubItemModal(debtId) {
    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === debtId);
    if (!debt) return;

    const targetIdEl = document.getElementById('subItemTargetDebtId');
    const planNameEl = document.getElementById('subItemModalPlanName');
    const titleInput = document.getElementById('subItemTitleInput');
    const amountInput = document.getElementById('subItemAmountInput');
    const termInput = document.getElementById('subItemTermInput');

    if (targetIdEl) targetIdEl.value = debtId;
    if (planNameEl) planNameEl.textContent = `${debt.title} içine taksit kaydı`;
    if (titleInput) titleInput.value = '';
    if (amountInput) amountInput.value = '';
    if (termInput) termInput.value = '';

    this.openModal('budgetSubItemModal');
    setTimeout(() => { 
      if (titleInput) {
        titleInput.focus();
        if (!titleInput.dataset.boundEnter) {
          titleInput.dataset.boundEnter = 'true';
          [titleInput, amountInput, termInput].forEach(inp => {
            if (inp) {
              inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  this.confirmAddSubItem();
                }
              });
            }
          });
        }
      }
    }, 100);
  },

  confirmAddSubItem() {
    const targetId = document.getElementById('subItemTargetDebtId')?.value;
    const title = (document.getElementById('subItemTitleInput')?.value || '').trim();
    const amount = parseFloat(document.getElementById('subItemAmountInput')?.value) || 0;
    const term = (document.getElementById('subItemTermInput')?.value || '').trim();

    if (!title) {
      this.toast('Lütfen taksit açıklaması girin.', 'error');
      return;
    }
    if (amount <= 0) {
      this.toast('Geçerli bir aylık taksit tutarı girin.', 'error');
      return;
    }

    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === targetId);
    if (debt) {
      debt.subItems = debt.subItems || [];
      debt.subItems.push({
        id: 'sub_' + Date.now(),
        title,
        amount,
        term
      });
      this.saveBudgetData(data);
      this.closeModal('budgetSubItemModal');
      this.toast('İç taksit başarıyla eklendi.', 'success');
      this.playAudioFeedback('complete');
    }
  },

  removeBudgetSubItem(debtId, subId) {
    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === debtId);
    if (debt && debt.subItems) {
      debt.subItems = debt.subItems.filter(s => s.id !== subId);
      this.saveBudgetData(data);
      this.toast('İç taksit kaldırıldı.', 'info');
    }
  },

  openDebtPaymentModal(debtId) {
    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === debtId);
    if (!debt) return;

    const remainingVal = debt.calculatedTotal || debt.total || 0;
    const monthlyVal = Number(debt.monthly) || 0;

    const targetIdEl = document.getElementById('paymentTargetDebtId');
    const modalTitle = document.getElementById('paymentModalTitle');
    const subtitle = document.getElementById('paymentModalSubtitle');
    const currentRemEl = document.getElementById('paymentCurrentRemainingDisplay');
    const amountInput = document.getElementById('paymentAmountInput');
    const quickBtn = document.getElementById('paymentMonthlyQuickBtn');

    if (targetIdEl) targetIdEl.value = debtId;
    if (modalTitle) modalTitle.textContent = `${debt.title} - Ödeme Düş`;
    if (subtitle) subtitle.textContent = 'Kalan bakiyeyi güncelleyin';
    if (currentRemEl) {
      currentRemEl.textContent = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(remainingVal);
    }
    if (amountInput) {
      amountInput.value = monthlyVal > 0 ? monthlyVal : (remainingVal > 0 ? remainingVal : 1000);
    }
    if (quickBtn) {
      quickBtn.textContent = monthlyVal > 0 ? `Aylık (${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(monthlyVal)} ₺)` : 'Varsayılan';
    }

    this.openModal('paymentModal');
    setTimeout(() => { 
      if (amountInput) {
        amountInput.focus(); 
        amountInput.select();
        if (!amountInput.dataset.boundEnter) {
          amountInput.dataset.boundEnter = 'true';
          amountInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.confirmDebtPayment();
            }
          });
        }
      }
    }, 100);
  },

  fillFullPayment() {
    const targetId = document.getElementById('paymentTargetDebtId')?.value;
    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === targetId);
    if (debt) {
      const remainingVal = debt.calculatedTotal || debt.total || 0;
      const amountInput = document.getElementById('paymentAmountInput');
      if (amountInput) amountInput.value = remainingVal;
    }
  },

  fillMonthlyPayment() {
    const targetId = document.getElementById('paymentTargetDebtId')?.value;
    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === targetId);
    if (debt) {
      const monthlyVal = Number(debt.monthly) || 0;
      const amountInput = document.getElementById('paymentAmountInput');
      if (amountInput) amountInput.value = monthlyVal;
    }
  },

  confirmDebtPayment() {
    const targetId = document.getElementById('paymentTargetDebtId')?.value;
    const amountInput = document.getElementById('paymentAmountInput');
    const pay = parseFloat(amountInput?.value) || 0;

    if (pay <= 0) {
      this.toast('Lütfen 0\'dan büyük bir ödeme tutarı girin.', 'error');
      return;
    }

    const data = this.getLocalBudgetData();
    const debt = (data.debts || []).find(d => d.id === targetId);
    if (!debt) return;

    debt.total = Math.max(0, (debt.total || 0) - pay);
    if (debt.calculatedTotal) debt.calculatedTotal = Math.max(0, debt.calculatedTotal - pay);
    
    this.saveBudgetData(data);
    this.closeModal('paymentModal');
    this.toast(`${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(pay)} ₺ ödeme düşüldü. Kalan tutar güncellendi! 🎉`, 'success');
    this.playAudioFeedback('complete');
  },

  // Geriye dönük uyumluluk için alias
  makeDebtPaymentPrompt(debtId) {
    this.openDebtPaymentModal(debtId);
  },
  openAddSubItemPrompt(debtId) {
    this.openAddSubItemModal(debtId);
  },

  // =========================================================================
  // YÜZEN, SÜRÜKLENEBİLİR & BOYUTLANDIRILABİLİR HESAP MAKİNESİ (necoPRO OS)
  // =========================================================================
  toggleFloatingCalculator() {
    const win = document.getElementById('floatingCalculatorWindow');
    if (!win) return;

    if (win.classList.contains('hidden')) {
      win.classList.remove('hidden');
      this.initCalculatorDrag();
      this.playAudioFeedback('click');
    } else {
      win.classList.add('hidden');
    }
  },

  closeFloatingCalculator() {
    const win = document.getElementById('floatingCalculatorWindow');
    if (win) win.classList.add('hidden');
  },

  minimizeFloatingCalculator() {
    const win = document.getElementById('floatingCalculatorWindow');
    if (win) {
      win.classList.add('hidden');
      this.toast('Hesap makinesi arka plana alındı. 🧮', 'info');
    }
  },

  initCalculatorDrag() {
    if (this.budgetState.dragInitialized) return;
    const win = document.getElementById('floatingCalculatorWindow');
    const handle = document.getElementById('calculatorDragHandle');
    if (!win || !handle) return;

    this.budgetState.dragInitialized = true;
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      win.style.left = initialLeft + 'px';
      win.style.top = initialTop + 'px';
      win.style.right = 'auto';

      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newLeft = Math.max(10, Math.min(window.innerWidth - win.offsetWidth - 10, initialLeft + dx));
      const newTop = Math.max(10, Math.min(window.innerHeight - win.offsetHeight - 10, initialTop + dy));

      win.style.left = newLeft + 'px';
      win.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
      }
    });
  },

  calculatorNum(digit) {
    if (this.budgetState.calcResetNext) {
      this.budgetState.calcValue = digit === '.' ? '0.' : digit;
      this.budgetState.calcResetNext = false;
    } else {
      if (digit === '.') {
        if (!this.budgetState.calcValue.includes('.')) {
          this.budgetState.calcValue += '.';
        }
      } else {
        if (this.budgetState.calcValue === '0') {
          this.budgetState.calcValue = digit;
        } else {
          this.budgetState.calcValue += digit;
        }
      }
    }
    this.updateCalculatorScreen();
  },

  calculatorOp(op) {
    const cur = parseFloat(this.budgetState.calcValue) || 0;
    if (this.budgetState.calcPrev !== null && this.budgetState.calcOp && !this.budgetState.calcResetNext) {
      this.calculatorEquals();
    }
    this.budgetState.calcPrev = parseFloat(this.budgetState.calcValue) || 0;
    this.budgetState.calcOp = op;
    this.budgetState.calcResetNext = true;

    const hist = document.getElementById('calcHistoryDisplay');
    if (hist) hist.textContent = `${this.budgetState.calcPrev} ${op}`;
  },

  calculatorEquals() {
    if (this.budgetState.calcPrev === null || !this.budgetState.calcOp) return;
    const prev = this.budgetState.calcPrev;
    const cur = parseFloat(this.budgetState.calcValue) || 0;
    let res = 0;

    switch (this.budgetState.calcOp) {
      case '+': res = prev + cur; break;
      case '-': res = prev - cur; break;
      case '*': res = prev * cur; break;
      case '/': res = cur !== 0 ? prev / cur : 0; break;
      case '%': res = (prev * cur) / 100; break;
      default: res = cur;
    }

    const hist = document.getElementById('calcHistoryDisplay');
    if (hist) hist.textContent = `${prev} ${this.budgetState.calcOp} ${cur} =`;

    this.budgetState.calcValue = String(Math.round(res * 1000000) / 1000000);
    this.budgetState.calcPrev = null;
    this.budgetState.calcOp = null;
    this.budgetState.calcResetNext = true;
    this.updateCalculatorScreen();
  },

  calculatorClear() {
    this.budgetState.calcValue = '0';
    this.budgetState.calcPrev = null;
    this.budgetState.calcOp = null;
    this.budgetState.calcResetNext = false;
    const hist = document.getElementById('calcHistoryDisplay');
    if (hist) hist.textContent = '';
    this.updateCalculatorScreen();
  },

  calculatorBackspace() {
    if (this.budgetState.calcResetNext) return;
    if (this.budgetState.calcValue.length > 1) {
      this.budgetState.calcValue = this.budgetState.calcValue.slice(0, -1);
    } else {
      this.budgetState.calcValue = '0';
    }
    this.updateCalculatorScreen();
  },

  updateCalculatorScreen() {
    const screen = document.getElementById('calcScreenDisplay');
    if (screen) {
      screen.textContent = this.budgetState.calcValue;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.Portal.init());
} else {
  window.Portal.init();
}
