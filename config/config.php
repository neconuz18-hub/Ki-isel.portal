<?php
/**
 * Sistem Yapılandırması (config/config.php)
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('APP_NAME', 'Kişisel Portal');
define('APP_VERSION', '3.1 DEV');
define('DEFAULT_ADMIN_PIN', '1234');
define('DATA_DIR', __DIR__ . '/../data');
define('DB_PATH', DATA_DIR . '/portal.sqlite');

// Temel Menü Yapısı (Varsayılan)
$CORE_MODULES = [
    'dashboard' => ['id' => 'dashboard', 'label' => 'Ana Sayfa', 'icon' => 'layout-dashboard'],
    'admin'     => ['id' => 'admin',     'label' => 'Geliştirici & Yönetim', 'icon' => 'terminal']
];