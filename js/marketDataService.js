/**
 * MarketDataService — Canlı Piyasa Veri Katmanı
 * 
 * Yahoo Finance v8 API üzerinden BIST hisse, döviz, altın ve endeks verilerini çeker.
 * CORS proxy kaskad sistemi, önbellek (60s TTL), hata yönetimi ve toplu çekme desteği içerir.
 */

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 60 * 1000;
    this.proxies = [
      (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
      (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    ];
    this.baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
    this.maxConcurrent = 5;
    this.lastWorkingProxyIndex = 0;
  }

  async getQuote(symbol) {
    const cached = this.cache.get(symbol);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) return cached.data;

    const targetUrl = `${this.baseUrl}/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    let lastError = null;
    const proxyOrder = this._getProxyOrder();

    for (let i = 0; i < proxyOrder.length; i++) {
      const proxyFn = proxyOrder[i];
      try {
        const proxyUrl = proxyFn(targetUrl);
        const response = await fetch(proxyUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const rawData = await response.json();
        const result = rawData?.chart?.result?.[0];
        if (!result || !result.meta) throw new Error('Invalid Yahoo Finance response');

        const formatted = this._formatQuote(result);
        this.cache.set(symbol, { timestamp: Date.now(), data: formatted });
        this.lastWorkingProxyIndex = this.proxies.indexOf(proxyFn);
        return formatted;
      } catch (err) {
        lastError = err;
        console.warn(`[MarketData] Proxy ${i} failed (${symbol}):`, err.message);
      }
    }
    console.error(`[MarketData] Failed to fetch ${symbol}:`, lastError?.message);
    throw new Error(`${symbol} verisi alınamadı: ${lastError?.message}`);
  }

  async getBatchQuotes(symbols) {
    const results = [];
    const chunks = this._chunkArray(symbols, this.maxConcurrent);
    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(chunk.map(symbol => this.getQuote(symbol)));
      chunkResults.forEach((result, i) => {
        results.push({
          symbol: chunk[i],
          success: result.status === 'fulfilled',
          data: result.status === 'fulfilled' ? result.value : null,
          error: result.status === 'rejected' ? result.reason?.message : null
        });
      });
    }
    return results;
  }

  async getForexRate(base, quote = 'TRY') {
    return this.getQuote(`${base}${quote}=X`);
  }

  async getGramGoldTRY() {
    const OUNCE_TO_GRAM = 31.1034768;
    try {
      const ounceTRY = await this.getQuote('XAUTRY=X');
      const gramPrice = ounceTRY.price / OUNCE_TO_GRAM;
      const prevGram = ounceTRY.previousClose / OUNCE_TO_GRAM;
      const change = gramPrice - prevGram;
      const changePercent = prevGram ? ((change / prevGram) * 100) : 0;

      return {
        symbol: 'GRAM_ALTIN',
        name: 'Gram Altın (24K)',
        currency: 'TRY',
        price: Number(gramPrice.toFixed(2)),
        previousClose: Number(prevGram.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        time: ounceTRY.time,
        source: 'XAUTRY'
      };
    } catch (primaryErr) {
      console.warn('[MarketData] XAUTRY failed, falling back:', primaryErr.message);
      const [goldUSD, usdTRY] = await Promise.all([this.getQuote('GC=F'), this.getQuote('USDTRY=X')]);
      const gramPrice = (goldUSD.price * usdTRY.price) / OUNCE_TO_GRAM;
      return {
        symbol: 'GRAM_ALTIN',
        name: 'Gram Altın (24K)',
        currency: 'TRY',
        price: Number(gramPrice.toFixed(2)),
        change: 0, changePercent: 0, time: goldUSD.time, source: 'GC=F×USDTRY'
      };
    }
  }

  async getSparklineData(symbol) {
    const cacheKey = `sparkline_${symbol}`;
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < (5 * 60 * 1000)) return cached.data;

    const targetUrl = `${this.baseUrl}/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    for (const proxyFn of this._getProxyOrder()) {
      try {
        const proxyUrl = proxyFn(targetUrl);
        const response = await fetch(proxyUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawData = await response.json();
        const closes = rawData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
        const validCloses = closes.filter(c => c !== null && c !== undefined);
        this.cache.set(cacheKey, { timestamp: Date.now(), data: validCloses });
        return validCloses;
      } catch (err) { continue; }
    }
    return [];
  }

  searchBIST(query) {
    if (!query || query.length < 1) return [];
    const q = query.toUpperCase().trim();
    const db = window.BIST_STOCK_DATABASE || [];
    return db.filter(stock => 
      stock.symbol.toUpperCase().includes(q) || 
      stock.name.toUpperCase().includes(q) || 
      (stock.sector && stock.sector.toUpperCase().includes(q))
    ).slice(0, 15);
  }

  isMarketOpen() {
    const now = new Date();
    const istanbulMinutes = (now.getUTCHours() * 60 + now.getUTCMinutes()) + (3 * 60);
    const day = now.getUTCDay();
    return (day >= 1 && day <= 5) && (istanbulMinutes >= 600 && istanbulMinutes <= 1080);
  }

  clearCache() { this.cache.clear(); }

  _formatQuote(result) {
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose ? ((change / prevClose) * 100) : 0;
    
    return {
      symbol: meta.symbol,
      currency: meta.currency || 'TRY',
      exchangeName: meta.exchangeName || '',
      price: Number(price),
      previousClose: Number(prevClose),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      dayHigh: meta.regularMarketDayHigh || null,
      dayLow: meta.regularMarketDayLow || null,
      volume: meta.regularMarketVolume || 0,
      time: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toLocaleString('tr-TR') : new Date().toLocaleString('tr-TR'),
      marketOpen: this.isMarketOpen()
    };
  }

  _getProxyOrder() {
    const ordered = [...this.proxies];
    if (this.lastWorkingProxyIndex > 0 && this.lastWorkingProxyIndex < ordered.length) {
      const preferred = ordered.splice(this.lastWorkingProxyIndex, 1)[0];
      ordered.unshift(preferred);
    }
    return ordered;
  }

  _chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
  }
}

window.marketData = new MarketDataService();
console.log('[MarketData] ✅ MarketDataService ready.');
