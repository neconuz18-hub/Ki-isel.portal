<?php
/**
 * views/layout/sidebar.php
 */
$currentUser = Auth::user();
$allowed = $currentUser['modules'] ?? array_keys($CORE_MODULES);
?>
<aside id="mainSidebar" class="sidebar-container fixed lg:sticky top-0 left-0 z-50 h-screen w-64 max-w-[80vw] flex flex-col justify-between p-4 -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex-shrink-0">
    <div class="space-y-6">
        <!-- Logo & Başlık -->
        <div class="flex items-center space-x-3 px-2">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white flex-shrink-0">
                <i data-lucide="shield" class="w-5 h-5"></i>
            </div>
            <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                    <h1 class="font-extrabold text-sm tracking-tight text-white truncate"><?php echo APP_NAME; ?></h1>
                    <span class="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">PRO</span>
                </div>
                <p class="text-[10px] text-slate-400 truncate">Kişisel Yönetim Portalı</p>
            </div>
        </div>

        <!-- Dinamik Navigasyon Menüsü -->
        <nav class="space-y-1">
            <?php foreach ($CORE_MODULES as $modId => $mod): ?>
                <?php if ($modId === 'admin' && ($currentUser['role'] ?? '') !== 'ADMIN') continue; ?>
                <?php if (!in_array($modId, $allowed) && ($currentUser['role'] ?? '') !== 'ADMIN') continue; ?>
                
                <button onclick="Portal.switchTab('<?php echo $modId; ?>')" id="nav-btn-<?php echo $modId; ?>" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer <?php echo $modId === 'dashboard' ? 'active-nav bg-blue-600/15 text-blue-400 border border-blue-500/30' : ''; ?>">
                    <i data-lucide="<?php echo $mod['icon']; ?>" class="w-4 h-4 flex-shrink-0"></i>
                    <span class="truncate"><?php echo $mod['label']; ?></span>
                </button>
            <?php endforeach; ?>
        </nav>
    </div>

    <!-- Alt Kısım -->
    <div class="pt-4 border-t border-slate-800/80 space-y-2">
        <?php if (($currentUser['role'] ?? '') === 'ADMIN'): ?>
            <button onclick="Portal.openUserModal()" class="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="user-plus" class="w-4 h-4"></i>
                <span>Yeni Kullanıcı Tanımla</span>
            </button>
        <?php endif; ?>
        
        <div class="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <span>SQLite MVC Engine</span>
            <span>v<?php echo APP_VERSION; ?></span>
        </div>
    </div>
</aside>