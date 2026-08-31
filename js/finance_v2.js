/**
 * FinanceManager_v2 — Sıfırdan Yazılmış Borsa & Piyasa Yönetimi
 */

class FinanceManager_v2 {
  constructor() {
    // Portföy ve Takip Listesi verileri (localStorage'dan alınır)
    this.portfolio = JSON.parse(localStorage.getItem('finance_portfolio_v2')) || [];
    this.watchlist = JSON.parse(localStorage.getItem('finance_watchlist_v2')) || [];
    
    this.currentSubTab = 'portfolio'; // portfolio, watchlist, forex, ipo
    this.refreshInterval = null;
    
    // UI Element Referansları
    this.els = {
      totalPortfolioValue: document.getElementById('totalPortfolioValue'),
      totalPnLValue: document.getElementById('totalPnLValue'),
      totalPnLPercent: document.getElementById('totalPnLPercent'),
      dailyPnLValue: document.getElementById('dailyPnLValue'),
      dailyPnLPercent: document.getElementById('dailyPnLPercent'),
      tickerTape: document.getElementById('tickerTapeContainer'),
      portfolioList: document.getElementById('portfolioListContainer'),
      watchlistList: document.getElementById('watchlistContainer'),
      forexList: document.getElementById('forexListContainer'),
      
      searchModal: document.getElementById('financeSearchModal'),
      searchInput: document.getElementById('financeSearchInput'),
      searchResults: document.getElementById('financeSearchResults'),
      
      addModal: document.getElementById('financeAddModal'),
      addSymbol: document.getElementById('financeAddSymbol'),
      addAmount: document.getElementById('financeAddAmount'),
      addPrice: document.getElementById('financeAddPrice')
    };

    // Olay Dinleyicileri Kur
    this.setupListeners();
    
    // İlk render
    this.init();
  }

  // ==========================================
  // BAŞLATMA & DÖNGÜ
  // ==========================================
  async init() {
    this.switchSubTab(this.currentSubTab);
    await this.refreshAllData();
    
    // 5 dakikada bir otomatik yenile (Piyasa açıksa)
    this.refreshInterval = setInterval(() => {
      if (window.marketData && window.marketData.isMarketOpen()) {
        this.refreshAllData();
      }
    }, 5 * 60 * 1000);
  }

  async refreshAllData() {
    // 1. Üst bant (Ticker Tape) - Örnek sabit semboller
    this.renderTickerTape();

    // 2. Aktif sekmeye göre veri yenileme
    if (this.currentSubTab === 'portfolio') {
      await this.renderPortfolio();
    } else if (this.currentSubTab === 'watchlist') {
      await this.renderWatchlist();
    } else if (this.currentSubTab === 'forex') {
      await this.renderForex();
    }
  }

  // ==========================================
  // UI YÖNETİMİ
  // ==========================================
  switchSubTab(tabId) {
    this.currentSubTab = tabId;
    
    // Butonları güncelle
    document.querySelectorAll('.fin-subtab-btn').forEach(btn => {
      btn.classList.remove('active', 'text-slate-300', 'border-blue-500');
      btn.classList.add('text-slate-400', 'border-transparent');
    });
    
    const activeBtn = document.getElementById(`subtab-btn-${tabId}`);
    if(activeBtn) {
      activeBtn.classList.add('active', 'text-slate-300', 'border-blue-500');
      activeBtn.classList.remove('text-slate-400', 'border-transparent');
    }

    // Panelleri güncelle
    document.querySelectorAll('.fin-subtab-pane').forEach(pane => {
      pane.classList.add('hidden');
      pane.classList.remove('block');
    });
    
    const activePane = document.getElementById(`fin-subtab-${tabId}`);
    if(activePane) {
      activePane.classList.remove('hidden');
      activePane.classList.add('block');
    }

    // Seçilen sekmeyi hemen render et
    if(tabId !== 'ipo') {
      this.refreshAllData();
    }
  }

  togglePrivacy() {
    const valEl = this.els.totalPortfolioValue;
    if (valEl.classList.contains('blur-sm')) {
      valEl.classList.remove('blur-sm');
    } else {
      valEl.classList.add('blur-sm');
    }
  }

  // ==========================================
  // TICKER TAPE (PİYASA BANDI)
  // ==========================================
  async renderTickerTape() {
    if(!window.marketData) return;
    
    const symbols = ['XU100.IS', 'USDTRY=X', 'EURTRY=X'];
    let html = '';
    
    try {
      const results = await window.marketData.getBatchQuotes(symbols);
      const gold = await window.marketData.getGramGoldTRY();
      
      // Hisseler & Döviz
      results.forEach(res => {
        if(res.success && res.data) {
          const d = res.data;
          const isUp = d.change >= 0;
          const colorClass = isUp ? 'text-emerald-400' : 'text-rose-400';
          const icon = isUp ? '▲' : '▼';
          const name = d.symbol.replace('.IS', '').replace('=X', '');
          html += `
            <div class="flex items-center gap-2 text-sm font-medium whitespace-nowrap px-4 border-r border-slate-700/50 last:border-0">
              <span class="text-slate-300">${name}</span>
              <span class="text-slate-100 font-mono">${d.price.toFixed(2)}</span>
              <span class="${colorClass}">${icon} ${Math.abs(d.changePercent).toFixed(2)}%</span>
            </div>
          `;
        }
      });

      // Altın Ekle
      if(gold) {
        const isUp = gold.change >= 0;
        const colorClass = isUp ? 'text-emerald-400' : 'text-rose-400';
        const icon = isUp ? '▲' : '▼';
        html += `
            <div class="flex items-center gap-2 text-sm font-medium whitespace-nowrap px-4">
              <span class="text-slate-300">Gram Altın</span>
              <span class="text-slate-100 font-mono">${gold.price.toFixed(2)}</span>
              <span class="${colorClass}">${icon} ${Math.abs(gold.changePercent).toFixed(2)}%</span>
            </div>
          `;
      }
      
      if(this.els.tickerTape) this.els.tickerTape.innerHTML = html;
      
    } catch(e) {
      console.warn("Ticker tape yüklenemedi", e);
    }
  }

  // ==========================================
  // PORTFÖY RENDER
  // ==========================================
  async renderPortfolio() {
    if (!this.els.portfolioList) return;
    if (this.portfolio.length === 0) {
      this.els.portfolioList.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Portföyünüzde henüz hisse yok. Aramadan hisse ekleyebilirsiniz.</div>`;
      this.updateKPIs(0, 0, 0, 0, 0);
      return;
    }

    this.els.portfolioList.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Güncel veriler yükleniyor...</div>`;

    const symbols = this.portfolio.map(p => p.symbol);
    const results = await window.marketData.getBatchQuotes(symbols);
    
    let totalValue = 0;
    let totalCost = 0;
    let totalDailyPnL = 0;
    let html = '';

    for (const item of this.portfolio) {
      const quoteRes = results.find(r => r.symbol === item.symbol);
      let price = item.price || 0;
      let changePercent = 0;
      let dailyChangeVal = 0;
      let isUp = true;
      let time = '';

      if (quoteRes && quoteRes.success) {
        price = quoteRes.data.price;
        changePercent = quoteRes.data.changePercent;
        dailyChangeVal = quoteRes.data.change;
        isUp = quoteRes.data.change >= 0;
        time = quoteRes.data.time;
      }

      const currentTotal = price * item.amount;
      const costTotal = item.avgPrice * item.amount;
      const pnlTotal = currentTotal - costTotal;
      const pnlPercent = costTotal > 0 ? (pnlTotal / costTotal) * 100 : 0;
      const dailyPnL = dailyChangeVal * item.amount;

      totalValue += currentTotal;
      totalCost += costTotal;
      totalDailyPnL += dailyPnL;

      const pnlColor = pnlTotal >= 0 ? 'text-emerald-400' : 'text-rose-400';
      const dailyColor = isUp ? 'text-emerald-400' : 'text-rose-400';
      
      const cleanSymbol = item.symbol.replace('.IS', '');

      html += `
        <div class="glass-card rounded-2xl p-4 border relative overflow-hidden group">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
                ${cleanSymbol}
                <button onclick="window.financeManagerV2.removeHolding('${item.symbol}')" class="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Portföyden Sil">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </h3>
              <p class="text-xs text-slate-400">${item.amount} Lot | Maliyet: ${item.avgPrice} ₺</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-mono font-bold text-slate-100">${price.toFixed(2)} ₺</p>
              <p class="text-xs font-mono font-medium ${dailyColor}">${isUp ? '+' : ''}${changePercent.toFixed(2)}%</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
            <div>
              <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Kar/Zarar</p>
              <p class="text-sm font-mono font-bold ${pnlColor}">${pnlTotal >= 0 ? '+' : ''}${pnlTotal.toFixed(2)} ₺</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Toplam Değer</p>
              <p class="text-sm font-mono font-bold text-slate-200">${currentTotal.toFixed(2)} ₺</p>
            </div>
          </div>
        </div>
      `;
    }

    this.els.portfolioList.innerHTML = html;
    
    const overallPnL = totalValue - totalCost;
    const overallPnLPercent = totalCost > 0 ? (overallPnL / totalCost) * 100 : 0;
    const dailyPnLPercent = (totalValue - totalDailyPnL) > 0 ? (totalDailyPnL / (totalValue - totalDailyPnL)) * 100 : 0;

    this.updateKPIs(totalValue, overallPnL, overallPnLPercent, totalDailyPnL, dailyPnLPercent);
    if(window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // TAKİP LİSTESİ RENDER
  // ==========================================
  async renderWatchlist() {
    if (!this.els.watchlistList) return;
    if (this.watchlist.length === 0) {
      this.els.watchlistList.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Takip listeniz boş. Aramadan ekleyebilirsiniz.</div>`;
      return;
    }

    this.els.watchlistList.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Güncel veriler yükleniyor...</div>`;

    const results = await window.marketData.getBatchQuotes(this.watchlist);
    let html = '';

    for (const symbol of this.watchlist) {
      const quoteRes = results.find(r => r.symbol === symbol);
      if(quoteRes && quoteRes.success) {
        const d = quoteRes.data;
        const isUp = d.change >= 0;
        const color = isUp ? 'text-emerald-400' : 'text-rose-400';
        const cleanSymbol = d.symbol.replace('.IS', '');
        
        html += `
          <div class="glass-card rounded-2xl p-4 border flex justify-between items-center group">
            <div>
              <h3 class="text-base font-bold text-slate-100">${cleanSymbol}</h3>
              <p class="text-xs text-slate-400">${d.exchangeName}</p>
            </div>
            <div class="text-right">
              <p class="text-base font-mono font-bold text-slate-100">${d.price.toFixed(2)} ₺</p>
              <p class="text-xs font-mono font-medium ${color}">${isUp ? '+' : ''}${d.changePercent.toFixed(2)}%</p>
            </div>
            <button onclick="window.financeManagerV2.removeFromWatchlist('${symbol}')" class="absolute -top-2 -right-2 bg-rose-500/20 text-rose-400 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <i data-lucide="x" class="w-3 h-3"></i>
            </button>
          </div>
        `;
      }
    }
    
    this.els.watchlistList.innerHTML = html;
    if(window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // DÖVİZ VE ALTIN RENDER
  // ==========================================
  async renderForex() {
    if (!this.els.forexList) return;
    this.els.forexList.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Kurlar yükleniyor...</div>`;
    
    try {
      const [usd, eur, gbp, goldPrices] = await Promise.all([
        window.marketData.getForexRate('USD'),
        window.marketData.getForexRate('EUR'),
        window.marketData.getForexRate('GBP'),
        window.marketData.getGoldPrices()
      ]);

      const items = [usd, eur, gbp, goldPrices.gram, goldPrices.ceyrek, goldPrices.yarim, goldPrices.tam, goldPrices.cumhuriyet];
      let html = '';

      items.forEach(d => {
        if(!d) return;
        const isUp = d.change >= 0;
        const color = isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10';
        const name = d.name || d.symbol.replace('=X', '');
        
        html += `
          <div class="glass-card rounded-2xl p-4 border flex flex-col justify-center items-center text-center">
            <p class="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">${name}</p>
            <p class="text-xl font-mono font-bold text-slate-100 mb-1">${d.price.toFixed(2)} ₺</p>
            ${d.changePercent !== undefined ? `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium ${color}">${isUp ? '+' : ''}${d.changePercent.toFixed(2)}%</span>` : ''}
          </div>
        `;
      });
      
      this.els.forexList.innerHTML = html;
    } catch(e) {
      this.els.forexList.innerHTML = `<div class="col-span-full text-center text-rose-400">Kur verileri yüklenemedi.</div>`;
    }
  }

  // ==========================================
  // KPI GÜNCELLEME
  // ==========================================
  updateKPIs(total, pnl, pnlPercent, daily, dailyPercent) {
    if(this.els.totalPortfolioValue) this.els.totalPortfolioValue.innerText = `${total.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ₺`;
    
    if(this.els.totalPnLValue) {
      this.els.totalPnLValue.innerText = `${pnl >= 0 ? '+' : ''}${pnl.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ₺`;
      this.els.totalPnLValue.className = `text-2xl font-bold font-mono ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }
    if(this.els.totalPnLPercent) {
      this.els.totalPnLPercent.innerText = `${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`;
      this.els.totalPnLPercent.className = `text-xs font-medium px-2 py-1 rounded-lg ${pnlPercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`;
    }

    if(this.els.dailyPnLValue) {
      this.els.dailyPnLValue.innerText = `${daily >= 0 ? '+' : ''}${daily.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ₺`;
      this.els.dailyPnLValue.className = `text-2xl font-bold font-mono ${daily >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }
    if(this.els.dailyPnLPercent) {
      this.els.dailyPnLPercent.innerText = `${dailyPercent >= 0 ? '+' : ''}${dailyPercent.toFixed(2)}%`;
      this.els.dailyPnLPercent.className = `text-xs font-medium px-2 py-1 rounded-lg ${dailyPercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`;
    }
  }

  // ==========================================
  // ARAMA VE EKLEME MODAL
  // ==========================================
  setupListeners() {
    if(this.els.searchInput) {
      this.els.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  openSearchModal() {
    this.els.searchModal.classList.remove('hidden');
    this.els.searchInput.value = '';
    this.els.searchResults.innerHTML = '<div class="text-center py-8 text-slate-500 text-sm">Aramak için yazmaya başlayın...</div>';
    setTimeout(() => this.els.searchInput.focus(), 100);
  }

  closeSearchModal() {
    this.els.searchModal.classList.add('hidden');
  }

  handleSearch(query) {
    if(!query || query.length < 2) {
      this.els.searchResults.innerHTML = '<div class="text-center py-8 text-slate-500 text-sm">Aramak için yazmaya başlayın...</div>';
      return;
    }
    
    if(!window.marketData) return;
    
    const results = window.marketData.searchBIST(query);
    if(results.length === 0) {
      this.els.searchResults.innerHTML = '<div class="text-center py-8 text-slate-500 text-sm">Sonuç bulunamadı.</div>';
      return;
    }
    
    let html = '';
    results.forEach(item => {
      const fullSymbol = `${item.symbol}.IS`;
      const inWatchlist = this.watchlist.includes(fullSymbol);
      
      html += `
        <div class="flex items-center justify-between p-3 border-b border-slate-700/50 hover:bg-slate-800/50 rounded-lg transition-colors group">
          <div>
            <h4 class="font-bold text-slate-100 text-sm">${item.symbol}</h4>
            <p class="text-xs text-slate-400">${item.name} | ${item.sector || ''}</p>
          </div>
          <div class="flex gap-2">
             <button onclick="window.financeManagerV2.toggleWatchlist('${fullSymbol}')" class="p-2 rounded-xl border ${inWatchlist ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : 'border-slate-600 text-slate-400 hover:text-white'} transition-colors" title="Takip Listesi">
               <i data-lucide="star" class="w-4 h-4 ${inWatchlist ? 'fill-current' : ''}"></i>
             </button>
             <button onclick="window.financeManagerV2.openAddModal('${fullSymbol}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
               Al / Ekle
             </button>
          </div>
        </div>
      `;
    });
    
    this.els.searchResults.innerHTML = html;
    if(window.lucide) window.lucide.createIcons();
  }

  openAddModal(symbol) {
    this.closeSearchModal();
    this.els.addModal.classList.remove('hidden');
    this.els.addSymbol.value = symbol;
    this.els.addAmount.value = '';
    this.els.addPrice.value = '';
    setTimeout(() => this.els.addAmount.focus(), 100);
  }

  closeAddModal() {
    this.els.addModal.classList.add('hidden');
  }

  saveHolding() {
    const symbol = this.els.addSymbol.value;
    const amount = parseFloat(this.els.addAmount.value);
    const price = parseFloat(this.els.addPrice.value);
    
    if(!symbol || isNaN(amount) || isNaN(price) || amount <= 0 || price < 0) {
      alert("Lütfen geçerli lot ve maliyet fiyatı giriniz.");
      return;
    }
    
    const existing = this.portfolio.find(p => p.symbol === symbol);
    if(existing) {
      // Ortalama maliyet hesapla
      const totalCost = (existing.amount * existing.avgPrice) + (amount * price);
      existing.amount += amount;
      existing.avgPrice = totalCost / existing.amount;
    } else {
      this.portfolio.push({ symbol, amount, avgPrice: price });
    }
    
    this.saveData();
    this.closeAddModal();
    this.switchSubTab('portfolio');
    this.renderPortfolio();
  }

  removeHolding(symbol) {
    if(confirm(`${symbol} hissesini portföyden silmek istediğinize emin misiniz?`)) {
      this.portfolio = this.portfolio.filter(p => p.symbol !== symbol);
      this.saveData();
      this.renderPortfolio();
    }
  }

  toggleWatchlist(symbol) {
    const idx = this.watchlist.indexOf(symbol);
    if(idx > -1) {
      this.watchlist.splice(idx, 1);
    } else {
      this.watchlist.push(symbol);
    }
    this.saveData();
    // Arama sonuçlarını tekrar render et ki yıldız güncellensin
    if(this.els.searchInput.value) {
      this.handleSearch(this.els.searchInput.value);
    }
    if(this.currentSubTab === 'watchlist') {
      this.renderWatchlist();
    }
  }

  removeFromWatchlist(symbol) {
    this.watchlist = this.watchlist.filter(s => s !== symbol);
    this.saveData();
    this.renderWatchlist();
  }

  saveData() {
    localStorage.setItem('finance_portfolio_v2', JSON.stringify(this.portfolio));
    localStorage.setItem('finance_watchlist_v2', JSON.stringify(this.watchlist));
  }
}

// Global instance
window.financeManagerV2 = new FinanceManager_v2();
console.log('[FinanceV2] ✅ Yüklendi ve başlatıldı.');
