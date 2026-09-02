<?php
require_once __DIR__ . '/../config/Database.php';

class MigrationEngine {
    public static function runMigrations(): array {
        $db = Database::connect();
        $applied = [];

        // 1. Sürüm tablosu oluştur
        $db->exec("CREATE TABLE IF NOT EXISTS schema_versions (
            version INTEGER PRIMARY KEY,
            applied_at TEXT
        )");

        // 2. Migration Listesi
        $migrations = [
            1 => [
                'name' => 'Initial Base Tables',
                'sql' => "
                    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, role TEXT, created_at TEXT);
                    CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, content TEXT, icon TEXT, color TEXT, tags TEXT, pinned INTEGER, category TEXT DEFAULT 'Tümü', created_at TEXT, updated_at TEXT);
                    CREATE TABLE IF NOT EXISTS menu_pool (id TEXT PRIMARY KEY, label TEXT, icon TEXT, category TEXT, is_active INTEGER, order_index INTEGER, description TEXT);
                "
            ],
            2 => [
                'name' => 'Add Category to Notes if missing',
                'sql' => "
                    -- SQLite ALTER TABLE safe check
                "
            ]
        ];

        foreach ($migrations as $version => $m) {
            $stmt = $db->prepare("SELECT version FROM schema_versions WHERE version = ?");
            $stmt->execute([$version]);
            if (!$stmt->fetch()) {
                if (!empty(trim($m['sql']))) {
                    $db->exec($m['sql']);
                }
                $ins = $db->prepare("INSERT INTO schema_versions (version, applied_at) VALUES (?, datetime('now'))");
                $ins->execute([$version]);
                $applied[] = "v$version: " . $m['name'];
            }
        }

        return $applied;
    }
}
