/**
 * Subscriptions & Recurring Bills / Inspection Tracker Module (js/subscriptions.js)
 * Dijital Abonelikler, Periyodik Ödemeler, Araç Muayene & Sigorta Takip Modülü
 */

const STORAGE_KEY_SUBSCRIPTIONS = 'assistant_subscriptions_data';

const DEFAULT_SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    title: 'Netflix UHD',
    category: 'entertainment',
    amount: 249.99,
    currency: 'TRY',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-05',
    autoRenewal: true,
    reminderDays: 3,
    icon: 'tv',
    color: 'rose',
    notes: 'Ortak 4 kişilik plan'
  },
  {
    id: 'sub-2',
    title: 'Spotify Aile',
    category: 'entertainment',
    amount: 119.99,
    currency: 'TRY',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-12',
    autoRenewal: true,
    reminderDays: 2,
    icon: 'music',
    color: 'emerald',
    notes: 'Aile paketi'
  },
  {
    id: 'sub-3',
    title: 'ChatGPT Plus',
    category: 'software',
    amount: 20.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-18',
    autoRenewal: true,
    reminderDays: 3,
    icon: 'sparkles',
    color: 'sky',
    notes: 'İş ve araştırma için'
  },
  {
    id: 'sub-4',
    title: 'Araç Muayenesi (TÜVTÜRK)',
    category: 'official',
    amount: 2450.00,
    currency: 'TRY',
    billingCycle: 'yearly',
    nextBillingDate: '2026-10-15',
    autoRenewal: false,
    reminderDays: 15,
    icon: 'car',
    color: 'amber',
    notes: 'Randevu 2 hafta önce alınmalı'
  },
  {
    id: 'sub-5',
    title: 'Kasko & Trafik Sigortası',
    category: 'insurance',
    amount: 18500.00,
    currency: 'TRY',
    billingCycle: 'yearly',
    nextBillingDate: '2026-11-20',
    autoRenewal: false,
    reminderDays: 14,
    icon: 'shield-check',
    color: 'indigo',
    notes: 'Axa Sigorta poliçesi'
  }
];

const SUB_CATEGORIES = {
  all: { label: 'Tümü', icon: 'layers' },
  entertainment: { label: 'Eğlence & Medya', icon: 'tv', color: 'rose' },
  software: { label: 'Yazılım & İş', icon: 'code', color: 'sky' },
  official: { label: 'Resmi & Araç', icon: 'car', color: 'amber' },
  insurance: { label: 'Sigorta & DASK', icon: 'shield-check', color: 'indigo' },
  home: { label: 'Ev, Kira & Aidat', icon: 'home', color: 'emerald' },
  other: { label: 'Diğer Düzenli', icon: 'credit-card', color: 'slate' }
};

class SubscriptionManager {
  constructor() {
    this.subscriptions = this.loadSubscriptions();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    setTimeout(() => {
      this.render();
    }, 100);
  }

  loadSubscriptions() {
    const saved = window.appStorage.get(STORAGE_KEY_SUBSCRIPTIONS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      window.appStorage.save(STORAGE_KEY_SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS, false);
      return DEFAULT_SUBSCRIPTIONS;
    }
    return saved;
  }

  saveSubscriptions() {
    window.appStorage.save(STORAGE_KEY_SUBSCRIPTIONS, this.subscriptions);
    this.render();
  }

  addSubscription(data) {
    const newSub = {
      id: 'sub-' + Date.now(),
      title: data.title.trim(),
      category: data.category || 'other',
      amount: parseFloat(data.amount) || 0,
      currency: data.currency || 'TRY',
      billingCycle: data.billingCycle || 'monthly',
      nextBillingDate: data.nextBillingDate,
      autoRenewal: data.autoRenewal !== undefined ? data.autoRenewal : true,
      reminderDays: parseInt(data.reminderDays) || 3,
      icon: this.getCategoryIcon(data.category),
      color: this.getCategoryColor(data.category),
      notes: data.notes ? data.notes.trim() : ''
    };

    this.subscriptions.push(newSub);
    this.saveSubscriptions();

    if (window.app) window.app.showToast(`"${newSub.title}" radara eklendi`, 'success');
  }

  deleteSubscription(id) {
    const sub = this.subscriptions.find(s => s.id === id);
    if (!sub) return;

    if (confirm(`"${sub.title}" kaydını silmek istediğinize emin misiniz?`)) {
      this.subscriptions = this.subscriptions.filter(s => s.id !== id);
      this.saveSubscriptions();
      if (window.app) window.app.showToast('Kayıt silindi', 'info');
    }
  }

  markAsPaid(id) {
    const sub = this.subscriptions.find(s => s.id === id);
    if (!sub) return;

    const current = new Date(sub.nextBillingDate);
    if (isNaN(current.getTime())) return;

    if (sub.billingCycle === 'monthly') {
      current.setMonth(current.getMonth() + 1);
    } else if (sub.billingCycle === 'yearly') {
      current.setFullYear(current.getFullYear() + 1);
    } else {
      current.setMonth(current.getMonth() + 1);
    }

    sub.nextBillingDate = current.toISOString().split('T')[0];
    this.saveSubscriptions();

    if (window.app) {
      window.app.showToast(`"${sub.title}" ödendi olarak işaretlendi. Sonraki: ${sub.nextBillingDate}`, 'success');
    }
  }

  getCategoryIcon(cat) {
    return (SUB_CATEGORIES[cat] && SUB_CATEGORIES[cat].icon) || 'credit-card';
  }

  getCategoryColor(cat) {
    return (SUB_CATEGORIES[cat] && SUB_CATEGORIES[cat].color) || 'amber';
  }

  getDaysRemaining(dateStr) {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toTryAmount(sub) {
    let rate = 1;
    if (sub.currency === 'USD') {
      rate = (window.financeManager && window.financeManager.rates && window.financeManager.rates.usd) 
        ? window.financeManager.rates.usd.price : 48.25;
    } else if (sub.currency === 'EUR') {
      rate = (window.financeManager && window.financeManager.rates && window.financeManager.rates.eur) 
        ? window.financeManager.rates.eur.price : 56.25;
    }
    return sub.amount * rate;
  }

  getStats() {
    let monthlyTryTotal = 0;
    let yearlyTryTotal = 0;
    let criticalCount = 0;

    this.subscriptions.forEach(sub => {
      const tryVal = this.toTryAmount(sub);
      if (sub.billingCycle === 'monthly') {
        monthlyTryTotal += tryVal;
        yearlyTryTotal += (tryVal * 12);
      } else if (sub.billingCycle === 'yearly') {
        monthlyTryTotal += (tryVal / 12);
        yearlyTryTotal += tryVal;
      }

      const days = this.getDaysRemaining(sub.nextBillingDate);
      if (days >= 0 && days <= 7) {
        criticalCount++;
      }
    });

    return {
      monthlyTryTotal,
      yearlyTryTotal,
      criticalCount,
      totalCount: this.subscriptions.length
    };
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.render();
  }

  render() {
    this.renderFullTab();
    this.renderDashboardWidget();
    if (window.lucide) window.lucide.createIcons();
  }

  renderDashboardWidget() {
    const container = document.getElementById('subscriptionsWidgetContainer');
    if (!container) return;

    const stats = this.getStats();
    const sorted = [...this.subscriptions].sort((a, b) => {
      return this.getDaysRemaining(a.nextBillingDate) - this.getDaysRemaining(b.nextBillingDate);
    });

    const upcoming = sorted.slice(0, 4);

    let itemsHtml = '';
    if (upcoming.length === 0) {
      itemsHtml = `
        <div class="text-center py-6 text-slate-500 text-xs">
          <i data-lucide="check-circle-2" class="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60"></i>
          Takip edilen aktif abonelik veya ödeme bulunmuyor.
        </div>
      `;
    } else {
      itemsHtml = upcoming.map(sub => {
        const days = this.getDaysRemaining(sub.nextBillingDate);
        let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
        let badgeText = `${days} gün kaldı`;

        if (days < 0) {
          badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold';
          badgeText = `${Math.abs(days)} gün gecikti`;
        } else if (days === 0) {
          badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-black animate-pulse';
          badgeText = 'BUGÜN';
        } else if (days <= 3) {
          badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold';
          badgeText = `${days} gün kaldı`;
        }

        const symbol = sub.currency === 'USD' ? '$' : (sub.currency === 'EUR' ? '€' : '₺');

        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-${sub.color || 'amber'}-500/10 text-${sub.color || 'amber'}-400 border border-${sub.color || 'amber'}-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <i data-lucide="${sub.icon || 'credit-card'}" class="w-4 h-4"></i>
              </div>
              <div>
                <h5 class="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">${sub.title}</h5>
                <span class="text-[10px] text-slate-400">${sub.nextBillingDate}</span>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="text-right">
                <span class="text-xs font-black text-white">${sub.amount.toLocaleString('tr-TR')} ${symbol}</span>
                <span class="block text-[9px] text-slate-500 font-medium">${sub.billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'}</span>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] border ${badgeColor}">
                ${badgeText}
              </span>
            </div>
          </div>
        `;
      }).join('');
    }

    container.innerHTML = `
      <div class="space-y-3">
        <!-- Mini Info Banner -->
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div class="text-[11px] text-slate-300">
            Aylık Sabit Yük: <strong class="text-amber-400 font-mono font-bold">~${Math.round(stats.monthlyTryTotal).toLocaleString('tr-TR')} ₺</strong>
            ${stats.criticalCount > 0 ? `<span class="ml-2 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-black">${stats.criticalCount} Yaklaştı</span>` : ''}
          </div>
          <button onclick="window.app.switchTab('subscriptions', true)" class="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer">
            <span>Tümü</span>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- List -->
        <div class="space-y-2">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  renderFullTab() {
    const container = document.getElementById('mainSubscriptionsContainer');
    if (!container) return;

    const stats = this.getStats();

    const filtered = this.subscriptions.filter(s => {
      if (this.currentFilter === 'all') return true;
      return s.category === this.currentFilter;
    }).sort((a, b) => {
      return this.getDaysRemaining(a.nextBillingDate) - this.getDaysRemaining(b.nextBillingDate);
    });

    const filterButtonsHtml = Object.entries(SUB_CATEGORIES).map(([key, cat]) => {
      const isActive = this.currentFilter === key;
      return `
        <button 
          onclick="window.subscriptionManager.setFilter('${key}')"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isActive 
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
          }"
        >
          <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
          <span>${cat.label}</span>
        </button>
      `;
    }).join('');

    let listHtml = '';
    if (filtered.length === 0) {
      listHtml = `
        <div class="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <i data-lucide="credit-card" class="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-60"></i>
          <h4 class="text-sm font-bold text-white mb-1">Bu kategoride henüz kayıtlı ödeme yok</h4>
          <p class="text-xs text-slate-500 mb-4">Yeni bir abonelik, sigorta poliçesi veya araç muayene tarihi ekleyebilirsiniz.</p>
          <button onclick="window.app.openModal('newSubscriptionModal')" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Ödeme / Abonelik Ekle</span>
          </button>
        </div>
      `;
    } else {
      listHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filtered.map(sub => {
            const days = this.getDaysRemaining(sub.nextBillingDate);
            let badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
            let badgeText = `${days} Gün Kaldı`;

            if (days < 0) {
              badgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold';
              badgeText = `${Math.abs(days)} Gün Gecikti`;
            } else if (days === 0) {
              badgeClass = 'bg-rose-500 text-white border-rose-600 font-black animate-pulse';
              badgeText = 'BUGÜN ÖDENECEK';
            } else if (days <= 3) {
              badgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
              badgeText = `${days} Gün Kaldı`;
            }

            const symbol = sub.currency === 'USD' ? '$' : (sub.currency === 'EUR' ? '€' : '₺');
            const tryEquivalent = Math.round(this.toTryAmount(sub));

            return `
              <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4 hover:border-amber-500/30 transition-all relative group flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="p-3 rounded-2xl bg-${sub.color || 'amber'}-500/10 text-${sub.color || 'amber'}-400 border border-${sub.color || 'amber'}-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                        <i data-lucide="${sub.icon || 'credit-card'}" class="w-6 h-6"></i>
                      </div>
                      <div>
                        <h4 class="font-bold text-white text-base group-hover:text-amber-400 transition-colors">${sub.title}</h4>
                        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">${SUB_CATEGORIES[sub.category]?.label || 'Genel'}</span>
                      </div>
                    </div>

                    <span class="px-2.5 py-1 rounded-lg text-xs border ${badgeClass}">
                      ${badgeText}
                    </span>
                  </div>

                  <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2 mb-3">
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-slate-400">Tutar:</span>
                      <span class="font-black text-white text-sm">${sub.amount.toLocaleString('tr-TR')} ${symbol} ${sub.currency !== 'TRY' ? `<span class="text-[10px] text-slate-400 font-normal">(~${tryEquivalent.toLocaleString('tr-TR')} ₺)</span>` : ''}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-slate-400">Döngü:</span>
                      <span class="font-medium text-slate-300">${sub.billingCycle === 'monthly' ? 'Aylık Düzenli' : 'Yıllık Periyodik'}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-slate-400">Sonraki Ödeme:</span>
                      <span class="font-bold text-amber-400">${sub.nextBillingDate}</span>
                    </div>
                  </div>

                  ${sub.notes ? `<p class="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 mb-3"><i data-lucide="info" class="w-3.5 h-3.5 inline mr-1 text-slate-500"></i>${sub.notes}</p>` : ''}
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-slate-800/60">
                  <button onclick="window.subscriptionManager.markAsPaid('${sub.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" title="Ödendi ve sonraki döneme aktar">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Ödendi Yap</span>
                  </button>

                  <button onclick="window.subscriptionManager.deleteSubscription('${sub.id}')" class="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer" title="Sil">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Üst Analitik Kartları -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-1">
          <div class="flex justify-between items-center text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Aylık Sabit Yük</span>
            <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <i data-lucide="calendar" class="w-4 h-4"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-white">~${Math.round(stats.monthlyTryTotal).toLocaleString('tr-TR')} ₺</h3>
          <p class="text-[11px] text-slate-400">Tüm aboneliklerin aylık ortalaması</p>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-1">
          <div class="flex justify-between items-center text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Yıllık Toplam Projeksiyon</span>
            <div class="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <i data-lucide="trending-up" class="w-4 h-4"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-white">~${Math.round(stats.yearlyTryTotal).toLocaleString('tr-TR')} ₺</h3>
          <p class="text-[11px] text-slate-400">Sigorta, muayene ve abonelikler dahil</p>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-1">
          <div class="flex justify-between items-center text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Yaklaşan Kritik Ödemeler</span>
            <div class="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <i data-lucide="alert-circle" class="w-4 h-4"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black ${stats.criticalCount > 0 ? 'text-rose-400' : 'text-emerald-400'}">${stats.criticalCount} Ödeme</h3>
          <p class="text-[11px] text-slate-400">Gelecek 7 gün içinde vadesi gelen</p>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-1">
          <div class="flex justify-between items-center text-slate-400 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Kayıtlı Döngü Sayısı</span>
            <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <i data-lucide="layers" class="w-4 h-4"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-white">${stats.totalCount} Kalem</h3>
          <p class="text-[11px] text-slate-400">Aktif radar takibindeki ödemeler</p>
        </div>
      </div>

      <!-- Araç Çubuğu & Filtreler -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
          ${filterButtonsHtml}
        </div>

        <button onclick="window.app.openModal('newSubscriptionModal')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer flex-shrink-0">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Yeni Abonelik / Ödeme Ekle</span>
        </button>
      </div>

      <!-- İçerik Listesi -->
      ${listHtml}
    `;
  }
}

window.subscriptionManager = new SubscriptionManager();
