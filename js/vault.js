/**
 * Secure Vault & Executive Profile Manager (js/vault.js)
 * Ultra-secure personal data repository with PIN protection, field masking, and one-click sharing
 */

const DEFAULT_VAULT_SCHEMA = {
  identity: {
    fullName: 'Sayın Yönetici',
    title: 'Şirket Yöneticisi / Kurucu Ortak',
    tcKimlik: '12345678901',
    birthDate: '1988-04-12',
    bloodType: 'A Rh+',
    passportNo: 'U18945623',
    drivingLicenseNo: 'TR-894125',
    emergencyContact: 'Aile / Yakın İrtibat (+90 532 000 00 00)'
  },
  banking: [
    {
      id: 'bank_1',
      bankName: 'Garanti BBVA',
      accountName: 'Ana Vadesiz TL Hesabı',
      iban: 'TR12 0006 2000 0001 2345 6789 01',
      currency: 'TRY',
      isDefault: true
    },
    {
      id: 'bank_2',
      bankName: 'İş Bankası',
      accountName: 'Ticari Şirket Hesabı',
      iban: 'TR64 0006 4000 0012 3456 7890 12',
      currency: 'TRY',
      isDefault: false
    },
    {
      id: 'bank_3',
      bankName: 'Yapı Kredi',
      accountName: 'Döviz (USD) Hesabı',
      iban: 'TR88 0006 7010 0000 0098 7654 32',
      currency: 'USD',
      isDefault: false
    }
  ],
  company: {
    companyName: 'Örnek Ticaret ve Danışmanlık A.Ş.',
    taxOffice: 'Beşiktaş Vergi Dairesi',
    taxNumber: '1234567890',
    mersisNo: '0123456789000001',
    tradeRegistryNo: '123456-5',
    billingAddress: 'Levent Mah. Büyükdere Cad. No:123/4 Beşiktaş / İstanbul'
  },
  addresses: [
    {
      id: 'addr_1',
      title: 'Ofis / Şirket Teslimat Adresi',
      address: 'Levent Mah. Büyükdere Cad. No:123/4 Kat:5 Beşiktaş / İstanbul',
      recipient: 'Sayın Yönetici (+90 532 000 00 00)',
      isDefault: true
    },
    {
      id: 'addr_2',
      title: 'Ev / Kişisel Adres',
      address: 'Fenerbahçe Mah. Kalamış Cad. No:45 Daire:8 Kadıköy / İstanbul',
      recipient: 'Sayın Yönetici (+90 532 000 00 00)',
      isDefault: false
    }
  ],
  secretNotes: [
    {
      id: 'note_1',
      title: 'Merkez Ofis VIP Wi-Fi & Şifresi',
      content: 'Ağ: Executive-5G\nŞifre: VipPass2026!Sec\nIP: 192.168.1.1',
      category: 'Ağ & Güvenlik'
    },
    {
      id: 'note_2',
      title: 'Yönetim Yazılımı Master Lisans Kodu',
      content: 'Lisans: AGY-PRO-2026-9874-ABCD-KEY',
      category: 'Lisans'
    }
  ]
};

class VaultManager {
  constructor() {
    this.vaultData = this.loadData();
    this.isUnlocked = false;
    this.visibleFields = {};
    this.autoLockTimer = null;
  }

  loadData() {
    const saved = window.appStorage.get(STORAGE_KEYS.VAULT, null);
    if (!saved || typeof saved !== 'object') {
      window.appStorage.save(STORAGE_KEYS.VAULT, DEFAULT_VAULT_SCHEMA, false);
      return JSON.parse(JSON.stringify(DEFAULT_VAULT_SCHEMA));
    }
    return saved;
  }

  save() {
    window.appStorage.save(STORAGE_KEYS.VAULT, this.vaultData);
    this.render();
  }

  getPin() {
    return window.appStorage.get(STORAGE_KEYS.VAULT_PIN, DEFAULT_VAULT_PIN);
  }

  unlock(pinInput) {
    const correctPin = this.getPin();
    const cleanInput = (pinInput || '').toString().trim();

    if (cleanInput === correctPin.toString().trim()) {
      this.isUnlocked = true;
      this.resetAutoLockTimer();
      this.render();
      if (window.app) window.app.showToast('🔓 Güvenli Kasa Kilidi Açıldı', 'success');
      return true;
    } else {
      if (window.app) window.app.showToast('Hatalı PIN Kodu!', 'error');
      const errBanner = document.getElementById('vaultPinError');
      if (errBanner) {
        errBanner.classList.remove('hidden');
        errBanner.classList.remove('animate-shake');
        void errBanner.offsetWidth;
        errBanner.classList.add('animate-shake');
      }
      return false;
    }
  }

  lock() {
    this.isUnlocked = false;
    this.visibleFields = {};
    if (this.autoLockTimer) clearTimeout(this.autoLockTimer);
    this.render();
    if (window.app) window.app.showToast('🔒 Güvenli Kasa Kilitlendi', 'info');
  }

  resetAutoLockTimer() {
    if (this.autoLockTimer) clearTimeout(this.autoLockTimer);
    this.autoLockTimer = setTimeout(() => {
      if (this.isUnlocked) {
        this.lock();
      }
    }, 5 * 60 * 1000);
  }

  toggleFieldVisibility(fieldKey) {
    this.visibleFields[fieldKey] = !this.visibleFields[fieldKey];
    this.render();
  }

  maskValue(val, type = 'text', fieldKey = '') {
    if (!val) return '—';
    if (this.visibleFields[fieldKey]) return val;

    const str = val.toString().trim();
    if (type === 'tc') {
      if (str.length >= 11) return `${str.substring(0, 3)}*****${str.substring(8)}`;
      return `${str.substring(0, 2)}*****`;
    }
    if (type === 'iban') {
      const clean = str.replace(/\s+/g, '');
      if (clean.length >= 26) {
        return `${clean.substring(0, 4)} **** **** **** **** **** ${clean.substring(clean.length - 2)}`;
      }
      return `${clean.substring(0, 4)} **** **** ****`;
    }
    if (type === 'tax') {
      if (str.length >= 10) return `${str.substring(0, 2)}******${str.substring(8)}`;
      return `${str.substring(0, 2)}******`;
    }
    if (type === 'passport' || type === 'secret') {
      if (str.length > 4) return `${str.substring(0, 2)}••••••${str.substring(str.length - 2)}`;
      return '••••••••';
    }
    return str;
  }

  async copyToClipboard(text, label = 'Bilgi') {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text.toString().trim());
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text.toString().trim();
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (window.app) {
        window.app.showToast(`📋 ${label} panoya kopyalandı`, 'success');
      }
    } catch (e) {
      console.error('Kopyalama hatası:', e);
      if (window.app) window.app.showToast('Kopyalama başarısız oldu', 'error');
    }
  }

  generateShareText(type, targetId = null) {
    if (type === 'bank') {
      const bank = this.vaultData.banking.find(b => b.id === targetId) || this.vaultData.banking.find(b => b.isDefault) || this.vaultData.banking[0];
      if (!bank) return '';
      const holder = this.vaultData.identity.fullName || 'Hesap Sahibi';
      return `🏦 BANKA & HESAP BİLGİLERİ\n---------------------------\nBanka: ${bank.bankName}\nHesap Sahibi: ${holder}\nIBAN: ${bank.iban}\nPara Birimi: ${bank.currency || 'TRY'}`;
    }
    if (type === 'billing') {
      const c = this.vaultData.company;
      return `🏢 FATURA & ŞİRKET BİLGİLERİ\n---------------------------\nUnvan: ${c.companyName}\nVergi Dairesi: ${c.taxOffice}\nVergi No: ${c.taxNumber}\nMERSİS No: ${c.mersisNo || '—'}\nAdres: ${c.billingAddress}`;
    }
    if (type === 'address') {
      const addr = this.vaultData.addresses.find(a => a.id === targetId) || this.vaultData.addresses.find(a => a.isDefault) || this.vaultData.addresses[0];
      if (!addr) return '';
      return `📦 TESLİMAT & KARGO ADRESİ\n---------------------------\nBaşlık: ${addr.title}\nAlıcı / İletişim: ${addr.recipient}\nAdres: ${addr.address}`;
    }
    if (type === 'identity') {
      const id = this.vaultData.identity;
      return `👤 KİŞİSEL KİMLİK BİLGİLERİ\n---------------------------\nAd Soyad: ${id.fullName}\nUnvan: ${id.title}\nT.C. Kimlik No: ${id.tcKimlik}\nDoğum Tarihi: ${id.birthDate}\nKan Grubu: ${id.bloodType}\nAcil İrtibat: ${id.emergencyContact}`;
    }
    return '';
  }

  copyShareSnippet(type, targetId = null, label = 'Paylaşım bilgisi') {
    const text = this.generateShareText(type, targetId);
    if (text) {
      this.copyToClipboard(text, label);
    }
  }

  render() {
    const container = document.getElementById('vaultTabContent');
    if (!container) return;

    if (!this.isUnlocked) {
      container.innerHTML = this.renderLockScreen();
    } else {
      container.innerHTML = this.renderUnlockedDashboard();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderLockScreen() {
    return `
      <div class="max-w-md mx-auto py-12 px-4">
        <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-8 text-center space-y-6 relative overflow-hidden">
          <div class="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 animate-pulse">
            <i data-lucide="shield-check" class="w-8 h-8"></i>
          </div>

          <div>
            <h2 class="text-xl font-bold text-white flex items-center justify-center gap-2">
              VIP Güvenli Kasa & Profil
              <span class="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">KORUMALI</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Kişisel kimlik, IBAN, fatura ve şifreli bilgilerinize erişmek için lütfen 4 haneli Kasa PIN kodunuzu girin.
            </p>
          </div>

          <div id="vaultPinError" class="hidden p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center justify-center gap-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i>
            <span>Hatalı PIN kodu! Tekrar deneyin.</span>
          </div>

          <!-- PIN Giriş Formu -->
          <form onsubmit="event.preventDefault(); window.vaultManager.unlock(document.getElementById('vaultPinInput').value);" class="space-y-4">
            <div class="relative max-w-[200px] mx-auto">
              <input 
                type="password" 
                id="vaultPinInput" 
                maxlength="6" 
                pattern="[0-9]*" 
                inputmode="numeric" 
                placeholder="••••" 
                required
                autocomplete="off"
                class="w-full text-center text-2xl font-mono tracking-[0.5em] py-3.5 bg-slate-950 border border-amber-500/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-inner"
              >
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 px-2">
              <span>Varsayılan PIN: <code class="text-amber-400 font-mono">1234</code></span>
              <button type="button" onclick="window.vaultManager.openChangePinModal()" class="text-amber-400/80 hover:text-amber-300 underline cursor-pointer">PIN Değiştir</button>
            </div>

            <button 
              type="submit" 
              class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <i data-lucide="unlock" class="w-4 h-4"></i>
              <span>Kasayı Aç & Bilgileri Göster</span>
            </button>
          </form>

          <div class="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-500"></i>
            <span>Verileriniz tarayıcınızda şifreli olarak saklanır.</span>
          </div>

        </div>
      </div>
    `;
  }

  renderUnlockedDashboard() {
    const id = this.vaultData.identity;
    const comp = this.vaultData.company;

    return `
      <div class="space-y-6">
        
        <!-- ÜST BANNER -->
        <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-lg font-bold text-white">${escapeHtml(id.fullName)}</h2>
                  <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🔓 VIP MASTER KASA</span>
                </div>
                <p class="text-xs text-slate-400">${escapeHtml(id.title || 'Kişisel & Ticari Bilgi Kasası')}</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.vaultManager.copyShareSnippet('identity', null, 'Tüm Kimlik Bilgileri')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="share-2" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>Kimliği Paylaş</span>
              </button>

              <button onclick="window.vaultManager.openChangePinModal()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="key" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>PIN Değiştir</span>
              </button>

              <button onclick="window.vaultManager.lock()" class="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                <span>Kasayı Kilitle</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 ANA KATEGORİ -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- 1. KİŞİSEL KİMLİK -->
          <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <i data-lucide="user-check" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white">Kişisel Kimlik Bilgileri</h3>
                  <p class="text-[10px] text-slate-400">T.C., Pasaport, Ehliyet & İrtibat</p>
                </div>
              </div>
              
              <button onclick="window.vaultManager.openEditIdentityModal()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 cursor-pointer">
                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                <span>Düzenle</span>
              </button>
            </div>

            <div class="space-y-2.5 pt-1">
              <div class="flex items-center justify-between py-2 border-b border-slate-700/30">
                <div>
                  <span class="text-[10px] text-slate-400 block font-medium">T.C. Kimlik Numarası</span>
                  <span class="font-mono text-xs font-bold text-white tracking-wider">${this.maskValue(id.tcKimlik, 'tc', 'tcKimlik')}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button onclick="window.vaultManager.toggleFieldVisibility('tcKimlik')" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer">
                    <i data-lucide="${this.visibleFields['tcKimlik'] ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="window.vaultManager.copyToClipboard('${id.tcKimlik}', 'T.C. Kimlik No')" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <i data-lucide="copy" class="w-3 h-3"></i>
                    <span>Kopyala</span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                  <div class="min-w-0 pr-1">
                    <span class="text-[10px] text-slate-400 block font-medium">Pasaport No</span>
                    <span class="font-mono text-xs font-bold text-white truncate block">${this.maskValue(id.passportNo, 'passport', 'passportNo')}</span>
                  </div>
                  <button onclick="window.vaultManager.copyToClipboard('${id.passportNo}', 'Pasaport No')" class="p-1.5 rounded-lg text-amber-400 hover:bg-slate-800 cursor-pointer flex-shrink-0">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  </button>
                </div>

                <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                  <div class="min-w-0 pr-1">
                    <span class="text-[10px] text-slate-400 block font-medium">Ehliyet Seri No</span>
                    <span class="font-mono text-xs font-bold text-white truncate block">${escapeHtml(id.drivingLicenseNo || '—')}</span>
                  </div>
                  <button onclick="window.vaultManager.copyToClipboard('${id.drivingLicenseNo}', 'Ehliyet No')" class="p-1.5 rounded-lg text-amber-400 hover:bg-slate-800 cursor-pointer flex-shrink-0">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 block font-medium">Doğum Tarihi</span>
                  <span class="text-xs font-bold text-white">${escapeHtml(id.birthDate || '—')}</span>
                </div>

                <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 block font-medium">Kan Grubu</span>
                  <span class="text-xs font-bold text-rose-400">${escapeHtml(id.bloodType || '—')}</span>
                </div>
              </div>

              <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-rose-300 block font-medium">🚨 Acil Durum İletişim</span>
                  <span class="text-xs font-semibold text-slate-200">${escapeHtml(id.emergencyContact || '—')}</span>
                </div>
                <button onclick="window.vaultManager.copyToClipboard('${id.emergencyContact}', 'Acil Durum İrtibat')" class="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold cursor-pointer">
                  Kopyala
                </button>
              </div>
            </div>
          </div>

          <!-- 2. BANKA HESAPLARI <IBAN> -->
          <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <i data-lucide="credit-card" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white">Banka Hesapları & IBAN'lar</h3>
                  <p class="text-[10px] text-slate-400">Tek Tıkla IBAN Kopyalama & Paylaşma</p>
                </div>
              </div>

              <button onclick="window.vaultManager.openAddBankModal()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-500/10">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Hesap Ekle</span>
              </button>
            </div>

            <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              ${this.vaultData.banking.map(bank => `
                <div class="py-3 border-b border-slate-700/30 last:border-0 space-y-2 ${bank.isDefault ? 'relative before:absolute before:left-0 before:top-3 before:bottom-3 before:w-0.5 before:bg-amber-400 before:rounded-r' : ''} pl-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-white">${escapeHtml(bank.bankName)}</span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">${escapeHtml(bank.currency || 'TRY')}</span>
                      ${bank.isDefault ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">VARSAYILAN</span>' : ''}
                    </div>
                    
                    <div class="flex items-center gap-1">
                      <button onclick="window.vaultManager.copyShareSnippet('bank', '${bank.id}', '${bank.bankName} IBAN Paylaşımı')" title="Paylaş Metnini Kopyala" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                        <i data-lucide="share-2" class="w-3 h-3"></i>
                        <span>Paylaş</span>
                      </button>
                      <button onclick="window.vaultManager.deleteBank('${bank.id}')" class="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer" title="Sil">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>

                  <div class="flex items-center justify-between gap-2 pt-1">
                    <div class="min-w-0 flex-1">
                      <span class="text-[9px] text-slate-500 block uppercase font-mono">${escapeHtml(bank.accountName || 'IBAN')}</span>
                      <span class="font-mono text-xs font-bold text-amber-300 tracking-wider truncate block">${this.maskValue(bank.iban, 'iban', 'bank_' + bank.id)}</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <button onclick="window.vaultManager.toggleFieldVisibility('bank_${bank.id}')" class="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer">
                        <i data-lucide="${this.visibleFields['bank_' + bank.id] ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.vaultManager.copyToClipboard('${bank.iban}', '${bank.bankName} IBAN')" class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm">
                        <i data-lucide="copy" class="w-3 h-3"></i>
                        <span>IBAN</span>
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. ŞİRKET & FATURA -->
          <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <i data-lucide="building-2" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white">Şirket & Fatura Bilgileri</h3>
                  <p class="text-[10px] text-slate-400">Vergi No, Daire & Fatura Adresi</p>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <button onclick="window.vaultManager.copyShareSnippet('billing', null, 'Fatura Bilgileri')" class="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                  <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
                  <span>Faturayı Paylaş</span>
                </button>
                <button onclick="window.vaultManager.openEditCompanyModal()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs cursor-pointer">
                  <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

            <div class="space-y-2.5 pt-1">
              <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                <div class="min-w-0 pr-2">
                  <span class="text-[10px] text-slate-400 block font-medium">Resmi Şirket Unvanı</span>
                  <span class="text-xs font-bold text-white truncate block">${escapeHtml(comp.companyName || '—')}</span>
                </div>
                <button onclick="window.vaultManager.copyToClipboard('${comp.companyName}', 'Şirket Unvanı')" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold cursor-pointer">
                  Kopyala
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                  <div class="min-w-0 pr-1">
                    <span class="text-[10px] text-slate-400 block font-medium">Vergi Dairesi</span>
                    <span class="text-xs font-bold text-white truncate block">${escapeHtml(comp.taxOffice || '—')}</span>
                  </div>
                  <button onclick="window.vaultManager.copyToClipboard('${comp.taxOffice}', 'Vergi Dairesi')" class="p-1 text-amber-400 hover:bg-slate-800 rounded cursor-pointer">
                    <i data-lucide="copy" class="w-3 h-3"></i>
                  </button>
                </div>

                <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                  <div class="min-w-0 pr-1">
                    <span class="text-[10px] text-slate-400 block font-medium">Vergi No</span>
                    <span class="font-mono text-xs font-bold text-amber-300 truncate block">${this.maskValue(comp.taxNumber, 'tax', 'taxNumber')}</span>
                  </div>
                  <div class="flex items-center">
                    <button onclick="window.vaultManager.toggleFieldVisibility('taxNumber')" class="p-1 text-slate-400 hover:text-white cursor-pointer">
                      <i data-lucide="${this.visibleFields['taxNumber'] ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.vaultManager.copyToClipboard('${comp.taxNumber}', 'Vergi No')" class="p-1 text-amber-400 hover:bg-slate-800 rounded cursor-pointer">
                      <i data-lucide="copy" class="w-3 h-3"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="py-2 border-b border-slate-700/30 last:border-0 flex items-center justify-between">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 font-medium">Resmi Fatura Adresi</span>
                  <button onclick="window.vaultManager.copyToClipboard('${comp.billingAddress}', 'Fatura Adresi')" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-semibold cursor-pointer">
                    Kopyala
                  </button>
                </div>
                <p class="text-xs text-slate-200 leading-relaxed font-sans">${escapeHtml(comp.billingAddress || '—')}</p>
              </div>
            </div>
          </div>

          <!-- 4. TESLİMAT ADRESLERİ -->
          <div class="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                  <i data-lucide="map-pin" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white">Teslimat & Kargo Adresleri</h3>
                  <p class="text-[10px] text-slate-400">Kurye ve Kargo İçin Hızlı Adres</p>
                </div>
              </div>

              <button onclick="window.vaultManager.openAddAddressModal()" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-sky-500/10">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Adres Ekle</span>
              </button>
            </div>

            <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              ${this.vaultData.addresses.map(addr => `
                <div class="py-3 border-b border-slate-700/30 last:border-0 space-y-2 ${addr.isDefault ? 'relative before:absolute before:left-0 before:top-3 before:bottom-3 before:w-0.5 before:bg-sky-400 before:rounded-r' : ''} pl-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-white">${escapeHtml(addr.title)}</span>
                      ${addr.isDefault ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">VARSAYILAN</span>' : ''}
                    </div>

                    <div class="flex items-center gap-1">
                      <button onclick="window.vaultManager.copyShareSnippet('address', '${addr.id}', '${addr.title} Kargo Adresi')" title="Paylaşım Formatında Kopyala" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                        <i data-lucide="share-2" class="w-3 h-3"></i>
                        <span>Paylaş</span>
                      </button>
                      <button onclick="window.vaultManager.deleteAddress('${addr.id}')" class="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer" title="Sil">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-slate-200 font-sans leading-relaxed">${escapeHtml(addr.address)}</p>
                  
                  <div class="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span>Alıcı: <strong class="text-slate-300">${escapeHtml(addr.recipient || id.fullName)}</strong></span>
                    <button onclick="window.vaultManager.copyToClipboard('${addr.address}', 'Adres')" class="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-xs font-semibold cursor-pointer">
                      Adresi Kopyala
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 5. ÖZEL GİZLİ NOTLAR -->
          <div class="lg:col-span-2 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-800/60 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <i data-lucide="key-round" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white">Özel Gizli Notlar & Şifre Kasası</h3>
                  <p class="text-[10px] text-slate-400">Wi-Fi, Lisanslar & Özel Kodlar</p>
                </div>
              </div>

              <button onclick="window.vaultManager.openAddSecretModal()" class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-purple-500/10">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Gizli Not Ekle</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${this.vaultData.secretNotes.map(note => `
                <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-700/30 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-white">${escapeHtml(note.title)}</span>
                      <span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">${escapeHtml(note.category || 'Gizli')}</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <button onclick="window.vaultManager.toggleFieldVisibility('note_${note.id}')" class="p-1 text-slate-400 hover:text-white cursor-pointer" title="Gizle/Göster">
                        <i data-lucide="${this.visibleFields['note_' + note.id] ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.vaultManager.copyToClipboard('${note.content}', '${note.title}')" class="p-1 text-purple-400 hover:bg-slate-800 rounded cursor-pointer" title="Kopyala">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.vaultManager.deleteSecret('${note.id}')" class="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer" title="Sil">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>

                  <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-purple-200 whitespace-pre-wrap select-all">
                    ${this.visibleFields['note_' + note.id] ? escapeHtml(note.content) : '••••••••••••••••••••••••'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  openEditIdentityModal() {
    const id = this.vaultData.identity;
    const modal = document.getElementById('vaultEditIdentityModal');
    if (!modal) return;

    document.getElementById('vaultIdFullName').value = id.fullName || '';
    document.getElementById('vaultIdTitle').value = id.title || '';
    document.getElementById('vaultIdTc').value = id.tcKimlik || '';
    document.getElementById('vaultIdBirth').value = id.birthDate || '';
    document.getElementById('vaultIdBlood').value = id.bloodType || 'A Rh+';
    document.getElementById('vaultIdPassport').value = id.passportNo || '';
    document.getElementById('vaultIdDriving').value = id.drivingLicenseNo || '';
    document.getElementById('vaultIdEmergency').value = id.emergencyContact || '';

    if (window.app) window.app.openModal('vaultEditIdentityModal');
  }

  saveIdentityFromModal(formData) {
    this.vaultData.identity = {
      fullName: formData.fullName.trim(),
      title: formData.title.trim(),
      tcKimlik: formData.tcKimlik.trim(),
      birthDate: formData.birthDate,
      bloodType: formData.bloodType,
      passportNo: formData.passportNo.trim(),
      drivingLicenseNo: formData.drivingLicenseNo.trim(),
      emergencyContact: formData.emergencyContact.trim()
    };
    this.save();
    if (window.app) {
      window.app.closeModal('vaultEditIdentityModal');
      window.app.showToast('Kimlik bilgileri güncellendi', 'success');
    }
  }

  openEditCompanyModal() {
    const comp = this.vaultData.company;
    const modal = document.getElementById('vaultEditCompanyModal');
    if (!modal) return;

    document.getElementById('vaultCompName').value = comp.companyName || '';
    document.getElementById('vaultCompTaxOffice').value = comp.taxOffice || '';
    document.getElementById('vaultCompTaxNumber').value = comp.taxNumber || '';
    document.getElementById('vaultCompMersis').value = comp.mersisNo || '';
    document.getElementById('vaultCompAddress').value = comp.billingAddress || '';

    if (window.app) window.app.openModal('vaultEditCompanyModal');
  }

  saveCompanyFromModal(formData) {
    this.vaultData.company = {
      companyName: formData.companyName.trim(),
      taxOffice: formData.taxOffice.trim(),
      taxNumber: formData.taxNumber.trim(),
      mersisNo: formData.mersisNo.trim(),
      tradeRegistryNo: this.vaultData.company.tradeRegistryNo || '',
      billingAddress: formData.billingAddress.trim()
    };
    this.save();
    if (window.app) {
      window.app.closeModal('vaultEditCompanyModal');
      window.app.showToast('Şirket & fatura bilgileri güncellendi', 'success');
    }
  }

  openAddBankModal() {
    const form = document.getElementById('vaultAddBankForm');
    if (form) form.reset();
    if (window.app) window.app.openModal('vaultAddBankModal');
  }

  saveBankFromModal(data) {
    const newBank = {
      id: 'bank_' + Date.now(),
      bankName: data.bankName.trim(),
      accountName: data.accountName.trim() || 'Vadesiz Hesap',
      iban: data.iban.trim().toUpperCase(),
      currency: data.currency || 'TRY',
      isDefault: data.isDefault === true || data.isDefault === 'true'
    };

    if (newBank.isDefault) {
      this.vaultData.banking.forEach(b => (b.isDefault = false));
    }

    this.vaultData.banking.push(newBank);
    this.save();
    if (window.app) {
      window.app.closeModal('vaultAddBankModal');
      window.app.showToast(`${newBank.bankName} IBAN hesabı eklendi`, 'success');
    }
  }

  deleteBank(bankId) {
    if (!confirm('Bu banka hesabını kasadan silmek istediğinize emin misiniz?')) return;
    this.vaultData.banking = this.vaultData.banking.filter(b => b.id !== bankId);
    this.save();
    if (window.app) window.app.showToast('Banka hesabı silindi', 'info');
  }

  openAddAddressModal() {
    const form = document.getElementById('vaultAddAddressForm');
    if (form) form.reset();
    if (window.app) window.app.openModal('vaultAddAddressModal');
  }

  saveAddressFromModal(data) {
    const newAddr = {
      id: 'addr_' + Date.now(),
      title: data.title.trim(),
      address: data.address.trim(),
      recipient: data.recipient.trim() || this.vaultData.identity.fullName,
      isDefault: data.isDefault === true || data.isDefault === 'true'
    };

    if (newAddr.isDefault) {
      this.vaultData.addresses.forEach(a => (a.isDefault = false));
    }

    this.vaultData.addresses.push(newAddr);
    this.save();
    if (window.app) {
      window.app.closeModal('vaultAddAddressModal');
      window.app.showToast('Yeni teslimat adresi eklendi', 'success');
    }
  }

  deleteAddress(addrId) {
    if (!confirm('Bu adresi kasadan silmek istediğinize emin misiniz?')) return;
    this.vaultData.addresses = this.vaultData.addresses.filter(a => a.id !== addrId);
    this.save();
    if (window.app) window.app.showToast('Adres kaydı silindi', 'info');
  }

  openAddSecretModal() {
    const form = document.getElementById('vaultAddSecretForm');
    if (form) form.reset();
    if (window.app) window.app.openModal('vaultAddSecretModal');
  }

  saveSecretFromModal(data) {
    const newNote = {
      id: 'note_' + Date.now(),
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category.trim() || 'Gizli'
    };

    this.vaultData.secretNotes.push(newNote);
    this.save();
    if (window.app) {
      window.app.closeModal('vaultAddSecretModal');
      window.app.showToast('Gizli kasa notu eklendi', 'success');
    }
  }

  deleteSecret(noteId) {
    if (!confirm('Bu gizli notu silmek istediğinize emin misiniz?')) return;
    this.vaultData.secretNotes = this.vaultData.secretNotes.filter(n => n.id !== noteId);
    this.save();
    if (window.app) window.app.showToast('Gizli not silindi', 'info');
  }

  openChangePinModal() {
    const form = document.getElementById('vaultChangePinForm');
    if (form) form.reset();
    if (window.app) window.app.openModal('vaultChangePinModal');
  }

  changePinFromModal(oldPin, newPin, confirmPin) {
    const currentPin = this.getPin();
    if (oldPin.toString().trim() !== currentPin.toString().trim()) {
      if (window.app) window.app.showToast('Mevcut PIN hatalı!', 'error');
      return;
    }
    if (newPin !== confirmPin) {
      if (window.app) window.app.showToast('Yeni PIN kodları eşleşmiyor!', 'error');
      return;
    }
    if (newPin.length < 4) {
      if (window.app) window.app.showToast('PIN kodu en az 4 haneli olmalıdır', 'error');
      return;
    }

    window.appStorage.save(STORAGE_KEYS.VAULT_PIN, newPin);
    if (window.app) {
      window.app.closeModal('vaultChangePinModal');
      window.app.showToast('Kasa PIN kodu başarıyla değiştirildi', 'success');
    }
  }
}

window.vaultManager = new VaultManager();
