<?php
/**
 * Oturum Doğrulama ve Rol Çözümleyici (auth_guard.php)
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$isAuthenticated = isset($_SESSION['role']);
$currentRole = $_SESSION['role'] ?? null; // 'ADMIN', 'USER'
$currentUserId = $_SESSION['user_id'] ?? null;
$currentUserName = $_SESSION['user_name'] ?? ($currentRole === 'ADMIN' ? 'Sistem Yöneticisi' : 'Misafir Kullanıcı');
$currentUserPreset = $_SESSION['preset_id'] ?? 'bireysel_zen';

// Aktif Kullanıcının Yetkili Modüllerini Hesapla
$userAllowedModules = [];
if ($currentRole === 'ADMIN') {
    $userAllowedModules = array_keys($ALL_MODULES);
} elseif ($currentUserId) {
    $users = Database::getUsers();
    $found = false;
    foreach ($users as $u) {
        if ($u['id'] === $currentUserId) {
            $userAllowedModules = $u['assignedModules'] ?? ['dashboard', 'tasks', 'notes'];
            $found = true;
            break;
        }
    }
    if (!$found) {
        $userAllowedModules = ['dashboard', 'tasks', 'notes', 'reminders'];
    }
} else {
    // Misafir kullanıcı
    $userAllowedModules = ['dashboard', 'tasks', 'reminders', 'notes', 'finance', 'subscriptions', 'ogretmen'];
}

if (!in_array('dashboard', $userAllowedModules)) {
    array_unshift($userAllowedModules, 'dashboard');
}

// Aktif Sekmeyi Belirle
$activeTab = $_GET['tab'] ?? 'dashboard';
if (!in_array($activeTab, $userAllowedModules) && $activeTab !== 'dashboard') {
    $activeTab = 'dashboard';
}