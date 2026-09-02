<?php
/**
 * Application Configuration & Environment Settings
 */
define('APP_NAME', 'Kişisel Portal');
define('APP_VERSION', '3.3.0-Enterprise');
define('DEFAULT_ADMIN_PIN', '1234');

// Dizinler
define('BASE_PATH', dirname(__DIR__));
define('DATA_DIR', BASE_PATH . '/data');
define('BACKUP_DIR', DATA_DIR . '/backups');
define('LOG_DIR', DATA_DIR . '/logs');
define('DB_PATH', DATA_DIR . '/portal.sqlite');

// Güvenlik ve Oturum Ayarları
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Strict');
    session_start();
}

// Otomatik Dizin Oluşturma
foreach ([DATA_DIR, BACKUP_DIR, LOG_DIR] as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}
