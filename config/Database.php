<?php
/**
 * SQLite Veritabanı Bağlantı ve Otomatik Tablo Kurucu (config/Database.php)
 */
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
            // Kullanıcılar Tablosu
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT,
                role TEXT NOT NULL DEFAULT 'USER',
                pin TEXT,
                assigned_modules TEXT,
                created_at TEXT NOT NULL
            )",

            // Görevler Tablosu
            "CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                category TEXT DEFAULT 'Genel',
                priority TEXT DEFAULT 'Normal',
                due_date TEXT,
                due_time TEXT,
                status TEXT DEFAULT 'pending',
                created_at TEXT NOT NULL
            )",

            // Hatırlatıcılar Tablosu
            "CREATE TABLE IF NOT EXISTS reminders (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                datetime TEXT NOT NULL,
                notes TEXT,
                completed INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            )",

            // Notlar Tablosu
            "CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                content TEXT,
                color TEXT DEFAULT 'blue',
                pinned INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",

            // Abonelikler Tablosu
            "CREATE TABLE IF NOT EXISTS subscriptions (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                category TEXT DEFAULT 'entertainment',
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'TRY',
                billing_cycle TEXT DEFAULT 'monthly',
                next_billing_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            )",

            // Portföy / Hisse Tablosu
            "CREATE TABLE IF NOT EXISTS portfolio (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                symbol TEXT NOT NULL,
                name TEXT,
                shares REAL NOT NULL,
                buy_price REAL NOT NULL,
                created_at TEXT NOT NULL
            )",

            // Kasa / Şifreli Kayıtlar Tablosu
            "CREATE TABLE IF NOT EXISTS vault_records (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                type TEXT NOT NULL, -- 'banking', 'secret_note', 'card'
                title TEXT NOT NULL,
                data_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            )"
        ];

        foreach ($queries as $sql) {
            self::$pdo->exec($sql);
        }

        // Başlangıç Yönetici Kullanıcısı Kontrolü
        $stmt = self::$pdo->query("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'");
        $adminCount = $stmt->fetch()['count'];
        if ($adminCount == 0) {
            $stmt = self::$pdo->prepare("INSERT INTO users (id, name, phone, role, pin, assigned_modules, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                'usr_admin',
                'Sistem Yöneticisi',
                '0500 000 00 00',
                'ADMIN',
                DEFAULT_ADMIN_PIN,
                json_encode(array_keys($GLOBALS['CORE_MODULES'])),
                date('c')
            ]);
        }
    }
}