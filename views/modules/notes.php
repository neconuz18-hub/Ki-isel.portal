<?php
/**
 * Notlar Modülü (modules/notes.php)
 */
?>
<div id="tab-notes" class="tab-pane hidden space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <i data-lucide="file-text" class="w-6 h-6 text-emerald-400"></i>
                Hızlı Not Defteri
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Fikirlerinizi, toplantı notlarınızı ve şablonlarınızı kaydedin.</p>
        </div>
        <button onclick="window.app.openModal('newNoteModal')" class="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Yeni Not Oluştur</span>
        </button>
    </div>
    <div class="glass-card rounded-3xl p-6 border border-slate-800">
        <div id="mainNotesList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
</div>