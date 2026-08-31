/**
 * Quick Capture & Smart Scratchpad Module (js/quickCapture.js)
 * Hızlı Zihin Boşaltma Çekmecesi ve Doğal Dil Girdi Ayrıştırıcı
 */

const STORAGE_KEY_SCRATCHPAD = 'assistant_scratchpad_content';

class QuickCaptureManager {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    setTimeout(() => {
      this.render();
      this.bindEvents();
    }, 200);
  }

  toggleDrawer(forceState = null) {
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    const drawer = document.getElementById('quickCaptureDrawer');
    const backdrop = document.getElementById('quickCaptureBackdrop');
    const fab = document.getElementById('quickCaptureFab');

    if (!drawer || !backdrop) return;

    if (this.isOpen) {
      backdrop.classList.remove('hidden');
      drawer.classList.remove('translate-x-full');
      if (fab) fab.classList.add('scale-0');
      
      const input = document.getElementById('qcSmartInput');
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      drawer.classList.add('translate-x-full');
      backdrop.classList.add('hidden');
      if (fab) fab.classList.remove('scale-0');
    }
  }

  saveScratchpad() {
    const pad = document.getElementById('qcScratchpadArea');
    if (!pad) return;
    window.appStorage.save(STORAGE_KEY_SCRATCHPAD, pad.value, false);
  }

  getScratchpad() {
    return window.appStorage.get(STORAGE_KEY_SCRATCHPAD, '');
  }

  // Akıllı Doğal Dil Ayrıştırıcı (Smart Parser)
  parseAndProcess(text) {
    const raw = text.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();

    // 1. Finans / Hisse Algılama (Örn: THYAO 310 veya ASELS takip)
    const stockMatch = raw.match(/\b([A-Z]{4,5})\b/);
    if (stockMatch && (lower.includes('hisse') || lower.includes('al') || lower.includes('sat') || lower.includes('tl') || lower.includes('fiyat'))) {
      const sym = stockMatch[1].toUpperCase();
      if (window.financeManager) {
        window.financeManager.addStock(sym, sym + ' Hissesi', 0);
        if (window.app) window.app.showToast(`"${sym}" hissesi canlı borsa takip listenize eklendi!`, 'success');
        this.clearInput();
        return;
      }
    }

    // 2. Abonelik / Sabit Gider Algılama (Örn: Netflix 250 TL aylık)
    if (lower.includes('abonelik') || lower.includes('aylık') || lower.includes('yıllık') || lower.includes('kasko') || lower.includes('muayene') || lower.includes('sigorta')) {
      const amountMatch = raw.match(/(\d+([.,]\d+)?)\s*(tl|₺|usd|\$|eur|€)?/i);
      const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 100;
      const currency = lower.includes('usd') || lower.includes('$') ? 'USD' : (lower.includes('eur') || lower.includes('€') ? 'EUR' : 'TRY');
      const cycle = lower.includes('yıllık') ? 'yearly' : 'monthly';
      
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      if (window.subscriptionManager) {
        window.subscriptionManager.addSubscription({
          title: raw.split(/\d/)[0].replace(/(abonelik|aylık|yıllık)/gi, '').trim() || 'Yeni Abonelik',
          category: lower.includes('kasko') || lower.includes('sigorta') ? 'insurance' : (lower.includes('muayene') ? 'official' : 'entertainment'),
          amount: amount,
          currency: currency,
          billingCycle: cycle,
          nextBillingDate: nextMonth.toISOString().split('T')[0],
          notes: raw
        });
        this.clearInput();
        return;
      }
    }

    // 3. Görev / Zamanlı İş Algılama (Örn: Yarın 15:00 toplantı yap, Cuma günü raporu gönder)
    if (lower.includes('yarın') || lower.includes('bugün') || lower.includes('pazartesi') || lower.includes('salı') || lower.includes('çarşamba') || lower.includes('perşembe') || lower.includes('cuma') || lower.includes('cumartesi') || lower.includes('pazar') || raw.includes(':') || lower.includes('görev') || lower.includes('yapılacak')) {
      
      let dueDate = new Date().toISOString().split('T')[0];
      if (lower.includes('yarın')) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        dueDate = d.toISOString().split('T')[0];
      }

      // Saat yakalama (14:30 vb.)
      const timeMatch = raw.match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/);
      const dueTime = timeMatch ? timeMatch[0] : '10:00';

      const priority = lower.includes('acil') || lower.includes('önemli') ? 'urgent' : 'medium';

      if (window.taskManager) {
        window.taskManager.addTask({
          title: raw,
          category: 'is',
          priority: priority,
          dueDate: dueDate,
          dueTime: dueTime
        });
        if (window.app) {
          window.app.renderAll();
          window.app.showToast(`"${raw}" görevinize akıllıca eklendi!`, 'success');
        }
        this.clearInput();
        return;
      }
    }

    // 4. Standart Not Oluşturma (Hiçbir kalıba girmezse zengin nota dönüştür)
    if (window.noteManager) {
      window.noteManager.addNote('Hızlı Yakalanan Not', raw, 'amber');
      if (window.app) {
        window.app.renderAll();
        window.app.showToast('Notlarınıza kaydedildi!', 'success');
      }
      this.clearInput();
    }
  }

  clearInput() {
    const input = document.getElementById('qcSmartInput');
    if (input) input.value = '';
    const preview = document.getElementById('qcIntentPreview');
    if (preview) preview.innerHTML = '';
  }

  // Kullanıcı yazarken canlı niyet algılama önizlemesi
  handleInputPreview(text) {
    const preview = document.getElementById('qcIntentPreview');
    if (!preview) return;

    const raw = text.trim();
    if (!raw) {
      preview.innerHTML = '';
      return;
    }

    const lower = raw.toLowerCase();
    let badge = '';

    if (raw.match(/\b([A-Z]{4,5})\b/) && (lower.includes('hisse') || lower.includes('al') || lower.includes('sat') || lower.includes('tl'))) {
      badge = `<span class="inline-flex items-center gap-1 text-emerald-400 font-bold"><i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Borsa Takip Listesine Eklenecek</span>`;
    } else if (lower.includes('abonelik') || lower.includes('aylık') || lower.includes('kasko') || lower.includes('muayene') || lower.includes('sigorta')) {
      badge = `<span class="inline-flex items-center gap-1 text-purple-400 font-bold"><i data-lucide="credit-card" class="w-3.5 h-3.5"></i> Abonelik & Ödeme Radarına Eklenecek</span>`;
    } else if (lower.includes('yarın') || lower.includes('bugün') || raw.includes(':') || lower.includes('görev')) {
      badge = `<span class="inline-flex items-center gap-1 text-amber-400 font-bold"><i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Zamanlı Görev / Ajandaya Eklenecek</span>`;
    } else {
      badge = `<span class="inline-flex items-center gap-1 text-sky-400 font-bold"><i data-lucide="file-text" class="w-3.5 h-3.5"></i> Hızlı Not Olarak Kaydedilecek</span>`;
    }

    preview.innerHTML = badge;
    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const input = document.getElementById('qcSmartInput');
    if (input) {
      input.addEventListener('input', (e) => {
        this.handleInputPreview(e.target.value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.parseAndProcess(input.value);
        }
      });
    }
  }

  render() {
    const existing = document.getElementById('quickCaptureRoot');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'quickCaptureRoot';

    const savedNotes = this.getScratchpad();

    root.innerHTML = `
      <!-- Yüzen Hızlı Aksiyon Butonu (FAB) -->
      <button 
        id="quickCaptureFab"
        onclick="window.quickCaptureManager.toggleDrawer(true)"
        class="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group"
        title="Hızlı Zihin Boşaltma & Komut (Ctrl + Space)"
      >
        <i data-lucide="zap" class="w-6 h-6 fill-slate-950 group-hover:rotate-12 transition-transform"></i>
      </button>

      <!-- Karartma Arka Planı (Backdrop) -->
      <div 
        id="quickCaptureBackdrop" 
        onclick="window.quickCaptureManager.toggleDrawer(false)"
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 hidden transition-opacity duration-300 cursor-pointer"
      ></div>

      <!-- Sağdan Kayan Çekmece (Drawer) -->
      <div 
        id="quickCaptureDrawer"
        class="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-slate-900/95 backdrop-blur-2xl border-l border-amber-500/30 z-50 shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between"
      >
        <!-- Header -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <i data-lucide="zap" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-black text-white text-base tracking-tight">Akıllı Zihin Boşaltma</h3>
              <p class="text-[11px] text-slate-400">Tek satırda yazın, sistem doğru yere dağıtsın</p>
            </div>
          </div>
          <button onclick="window.quickCaptureManager.toggleDrawer(false)" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          <!-- Akıllı Komut Kutusu -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-300">
              ⚡ Hızlı Komut / Düşünce Yakalayıcı
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="qcSmartInput"
                placeholder="Örn: Yarın 14:00 Toplantı yap veya THYAO 310 TL"
                class="w-full pl-3.5 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
              >
              <button 
                onclick="window.quickCaptureManager.parseAndProcess(document.getElementById('qcSmartInput').value)"
                class="absolute right-2 top-2 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                title="Kaydet & Dağıt"
              >
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>

            <!-- Canlı Niyet Göstergesi -->
            <div id="qcIntentPreview" class="min-h-[20px] text-xs pt-1"></div>
          </div>

          <div class="h-px bg-slate-800 w-full"></div>

          <!-- Canlı Yapışkan Not / Karalama Defteri (Scratchpad) -->
          <div class="space-y-2 flex-1 flex flex-col">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <i data-lucide="edit-3" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>Geçici Karalama Defteri (Otomatik Kayıt)</span>
              </label>
              <span class="text-[10px] text-slate-500">Tarayıcı kapansa da kalır</span>
            </div>

            <textarea 
              id="qcScratchpadArea"
              oninput="window.quickCaptureManager.saveScratchpad()"
              placeholder="Anlık aklınıza gelen telefon numaraları, geçici fikirler, bağlantılar ve karalamalar için her zaman elinizin altındaki serbest alan..."
              class="w-full h-56 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none font-mono leading-relaxed"
            >${savedNotes}</textarea>
          </div>

          <!-- İpuçları Kutusu -->
          <div class="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2 text-[11px] text-slate-400">
            <div class="font-bold text-slate-300 flex items-center gap-1.5">
              <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Akıllı İpuçları:</span>
            </div>
            <ul class="space-y-1 pl-4 list-disc text-slate-400">
              <li><strong class="text-slate-300">"Yarın 15:00 Sunum"</strong> → Ajanda & Görev</li>
              <li><strong class="text-slate-300">"THYAO takip"</strong> → Canlı Borsa</li>
              <li><strong class="text-slate-300">"Netflix 249 TL aylık"</strong> → Abonelik Radarı</li>
              <li><strong class="text-slate-300">Düz metin</strong> → Notlar Arşivi</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-xs">
          <span class="text-slate-500 font-mono text-[10px]">Life OS Command Core</span>
          <button onclick="window.quickCaptureManager.toggleDrawer(false)" class="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer">
            Kapat
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    if (window.lucide) window.lucide.createIcons();
  }
}

window.quickCaptureManager = new QuickCaptureManager();
