<?php
?>
<div id="tab-admin" class="tab-pane hidden space-y-6">
    <!-- Üst Başlık -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/50 border border-purple-500/30 shadow-xl">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
                <i data-lucide="sliders" class="w-6 h-6"></i>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <h2 class="text-xl font-bold text-white">Menü & Sayfa Geliştirme Havuzu</h2>
                    <span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">DEV BUILDER</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">Sol menüde hangi sayfaların görüneceğini açıp kapatın veya yeni sayfa menüleri tanımlayın.</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button onclick="Portal.openNewMenuModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Yeni Menü Tanımla</span>
            </button>
            <button onclick="Portal.openUserModal()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all cursor-pointer">
                <i data-lucide="user-plus" class="w-4 h-4"></i>
                <span>Kullanıcı Ekle</span>
            </button>
        </div>
    </div>

    <!-- 1. DİNAMİK MENÜ HAVUZU KARTLARI -->
    <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="layout-grid" class="w-4 h-4 text-blue-400"></i> Menü Havuzu (Aç / Kapat)
            </h3>
            <span class="text-[11px] text-slate-400">Değişiklik anında sol menüye yansır</span>
        </div>
        <div id="adminMenuPoolGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <!-- JS Tarafından doldurulacak -->
        </div>
    </div>

    <!-- 2. KULLANICILAR KART LİSTESİ -->
    <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="users" class="w-4 h-4 text-purple-400"></i> Kayıtlı Kullanıcı Hesapları
        </h3>
        <div id="adminUserCardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <!-- JS Tarafından doldurulacak -->
        </div>
    </div>
</div>

<!-- MODAL: YENİ MENÜ TANIMLA -->
<div id="newMenuModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="plus-circle" class="w-5 h-5 text-blue-400"></i> Yeni Menü & Sayfa Tanımla</h3>
            <button onclick="Portal.closeModal('newMenuModal')" class="text-slate-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="Portal.handleCreateMenu(event)" class="space-y-3 text-xs">
            <div>
                <label class="font-bold text-slate-300 block mb-1">Menü Kimliği (ID / Slug) *</label>
                <input type="text" id="newMenuId" required placeholder="Örn: projeler, ajanda, analiz" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Menü Başlığı *</label>
                <input type="text" id="newMenuLabel" required placeholder="Örn: Projeler & Dosyalar" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Lucide İkonu</label>
                    <input type="text" id="newMenuIcon" placeholder="folder, calendar, bar-chart" value="folder" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                </div>
                <div>
                    <label class="font-bold text-slate-300 block mb-1">Sıra No</label>
                    <input type="number" id="newMenuOrder" value="10" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
                </div>
            </div>
            <div>
                <label class="font-bold text-slate-300 block mb-1">Açıklama</label>
                <input type="text" id="newMenuDesc" placeholder="Bu sayfanın amacı ve içeriği..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none">
            </div>
            <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onclick="Portal.closeModal('newMenuModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">İptal</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Oluştur</button>
            </div>
        </form>
    </div>
</div>
