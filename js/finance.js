/**
 * Finance & Market Watchlist Module - Borsa, Döviz, Altın ve Hisse Takibi
 */

const DEFAULT_MARKET_RATES = {
  usd: { name: 'Dolar (USD)', code: 'USD/TRY', price: 38.65, change: 0.18 },
  eur: { name: 'Euro (EUR)', code: 'EUR/TRY', price: 41.95, change: -0.12 },
  gbp: { name: 'Sterlin (GBP)', code: 'GBP/TRY', price: 49.30, change: 0.25 },
  gold_gram: { name: 'Gram Altın (24K)', code: 'GA/TRY', price: 3425.00, change: 0.85 },
  gold_has: { name: 'Has Altın', code: 'HAS/TRY', price: 3425.00, change: 0.85 },
  gold_bilezik: { name: '22 Ayar Bilezik', code: 'B22/TRY', price: 3135.00, change: 0.85 },
  gold_quarter: { name: 'Çeyrek Altın', code: 'ÇA/TRY', price: 5610.00, change: 0.85 },
  gold_half: { name: 'Yarım Altın', code: 'YA/TRY', price: 11220.00, change: 0.85 },
  gold_full: { name: 'Tam Altın (Ziynet)', code: 'TA/TRY', price: 22440.00, change: 0.85 },
  gold_ata: { name: 'Ata / Cumhuriyet', code: 'ATA/TRY', price: 23100.00, change: 0.85 },
  bist100: { name: 'BIST 100', code: 'XU100', price: 10485.50, change: 1.34 }
};

const BIST_ALL_STOCKS = [
  { symbol: 'THYAO', name: 'Türk Hava Yolları', sector: 'Havacılık', price: 306.50 },
  { symbol: 'ASELS', name: 'Aselsan Askeri Elektronik', sector: 'Savunma Sanayii', price: 63.80 },
  { symbol: 'TUPRS', name: 'Tüpraş Türkiye Petrol Rafinerileri', sector: 'Enerji & Petrol', price: 169.50 },
  { symbol: 'EREGL', name: 'Ereğli Demir ve Çelik', sector: 'Demir Çelik & Metal', price: 51.90 },
  { symbol: 'SASA', name: 'Sasa Polyester Sanayi', sector: 'Kimya & Tekstil', price: 4.88 },
  { symbol: 'BIMAS', name: 'BİM Birleşik Mağazalar', sector: 'Perakende Ticaret', price: 546.00 },
  { symbol: 'AKBNK', name: 'Akbank T.A.Ş.', sector: 'Bankacılık', price: 58.70 },
  { symbol: 'GARAN', name: 'Türkiye Garanti Bankası', sector: 'Bankacılık', price: 118.50 },
  { symbol: 'KCHOL', name: 'Koç Holding A.Ş.', sector: 'Holding & Yatırım', price: 212.00 },
  { symbol: 'SAHOL', name: 'Sabancı Holding A.Ş.', sector: 'Holding & Yatırım', price: 98.40 },
  { symbol: 'SISE', name: 'Türkiye Şişe ve Cam Fabrikaları', sector: 'Cam & Sanayi', price: 47.60 },
  { symbol: 'FROTO', name: 'Ford Otomotiv Sanayi', sector: 'Otomotiv', price: 1085.00 },
  { symbol: 'TOASO', name: 'Tofaş Türk Otomobil Fabrikası', sector: 'Otomotiv', price: 235.00 },
  { symbol: 'PETKM', name: 'Petkim Petrokimya Holding', sector: 'Petrokimya', price: 21.20 },
  { symbol: 'YKBNK', name: 'Yapı ve Kredi Bankası', sector: 'Bankacılık', price: 29.80 },
  { symbol: 'ISCTR', name: 'Türkiye İş Bankası (C)', sector: 'Bankacılık', price: 14.20 },
  { symbol: 'HALKB', name: 'Türkiye Halk Bankası', sector: 'Bankacılık', price: 17.80 },
  { symbol: 'VAKBN', name: 'Türkiye Vakıflar Bankası', sector: 'Bankacılık', price: 22.40 },
  { symbol: 'PGSUS', name: 'Pegasus Hava Taşımacılığı', sector: 'Havacılık', price: 234.00 },
  { symbol: 'ARCLK', name: 'Arçelik A.Ş.', sector: 'Dayanıklı Tüketim', price: 162.00 },
  { symbol: 'ENKAI', name: 'Enka İnşaat ve Sanayi', sector: 'İnşaat & Taahhüt', price: 42.50 },
  { symbol: 'KOZAL', name: 'Koza Altın İşletmeleri', sector: 'Madencilik & Altın', price: 23.90 },
  { symbol: 'KOZAA', name: 'Koza Anadolu Metal Madencilik', sector: 'Madencilik', price: 54.00 },
  { symbol: 'IPEKE', name: 'İpek Doğal Enerji', sector: 'Enerji', price: 39.50 },
  { symbol: 'ALARK', name: 'Alarko Holding', sector: 'Holding & Enerji', price: 95.80 },
  { symbol: 'ASTOR', name: 'Astor Enerji A.Ş.', sector: 'Enerji Ekipmanları', price: 96.50 },
  { symbol: 'EUPWR', name: 'Europower Enerji ve Otomasyon', sector: 'Yenilenebilir Enerji', price: 91.20 },
  { symbol: 'GESAN', name: 'Girişim Elektrik Sanayi', sector: 'Elektrik & Enerji', price: 49.30 },
  { symbol: 'KONTR', name: 'Kontrolmatik Teknoloji Enerji', sector: 'Teknoloji & Enerji', price: 46.80 },
  { symbol: 'MIATK', name: 'Mia Teknoloji A.Ş.', sector: 'Yazılım & Bilişim', price: 62.10 },
  { symbol: 'REEDR', name: 'Reeder Teknoloji Sanayi', sector: 'Elektronik & Teknoloji', price: 32.40 },
  { symbol: 'EKGYO', name: 'Emlak Konut GYO', sector: 'Gayrimenkul Yatırım', price: 11.80 },
  { symbol: 'ISGYO', name: 'İş Gayrimenkul Yatırım Ortaklığı', sector: 'Gayrimenkul', price: 16.50 },
  { symbol: 'HEKTS', name: 'Hektaş Ticaret T.A.Ş.', sector: 'Tarım İlaçları & Kimya', price: 3.95 },
  { symbol: 'VESTL', name: 'Vestel Elektronik Sanayi', sector: 'Elektronik', price: 78.50 },
  { symbol: 'VESBE', name: 'Vestel Beyaz Eşya Sanayi', sector: 'Beyaz Eşya', price: 21.40 },
  { symbol: 'TTKOM', name: 'Türk Telekomünikasyon', sector: 'Telekomünikasyon', price: 49.20 },
  { symbol: 'TCELL', name: 'Turkcell İletişim Hizmetleri', sector: 'Telekomünikasyon', price: 94.00 },
  { symbol: 'MGROS', name: 'Migros Ticaret A.Ş.', sector: 'Perakende Market', price: 485.00 },
  { symbol: 'SOKM', name: 'Şok Marketler Ticaret', sector: 'Perakende Market', price: 54.00 },
  { symbol: 'ULKER', name: 'Ülker Bisküvi Sanayi', sector: 'Gıda & Şekerleme', price: 148.00 },
  { symbol: 'CCOLA', name: 'Coca-Cola İçecek A.Ş.', sector: 'İçecek & Meşrubat', price: 68.50 },
  { symbol: 'AEFES', name: 'Anadolu Efes Biracılık', sector: 'İçecek Sanayi', price: 215.00 },
  { symbol: 'KRDMD', name: 'Kardemir Karabük Demir Çelik (D)', sector: 'Demir Çelik', price: 28.50 },
  { symbol: 'GUBRF', name: 'Gübre Fabrikaları T.A.Ş.', sector: 'Kimya & Gübre', price: 185.00 },
  { symbol: 'CIMSA', name: 'Çimsa Çimento Sanayi', sector: 'Çimento & Yapı', price: 34.20 },
  { symbol: 'AKCNS', name: 'Akçansa Çimento Sanayi', sector: 'Çimento & Yapı', price: 142.00 },
  { symbol: 'OYAKC', name: 'Oyak Çimento Fabrikaları', sector: 'Çimento', price: 27.80 },
  { symbol: 'CANTE', name: 'Çan2 Termik A.Ş.', sector: 'Termik Enerji', price: 16.20 },
  { symbol: 'ODAS', name: 'Odaş Elektrik Üretim', sector: 'Enerji & Madencilik', price: 7.80 },
  { symbol: 'ZOREN', name: 'Zorlu Enerji Elektrik Üretim', sector: 'Elektrik & Enerji', price: 5.20 },
  { symbol: 'GWIND', name: 'Galata Wind Enerji', sector: 'Rüzgar Enerjisi', price: 27.50 },
  { symbol: 'CWENE', name: 'CW Enerji Mühendislik', sector: 'Güneş Enerjisi', price: 192.00 },
  { symbol: 'ALFAS', name: 'Alfa Solar Enerji Sanayi', sector: 'Güneş Enerjisi', price: 67.50 },
  { symbol: 'SDTTR', name: 'SDT Uzay ve Savunma', sector: 'Savunma Sanayii', price: 240.00 },
  { symbol: 'ALTNY', name: 'Altınay Savunma Teknolojileri', sector: 'Savunma & Robotik', price: 95.50 },
  { symbol: 'TARKM', name: 'Tarkim Bitki Koruma', sector: 'Tarım & Kimya', price: 590.00 },
  { symbol: 'TABGD', name: 'TAB Gıda Sanayi', sector: 'Restoran & Gıda', price: 145.00 },
  { symbol: 'KAYSE', name: 'Kayseri Şeker Fabrikası', sector: 'Gıda & Şeker', price: 26.50 },
  { symbol: 'BOSSA', name: 'Bossa Ticaret ve Sanayi', sector: 'Tekstil', price: 11.20 },
  { symbol: 'DOAS', name: 'Doğuş Otomotiv Servis', sector: 'Otomotiv & Dağıtım', price: 275.00 },
  { symbol: 'OTKAR', name: 'Otokar Otomotiv ve Savunma', sector: 'Otomotiv & Savunma', price: 480.00 },
  { symbol: 'TMSN', name: 'Tümosan Motor ve Traktör', sector: 'Motor & Traktör', price: 115.00 },
  { symbol: 'KLSER', name: 'Kaleseramik Çanakkale Kalebodur', sector: 'Seramik & Yapı', price: 44.50 },
  { symbol: 'EBEBK', name: 'Ebebek Mağazacılık', sector: 'Anne & Bebek Perakende', price: 48.00 },
  { symbol: 'BJKAS', name: 'Beşiktaş Futbol Yatırımları', sector: 'Spor Kulübü', price: 6.40 },
  { symbol: 'FENER', name: 'Fenerbahçe Futbol A.Ş.', sector: 'Spor Kulübü', price: 98.00 },
  { symbol: 'GSRAY', name: 'Galatasaray Sportif Sınai', sector: 'Spor Kulübü', price: 7.80 },
  { symbol: 'TSPOR', name: 'Trabzonspor Sportif Yatırım', sector: 'Spor Kulübü', price: 1.15 }
];

const POPULAR_BIST_STOCKS = BIST_ALL_STOCKS.slice(0, 8);

class FinanceManager {
  constructor() {
    this.rates = this.loadRates();
    this.watchlist = this.loadWatchlist();
    this.signals = {};
    this.lastUpdated = new Date();
    this.isLoading = false;
    this.isLiveConnected = false;
    this.initAutocomplete();

    // Başlangıçta canlı veriyi çek
    setTimeout(() => {
      this.fetchLiveMarketData();
    }, 150);

    // Her 30 saniyede bir otomatik canlı veri güncellemesi
    setInterval(() => {
      this.fetchLiveMarketData();
    }, 30000);
  }

  initAutocomplete() {
    setTimeout(() => {
      this.setupStockAutocomplete();
    }, 300);
  }

  setupStockAutocomplete() {
    const input = document.getElementById('stockInputSymbol');
    const container = document.getElementById('stockSuggestionsContainer');
    if (!input || !container) return;

    // Önceki listener'ları temizlemek için klonla veya doğrudan bağla
    input.oninput = (e) => {
      const rawQ = e.target.value.trim();
      if (!rawQ || rawQ.length < 1) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
      }

      const qNorm = window.normalizeTurkishText ? window.normalizeTurkishText(rawQ) : rawQ.toLowerCase();
      const qUpper = rawQ.toUpperCase();
      const qPrefix3 = qNorm.slice(0, 3);

      const allStocks = (window.BIST_ALL_COMPANIES && window.BIST_ALL_COMPANIES.length > 0) 
        ? window.BIST_ALL_COMPANIES 
        : BIST_ALL_STOCKS;

      // Akıllı Puanlama & Eşleştirme
      let results = [];

      allStocks.forEach(s => {
        const sSym = s.symbol.toUpperCase();
        const sNormName = window.normalizeTurkishText ? window.normalizeTurkishText(s.name) : s.name.toLowerCase();
        const sNormSector = window.normalizeTurkishText ? window.normalizeTurkishText(s.sector) : s.sector.toLowerCase();

        let score = 0;

        if (sSym === qUpper) {
          score = 100;
        } else if (sSym.startsWith(qUpper)) {
          score = 80;
        } else if (sSym.includes(qUpper)) {
          score = 60;
        } else if (sNormName.startsWith(qNorm)) {
          score = 50;
        } else if (sNormName.includes(qNorm)) {
          score = 40;
        } else if (sNormSector.includes(qNorm)) {
          score = 30;
        } else if (qPrefix3.length >= 3 && (sSym.startsWith(qPrefix3.toUpperCase()) || sNormName.startsWith(qPrefix3))) {
          // 3 harf yakınlık toleransı (örn: ALTBN yazınca ALTNY, ALBRK, ALTIN gelmesi için)
          score = 20;
        }

        if (score > 0) {
          results.push({ stock: s, score });
        }
      });

      // Puana göre sırala ve ilk 8 sonucu al
      results.sort((a, b) => b.score - a.score);
      const matches = results.slice(0, 8).map(r => r.stock);

      if (matches.length === 0) {
        container.innerHTML = `
          <div class="p-3 text-center text-xs text-slate-400">
            <span class="text-amber-400 font-bold">"${escapeHtml(qUpper)}"</span> için kayıtlı BIST hissesi bulunamadı.
            <p class="text-[11px] text-slate-300 mt-1">Yine de bu kodu veya kripto/yabancı hisseyi direkt ekleyebilirsiniz:</p>
            <button 
              type="button" 
              onclick="window.financeManager.selectSuggestion('${escapeHtml(qUpper)}', '${escapeHtml(rawQ)}', 100.0)"
              class="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all inline-block"
            >
              "${escapeHtml(qUpper)}" Olarak Listeye Ekle
            </button>
          </div>
        `;
        container.classList.remove('hidden');
        return;
      }

      container.innerHTML = `
        <div class="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
          <span class="text-amber-400 font-semibold">🔍 Eşleşen BIST Hisseleri (${matches.length} Sonuç)</span>
          <span class="text-slate-500 font-normal">Tıkla ve Doldur</span>
        </div>
        <div class="space-y-1 p-1 max-h-56 overflow-y-auto">
          ${matches.map(s => `
            <div 
              onclick="window.financeManager.selectSuggestion('${s.symbol}', '${s.name.replace(/'/g, "\\'")}', ${s.price})" 
              class="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-500/15 hover:border-amber-500/40 border border-transparent transition-all cursor-pointer group"
            >
              <div class="flex items-center space-x-2.5 min-w-0 pr-2">
                <span class="w-16 text-center px-1.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors flex-shrink-0">
                  ${s.symbol}
                </span>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-100 group-hover:text-amber-300 truncate">${escapeHtml(s.name)}</p>
                  <p class="text-[10px] text-slate-400 truncate">${escapeHtml(s.sector)}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <span class="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">~${s.price.toFixed(2)} ₺</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      container.classList.remove('hidden');
    };

    // Modal dışına tıklandığında önerileri kapat
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !container.contains(e.target)) {
        container.classList.add('hidden');
      }
    });
  }

  selectSuggestion(symbol, name, price) {
    const inputSym = document.getElementById('stockInputSymbol');
    const inputName = document.getElementById('stockInputName');
    const inputPrice = document.getElementById('stockInputPrice');
    const container = document.getElementById('stockSuggestionsContainer');

    if (inputSym) inputSym.value = symbol;
    if (inputName) inputName.value = name;
    if (inputPrice) inputPrice.value = price.toFixed(2);

    if (container) {
      container.innerHTML = '';
      container.classList.add('hidden');
    }

    if (window.app) {
      window.app.showToast(`${symbol} bilgileri otomatik dolduruldu`, 'info');
    }
  }

  loadRates() {
    return JSON.parse(JSON.stringify(DEFAULT_MARKET_RATES));
  }

  loadWatchlist() {
    const saved = window.appStorage.get(STORAGE_KEYS.FINANCE_WATCHLIST, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      window.appStorage.save(STORAGE_KEYS.FINANCE_WATCHLIST, POPULAR_BIST_STOCKS.slice(0, 5), false);
      return POPULAR_BIST_STOCKS.slice(0, 5);
    }
    // BKRGY veya yeni tamamlanan arzların resmi fiyat düzeltmesi
    saved.forEach(s => {
      if (s.symbol === 'BKRGY') {
        s.price = 12.93;
        s.name = 'Bakırcı Gayrimenkul Yatırım Ortaklığı A.Ş.';
      }
    });
    return saved;
  }

  save() {
    window.appStorage.save(STORAGE_KEYS.FINANCE_WATCHLIST, this.watchlist);
    this.render();
  }

  addStock(symbol, name, price = 100.0) {
    const sym = symbol.toUpperCase().trim();
    if (!sym) return;

    const existing = this.watchlist.find(s => s.symbol === sym);
    if (existing) {
      if (window.app) window.app.showToast(`${sym} zaten listenizde mevcut`, 'info');
      return;
    }

    const stock = {
      symbol: sym,
      name: name.trim() || sym,
      price: parseFloat(price) || 100.0,
      change: parseFloat(((Math.random() * 4) - 1.8).toFixed(2))
    };

    this.watchlist.push(stock);
    this.save();
    this.fetchLiveMarketData();
    if (window.app) window.app.showToast(`${sym} takip listesine eklendi`, 'success');
  }


  sendToPortfolio(symbol, name, price) {
    if (!window.ipoManager) return;
    
    if (window.app) {
      window.app.switchTab('ipo', true);
    }
    
    const id = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    let existing = window.ipoManager.ipos.find(i => i.id === id);
    
    if (!existing) {
      const stockIpo = {
        id: id,
        symbol: symbol.toUpperCase(),
        name: name,
        price: parseFloat(price) || 0,
        currentPrice: parseFloat(price) || 0,
        totalLots: '-',
        dates: 'Borsada İşlemde',
        status: 'trading',
        katilimEndeksi: false,
        isFollowed: false,
        myLots: 0,
        myBuyPrice: 0,
        myNotes: ''
      };
      window.ipoManager.ipos.push(stockIpo);
      window.ipoManager.save();
    }
    
    setTimeout(() => {
      window.ipoManager.openPortfolioModal(id);
      if (window.app) window.app.showToast(symbol + ' Portföy yönetimine aktarıldı!', 'success');
    }, 150);
  }

  removeStock(symbol) {
    this.watchlist = this.watchlist.filter(s => s.symbol !== symbol);
    this.save();
    if (window.app) window.app.showToast(`${symbol} listeden çıkarıldı`, 'info');
  }

  async fetchLiveMarketData() {
    this.isLoading = true;
    const symbols = this.watchlist.map(s => s.symbol).join(',');
    try {
      const res = await fetch(`/api/market-live?symbols=${encodeURIComponent(symbols)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Temel Kurlar & Sarrafiye
          if (data.rates.USD) this.rates.usd = { name: 'Dolar (USD)', code: 'USD/TRY', price: data.rates.USD.price, change: data.rates.USD.change };
          if (data.rates.EUR) this.rates.eur = { name: 'Euro (EUR)', code: 'EUR/TRY', price: data.rates.EUR.price, change: data.rates.EUR.change };
          if (data.rates.GBP) this.rates.gbp = { name: 'Sterlin (GBP)', code: 'GBP/TRY', price: data.rates.GBP.price, change: data.rates.GBP.change };
          if (data.rates.GA) this.rates.gold_gram = { name: 'Gram Altın (24K)', code: 'GA/TRY', price: data.rates.GA.price, change: data.rates.GA.change };
          if (data.rates.HAS) this.rates.gold_has = { name: 'Has Altın', code: 'HAS/TRY', price: data.rates.HAS.price, change: data.rates.HAS.change };
          if (data.rates.B22) this.rates.gold_bilezik = { name: '22 Ayar Bilezik', code: 'B22/TRY', price: data.rates.B22.price, change: data.rates.B22.change };
          if (data.rates.QA) this.rates.gold_quarter = { name: 'Çeyrek Altın', code: 'ÇA/TRY', price: data.rates.QA.price, change: data.rates.QA.change };
          if (data.rates.HALF) this.rates.gold_half = { name: 'Yarım Altın', code: 'YA/TRY', price: data.rates.HALF.price, change: data.rates.HALF.change };
          if (data.rates.FULL) this.rates.gold_full = { name: 'Tam Altın (Ziynet)', code: 'TA/TRY', price: data.rates.FULL.price, change: data.rates.FULL.change };
          if (data.rates.ATA) this.rates.gold_ata = { name: 'Ata / Cumhuriyet', code: 'ATA/TRY', price: data.rates.ATA.price, change: data.rates.ATA.change };
          if (data.rates.XU100) this.rates.bist100 = { name: 'BIST 100', code: 'XU100', price: data.rates.XU100.price, change: data.rates.XU100.change };

          // Takip Edilen Hisseler
          if (data.stocks) {
            this.watchlist.forEach(s => {
              const live = data.stocks[s.symbol];
              if (live && live.price) {
                s.price = live.price;
                s.change = live.change;
              }
            });
          }

          this.lastUpdated = new Date();
          this.isLiveConnected = true;
          this.save();
        }
      }
    } catch (e) {
      console.log('Live market API fetch note:', e);
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  refreshPrices() {
    this.fetchLiveMarketData();
    if (window.app) window.app.showToast('Canlı piyasa ve hisse fiyatları güncellendi', 'success');
  }

  render() {
    this.renderFinanceCard('financeWidgetContainer');
    this.renderFinanceCard('mainFinanceContainer');
  }

  renderFinanceCard(containerId = 'financeWidgetContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const timeStr = this.lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const formatChange = (ch) => {
      const isPositive = ch >= 0;
      return `
        <span class="inline-flex items-center text-[11px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}">
          ${isPositive ? '+' : ''}${ch}%
        </span>
      `;
    };

    // Rates Grid
    const keyRates = [
      { label: 'Dolar', val: this.rates.usd.price.toFixed(2) + ' ₺', ch: this.rates.usd.change, icon: 'dollar-sign' },
      { label: 'Euro', val: this.rates.eur.price.toFixed(2) + ' ₺', ch: this.rates.eur.change, icon: 'euro' },
      { label: 'Gram Altın', val: this.rates.gold_gram.price.toLocaleString('tr-TR') + ' ₺', ch: this.rates.gold_gram.change, icon: 'sparkles' },
      { label: 'BIST 100', val: this.rates.bist100.price.toLocaleString('tr-TR'), ch: this.rates.bist100.change, icon: 'trending-up' }
    ];

    const ratesHtml = keyRates.map(r => `
      <div class="p-3 space-y-1 border-r border-slate-700/30 last:border-0">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-medium text-slate-400">${r.label}</span>
          ${formatChange(r.ch)}
        </div>
        <div class="text-sm font-bold font-mono text-white tracking-tight">${r.val}</div>
      </div>
    `).join('');

    // Stocks Table
    const stocksHtml = this.watchlist.length > 0 ? this.watchlist.map(st => `
      <div class="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0 hover:bg-slate-900/20 px-2 -mx-2 rounded transition-all">
        <div class="flex items-center space-x-2.5 min-w-0 pr-2">
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
            ${st.symbol.slice(0, 3)}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-100 truncate">${st.symbol}</p>
            <p class="text-[10px] text-slate-400 truncate">${escapeHtml(st.name)}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 flex-shrink-0">
          <div class="text-right">
            <p class="text-xs font-bold font-mono text-white">${st.price.toFixed(2)} ₺</p>
            ${formatChange(st.change)}
          </div>
          
            <button onclick="window.financeManager.sendToPortfolio('${st.symbol}', '${escapeHtml(st.name)}', ${st.price})" title="Portföye (Lot) Ekle" class="p-1 text-slate-500 hover:text-amber-400 rounded-lg transition-colors cursor-pointer mr-1">
              <i data-lucide="briefcase" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="window.financeManager.removeStock('${st.symbol}')" title="Listeden Kaldır" class="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('') : `
      <div class="text-center py-6 text-xs text-slate-400">
        Takip listenizde henüz hisse yok. "+ Hisse Ekle" butonu ile ekleyebilirsiniz.
      </div>
    `;

    container.innerHTML = `
      <div class="rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg relative group">
          <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Basılı tutup sürükleyerek yerini değiştirin">
                <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
              </div>
              <div class="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <i data-lucide="trending-up" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-white">Canlı Borsa, Döviz & Altın</h3>
                <p class="text-[10px] text-slate-400">Son güncelleme: ${timeStr}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-1.5">
              <button onclick="window.app.minimizeWidget('finance')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                <i data-lucide="minus" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.financeManager.refreshPrices()" title="Fiyatları Güncelle" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="if(window.app) window.app.openModal('newStockModal')" class="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Hisse Ekle
              </button>
            </div>
          </div>
          <div class="p-5 space-y-4 widget-collapsible-content">
    `;

    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => { if (window.app && window.app.applyAllWidgetCollapses) window.app.applyAllWidgetCollapses(); }, 50);
  }

  openSignalModal(symbol) {
    const sym = symbol.replace('.IS', '').toUpperCase();
    const sig = this.signals[sym] || { sentiment: 'neutral', label: 'Nötr / Stabil ➔', score: 0, summary: 'Kritik bir haber akışı bulunmuyor.' };
    const stock = this.watchlist.find(s => s.symbol.toUpperCase() === sym) || { name: sym + ' Hissesi', price: 0 };

    const modal = document.getElementById('marketSignalModal');
    const content = document.getElementById('marketSignalModalContent');
    if (!modal || !content) return;

    let sentimentBadge = '';
    if (sig.sentiment === 'positive') {
      sentimentBadge = '<span class="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black text-xs">🟢 POZİTİF HABER AKIŞI (YÜKSELİŞ BEKLENTİSİ) ↗</span>';
    } else if (sig.sentiment === 'negative') {
      sentimentBadge = '<span class="px-3 py-1 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 font-black text-xs">🔴 RİSK / NEGATİF HABER AKIŞI (DÜŞÜŞ RİSKİ) ↘</span>';
    } else {
      sentimentBadge = '<span class="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">⚪ DENGELİ / NÖTR HABER AKIŞI ➔</span>';
    }

    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <h4 class="text-lg font-black text-white">${sym} <span class="text-xs font-normal text-slate-400 font-sans">(${stock.name})</span></h4>
            <span class="text-xs text-amber-400 font-bold font-mono">Son Fiyat: ${stock.price || '-'} ₺</span>
          </div>
          <div>
            ${sentimentBadge}
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <i data-lucide="newspaper" class="w-4 h-4 text-amber-400"></i>
            Haber & KAP Sentiment Analizi Özeti:
          </span>
          <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            ${sig.summary}
          </p>
          <span class="text-[10px] text-slate-500 italic block pt-1">
            * Bu analiz finans haberleri, KAP bültenleri ve açık piyasa duyurularındaki kilit kelimeler taranarak otomatik oluşturulmuştur. Yatırım tavsiyesi (YTD) değildir.
          </span>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    if (window.app) window.app.openModal('marketSignalModal');
  }

}

window.financeManager = new FinanceManager();
