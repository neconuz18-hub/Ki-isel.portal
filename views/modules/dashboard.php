<?php
/**
 * views/modules/dashboard.php — Default Temiz Karşılama Ekranı
 */
$currentUser = Auth::user();
?>
<div id="tab-dashboard" class="tab-pane active space-y-6">
    <!-- Karşılama Banner -->
    <section class="glass-card rounded-3xl p-8 relative overflow-hidden border border-slate-800/80 shadow-2xl">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4 max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                <span>Geliştiriciye Hazır Temiz İskelet</span>
            </div>

            <h1 class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Hoş Geldiniz, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"><?php echo htmlspecialchars($currentUser['name'] ?? 'Kullanıcı'); ?></span>
            </h1>

            <p class="text-slate-400 text-sm leading-relaxed">
                Tüm eski modüller arındırıldı. Sistem şu an <strong>sıfır hata, saf Native PHP MVC ve SQLite</strong> altyapısıyla hazır bekliyor. İsteklerinize göre yeni sayfalar, menüler ve bileşenler adım adım buraya inşa edilecek.
            </p>

            <div class="pt-2 flex flex-wrap gap-3">
                <?php if (($currentUser['role'] ?? '') === 'ADMIN'): ?>
                <button onclick="Portal.switchTab('admin')" class="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all">
                    <i data-lucide="terminal" class="w-4 h-4"></i>
                    <span>Geliştirici Merkezine Git</span>
                </button>
                <?php endif; ?>
                <button onclick="Portal.toast('Sistem hazır, isteklerinizi iletebilirsiniz.', 'info')" class="px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 cursor-pointer transition-all">
                    <span>Sistem Durumu: Aktif</span>
                </button>
            </div>
        </div>
    </section>

    <!-- Hızlı Bilgi Kartları -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <i data-lucide="database" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-sm text-white">SQLite Veri Motoru</h3>
            <p class="text-xs text-slate-400">Veriler tarayıcıya değil, sunucuda <code class="text-emerald-400 font-mono">data/portal.sqlite</code> dosyasına kaydedilir.</p>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-sm text-white">Sunucu Taraflı Oturum</h3>
            <p class="text-xs text-slate-400">Tüm yetkiler PHP Sessions ile korunur; F12 veya konsoldan yetki aşılamaz.</p>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <i data-lucide="blocks" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-sm text-white">Modüler Genişleme</h3>
            <p class="text-xs text-slate-400">Yeni sayfa ve menü taleplerinize göre temiz bileşenler olarak eklenebilir.</p>
        </div>
    </div>
</div>