<?php
/**
 * Alt Script ve İkon Başlatıcı (footer.php)
 */
?>
    <!-- Ortak Modallar -->
    <?php include __DIR__ . '/modals.php'; ?>

    <!-- JAVASCRIPT MOTORLARI -->
    <script src="js/storage.js"></script>
    <script src="js/userManager.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/sound.js"></script>
    <script src="js/polymorphicStore.js"></script>
    <script src="js/moduleRegistry.js"></script>
    <script src="js/professionModules.js"></script>
    <script src="js/onboarding.js"></script>
    <script src="js/menus.js"></script>
    <script src="js/tasks.js"></script>
    <script src="js/reminders.js"></script>
    <script src="js/notes.js"></script>
    <script src="js/routines.js"></script>
    <script src="js/focus.js"></script>
    <script src="js/bist_database.js"></script>
    <script src="js/marketDataService.js"></script>
    <script src="js/finance_v2.js"></script>
    <script src="js/ipo.js"></script>
    <script src="js/cityLife.js"></script>
    <script src="js/subscriptions.js"></script>
    <script src="js/news.js"></script>
    <script src="js/weather.js"></script>
    <script src="js/vault.js"></script>
    <script src="js/admin.js"></script>
    <script src="js/app.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) window.lucide.createIcons();
        });
    </script>
</body>
</html>