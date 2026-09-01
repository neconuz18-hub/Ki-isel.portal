/**
 * AdminManager - Yonetim Merkezi (admin.js)
 */

class AdminManager {
  constructor() {
    this.activeAdminTab = 'modules';
  }

  switchAdminTab(tab) {
    this.activeAdminTab = tab;
    this.render();
  }

  render() {
    const container = document.getElementById('tab-admin');
    if (!container) return;

    const currentProfile = window.moduleRegistry?.profileManager?.loadProfile();
    const currentPresetId = currentProfile?.presetId || 'bireysel_zen';
    const allPresets = window.moduleRegistry?.PRESETS || {};
    const allModules = window.moduleRegistry?.ALL_MODULES || {};
    const enabledModules = window.moduleRegistry?.profileManager?.enabledModules || [];
    const totalRecords = window.polymorphicStore?.records?.length || 0;

    let storageBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const storageKb = (storageBytes / 1024).toFixed(1);
    const activeTab = this.activeAdminTab;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/50 border border-purple-500/30 shadow-xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
              <i data-lucide="settings" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-slate-100">Y&ouml;netim Merkezi</h2>
                <span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">ADMIN</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Mod&uuml;l atamalarini yapin, profil ayarlayin, test verileri y&uuml;kleyin.</p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs">
            <div class="text-center px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span class="block text-lg font-mono font-bold text-blue-400">${enabledModules.length}</span>
              <span class="text-slate-500">Aktif</span>
            </div>
            <div class="text-center px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span class="block text-lg font-mono font-bold text-cyan-400">${totalRecords}</span>
              <span class="text-slate-500">Kayit</span>
            </div>
            <div class="text-center px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span class="block text-lg font-mono font-bold text-amber-400">${storageKb} KB</span>
              <span class="text-slate-500">Bellek</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button onclick="window.adminManager.switchAdminTab('modules')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'modules' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="layout-grid" class="w-3.5 h-3.5"></i> Mod&uuml;l Y&ouml;netimi</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('profile')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="users" class="w-3.5 h-3.5"></i> Profil &amp; Rol</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('seeds')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'seeds' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="database" class="w-3.5 h-3.5"></i> Test Verileri</span>
          </button>
          <button onclick="window.adminManager.switchAdminTab('backup')" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'backup' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}">
            <span class="flex items-center gap-1.5"><i data-lucide="hard-drive-download" class="w-3.5 h-3.5"></i> Yedekleme</span>
          </button>
        </div>

        ${activeTab === 'modules' ? this.renderModulesTab(allModules, enabledModules) : ''}
        ${activeTab === 'profile' ? this.renderProfileTab(allPresets, currentPresetId) : ''}
        ${activeTab === 'seeds' ? this.renderSeedsTab() : ''}
        ${activeTab === 'backup' ? this.renderBackupTab() : ''}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  renderModulesTab(allModules, enabledModules) {
    const cards = Object.values(allModules).filter(m => m.id !== 'dashboard').map(mod => {
      const on = enabledModules.includes(mod.id);
      return `
        <div class="flex items-center justify-between p-4 rounded-2xl border transition-all ${on ? 'bg-blue-950/30 border-blue-500/40' : 'bg-slate-900/40 border-slate-800'}">
          <div class="flex items-center gap-3 min-w-0">
            <div class="p-2.5 rounded-xl ${on ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
              <i data-lucide="${mod.icon || 'circle'}" class="w-5 h-5"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold ${on ? 'text-blue-200' : 'text-slate-300'} truncate">${escapeHtml(mod.label)}</h4>
              <p class="text-[11px] ${on ? 'text-blue-400/60' : 'text-slate-500'} truncate">${mod.desc || mod.category || ''}</p>
            </div>
          </div>
          <button onclick="window.adminManager.toggleModuleAdmin('${mod.id}')" class="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${on ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'}">
            ${on ? 'Kaldir' : 'Ekle'}
          </button>
        </div>`;
    }).join('');

    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="layout-grid" class="w-4 h-4 text-blue-400"></i> Kullaniciya Atanacak Mod&uuml;ller
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Kullanici girisinde sadece asagida <strong>aktif</strong> olan mod&uuml;ller g&ouml;r&uuml;necektir.</p>
          </div>
          <span class="px-3 py-1 rounded-xl bg-blue-600/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/30">${enabledModules.length} aktif</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${cards}</div>
      </div>`;
  }

  renderProfileTab(allPresets, currentPresetId) {
    const cards = Object.values(allPresets).map(p => {
      const cur = (p.id === currentPresetId);
      return `
        <div onclick="window.adminManager.switchRole('${p.id}')" class="cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3 group ${cur ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/50' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}">
          <div class="p-2.5 rounded-xl ${cur ? 'bg-purple-600/30 text-purple-300' : 'bg-slate-800 text-slate-400'} border border-slate-700">
            <i data-lucide="${p.icon || 'circle'}" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-slate-100 truncate">${p.title}</h4>
            <span class="text-[10px] ${cur ? 'text-purple-400 font-bold' : 'text-slate-500'}">${cur ? 'Aktif Profil' : 'Gecis yap'}</span>
          </div>
          ${cur ? '<span class="w-3 h-3 rounded-full bg-purple-400 animate-pulse flex-shrink-0"></span>' : ''}
        </div>`;
    }).join('');

    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="users" class="w-4 h-4 text-purple-400"></i> Meslek Profili &amp; Rol Secimi
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Bir profil sectiginizde, o meslege ait varsayilan mod&uuml;ller otomatik y&uuml;klenir.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">${cards}</div>
        <div class="pt-3 border-t border-slate-800/60">
          <button onclick="window.onboardingManager?.open()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Kurulum Sihirbazini Yeniden Baslat
          </button>
        </div>
      </div>`;
  }

  renderSeedsTab() {
    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="database" class="w-4 h-4 text-cyan-400"></i> Test Verisi Fabrikasi
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Tek tikla zengin test verileri y&uuml;kleyerek mod&uuml;lleri deneyimleyin.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button onclick="window.adminManager.seedEsnafData()" class="p-4 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-emerald-400 flex items-center gap-2"><i data-lucide="shopping-cart" class="w-4 h-4"></i> Bakkal / Esnaf</h4>
            <p class="text-[11px] text-slate-400 mt-1">3 veresiye m&uuml;sterisi ve &ouml;deme kayitlari</p>
          </button>
          <button onclick="window.adminManager.seedDoctorData()" class="p-4 rounded-2xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-cyan-400 flex items-center gap-2"><i data-lucide="stethoscope" class="w-4 h-4"></i> Doktor / Saglikci</h4>
            <p class="text-[11px] text-slate-400 mt-1">3 n&ouml;bet ve 1 icap kaydi</p>
          </button>
          <button onclick="window.adminManager.seedCoachData()" class="p-4 rounded-2xl bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-blue-400 flex items-center gap-2"><i data-lucide="graduation-cap" class="w-4 h-4"></i> Kocluk &amp; &Ouml;zel Ders</h4>
            <p class="text-[11px] text-slate-400 mt-1">&Ouml;grenci, 5 deneme neti ve g&ouml;r&uuml;sme notu</p>
          </button>
          <button onclick="window.adminManager.seedLawyerData()" class="p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-purple-400 flex items-center gap-2"><i data-lucide="scale" class="w-4 h-4"></i> Avukat / Dava</h4>
            <p class="text-[11px] text-slate-400 mt-1">2 durusma, 1 istinaf s&uuml;re sayaci</p>
          </button>
          <button onclick="window.adminManager.seedRealEstateData()" class="p-4 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-amber-400 flex items-center gap-2"><i data-lucide="building-2" class="w-4 h-4"></i> Emlakci Portf&ouml;y</h4>
            <p class="text-[11px] text-slate-400 mt-1">3 satilik/kiralik daire kaydi</p>
          </button>
          <button onclick="window.adminManager.clearAllData()" class="p-4 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-left transition-all cursor-pointer">
            <h4 class="text-xs font-bold text-rose-400 flex items-center gap-2"><i data-lucide="trash-2" class="w-4 h-4"></i> T&uuml;m Verileri Temizle</h4>
            <p class="text-[11px] text-slate-400 mt-1">Veritabanini sifirlar</p>
          </button>
        </div>
      </div>`;
  }

  renderBackupTab() {
    return `
      <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="hard-drive-download" class="w-4 h-4 text-emerald-400"></i> Veri Yedekleme &amp; Geri Y&uuml;kleme
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">T&uuml;m portal verilerini tek tikla bilgisayariniza indirin veya yedegi geri y&uuml;kleyin.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.adminManager.exportData()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
            <i data-lucide="download" class="w-4 h-4"></i> JSON Yedegi Indir
          </button>
          <label class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="upload" class="w-4 h-4"></i> Yedegi Geri Y&uuml;kle
            <input type="file" accept=".json" onchange="window.adminManager.importData(event)" class="hidden">
          </label>
        </div>
      </div>`;
  }

  toggleModuleAdmin(modId) {
    window.moduleRegistry.profileManager.toggleModule(modId);
    this.render();
  }

  switchRole(presetId) {
    window.moduleRegistry.profileManager.setPreset(presetId);
    if (window.soundManager && window.soundManager.playClick) window.soundManager.playClick();
    if (window.menuManager) window.menuManager.refreshByProfile();
    this.render();
  }

  seedEsnafData() {
    const store = window.polymorphicStore;
    const c1 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Ahmet Yilmaz (Terzi)', phone: '0532 111 22 33', role: 'Musteri', initialBalance: 0 });
    const c2 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Mehmet Demir (Taksici)', phone: '0544 222 33 44', role: 'Musteri', initialBalance: 0 });
    const c3 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Ayse Teyze (No: 12)', phone: '0555 333 44 55', role: 'Musteri', initialBalance: 0 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c1.id, flow: 'outflow', amount: 450, category: 'Veresiye', occurredAt: Date.now() - 86400000 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c2.id, flow: 'outflow', amount: 1200, category: 'Veresiye', occurredAt: Date.now() - 172800000 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c3.id, flow: 'outflow', amount: 280, category: 'Veresiye', occurredAt: Date.now() });
    if (window.app && window.app.showToast) window.app.showToast('Bakkal test verileri yuklendi', 'success');
    this.render();
  }

  seedDoctorData() {
    const store = window.polymorphicStore;
    const today = new Date();
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
    const d3 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11);
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Acil Servis 24s Nobeti', startAt: d1.getTime(), endAt: d1.getTime() + 86400000, allDay: true, location: 'Sehir Hastanesi Acil', customAttributes: { shiftType: '24 Saat Nobet' } });
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Dahiliye Icap Gorevi', startAt: d2.getTime(), endAt: d2.getTime() + 86400000, allDay: true, location: 'Evde Cagri', customAttributes: { shiftType: 'Icap Nobeti' } });
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Yogun Bakim 24s Nobeti', startAt: d3.getTime(), endAt: d3.getTime() + 86400000, allDay: true, location: 'Genel Yogun Bakim B Blok', customAttributes: { shiftType: '24 Saat Nobet' } });
    if (window.app && window.app.showToast) window.app.showToast('Doktor nobet verileri yuklendi', 'success');
    this.render();
  }

  seedCoachData() {
    const store = window.polymorphicStore;
    const s1 = store.addRecord({ moduleId: 'ogretmen', primitiveType: 'CONTACT', displayName: 'Sevval Celik', phone: '0533 999 88 77', role: 'Ogrenci', customAttributes: { parentPhone: '0532 888 77 66', target: 'YKS Sayisal / Tip', grade: '12. Sinif', packageLessons: 10, completedLessons: 6, remainingLessons: 4, hourlyRate: '1500', weeklyTarget: 1500, weeklySolved: 1240, nextCallDate: new Date().toISOString().split('T')[0] } });
    const now = Date.now();
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Ozdebir TYT-1', category: 'DenemeSinavi', valuation: { amount: 68.5 }, createdAt: now - (20 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'TODER TYT-2', category: 'DenemeSinavi', valuation: { amount: 73.0 }, createdAt: now - (15 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: '3D Simulasyon TYT-3', category: 'DenemeSinavi', valuation: { amount: 79.25 }, createdAt: now - (10 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Bilgi Sarmal TYT-4', category: 'DenemeSinavi', valuation: { amount: 84.5 }, createdAt: now - (5 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Ozdebir Genel TYT-5', category: 'DenemeSinavi', valuation: { amount: 89.0 }, createdAt: now });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'TIMELINE_EVENT', relatedContactId: s1.id, title: 'Turev testleri ve zaman yonetimi kontrol edildi.', startAt: now, endAt: now + 1800000, customAttributes: { hwStatus: 'Tam Yapildi', nextGoal: '200 Soru Integral + 1 AYT Mat Denemesi' } });
    if (window.app && window.app.showToast) window.app.showToast('Egitim koclugu test verileri yuklendi', 'success');
    this.render();
  }

  seedLawyerData() {
    const store = window.polymorphicStore;
    const now = Date.now();
    store.addRecord({ moduleId: 'durusma', primitiveType: 'TIMELINE_EVENT', title: 'Istanbul 4. Asliye Hukuk - 2024/182 E.', startAt: now + (3 * 86400000), endAt: now + (3 * 86400000) + 3600000, allDay: false, location: 'Caglayan C Blok Salon 14' });
    store.addRecord({ moduleId: 'durusma', primitiveType: 'COMPLIANCE_EXPIRY', title: 'Istinaf Basvuru Kesin Suresi (Yilmaz Ltd.)', deadlineAt: now + (4 * 86400000), severity: 'critical', isResolved: false });
    if (window.app && window.app.showToast) window.app.showToast('Avukat test verileri yuklendi', 'success');
    this.render();
  }

  seedRealEstateData() {
    const store = window.polymorphicStore;
    store.addRecord({ moduleId: 'emlak', primitiveType: 'ENTITY', title: 'Kadikoy Moda 3+1 Deniz Manzarali Arakat', category: 'Satilik Daire', valuation: { amount: 8500000 }, customAttributes: { ownerName: 'Kemal Bey 0532 999 11 22', keyStatus: 'Ofiste' } });
    store.addRecord({ moduleId: 'emlak', primitiveType: 'ENTITY', title: 'Besiktas Carsi 2+1 Esyali Masrafsiz', category: 'Kiralik Daire', valuation: { amount: 35000 }, customAttributes: { ownerName: 'Fatma Hanim 0542 888 22 33', keyStatus: 'Mal Sahibinde' } });
    if (window.app && window.app.showToast) window.app.showToast('Emlak portfoy test verileri yuklendi', 'success');
    this.render();
  }

  clearAllData() {
    if (confirm('DIKKAT: Tum kayitli veriler silinecektir. Emin misiniz?')) {
      window.polymorphicStore.records = [];
      window.polymorphicStore.saveRecords();
      if (window.app && window.app.showToast) window.app.showToast('Tum veritabani temizlendi', 'info');
      this.render();
    }
  }

  exportData() {
    const fullBackup = {
      profile: window.moduleRegistry?.profileManager?.loadProfile(),
      enabledModules: window.moduleRegistry?.profileManager?.enabledModules,
      polymorphicRecords: window.polymorphicStore?.records || [],
      portfolio: JSON.parse(localStorage.getItem('finance_portfolio_v2') || '[]'),
      watchlist: JSON.parse(localStorage.getItem('finance_watchlist_v2') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "Portal_Backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    if (window.app && window.app.showToast) window.app.showToast('Yedek dosyasi indirildi', 'success');
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        if (backup.polymorphicRecords) { window.polymorphicStore.records = backup.polymorphicRecords; window.polymorphicStore.saveRecords(); }
        if (backup.profile) { localStorage.setItem('portal_active_user_profile_v2', JSON.stringify(backup.profile)); }
        if (backup.enabledModules) { localStorage.setItem('portal_user_enabled_modules_v2', JSON.stringify(backup.enabledModules)); }
        if (window.app && window.app.showToast) window.app.showToast('Yedek basariyla geri yuklendi!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        if (window.app && window.app.showToast) window.app.showToast('Gecersiz JSON dosyasi!', 'error');
      }
    };
    reader.readAsText(file);
  }
}

window.adminManager = new AdminManager();
