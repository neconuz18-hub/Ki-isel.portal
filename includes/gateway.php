<?php
/**
 * Giriş Kapısı Ekranı (gateway.php)
 */
$registeredUsers = Database::getUsers();
?>
<div id="gatewayOverlay" class="<?php echo $isAuthenticated ? 'hidden' : ''; ?> fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-4">
    <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 text-white">
            <i data-lucide="shield" class="w-8 h-8"></i>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Sisteme Giriş Yapın</h1>
        <p class="text-slate-400 text-sm">Lütfen oturum türünüzü seçin</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full mb-6">
        <!-- Misafir Butonu -->
        <button onclick="window.authManager.loginUser()" class="group flex flex-col items-center justify-center p-5 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer">
            <div class="p-3 rounded-full bg-blue-500/10 text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="user" class="w-6 h-6"></i>
            </div>
            <span class="font-bold text-slate-200 text-sm">Misafir / Hızlı Giriş</span>
            <span class="text-[11px] text-slate-500 mt-1">Varsayılan modüller</span>
        </button>

        <!-- Yönetici Butonu -->
        <div class="relative group">
            <button onclick="window.authManager.promptAdminLogin()" class="w-full flex flex-col items-center justify-center p-5 rounded-3xl border border-purple-900/40 bg-purple-950/20 hover:bg-purple-900/40 hover:border-purple-600/50 transition-all cursor-pointer">
                <div class="p-3 rounded-full bg-purple-500/10 text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                    <i data-lucide="key" class="w-6 h-6"></i>
                </div>
                <span class="font-bold text-slate-200 text-sm">Sistem Yöneticisi</span>
                <span class="text-[11px] text-purple-400/70 mt-1">PIN Korumalı (1234)</span>
            </button>
        </div>
    </div>

    <!-- Kayıtlı Özel Kullanıcılar -->
    <div class="max-w-md w-full space-y-2 border-t border-slate-800/80 pt-4">
        <div class="flex items-center justify-between px-1 mb-2">
            <span class="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <i data-lucide="users" class="w-3.5 h-3.5 text-blue-400"></i> Tanımlı Personel / Kullanıcılar
            </span>
            <span class="text-[10px] text-slate-500">Yönetici tarafından atandı</span>
        </div>
        <div id="gatewayUserList" class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <?php if (empty($registeredUsers)): ?>
                <p class="text-xs text-slate-500 text-center py-2">Henüz kayıtlı özel kullanıcı yok.</p>
            <?php else: ?>
                <?php foreach ($registeredUsers as $u): ?>
                    <button type="button" onclick="window.authManager.loginAsUser('<?php echo htmlspecialchars($u['id']); ?>')" 
                            class="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group text-left">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition-colors">
                                <?php echo mb_substr($u['name'] ?? 'U', 0, 1, 'UTF-8'); ?>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-slate-200 group-hover:text-blue-300 truncate"><?php echo htmlspecialchars($u['name']); ?></div>
                                <div class="text-[10px] text-slate-500"><?php echo count($u['assignedModules'] ?? []); ?> Modül Tanımlı</div>
                            </div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"></i>
                    </button>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>