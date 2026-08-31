/**
 * Dynamic Landscape Wallpaper Engine (js/wallpaper.js)
 * Yönetici Asistanı & Giriş Ekranı için Otomatik Değişen 4K Manzara Arka Planları
 */

const LANDSCAPE_WALLPAPERS = [
  {
    title: 'Yosemite Vadisi & Nehir',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Sisli Çam Ormanı & Dağlar',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Alp Dağları Gündoğumu',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Huzurlu Dağ Gölü & Bulutlar',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'İsviçre Alpleri & Yeşil Vadi',
    url: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Gün Batımı Altın Vadi',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Yıldızlı Dağ Gecesi',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Sakin Tropik Kıyı & Okyanus',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
  }
];

class WallpaperManager {
  constructor() {
    this.currentIndex = parseInt(localStorage.getItem('assistant_wallpaper_index') || '0', 10);
    if (isNaN(this.currentIndex) || this.currentIndex >= LANDSCAPE_WALLPAPERS.length) {
      this.currentIndex = 0;
    }
    this.init();
  }

  init() {
    this.applyWallpaper();
    
    // Her 5 dakikada bir manzarayı otomatik değiştir
    setInterval(() => {
      this.nextWallpaper(false);
    }, 300000);
  }

  applyWallpaper() {
    const wp = LANDSCAPE_WALLPAPERS[this.currentIndex];
    if (!wp) return;

    // 1. Ana Uygulama Arka Planı
    const mainBg = document.getElementById('dynamicLandscapeBg');
    if (mainBg) {
      mainBg.style.backgroundImage = `url('${wp.url}')`;
    }

    // 2. Giriş & Kilit Ekranı Arka Planı
    const loginBg = document.getElementById('loginLandscapeBg');
    if (loginBg) {
      loginBg.style.backgroundImage = `url('${wp.url}')`;
    }

    localStorage.setItem('assistant_wallpaper_index', this.currentIndex.toString());
  }

  nextWallpaper(showToast = true) {
    this.currentIndex = (this.currentIndex + 1) % LANDSCAPE_WALLPAPERS.length;
    this.applyWallpaper();

    if (showToast && window.app) {
      const wp = LANDSCAPE_WALLPAPERS[this.currentIndex];
      window.app.showToast(`Manzara değiştirildi: ${wp.title}`, 'info');
    }
  }
}

window.wallpaperManager = new WallpaperManager();
