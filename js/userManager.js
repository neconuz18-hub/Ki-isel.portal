/**
 * UserManager — Kullanıcı Yönetim Motoru
 */
class UserManager {
  constructor() {
    this.STORAGE_KEY = 'portal_users_directory_v2';
    this.USERS_PREFIX = 'portal_user_data_';
    this.users = this.loadUsers();
  }

  loadUsers() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      // Başlangıç için örnek bir kullanıcı listesi
      const initialUsers = [
        {
          id: 'usr_demo_1',
          name: 'Örnek Kullanıcı (Öğretmen)',
          phone: '0555 111 22 33',
          role: 'ogrenci',
          presetId: 'ogretmen_koc',
          assignedModules: ['dashboard', 'ogretmen', 'tasks', 'notes', 'reminders'],
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  saveUsers() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    if (window.authManager && typeof window.authManager.renderGatewayUsers === 'function') {
      window.authManager.renderGatewayUsers();
    }
  }

  getUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  createUser(userData) {
    const id = 'usr_' + Date.now();
    const newUser = {
      id,
      name: userData.name || 'Yeni Kullanıcı',
      phone: userData.phone || '',
      role: userData.role || 'genel',
      presetId: userData.presetId || null,
      pin: userData.pin || null,
      assignedModules: userData.assignedModules && userData.assignedModules.length > 0 
        ? userData.assignedModules 
        : ['dashboard', 'tasks', 'notes'],
      preferences: {
        dashboardWidgets: userData.dashboardWidgets || ['tasks', 'notes'],
        theme: 'dark'
      },
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers();

    // Eğer aktif oturumdaki kullanıcı güncellendiyse modülleri senkronize et
    const activeUserId = sessionStorage.getItem('portal_session_userId');
    if (activeUserId === id && window.moduleRegistry) {
      window.moduleRegistry.profileManager.enabledModules = this.users[index].assignedModules;
      localStorage.setItem('portal_user_enabled_modules_v2', JSON.stringify(this.users[index].assignedModules));
      if (window.menuManager) window.menuManager.refreshByProfile();
    }

    return true;
  }

  deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id);
    this.saveUsers();
    return true;
  }

  // Kullanıcı giriş yaptığında modüllerini ve profilini uygula
  applyUserContext(userId) {
    const user = this.getUserById(userId);
    if (!user) return false;

    sessionStorage.setItem('portal_session_role', 'USER');
    sessionStorage.setItem('portal_session_userId', user.id);
    sessionStorage.setItem('portal_session_userName', user.name);

    if (window.moduleRegistry) {
      // Kullanıcının atanan modüllerini aktif et
      window.moduleRegistry.profileManager.enabledModules = user.assignedModules || ['dashboard'];
      localStorage.setItem('portal_user_enabled_modules_v2', JSON.stringify(user.assignedModules));

      // Preset varsa onu da uygula
      if (user.presetId) {
        localStorage.setItem('portal_active_user_profile_v2', JSON.stringify({
          presetId: user.presetId,
          title: user.name,
          updatedAt: new Date().toISOString()
        }));
      }
    }

    return true;
  }
}

window.userManager = new UserManager();
console.log('[UserManager] ✅ Kullanıcı Yönetimi Motoru Hazır.');
