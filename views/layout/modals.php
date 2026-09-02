<?php
/**
 * views/layout/modals.php — Sadeleştirilmiş Modal Pencereleri
 */
?>
<!-- MODAL: KULLANICI EKLE / DÜZENLE -->
<div id="adminUserModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 id="userModalTitle" class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="user-plus" class="w-5 h-5 text-purple-400"></i> Yeni Kullanıcı Tanımla</h3>
            <button onclick="Portal.closeModal('adminUserModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleSaveUser(event)" class="space-y-4 text-xs">
            <input type="hidden" id="userModalId" value="">
            <div>
                <label class="font-bold text-slate-300 block mb-1">İsim Soyisim *</label>
                <input type="text" id="userModalName" required placeholder="Örn: Ali Yılmaz" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Telefon</label>
                <input type="text" id="userModalPhone" placeholder="05xx xxx xx xx" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Giriş PIN Kodu (Opsiyonel)</label>
                <input type="password" id="userModalPin" maxlength="6" placeholder="Boş bırakılırsa şifresiz girer" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('adminUserModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer">Kaydet</button>
            </div>
        </form>
    </div>
</div>