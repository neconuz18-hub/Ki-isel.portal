<?php
/**
 * views/modules/subscriptions.php
 */
?>
<div id="tab-subscriptions" class="tab-pane hidden space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                <i data-lucide="credit-card" class="w-6 h-6 text-amber-400"></i>
                Abonelik & Ödeme Radarı
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Aylık ve yıllık düzenli harcamalarınızı kontrol altında tutun.</p>
        </div>
        <button onclick="Portal.openModal('newSubscriptionModal')" class="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Abonelik Ekle</span>
        </button>
    </div>

    <div class="glass-card rounded-3xl p-6 border border-slate-800">
        <div id="mainSubscriptionsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
</div>