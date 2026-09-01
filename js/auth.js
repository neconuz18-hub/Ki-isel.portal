/**
 * AuthManager - Yönetici ve Kullanıcı Giriş Kontrolcüsü (v2)
 */
class AuthManager {
  constructor() {
    this.role = sessionStorage.getItem('portal_session_role') || null; 
    this.userId = sessionStorage.getItem('portal_session_userId') || null;
    this.adminPin = '1234';
  }

  isAuthenticated() { return this.role !== null; }
  getRole() { return this.role; }
  getUserId() { return this.userId; }

  showGateway() {
    const gateway = document.getElementById('gatewayOverlay');
    const sidebar = document.getElementById('mainSidebar');
    const header = document.querySelector('header.glass-header');
    if (gateway) gateway.classList.remove('hidden');
    if (sidebar) sidebar.classList.add('hidden');
    if (header) header.classList.add('hidden');

    this.renderGatewayUsers();
  }

  renderGatewayUsers() {
    const container = document.getElementById('gatewayUserList');
    if (!container) return;

    if (!window.userManager) {
      container.innerHTML = '<p class="text-xs text-slate-500 text-center py-2">Kullanıcı yöneticisi yükleniyor...</p>';
      return;
    }

    const users = window.userManager.getUsers() || [];
    if (users.length === 0) {
      container.innerHTML = '<p class="text-xs text-slate-500 text-center py-2">Henüz kayıtlı özel kullanıcı yok.</p>';
      return;
    }

    container.innerHTML = users.map(u => {
      const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
      const modCount = (u.assignedModules || []).length;
      const safeName = window.escapeHtml ? window.escapeHtml(u.name) : u.name;
      return `
        <button type="button" onclick="window.authManager.loginAsUser('${u.id}')" 
                class="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group text-left">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition-colors">
              ${initial}
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-200 group-hover:text-blue-300 truncate">${safeName}</div>
              <div class="text-[10px] text-slate-500">${modCount} Modül Tanımlı</div>
            </div>
          </div>
          <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"></i>
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  loginAsUser(userId) {
    if (window.userManager) {
      const user = window.userManager.getUserById(userId);
      if (user && user.pin) {
        const pin = prompt(`${user.name} için PIN giriniz:`);
        if (pin !== user.pin) {
          alert('Hatalı PIN!');
          return;
        }
      }
      window.userManager.applyUserContext(userId);
      this.role = 'USER';
      this.userId = userId;
      this.unlockApp();
    }
  }

  loginUser() {
    this.role = 'USER';
    this.userId = null;
    sessionStorage.setItem('portal_session_role', 'USER');
    sessionStorage.removeItem('portal_session_userId');
    sessionStorage.removeItem('portal_session_userName');
    this.unlockApp();
  }

  promptAdminLogin() {
    const pin = prompt('Yönetici PIN Kodunu Giriniz (1234):');
    if (pin === null) return; // İptal edildi
    if (pin === this.adminPin) {
      this.loginAdmin(pin);
    } else {
      alert('Hatalı PIN! Lütfen 1234 giriniz.');
    }
  }

  loginAdmin(pin) {
    if (pin === this.adminPin) {
      this.role = 'ADMIN';
      this.userId = 'admin';
      sessionStorage.setItem('portal_session_role', 'ADMIN');
      sessionStorage.setItem('portal_session_userId', 'admin');
      this.unlockApp();
      return true;
    }
    return false;
  }

  unlockApp() {
    const gateway = document.getElementById('gatewayOverlay');
    const sidebar = document.getElementById('mainSidebar');
    const header = document.querySelector('header.glass-header');
    
    if (gateway) gateway.classList.add('hidden');
    if (sidebar) sidebar.classList.remove('hidden');
    if (header) header.classList.remove('hidden');

    if (window.menuManager) window.menuManager.refreshByProfile();
    
    if (window.app && typeof window.app.initAfterAuth === 'function') {
      window.app.initAfterAuth();
    }

    if (this.role === 'ADMIN' && window.onboardingManager) {
      const profile = window.moduleRegistry?.profileManager?.loadProfile();
      if (!profile || !profile.presetId) {
        setTimeout(() => window.onboardingManager.open(), 300);
      }
    }
  }

  logout() {
    this.role = null;
    this.userId = null;
    sessionStorage.removeItem('portal_session_role');
    sessionStorage.removeItem('portal_session_userId');
    sessionStorage.removeItem('portal_session_userName');
    location.reload();
  }
}

window.authManager = new AuthManager();
console.log('[AuthManager] ✅ AuthManager Hazır.');
