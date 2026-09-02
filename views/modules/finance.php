<?php
/**
 * views/modules/finance.php
 */
?>
<div id="tab-finance" class="tab-pane hidden space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                <i data-lucide="trending-up" class="w-6 h-6 text-amber-400"></i>
                Canlı Borsa, Altın & Finans Portföyü
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Borsa İstanbul hisseleri, altın kurları ve portföy takibi.</p>
        </div>
        <button onclick="Portal.openModal('newStockModal')" class="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Hisse / Pozisyon Ekle</span>
        </button>
    </div>

    <!-- Altın & Döviz Kartları -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span class="text-[11px] text-slate-400 block font-semibold">Gram Altın</span>
            <span id="goldGramPrice" class="text-lg font-bold font-mono text-amber-400">₺3.385,00</span>
        </div>
        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span class="text-[11px] text-slate-400 block font-semibold">Çeyrek Altın</span>
            <span id="goldCeyrekPrice" class="text-lg font-bold font-mono text-amber-300">₺5.535,00</span>
        </div>
        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span class="text-[11px] text-slate-400 block font-semibold">USD / TRY</span>
            <span id="forexUsdPrice" class="text-lg font-bold font-mono text-emerald-400">₺38,35</span>
        </div>
        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span class="text-[11px] text-slate-400 block font-semibold">EUR / TRY</span>
            <span id="forexEurPrice" class="text-lg font-bold font-mono text-blue-400">₺41,20</span>
        </div>
    </div>

    <div class="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="briefcase" class="w-4 h-4 text-amber-400"></i> Kayıtlı Portföy Pozisyonları
        </h3>
        <div id="financePortfolioList" class="space-y-2"></div>
    </div>
</div>