<!-- MODAL: YENİ GÖREV EKLE -->
  <div id="newTaskModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-slate-700 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="check-square" class="w-5 h-5 text-blue-400"></i> Yeni Görev Tanımla
        </h3>
        <button onclick="window.app.closeModal('newTaskModal')" class="text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="newTaskForm" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Görev Başlığı / Tanımı *</label>
          <input type="text" id="taskInputTitle" placeholder="Örn: Haftalık yönetim kurulu sunumunu revize et" required class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
            <select id="taskInputCategory" class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="Toplantı">Toplantı</option>
              <option value="E-posta">E-posta</option>
              <option value="Takip">Takip</option>
              <option value="Operasyon">Operasyon</option>
              <option value="Kişisel">Kişisel</option>
              <option value="Genel" selected>Genel</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Öncelik Derecesi</label>
            <select id="taskInputPriority" class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="urgent">🔴 Acil</option>
              <option value="high">🟡 Yüksek</option>
              <option value="normal" selected>🔵 Normal</option>
              <option value="low">⚪ Düşük</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Bitiş Tarihi</label>
            <input type="date" id="taskInputDate" class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Saat (Opsiyonel)</label>
            <input type="time" id="taskInputTime" class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('newTaskModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20">Kaydet</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: YENİ HATIRLATICI EKLE -->
  <div id="newReminderModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-slate-700 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="bell" class="w-5 h-5 text-amber-400"></i> Yeni Hatırlatıcı Zamanla
        </h3>
        <button onclick="window.app.closeModal('newReminderModal')" class="text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="newReminderForm" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Hatırlatıcı Konusu *</label>
          <input type="text" id="remInputTitle" placeholder="Örn: Finans Müdürü ile bütçe görüşmesi" required class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Tarih & Saat *</label>
          <input type="datetime-local" id="remInputDateTime" required class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Ek Notlar / Detay</label>
          <textarea id="remInputNotes" rows="2" placeholder="Görüşme öncesi incelenecek belgeler vs..." class="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('newReminderModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20">Zamanla</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: YENİ NOT EKLE -->
  <div id="newNoteModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-slate-700 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="file-plus" class="w-5 h-5 text-emerald-400"></i> Yeni Not Oluştur
        </h3>
        <button onclick="window.app.closeModal('newNoteModal')" class="text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="newNoteForm" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Not Başlığı</label>
          <input type="text" id="noteInputTitle" placeholder="Örn: Telefon Görüşmesi Notu" class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Not İçeriği *</label>
          <textarea id="noteInputContent" rows="4" placeholder="Toplantıda konuşulan maddeler veya yapılacaklar..." required class="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Renk Etiketi</label>
          <div class="flex items-center gap-3 pt-1">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="noteColor" value="blue" checked class="text-blue-500">
              <span class="text-xs text-blue-400">Mavi</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="noteColor" value="purple" class="text-purple-500">
              <span class="text-xs text-purple-400">Mor</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="noteColor" value="emerald" class="text-emerald-500">
              <span class="text-xs text-emerald-400">Yeşil</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="noteColor" value="amber" class="text-amber-500">
              <span class="text-xs text-amber-400">Sarı</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="noteColor" value="pink" class="text-pink-500">
              <span class="text-xs text-pink-400">Pembe</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('newNoteModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20">Kaydet</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: HATIRLATICI ALARM POPUP (TRIGGER) -->
  <div id="reminderAlertModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-amber-500/40 bg-slate-900/95 space-y-4 shadow-2xl text-center">
      <div class="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto pulse-badge">
        <i data-lucide="alarm-clock" class="w-8 h-8"></i>
      </div>

      <div>
        <span id="alertModalTime" class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">00:00</span>
        <h3 id="alertModalTitle" class="text-lg font-bold text-white mt-2">Hatırlatıcı Zamanı!</h3>
        <p id="alertModalNotes" class="text-xs text-slate-300 mt-1"></p>
      </div>

      <div class="flex items-center justify-center gap-2 pt-4 border-t border-slate-800">
        <button onclick="window.reminderManager.snooze(document.getElementById('reminderAlertModal').dataset.reminderId, 10); window.app.closeReminderModal();" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium flex items-center gap-1">
          <i data-lucide="timer-reset" class="w-3.5 h-3.5"></i>
          <span>10 Dk Ertele</span>
        </button>
        <button onclick="window.reminderManager.markCompleted(document.getElementById('reminderAlertModal').dataset.reminderId); window.app.closeReminderModal(); window.app.renderAll();" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          <span>Tamamlandı</span>
        </button>
      </div>
    </div>
  </div>

  
  <!-- ==================== VAULT MODALS ==================== -->

  <!-- MODAL: KİMLİK BİLGİLERİNİ DÜZENLE -->
  <div id="vaultEditIdentityModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-lg w-full border border-slate-700/80 space-y-4 shadow-2xl bg-slate-900/95">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="user-check" class="w-5 h-5 text-amber-400"></i> Kişisel Kimlik Bilgilerini Düzenle
        </h3>
        <button onclick="window.app.closeModal('vaultEditIdentityModal')" class="text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); window.vaultManager.saveIdentityFromModal({
        fullName: document.getElementById('vaultIdFullName').value,
        title: document.getElementById('vaultIdTitle').value,
        tcKimlik: document.getElementById('vaultIdTc').value,
        birthDate: document.getElementById('vaultIdBirth').value,
        bloodType: document.getElementById('vaultIdBlood').value,
        passportNo: document.getElementById('vaultIdPassport').value,
        drivingLicenseNo: document.getElementById('vaultIdDriving').value,
        emergencyContact: document.getElementById('vaultIdEmergency').value
      });" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Ad Soyad *</label>
            <input type="text" id="vaultIdFullName" required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Unvan / Görev</label>
            <input type="text" id="vaultIdTitle" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">T.C. Kimlik No (11 Haneli)</label>
            <input type="text" id="vaultIdTc" maxlength="11" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Doğum Tarihi</label>
            <input type="date" id="vaultIdBirth" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Kan Grubu</label>
            <select id="vaultIdBlood" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
              <option value="A Rh+">A Rh+</option>
              <option value="A Rh-">A Rh-</option>
              <option value="B Rh+">B Rh+</option>
              <option value="B Rh-">B Rh-</option>
              <option value="AB Rh+">AB Rh+</option>
              <option value="AB Rh-">AB Rh-</option>
              <option value="0 Rh+">0 Rh+</option>
              <option value="0 Rh-">0 Rh-</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Pasaport No</label>
            <input type="text" id="vaultIdPassport" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Ehliyet No</label>
            <input type="text" id="vaultIdDriving" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400">
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Acil Durum İletişim (İsim & Tel)</label>
          <input type="text" id="vaultIdEmergency" placeholder="Örn: Eş / Yakın (+90 532 000 00 00)" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('vaultEditIdentityModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 cursor-pointer">Kaydet ve Güncelle</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ŞİRKET & FATURA BİLGİLERİNİ DÜZENLE -->
  <div id="vaultEditCompanyModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-lg w-full border border-slate-700/80 space-y-4 shadow-2xl bg-slate-900/95">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="building-2" class="w-5 h-5 text-amber-400"></i> Şirket & Fatura Bilgilerini Düzenle
        </h3>
        <button onclick="window.app.closeModal('vaultEditCompanyModal')" class="text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); window.vaultManager.saveCompanyFromModal({
        companyName: document.getElementById('vaultCompName').value,
        taxOffice: document.getElementById('vaultCompTaxOffice').value,
        taxNumber: document.getElementById('vaultCompTaxNumber').value,
        mersisNo: document.getElementById('vaultCompMersis').value,
        billingAddress: document.getElementById('vaultCompAddress').value
      });" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Resmi Şirket / Ticari Tam Unvan *</label>
          <input type="text" id="vaultCompName" required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Vergi Dairesi</label>
            <input type="text" id="vaultCompTaxOffice" placeholder="Örn: Beşiktaş Vergi Dairesi" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Vergi Kimlik No (VKN / TC)</label>
            <input type="text" id="vaultCompTaxNumber" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400">
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">MERSİS No (Opsiyonel)</label>
          <input type="text" id="vaultCompMersis" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400">
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Resmi Fatura Adresi</label>
          <textarea id="vaultCompAddress" rows="2" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('vaultEditCompanyModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 cursor-pointer">Kaydet ve Güncelle</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: YENİ BANKA HESABI / IBAN EKLE -->
  <div id="vaultAddBankModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-slate-700/80 space-y-4 shadow-2xl bg-slate-900/95">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="credit-card" class="w-5 h-5 text-emerald-400"></i> Yeni Banka Hesabı Ekle
        </h3>
        <button onclick="window.app.closeModal('vaultAddBankModal')" class="text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="vaultAddBankForm" onsubmit="event.preventDefault(); window.vaultManager.saveBankFromModal({
        bankName: document.getElementById('vaultBankName').value,
        accountName: document.getElementById('vaultBankAccountName').value,
        iban: document.getElementById('vaultBankIban').value,
        currency: document.getElementById('vaultBankCurrency').value,
        isDefault: document.getElementById('vaultBankIsDefault').checked
      });" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Banka Adı *</label>
          <input type="text" id="vaultBankName" placeholder="Örn: Garanti BBVA, Akbank, İş Bankası" required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Hesap Türü / Etiket</label>
            <input type="text" id="vaultBankAccountName" placeholder="Örn: Ana Vadesiz TL" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Para Birimi</label>
            <select id="vaultBankCurrency" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400">
              <option value="TRY" selected>TRY (₺)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="GOLD">Altın (GR)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">IBAN Numarası *</label>
          <input type="text" id="vaultBankIban" placeholder="TR..." required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-emerald-400">
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" id="vaultBankIsDefault" class="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-400">
          <label for="vaultBankIsDefault" class="text-xs text-slate-300 cursor-pointer">Varsayılan birincil hesap olarak işaretle</label>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('vaultAddBankModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer">Hesabı Kaydet</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: YENİ TESLİMAT ADRESİ EKLE -->
  <div id="vaultAddAddressModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-slate-700/80 space-y-4 shadow-2xl bg-slate-900/95">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="map-pin" class="w-5 h-5 text-sky-400"></i> Yeni Teslimat Adresi Ekle
        </h3>
        <button onclick="window.app.closeModal('vaultAddAddressModal')" class="text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="vaultAddAddressForm" onsubmit="event.preventDefault(); window.vaultManager.saveAddressFromModal({
        title: document.getElementById('vaultAddrTitle').value,
        recipient: document.getElementById('vaultAddrRecipient').value,
        address: document.getElementById('vaultAddrText').value,
        isDefault: document.getElementById('vaultAddrIsDefault').checked
      });" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Adres Başlığı *</label>
          <input type="text" id="vaultAddrTitle" placeholder="Örn: Şirket Merkez, Yazlık vb." required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400">
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Alıcı Adı & Telefon</label>
          <input type="text" id="vaultAddrRecipient" placeholder="Örn: Sayın Yönetici (+90 532 000 00 00)" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400">
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Açık Adres Detayı *</label>
          <textarea id="vaultAddrText" rows="3" placeholder="Mahalle, Cadde, Bina No, Kat, Daire, İlçe/İl..." required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"></textarea>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" id="vaultAddrIsDefault" class="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-sky-400">
          <label for="vaultAddrIsDefault" class="text-xs text-slate-300 cursor-pointer">Varsayılan teslimat adresi olarak ayarla</label>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('vaultAddAddressModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/10 cursor-pointer">Adresi Kaydet</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: YENİ GİZLİ NOT / ŞİFRE EKLE -->
  <div id="vaultAddSecretModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-md w-full border border-slate-700/80 space-y-4 shadow-2xl bg-slate-900/95">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="key-round" class="w-5 h-5 text-purple-400"></i> Yeni Gizli Kasa Notu Ekle
        </h3>
        <button onclick="window.app.closeModal('vaultAddSecretModal')" class="text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="vaultAddSecretForm" onsubmit="event.preventDefault(); window.vaultManager.saveSecretFromModal({
        title: document.getElementById('vaultSecretTitle').value,
        category: document.getElementById('vaultSecretCategory').value,
        content: document.getElementById('vaultSecretContent').value
      });" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Not / Kayıt Başlığı *</label>
          <input type="text" id="vaultSecretTitle" placeholder="Örn: Ofis Wi-Fi Şifresi, VIP Giriş Kodu" required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400">
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Kategori</label>
          <select id="vaultSecretCategory" class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400">
            <option value="Ağ & Wi-Fi">Ağ & Wi-Fi</option>
            <option value="Lisans & API">Lisans & API Anahtarı</option>
            <option value="Kapı & Kasa Kodu">Kapı & Kasa Kodu</option>
            <option value="Özel Şifre">Özel Şifre</option>
            <option value="Gizli Not">Gizli Not</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Gizli İçerik / Şifre *</label>
          <textarea id="vaultSecretContent" rows="3" placeholder="Şifre, kod veya gizli metin..." required class="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400"></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('vaultAddSecretModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer">İptal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/10 cursor-pointer">Notu Kaydet</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: KASA PIN DEĞİŞTİR -->
  <div id="vaultChangePinModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="glass-card rounded-3xl p-6 max-w-sm w-full border border-amber-500/30 space-y-4 shadow-2xl bg-slate-900/95">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-sm text-white flex items-center gap-2">
          <i data-lucide="key" class="w-4 h-4 text-amber-400"></i> Kasa PIN Kodunu Değiştir
        </h3>
        <button onclick="window.app.closeModal('vaultChangePinModal')" class="text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <form id="vaultChangePinForm" onsubmit="event.preventDefault(); window.vaultManager.changePinFromModal(
        document.getElementById('vaultPinCurrent').value,
        document.getElementById('vaultPinNew').value,
        document.getElementById('vaultPinConfirm').value
      );" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-300 mb-1">Mevcut PIN Kodu</label>
          <input type="password" id="vaultPinCurrent" maxlength="6" placeholder="••••" required class="w-full text-center tracking-widest font-mono text-base px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Yeni PIN</label>
            <input type="password" id="vaultPinNew" maxlength="6" placeholder="••••" required class="w-full text-center tracking-widest font-mono text-base px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Yeni PIN Tekrar</label>
            <input type="password" id="vaultPinConfirm" maxlength="6" placeholder="••••" required class="w-full text-center tracking-widest font-mono text-base px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400">
          </div>
        </div>

        <p class="text-[10px] text-slate-400">En az 4 haneli rakamlardan oluşan bir PIN belirleyin.</p>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="window.app.closeModal('vaultChangePinModal')" class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer">İptal</button>
          <button type="submit" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 cursor-pointer">PIN'i Güncelle</button>
        </div>
      </form>
    </div>
  </div>