<?php
/**
 * views/layout/modals.php
 */
?>
<!-- MODAL: YENİ GÖREV -->
<div id="newTaskModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="check-square" class="w-5 h-5 text-blue-400"></i> Yeni Görev Tanımla</h3>
            <button onclick="Portal.closeModal('newTaskModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleSaveTask(event)" class="space-y-3 text-xs">
            <div>
                <label class="font-bold text-slate-300 block mb-1">Görev Başlığı *</label>
                <input type="text" id="taskInputTitle" required placeholder="Örn: Haftalık raporu hazırla" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Kategori</label>
                    <select id="taskInputCategory" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                        <option value="Genel">Genel</option>
                        <option value="İş">İş & Proje</option>
                        <option value="Kişisel">Kişisel</option>
                        <option value="Acil">Acil</option>
                    </select>
                </div>
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Öncelik</label>
                    <select id="taskInputPriority" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                        <option value="Normal">Normal</option>
                        <option value="Yüksek">Yüksek 🔥</option>
                        <option value="Düşük">Düşük</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('newTaskModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Kaydet</button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL: YENİ HATIRLATICI -->
<div id="newReminderModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="bell" class="w-5 h-5 text-amber-400"></i> Yeni Hatırlatıcı Kur</h3>
            <button onclick="Portal.closeModal('newReminderModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleSaveReminder(event)" class="space-y-3 text-xs">
            <div>
                <label class="font-bold text-slate-300 block mb-1">Başlık *</label>
                <input type="text" id="remInputTitle" required placeholder="Örn: Diş Randevusu" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Tarih & Saat *</label>
                <input type="datetime-local" id="remInputDateTime" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Notlar</label>
                <textarea id="remInputNotes" rows="2" placeholder="Detaylar..." class="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"></textarea>
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('newReminderModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer">Kur</button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL: YENİ NOT -->
<div id="newNoteModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="file-text" class="w-5 h-5 text-emerald-400"></i> Yeni Not Oluştur</h3>
            <button onclick="Portal.closeModal('newNoteModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleSaveNote(event)" class="space-y-3 text-xs">
            <div>
                <label class="font-bold text-slate-300 block mb-1">Not Başlığı *</label>
                <input type="text" id="noteInputTitle" required placeholder="Not başlığı..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">İçerik</label>
                <textarea id="noteInputContent" rows="4" required placeholder="Düşünceleriniz, fikirleriniz..." class="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"></textarea>
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('newNoteModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer">Kaydet</button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL: YENİ ABONELİK -->
<div id="newSubscriptionModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="credit-card" class="w-5 h-5 text-amber-400"></i> Yeni Abonelik Ekle</h3>
            <button onclick="Portal.closeModal('newSubscriptionModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleSaveSubscription(event)" class="space-y-3 text-xs">
            <div>
                <label class="font-bold text-slate-300 block mb-1">Hizmet / Abonelik Adı *</label>
                <input type="text" id="subInputTitle" required placeholder="Örn: Netflix, Spotify, Kira" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Tutar (₺/$/€) *</label>
                    <input type="number" step="0.01" id="subInputAmount" required placeholder="249.99" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                </div>
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Sonraki Ödeme Tarihi *</label>
                    <input type="date" id="subInputDate" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('newSubscriptionModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer">Ekle</button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL: KULLANICI EKLE / DÜZENLE -->
<div id="adminUserModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 id="userModalTitle" class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="user-plus" class="w-5 h-5 text-purple-400"></i> Yeni Kullanıcı Tanımla</h3>
            <button onclick="Portal.closeModal('adminUserModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleSaveUser(event)" class="space-y-4 text-xs">
            <input type="hidden" id="userModalId" value="">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="font-bold text-slate-300 block mb-1">İsim Soyisim *</label>
                    <input type="text" id="userModalName" required placeholder="Örn: Ali Yılmaz" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500">
                </div>
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Telefon</label>
                    <input type="text" id="userModalPhone" placeholder="05xx xxx xx xx" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                </div>
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Giriş PIN Kodu (Opsiyonel)</label>
                <input type="password" id="userModalPin" maxlength="6" placeholder="Boş bırakılırsa şifresiz girer" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Yetkili Modüller</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <?php foreach ($CORE_MODULES as $mid => $m): ?>
                        <?php if ($mid === 'admin') continue; ?>
                        <label class="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                            <input type="checkbox" name="userModules" value="<?php echo $mid; ?>" checked class="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0">
                            <span class="text-slate-300 text-[11px]"><?php echo $m['label']; ?></span>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('adminUserModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer">Kaydet</button>
            </div>
        </form>
    </div>
</div>