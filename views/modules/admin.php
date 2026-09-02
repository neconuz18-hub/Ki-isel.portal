<?php
/**
 * views/modules/admin.php (Kullanıcı Yönetimi & Sistem Ayarları)
 */
?>
<div id="tab-admin" class="tab-pane hidden space-y-6">
    <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                    <i data-lucide="users" class="w-5 h-5 text-purple-400"></i>
                    Tanımlı Kullanıcı ve Personel Profilleri
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">Kullanıcı ekleyin, hangi modülleri kullanacağını belirleyin ve Gateway girişine ekleyin.</p>
            </div>
            <button onclick="Portal.openUserModal()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Yeni Kullanıcı Ekle</span>
            </button>
        </div>

        <div id="adminUserCardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <!-- JS tarafından doldurulacak -->
        </div>
    </div>
</div>