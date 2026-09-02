<?php
/**
 * Hatırlatıcılar Modülü (modules/reminders.php)
 */
?>
<div id="tab-reminders" class="tab-pane hidden space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <i data-lucide="bell" class="w-6 h-6 text-amber-400"></i>
                Zamanlanmış Hatırlatıcılar
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Önemli randevular, ödemeler ve kritik süreler.</p>
        </div>
        <button onclick="window.app.openModal('newReminderModal')" class="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Hatırlatıcı Kur</span>
        </button>
    </div>
    <div class="glass-card rounded-3xl p-6 border border-slate-800">
        <div id="mainRemindersList" class="space-y-3"></div>
    </div>
</div>