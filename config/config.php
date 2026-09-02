<?php
/**
 * Sistem Konfigürasyonu ve Sabitleri (config.php)
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('APP_NAME', 'Kişisel Portal');
define('APP_VERSION', '2.5');
define('ADMIN_PIN', '1234');
define('DATA_DIR', __DIR__ . '/../data');

// Tüm Desteklenen Modüller
$ALL_MODULES = [
    'dashboard' => ['id' => 'dashboard', 'label' => 'Ana Sayfa & Özet', 'icon' => 'layout-dashboard', 'category' => 'core'],
    'tasks' => ['id' => 'tasks', 'label' => 'Görevler & Yapılacaklar', 'icon' => 'check-square', 'category' => 'core'],
    'reminders' => ['id' => 'reminders', 'label' => 'Hatırlatıcılar', 'icon' => 'bell', 'category' => 'core'],
    'notes' => ['id' => 'notes', 'label' => 'Hızlı Not Defteri', 'icon' => 'file-text', 'category' => 'core'],
    'finance' => ['id' => 'finance', 'label' => 'Borsa & Finans Portföyü', 'icon' => 'trending-up', 'category' => 'finance'],
    'subscriptions' => ['id' => 'subscriptions', 'label' => 'Abonelik & Ödeme Radarı', 'icon' => 'credit-card', 'category' => 'finance'],
    'ogretmen' => ['id' => 'ogretmen', 'label' => 'Koçluk & Özel Ders Portalı', 'icon' => 'graduation-cap', 'category' => 'profession'],
    'veresiye' => ['id' => 'veresiye', 'label' => 'Esnaf & Veresiye Defteri', 'icon' => 'shopping-cart', 'category' => 'profession'],
    'nobet' => ['id' => 'nobet', 'label' => 'Nöbet & Vardiya Takibi', 'icon' => 'stethoscope', 'category' => 'profession'],
    'durusma' => ['id' => 'durusma', 'label' => 'Avukat & Dava Ajandası', 'icon' => 'scale', 'category' => 'profession'],
    'emlak' => ['id' => 'emlak', 'label' => 'Emlak Portföy & Randevu', 'icon' => 'building-2', 'category' => 'profession'],
    'vault' => ['id' => 'vault', 'label' => 'Güvenli Kasa', 'icon' => 'lock', 'category' => 'security'],
    'admin' => ['id' => 'admin', 'label' => 'Geliştirici & Admin', 'icon' => 'settings', 'category' => 'system']
];

// Meslek Şablonları (Presets)
$PRESETS = [
    'bireysel_zen' => [
        'id' => 'bireysel_zen',
        'title' => 'Bireysel & Zen',
        'icon' => 'sparkles',
        'defaultModules' => ['dashboard', 'tasks', 'reminders', 'notes', 'subscriptions', 'vault']
    ],
    'ogretmen_koc' => [
        'id' => 'ogretmen_koc',
        'title' => 'Öğretmen & Eğitim Koçu',
        'icon' => 'graduation-cap',
        'defaultModules' => ['dashboard', 'ogretmen', 'tasks', 'reminders', 'notes', 'subscriptions']
    ],
    'bakkal_esnaf' => [
        'id' => 'bakkal_esnaf',
        'title' => 'Bakkal & Esnaf',
        'icon' => 'shopping-cart',
        'defaultModules' => ['dashboard', 'veresiye', 'tasks', 'reminders', 'subscriptions']
    ],
    'doktor_saglik' => [
        'id' => 'doktor_saglik',
        'title' => 'Doktor & Sağlıkçı',
        'icon' => 'stethoscope',
        'defaultModules' => ['dashboard', 'nobet', 'tasks', 'reminders', 'notes', 'vault']
    ],
    'avukat_hukuk' => [
        'id' => 'avukat_hukuk',
        'title' => 'Avukat & Hukukçu',
        'icon' => 'scale',
        'defaultModules' => ['dashboard', 'durusma', 'tasks', 'reminders', 'notes', 'vault']
    ],
    'emlak_broker' => [
        'id' => 'emlak_broker',
        'title' => 'Emlak & Gayrimenkul',
        'icon' => 'building-2',
        'defaultModules' => ['dashboard', 'emlak', 'tasks', 'reminders', 'notes', 'finance']
    ],
    'yatirimci_trader' => [
        'id' => 'yatirimci_trader',
        'title' => 'Yatırımcı & Trader',
        'icon' => 'trending-up',
        'defaultModules' => ['dashboard', 'finance', 'subscriptions', 'tasks', 'notes', 'vault']
    ]
];