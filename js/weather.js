/**
 * Weather Module - Kişisel Hava Durumu & Günlük Tahmin
 * Türkiye'nin Tüm 81 İli ve Popüler Merkezleri (Open-Meteo API Destekli)
 */

const TURKEY_CITIES = [
  { name: 'Adana', lat: 37.0000, lon: 35.3213, plate: '01' },
  { name: 'Adıyaman', lat: 37.7648, lon: 38.2786, plate: '02' },
  { name: 'Afyonkarahisar', lat: 38.7507, lon: 30.5567, plate: '03' },
  { name: 'Ağrı', lat: 39.7191, lon: 43.0503, plate: '04' },
  { name: 'Amasya', lat: 40.6501, lon: 35.8353, plate: '05' },
  { name: 'Ankara', lat: 39.9334, lon: 32.8597, plate: '06' },
  { name: 'Antalya', lat: 36.8969, lon: 30.7133, plate: '07' },
  { name: 'Artvin', lat: 41.1828, lon: 41.8183, plate: '08' },
  { name: 'Aydın', lat: 37.8560, lon: 27.8416, plate: '09' },
  { name: 'Balıkesir', lat: 39.6484, lon: 27.8826, plate: '10' },
  { name: 'Bilecik', lat: 40.1451, lon: 29.9799, plate: '11' },
  { name: 'Bingöl', lat: 38.8854, lon: 40.4983, plate: '12' },
  { name: 'Bitlis', lat: 38.4006, lon: 42.1095, plate: '13' },
  { name: 'Bolu', lat: 40.7358, lon: 31.6061, plate: '14' },
  { name: 'Burdur', lat: 37.7203, lon: 30.2908, plate: '15' },
  { name: 'Bursa', lat: 40.1885, lon: 29.0610, plate: '16' },
  { name: 'Çanakkale', lat: 40.1553, lon: 26.4142, plate: '17' },
  { name: 'Çankırı', lat: 40.6013, lon: 33.6134, plate: '18' },
  { name: 'Çorum', lat: 40.5506, lon: 34.9556, plate: '19' },
  { name: 'Denizli', lat: 37.7765, lon: 29.0864, plate: '20' },
  { name: 'Diyarbakır', lat: 37.9144, lon: 40.2306, plate: '21' },
  { name: 'Edirne', lat: 41.6772, lon: 26.5557, plate: '22' },
  { name: 'Elazığ', lat: 38.6810, lon: 39.2264, plate: '23' },
  { name: 'Erzincan', lat: 39.7500, lon: 39.5000, plate: '24' },
  { name: 'Erzurum', lat: 39.9043, lon: 41.2679, plate: '25' },
  { name: 'Eskişehir', lat: 39.7767, lon: 30.5206, plate: '26' },
  { name: 'Gaziantep', lat: 37.0662, lon: 37.3833, plate: '27' },
  { name: 'Giresun', lat: 40.9128, lon: 38.3895, plate: '28' },
  { name: 'Gümüşhane', lat: 40.4600, lon: 39.4700, plate: '29' },
  { name: 'Hakkari', lat: 37.5833, lon: 43.7333, plate: '30' },
  { name: 'Hatay / Antakya', lat: 36.2023, lon: 36.1613, plate: '31' },
  { name: 'Isparta', lat: 37.7648, lon: 30.5566, plate: '32' },
  { name: 'Mersin', lat: 36.8000, lon: 34.6333, plate: '33' },
  { name: 'İstanbul', lat: 41.0082, lon: 28.9784, plate: '34' },
  { name: 'İzmir', lat: 38.4192, lon: 27.1287, plate: '35' },
  { name: 'Kars', lat: 40.6013, lon: 43.0975, plate: '36' },
  { name: 'Kastamonu', lat: 41.3887, lon: 33.7827, plate: '37' },
  { name: 'Kayseri', lat: 38.7312, lon: 35.4787, plate: '38' },
  { name: 'Kırklareli', lat: 41.7333, lon: 27.2167, plate: '39' },
  { name: 'Kırşehir', lat: 39.1425, lon: 34.1709, plate: '40' },
  { name: 'Kocaeli / İzmit', lat: 40.7654, lon: 29.9408, plate: '41' },
  { name: 'Konya', lat: 37.8667, lon: 32.4833, plate: '42' },
  { name: 'Kütahya', lat: 39.4167, lon: 29.9833, plate: '43' },
  { name: 'Malatya', lat: 38.3552, lon: 38.3095, plate: '44' },
  { name: 'Manisa', lat: 38.6191, lon: 27.4289, plate: '45' },
  { name: 'Kahramanmaraş', lat: 37.5858, lon: 36.9371, plate: '46' },
  { name: 'Mardin', lat: 37.3212, lon: 40.7245, plate: '47' },
  { name: 'Muğla', lat: 37.2153, lon: 28.3636, plate: '48' },
  { name: 'Muş', lat: 38.7432, lon: 41.5064, plate: '49' },
  { name: 'Nevşehir / Kapadokya', lat: 38.6250, lon: 34.7122, plate: '50' },
  { name: 'Niğde', lat: 37.9667, lon: 34.6833, plate: '51' },
  { name: 'Ordu', lat: 40.9839, lon: 37.8764, plate: '52' },
  { name: 'Rize', lat: 41.0201, lon: 40.5234, plate: '53' },
  { name: 'Sakarya / Adapazarı', lat: 40.7569, lon: 30.3783, plate: '54' },
  { name: 'Samsun', lat: 41.2867, lon: 36.3300, plate: '55' },
  { name: 'Siirt', lat: 37.9333, lon: 41.9500, plate: '56' },
  { name: 'Sinop', lat: 42.0231, lon: 35.1531, plate: '57' },
  { name: 'Sivas', lat: 39.7477, lon: 37.0179, plate: '58' },
  { name: 'Tekirdağ', lat: 40.9833, lon: 27.5167, plate: '59' },
  { name: 'Tokat', lat: 40.3167, lon: 36.5500, plate: '60' },
  { name: 'Trabzon', lat: 41.0015, lon: 39.7178, plate: '61' },
  { name: 'Tunceli', lat: 39.1079, lon: 39.5401, plate: '62' },
  { name: 'Şanlıurfa', lat: 37.1674, lon: 38.7955, plate: '63' },
  { name: 'Uşak', lat: 38.6823, lon: 29.4082, plate: '64' },
  { name: 'Van', lat: 38.4891, lon: 43.4089, plate: '65' },
  { name: 'Yozgat', lat: 39.8181, lon: 34.8147, plate: '66' },
  { name: 'Zonguldak', lat: 41.4564, lon: 31.7987, plate: '67' },
  { name: 'Aksaray', lat: 38.3687, lon: 34.0370, plate: '68' },
  { name: 'Bayburt', lat: 40.2552, lon: 40.2249, plate: '69' },
  { name: 'Karaman', lat: 37.1759, lon: 33.2287, plate: '70' },
  { name: 'Kırıkkale', lat: 39.8468, lon: 33.5153, plate: '71' },
  { name: 'Batman', lat: 37.8812, lon: 41.1293, plate: '72' },
  { name: 'Şırnak', lat: 37.5164, lon: 42.4594, plate: '73' },
  { name: 'Bartın', lat: 41.6344, lon: 32.3375, plate: '74' },
  { name: 'Ardahan', lat: 41.1105, lon: 42.7022, plate: '75' },
  { name: 'Iğdır', lat: 39.9196, lon: 44.0458, plate: '76' },
  { name: 'Yalova', lat: 40.6500, lon: 29.2667, plate: '77' },
  { name: 'Karabük / Safranbolu', lat: 41.2061, lon: 32.6204, plate: '78' },
  { name: 'Kilis', lat: 36.7184, lon: 37.1212, plate: '79' },
  { name: 'Osmaniye', lat: 37.0742, lon: 36.2472, plate: '80' },
  { name: 'Düzce', lat: 40.8438, lon: 31.1565, plate: '81' }
];

function normalizeTr(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

class WeatherManager {
  constructor() {
    this.currentCity = window.appStorage.get('assistant_selected_city', TURKEY_CITIES[33]); // Varsayılan İstanbul
    this.selectedCity = this.currentCity.name;
    this.weatherData = null;
    this.isLoading = false;

    setTimeout(() => {
      this.fetchWeather();
    }, 100);

    setInterval(() => {
      this.fetchWeather();
    }, 600000);
  }

  getWeatherCodeInfo(code) {
    if (code === 0) return { label: 'Açık & Güneşli', icon: 'sun', color: 'text-amber-400' };
    if (code === 1 || code === 2) return { label: 'Parçalı Bulutlu', icon: 'cloud-sun', color: 'text-amber-300' };
    if (code === 3) return { label: 'Çok Bulutlu', icon: 'cloud', color: 'text-slate-300' };
    if (code >= 45 && code <= 48) return { label: 'Sisli / Puslu', icon: 'cloud-fog', color: 'text-slate-400' };
    if (code >= 51 && code <= 55) return { label: 'Hafif Çisenti', icon: 'cloud-drizzle', color: 'text-sky-300' };
    if (code >= 61 && code <= 65) return { label: 'Yağmurlu', icon: 'cloud-rain', color: 'text-blue-400' };
    if (code >= 71 && code <= 77) return { label: 'Karlı', icon: 'cloud-snow', color: 'text-sky-200' };
    if (code >= 80 && code <= 82) return { label: 'Sağanak Yağış', icon: 'cloud-lightning', color: 'text-indigo-400' };
    if (code >= 95) return { label: 'Fırtına', icon: 'zap', color: 'text-amber-400' };
    return { label: 'Parçalı Bulutlu', icon: 'cloud-sun', color: 'text-amber-300' };
  }

  async fetchWeather() {
    this.isLoading = true;
    this.renderHeaderWeatherPill();

    try {
      let response = await fetch(`/api/weather?lat=${this.currentCity.lat}&lon=${this.currentCity.lon}`);
      if (!response.ok) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.currentCity.lat}&longitude=${this.currentCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        response = await fetch(url);
      }
      
      if (!response.ok) throw new Error('Hava durumu verisi alınamadı');
      this.weatherData = await response.json();
    } catch (err) {
      console.log('Hava durumu fallback verisi kullanılıyor:', err);
      this.weatherData = {
        current: {
          temperature_2m: 24,
          apparent_temperature: 24,
          relative_humidity_2m: 55,
          wind_speed_10m: 12,
          weather_code: 1
        }
      };
    } finally {
      this.isLoading = false;
      this.renderHeaderWeatherPill();
      this.renderWeatherCard();
    }
  }

  setCity(cityName) {
    const q = normalizeTr(cityName.trim());
    const city = TURKEY_CITIES.find(c => normalizeTr(c.name) === q || normalizeTr(c.name).includes(q) || (c.plate && c.plate === q));
    
    if (city) {
      this.currentCity = city;
      this.selectedCity = city.name;
      window.appStorage.save('assistant_selected_city', city);
      this.fetchWeather();
      
      if (window.cityLifeManager && typeof window.cityLifeManager.fetchLiveFuel === 'function') {
        window.cityLifeManager.fetchLiveFuel();
      }

      const modal = document.getElementById('changeCityModal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (window.app) {
        window.app.showToast(`${city.name} hava durumu yüklendi`, 'success');
      }
    }
  }

  openCityModal() {
    this.renderCityGrid('');
    const input = document.getElementById('weatherCitySearchInput');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }
    const currentNameEl = document.getElementById('weatherCurrentSelectedCityName');
    if (currentNameEl) {
      currentNameEl.textContent = this.currentCity.name;
    }
    
    const modal = document.getElementById('changeCityModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  filterCityList(query) {
    this.renderCityGrid(query);
  }

  renderCityGrid(query = '') {
    const container = document.getElementById('weatherCityGridContainer');
    if (!container) return;

    const q = normalizeTr(query.trim());
    let filtered = TURKEY_CITIES;
    if (q) {
      filtered = TURKEY_CITIES.filter(c => 
        normalizeTr(c.name).includes(q) || 
        (c.plate && c.plate.includes(q))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-8 text-center text-xs text-slate-400">
          <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-1.5 text-slate-500"></i>
          "${query}" ile eşleşen şehir bulunamadı.
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = filtered.map(c => {
      const isSelected = this.currentCity.name === c.name;
      return `
        <button 
          type="button" 
          onclick="window.weatherManager.setCity('${c.name}')" 
          class="flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
            isSelected 
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' 
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
          }"
        >
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-slate-800 text-[10px] font-mono flex items-center justify-center font-bold text-slate-400">
              ${c.plate || '--'}
            </span>
            <span class="truncate">${c.name}</span>
          </div>
          ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0"></i>' : ''}
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  renderWeatherCard() {
    // Varsa kart render
  }

  renderHeaderWeatherPill() {
    const pill = document.getElementById('headerWeatherPill');
    if (!pill) return;

    if (this.isLoading || !this.weatherData || !this.weatherData.current) {
      pill.innerHTML = `
        <i data-lucide="cloud-sun" class="w-4 h-4 text-amber-400 animate-pulse"></i>
        <div class="flex items-baseline gap-1.5">
          <span class="font-bold text-white text-xs">${this.currentCity.name}</span>
          <span class="font-mono font-bold text-amber-300 text-xs">--°</span>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const curr = this.weatherData.current || {};
    const codeInfo = this.getWeatherCodeInfo(curr.weather_code || 0);
    const temp = Math.round(curr.temperature_2m || 20);

    pill.innerHTML = `
      <i data-lucide="${codeInfo.icon}" class="w-4 h-4 ${codeInfo.color} flex-shrink-0"></i>
      <div class="flex items-baseline gap-1.5 min-w-0">
        <span class="font-bold text-white text-xs truncate">${this.currentCity.name}</span>
        <span class="font-mono font-black text-amber-300 text-xs">${temp}°</span>
      </div>
      <span class="text-[11px] text-slate-400 hidden md:inline truncate">· ${codeInfo.label}</span>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
}

window.TURKEY_CITIES = TURKEY_CITIES;
window.weatherManager = new WeatherManager();
