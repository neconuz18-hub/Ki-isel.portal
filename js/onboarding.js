/**
 * OnboardingManager — Akıllı Meslek & İhtiyaç Teşhis Sihirbazı
 */

class OnboardingManager {
  constructor() {
    this.selectedPresetId = null;
    this.currentStep = 1;
    this.answers = {};
  }

  init() {
    // Profil yoksa açılışta onboarding'i tetikle
    const profile = window.moduleRegistry?.profileManager?.loadProfile();
    if (!profile) {
      setTimeout(() => this.open(), 300);
    }
  }

  open() {
    const modal = document.getElementById('onboardingModal');
    if (!modal) return;
    this.currentStep = 1;
    this.selectedPresetId = null;
    this.renderStep1();
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  close() {
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.classList.add('hidden');
  }

  // --- ADIM 1: MESLEK SEÇİMİ ---
  renderStep1() {
    const container = document.getElementById('onboardingContent');
    if (!container) return;

    const presets = window.moduleRegistry.PRESETS;
    let cardsHtml = '';

    Object.values(presets).forEach(p => {
      const isSelected = this.selectedPresetId === p.id;
      cardsHtml += `
        <div onclick="window.onboardingManager.selectPreset('${p.id}')"
             class="cursor-pointer group relative p-4 rounded-2xl border transition-all ${
               isSelected 
                 ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20' 
                 : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-500'
             }">
          <div class="flex items-start gap-3.5">
            <div class="p-3 rounded-xl bg-slate-800/80 text-blue-400 group-hover:text-blue-300 border border-slate-700/60 flex-shrink-0">
              <i data-lucide="${p.icon || 'briefcase'}" class="w-6 h-6"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-sm font-bold text-slate-100 truncate">${p.title}</h4>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">${p.badge}</span>
              </div>
              <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">${p.desc}</p>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="space-y-6">
        <div class="text-center space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>Kişisel Asistan Kurulumu</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-100">Portalınızı Hangi Şapkanızla Kullanacaksınız?</h2>
          <p class="text-xs text-slate-400 max-w-md mx-auto">Mesleğinizi seçin; menülerinizi, hızlı kayıt araçlarınızı ve takip panolarınızı size özel yapılandıralım.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
          ${cardsHtml}
        </div>

        <div class="flex justify-between items-center pt-2 border-t border-slate-800">
          <button onclick="window.onboardingManager.close()" class="text-xs text-slate-400 hover:text-slate-200 px-4 py-2">Şimdilik Atla (Standart Mod)</button>
          <button onclick="window.onboardingManager.goToStep2()" 
                  id="onboardingNextBtn" 
                  disabled
                  class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span>Devam Et</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  selectPreset(presetId) {
    this.selectedPresetId = presetId;
    this.renderStep1();
    const nextBtn = document.getElementById('onboardingNextBtn');
    if (nextBtn) nextBtn.removeAttribute('disabled');
  }

  // --- ADIM 2: ÖZELLEŞTİRME & TAMAMLAMA ---
  goToStep2() {
    if (!this.selectedPresetId) return;
    this.currentStep = 2;
    const container = document.getElementById('onboardingContent');
    if (!container) return;

    const preset = window.moduleRegistry.PRESETS[this.selectedPresetId];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="text-center space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>Seçildi: ${preset.title}</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-100">Son Dokunuşlar & Öncelikler</h2>
          <p class="text-xs text-slate-400 max-w-md mx-auto">Birkaç ufak bilgiyle asistanınızı hemen kullanıma hazır hale getirelim.</p>
        </div>

        <div class="space-y-4 max-w-md mx-auto">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Size Nasıl Hitap Edelim? (Adınız veya İşletme Adı)</label>
            <input type="text" id="onboardingUserName" placeholder="Örn: Dr. Ahmet / Bereket Bakkaliyesi" 
                   class="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500">
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
            <p class="text-xs font-semibold text-slate-300">Aktif Edilecek Ana Modüller:</p>
            <div class="flex flex-wrap gap-1.5">
              ${preset.activeModules.map(mId => {
                const m = window.moduleRegistry.ALL_MODULES[mId];
                return `<span class="px-2.5 py-1 rounded-lg bg-slate-800 text-blue-300 border border-slate-700 text-xs font-medium">${m ? m.label : mId}</span>`;
              }).join('')}
            </div>
            <p class="text-[11px] text-slate-500 pt-1">💡 Dilediğiniz zaman sol menü altındaki <b>[+ Modül Ekle]</b> tuşundan diğer özellikleri de açabilirsiniz.</p>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2 border-t border-slate-800">
          <button onclick="window.onboardingManager.renderStep1()" class="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 flex items-center gap-1.5">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Geri Dön</span>
          </button>
          <button onclick="window.onboardingManager.finish()" 
                  class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>Asistanı Başlat</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  finish() {
    const nameInput = document.getElementById('onboardingUserName');
    const customName = nameInput ? nameInput.value.trim() : '';

    window.moduleRegistry.profileManager.setPreset(this.selectedPresetId, {
      name: customName
    });

    this.close();

    // Başarı bildirimi
    if (window.soundManager) window.soundManager.play('success');
    
    // Varsayılan sekmeye geç
    if (window.app) {
      window.app.switchTab('dashboard');
    }
  }
}

window.onboardingManager = new OnboardingManager();

// Sayfa yüklendiğinde kontrol et
document.addEventListener('DOMContentLoaded', () => {
  window.onboardingManager.init();
});
