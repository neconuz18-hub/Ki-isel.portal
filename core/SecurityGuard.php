<?php
/**
 * Enterprise Security Guard & Sanitizer
 */
class SecurityGuard {
    public static function cleanInput($data) {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = self::cleanInput($value);
            }
            return $data;
        }
        if (is_string($data)) {
            $data = trim($data);
            // XSS ve zararlı script temizliği
            $data = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $data);
            return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }
        return $data;
    }

    public static function generateCsrfToken(): string {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function validateCsrfToken(?string $token): bool {
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }
}
