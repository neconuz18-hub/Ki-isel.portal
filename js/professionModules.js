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


  // ==========================================
  // 5. EĞİTİM KOÇLUĞU & ÖZEL DERS YÖNETİMİ (ÖĞRETMEN)
  // ==========================================
  renderOgretmen() {
    const container = document.getElementById('tab-ogretmen');
    if (!container) return;

    const students = window.polymorphicStore.getRecords('ogretmen', 'CONTACT');
    const logs = window.polymorphicStore.getRecords('ogretmen', 'TIMELINE_EVENT');
    const exams = window.polymorphicStore.getRecords('ogretmen', 'ENTITY').filter(e => e.category === 'DenemeSinavi');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCalls = students.filter(s => s.customAttributes?.nextCallDate === todayStr);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Üst Başlık ve Hızlı Ekle -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-400"></i>
              Eğitim Koçluğu & Özel Ders Portalı
            </h2>
            <p class="text-xs text-slate-400">Öğrenci takip dosyaları, günlük arama/ödev kontrolü, deneme netleri ve koçluk performansı.</p>
          </div>
          <div class="flex gap-2 w-full md:w-auto">
            <button onclick="window.professionModules.openAddStudentModal()" 
                    class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all flex-1 md:flex-initial">
              <i data-lucide="user-plus" class="w-4 h-4"></i> Yeni Öğrenci Ekle
            </button>
          </div>
        </div>

        <!-- Özet KPI Kartları -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="glass-card p-5 rounded-3xl border">
            <p class="text-xs font-semibold text-slate-400 mb-1">Kayıtlı Öğrenciler</p>
            <h2 class="text-2xl font-bold font-mono text-slate-100">${students.length}</h2>
            <p class="text-[11px] text-slate-500 mt-1">Aktif Koçluk & Özel Ders</p>
          </div>

          <div class="glass-card p-5 rounded-3xl border ${todayCalls.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : ''}">
            <p class="text-xs font-semibold text-slate-400 mb-1">Bugün Aranacaklar</p>
            <h2 class="text-2xl font-bold font-mono ${todayCalls.length > 0 ? 'text-amber-400' : 'text-slate-100'}">${todayCalls.length}</h2>
            <p class="text-[11px] text-slate-500 mt-1">Ders & Ödev Kontrol Görüşmesi</p>
          </div>

          <div class="glass-card p-5 rounded-3xl border">
            <p class="text-xs font-semibold text-slate-400 mb-1">Toplam Koçluk Seansı</p>
            <h2 class="text-2xl font-bold font-mono text-cyan-400">${logs.length}</h2>
            <p class="text-[11px] text-slate-500 mt-1">Kayıtlı Görüşme Notu</p>
          </div>

          <div class="glass-card p-5 rounded-3xl border">
            <p class="text-xs font-semibold text-slate-400 mb-1">Girilen Deneme Sınavları</p>
            <h2 class="text-2xl font-bold font-mono text-purple-400">${exams.length}</h2>
            <p class="text-[11px] text-slate-500 mt-1">Net & Puan Kaydı</p>
          </div>
        </div>

        <!-- Bugün Aranacak Öğrenciler Şeridi (Eğer varsa) -->
        ${todayCalls.length > 0 ? `
          <div class="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="phone-call" class="w-4 h-4"></i>
              Bugün Ödev & Ders Kontrolü İçin Aranacak Öğrenciler
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              ${todayCalls.map(s => `
                <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 flex justify-between items-center">
                  <div>
                    <h4 class="font-bold text-slate-100 text-sm">${escapeHtml(s.displayName)}</h4>
                    <p class="text-xs text-slate-400 font-mono">Hedef: ${s.customAttributes?.target || 'YKS / LGS'}</p>
                  </div>
                  <div class="flex gap-1.5">
                    <a href="tel:${s.phone}" class="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white" title="Ara">
                      <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                    </a>
                    <button onclick="window.professionModules.openAddLogModal('${s.id}', '${escapeHtml(s.displayName)}')" 
                            class="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                      Not Yaz
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Öğrenci Listesi (360° Koçluk Dosyaları) -->
        <div class="glass-card p-6 rounded-3xl border space-y-4">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <i data-lucide="users" class="w-4 h-4 text-blue-400"></i>
              Tüm Öğrenci Koçluk Dosyaları
            </h3>
            <input type="text" placeholder="Öğrenci ara veya filtrele..." oninput="window.professionModules.filterStudents(this.value)" 
                   class="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full md:w-64">
          </div>

          <div id="studentListContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${students.length === 0 ? `
              <div class="col-span-full py-16 text-center space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                  <i data-lucide="user-plus" class="w-6 h-6"></i>
                </div>
                <p class="text-slate-400 text-sm font-medium">Henüz kayıtlı öğrenciniz yok.</p>
                <button onclick="window.professionModules.openAddStudentModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                  İlk Öğrenciyi Ekle
                </button>
              </div>
            ` : ''}

            ${students.map(s => {
              const sLogs = logs.filter(l => l.relatedContactId === s.id);
              const sExams = exams.filter(e => e.primaryContactId === s.id);
              const lastLog = sLogs[0];
              const lastExam = sExams[0];

              // Performans Trendi
              const trend = s.customAttributes?.performanceTrend || 'Yükselişte';
              const trendColor = trend === 'Yükselişte' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

              return `
                <div onclick="window.professionModules.openStudentDossier('${s.id}')"
                     class="cursor-pointer glass-card p-5 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all space-y-3.5 group relative">
                  
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-md">
                        ${s.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">${escapeHtml(s.displayName)}</h4>
                        <p class="text-xs text-slate-400 font-mono">${s.customAttributes?.grade || 'Sınıf Belirtilmedi'} • ${s.customAttributes?.target || 'Hedef Yok'}</p>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${trendColor}">
                      ${trend === 'Yükselişte' ? '🔥 Yükselişte' : '⚠️ Takip Gerekli'}
                    </span>
                  </div>

                  <!-- Mini İstatistik Çubuğu -->
                  <div class="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                    <div>
                      <p class="text-slate-500">Son Deneme Neti</p>
                      <p class="font-mono font-bold text-slate-200">${lastExam ? `${lastExam.valuation?.amount || 0} Net` : 'Henüz Girilmedi'}</p>
                    </div>
                    <div>
                      <p class="text-slate-500">Son Görüşme</p>
                      <p class="font-mono font-bold text-slate-200">${lastLog ? new Date(lastLog.startAt).toLocaleDateString('tr-TR') : 'Yapılmadı'}</p>
                    </div>
                  </div>

                  <!-- Alt Butonlar -->
                  <div class="flex justify-between items-center pt-1 text-xs">
                    <span class="text-blue-400 font-semibold flex items-center gap-1 group-hover:underline">
                      Dosyayı İncele <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                    </span>
                    <span class="text-slate-500 text-[11px] font-mono">${sLogs.length} Görüşme Notu</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // ÖĞRENCİ 360° DETAY DOSYASI (DOSSIER MODAL)
  // ==========================================
  openStudentDossier(studentId) {
    const student = window.polymorphicStore.getRecords('ogretmen', 'CONTACT').find(s => s.id === studentId);
    if (!student) return;

    const modal = document.getElementById('studentDossierModal');
    if (!modal) return;

    const logs = window.polymorphicStore.getRecords('ogretmen', 'TIMELINE_EVENT')
      .filter(l => l.relatedContactId === studentId)
      .sort((a,b) => b.startAt - a.startAt);

    const exams = window.polymorphicStore.getRecords('ogretmen', 'ENTITY')
      .filter(e => e.primaryContactId === studentId && e.category === 'DenemeSinavi')
      .sort((a,b) => b.createdAt - a.createdAt);

    const container = document.getElementById('studentDossierContent');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Öğrenci Başlık Bilgisi -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-lg shadow-lg">
              ${student.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
                ${escapeHtml(student.displayName)}
                <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">${student.customAttributes?.target || 'Hedef: YKS'}</span>
              </h3>
              <p class="text-xs text-slate-400 font-mono">
                📱 Öğrenci: ${student.phone || 'Yok'} | 👨‍👩‍👦 Veli: ${student.customAttributes?.parentPhone || 'Yok'}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick="window.professionModules.openAddLogModal('${student.id}', '${escapeHtml(student.displayName)}')" 
                    class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Görüşme Notu Ekle
            </button>
            <button onclick="window.professionModules.openAddExamModal('${student.id}', '${escapeHtml(student.displayName)}')" 
                    class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Deneme Neti Gir
            </button>
          </div>
        </div>

        <!-- 2 Sütunlu Detay Alanı -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Sol Sütun: Görüşme & Koçluk Günlüğü -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-blue-400"></i>
              Görüşme ve Kontrol Kayıtları (${logs.length})
            </h4>

            <div class="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar">
              ${logs.length === 0 ? '<p class="text-xs text-slate-500 py-6 text-center">Henüz görüşme notu eklenmemiş.</p>' : ''}
              ${logs.map(l => `
                <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-200 font-mono">${new Date(l.startAt).toLocaleDateString('tr-TR')} - ${new Date(l.startAt).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded font-semibold ${
                      l.customAttributes?.hwStatus === 'Tam Yapıldı' ? 'bg-emerald-500/20 text-emerald-300' : 
                      l.customAttributes?.hwStatus === 'Kısmi / Eksik' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                    }">
                      Ödev: ${l.customAttributes?.hwStatus || 'Kontrol Edildi'}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(l.title)}</p>
                  ${l.customAttributes?.nextGoal ? `
                    <div class="text-[11px] text-blue-300 bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
                      🎯 <b>Verilen Hedef:</b> ${escapeHtml(l.customAttributes.nextGoal)}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sağ Sütun: Sınav & Deneme Netleri -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="trending-up" class="w-4 h-4 text-purple-400"></i>
              Deneme Sınavları & Net Trendi (${exams.length})
            </h4>

            <div class="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar">
              ${exams.length === 0 ? '<p class="text-xs text-slate-500 py-6 text-center">Henüz deneme neti girilmemiş.</p>' : ''}
              ${exams.map(ex => `
                <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <div>
                    <h5 class="text-xs font-bold text-slate-100">${escapeHtml(ex.title)}</h5>
                    <p class="text-[11px] text-slate-400 font-mono">${new Date(ex.createdAt).toLocaleDateString('tr-TR')} • ${ex.customAttributes?.subDetails || ''}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-base font-mono font-bold text-purple-400">${ex.valuation?.amount || 0} Net</span>
                    <p class="text-[10px] text-slate-500">${ex.customAttributes?.rank ? `Sıralama: ${ex.customAttributes.rank}` : 'Puan: ' + (ex.customAttributes?.score || '-')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <div class="pt-3 border-t border-slate-800 flex justify-end">
          <button onclick="window.professionModules.closeStudentDossier()" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">
            Kapat
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeStudentDossier() {
    const modal = document.getElementById('studentDossierModal');
    if (modal) modal.classList.add('hidden');
  }

  // --- MODALLAR: ÖĞRENCİ EKLE, GÖRÜŞME NOTU EKLE, DENEME NETİ EKLE ---
  openAddStudentModal() {
    const name = prompt("Öğrenci Adı Soyadı:");
    if (!name) return;
    const phone = prompt("Öğrenci Telefon No (Opsiyonel):", "05");
    const parentPhone = prompt("Veli Telefon No (Opsiyonel):", "05");
    const target = prompt("Hedef Sınav / Bölüm (Örn: YKS Sayısal / LGS):", "YKS Sayısal");
    const nextCallDate = prompt("Bir Sonraki Kontrol Arama Tarihi (YYYY-AA-GG):", new Date().toISOString().split('T')[0]);

    window.polymorphicStore.addRecord({
      moduleId: 'ogretmen',
      primitiveType: 'CONTACT',
      displayName: name,
      phone: phone || '',
      role: 'Ogrenci',
      customAttributes: {
        parentPhone: parentPhone || '',
        target: target || 'YKS',
        grade: '12. Sınıf',
        performanceTrend: 'Yükselişte',
        nextCallDate: nextCallDate || new Date().toISOString().split('T')[0]
      }
    });

    this.renderOgretmen();
  }

  openAddLogModal(studentId, studentName) {
    const note = prompt(`${studentName} İçin Görüşme Notu / Ödev Durumu:`);
    if (!note) return;
    const hwStatus = prompt("Ödev Durumu? (1: Tam Yapıldı, 2: Kısmi/Eksik, 3: Yapılmadı)", "1");
    const hwStatusText = hwStatus === '2' ? 'Kısmi / Eksik' : hwStatus === '3' ? 'Yapılmadı' : 'Tam Yapıldı';
    const nextGoal = prompt("Öğrenciye Verilen Bir Sonraki Hedef / Ödev:");
    const nextCallDays = parseInt(prompt("Kaç gün sonra tekrar kontrol edilecek? (Örn: 3):", "3")) || 3;

    window.polymorphicStore.addRecord({
      moduleId: 'ogretmen',
      primitiveType: 'TIMELINE_EVENT',
      relatedContactId: studentId,
      title: note,
      startAt: Date.now(),
      endAt: Date.now() + (30 * 60 * 1000),
      allDay: false,
      customAttributes: {
        hwStatus: hwStatusText,
        nextGoal: nextGoal || '',
      }
    });

    // Öğrencinin bir sonraki arama tarihini güncelle
    const nextDate = new Date(Date.now() + (nextCallDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const student = window.polymorphicStore.getRecords('ogretmen', 'CONTACT').find(s => s.id === studentId);
    if (student) {
      window.polymorphicStore.updateRecord(studentId, {
        customAttributes: {
          ...student.customAttributes,
          nextCallDate: nextDate
        }
      });
    }

    this.renderOgretmen();
    this.openStudentDossier(studentId);
  }

  openAddExamModal(studentId, studentName) {
    const examName = prompt(`${studentName} İçin Deneme Adı (Örn: Özdebir TYT 3):`, "TYT Deneme");
    if (!examName) return;
    const net = parseFloat(prompt("Toplam Net (Örn: 85.5):", "85"));
    if (isNaN(net)) return;
    const details = prompt("Ders Detayları (Örn: Mat: 32, Fen: 18, Tr: 35):", "");

    window.polymorphicStore.addRecord({
      moduleId: 'ogretmen',
      primitiveType: 'ENTITY',
      primaryContactId: studentId,
      title: examName,
      category: 'DenemeSinavi',
      valuation: { amount: net },
      customAttributes: {
        subDetails: details || '',
        score: Math.round(net * 3.8 + 100)
      }
    });

    this.renderOgretmen();
    this.openStudentDossier(studentId);
  }

window.professionModules = new ProfessionModuleManager();
console.log('[ProfessionModules] ✅ Sektörel Hızlı Modüller Hazır.');
