<?php
require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $pdo = null;

    public static function connect(): PDO {
        if (self::$pdo === null) {
            if (!is_dir(DATA_DIR)) {
                mkdir(DATA_DIR, 0777, true);
            }

            self::$pdo = new PDO('sqlite:' . DB_PATH);
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            self::migrate();
        }
        return self::$pdo;
    }

    private static function migrate(): void {
        $queries = [
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT,
                role TEXT NOT NULL DEFAULT 'USER',
                pin TEXT,
                assigned_modules TEXT,
                created_at TEXT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                content TEXT,
                icon TEXT DEFAULT '📝',
                color TEXT DEFAULT 'blue',
                tags TEXT,
                pinned INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS menu_pool (
                id TEXT PRIMARY KEY,
                label TEXT NOT NULL,
                icon TEXT NOT NULL,
                category TEXT DEFAULT 'genel',
                is_active INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                description TEXT
            )"
        ];

        foreach ($queries as $sql) {
            self::$pdo->exec($sql);
        }

        $stmt = self::$pdo->query("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'");
        if ($stmt->fetch()['count'] == 0) {
            $stmt = self::$pdo->prepare("INSERT INTO users (id, name, phone, role, pin, assigned_modules, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                'usr_admin',
                'Sistem Yöneticisi',
                '0500 000 00 00',
                'ADMIN',
                DEFAULT_ADMIN_PIN,
                json_encode(['dashboard', 'notes', 'menu_manager', 'admin']),
                date('c')
            ]);
        }

        $stmt = self::$pdo->query("SELECT COUNT(*) as count FROM menu_pool");
        if ($stmt->fetch()['count'] == 0) {
            $defaultMenus = [
                ['dashboard', 'Ana Sayfa & Notlar', 'layout-dashboard', 'core', 1, 1, 'Kişisel pano ve Notion not çalışma alanı'],
                ['tasks', 'Görev & Proje Takibi', 'check-square', 'productivity', 0, 2, 'Kategori ve öncelik bazlı iş listesi'],
                ['finance', 'Finans & Portföy', 'trending-up', 'finance', 0, 3, 'Canlı borsa, döviz ve portföy takibi'],
                ['subscriptions', 'Abonelik Radarı', 'credit-card', 'finance', 0, 4, 'Aylık ve yıllık düzenli ödeme takvimi'],
                ['vault', 'Güvenli Kasa', 'lock', 'security', 0, 5, 'Şifreli hesaplar ve gizli kayıtlar'],
                ['admin', 'Geliştirici & Yönetim', 'terminal', 'system', 1, 99, 'Kullanıcı ve menü yapılandırma merkezi']
            ];
            $insert = self::$pdo->prepare("INSERT INTO menu_pool (id, label, icon, category, is_active, order_index, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
            foreach ($defaultMenus as $m) {
                $insert->execute($m);
            }
        }
    }
}
