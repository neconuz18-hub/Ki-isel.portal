/**
 * News Feed Module - Kişisel Haber ve Gündem Akışı
 */

const DEFAULT_FEEDS = [
  { id: 'feed-1', name: 'TRT Haber', category: 'gundem', url: 'https://www.trthaber.com/manset_articles.rss', isSystem: true },
  { id: 'feed-2', name: 'Bloomberg HT', category: 'ekonomi', url: 'https://www.bloomberght.com/rss', isSystem: true },
  { id: 'feed-3', name: 'Webtekno', category: 'teknoloji', url: 'https://www.webtekno.com/rss.xml', isSystem: true }
];

const FALLBACK_NEWS = [
  {
    title: 'Merkez Bankası Aylık Piyasa Değerlendirme Raporunu Açıkladı',
    description: 'Piyasa beklentileri ve enflasyon görünümüne ilişkin son ekonomik veriler paylaşıldı.',
    source: 'Ekonomi Servisi',
    pubDate: 'Bugün, 10:45',
    link: 'https://bloomberght.com',
    category: 'ekonomi'
  },
  {
    title: 'Türkiye Genelinde Yeni Nesil Teknoloji Girişimlerine Yatırım Rekoru',
    description: 'Yapay zeka ve yazılım odaklı yerli teknoloji şirketleri küresel yatırımcıların odağında.',
    source: 'Teknoloji Bülteni',
    pubDate: 'Bugün, 09:30',
    link: 'https://webtekno.com',
    category: 'teknoloji'
  },
  {
    title: 'Uluslararası Ticaret ve Lojistik Koridorlarında Yeni Anlaşmalar İmzalandı',
    description: 'Bölgesel iş birlikleri ve yeni lojistik güzergahları için kapsamlı adımlar atıldı.',
    source: 'Gündem Ajansı',
    pubDate: 'Bugün, 08:15',
    link: 'https://trthaber.com',
    category: 'gundem'
  }
];

class NewsManager {
  constructor() {
    this.feeds = this.loadFeeds();
    this.currentCategory = 'all';
    this.newsItems = [];
    this.isLoading = false;
    this.lastFetched = null;
    
    // Auto-fetch on load
    setTimeout(() => this.fetchNews(), 500);
    // Auto-refresh every 10 minutes
    setInterval(() => this.fetchNews(), 600000);
  }

  loadFeeds() {
    const saved = window.appStorage.get(STORAGE_KEYS.NEWS_SOURCES, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      window.appStorage.save(STORAGE_KEYS.NEWS_SOURCES, DEFAULT_FEEDS, false);
      return DEFAULT_FEEDS;
    }
    return saved;
  }

  saveFeeds() {
    window.appStorage.save(STORAGE_KEYS.NEWS_SOURCES, this.feeds);
    this.fetchNews();
  }

  addFeed(name, url, category = 'gundem') {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    const newFeed = {
      id: 'custom-feed-' + Date.now(),
      name: name.trim() || 'Özel Haber Kaynağı',
      category: category,
      url: cleanUrl,
      isSystem: false
    };

    this.feeds.push(newFeed);
    this.saveFeeds();
    if (window.app) window.app.showToast(`${newFeed.name} haber kaynağı eklendi`, 'success');
  }

  removeFeed(id) {
    this.feeds = this.feeds.filter(f => f.id !== id);
    this.saveFeeds();
    if (window.app) window.app.showToast('Haber kaynağı silindi', 'info');
  }

  async fetchNews() {
    this.isLoading = true;
    this.renderNewsCard();

    const activeFeeds = this.currentCategory === 'all'
      ? this.feeds
      : this.feeds.filter(f => f.category === this.currentCategory);

    let collected = [];

    for (const feed of activeFeeds) {
      try {
        const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items) {
            data.items.forEach(item => {
              collected.push({
                ...item,
                source: feed.name,
                category: feed.category
              });
            });
          }
        }
      } catch (e) {
        console.log(`Feed fetch hatası (${feed.name}):`, e);
      }
    }

    if (collected.length === 0) {
      // Fallback
      this.newsItems = FALLBACK_NEWS.filter(n => this.currentCategory === 'all' || n.category === this.currentCategory);
    } else {
      this.newsItems = collected;
    }

    this.isLoading = false;
    this.lastFetched = new Date();
    this.renderNewsCard();
  }

  setCategory(cat) {
    this.currentCategory = cat;
    this.fetchNews();
  }

  render() {
    this.renderNewsCard('newsWidgetContainer');
    this.renderNewsCard('mainNewsContainer');
  }

  renderNewsCard(containerId = 'newsWidgetContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categories = [
      { id: 'all', label: 'Tümü' },
      { id: 'gundem', label: 'Gündem' },
      { id: 'ekonomi', label: 'Ekonomi' },
      { id: 'teknoloji', label: 'Teknoloji' }
    ];

    const categoryBtnsHtml = categories.map(c => `
      <button 
        onclick="window.newsManager.setCategory('${c.id}')" 
        class="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${this.currentCategory === c.id ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'}"
      >
        ${c.label}
      </button>
    `).join('');

    let contentHtml = '';

    if (this.isLoading) {
      contentHtml = `
        <div class="py-12 text-center text-xs text-slate-400">
          <i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400"></i>
          Haber akışı taranıyor ve yükleniyor...
        </div>
      `;
    } else if (this.newsItems.length === 0) {
      contentHtml = `
        <div class="py-10 text-center text-xs text-slate-400">
          <i data-lucide="newspaper" class="w-6 h-6 mx-auto mb-2 text-slate-500"></i>
          Bu kategoride henüz haber bulunamadı.
        </div>
      `;
    } else {
      contentHtml = this.newsItems.slice(0, 8).map(item => `
        <div class="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-1.5 group">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
              ${escapeHtml(item.source)}
            </span>
            <span class="text-[10px] text-slate-500">${item.pubDate ? item.pubDate.slice(0, 22) : ''}</span>
          </div>

          <h4 class="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2">
            <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="hover:underline">
              ${escapeHtml(item.title)}
            </a>
          </h4>

          ${item.description ? `
            <p class="text-[11px] text-slate-400 line-clamp-2">${escapeHtml(item.description)}</p>
          ` : ''}

          <div class="pt-1 flex items-center justify-end">
            <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              <span>Haberi Oku</span>
              <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
          </div>
        </div>
      `).join('');
    }

    container.innerHTML = `
      <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 space-y-4">
        
        <!-- Üst Başlık & Kaynak Ekleme -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="drag-grip-handle p-1 text-slate-500 hover:text-amber-400 rounded transition-colors cursor-grab active:cursor-grabbing" 
                 title="Basılı tutup sürükleyerek yerini değiştirebilirsiniz">
              <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
            </div>
            <div class="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <i data-lucide="newspaper" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-white">Canlı Gündem & Haber Akışı</h3>
              <p class="text-[11px] text-slate-400">Takip ettiğiniz kaynaklardan anlık manşetler</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.newsManager.fetchNews()" title="Haberleri Yenile" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer">
              <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="window.app.openModal('newRssModal')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all shadow-md shadow-amber-500/10 cursor-pointer">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>RSS / Site Ekle</span>
            </button>
          </div>
        </div>

        <!-- Kategori Butonları -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          ${categoryBtnsHtml}
        </div>

        <!-- Haber Listesi Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          ${contentHtml}
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => { if (window.app && window.app.applyAllWidgetCollapses) window.app.applyAllWidgetCollapses(); }, 50);
  }
}

window.newsManager = new NewsManager();
