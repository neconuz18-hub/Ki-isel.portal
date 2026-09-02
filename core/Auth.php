<?php
/**
 * Kimlik Doğrulama & Oturum Yöneticisi (core/Auth.php)
 */
require_once __DIR__ . '/../config/Database.php';

class Auth {
    public static function check(): bool {
        return isset($_SESSION['role']);
    }

    public static function role(): ?string {
        return $_SESSION['role'] ?? null;
    }

    public static function user(): ?array {
        if (!self::check()) return null;
        return [
            'id' => $_SESSION['user_id'] ?? null,
            'name' => $_SESSION['user_name'] ?? 'Misafir',
            'role' => $_SESSION['role'] ?? 'USER',
            'modules' => $_SESSION['user_modules'] ?? ['dashboard', 'tasks', 'notes']
        ];
    }

    public static function loginAdmin(string $pin): bool {
        if ($pin === DEFAULT_ADMIN_PIN) {
            $_SESSION['role'] = 'ADMIN';
            $_SESSION['user_id'] = 'usr_admin';
            $_SESSION['user_name'] = 'Sistem Yöneticisi';
            $_SESSION['user_modules'] = array_keys($GLOBALS['CORE_MODULES']);
            return true;
        }
        return false;
    }

    public static function loginUser(?string $userId, ?string $pin = null): array {
        if (!$userId) {
            // Misafir Girişi
            $_SESSION['role'] = 'USER';
            $_SESSION['user_id'] = 'guest_' . time();
            $_SESSION['user_name'] = 'Misafir Kullanıcı';
            $_SESSION['user_modules'] = ['dashboard', 'tasks', 'reminders', 'notes', 'finance', 'subscriptions'];
            return ['success' => true];
        }

        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) {
            return ['success' => false, 'message' => 'Kullanıcı bulunamadı!'];
        }

        if (!empty($user['pin']) && $user['pin'] !== $pin) {
            return ['success' => false, 'message' => 'Hatalı PIN Kodu!'];
        }

        $_SESSION['role'] = $user['role'];
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_modules'] = json_decode($user['assigned_modules'] ?? '[]', true) ?: ['dashboard', 'tasks', 'notes'];

        if (!in_array('dashboard', $_SESSION['user_modules'])) {
            array_unshift($_SESSION['user_modules'], 'dashboard');
        }

        return ['success' => true, 'user' => $user];
    }

    public static function logout(): void {
        session_unset();
        session_destroy();
    }
}