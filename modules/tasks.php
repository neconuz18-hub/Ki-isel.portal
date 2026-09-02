<?php
/**
 * Görevler Modülü (modules/tasks.php)
 */
?>
<div id="tab-tasks" class="tab-pane hidden space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                <i data-lucide="check-square" class="w-6 h-6 text-blue-400"></i>
                Görev & İş Yönetimi
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Tüm işlerinizi kategorilere göre filtreleyin, önceliklendirin ve tamamlayın.</p>
        </div>
        <button onclick="window.app.openModal('newTaskModal')" class="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Görev Tanımla</span>
        </button>
    </div>

    <!-- Görev Listesi Filtre Barı -->
    <div class="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto">
            <button onclick="window.taskManager.setFilter('all')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md">Tümü</button>
            <button onclick="window.taskManager.setFilter('pending')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white">Bekleyenler</button>
            <button onclick="window.taskManager.setFilter('completed')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white">Tamamlananlar</button>
        </div>
    </div>

    <div class="glass-card rounded-3xl p-6 border border-slate-800">
        <div id="mainTaskList" class="space-y-3"></div>
    </div>
</div>