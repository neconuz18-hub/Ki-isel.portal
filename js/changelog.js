const CURRENT_VERSION = 'v1.3.1';
const STORAGE_CHANGELOG_KEY = 'assistant_last_seen_version';
const STORAGE_CHANGELOG_AUTOSHOW = 'assistant_show_changelog_on_startup';

const RELEASE_NOTES = {
  version: 'v1.3.1',
  title: 'Son Yapılan Güncellemeler & İyileştirmeler',
  date: '28 Ağustos 2026',
  badge: 'YENİ VERSİYON',
  summary: 'Arayüz tasarımı modernleştirildi, canlı borsa altyapısı yenilendi ve çeşitli kullanıcı deneyimi iyileştirmeleri yapıldı.',
  categories: [
    {
      icon: 'sparkles',
      color: 'amber',
      title: 'Devasa Arayüz (UI) İyileştirmeleri',
      subtitle: 'Premium Cam Efekti & Ferah Tasarım',
      items: [
        'Arka plan rengi göz yormayan, premium koyu lacivert (slate-900) tonuna çekildi.',
        'Tüm widget ve menülere yarı saydam "Glassmorphism" (Cam Efekti) eklendi.',
        'Ekran genişliği artırılarak sağ ve soldaki devasa boşluklar daraltıldı, içerikler genişletildi.',
        'Gereksiz "Yönetici Asistanı PRO", "Navigasyon" ve "Ctrl K" yazıları kaldırılarak arayüz sadeleştirildi.',
        'İstatistikler bölümüne aktif işleri gösteren "Devam Eden" kartı eklendi.'
      ]
    },
    {
      icon: 'line-chart',
      color: 'emerald',
      title: 'Canlı Borsa & Portföy Köprüsü',
      subtitle: 'Kesintisiz Halka Arz ve Hisse Takibi',
      items: [
        'Hisse izleme listenize (Canlı Borsa sekmesi) "Portföye Ekle (Çanta 💼)" butonu eklendi. Artık dilediğiniz hisseyi anında Halka Arz ve Portföy yöneticisine kaydedebilirsiniz.',
        'Canlı piyasa verileri (Altın, Döviz) Truncgil API ile tamamen ücretsiz ve anlık hale getirildi.',
        'Yahoo Finance 429 Hataları çözüldü, borsa API\'si optimize edildi.'
      ]
    },
    {
      icon: 'bug',
      color: 'sky',
      title: 'Hata Düzeltmeleri',
      subtitle: 'Sorunsuz Bir Deneyim',
      items: [
        'Hisse Ekleme penceresinin tepki vermeme ve sessizce kapanma sorunu çözüldü.',
        'İl değiştirildiğinde üst barda hava durumunun "Yükleniyor..." da kalma hatası düzeltildi.',
        'Widget\'ları daraltmak için ikonlar ok (chevron) yerine eksi (-) ve artı (+) ikonlarıyla değiştirildi, kapalı widget\'lar daha net belli olacak şekilde soluklaştırıldı.'
      ]
    }
  ]
};

class ChangelogManager {
  constructor() {
    this.currentVersion = CURRENT_VERSION;
    this.notes = RELEASE_NOTES;
  }

  isAutoShowEnabled() {
    return window.appStorage.get(STORAGE_CHANGELOG_AUTOSHOW, true);
  }

  toggleAutoShow(enabled) {
    window.appStorage.save(STORAGE_CHANGELOG_AUTOSHOW, enabled);
  }

  checkAndShow() {
    if (!this.isAutoShowEnabled()) return;
    
    const lastSeen = window.appStorage.get(STORAGE_CHANGELOG_KEY, null);
    if (lastSeen !== this.currentVersion) {
      this.openModal();
    }
  }

  markAsSeen() {
    window.appStorage.save(STORAGE_CHANGELOG_KEY, this.currentVersion);
  }

  openModal() {
    const modal = document.getElementById('changelogModal');
    if (!modal) return;
    this.renderNotes();
    window.app.openModal('changelogModal');
    this.markAsSeen();
  }

  renderNotes() {
    const contentEl = document.getElementById('changelogModalContent');
    if (!contentEl) return;

    let catsHtml = this.notes.categories.map(cat => `
      <div class="flex items-start gap-4 group">
        <div class="mt-1 p-3 rounded-2xl bg-${cat.color}-500/10 text-${cat.color}-400 border border-${cat.color}-500/20 group-hover:scale-110 transition-transform flex-shrink-0 shadow-lg shadow-${cat.color}-500/5">
          <i data-lucide="${cat.icon}" class="w-6 h-6"></i>
        </div>
        <div>
          <h4 class="font-bold text-white text-base flex items-center gap-2">${cat.title}</h4>
          <p class="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-3">${cat.subtitle}</p>
          <ul class="space-y-2.5">
            ${cat.items.map(item => `
              <li class="flex items-start gap-2.5 text-sm text-slate-300">
                <span class="text-${cat.color}-400 mt-0.5">✦</span>
                <span class="leading-relaxed font-medium">${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `).join('<div class="h-px w-full bg-slate-800/80 my-6"></div>');

    contentEl.innerHTML = `
      <div class="text-center mb-8">
        <span class="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black tracking-widest uppercase mb-4">
          ${this.notes.version} - ${this.notes.badge}
        </span>
        <h2 class="text-3xl font-black text-white tracking-tight mb-2">${this.notes.title}</h2>
        <p class="text-slate-400 text-sm font-medium">${this.notes.summary}</p>
        <p class="text-xs text-slate-500 mt-2 font-mono">Son Güncelleme: ${this.notes.date}</p>
      </div>

      <div class="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

      <div class="space-y-2 mb-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        ${catsHtml}
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" id="clAutoShowCb" class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-400" onchange="window.changelogManager.toggleAutoShow(this.checked)">
          <span class="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Açılışta bu bilgilendirme penceresini göster</span>
        </label>
        
        <button onclick="window.app.closeModal('changelogModal')" class="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <i data-lucide="check" class="w-4 h-4"></i> Harika, Portala Geç
        </button>
      </div>
    `;

    const autoshowCb = document.getElementById('clAutoShowCb');
    if (autoshowCb) {
      autoshowCb.checked = this.isAutoShowEnabled();
    }

    if (window.lucide) window.lucide.createIcons();
  }
}

window.changelogManager = new ChangelogManager();
