/**
 * ProfessionModules — Sektörel / Mesleki Hızlı Yönetim Modülleri (Fast-Pads)
 * 
 * V2 Gelişmiş Eğitim Koçluğu & Özel Ders Paketi
 * + 5 Çekirdek Alan: Net Trend Eğrisi, Konu Matrisi, Soru Hedefi, Özel Ders Defteri, Veli WhatsApp Raporu
 * + Sıfır prompt() -> Glassmorphic Modal Form Motoru
 */

// ==========================================
// GLASSMORPHIC MODAL MOTORU (PROMPT YERİNE)
// ==========================================
class GlassModal {
  static open({ title, subtitle = '', fields = [], onSubmit, confirmText = 'Kaydet', confirmColor = 'bg-blue-600 hover:bg-blue-500' }) {
    const existing = document.getElementById('customGlassModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'customGlassModal';
    overlay.className = 'fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 transition-all opacity-0';

    overlay.innerHTML = `
      <div class="glass-card w-full max-w-lg rounded-3xl border border-slate-700/60 shadow-2xl p-6 relative overflow-hidden transform scale-95 transition-all">
        <button type="button" class="modal-close-btn absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div class="mb-5 pr-6">
          <h3 class="text-lg font-bold text-slate-100">${title}</h3>
          ${subtitle ? `<p class="text-xs text-slate-400 mt-1">${subtitle}</p>` : ''}
        </div>
        <form id="glassModalForm" class="space-y-4">
          <div class="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
            ${fields.map(f => this.renderField(f)).join('')}
          </div>
          <div class="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button type="button" id="modalCancelBtn" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">İptal</button>
            <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold text-white ${confirmColor} transition-all shadow-lg">${confirmText}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    if (window.lucide) window.lucide.createIcons();

    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.querySelector('.glass-card').classList.remove('scale-95');
    });

    const close = () => {
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.remove(), 200);
    };

    overlay.querySelector('.modal-close-btn').onclick = close;
    overlay.querySelector('#modalCancelBtn').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    const form = overlay.querySelector('#glassModalForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      if (onSubmit) onSubmit(values);
      close();
    };
  }

  static renderField(f) {
    const { name, label, type = 'text', placeholder = '', options = [], defaultValue = '' } = f;

    if (type === 'select') {
      return `
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">${label}</label>
          <select name="${name}" class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/60 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500">
            ${options.map(opt => `<option value="${opt.value}" ${opt.value === defaultValue ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>
      `;
    }

    return `
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">${label}</label>
        <input type="${type}" name="${name}" placeholder="${placeholder}" value="${defaultValue}" 
               class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/60 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500" required>
      </div>
    `;
  }
}


class ProfessionModuleManager {
  constructor() {
    this.activeDossierTab = 'overview'; // overview, topics, ledger, reports
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
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-3xl border space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <i data-lucide="book-marked" class="w-4 h-4 text-emerald-400"></i>
              Müşteri Veresiye Listesi
            </h3>
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
                  <button onclick="window.professionModules.openVeresiyeModal('${c.id}', '${escapeHtml(c.displayName)}')" 
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
  // 2. NÖBET & VARDİYA (DOKTOR & GÜVENLİK)
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
            <p class="text-xs text-slate-400">Aylık nöbetlerinizi, icapları ve vardiyaları tek tıkla mühürleyin.</p>
          </div>
          <button onclick="window.professionModules.openNobetAddModal()" 
                  class="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i> Nöbet / Vardiya Ekle
          </button>
        </div>

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
  // 4. İLAN PORTFÖYÜ (EMLAKÇI)
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
                <p>👤 <b>Mülk Sahibi:</b> ${item.customAttributes?.ownerName || 'Bilinmiyor'}</p>
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
  // 5. GELİŞMİŞ EĞİTİM KOÇLUĞU & ÖZEL DERS SUITE (ÖĞRETMEN)
  // ==========================================
  renderOgretmen() {
    const container = document.getElementById('tab-ogretmen');
    if (!container) return;

    const students = window.polymorphicStore.getRecords('ogretmen', 'CONTACT');
    const logs = window.polymorphicStore.getRecords('ogretmen', 'TIMELINE_EVENT');
    const exams = window.polymorphicStore.getRecords('ogretmen', 'ENTITY').filter(e => e.category === 'DenemeSinavi');
    const topics = window.polymorphicStore.getRecords('ogretmen', 'ENTITY').filter(e => e.category === 'MufredatKonu');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCalls = students.filter(s => s.customAttributes?.nextCallDate === todayStr);

    // Toplam Soru ve İlerleme
    const totalWeeklyTarget = students.reduce((sum, s) => sum + (parseInt(s.customAttributes?.weeklyTarget) || 1200), 0);
    const totalWeeklySolved = students.reduce((sum, s) => sum + (parseInt(s.customAttributes?.weeklySolved) || 950), 0);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Üst Başlık ve Hızlı Ekle -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-400"></i>
              Eğitim Koçluğu & Özel Ders Portalı
            </h2>
            <p class="text-xs text-slate-400">Öğrenci takip dosyaları, günlük arama/ödev kontrolü, deneme net eğrileri ve veli raporları.</p>
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
            <p class="text-xs font-semibold text-slate-400 mb-1">Haftalık Soru Temposu</p>
            <h2 class="text-2xl font-bold font-mono text-emerald-400">${totalWeeklySolved.toLocaleString('tr-TR')} / ${totalWeeklyTarget.toLocaleString('tr-TR')}</h2>
            <p class="text-[11px] text-slate-500 mt-1">%${totalWeeklyTarget > 0 ? Math.round((totalWeeklySolved/totalWeeklyTarget)*100) : 0} Haftalık Başarı</p>
          </div>

          <div class="glass-card p-5 rounded-3xl border">
            <p class="text-xs font-semibold text-slate-400 mb-1">Girilen Denemeler</p>
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
              Öğrenci Koçluk Dosyaları
            </h3>
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

              const target = parseInt(s.customAttributes?.weeklyTarget) || 1200;
              const solved = parseInt(s.customAttributes?.weeklySolved) || 950;
              const pct = Math.min(100, Math.round((solved / target) * 100));

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
                        <p class="text-xs text-slate-400 font-mono">${s.customAttributes?.grade || '12. Sınıf'} • ${s.customAttributes?.target || 'YKS Sayısal'}</p>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                      🔥 Yükselişte
                    </span>
                  </div>

                  <!-- Soru İlerleme Çubuğu -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] text-slate-400">
                      <span>Haftalık Soru: <b>${solved}/${target}</b></span>
                      <span class="font-mono font-bold text-blue-400">%${pct}</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style="width: ${pct}%"></div>
                    </div>
                  </div>

                  <!-- Mini Bilgi Çubuğu -->
                  <div class="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                    <div>
                      <p class="text-slate-500">Son Deneme Neti</p>
                      <p class="font-mono font-bold text-slate-200">${lastExam ? `${lastExam.valuation?.amount || 0} Net` : 'Henüz Girilmedi'}</p>
                    </div>
                    <div>
                      <p class="text-slate-500">Kalan Özel Ders</p>
                      <p class="font-mono font-bold text-amber-400">${s.customAttributes?.remainingLessons || '6'} / ${s.customAttributes?.packageLessons || '10'} Saat</p>
                    </div>
                  </div>

                  <div class="flex justify-between items-center pt-1 text-xs">
                    <span class="text-blue-400 font-semibold flex items-center gap-1 group-hover:underline">
                      360° Dosyayı İncele <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                    </span>
                    <span class="text-slate-500 text-[11px] font-mono">${sLogs.length} Görüşme</span>
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
  // 360° ÖĞRENCİ KOÇLUK DOSYASI (DOSSIER)
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
      .sort((a,b) => a.createdAt - b.createdAt); // Kronolojik

    const container = document.getElementById('studentDossierContent');
    if (!container) return;

    // SVG Net Trend Grafiği Hesaplama
    const svgChartHtml = this.generateSvgNetChart(exams);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Başlık Bilgisi & Hızlı Butonlar -->
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

          <div class="flex flex-wrap gap-2">
            <button onclick="window.professionModules.generateWhatsAppReport('${student.id}')" 
                    class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <i data-lucide="share-2" class="w-3.5 h-3.5"></i> Veli Raporu (WhatsApp)
            </button>
            <button onclick="window.professionModules.openAddLogModal('${student.id}', '${escapeHtml(student.displayName)}')" 
                    class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Görüşme Notu
            </button>
            <button onclick="window.professionModules.openAddExamModal('${student.id}', '${escapeHtml(student.displayName)}')" 
                    class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Net Gir
            </button>
          </div>
        </div>

        <!-- Görsel Deneme Net İlerleme Eğrisi (SVG) -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div class="flex justify-between items-center">
            <h4 class="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="trending-up" class="w-4 h-4"></i>
              Deneme Net Gelişim Trendi (Kronolojik)
            </h4>
            <span class="text-xs text-slate-400 font-mono">${exams.length} Deneme Kaydı</span>
          </div>
          ${svgChartHtml}
        </div>

        <!-- 2 Sütun: Görüşme Günlüğü & Özel Ders Paket Defteri -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Sol Sütun: Görüşme Kayıtları -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-blue-400"></i>
              Görüşme ve Kontrol Notları (${logs.length})
            </h4>

            <div class="space-y-2.5 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar">
              ${logs.length === 0 ? '<p class="text-xs text-slate-500 py-6 text-center">Henüz görüşme notu eklenmemiş.</p>' : ''}
              ${logs.map(l => `
                <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-200 font-mono">${new Date(l.startAt).toLocaleDateString('tr-TR')}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded font-semibold ${
                      l.customAttributes?.hwStatus === 'Tam Yapıldı' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }">
                      Ödev: ${l.customAttributes?.hwStatus || 'Kontrol Edildi'}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(l.title)}</p>
                  ${l.customAttributes?.nextGoal ? `
                    <div class="text-[11px] text-blue-300 bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
                      🎯 <b>Hedef:</b> ${escapeHtml(l.customAttributes.nextGoal)}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sağ Sütun: Özel Ders Paketi & Finans Defteri -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="credit-card" class="w-4 h-4 text-emerald-400"></i>
              Özel Ders Paketi & Ödeme Takibi
            </h4>

            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span class="text-slate-400 block text-[10px]">Toplam Paket</span>
                  <strong class="text-slate-100 font-mono text-sm">${student.customAttributes?.packageLessons || 10} Saat</strong>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span class="text-slate-400 block text-[10px]">Yapılan Ders</span>
                  <strong class="text-emerald-400 font-mono text-sm">${student.customAttributes?.completedLessons || 4} Saat</strong>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span class="text-slate-400 block text-[10px]">Kalan Ders</span>
                  <strong class="text-amber-400 font-mono text-sm">${student.customAttributes?.remainingLessons || 6} Saat</strong>
                </div>
              </div>

              <!-- Ders Hapları -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${Array.from({ length: parseInt(student.customAttributes?.packageLessons) || 10 }).map((_, i) => {
                  const isDone = i < (parseInt(student.customAttributes?.completedLessons) || 4);
                  return `
                    <div class="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${
                      isDone ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'
                    }">
                      ${isDone ? '✓' : i + 1}
                    </div>
                  `;
                }).join('')}
              </div>

              <div class="pt-2 flex justify-between items-center text-slate-300 border-t border-slate-800">
                <span>Saatlik Ders Ücreti: <b>${student.customAttributes?.hourlyRate || '1.000'} ₺</b></span>
                <button onclick="window.professionModules.logLessonCompleted('${student.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
                  + 1 Ders Tamamla
                </button>
              </div>
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

  // --- DİNAMİK SVG NET TREND GRAFİĞİ MOTORU ---
  generateSvgNetChart(exams) {
    if (!exams || exams.length < 2) {
      return '<div class="py-8 text-center text-slate-500 text-xs">Gelişim eğrisini görmek için en az 2 deneme neti giriniz.</div>';
    }

    const width = 640;
    const height = 160;
    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const nets = exams.map(e => e.valuation?.amount || 0);
    const minNet = Math.max(0, Math.floor(Math.min(...nets) - 5));
    const maxNet = Math.ceil(Math.max(...nets) + 5);

    const points = exams.map((d, i) => {
      const x = padding.left + (i / (exams.length - 1)) * chartW;
      const y = padding.top + chartH - (((d.valuation?.amount || 0) - minNet) / (maxNet - minNet || 1)) * chartH;
      return { x, y, net: d.valuation?.amount || 0, title: d.title, date: new Date(d.createdAt).toLocaleDateString('tr-TR', {day:'numeric', month:'short'}) };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx = (p1.x + p2.x) / 2;
      pathD += ` C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    }

    const areaPathD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;
    const lastNet = nets[nets.length - 1];
    const firstNet = nets[0];
    const diff = (lastNet - firstNet).toFixed(1);

    return `
      <div class="relative overflow-x-auto">
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto">
          <defs>
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a855f7" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#a855f7" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          
          <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
          <line x1="${padding.left}" y1="${padding.top + chartH/2}" x2="${width - padding.right}" y2="${padding.top + chartH/2}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
          <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="rgba(255,255,255,0.1)"/>

          <path d="${areaPathD}" fill="url(#netGrad)"/>
          <path d="${pathD}" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round"/>

          ${points.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ec4899" stroke="#ffffff" stroke-width="1.5"/>
            <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" fill="#f3e8ff" font-size="10" font-weight="bold">${p.net}</text>
            <text x="${p.x}" y="${padding.top + chartH + 18}" text-anchor="middle" fill="#94a3b8" font-size="9">${p.date}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  // --- 1-CLICK WHATSAPP VELİ RAPORU OLUŞTURUCU ---
  generateWhatsAppReport(studentId) {
    const student = window.polymorphicStore.getRecords('ogretmen', 'CONTACT').find(s => s.id === studentId);
    if (!student) return;

    const exams = window.polymorphicStore.getRecords('ogretmen', 'ENTITY')
      .filter(e => e.primaryContactId === studentId && e.category === 'DenemeSinavi');
    const logs = window.polymorphicStore.getRecords('ogretmen', 'TIMELINE_EVENT')
      .filter(l => l.relatedContactId === studentId);

    const lastExam = exams[exams.length - 1];
    const lastLog = logs[0];

    const report = 
`🎓 *HAFTALIK EĞİTİM & KOÇLUK BİLGİLENDİRME RAPORU*
━━━━━━━━━━━━━━━━━━━━
👤 *Öğrenci:* ${student.displayName}
🎯 *Hedef:* ${student.customAttributes?.target || 'YKS / LGS'}

📊 *1. SORU HEDEFİ & TEMPO:*
• Haftalık Hedef: ${student.customAttributes?.weeklyTarget || 1200} Soru
• Çözülen: *${student.customAttributes?.weeklySolved || 950} Soru*

📈 *2. DENEME & NET DURUMU:*
• Son Deneme: *${lastExam ? `${lastExam.title} - ${lastExam.valuation?.amount} Net` : 'Girilmedi'}*

📝 *3. ÖDEV & ÇALIŞMA DURUMU:*
• Ödev Kontrolü: *${lastLog?.customAttributes?.hwStatus || 'Tam Yapıldı'}*
• Son Görüşme Notu: "${lastLog ? lastLog.title : 'Düzenli takip sürüyor.'}"

━━━━━━━━━━━━━━━━━━━━
İyi haftalar dilerim! ✨`;

    navigator.clipboard.writeText(report).then(() => {
      alert("✅ Veli Raporu panoya kopyalandı! WhatsApp'a doğrudan yapıştırıp gönderebilirsiniz.");
      const waUrl = student.customAttributes?.parentPhone 
        ? `https://wa.me/90${student.customAttributes.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(report)}`
        : `https://wa.me/?text=${encodeURIComponent(report)}`;
      window.open(waUrl, '_blank');
    }).catch(() => {
      alert(report);
    });
  }

  logLessonCompleted(studentId) {
    const student = window.polymorphicStore.getRecords('ogretmen', 'CONTACT').find(s => s.id === studentId);
    if (!student) return;

    const currentCompleted = parseInt(student.customAttributes?.completedLessons) || 4;
    const totalPkg = parseInt(student.customAttributes?.packageLessons) || 10;

    if (currentCompleted >= totalPkg) {
      alert("Paket ders saati dolmuştur. Lütfen yeni paket tanımlayınız.");
      return;
    }

    const nextCompleted = currentCompleted + 1;
    const nextRemaining = totalPkg - nextCompleted;

    window.polymorphicStore.updateRecord(studentId, {
      customAttributes: {
        ...student.customAttributes,
        completedLessons: nextCompleted,
        remainingLessons: nextRemaining
      }
    });

    this.openStudentDossier(studentId);
    this.renderOgretmen();
  }

  closeStudentDossier() {
    const modal = document.getElementById('studentDossierModal');
    if (modal) modal.classList.add('hidden');
  }

  // --- YENİ MODAL FORMLARI (PROMPT YERİNE GLASS MODAL) ---

  openAddStudentModal() {
    GlassModal.open({
      title: '🎓 Yeni Öğrenci Ekle',
      subtitle: 'Koçluk veya özel ders öğrencisi kayıt kartı',
      confirmText: 'Öğrenciyi Kaydet',
      fields: [
        { name: 'displayName', label: 'Öğrenci Adı Soyadı', placeholder: 'Örn: Şevval Çelik' },
        { name: 'phone', label: 'Öğrenci Telefonu', placeholder: '05xx xxx xx xx' },
        { name: 'parentPhone', label: 'Veli Telefonu', placeholder: '05xx xxx xx xx' },
        { name: 'target', label: 'Hedef Sınav / Bölüm', placeholder: 'Örn: YKS Sayısal / Tıp Fakültesi' },
        { name: 'packageLessons', label: 'Özel Ders Paket Saati', type: 'number', placeholder: '10', defaultValue: '10' },
        { name: 'hourlyRate', label: 'Saatlik Ders Ücreti (₺)', type: 'number', placeholder: '1000', defaultValue: '1000' }
      ],
      onSubmit: (values) => {
        window.polymorphicStore.addRecord({
          moduleId: 'ogretmen',
          primitiveType: 'CONTACT',
          displayName: values.displayName,
          phone: values.phone,
          role: 'Ogrenci',
          customAttributes: {
            parentPhone: values.parentPhone,
            target: values.target,
            grade: '12. Sınıf',
            packageLessons: parseInt(values.packageLessons) || 10,
            completedLessons: 0,
            remainingLessons: parseInt(values.packageLessons) || 10,
            hourlyRate: values.hourlyRate || '1000',
            weeklyTarget: 1500,
            weeklySolved: 1200,
            nextCallDate: new Date().toISOString().split('T')[0]
          }
        });
        this.renderOgretmen();
      }
    });
  }

  openAddLogModal(studentId, studentName) {
    GlassModal.open({
      title: `📞 Görüşme & Kontrol Notu (${studentName})`,
      subtitle: 'Günlük çalışma kontrolü ve verilen hedefler',
      confirmText: 'Görüşmeyi Kaydet',
      fields: [
        { name: 'title', label: 'Görüşme Değerlendirme Notu', placeholder: 'Örn: Matematik türev soruları kontrol edildi, zaman yönetimi iyi.' },
        { 
          name: 'hwStatus', 
          label: 'Ödev / Çalışma Durumu', 
          type: 'select',
          options: [
            { value: 'Tam Yapıldı', label: '✅ Tam Yapıldı (Eksiksiz)' },
            { value: 'Kısmi / Eksik', label: '⚠️ Kısmi / Eksik Yapıldı' },
            { value: 'Yapılmadı', label: '❌ Yapılmadı' }
          ]
        },
        { name: 'nextGoal', label: 'Öğrenciye Verilen Bir Sonraki Hedef', placeholder: 'Örn: 200 Soru İntegral + 1 Deneme' },
        { name: 'nextCallDays', label: 'Kaç Gün Sonra Tekrar Kontrol Edilecek?', type: 'number', placeholder: '3', defaultValue: '3' }
      ],
      onSubmit: (values) => {
        window.polymorphicStore.addRecord({
          moduleId: 'ogretmen',
          primitiveType: 'TIMELINE_EVENT',
          relatedContactId: studentId,
          title: values.title,
          startAt: Date.now(),
          endAt: Date.now() + (30 * 60 * 1000),
          allDay: false,
          customAttributes: {
            hwStatus: values.hwStatus,
            nextGoal: values.nextGoal
          }
        });

        const nextDays = parseInt(values.nextCallDays) || 3;
        const nextDate = new Date(Date.now() + (nextDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
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
    });
  }

  openAddExamModal(studentId, studentName) {
    GlassModal.open({
      title: `📈 Deneme Sınavı Neti Ekle (${studentName})`,
      subtitle: 'Öğrencinin son deneme net ve sıralama sonuçları',
      confirmText: 'Neti Kaydet',
      confirmColor: 'bg-purple-600 hover:bg-purple-500',
      fields: [
        { name: 'title', label: 'Deneme Adı / Yayın', placeholder: 'Örn: Özdebir TYT Deneme-4' },
        { name: 'net', label: 'Toplam Net', type: 'number', placeholder: 'Örn: 85.5' },
        { name: 'subDetails', label: 'Ders Dağılımı', placeholder: 'Örn: Mat: 32.5, Fen: 18, Tr: 35' }
      ],
      onSubmit: (values) => {
        const netVal = parseFloat(values.net) || 0;
        window.polymorphicStore.addRecord({
          moduleId: 'ogretmen',
          primitiveType: 'ENTITY',
          primaryContactId: studentId,
          title: values.title,
          category: 'DenemeSinavi',
          valuation: { amount: netVal },
          customAttributes: {
            subDetails: values.subDetails
          }
        });

        this.renderOgretmen();
        this.openStudentDossier(studentId);
      }
    });
  }

  openVeresiyeModal(preContactId = '', preName = '') {
    GlassModal.open({
      title: '🛒 Veresiye / Tahsilat Kaydı',
      subtitle: 'Hızlı müşteri borç ve ödeme defteri',
      confirmText: 'İşlemi Kaydet',
      confirmColor: 'bg-emerald-600 hover:bg-emerald-500',
      fields: [
        { name: 'displayName', label: 'Müşteri Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', defaultValue: preName },
        { name: 'amount', label: 'İşlem Tutarı (₺)', type: 'number', placeholder: '150' },
        { 
          name: 'flow', 
          label: 'İşlem Türü', 
          type: 'select',
          options: [
            { value: 'outflow', label: '🔴 Borç Verildi (Veresiye Yaz)' },
            { value: 'inflow', label: '🟢 Tahsilat Alındı (Borçtan Düş)' }
          ]
        }
      ],
      onSubmit: (values) => {
        let contact = window.polymorphicStore.getRecords('veresiye', 'CONTACT').find(c => c.displayName.toLowerCase() === values.displayName.toLowerCase());
        if (!contact) {
          contact = window.polymorphicStore.addRecord({
            moduleId: 'veresiye',
            primitiveType: 'CONTACT',
            displayName: values.displayName,
            role: 'Musteri',
            initialBalance: 0
          });
        }

        window.polymorphicStore.addRecord({
          moduleId: 'veresiye',
          primitiveType: 'TRANSACTION',
          relatedContactId: contact.id,
          flow: values.flow,
          amount: parseFloat(values.amount) || 0,
          category: 'Veresiye',
          occurredAt: Date.now()
        });

        this.renderVeresiye();
      }
    });
  }

  openNobetAddModal() {
    GlassModal.open({
      title: '📅 Nöbet & Vardiya Ekle',
      subtitle: '24 saatlik nöbet veya icap görevi mühürleme',
      confirmText: 'Nöbeti Kaydet',
      confirmColor: 'bg-cyan-600 hover:bg-cyan-500',
      fields: [
        { name: 'title', label: 'Nöbet / Görev Başlığı', placeholder: 'Örn: Acil Servis 24s Nöbeti', defaultValue: 'Acil Servis Nöbeti' },
        { name: 'date', label: 'Nöbet Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
        { 
          name: 'shiftType', 
          label: 'Nöbet / Vardiya Türü', 
          type: 'select',
          options: [
            { value: '24 Saat Nöbet', label: '24 Saat Tam Nöbet' },
            { value: '12 Saat Gece', label: '12 Saat Gece Vardiyası' },
            { value: '12 Saat Gündüz', label: '12 Saat Gündüz Vardiyası' },
            { value: 'İcap Nöbeti', label: 'İcap (Evde Çağrı Nöbeti)' }
          ]
        },
        { name: 'location', label: 'Birim / Hastane / Karakol', placeholder: 'Örn: Şehir Hastanesi Acil' }
      ],
      onSubmit: (values) => {
        window.polymorphicStore.addRecord({
          moduleId: 'nobet',
          primitiveType: 'TIMELINE_EVENT',
          title: values.title,
          startAt: new Date(values.date).getTime(),
          endAt: new Date(values.date).getTime() + (24 * 60 * 60 * 1000),
          allDay: true,
          location: values.location,
          customAttributes: { shiftType: values.shiftType }
        });
        this.renderNobet();
      }
    });
  }

  openDurusmaModal() {
    GlassModal.open({
      title: '⚖️ Duruşma Kaydı',
      subtitle: 'Mahkeme saati ve dosya bilgisi',
      confirmText: 'Duruşmayı Kaydet',
      confirmColor: 'bg-purple-600 hover:bg-purple-500',
      fields: [
        { name: 'title', label: 'Mahkeme & Dosya Esas No', placeholder: 'Örn: 4. Asliye Hukuk 2024/182 E.' },
        { name: 'date', label: 'Duruşma Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
        { name: 'location', label: 'Mahkeme Salonu / Adliye', placeholder: 'Örn: Çağlayan Adliyesi C Blok Salon 12' }
      ],
      onSubmit: (values) => {
        window.polymorphicStore.addRecord({
          moduleId: 'durusma',
          primitiveType: 'TIMELINE_EVENT',
          title: values.title,
          startAt: new Date(values.date + 'T10:00:00').getTime(),
          endAt: new Date(values.date + 'T11:00:00').getTime(),
          allDay: false,
          location: values.location
        });
        this.renderDurusma();
      }
    });
  }

  openSureModal() {
    GlassModal.open({
      title: '⚠️ Kesin İtiraz / Süre Sayacı',
      subtitle: 'Hak düşürücü süre alarmı ve geri sayım',
      confirmText: 'Süreyi Başlat',
      confirmColor: 'bg-rose-600 hover:bg-rose-500',
      fields: [
        { name: 'title', label: 'Süre Konusu', placeholder: 'Örn: İstinaf Başvuru Son Günü' },
        { name: 'days', label: 'Kaç Gün Sonra Doluyor?', type: 'number', placeholder: '7', defaultValue: '7' }
      ],
      onSubmit: (values) => {
        const d = parseInt(values.days) || 7;
        window.polymorphicStore.addRecord({
          moduleId: 'durusma',
          primitiveType: 'COMPLIANCE_EXPIRY',
          title: values.title,
          deadlineAt: Date.now() + (d * 24 * 60 * 60 * 1000),
          severity: 'critical',
          isResolved: false
        });
        this.renderDurusma();
      }
    });
  }

  openEmlakModal() {
    GlassModal.open({
      title: '🏠 Gayrimenkul Mülk Kaydı',
      subtitle: 'Satılık / Kiralık ilan portföyü',
      confirmText: 'Mülkü Kaydet',
      confirmColor: 'bg-amber-600 hover:bg-amber-500',
      fields: [
        { name: 'title', label: 'Mülk Özeti & Konum', placeholder: 'Örn: Kadıköy Moda 3+1 Daire' },
        { name: 'price', label: 'Fiyat (₺)', type: 'number', placeholder: '5000000' },
        { name: 'ownerName', label: 'Mülk Sahibi Adı & Tel', placeholder: 'Örn: Mehmet Bey 0532...' },
        { name: 'keyStatus', label: 'Anahtar Durumu', placeholder: 'Örn: Ofiste / Mal Sahibinde', defaultValue: 'Ofiste' }
      ],
      onSubmit: (values) => {
        window.polymorphicStore.addRecord({
          moduleId: 'emlak',
          primitiveType: 'ENTITY',
          title: values.title,
          category: 'Satılık Daire',
          valuation: { amount: parseFloat(values.price) || 0 },
          customAttributes: { ownerName: values.ownerName, keyStatus: values.keyStatus }
        });
        this.renderEmlak();
      }
    });
  }

  deleteNobet(id) {
    if (confirm("Bu nöbet kaydını silmek istediğinize emin misiniz?")) {
      window.polymorphicStore.deleteRecord(id);
      this.renderNobet();
    }
  }
}

window.professionModules = new ProfessionModuleManager();
console.log('[ProfessionModules] ✅ V2 Gelişmiş Eğitim Koçluğu & Glassmorphic Modal Sistemi Hazır.');
