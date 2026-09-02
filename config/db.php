<?php
/**
 * Veri Katmanı (db.php) — Güvenli JSON / Dosya Tabanlı Depolama
 */
require_once __DIR__ . '/config.php';

class Database {
    private static function getFilePath($key) {
        if (!is_dir(DATA_DIR)) {
            mkdir(DATA_DIR, 0777, true);
        }
        $safeKey = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $key);
        return DATA_DIR . '/' . $safeKey . '.json';
    }

    public static function get($key, $default = []) {
        $file = self::getFilePath($key);
        if (!file_exists($file)) {
            return $default;
        }
        $content = file_get_contents($file);
        $data = json_decode($content, true);
        return ($data !== null) ? $data : $default;
    }

    public static function set($key, $data) {
        $file = self::getFilePath($key);
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return (file_put_contents($file, $json, LOCK_EX) !== false);
    }

    public static function getUsers() {
        $users = self::get('users', []);
        if (empty($users)) {
            $defaultUsers = [
                [
                    'id' => 'usr_demo_1',
                    'name' => 'Örnek Kullanıcı (Öğretmen)',
                    'phone' => '0555 111 22 33',
                    'role' => 'ogrenci',
                    'presetId' => 'ogretmen_koc',
                    'assignedModules' => ['dashboard', 'ogretmen', 'tasks', 'notes', 'reminders', 'subscriptions'],
                    'createdAt' => date('c')
                ]
            ];
            self::set('users', $defaultUsers);
            return $defaultUsers;
        }
        return $users;
    }

    public static function saveUsers($users) {
        return self::set('users', $users);
    }
}