/**
 * PolymorphicStore — Evrensel Çoklu Meslek Veri Motoru
 * 
 * 5 Temel Primitif üzerinden tüm mesleki verileri yönetir:
 * 1. CONTACT (Müşteri, Hasta, Müvekkil, Veli, Alıcı)
 * 2. TRANSACTION (Veresiye Borcu, Kapora, Vekalet, Toptancı, Aidat)
 * 3. TIMELINE_EVENT (Nöbet, Duruşma, Tapu Randevusu, Ders, Vardiya)
 * 4. COMPLIANCE_EXPIRY (İtiraz Süresi, Muayene, Kasko, İlaç SKT, Sözleşme)
 * 5. ENTITY (İlan/Daire, Dava Dosyası, Zimmet Teçhizat, Hisse)
 */

class PolymorphicStore {
  constructor() {
    this.STORAGE_KEY = 'portal_universal_records_v1';
    this.records = this.loadRecords();
    this.listeners = new Set();
  }

  loadRecords() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[PolymorphicStore] Veri yüklenemedi:', e);
      return [];
    }
  }

  saveRecords() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.records));
      this.notifyListeners();
    } catch (e) {
      console.error('[PolymorphicStore] Veri kaydedilemedi:', e);
    }
  }

  // Abone ol (Değişiklik olduğunda UI otomatik yenilensin)
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn(this.records); } catch (err) { console.error(err); }
    });
  }

  // ==========================================
  // CRUD OPERASYONLARI
  // ==========================================

  /**
   * Yeni bir kayıt ekle
   * @param {Object} item - { moduleId, primitiveType, ...fields }
   */
  addRecord(item) {
    const record = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
      ...item
    };
    this.records.unshift(record);
    this.saveRecords();
    return record;
  }

  /**
   * Kayıt güncelle
   */
  updateRecord(id, updates) {
    const idx = this.records.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.records[idx] = {
        ...this.records[idx],
        ...updates,
        updatedAt: Date.now()
      };
      this.saveRecords();
      return this.records[idx];
    }
    return null;
  }

  /**
   * Kayıt sil (Soft delete veya hard delete)
   */
  deleteRecord(id, hard = true) {
    if (hard) {
      this.records = this.records.filter(r => r.id !== id);
    } else {
      const record = this.records.find(r => r.id === id);
      if (record) record.isDeleted = true;
    }
    this.saveRecords();
  }

  // ==========================================
  // SORGULAMA & FİLTRELEME
  // ==========================================

  /**
   * Belirli bir modüle ve/veya primitive göre kayıtları getir
   */
  getRecords(moduleId, primitiveType = null) {
    return this.records.filter(r => {
      if (r.isDeleted) return false;
      if (moduleId && r.moduleId !== moduleId) return false;
      if (primitiveType && r.primitiveType !== primitiveType) return false;
      return true;
    });
  }

  /**
   * Kişileri getir ve bakiyelerini hesapla (Veresiye / Müvekkil / Hasta)
   */
  getContacts(moduleId) {
    const contacts = this.getRecords(moduleId, 'CONTACT');
    const transactions = this.getRecords(moduleId, 'TRANSACTION');

    return contacts.map(contact => {
      // Kişiye ait tüm işlemleri topla
      const userTx = transactions.filter(t => t.relatedContactId === contact.id);
      const netBalance = userTx.reduce((acc, t) => {
        if (t.flow === 'inflow') return acc - (t.amount || 0); // Tahsilat
        if (t.flow === 'outflow') return acc + (t.amount || 0); // Borç
        return acc;
      }, (contact.initialBalance || 0));

      return {
        ...contact,
        calculatedBalance: netBalance,
        transactionsCount: userTx.length
      };
    });
  }

  /**
   * Yaklaşan süreleri ve acil uyarıları getir (İtiraz, Muayene, Kasko, SKT)
   */
  getUpcomingExpiries(daysLimit = 30) {
    const now = Date.now();
    const limitMs = now + (daysLimit * 24 * 60 * 60 * 1000);

    return this.records
      .filter(r => r.primitiveType === 'COMPLIANCE_EXPIRY' && !r.isResolved && !r.isDeleted)
      .filter(r => r.deadlineAt && r.deadlineAt <= limitMs)
      .sort((a, b) => a.deadlineAt - b.deadlineAt);
  }

  /**
   * Takvim olaylarını getir (Nöbetler, Duruşmalar, Randevular)
   */
  getTimelineEvents(startDate = null, endDate = null) {
    return this.records
      .filter(r => r.primitiveType === 'TIMELINE_EVENT' && !r.isDeleted)
      .filter(r => {
        if (startDate && r.startAt < startDate) return false;
        if (endDate && r.startAt > endDate) return false;
        return true;
      })
      .sort((a, b) => a.startAt - b.startAt);
  }
}

// Global Singleton Instance
window.polymorphicStore = new PolymorphicStore();
console.log('[PolymorphicStore] ✅ Evrensel Veri Motoru Hazır.');
