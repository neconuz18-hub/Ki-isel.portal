<?php
/**
 * Sistem Yapılandırması (config/config.php)
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('APP_NAME', 'Kişisel Portal');
define('APP_VERSION', '3.0 PRO');
define('DEFAULT_ADMIN_PIN', '1234');
define('DATA_DIR', __DIR__ . '/../data');
define('DB_PATH', DATA_DIR . '/portal.sqlite');

// Çekirdek Modüller
$CORE_MODULES = [
    'dashboard'     => ['id' => 'dashboard',     'label' => 'Ana Sayfa & Özet',       'icon' => 'layout-dashboard'],
    'tasks'         => ['id' => 'tasks',         'label' => 'Görevler & İşler',        'icon' => 'check-square'],
    'reminders'     => ['id' => 'reminders',     'label' => 'Hatırlatıcılar',          'icon' => 'bell'],
    'notes'         => ['id' => 'notes',         'label' => 'Hızlı Not Defteri',       'icon' => 'file-text'],
    'finance'       => ['id' => 'finance',       'label' => 'Borsa & Finans Portföyü', 'icon' => 'trending-up'],
    'subscriptions' => ['id' => 'subscriptions', 'label' => 'Abonelik & Ödeme Radarı', 'icon' => 'credit-card'],
    'vault'         => ['id' => 'vault',         'label' => 'Güvenli Kasa',            'icon' => 'lock'],
    'admin'         => ['id' => 'admin',         'label' => 'Yönetim Merkezi',         'icon' => 'settings']
];