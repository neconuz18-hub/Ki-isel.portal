/**
 * Bento Grid & Layout Customization Manager (js/layoutManager.js)
 * Ana Sayfa Bento Grid Widget Sıralama, Görünürlük ve Kişiselleştirme Modülü
 */

const STORAGE_KEY_LAYOUT_CONFIG = 'assistant_dashboard_layout_config';

const DEFAULT_WIDGET_CONFIG = [
  { id: 'finance', title: 'Canlı Borsa, Döviz & Altın', icon: 'trending-up', visible: true, width: 'lg:col-span-3' },
  { id: 'subscriptions', title: 'Abonelik & Ödeme Radarı', icon: 'credit-card', visible: true, width: 'lg:col-span-3' },
  { id: 'cityLife', title: 'Gündelik Yaşam & Şehir', icon: 'compass', visible: true, width: 'lg:col-span-3' },
  { id: 'news', title: 'Canlı Gündem & Haber Akışı', icon: 'newspaper', visible: true, width: 'lg:col-span-3' },
  { id: 'tasks', title: 'Öncelikli Görevler', icon: 'check-circle', visible: true, width: 'lg:col-span-2' },
  { id: 'routines', title: 'Günlük Rutinler & Odak', icon: 'target', visible: true, width: 'lg:col-span-1' }
];

class LayoutManager {
  constructor() {
    this.config = this.loadConfig();
    this.init();
  }

  init() {
    setTimeout(() => {
      this.applyLayout();
      this.initDragAndDrop();
    }, 250);
  }

  loadConfig() {
    let saved = window.appStorage.get(STORAGE_KEY_LAYOUT_CONFIG, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      window.appStorage.save(STORAGE_KEY_LAYOUT_CONFIG, DEFAULT_WIDGET_CONFIG, false);
      return JSON.parse(JSON.stringify(DEFAULT_WIDGET_CONFIG));
    }

    // Eksik olan yeni widget'ları varsa listeye ekle
    DEFAULT_WIDGET_CONFIG.forEach(def => {
      if (!saved.some(s => s.id === def.id)) {
        saved.push(def);
      }
    });

    return saved;
  }

  saveConfig() {
    window.appStorage.save(STORAGE_KEY_LAYOUT_CONFIG, this.config);
    this.applyLayout();
  }

  // Widget Görünürlüğünü Aç/Kapat
  toggleWidgetVisibility(widgetId, isVisible) {
    const item = this.config.find(c => c.id === widgetId);
    if (item) {
      item.visible = isVisible;
      this.saveConfig();
      if (window.app) {
        window.app.showToast(`"${item.title}" görünürlüğü güncellendi`, 'info');
      }
    }
  }

  // Varsayılan Düzeni Geri Yükle
  resetToDefault() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_WIDGET_CONFIG));
    this.saveConfig();
    this.renderCustomizeModal();
    if (window.app) window.app.showToast('Ana sayfa düzeni varsayılana sıfırlandı', 'success');
  }

  // DOM üzerinde sıralama ve gizleme uygulama
  applyLayout() {
    const grid = document.getElementById('dashboardWidgetsGrid');
    if (!grid) return;

    this.config.forEach(cfg => {
      const wrapper = document.querySelector(`[data-widget-id="${cfg.id}"]`);
      if (wrapper) {
        // Sıralama
        grid.appendChild(wrapper);

        // Görünürlük
        if (cfg.visible) {
          wrapper.classList.remove('hidden');
        } else {
          wrapper.classList.add('hidden');
        }
      }
    });
  }

  // Sürükle-Bırak Entegrasyonu
  initDragAndDrop() {
    const grid = document.getElementById('dashboardWidgetsGrid');
    if (!grid || !window.Sortable) return;

    if (this.sortableInstance) {
      this.sortableInstance.destroy();
    }

    this.sortableInstance = new Sortable(grid, {
      animation: 250,
      handle: '.widget-drag-handle, .drag-grip-handle',
      draggable: '.dashboard-widget-wrapper',
      ghostClass: 'opacity-40',
      chosenClass: 'scale-[0.99]',
      dragClass: 'shadow-2xl',
      onEnd: () => {
        const newOrder = [];
        const wrappers = grid.querySelectorAll('.dashboard-widget-wrapper');
        wrappers.forEach(w => {
          const id = w.getAttribute('data-widget-id');
          const existing = this.config.find(c => c.id === id);
          if (existing) {
            newOrder.push(existing);
          }
        });

        this.config = newOrder;
        window.appStorage.save(STORAGE_KEY_LAYOUT_CONFIG, this.config);
        if (window.app) window.app.showToast('Yeni widget dizilimi kaydedildi', 'success');
      }
    });
  }

  // Düzenleme Modalını Çizdirme
  renderCustomizeModal() {
    const container = document.getElementById('layoutCustomizeModalContent');
    if (!container) return;

    const listHtml = this.config.map(item => `
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <i data-lucide="${item.icon || 'layers'}" class="w-4 h-4"></i>
          </div>
          <div>
            <h5 class="font-bold text-white text-xs">${item.title}</h5>
            <span class="text-[10px] text-slate-400">${item.visible ? 'Görünür' : 'Gizli'}</span>
          </div>
        </div>

        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            ${item.visible ? 'checked' : ''} 
            onchange="window.layoutManager.toggleWidgetVisibility('${item.id}', this.checked)"
            class="sr-only peer"
          >
          <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="space-y-3">
        ${listHtml}
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
        <button 
          onclick="window.layoutManager.resetToDefault()"
          class="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          <span>Varsayılana Sıfırla</span>
        </button>

        <button 
          onclick="window.app.closeModal('layoutCustomizeModal')"
          class="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/20"
        >
          Tamam
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  openCustomizeModal() {
    this.renderCustomizeModal();
    if (window.app) window.app.openModal('layoutCustomizeModal');
  }
}

window.layoutManager = new LayoutManager();
