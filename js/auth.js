/**
 * AuthManager - Yönetici ve Kullanıcı Giriş Kontrolcüsü
 */
class AuthManager {
  constructor() {
    this.role = sessionStorage.getItem('portal_session_role') || null; 
    this.adminPin = '1234';
  }

  isAuthenticated() { return this.role !== null; }
  getRole() { return this.role; }

  showGateway() {
    const gateway = document.getElementById('gatewayOverlay');
    const sidebar = document.getElementById('mainSidebar');
    const header = document.querySelector('header.glass-header');
    if (gateway) gateway.classList.remove('hidden');
    if (sidebar) sidebar.classList.add('hidden');
    if (header) header.classList.add('hidden');
  }

  loginUser() {
    this.role = 'USER';
    sessionStorage.setItem('portal_session_role', 'USER');
    this.unlockApp();
  }

  loginAdmin(pin) {
    if (pin === this.adminPin) {
      this.role = 'ADMIN';
      sessionStorage.setItem('portal_session_role', 'ADMIN');
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
      const profile = window.moduleRegistry.profileManager.loadProfile();
      if (!profile || !profile.presetId) {
        setTimeout(() => window.onboardingManager.open(), 300);
      }
    }
  }

  logout() {
    this.role = null;
    sessionStorage.removeItem('portal_session_role');
    location.reload();
  }
}
window.authManager = new AuthManager();
