<?php
/**
 * views/modules/admin.php — Geliştirici & Yönetici Merkezi
 */
?>
<div id="tab-admin" class="tab-pane hidden space-y-6">
    <!-- Üst Başlık -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/50 border border-purple-500/30 shadow-xl">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
                <i data-lucide="terminal" class="w-6 h-6"></i>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <h2 class="text-xl font-bold text-white">Geliştirici & Yönetim Merkezi</h2>
                    <span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">SUPER ADMIN</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">Kullanıcıları yönetin, veritabanını izleyin ve yeni sayfa yapılandırmalarını kontrol edin.</p>
            </div>
        </div>
        <button onclick="Portal.openUserModal()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all cursor-pointer">
            <i data-lucide="user-plus" class="w-4 h-4"></i>
            <span>Yeni Kullanıcı Ekle</span>
        </button>
    </div>

    <!-- Kullanıcılar Kart Listesi -->
    <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="users" class="w-4 h-4 text-purple-400"></i> Kayıtlı Kullanıcı Hesapları
        </h3>
        <div id="adminUserCardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <!-- JS Tarafından doldurulacak -->
        </div>
    </div>
</div>