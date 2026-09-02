<?php
/**
 * Kişisel Portal — Front Controller (index.php)
 */
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/core/Auth.php';
require_once __DIR__ . '/models/UserModel.php';
require_once __DIR__ . '/models/TaskModel.php';
require_once __DIR__ . '/models/ReminderModel.php';
require_once __DIR__ . '/models/NoteModel.php';
require_once __DIR__ . '/models/SubscriptionModel.php';
require_once __DIR__ . '/models/FinanceModel.php';
require_once __DIR__ . '/models/VaultModel.php';
?>
<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?> — Universal Enterprise OS</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        slate: { 950: '#070a13', 900: '#0b0f19', 850: '#111726', 800: '#161f33', 700: '#23304b' },
                        blue: { 500: '#3b82f6', 600: '#2563eb' }
                    }
                }
            }
        }
    </script>

    <!-- Lucide Icons & Sortable.js -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="js/sortable.min.js"></script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

    <!-- Custom Stylesheet -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-[#0b0f19] text-slate-100 min-h-screen flex antialiased selection:bg-blue-500 selection:text-white">

    <!-- 1. GİRİŞ KAPISI -->
    <?php include __DIR__ . '/views/auth/gateway.php'; ?>

    <!-- 2. MOBİL OVERLAY -->
    <div id="sidebarOverlay" onclick="Portal.closeMobileSidebar()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden lg:hidden"></div>

    <!-- 3. SOL MENÜ -->
    <?php include __DIR__ . '/views/layout/sidebar.php'; ?>

    <!-- 4. ANA İÇERİK -->
    <div class="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <?php include __DIR__ . '/views/layout/header.php'; ?>

        <main class="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
            <?php include __DIR__ . '/views/modules/dashboard.php'; ?>
            <?php include __DIR__ . '/views/modules/tasks.php'; ?>
            <?php include __DIR__ . '/views/modules/reminders.php'; ?>
            <?php include __DIR__ . '/views/modules/notes.php'; ?>
            <?php include __DIR__ . '/views/modules/finance.php'; ?>
            <?php include __DIR__ . '/views/modules/subscriptions.php'; ?>
            <?php include __DIR__ . '/views/modules/vault.php'; ?>
            <?php include __DIR__ . '/views/modules/admin.php'; ?>
        </main>
    </div>

    <!-- 5. ALT BİLGİ & SCRIPTLER -->
    <?php include __DIR__ . '/views/layout/footer.php'; ?>