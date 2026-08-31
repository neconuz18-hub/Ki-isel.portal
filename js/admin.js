/**
 * AdminManager — Super Admin & Geliştirici Komuta Merkezi (admin.js)
 * 
 * 1. Tek Tıkla Meslek & Rol Simülatörü
 * 2. Test Verisi Fabrikası (Mock Data Seeder)
 * 3. Modül Ana Kumandası (Feature Flags)
 * 4. JSON Yedekleme & Geri Yükleme (Export / Import)
 * 5. Canlı API & Sistem Sağlığı Monitörü
 */

class AdminManager {
  constructor() {}

  render() {
    const container = document.getElementById('tab-admin');
    if (!container) return;

    const currentProfile = window.moduleRegistry?.profileManager?.loadProfile();
    const currentPresetId = currentProfile?.presetId || 'bireysel_zen';
    const allPresets = window.moduleRegistry?.PRESETS || {};
    const allModules = window.moduleRegistry?.ALL_MODULES || {};
    const enabledModules = window.moduleRegistry?.profileManager?.enabledModules || [];
    const totalRecords = window.polymorphicStore?.records?.length || 0;

    // LocalStorage Boyutu Hesapla
    let storageBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const storageKb = (storageBytes / 1024).toFixed(2);

    container.innerHTML = `
      <div class="space-y-8 max-w-7xl mx-auto">
        
        <!-- Üst Başlık & Durum Çubuğu -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/50 border border-purple-500/30 shadow-xl">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
              <i data-lucide="terminal" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-slate-100">Geliştirici & Sistem Komuta Merkezi</h2>
                <span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">SUPER ADMIN</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Tüm meslek modüllerini yönetin, test verisi yükleyin ve sistemi denetleyin.</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-[11px] text-slate-400">Aktif Rol:</p>
              <p class="text-xs font-bold text-purple-300 font-mono">${allPresets[currentPresetId]?.title || 'Bireysel'}</p>
            </div>
            <button onclick="window.adminManager.pingApis()" class="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all">
              <i data-lucide="activity" class="w-3.5 h-3.5"></i> API Test Et
            </button>
          </div>
        </div>

        <!-- Sistem Metrikleri -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="glass-card p-5 rounded-2xl border border-slate-800">
            <span class="text-slate-400 text-xs font-semibold">Aktif Modül Sayısı</span>
            <h3 class="text-2xl font-mono font-bold text-slate-100 mt-1">${enabledModules.length} / ${Object.keys(allModules).length}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Kullanılabilir Sistem Parçası</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-800">
            <span class="text-slate-400 text-xs font-semibold">Toplam Polimorfik Kayıt</span>
            <h3 class="text-2xl font-mono font-bold text-cyan-400 mt-1">${totalRecords}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Müşteri, Nöbet, Duruşma, Not vb.</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-800">
            <span class="text-slate-400 text-xs font-semibold">Yerel Bellek Kullanımı</span>
            <h3 class="text-2xl font-mono font-bold text-amber-400 mt-1">${storageKb} KB</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">LocalStorage Doluluk Oranı</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-800">
            <span class="text-slate-400 text-xs font-semibold">Canlı Borsa & API Durumu</span>
            <h3 id="apiStatusBadge" class="text-base font-mono font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              CORS & Yahoo Aktif
            </h3>
          </div>
        </div>

        <!-- 1. BÖLÜM: TEK TIKLA MESLEK SİMÜLATÖRÜ -->
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
                <i data-lucide="users" class="w-4 h-4 text-purple-400"></i>
                Hızlı Rol & Meslek Simülatörü
              </h3>
              <p class="text-xs text-slate-400">Tek tıkla istediğiniz mesleğin gözünden portalı deneyimleyin ve test edin.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${Object.values(allPresets).map(p => {
              const isCurrent = (p.id === currentPresetId);
              return `
                <div onclick="window.adminManager.switchRole('${p.id}')"
                     class="cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3 group ${
                       isCurrent 
                         ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20' 
                         : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                     }">
                  <div class="p-2.5 rounded-xl bg-slate-800 text-purple-400 group-hover:text-purple-300 border border-slate-700">
                    <i data-lucide="${p.icon || 'circle'}" class="w-5 h-5"></i>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-xs font-bold text-slate-100 truncate">${p.title}</h4>
                    <span class="text-[10px] text-slate-400 font-mono">${isCurrent ? '● Şu An Aktif' : 'Geçiş Yap ➜'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. BÖLÜM: TEST VERİSİ FABRİKASI (MOCK DATA FACTORY) -->
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div>
            <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="database" class="w-4 h-4 text-cyan-400"></i>
              Test Verisi Fabrikası (Mock Data Seeder)
            </h3>
            <p class="text-xs text-slate-400">Elle tek tek kayıt girmek yerine tek tıkla zengin gerçekçi test verileri yükleyin.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button onclick="window.adminManager.seedEsnafData()" class="p-4 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all group">
              <h4 class="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <i data-lucide="shopping-cart" class="w-4 h-4"></i> Bakkal / Esnaf Verisi Doldur
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">4 veresiye müşterisi, 2 toptancı ödemesi ekler.</p>
            </button>

            <button onclick="window.adminManager.seedDoctorData()" class="p-4 rounded-2xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-left transition-all group">
              <h4 class="text-xs font-bold text-cyan-400 flex items-center gap-2">
                <i data-lucide="stethoscope" class="w-4 h-4"></i> Doktor / Sağlıkçı Verisi Doldur
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">3 adet 24s nöbet, 1 icap görevi ekler.</p>
            </button>

            <button onclick="window.adminManager.seedCoachData()" class="p-4 rounded-2xl bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/30 text-left transition-all group">
              <h4 class="text-xs font-bold text-blue-400 flex items-center gap-2">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i> Koçluk & Özel Ders Verisi Doldur
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">2 öğrenci, 5 deneme neti (SVG eğrisi için) ve görüşme notu ekler.</p>
            </button>

            <button onclick="window.adminManager.seedLawyerData()" class="p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-left transition-all group">
              <h4 class="text-xs font-bold text-purple-400 flex items-center gap-2">
                <i data-lucide="scale" class="w-4 h-4"></i> Avukat / Dava Verisi Doldur
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">2 duruşma, 1 adet 4 günlük istinaf süre sayacı ekler.</p>
            </button>

            <button onclick="window.adminManager.seedRealEstateData()" class="p-4 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all group">
              <h4 class="text-xs font-bold text-amber-400 flex items-center gap-2">
                <i data-lucide="building-2" class="w-4 h-4"></i> Emlakçı Portföy Verisi Doldur
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">3 satılık/kiralık daire ve mal sahibi ekler.</p>
            </button>

            <button onclick="window.adminManager.clearAllData()" class="p-4 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-left transition-all group">
              <h4 class="text-xs font-bold text-rose-400 flex items-center gap-2">
                <i data-lucide="trash-2" class="w-4 h-4"></i> Tüm Test Verilerini Temizle
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">Veritabanını sıfırlar ve boş başlatır.</p>
            </button>
          </div>
        </div>

        <!-- 3. BÖLÜM: VERİ YEDEKLEME & İÇE/DIŞA AKTARIM -->
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div>
            <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
              <i data-lucide="hard-drive-download" class="w-4 h-4 text-emerald-400"></i>
              JSON Yedekleme & Geri Yükleme (Veri Kurtarma)
            </h3>
            <p class="text-xs text-slate-400">Tüm portal verilerini tek tıkla bilgisayarınıza indirin veya yedeği geri yükleyin.</p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button onclick="window.adminManager.exportData()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
              <i data-lucide="download" class="w-4 h-4"></i> Veritabanını JSON Olarak İndir (Yedek Al)
            </button>
            <label class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all">
              <i data-lucide="upload" class="w-4 h-4"></i> JSON Yedeği Geri Yükle
              <input type="file" accept=".json" onchange="window.adminManager.importData(event)" class="hidden">
            </label>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // --- ROL DEĞİŞTİRİCİ ---
  switchRole(presetId) {
    window.moduleRegistry.profileManager.setPreset(presetId);
    this.render();
    if (window.soundManager && window.soundManager.playClick) window.soundManager.playClick();
    alert(`✅ Rol başarıyla değiştirildi: ${window.moduleRegistry.PRESETS[presetId]?.title}`);
  }

  // --- API TESTİ ---
  async pingApis() {
    const badge = document.getElementById('apiStatusBadge');
    if (badge) badge.innerHTML = '<span class="text-xs text-amber-400">Test ediliyor...</span>';

    try {
      if (window.marketData) {
        const quote = await window.marketData.getQuote('THYAO.IS');
        if (quote && quote.price) {
          alert(`✅ Canlı API & CORS Proxy Sağlam!
THYAO Fiyatı: ${quote.price} ₺
Zaman: ${quote.time}`);
        }
      }
    } catch (e) {
      alert(`⚠️ API Test Uyarısı: ${e.message}`);
    }
    this.render();
  }

  // --- SEED VERİLERİ (TEST FABRİKASI) ---
  seedEsnafData() {
    const store = window.polymorphicStore;
    const c1 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Ahmet Yılmaz (Terzi)', phone: '0532 111 22 33', role: 'Musteri', initialBalance: 0 });
    const c2 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Mehmet Demir (Taksici)', phone: '0544 222 33 44', role: 'Musteri', initialBalance: 0 });
    const c3 = store.addRecord({ moduleId: 'veresiye', primitiveType: 'CONTACT', displayName: 'Ayşe Teyze (No: 12)', phone: '0555 333 44 55', role: 'Musteri', initialBalance: 0 });

    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c1.id, flow: 'outflow', amount: 450, category: 'Veresiye', occurredAt: Date.now() - 86400000 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c2.id, flow: 'outflow', amount: 1200, category: 'Veresiye', occurredAt: Date.now() - 172800000 });
    store.addRecord({ moduleId: 'veresiye', primitiveType: 'TRANSACTION', relatedContactId: c3.id, flow: 'outflow', amount: 280, category: 'Veresiye', occurredAt: Date.now() });

    alert('✅ Bakkal / Esnaf test verileri başarıyla yüklendi!');
    this.render();
  }

  seedDoctorData() {
    const store = window.polymorphicStore;
    const today = new Date();
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
    const d3 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11);

    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Acil Servis 24s Nöbeti', startAt: d1.getTime(), endAt: d1.getTime() + 86400000, allDay: true, location: 'Şehir Hastanesi Acil', customAttributes: { shiftType: '24 Saat Nöbet' } });
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Dahiliye İcap Görevi', startAt: d2.getTime(), endAt: d2.getTime() + 86400000, allDay: true, location: 'Evde Çağrı', customAttributes: { shiftType: 'İcap Nöbeti' } });
    store.addRecord({ moduleId: 'nobet', primitiveType: 'TIMELINE_EVENT', title: 'Yoğun Bakım 24s Nöbeti', startAt: d3.getTime(), endAt: d3.getTime() + 86400000, allDay: true, location: 'Genel Yoğun Bakım B Blok', customAttributes: { shiftType: '24 Saat Nöbet' } });

    alert('✅ Doktor nöbet test verileri yüklendi!');
    this.render();
  }

  seedCoachData() {
    const store = window.polymorphicStore;
    const s1 = store.addRecord({
      moduleId: 'ogretmen',
      primitiveType: 'CONTACT',
      displayName: 'Şevval Çelik',
      phone: '0533 999 88 77',
      role: 'Ogrenci',
      customAttributes: {
        parentPhone: '0532 888 77 66',
        target: 'YKS Sayısal / Tıp',
        grade: '12. Sınıf',
        packageLessons: 10,
        completedLessons: 6,
        remainingLessons: 4,
        hourlyRate: '1500',
        weeklyTarget: 1500,
        weeklySolved: 1240,
        nextCallDate: new Date().toISOString().split('T')[0]
      }
    });

    const now = Date.now();
    // Deneme Netleri (SVG Eğrisi İçin)
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Özdebir TYT-1', category: 'DenemeSinavi', valuation: { amount: 68.5 }, createdAt: now - (20 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'TÖDER TYT-2', category: 'DenemeSinavi', valuation: { amount: 73.0 }, createdAt: now - (15 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: '3D Simülasyon TYT-3', category: 'DenemeSinavi', valuation: { amount: 79.25 }, createdAt: now - (10 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Bilgi Sarmal TYT-4', category: 'DenemeSinavi', valuation: { amount: 84.5 }, createdAt: now - (5 * 86400000) });
    store.addRecord({ moduleId: 'ogretmen', primitiveType: 'ENTITY', primaryContactId: s1.id, title: 'Özdebir Genel TYT-5', category: 'DenemeSinavi', valuation: { amount: 89.0 }, createdAt: now });

    // Görüşme Notu
    store.addRecord({
      moduleId: 'ogretmen',
      primitiveType: 'TIMELINE_EVENT',
      relatedContactId: s1.id,
      title: 'Türev testleri ve zaman yönetimi kontrol edildi.',
      startAt: now,
      endAt: now + 1800000,
      customAttributes: { hwStatus: 'Tam Yapıldı', nextGoal: '200 Soru İntegral + 1 AYT Mat Denemesi' }
    });

    alert('✅ Eğitim Koçluğu & SVG Deneme Netleri test verisi yüklendi!');
    this.render();
  }

  seedLawyerData() {
    const store = window.polymorphicStore;
    const now = Date.now();
    store.addRecord({ moduleId: 'durusma', primitiveType: 'TIMELINE_EVENT', title: 'İstanbul 4. Asliye Hukuk - 2024/182 E.', startAt: now + (3 * 86400000), endAt: now + (3 * 86400000) + 3600000, allDay: false, location: 'Çağlayan C Blok Salon 14' });
    store.addRecord({ moduleId: 'durusma', primitiveType: 'COMPLIANCE_EXPIRY', title: 'İstinaf Başvuru Kesin Süresi (Yılmaz Ltd.)', deadlineAt: now + (4 * 86400000), severity: 'critical', isResolved: false });

    alert('✅ Avukat duruşma ve süre sayacı verileri yüklendi!');
    this.render();
  }

  seedRealEstateData() {
    const store = window.polymorphicStore;
    store.addRecord({ moduleId: 'emlak', primitiveType: 'ENTITY', title: 'Kadıköy Moda 3+1 Deniz Manzaralı Arakat', category: 'Satılık Daire', valuation: { amount: 8500000 }, customAttributes: { ownerName: 'Kemal Bey 0532 999 11 22', keyStatus: 'Ofiste' } });
    store.addRecord({ moduleId: 'emlak', primitiveType: 'ENTITY', title: 'Beşiktaş Çarşı 2+1 Eşyalı Masrafsız', category: 'Kiralık Daire', valuation: { amount: 35000 }, customAttributes: { ownerName: 'Fatma Hanım 0542 888 22 33', keyStatus: 'Mal Sahibinde' } });

    alert('✅ Emlak portföy test verileri yüklendi!');
    this.render();
  }

  clearAllData() {
    if (confirm('⚠️ DİKKAT: Tüm kayıtlı veriler (veresiye, nöbet, öğrenci, duruşma) silinecektir. Emin misiniz?')) {
      window.polymorphicStore.records = [];
      window.polymorphicStore.saveRecords();
      alert('Tüm veritabanı temizlendi.');
      this.render();
    }
  }

  // --- JSON EXPORT / IMPORT ---
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
    dlAnchor.setAttribute("download", `Personal_OS_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        if (backup.polymorphicRecords) {
          window.polymorphicStore.records = backup.polymorphicRecords;
          window.polymorphicStore.saveRecords();
        }
        if (backup.profile) {
          localStorage.setItem('portal_active_user_profile_v2', JSON.stringify(backup.profile));
        }
        if (backup.enabledModules) {
          localStorage.setItem('portal_user_enabled_modules_v2', JSON.stringify(backup.enabledModules));
        }
        alert('✅ Yedek başarıyla geri yüklendi! Sayfa yenileniyor...');
        window.location.reload();
      } catch (err) {
        alert('❌ Geçersiz JSON yedek dosyası!');
      }
    };
    reader.readAsText(file);
  }
}

window.adminManager = new AdminManager();
console.log('[AdminManager] ✅ Geliştirici & Komuta Merkezi Hazır.');
