<?php
$currentUser = Auth::user();
?>
<div id="tab-dashboard" class="tab-pane active space-y-6">
    
    <!-- NOTION ÇALIŞMA ALANI & ÜST BAR -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
            <div class="flex items-center gap-2">
                <span class="text-2xl">⚡</span>
                <h2 class="text-2xl font-extrabold text-white tracking-tight">Kişisel Not Çalışma Alanı</h2>
            </div>
            <p class="text-xs text-slate-400 mt-1">Düşüncelerinizi, yapılacaklar listelerinizi ve fikirlerinizi Notion tarzı bloklarla yönetin.</p>
        </div>

        <!-- + YENİ NOT EKLE BUTONU (NOTION TARZI) -->
        <div class="flex items-center gap-2">
            <button onclick="Portal.openNewNoteDrawer()" class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                <div class="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                    <i data-lucide="plus" class="w-3.5 h-3.5 text-white"></i>
                </div>
                <span>Yeni Not Oluştur</span>
            </button>
        </div>
    </div>

    <!-- NOTION NOTLAR GRİDİ -->
    <div id="notionNotesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- JS tarafından kartlar render edilecek -->
    </div>

</div>

<!-- NOTION-STYLE SAĞDAN KAYAN ÇALIŞMA ALANI ÇEKMECESİ (DRAWER) -->
<div id="notionDrawer" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex justify-end transition-opacity duration-300">
    <div class="w-full max-w-2xl bg-[#0d121f] border-l border-slate-800 h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto transform transition-transform duration-300 translate-x-full" id="notionDrawerContent">
        
        <!-- Üst Kontrol Barı -->
        <div class="space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div class="flex items-center gap-2">
                    <!-- İkon & Emoji Seçici -->
                    <button id="noteDrawerEmojiBtn" onclick="Portal.cycleNoteIcon()" class="w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" title="İkon Değiştir">
                        📝
                    </button>
                    <!-- Renk Hapı Seçici -->
                    <div class="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                        <button onclick="Portal.setDrawerColor('blue')" class="w-4 h-4 rounded-full bg-blue-500 hover:scale-125 transition-transform" title="Mavi"></button>
                        <button onclick="Portal.setDrawerColor('purple')" class="w-4 h-4 rounded-full bg-purple-500 hover:scale-125 transition-transform" title="Mor"></button>
                        <button onclick="Portal.setDrawerColor('emerald')" class="w-4 h-4 rounded-full bg-emerald-500 hover:scale-125 transition-transform" title="Zümrüt"></button>
                        <button onclick="Portal.setDrawerColor('amber')" class="w-4 h-4 rounded-full bg-amber-500 hover:scale-125 transition-transform" title="Kehribar"></button>
                        <button onclick="Portal.setDrawerColor('rose')" class="w-4 h-4 rounded-full bg-rose-500 hover:scale-125 transition-transform" title="Gül"></button>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button id="noteDrawerPinBtn" onclick="Portal.toggleDrawerPin()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer" title="En Tepeye Sabitle">
                        <i data-lucide="pin" class="w-4 h-4"></i>
                    </button>
                    <button onclick="Portal.closeNoteDrawer()" class="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer" title="Kapat">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Form Alanı -->
            <form id="notionNoteForm" onsubmit="Portal.saveDrawerNote(event)" class="space-y-4">
                <input type="hidden" id="drawerNoteId" value="">
                <input type="hidden" id="drawerNoteColor" value="blue">
                <input type="hidden" id="drawerNotePinned" value="0">

                <!-- Not Başlığı -->
                <input type="text" id="drawerNoteTitle" placeholder="Başlıksız Not..." class="w-full bg-transparent text-2xl lg:text-3xl font-extrabold text-white placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-slate-800 pb-2 transition-all">

                <!-- Hızlı Şablon Butonları -->
                <div class="flex items-center gap-1.5 py-1 overflow-x-auto text-[11px]">
                    <button type="button" onclick="Portal.insertNoteTemplate('todo')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer">
                        <i data-lucide="check-square" class="w-3 h-3 text-blue-400"></i> Yapılacaklar
                    </button>
                    <button type="button" onclick="Portal.insertNoteTemplate('meeting')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer">
                        <i data-lucide="users" class="w-3 h-3 text-emerald-400"></i> Toplantı Notu
                    </button>
                    <button type="button" onclick="Portal.insertNoteTemplate('code')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer">
                        <i data-lucide="code" class="w-3 h-3 text-purple-400"></i> Kod Bloğu
                    </button>
                </div>

                <!-- Not İçeriği -->
                <textarea id="drawerNoteContent" rows="14" placeholder="Buraya yazmaya başlayın... Fikirler, yapılacaklar, bağlantılar veya şablonlar..." class="w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 leading-relaxed font-sans resize-none transition-colors"></textarea>
            </form>
        </div>

        <!-- Alt Kaydet / Sil Barı -->
        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button type="button" id="drawerDeleteBtn" onclick="Portal.deleteDrawerNote()" class="px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 text-xs font-bold transition-colors cursor-pointer hidden">
                Notu Sil
            </button>
            <div class="flex items-center gap-2 ml-auto">
                <button type="button" onclick="Portal.closeNoteDrawer()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors">
                    İptal
                </button>
                <button type="button" onclick="Portal.saveDrawerNote()" class="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 cursor-pointer transition-all">
                    Kaydet
                </button>
            </div>
        </div>
    </div>
</div>
