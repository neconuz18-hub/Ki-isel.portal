/**
 * City Life, Fuel Prices, Countdowns & Daily Wellness Module (js/cityLife.js)
 * Şehir Araçları, Akaryakıt, Geri Sayım Sayaçları ve Günlük Sağlık/Su Modülü
 */

const STORAGE_KEY_CITYLIFE_COUNTDOWNS = 'assistant_custom_countdowns';
const STORAGE_KEY_WATER_TRACKER = 'assistant_water_intake_today';

const DEFAULT_COUNTDOWNS = [
  { id: 'cd-1', title: '29 Ekim Cumhuriyet Bayramı', targetDate: '2026-10-29', category: 'holiday', icon: 'flag', color: 'rose' },
  { id: 'cd-2', title: 'Yılbaşı (2027)', targetDate: '2027-01-01', category: 'holiday', icon: 'sparkles', color: 'amber' },
  { id: 'cd-3', title: 'Yıllık İzin & Tatil', targetDate: '2026-09-20', category: 'personal', icon: 'sun', color: 'sky' }
];

// İl Bazlı Canlı/Güncel Yakıt Fiyatları (TL)
const FUEL_PRICES = {
  istanbul: { benzin: 44.15, motorin: 43.85, lpg: 22.95, city: 'İstanbul' },
  ankara: { benzin: 44.80, motorin: 44.50, lpg: 22.90, city: 'Ankara' },
  izmir: { benzin: 45.05, motorin: 44.75, lpg: 22.75, city: 'İzmir' }
};

class CityLifeManager {
  constructor() {
    this.countdowns = this.loadCountdowns();
    this.waterGoal = 2500; // 2500 ml (2.5L)
    this.init();
  }

  init() {
    setTimeout(() => {
      this.fetchLiveFuel();
      this.render();
    }, 200);
    // Her 30 dakikada bir yakıt fiyatlarını yenile
    setInterval(() => this.fetchLiveFuel(), 1800000);
  }

  async fetchLiveFuel() {
    try {
      const city = (window.weatherManager && window.weatherManager.selectedCity) || 'istanbul';
      const res = await fetch(`/api/fuel-prices?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.prices) {
          FUEL_PRICES[city.toLowerCase()] = data.prices;
          this.render();
        }
      }
    } catch (e) {}
  }

  loadCountdowns() {
    const saved = window.appStorage.get(STORAGE_KEY_CITYLIFE_COUNTDOWNS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      window.appStorage.save(STORAGE_KEY_CITYLIFE_COUNTDOWNS, DEFAULT_COUNTDOWNS, false);
      return DEFAULT_COUNTDOWNS;
    }
    return saved;
  }

  saveCountdowns() {
    window.appStorage.save(STORAGE_KEY_CITYLIFE_COUNTDOWNS, this.countdowns);
    this.render();
  }

  addCountdown(title, targetDate, category = 'personal') {
    const newCd = {
      id: 'cd-' + Date.now(),
      title: title.trim(),
      targetDate: targetDate,
      category: category,
      icon: category === 'holiday' ? 'flag' : 'calendar',
      color: category === 'holiday' ? 'rose' : 'sky'
    };

    this.countdowns.push(newCd);
    this.saveCountdowns();
    if (window.app) window.app.showToast(`"${newCd.title}" sayacı eklendi!`, 'success');
  }

  deleteCountdown(id) {
    this.countdowns = this.countdowns.filter(c => c.id !== id);
    this.saveCountdowns();
    if (window.app) window.app.showToast('Geri sayım silindi', 'info');
  }

  getDaysRemaining(dateStr) {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Su Tüketimi Yönetimi
  getWaterIntake() {
    const todayStr = new Date().toISOString().split('T')[0];
    const data = window.appStorage.get(STORAGE_KEY_WATER_TRACKER, { date: todayStr, ml: 0 });
    if (data.date !== todayStr) {
      return 0;
    }
    return data.ml;
  }

  addWater(amountMl) {
    const todayStr = new Date().toISOString().split('T')[0];
    let current = this.getWaterIntake();
    current = Math.min(5000, current + amountMl);

    window.appStorage.save(STORAGE_KEY_WATER_TRACKER, { date: todayStr, ml: current }, false);
    this.render();
    if (window.app) window.app.showToast(`+${amountMl} ml su eklendi (${current} / ${this.waterGoal} ml)`, 'success');
  }

  resetWater() {
    const todayStr = new Date().toISOString().split('T')[0];
    window.appStorage.save(STORAGE_KEY_WATER_TRACKER, { date: todayStr, ml: 0 }, false);
    this.render();
  }

  // İl Seçimine Göre Yakıt Fiyatları
  getFuelPrices() {
    const currentCity = (window.weatherManager && window.weatherManager.selectedCity) || 'istanbul';
    return FUEL_PRICES[currentCity.toLowerCase()] || FUEL_PRICES.istanbul;
  }

  render() {
    this.renderDashboardWidget();
    this.renderRoutinesExtension();
    if (window.lucide) window.lucide.createIcons();
  }

  // Ana Sayfa Kompakt Kartı
  renderDashboardWidget() {
    const container = document.getElementById('cityLifeWidgetContainer');
    if (!container) return;

    const fuel = this.getFuelPrices();
    const waterMl = this.getWaterIntake();
    const waterPercent = Math.min(100, Math.round((waterMl / this.waterGoal) * 100));

    const sortedCds = [...this.countdowns].sort((a, b) => {
      return this.getDaysRemaining(a.targetDate) - this.getDaysRemaining(b.targetDate);
    }).filter(c => this.getDaysRemaining(c.targetDate) >= 0).slice(0, 2);

    const countdownsHtml = sortedCds.map(cd => {
      const days = this.getDaysRemaining(cd.targetDate);
      return `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded-lg bg-${cd.color}-500/10 text-${cd.color}-400 border border-${cd.color}-500/20">
              <i data-lucide="${cd.icon}" class="w-3.5 h-3.5"></i>
            </div>
            <span class="font-bold text-white truncate max-w-[130px]">${cd.title}</span>
          </div>
          <span class="px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 font-mono font-bold text-[11px] border border-slate-700/60">
            ${days === 0 ? 'BUGÜN' : `${days} Gün`}
          </span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/60 p-4.5 space-y-4 hover:border-amber-500/20 transition-all">
        <!-- Header -->
        <div class="px-5 py-3.5 bg-slate-950/70 border-b border-slate-700/60 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <i data-lucide="compass" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">Gündelik Yaşam & Şehir</h4>
              <p class="text-[10px] text-slate-400">${fuel.city} Yakıt & Su Takibi</p>
            </div>
          </div>
          <button onclick="window.app.switchTab('routines', true)" class="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
            <span>Detay</span>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Akaryakıt Pompa Fiyatları Barı -->
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Benzin</span>
            <span class="text-xs font-black text-white font-mono">${fuel.benzin.toFixed(2)} ₺</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Motorin</span>
            <span class="text-xs font-black text-white font-mono">${fuel.motorin.toFixed(2)} ₺</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Otogaz</span>
            <span class="text-xs font-black text-white font-mono">${fuel.lpg.toFixed(2)} ₺</span>
          </div>
        </div>

        <!-- Su Tüketimi İlerlemesi (Hydration Tracker) -->
        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-300 font-bold flex items-center gap-1.5">
              <i data-lucide="droplet" class="w-3.5 h-3.5 text-sky-400"></i>
              <span>Günlük Su Hedefi</span>
            </span>
            <span class="font-mono text-[11px] text-sky-300 font-bold">${waterMl} / ${this.waterGoal} ml (${waterPercent}%)</span>
          </div>

          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full transition-all duration-500" style="width: ${waterPercent}%"></div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <button onclick="window.cityLifeManager.addWater(250)" class="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer">
              <i data-lucide="plus" class="w-3 h-3"></i> 250 ml (Bardak)
            </button>
            <button onclick="window.cityLifeManager.addWater(500)" class="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer">
              <i data-lucide="plus" class="w-3 h-3"></i> 500 ml (Şişe)
            </button>
            <button onclick="window.cityLifeManager.resetWater()" class="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer" title="Sıfırla">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
            </button>
          </div>
        </div>

        <!-- Yaklaşan Geri Sayımlar -->
        <div class="space-y-1.5">
          ${countdownsHtml}
        </div>
      </div>
    `;
  }

  // Rutinler Sekmesine Genişletilmiş Görünüm
  renderRoutinesExtension() {
    const container = document.getElementById('cityLifeRoutinesContainer');
    if (!container) return;

    const cds = [...this.countdowns].sort((a, b) => {
      return this.getDaysRemaining(a.targetDate) - this.getDaysRemaining(b.targetDate);
    });

    const listHtml = cds.map(cd => {
      const days = this.getDaysRemaining(cd.targetDate);
      return `
        <div class="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-all">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-${cd.color}-500/10 text-${cd.color}-400 border border-${cd.color}-500/20">
              <i data-lucide="${cd.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <h5 class="font-bold text-white text-sm">${cd.title}</h5>
              <span class="text-xs text-slate-400">Hedef Tarih: ${cd.targetDate}</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-black text-sm">
              ${days <= 0 ? 'GELDİ' : `${days} GÜN`}
            </span>
            <button onclick="window.cityLifeManager.deleteCountdown('${cd.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/60 p-6 space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-black text-white text-lg flex items-center gap-2">
              <i data-lucide="hourglass" class="w-5 h-5 text-amber-400"></i>
              Önemli Tarih & Geri Sayım Sayaçları
            </h3>
            <p class="text-xs text-slate-400">Resmi tatiller, izinler, proje teslimleri ve özel günler için geri sayım merkezi</p>
          </div>

          <button onclick="window.app.openModal('newCountdownModal')" class="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Sayaç Ekle</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${listHtml}
        </div>
      </div>
    `;
  }
}

window.cityLifeManager = new CityLifeManager();
