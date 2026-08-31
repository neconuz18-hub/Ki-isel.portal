/**
 * IPO (Halka Arz) & BIST Portföy Yönetim Modülü - v7.0 (2026 Güncel SPK & BIST Takvimi)
 * 2026 Yılı Güncel Taslak İzahnameler, Onay Bekleyen Şirketler ve Canlı Portföy Kâr/Zarar Takibi
 */

const CURRENT_2026_BIST_IPOS = [
  // 1. 2026 YILI EN GÜNCEL HALKA ARZLAR (AĞUSTOS 2026 & YAKLAŞANLAR)
  {
    id: 'ipo_bkrgy',
    symbol: 'BKRGY',
    name: 'Bakırcı Gayrimenkul Yatırım Ortaklığı A.Ş.',
    status: 'upcoming',
    price: 12.93,
    dates: '24-25-26 Ağustos 2026 (Sonuçlandı - Kişi Başı: 221 Lot / 2.857 ₺)',
    totalLots: 167000000,
    fundSize: '2.15 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Eşit Dağıtım (502.090 Kişi Katıldı)',
    katilimEndeksi: true,
    consortium: 'Tacirler Yatırım',
    currentPrice: 12.93,
    ipoPrice: 12.93,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 12.93,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '502 Bin Kişi (Kesinleşen)', lots: 221, amount: '2.857 ₺' }
    ]
  },
  {
    id: 'ipo_sinbo',
    symbol: 'SINBO',
    name: 'Sinbo Küçük Ev Aletleri Sanayi ve Ticaret A.Ş.',
    status: 'upcoming',
    price: 32.50,
    dates: '2026 - Eylül / 3. Çeyrek (Taslak İzahname)',
    totalLots: 48000000,
    fundSize: '1.56 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'İş Yatırım',
    currentPrice: 32.50,
    ipoPrice: 32.50,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 32.50,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '1.5 Milyon', lots: 32, amount: '1.040 ₺' },
      { count: '2.0 Milyon', lots: 24, amount: '780 ₺' },
      { count: '2.5 Milyon', lots: 19, amount: '617 ₺' },
      { count: '3.0 Milyon', lots: 16, amount: '520 ₺' }
    ]
  },
  {
    id: 'ipo_tatilbudur',
    symbol: 'TATIL',
    name: 'Tatilbudur Seyahat Acenteliği ve Turizm A.Ş.',
    status: 'upcoming',
    price: 42.00,
    dates: '2026 - 4. Çeyrek (SPK İncelemesinde)',
    totalLots: 35000000,
    fundSize: '1.47 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Garanti BBVA Yatırım',
    currentPrice: 42.00,
    ipoPrice: 42.00,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 42.00,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '1.5 Milyon', lots: 23, amount: '966 ₺' },
      { count: '2.0 Milyon', lots: 17, amount: '714 ₺' },
      { count: '2.5 Milyon', lots: 14, amount: '588 ₺' },
      { count: '3.0 Milyon', lots: 11, amount: '462 ₺' }
    ]
  },
  {
    id: 'ipo_emlak_katilim',
    symbol: 'EMLKB',
    name: 'Türkiye Emlak Katılım Bankası A.Ş.',
    status: 'upcoming',
    price: 18.50,
    dates: '2026 - Sonbahar / 4. Çeyrek (Taslak)',
    totalLots: 120000000,
    fundSize: '2.22 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Tamamı Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Vakıf Yatırım & Ziraat Yatırım',
    currentPrice: 18.50,
    ipoPrice: 18.50,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 18.50,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '1.5 Milyon', lots: 80, amount: '1.480 ₺' },
      { count: '2.0 Milyon', lots: 60, amount: '1.110 ₺' },
      { count: '2.5 Milyon', lots: 48, amount: '888 ₺' },
      { count: '3.0 Milyon', lots: 40, amount: '740 ₺' }
    ]
  },
  {
    id: 'ipo_flo',
    symbol: 'FLOMZ',
    name: 'FLO Mağazacılık ve Ayakkabıcılık A.Ş.',
    status: 'upcoming',
    price: 45.00,
    dates: '2026 - 3./4. Çeyrek (Taslak İzahname)',
    totalLots: 55000000,
    fundSize: '2.47 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'İş Yatırım & Garanti BBVA',
    currentPrice: 45.00,
    ipoPrice: 45.00,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 45.00,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '1.5 Milyon', lots: 36, amount: '1.620 ₺' },
      { count: '2.0 Milyon', lots: 27, amount: '1.215 ₺' },
      { count: '2.5 Milyon', lots: 22, amount: '990 ₺' },
      { count: '3.0 Milyon', lots: 18, amount: '810 ₺' }
    ]
  },
  {
    id: 'ipo_defacto',
    symbol: 'DEFAK',
    name: 'Defacto Perakende Ticaret A.Ş.',
    status: 'upcoming',
    price: 35.00,
    dates: '2026 - 4. Çeyrek (Taslak İzahname)',
    totalLots: 60000000,
    fundSize: '2.10 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Yapı Kredi Yatırım',
    currentPrice: 35.00,
    ipoPrice: 35.00,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 35.00,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '1.5 Milyon', lots: 40, amount: '1.400 ₺' },
      { count: '2.0 Milyon', lots: 30, amount: '1.050 ₺' },
      { count: '2.5 Milyon', lots: 24, amount: '840 ₺' },
      { count: '3.0 Milyon', lots: 20, amount: '700 ₺' }
    ]
  },
  {
    id: 'ipo_spekn',
    symbol: 'SPEKN',
    name: 'Schmid Pekintaş Güneş Enerji A.Ş.',
    status: 'upcoming',
    price: 26.50,
    dates: '2026 - Sonbahar / 4. Çeyrek (Taslak)',
    totalLots: 40000000,
    fundSize: '1.06 Milyar ₺',
    market: 'Ana Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Gedik Yatırım',
    currentPrice: 26.50,
    ipoPrice: 26.50,
    dailyChange: 0.0,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 26.50,
    myNotes: '',
    tavanCount: 0,
    participantsEstimates: [
      { count: '1.5 Milyon', lots: 26, amount: '689 ₺' },
      { count: '2.0 Milyon', lots: 20, amount: '530 ₺' },
      { count: '2.5 Milyon', lots: 16, amount: '424 ₺' },
      { count: '3.0 Milyon', lots: 13, amount: '344 ₺' }
    ]
  },

  // 2. 2026 YILINDA BORSADA İŞLEM GÖRMEYE BAŞLAYAN HALKA ARZLAR (GEÇMİŞ & CANLI İŞLEM)
  {
    id: 'ipo_durkn',
    symbol: 'DURKN',
    name: 'Durukan Şekerleme Sanayi ve Ticaret A.Ş.',
    status: 'trading',
    price: 17.00,
    dates: '2026 - İşlemde',
    totalLots: 42500000,
    fundSize: '722.5 Milyon ₺',
    market: 'Ana Pazar',
    distribution: 'Bireysele Eşit',
    katilimEndeksi: true,
    consortium: 'Deniz Yatırım',
    currentPrice: 28.50,
    ipoPrice: 17.00,
    dailyChange: 1.40,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 17.00,
    myNotes: '',
    tavanCount: 5,
    returnPct: 67.6
  },
  {
    id: 'ipo_cemzy',
    symbol: 'CEMZY',
    name: 'Cem Zeytin Sanayi ve Ticaret A.Ş.',
    status: 'trading',
    price: 15.30,
    dates: '2026 - İşlemde',
    totalLots: 100000000,
    fundSize: '1.53 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Tamamı Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Bulls Yatırım',
    currentPrice: 22.80,
    ipoPrice: 15.30,
    dailyChange: -0.85,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 15.30,
    myNotes: '',
    tavanCount: 4,
    returnPct: 49.0
  },
  {
    id: 'ipo_ahsgy',
    symbol: 'AHSGY',
    name: 'Ahes Gayrimenkul Yatırım Ortaklığı A.Ş.',
    status: 'trading',
    price: 25.20,
    dates: '2026 - İşlemde',
    totalLots: 50000000,
    fundSize: '1.26 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Bireysele Eşit',
    katilimEndeksi: true,
    consortium: 'QNB Finansinvest',
    currentPrice: 38.40,
    ipoPrice: 25.20,
    dailyChange: 0.50,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 25.20,
    myNotes: '',
    tavanCount: 4,
    returnPct: 52.4
  },
  {
    id: 'ipo_alklc',
    symbol: 'ALKLC',
    name: 'Altınkılıç Gıda ve Süt Sanayi A.Ş.',
    status: 'trading',
    price: 22.98,
    dates: '2026 - İşlemde',
    totalLots: 33885000,
    fundSize: '778.6 Milyon ₺',
    market: 'Ana Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Gedik Yatırım',
    currentPrice: 24.50,
    ipoPrice: 22.98,
    dailyChange: 0.70,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 22.98,
    myNotes: '',
    tavanCount: 2,
    returnPct: 6.6
  },
  {
    id: 'ipo_onryt',
    symbol: 'ONRYT',
    name: 'Onur Yüksek Teknoloji A.Ş.',
    status: 'trading',
    price: 49.50,
    dates: '2026 - İşlemde',
    totalLots: 19730000,
    fundSize: '976.6 Milyon ₺',
    market: 'Ana Pazar',
    distribution: 'Tamamı Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'Gedik Yatırım',
    currentPrice: 88.20,
    ipoPrice: 49.50,
    dailyChange: 3.15,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 49.50,
    myNotes: '',
    tavanCount: 6,
    returnPct: 78.2
  },
  {
    id: 'ipo_kocmt',
    symbol: 'KOCMT',
    name: 'Koç Metalurji A.Ş.',
    status: 'trading',
    price: 20.50,
    dates: '2026 - İşlemde',
    totalLots: 125000000,
    fundSize: '2.56 Milyar ₺',
    market: 'Yıldız Pazar',
    distribution: 'Bireysele Eşit Dağıtım',
    katilimEndeksi: true,
    consortium: 'QNB Finansinvest',
    currentPrice: 28.90,
    ipoPrice: 20.50,
    dailyChange: -1.20,
    isFollowed: false,
    myLots: 0,
    myBuyPrice: 20.50,
    myNotes: '',
    tavanCount: 4,
    returnPct: 41.0
  }
];

class IpoManager {
  constructor() {
    this.ipos = this.loadIpos();
    this.activeFilter = 'open'; // 'open' (Yaklaşan & Taslak İzahnameler), 'my_portfolio', 'followed', 'archive', 'all'
    this.viewMode = window.appStorage.get('assistant_ipo_view_mode', 'grid');
    this.filterOrder = window.appStorage.get('assistant_ipo_filter_order', ['open', 'my_portfolio', 'followed', 'archive', 'all']);
    this.draggedFilter = null;
    this.syncLivePrices();
  }

  handleDragStart(e, filterKey) {
    this.draggedFilter = filterKey;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', filterKey);
    e.currentTarget.classList.add('opacity-40');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter(e) {
    e.preventDefault();
    const el = e.currentTarget;
    if (el) el.classList.add('ring-2', 'ring-amber-400', 'rounded-xl');
  }

  handleDragLeave(e) {
    const el = e.currentTarget;
    if (el) el.classList.remove('ring-2', 'ring-amber-400', 'rounded-xl');
  }

  handleDrop(e, targetKey) {
    e.preventDefault();
    const el = e.currentTarget;
    if (el) el.classList.remove('ring-2', 'ring-amber-400', 'rounded-xl');

    if (!this.draggedFilter || this.draggedFilter === targetKey) return;

    const fromIdx = this.filterOrder.indexOf(this.draggedFilter);
    const toIdx = this.filterOrder.indexOf(targetKey);

    if (fromIdx !== -1 && toIdx !== -1) {
      this.filterOrder.splice(fromIdx, 1);
      this.filterOrder.splice(toIdx, 0, this.draggedFilter);
      window.appStorage.save('assistant_ipo_filter_order', this.filterOrder, false);
      this.render();
      if (window.app) window.app.showToast('Menü sıralaması güncellendi', 'info');
    }
    this.draggedFilter = null;
  }

  loadIpos() {
    const saved = window.appStorage.get('assistant_ipos_v8', null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      window.appStorage.save('assistant_ipos_v8', CURRENT_2026_BIST_IPOS, false);
      return JSON.parse(JSON.stringify(CURRENT_2026_BIST_IPOS));
    }
    return saved;
  }

  save() {
    window.appStorage.save('assistant_ipos_v8', this.ipos);
    this.render();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    window.appStorage.save('assistant_ipo_view_mode', mode, false);
    this.render();
  }

  resetToDefaults() {
    const userLotMap = {};
    const userFollowMap = {};
    this.ipos.forEach(i => {
      if (i.myLots > 0) userLotMap[i.symbol] = { lots: i.myLots, price: i.myBuyPrice, notes: i.myNotes };
      if (i.isFollowed) userFollowMap[i.symbol] = true;
    });

    const fresh = JSON.parse(JSON.stringify(CURRENT_2026_BIST_IPOS));
    fresh.forEach(i => {
      if (userLotMap[i.symbol]) {
        i.myLots = userLotMap[i.symbol].lots;
        i.myBuyPrice = userLotMap[i.symbol].price;
        i.myNotes = userLotMap[i.symbol].notes;
        i.isFollowed = true;
      } else if (userFollowMap[i.symbol]) {
        i.isFollowed = true;
      }
    });

    this.ipos = fresh;
    this.save();
    if (window.app) window.app.showToast('2026 güncel takvimine sıfırlandı, portföyünüz korundu', 'success');
  }

  toggleFollow(id) {
    const ipo = this.ipos.find(i => i.id === id);
    if (!ipo) return;

    ipo.isFollowed = !ipo.isFollowed;
    if (!ipo.isFollowed) {
      ipo.myLots = 0;
    }
    this.save();

    if (window.app) {
      if (ipo.isFollowed) {
        window.app.showToast(`⭐ ${ipo.symbol} takibe alındı`, 'success');
      } else {
        window.app.showToast(`${ipo.symbol} takipten ve portföyden çıkarıldı`, 'info');
      }
    }
  }

  deleteIpo(id) {
    this.ipos = this.ipos.filter(i => i.id !== id);
    this.save();
    if (window.app) window.app.showToast('Halka arz kaydı silindi', 'info');
  }

  clearArchive() {
    const archiveCount = this.ipos.filter(i => i.status === 'trading' && !i.isFollowed && (i.myLots || 0) === 0).length;
    if (archiveCount === 0) {
      if (window.app) window.app.showToast('Temizlenecek geçmiş halka arz bulunmuyor', 'info');
      return;
    }
    if (!confirm(`Takip etmediğiniz ${archiveCount} adet geçmiş halka arz listeden temizlensin mi?`)) return;
    this.ipos = this.ipos.filter(i => i.status !== 'trading' || i.isFollowed || (i.myLots || 0) > 0);
    this.save();
    if (window.app) window.app.showToast('Geçmiş halka arz listesi temizlendi', 'success');
  }

  openPortfolioModal(id) {
    const ipo = this.ipos.find(i => i.id === id);
    if (!ipo) return;

    const modal = document.getElementById('ipoPortfolioModal');
    if (!modal) return;

    modal.dataset.ipoId = ipo.id;
    document.getElementById('ipoPortModalSymbol').textContent = `${ipo.symbol} - ${ipo.name}`;
    document.getElementById('ipoPortModalLivePrice').textContent = `${ipo.currentPrice.toFixed(2)} ₺`;

    const lotsInput = document.getElementById('ipoPortLotsInput');
    const priceInput = document.getElementById('ipoPortPriceInput');
    const notesInput = document.getElementById('ipoPortNotesInput');

    lotsInput.value = ipo.myLots || '';
    priceInput.value = ipo.myBuyPrice !== undefined ? ipo.myBuyPrice : ipo.price;
    notesInput.value = ipo.myNotes || '';

    this.updatePortfolioModalPreview(ipo);
    if (window.app) window.app.openModal('ipoPortfolioModal');
  }

  updatePortfolioModalPreview(ipo) {
    const lots = parseInt(document.getElementById('ipoPortLotsInput')?.value) || 0;
    const price = parseFloat(document.getElementById('ipoPortPriceInput')?.value) || (ipo ? ipo.price : 0);
    const livePrice = ipo ? ipo.currentPrice : price;

    const totalCost = lots * price;
    const currentValue = lots * livePrice;
    const profit = currentValue - totalCost;
    const profitPct = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;

    const costEl = document.getElementById('ipoPortModalCost');
    const valEl = document.getElementById('ipoPortModalValue');
    const profitEl = document.getElementById('ipoPortModalProfit');

    if (costEl) costEl.textContent = `${totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
    if (valEl) valEl.textContent = `${currentValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
    if (profitEl) {
      profitEl.textContent = `${profit >= 0 ? '+' : ''}${profit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ (${profitPct}%)`;
      profitEl.className = `text-sm font-bold font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }
  }

  savePortfolioEntry(id, lots, buyPrice, notes) {
    const ipo = this.ipos.find(i => i.id === id);
    if (!ipo) return;

    ipo.myLots = Math.max(0, parseInt(lots) || 0);
    ipo.myBuyPrice = parseFloat(buyPrice) || ipo.price;
    ipo.myNotes = notes ? notes.trim() : '';

    if (ipo.myLots > 0) {
      ipo.isFollowed = true;
    }

    this.save();
    if (window.app) {
      window.app.showToast(`${ipo.symbol} için ${ipo.myLots} Lot kaydedildi`, 'success');
      window.app.closeModal('ipoPortfolioModal');
    }
  }

  getPortfolioSummary() {
    let totalCost = 0;
    let currentValue = 0;
    let dailyProfit = 0;
    let activeHoldings = 0;

    this.ipos.forEach(ipo => {
      if (ipo.myLots && ipo.myLots > 0) {
        activeHoldings++;
        const cost = ipo.myLots * (ipo.myBuyPrice || ipo.price);
        const val = ipo.myLots * ipo.currentPrice;
        totalCost += cost;
        currentValue += val;

        const dayChangeRate = (ipo.dailyChange || 0) / 100;
        dailyProfit += val * dayChangeRate;
      }
    });

    const netProfit = currentValue - totalCost;
    const netProfitPct = totalCost > 0 ? ((netProfit / totalCost) * 100) : 0;
    const dailyProfitPct = currentValue > 0 ? ((dailyProfit / currentValue) * 100) : 0;

    return {
      totalCost,
      currentValue,
      netProfit,
      netProfitPct,
      dailyProfit,
      dailyProfitPct,
      activeHoldings
    };
  }

  async syncLivePrices() {
    const tradingSymbols = this.ipos
      .filter(i => i.status === 'trading')
      .map(i => i.symbol);

    if (tradingSymbols.length === 0) return;

    try {
      const res = await fetch(`/api/market-live?symbols=${encodeURIComponent(tradingSymbols.join(','))}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stocks) {
          let updated = false;
          this.ipos.forEach(ipo => {
            if (ipo.status === 'trading' && data.stocks[ipo.symbol]) {
              const live = data.stocks[ipo.symbol];
              if (live.price && live.price > 0) {
                let sanePrice = live.price;
                if (sanePrice > (ipo.ipoPrice * 20)) {
                  if (sanePrice > 1000 && ipo.ipoPrice < 50) {
                    sanePrice = sanePrice / 100.0;
                  }
                }
                ipo.currentPrice = sanePrice;
                ipo.dailyChange = live.change || 0;
                ipo.returnPct = parseFloat((((ipo.currentPrice - ipo.ipoPrice) / ipo.ipoPrice) * 100).toFixed(1));
                updated = true;
              }
            }
          });
          if (updated) {
            this.save();
          }
        }
      }
    } catch (e) {
      console.log('IPO live sync note:', e);
    }
  }

  addIpo(ipoData) {
    const newIpo = {
      id: 'ipo_' + Date.now(),
      symbol: ipoData.symbol.toUpperCase().trim(),
      name: ipoData.name.trim(),
      status: ipoData.status || 'upcoming',
      price: parseFloat(ipoData.price) || 20.0,
      dates: ipoData.dates || '2026 - Tarih Bekleniyor',
      totalLots: parseInt(ipoData.totalLots) || 20000000,
      fundSize: ipoData.fundSize || '1 Milyar ₺',
      market: ipoData.market || 'Yıldız Pazar',
      distribution: ipoData.distribution || 'Tamamı Eşit Dağıtım',
      katilimEndeksi: ipoData.katilimEndeksi === true || ipoData.katilimEndeksi === 'true',
      consortium: ipoData.consortium || 'Aracı Kurum',
      currentPrice: parseFloat(ipoData.price) || 20.0,
      ipoPrice: parseFloat(ipoData.price) || 20.0,
      dailyChange: 0.0,
      isFollowed: true,
      myLots: parseInt(ipoData.myLots) || 0,
      myBuyPrice: parseFloat(ipoData.price) || 20.0,
      myNotes: '',
      tavanCount: 0
    };

    this.ipos.unshift(newIpo);
    this.save();
    if (window.app) {
      window.app.showToast(`${newIpo.symbol} halka arzı eklendi`, 'success');
      window.app.closeModal('newIpoModal');
    }
  }

  addStockToWatchlist(symbol, name, price) {
    if (window.financeManager) {
      window.financeManager.addStock(symbol, name, price);
      if (window.app) window.app.showToast(`${symbol} borsa takip listenize eklendi`, 'success');
    }
  }

  calculateLots(totalLots, price, participants) {
    const p = Math.max(1, parseInt(participants) || 2000000);
    const lotsPerPerson = Math.max(1, Math.floor(totalLots / p));
    const totalCost = (lotsPerPerson * price).toFixed(2);
    return { lots: lotsPerPerson, cost: totalCost };
  }

  openCalculator(ipoId) {
    const ipo = this.ipos.find(i => i.id === ipoId);
    if (!ipo) return;

    const modal = document.getElementById('ipoCalculatorModal');
    if (!modal) return;

    modal.dataset.ipoId = ipo.id;
    const titleEl = document.getElementById('ipoCalcTitle');
    const priceEl = document.getElementById('ipoCalcPrice');
    const totalLotsEl = document.getElementById('ipoCalcTotalLots');

    if (titleEl) titleEl.textContent = `${ipo.symbol} - ${ipo.name}`;
    if (priceEl) priceEl.textContent = `${ipo.price.toFixed(2)} ₺`;
    if (totalLotsEl) totalLotsEl.textContent = `${ipo.totalLots.toLocaleString('tr-TR')} Lot`;

    const slider = document.getElementById('ipoCalcSlider');
    const val = slider ? parseInt(slider.value) : 2000000;
    this.updateCalculatorResult(ipo, val);
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.app) window.app.openModal('ipoCalculatorModal');
  }

  updateCalculatorResult(ipo, participants) {
    const res = this.calculateLots(ipo.totalLots, ipo.price, participants);
    const lotsEl = document.getElementById('ipoCalcResultLots');
    const costEl = document.getElementById('ipoCalcResultCost');
    const partEl = document.getElementById('ipoCalcPartLabel');

    if (lotsEl) lotsEl.textContent = `${res.lots} Lot`;
    if (costEl) costEl.textContent = `${Number(res.cost).toLocaleString('tr-TR')} ₺`;
    if (partEl) partEl.textContent = `${(participants / 1000000).toFixed(1)} Milyon Kişi Katılırsa`;
  }

  setFilter(filter) {
    this.activeFilter = filter;
    this.render();
  }

  render() {
    this.renderIpoList('ipoListContainer');
    this.renderIpoList('mainIpoContainer');
    this.renderIpoSummaryWidget('ipoWidgetContainer');
  }

  renderIpoList(containerId = 'ipoListContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const summary = this.getPortfolioSummary();
    const isProfit = summary.netProfit >= 0;
    const isDayProfit = summary.dailyProfit >= 0;

    const portfolioCount = this.ipos.filter(i => (i.myLots || 0) > 0).length;
    const followedCount = this.ipos.filter(i => i.isFollowed).length;
    const openCount = this.ipos.filter(i => i.status === 'upcoming').length;
    const archiveCount = this.ipos.filter(i => i.status === 'trading' && !i.isFollowed && (i.myLots || 0) === 0).length;

    let filtered = [];
    if (this.activeFilter === 'open') {
      filtered = this.ipos.filter(i => i.status === 'upcoming');
    } else if (this.activeFilter === 'my_portfolio') {
      filtered = this.ipos.filter(i => (i.myLots || 0) > 0);
    } else if (this.activeFilter === 'followed') {
      filtered = this.ipos.filter(i => i.isFollowed);
    } else if (this.activeFilter === 'archive') {
      filtered = this.ipos.filter(i => i.status === 'trading' && !i.isFollowed && (i.myLots || 0) === 0);
    } else {
      filtered = this.ipos;
    }

    const statusBadge = (ipo) => {
      if (ipo.status === 'upcoming') {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-semibold">🟡 SPK Taslak</span>`;
      } else {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-semibold">🚀 Borsada İşlemde</span>`;
      }
    };

    container.innerHTML = `
      <div class="space-y-5">
        
        <!-- ÜST PORTFÖY KPI GÖSTERGELERİ -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div class="bg-slate-800/50 rounded-xl p-4">
            <div class="flex items-center justify-between text-slate-400 text-xs">
              <span>Toplam Yatırım</span>
              <i data-lucide="wallet" class="w-4 h-4 text-amber-400"></i>
            </div>
            <div class="mt-2 font-mono font-bold text-lg text-white">
              ${summary.totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <p class="text-[10px] text-slate-500 mt-0.5">${summary.activeHoldings} Şirkette Pozisyon</p>
          </div>

          <div class="bg-slate-800/50 rounded-xl p-4">
            <div class="flex items-center justify-between text-slate-400 text-xs">
              <span>Portföy Değeri</span>
              <i data-lucide="pie-chart" class="w-4 h-4 text-sky-400"></i>
            </div>
            <div class="mt-2 font-mono font-bold text-lg text-white">
              ${summary.currentValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <p class="text-[10px] text-slate-500 mt-0.5">Canlı Borsa Değeri</p>
          </div>

          <div class="bg-slate-800/60 rounded-xl p-4 ${isProfit ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-rose-500/25 bg-rose-500/5'}">
            <div class="flex items-center justify-between ${isProfit ? 'text-emerald-300' : 'text-rose-300'} text-xs">
              <span>Toplam Net Kâr</span>
              <i data-lucide="${isProfit ? 'trending-up' : 'trending-down'}" class="w-4 h-4"></i>
            </div>
            <div class="mt-2 font-mono font-bold text-lg ${isProfit ? 'text-emerald-400' : 'text-rose-400'}">
              ${isProfit ? '+' : ''}${summary.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <p class="text-[10px] font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'} mt-0.5">
              ${isProfit ? '+' : ''}${summary.netProfitPct.toFixed(2)}% Toplam
            </p>
          </div>

          <div class="bg-slate-800/50 rounded-xl p-4">
            <div class="flex items-center justify-between text-slate-400 text-xs">
              <span>Bugünkü Kazanç</span>
              <i data-lucide="activity" class="w-4 h-4 ${isDayProfit ? 'text-emerald-400' : 'text-rose-400'}"></i>
            </div>
            <div class="mt-2 font-mono font-bold text-lg ${isDayProfit ? 'text-emerald-400' : 'text-rose-400'}">
              ${isDayProfit ? '+' : ''}${summary.dailyProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <p class="text-[10px] font-mono font-bold ${isDayProfit ? 'text-emerald-400' : 'text-rose-400'} mt-0.5">
              ${isDayProfit ? '+' : ''}${summary.dailyProfitPct.toFixed(2)}% Günlük
            </p>
          </div>

        </div>

        <!-- FİLTRE BUTONLARI & ARAÇLAR (SÜRÜKLENEBİLİR / YER DEĞİŞTİRİLEBİLİR) -->
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
          
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1" id="ipoFilterButtonsRow">
            ${(() => {
              const filterDefs = {
                open: {
                  key: 'open',
                  label: `2026 Taslak & Yaklaşan (${openCount})`,
                  icon: 'calendar',
                  activeClass: 'bg-amber-500 text-slate-950 font-bold shadow'
                },
                my_portfolio: {
                  key: 'my_portfolio',
                  label: `Portföyüm (${portfolioCount})`,
                  icon: 'briefcase',
                  activeClass: 'bg-amber-500 text-slate-950 font-bold shadow'
                },
                followed: {
                  key: 'followed',
                  label: `Takipte (${followedCount})`,
                  icon: 'star',
                  activeClass: 'bg-amber-500 text-slate-950 font-bold shadow',
                  starFill: followedCount > 0
                },
                archive: {
                  key: 'archive',
                  label: `Geçmiş (${archiveCount})`,
                  icon: 'archive',
                  activeClass: 'bg-slate-700 text-white font-bold'
                },
                all: {
                  key: 'all',
                  label: `Tümü (${this.ipos.length})`,
                  icon: 'list',
                  activeClass: 'bg-slate-700 text-white font-bold'
                }
              };

              return this.filterOrder.map(key => {
                const def = filterDefs[key];
                if (!def) return '';
                const isActive = this.activeFilter === key;

                return `
                  <button 
                    draggable="true"
                    ondragstart="window.ipoManager.handleDragStart(event, '${key}')"
                    ondragover="window.ipoManager.handleDragOver(event)"
                    ondragenter="window.ipoManager.handleDragEnter(event)"
                    ondragleave="window.ipoManager.handleDragLeave(event)"
                    ondrop="window.ipoManager.handleDrop(event, '${key}')"
                    onclick="window.ipoManager.setFilter('${key}')" 
                    class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 select-none ${isActive ? (def.activeClass || 'bg-amber-500 text-slate-950 font-bold shadow') : 'bg-slate-800/80 text-slate-300 hover:text-white'}"
                    title="Tıklayarak filtreleyin veya basılı tutup sürükleyin"
                  >
                    <i data-lucide="${def.icon}" class="w-3.5 h-3.5 pointer-events-none ${def.starFill && isActive ? 'fill-slate-950 text-slate-950' : (def.starFill ? 'fill-amber-400 text-amber-400' : '')}"></i>
                    <span class="pointer-events-none">${def.label}</span>
                  </button>
                `;
              }).join('');
            })()}
          </div>

          <div class="flex items-center gap-2">
            
            <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button 
                onclick="window.ipoManager.setViewMode('grid')" 
                title="Kart Görünümü" 
                class="p-1.5 rounded-lg transition-all cursor-pointer ${this.viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}"
              >
                <i data-lucide="layout-grid" class="w-4 h-4"></i>
              </button>
              <button 
                onclick="window.ipoManager.setViewMode('table')" 
                title="Borsa Tablosu Görünümü" 
                class="p-1.5 rounded-lg transition-all cursor-pointer ${this.viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}"
              >
                <i data-lucide="list" class="w-4 h-4"></i>
              </button>
            </div>

            <button onclick="window.ipoManager.resetToDefaults()" title="2026 Listesine Sıfırla" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            </button>

            ${this.activeFilter === 'archive' && filtered.length > 0 ? `
              <button onclick="window.ipoManager.clearArchive()" class="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                <span>Geçmişi Temizle</span>
              </button>
            ` : ''}

            <button onclick="window.app.openModal('newIpoModal')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Halka Arz Ekle</span>
            </button>
          </div>
        </div>

        <!-- GÖRÜNÜM 1: SADE & TEMİZ GRID KARTLAR -->
        ${this.viewMode === 'grid' ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filtered.map(ipo => {
              const isTrading = ipo.status === 'trading';
              const myLots = ipo.myLots || 0;
              const hasHolding = myLots > 0;
              const buyPrice = ipo.myBuyPrice || ipo.price;
              const totalCost = myLots * buyPrice;
              const currentValue = myLots * ipo.currentPrice;
              const profit = currentValue - totalCost;
              const profitPct = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;
              const isItemProfit = profit >= 0;
              const returnPct = ipo.returnPct !== undefined ? ipo.returnPct : (((ipo.currentPrice - ipo.ipoPrice) / ipo.ipoPrice) * 100).toFixed(1);

              return `
                <div class="bg-slate-800/60 rounded-xl p-4 ${hasHolding ? 'border-amber-500/40 bg-slate-900/80' : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/50'} transition-all flex flex-col justify-between space-y-3.5 group">
                  
                  <!-- Üst Bar: Sembol, Pazar, Durum & Yıldız -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                          ${ipo.symbol}
                        </span>
                        <span class="text-[11px] text-slate-400 font-medium">${ipo.market}</span>
                      </div>

                      <div class="flex items-center gap-1.5">
                        ${statusBadge(ipo)}
                        <button 
                          onclick="window.ipoManager.toggleFollow('${ipo.id}')" 
                          title="${ipo.isFollowed ? 'Takibi Kaldır' : 'Takip Listeme Ekle'}"
                          class="p-1 rounded-lg transition-all cursor-pointer ${ipo.isFollowed ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}"
                        >
                          <i data-lucide="star" class="w-4 h-4 ${ipo.isFollowed ? 'fill-amber-400' : ''}"></i>
                        </button>
                        ${isTrading && !ipo.isFollowed && myLots === 0 ? `
                          <button 
                            onclick="window.ipoManager.deleteIpo('${ipo.id}')" 
                            title="Listeden sil"
                            class="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                          >
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Şirket Adı & Tarih -->
                    <div>
                      <h4 class="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">${escapeHtml(ipo.name)}</h4>
                      <p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-400/80"></i>
                        <span class="font-medium text-slate-300">${ipo.dates}</span>
                      </p>
                    </div>
                  </div>

                  <!-- KİŞİSEL PORTFÖY VARSA SADE ÖZET -->
                  ${hasHolding ? `
                    <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-slate-300 font-semibold flex items-center gap-1">
                          <i data-lucide="briefcase" class="w-3.5 h-3.5 text-amber-400"></i>
                          <span>Portföyüm: <strong class="font-mono text-white">${myLots} Lot</strong></span>
                        </span>
                        <span class="font-mono font-bold ${isItemProfit ? 'text-emerald-400' : 'text-rose-400'}">
                          ${isItemProfit ? '+' : ''}${profit.toFixed(2)} ₺ (${isItemProfit ? '+' : ''}${profitPct}%)
                        </span>
                      </div>
                      <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <span>Maliyet: <strong class="font-mono text-slate-300">${totalCost.toFixed(2)} ₺</strong></span>
                        <span>Değer: <strong class="font-mono text-slate-200">${currentValue.toFixed(2)} ₺</strong></span>
                      </div>
                    </div>
                  ` : `
                    <!-- 2x2 SADE METRİK TABLOSU -->
                    <div class="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs">
                      <div>
                        <span class="text-[10px] text-slate-400 block">${isTrading ? 'Arz Fiyatı' : 'Tahmini Fiyat'}</span>
                        <span class="font-mono font-bold text-white">${ipo.price.toFixed(2)} ₺</span>
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-400 block">${isTrading ? 'Canlı Fiyat' : 'Toplam Dağıtım'}</span>
                        ${isTrading ? `
                          <div class="font-mono font-bold text-white">
                            <span>${ipo.currentPrice.toFixed(2)} ₺</span>
                            <span class="text-[10px] ${returnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}">(${returnPct >= 0 ? '+' : ''}${returnPct}%)</span>
                          </div>
                        ` : `
                          <span class="font-mono font-bold text-slate-200">${(ipo.totalLots / 1000000).toFixed(1)}M Lot</span>
                        `}
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-400 block">Dağıtım Şekli</span>
                        <span class="text-[11px] text-slate-300">${ipo.distribution}</span>
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-400 block">Katılım Endeksi</span>
                        <span class="text-[11px] font-semibold ${ipo.katilimEndeksi ? 'text-emerald-400' : 'text-slate-400'}">
                          ${ipo.katilimEndeksi ? '✔ Uygun' : 'Uygun Değil'}
                        </span>
                      </div>
                    </div>
                  `}

                  <!-- EYLEMLER: SADE BUTONLAR -->
                  <div class="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <button 
                      onclick="window.ipoManager.openPortfolioModal('${ipo.id}')" 
                      class="flex-1 py-1.5 px-2.5 rounded-xl ${hasHolding ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'} text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <i data-lucide="briefcase" class="w-3.5 h-3.5 text-amber-400"></i>
                      <span>${hasHolding ? `Lot: ${myLots} (Düzenle)` : 'Lot Gir'}</span>
                    </button>

                    <button 
                      onclick="window.ipoManager.openCalculator('${ipo.id}')" 
                      title="Kaç Lot Düşer? Simülatörü"
                      class="py-1.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-slate-700/60"
                    >
                      <i data-lucide="calculator" class="w-3.5 h-3.5 text-amber-400"></i>
                      <span>Hesapla</span>
                    </button>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- GÖRÜNÜM 2: KOMPAKT BORSA TABLOSU -->
          <div class=" rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-300">
                <thead class="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th class="p-3">Hisse / Şirket</th>
                    <th class="p-3">Tarih</th>
                    <th class="p-3">Durum</th>
                    <th class="p-3 text-right">Fiyat</th>
                    <th class="p-3 text-center">Lotum</th>
                    <th class="p-3 text-right">Maliyet</th>
                    <th class="p-3 text-right">Değer</th>
                    <th class="p-3 text-right">Kâr / Zarar</th>
                    <th class="p-3 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  ${filtered.map(ipo => {
                    const myLots = ipo.myLots || 0;
                    const buyPrice = ipo.myBuyPrice || ipo.price;
                    const totalCost = myLots * buyPrice;
                    const currentValue = myLots * ipo.currentPrice;
                    const profit = currentValue - totalCost;
                    const profitPct = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;
                    const isItemProfit = profit >= 0;

                    return `
                      <tr class="hover:bg-slate-900/50 transition-colors ${myLots > 0 ? 'bg-amber-500/5' : ''}">
                        <td class="p-3">
                          <div class="flex items-center space-x-2">
                            <span class="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs">${ipo.symbol}</span>
                            <span class="font-semibold text-white truncate max-w-xs block">${escapeHtml(ipo.name)}</span>
                          </div>
                        </td>
                        <td class="p-3 text-slate-400 text-[11px] whitespace-nowrap">${ipo.dates}</td>
                        <td class="p-3">${statusBadge(ipo)}</td>
                        <td class="p-3 text-right font-mono font-bold text-slate-200">${ipo.currentPrice.toFixed(2)} ₺</td>
                        <td class="p-3 text-center">
                          <button onclick="window.ipoManager.openPortfolioModal('${ipo.id}')" class="px-2 py-0.5 rounded ${myLots > 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'} text-xs font-mono cursor-pointer">
                            ${myLots > 0 ? `${myLots} Lot` : '+ Lot Gir'}
                          </button>
                        </td>
                        <td class="p-3 text-right font-mono text-slate-400">${myLots > 0 ? `${totalCost.toFixed(2)} ₺` : '-'}</td>
                        <td class="p-3 text-right font-mono font-bold text-white">${myLots > 0 ? `${currentValue.toFixed(2)} ₺` : '-'}</td>
                        <td class="p-3 text-right font-mono font-bold">
                          ${myLots > 0 ? `
                            <span class="${isItemProfit ? 'text-emerald-400' : 'text-rose-400'}">
                              ${isItemProfit ? '+' : ''}${profit.toFixed(2)} ₺ (${isItemProfit ? '+' : ''}${profitPct}%)
                            </span>
                          ` : '-'}
                        </td>
                        <td class="p-3 text-center">
                          <div class="flex items-center justify-center gap-1">
                            <button onclick="window.ipoManager.openCalculator('${ipo.id}')" title="Hesapla" class="p-1 rounded bg-slate-800 text-amber-400 hover:text-amber-300 cursor-pointer">
                              <i data-lucide="calculator" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="window.ipoManager.toggleFollow('${ipo.id}')" class="p-1 text-slate-400 hover:text-amber-400 cursor-pointer">
                              <i data-lucide="star" class="w-3.5 h-3.5 ${ipo.isFollowed ? 'fill-amber-400 text-amber-400' : ''}"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `}

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  renderIpoSummaryWidget(containerId = 'ipoWidgetContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const summary = this.getPortfolioSummary();
    const portfolioItems = this.ipos.filter(i => (i.myLots || 0) > 0);
    const activeOpen = this.ipos.filter(i => i.status === 'upcoming');
    const isProfit = summary.netProfit >= 0;

    container.innerHTML = `
      <div class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg relative group">
        <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Basılı tutup sürükleyerek yerini değiştirin">
              <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
            </div>
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <i data-lucide="briefcase" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-bold text-sm text-white">Halka Arz Portföyüm</h3>
              <p class="text-[10px] text-slate-400">${portfolioItems.length} Aktif Pozisyon • ${activeOpen.length} Yaklaşan</p>
            </div>
          </div>
          
          <div class="flex items-center gap-1.5">
            <button onclick="window.app.switchTab('ipo')" class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
              <span>Yönet</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        
        <div class="p-5 space-y-4 widget-collapsible-content">

        ${summary.totalCost > 0 ? `
          <div class="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 block">Portföy Değeri</span>
              <span class="font-bold font-mono text-white">${summary.currentValue.toFixed(2)} ₺</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 block">Net Kâr / Zarar</span>
              <span class="font-bold font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}">
                ${isProfit ? '+' : ''}${summary.netProfit.toFixed(2)} ₺
              </span>
            </div>
          </div>
        ` : `
          <div class="p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Henüz lot girişi yapmadınız</span>
            <button onclick="window.app.switchTab('ipo')" class="text-amber-400 font-bold underline cursor-pointer">Lot Ekle</button>
          </div>
        `}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
}

window.ipoManager = new IpoManager();
