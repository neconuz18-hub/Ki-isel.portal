<?php
/**
 * views/modules/vault.php
 */
?>
<div id="tab-vault" class="tab-pane hidden space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                <i data-lucide="lock" class="w-6 h-6 text-purple-400"></i>
                Güvenli Kasa & Gizli Notlar
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Banka hesapları, kartlar ve gizli şifreli notlar.</p>
        </div>
        <button onclick="Portal.openModal('newVaultModal')" class="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Kasa Kaydı</span>
        </button>
    </div>

    <div class="glass-card rounded-3xl p-6 border border-slate-800">
        <div id="mainVaultList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
</div>