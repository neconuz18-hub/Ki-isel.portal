<?php
/**
 * Üst Başlık & Kontrol Çubuğu (header.php)
 */
?>
<header class="glass-header sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
    <!-- Sol: 3 Çizgili Menü Butonu, Başlık, Profil Rozeti & Baloncuk Dock -->
    <div class="flex items-center space-x-3 min-w-0">
        <!-- 3 Çizgili Menü Açma/Kapama Çubuğu -->
        <button onclick="window.app.toggleSidebarCollapse()" title="Menüyü Aç / Kapat" class="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer flex-shrink-0">
            <i data-lucide="menu" class="w-5 h-5"></i>
        </button>

        <!-- Dinamik Profil Rozeti -->
        <div id="userProfileHeaderBadge" class="hidden sm:block flex-shrink-0">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-300">
                <i data-lucide="user-check" class="w-3.5 h-3.5 text-blue-400"></i>
                <span><?php echo htmlspecialchars($currentUserName); ?></span>
                <?php if ($currentRole === 'ADMIN'): ?>
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-500/40 font-mono">ADMIN</span>
                <?php endif; ?>
            </span>
        </div>

        <div class="hidden md:block border-l border-slate-700/50 pl-3 ml-1 flex-shrink-0">
            <h2 class="text-[11px] font-semibold text-slate-400"><?php echo APP_NAME; ?> v<?php echo APP_VERSION; ?></h2>
        </div>

        <!-- KÜÇÜLTÜLEN WİDGET'LAR DOCK PANELİ (BALONCUKLAR) -->
        <div id="headerWidgetDock" class="hidden flex items-center gap-2 pl-2 overflow-x-auto"></div>
    </div>

    <!-- Sağ: Canlı Saat & Çıkış Butonu -->
    <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-3 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-2xl text-xs">
            <div class="hidden md:flex items-center space-x-1.5 text-slate-300">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-400"></i>
                <span id="liveDate">Yükleniyor...</span>
            </div>
            <div class="hidden md:block h-3 w-px bg-slate-700"></div>
            <div class="flex items-center space-x-1.5 text-white font-mono font-bold tracking-wider">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-400"></i>
                <span id="liveClock">00:00:00</span>
            </div>
        </div>
        
        <!-- Çıkış Butonu -->
        <button onclick="if(window.authManager) window.authManager.logout();" title="Oturumu Kapat" class="flex items-center justify-center p-2 rounded-xl bg-rose-900/20 hover:bg-rose-900/50 text-rose-400 hover:text-rose-300 border border-rose-900/50 transition-all cursor-pointer">
            <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
    </div>
</header>