/**
 * ProfessionModules — Sektörel / Mesleki Hızlı Yönetim Modülleri (Fast-Pads)
 * 
 * 1. Veresiye & Toptancı (Esnaf / Bakkal)
 * 2. Nöbet & Vardiya (Doktor / Sağlık / Güvenlik)
 * 3. Duruşma & Süre Sayacı (Avukat)
 * 4. İlan Portföyü (Emlakçı)
 * 5. Ders & Öğrenci Takip (Öğretmen)
 * 6. Varlık & Kasko Takip (Yönetici & Genel)
 */

class ProfessionModuleManager {
  constructor() {
    this.activeSubtab = {};
  }

  // ==========================================
  // 1. VERESİYE & TOPTANCI DEFTERİ (ESNAF)
  // ==========================================
  renderVeresiye() {
    const container = document.getElementById('tab-veresiye');
    if (!container) return;

    const contacts = window.polymorphicStore.getContacts('veresiye');
    const toptanciTx = window.polymorphicStore.getRecords('veresiye', 'TRANSACTION')
      .filter(t => t.category === 'Toptanci');

    const totalReceivables = contacts.reduce((sum, c) => sum + (c.calculatedBalance > 0 ? c.calculatedBalance : 0), 0);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- KPI Özet Kartları -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-card p-5 rounded-3xl border">
            <p class="text-xs font-semibold text-slate-400 mb-1">Toplam Veresiye Alacağı</p>
            <h2 class="text-2xl font-bold font-mono text-emerald-400">${totalReceivables.toLocaleString('tr-TR')} ₺</h2>
            <p class="text-[11px] text-slate-500 mt-1">${contacts.length} Kayıtlı Müşteri</p>
          </div>
          <div class="glass-card p-5 rounded-3xl border">
            <p class="text-xs font-semibold text-slate-400 mb-1">Bekleyen Toptancı Ödemeleri</p>
            <h2 class="text-2xl font-bold font-mono text-rose-400">${toptanciTx.filter(t => !t.isSettled).reduce((s,t) => s + t.amount, 0).toLocaleString('tr-TR')} ₺</h2>
            <p class="text-[11px] text-slate-500 mt-1">${toptanciTx.filter(t => !t.isSettled).length} Fatura / Çek</p>
          </div>
          <div class="glass-card p-5 rounded-3xl border flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 mb-1">Hızlı İşlemler</p>
              <div class="flex gap-2 mt-2">
                <button onclick="window.professionModules.openVeresiyeModal()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i> Borç / Tahsilat Yaz
                </button>
                <button onclick="window.professionModules.openToptanciModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all">
                  Toptancı Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Müşteri Veresiye Listesi (Büyük Kartlar) -->
        <div class="glass-card p-6 rounded-3xl border space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <i data-lucide="book-marked" class="w-4 h-4 text-emerald-400"></i>
              Müşteri Veresiye Listesi
            </h3>
            <input type="text" placeholder="Müşteri ara..." oninput="window.professionModules.filterVeresiye(this.value)" 
                   class="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-48">
          </div>

          <div id="veresiyeListContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            ${contacts.length === 0 ? '<div class="col-span-full py-12 text-center text-slate-500 text-xs">Henüz veresiye kaydı yok. "Borç Yaz" butonundan hemen ekleyebilirsiniz.</div>' : ''}
            ${contacts.map(c => `
              <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex justify-between items-center group">
                <div>
                  <h4 class="font-bold text-slate-100 text-sm">${escapeHtml(c.displayName)}</h4>
                  <p class="text-xs text-slate-400 font-mono">${c.phone || 'Telefon yok'} • ${c.transactionsCount} İşlem</p>
                </div>
                <div class="text-right">
                  <p class="text-base font-mono font-bold ${c.calculatedBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}">
                    ${c.calculatedBalance > 0 ? '+' : ''}${c.calculatedBalance.toLocaleString('tr-TR')} ₺
                  </p>
                  <button onclick="window.professionModules.quickAddDebt('${c.id}', '${escapeHtml(c.displayName)}')" 
                          class="mt-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline">
                    + İşlem Ekle
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 2. NÖBET & VARDİYA ÇİZELGESİ (DOKTOR & GÜVENLİK)
  // ==========================================
  renderNobet() {
    const container = document.getElementById('tab-nobet');
    if (!container) return;

    const events = window.polymorphicStore.getRecords('nobet', 'TIMELINE_EVENT');

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="calendar-days" class="w-5 h-5 text-cyan-400"></i>
              Nöbet & Vardiya Takvimi
            </h2>
            <p class="text-xs text-slate-400">Aylık nöbetlerinizi, icapları ve takas taleplerini tek tıkla mühürleyin.</p>
          </div>
          <button onclick="window.professionModules.openNobetAddModal()" 
                  class="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i> Nöbet / Vardiya Ekle
          </button>
        </div>

        <!-- Nöbet Listesi / Kartlar -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${events.length === 0 ? '<div class="col-span-full py-12 text-center text-slate-500 text-xs">Henüz kayıtlı nöbetiniz bulunmuyor.</div>' : ''}
          ${events.map(ev => `
            <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    ${ev.customAttributes?.shiftType || '24 Saat Nöbet'}
                  </span>
                  <h3 class="text-base font-bold text-slate-100 mt-2">${escapeHtml(ev.title)}</h3>
                  <p class="text-xs text-slate-400 font-mono">${new Date(ev.startAt).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <button onclick="window.professionModules.deleteNobet('${ev.id}')" class="text-slate-500 hover:text-rose-400 transition-colors">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <b>Birim/Konum:</b> ${ev.location || 'Genel Servis'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 3. DURUŞMA & SÜRE SAYACI (AVUKAT)
  // ==========================================
  renderDurusma() {
    const container = document.getElementById('tab-durusma');
    if (!container) return;

    const durusmalar = window.polymorphicStore.getRecords('durusma', 'TIMELINE_EVENT');
    const sureler = window.polymorphicStore.getRecords('durusma', 'COMPLIANCE_EXPIRY');

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="scale" class="w-5 h-5 text-purple-400"></i>
              Duruşma & Kesin Süre Takipçisi
            </h2>
            <p class="text-xs text-slate-400">Mahkeme saatleri ve itiraz/istinaf süre geri sayımları.</p>
          </div>
          <div class="flex gap-2">
            <button onclick="window.professionModules.openDurusmaModal()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-purple-500/20">
              <i data-lucide="plus" class="w-4 h-4"></i> Duruşma Ekle
            </button>
            <button onclick="window.professionModules.openSureModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all">
              + Süre / İtiraz Ekle
            </button>
          </div>
        </div>

        <!-- Yaklaşan Kesin Süre Alarmları -->
        <div class="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-3">
          <h3 class="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            Kritik Hak Düşürücü Süreler
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${sureler.length === 0 ? '<p class="text-xs text-slate-400 col-span-full">Bekleyen acil itiraz veya temyiz süresi yok.</p>' : ''}
            ${sureler.map(s => {
              const diffDays = Math.ceil((s.deadlineAt - Date.now()) / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays <= 3;
              return `
                <div class="p-3.5 rounded-2xl bg-slate-900/80 border ${isUrgent ? 'border-rose-500/50' : 'border-slate-700'} flex justify-between items-center">
                  <div>
                    <h4 class="font-bold text-slate-100 text-xs">${escapeHtml(s.title)}</h4>
                    <p class="text-[11px] text-slate-400 font-mono">Son Tarih: ${new Date(s.deadlineAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${isUrgent ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'}">
                    ${diffDays <= 0 ? 'SÜRE BİTTİ' : `${diffDays} Gün Kaldı`}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Duruşma Listesi -->
        <div class="glass-card p-6 rounded-3xl border space-y-4">
          <h3 class="text-sm font-bold text-slate-200">Gelecek Duruşmalar</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            ${durusmalar.length === 0 ? '<p class="text-xs text-slate-500 py-6 text-center col-span-full">Kayıtlı duruşma bulunmuyor.</p>' : ''}
            ${durusmalar.map(d => `
              <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-slate-100 text-sm">${escapeHtml(d.title)}</h4>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">${new Date(d.startAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p class="text-xs text-slate-400 font-mono">${new Date(d.startAt).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p class="text-xs text-slate-300 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">📍 ${d.location || 'Mahkeme salonu belirtilmedi'}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 4. İLAN PORTFÖYÜ & EMLAK CRM (EMLAKÇI)
  // ==========================================
  renderEmlak() {
    const container = document.getElementById('tab-emlak');
    if (!container) return;

    const listings = window.polymorphicStore.getRecords('emlak', 'ENTITY');

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="building-2" class="w-5 h-5 text-amber-400"></i>
              Gayrimenkul Portföyü
            </h2>
            <p class="text-xs text-slate-400">Satılık ve kiralık mülkleriniz, mülk sahibi irtibatları ve anahtar durumları.</p>
          </div>
          <button onclick="window.professionModules.openEmlakModal()" class="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i> Yeni İlan / Mülk Ekle
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${listings.length === 0 ? '<div class="col-span-full py-12 text-center text-slate-500 text-xs">Portföyünüzde henüz mülk yok.</div>' : ''}
          ${listings.map(item => `
            <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ${item.category || 'Satılık'}
                </span>
                <p class="text-base font-mono font-bold text-slate-100">${(item.valuation?.amount || 0).toLocaleString('tr-TR')} ₺</p>
              </div>
              <h3 class="font-bold text-slate-100 text-sm">${escapeHtml(item.title)}</h3>
              <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>👤 <b>Mülk Sahibi:</b> ${item.customAttributes?.ownerName || 'Bilinmiyor'} (${item.customAttributes?.ownerPhone || '-'})</p>
                <p>🔑 <b>Anahtar:</b> ${item.customAttributes?.keyStatus || 'Ofiste'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // MODALLAR & HIZLI KAYIT İŞLEYİCİLERİ
  // ==========================================
  openVeresiyeModal(preContactId = '', preName = '') {
    const name = prompt("Müşteri Adı Soyadı:", preName);
    if (!name) return;
    const amount = parseFloat(prompt("İşlem Tutarı (₺):", "100"));
    if (isNaN(amount) || amount <= 0) return;
    const type = confirm("Tamam'a basarsanız BORÇ YAZILIR (Kırmızı),
İptal'e basarsanız TAHSİLAT DÜŞÜLÜR (Yeşil).") ? 'outflow' : 'inflow';

    let contact = window.polymorphicStore.getRecords('veresiye', 'CONTACT').find(c => c.displayName.toLowerCase() === name.toLowerCase());
    if (!contact) {
      contact = window.polymorphicStore.addRecord({
        moduleId: 'veresiye',
        primitiveType: 'CONTACT',
        displayName: name,
        role: 'Musteri',
        initialBalance: 0
      });
    }

    window.polymorphicStore.addRecord({
      moduleId: 'veresiye',
      primitiveType: 'TRANSACTION',
      relatedContactId: contact.id,
      flow: type,
      amount: amount,
      category: 'Veresiye',
      occurredAt: Date.now()
    });

    this.renderVeresiye();
  }

  openNobetAddModal() {
    const title = prompt("Nöbet / Vardiya Başlığı (Örn: Acil Servis 24s Nöbeti):", "Acil Servis Nöbeti");
    if (!title) return;
    const dateStr = prompt("Nöbet Tarihi (YYYY-AA-GG):", new Date().toISOString().split('T')[0]);
    if (!dateStr) return;

    window.polymorphicStore.addRecord({
      moduleId: 'nobet',
      primitiveType: 'TIMELINE_EVENT',
      title: title,
      startAt: new Date(dateStr).getTime(),
      endAt: new Date(dateStr).getTime() + (24 * 60 * 60 * 1000),
      allDay: true,
      location: 'Hastane / Karakol',
      customAttributes: { shiftType: '24 Saat' }
    });

    this.renderNobet();
  }

  deleteNobet(id) {
    if (confirm("Bu nöbet kaydını silmek istediğinize emin misiniz?")) {
      window.polymorphicStore.deleteRecord(id);
      this.renderNobet();
    }
  }

  openDurusmaModal() {
    const court = prompt("Mahkeme ve Dosya Esas No (Örn: 2. Asliye Hukuk 2024/18):");
    if (!court) return;
    const dateStr = prompt("Duruşma Tarihi (YYYY-AA-GG):", new Date().toISOString().split('T')[0]);
    if (!dateStr) return;

    window.polymorphicStore.addRecord({
      moduleId: 'durusma',
      primitiveType: 'TIMELINE_EVENT',
      title: court,
      startAt: new Date(dateStr + 'T10:00:00').getTime(),
      endAt: new Date(dateStr + 'T11:00:00').getTime(),
      allDay: false,
      location: 'Adliye Salon 4'
    });

    this.renderDurusma();
  }

  openSureModal() {
    const title = prompt("Süre / İtiraz Konusu (Örn: İstinaf Başvuru Son Günü):");
    if (!title) return;
    const days = parseInt(prompt("Kaç gün sonra süre doluyor? (Örn: 7):", "7"));
    if (isNaN(days)) return;

    window.polymorphicStore.addRecord({
      moduleId: 'durusma',
      primitiveType: 'COMPLIANCE_EXPIRY',
      title: title,
      deadlineAt: Date.now() + (days * 24 * 60 * 60 * 1000),
      severity: 'critical',
      isResolved: false
    });

    this.renderDurusma();
  }

  openEmlakModal() {
    const title = prompt("Mülk Özeti (Örn: Kadıköy Moda 3+1 Daire):");
    if (!title) return;
    const price = parseFloat(prompt("Fiyat (₺):", "5000000"));
    const owner = prompt("Mülk Sahibi Adı & Telefon:", "Mehmet Bey 0532...");

    window.polymorphicStore.addRecord({
      moduleId: 'emlak',
      primitiveType: 'ENTITY',
      title: title,
      category: 'Satılık Daire',
      valuation: { amount: price || 0 },
      customAttributes: { ownerName: owner, keyStatus: 'Ofiste' }
    });

    this.renderEmlak();
  }
}

window.professionModules = new ProfessionModuleManager();
console.log('[ProfessionModules] ✅ Sektörel Hızlı Modüller Hazır.');
