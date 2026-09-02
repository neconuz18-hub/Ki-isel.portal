<?php
/**
 * Ana Sayfa & Dinamik Widget Panosu (modules/dashboard.php)
 */
?>
<div id="tab-dashboard" class="tab-pane active space-y-6">
    <!-- WELCOME & STATS BANNER -->
    <section class="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
                <h2 id="greetingText" class="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    İyi çalışmalar, <span class="text-blue-400"><?php echo htmlspecialchars($currentUserName); ?></span> 👋
                </h2>
                <p class="text-sm text-slate-400 mt-1 max-w-xl">
                    Bugünkü ajandanız, öncelikli görevleriniz ve önemli hatırlatıcılarınız hazır.
                </p>
            </div>

            <!-- Executive Mini Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-center min-w-[100px]">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Toplam İş</span>
                    <span id="statTotalTasks" class="text-xl font-mono font-bold text-white">0</span>
                </div>
                <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-center min-w-[100px]">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Tamamlanan</span>
                    <span id="statDoneTasks" class="text-xl font-mono font-bold text-emerald-400">0</span>
                </div>
                <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-center min-w-[100px]">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Bekleyen</span>
                    <span id="statPendingTasks" class="text-xl font-mono font-bold text-amber-400">0</span>
                </div>
                <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-center min-w-[100px]">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Hatırlatıcı</span>
                    <span id="statPendingReminders" class="text-xl font-mono font-bold text-purple-400">0</span>
                </div>
            </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Günün Başarı Oranı: <strong id="statProgressRate" class="text-white">%0</strong></span>
            <div class="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div id="dashboardProgressBar" class="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: 0%"></div>
            </div>
        </div>
    </section>

    <!-- QUICK CAPTURE BAR -->
    <div class="glass-card rounded-2xl p-2.5 border border-slate-700/60 shadow-lg">
        <form id="quickCaptureForm" class="flex flex-col sm:flex-row items-center gap-2">
            <div class="relative flex-1 w-full">
                <i data-lucide="plus-circle" class="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input type="text" id="quickCaptureInput" placeholder="Asistanınıza hızlı bir görev tanımlayın... (Enter'a basın)" class="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none">
            </div>
            <div class="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1">
                    <i data-lucide="corner-down-left" class="w-3.5 h-3.5"></i>
                    <span>Ekle</span>
                </button>
                <button type="button" onclick="window.app.openModal('newTaskModal')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1">
                    <i data-lucide="list-plus" class="w-3.5 h-3.5"></i>
                    <span>Detaylı Görev</span>
                </button>
                <button type="button" onclick="window.app.openModal('newReminderModal')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1">
                    <i data-lucide="bell" class="w-3.5 h-3.5 text-amber-400"></i>
                    <span>Hatırlatıcı</span>
                </button>
                <button type="button" onclick="window.app.openModal('newNoteModal')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1">
                    <i data-lucide="file-plus" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>Not</span>
                </button>
            </div>
        </form>
    </div>

    <!-- DYNAMIC DASHBOARD WIDGET GRID (12 Cols Sortable) -->
    <div id="dashboardWidgetGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        <!-- 1. Borsa & Finans Widget -->
        <div id="financeWidgetWrapper" data-widget-id="finance" class="dashboard-widget-wrapper lg:col-span-2 relative group">
            <div id="financeWidgetContainer"></div>
        </div>

        <!-- 2. Şehir & Yaşam Widget -->
        <div id="cityLifeWidgetWrapper" data-widget-id="cityLife" class="dashboard-widget-wrapper lg:col-span-1 relative group">
            <div id="cityLifeWidgetContainer"></div>
        </div>

        <!-- 3. Günün Görevleri Widget -->
        <div id="tasksWidgetWrapper" data-widget-id="tasks" class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg lg:col-span-2 relative group">
            <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Sürükleyip yerini değiştirin">
                        <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                        <i data-lucide="list-todo" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">Günün Öncelikli Görevleri</h3>
                        <p class="text-[10px] text-slate-400">Önem sırasına göre sıralı işler</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="window.app.minimizeWidget('tasks')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                        <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.app.openModal('newTaskModal')" class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                        <span>Yeni Ekle</span>
                    </button>
                </div>
            </div>
            <div class="p-5 space-y-4 widget-collapsible-content">
                <div id="dashboardTaskList" class="space-y-2"></div>
            </div>
        </div>

        <!-- 4. Abonelik & Ödeme Radarı Widget -->
        <div id="subscriptionsWidgetWrapper" data-widget-id="subscriptions" class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg lg:col-span-1 relative group">
            <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Sürükleyip yerini değiştirin">
                        <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                        <i data-lucide="credit-card" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">Abonelik & Ödeme Radarı</h3>
                        <p class="text-[10px] text-slate-400">Aylık sabit gider takibi</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="window.app.minimizeWidget('subscriptions')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                        <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.app.openModal('newSubscriptionModal')" class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                        <span>Yeni Ekle</span>
                    </button>
                </div>
            </div>
            <div class="p-5 space-y-4 widget-collapsible-content">
                <div id="subscriptionsWidgetContainer"></div>
            </div>
        </div>

        <!-- 5. Canlı Gündem & Haber Akışı Widget -->
        <div id="newsWidgetWrapper" data-widget-id="news" class="dashboard-widget-wrapper lg:col-span-2 relative group">
            <div id="newsWidgetContainer"></div>
        </div>

        <!-- 6. Yaklaşan Hatırlatıcılar Widget -->
        <div id="remindersWidgetWrapper" data-widget-id="reminders" class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg lg:col-span-1 relative group">
            <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Sürükleyip yerini değiştirin">
                        <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                        <i data-lucide="alarm-clock" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">Hatırlatıcılar</h3>
                        <p class="text-[10px] text-slate-400">Zamanlanmış uyarılar</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="window.app.minimizeWidget('reminders')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                        <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.app.openModal('newReminderModal')" class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>
            <div class="p-5 space-y-4 widget-collapsible-content">
                <div id="dashboardRemindersList" class="space-y-2.5"></div>
            </div>
        </div>

        <!-- 7. Hızlı Notlar Widget -->
        <div id="notesWidgetWrapper" data-widget-id="notes" class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg lg:col-span-1 relative group">
            <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Sürükleyip yerini değiştirin">
                        <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                        <i data-lucide="book-open" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">Hızlı Notlar</h3>
                        <p class="text-[10px] text-slate-400">Sabitlenen karalamalar</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="window.app.minimizeWidget('notes')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                        <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.app.openModal('newNoteModal')" class="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>
            <div class="p-5 space-y-4 widget-collapsible-content">
                <div id="dashboardNotesList" class="space-y-2"></div>
            </div>
        </div>

        <!-- 8. Odaklanma & Pomodoro Widget -->
        <div id="focusWidgetWrapper" data-widget-id="focus" class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg lg:col-span-1 relative group">
            <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Sürükleyip yerini değiştirin">
                        <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
                        <i data-lucide="target" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">Odaklanma Sayacı</h3>
                        <p class="text-[10px] text-slate-400">Pomodoro seansı</p>
                    </div>
                </div>
                <button onclick="window.app.minimizeWidget('focus')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                    <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            <div class="p-5 space-y-4 text-center widget-collapsible-content">
                <div id="focusTimerDisplay" class="text-4xl font-black font-mono tracking-tight text-white my-2">25:00</div>
                <div class="flex items-center justify-center gap-2">
                    <button id="focusToggleBtn" onclick="window.focusManager.toggle()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all">Başlat</button>
                    <button onclick="window.focusManager.reset()" class="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-all">Sıfırla</button>
                </div>
            </div>
        </div>

        <!-- 9. Günlük Rutinler Widget -->
        <div id="routinesWidgetWrapper" data-widget-id="routines" class="dashboard-widget-wrapper rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg lg:col-span-1 relative group">
            <div class="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/80 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="widget-drag-handle drag-grip-handle p-1 text-slate-500 hover:text-teal-400 rounded-lg hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing" title="Sürükleyip yerini değiştirin">
                        <i data-lucide="grip-vertical" class="w-4 h-4 pointer-events-none"></i>
                    </div>
                    <div class="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">Günlük Rutinler</h3>
                        <p class="text-[10px] text-slate-400">Tekrarlayan alışkanlıklar</p>
                    </div>
                </div>
                <button onclick="window.app.minimizeWidget('routines')" title="Yukarı Panele Küçült / Gizle" class="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                    <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            <div class="p-5 space-y-4 widget-collapsible-content">
                <div id="dashboardRoutinesList" class="space-y-2"></div>
            </div>
        </div>

    </div>
</div>