<?php
require_once __DIR__ . '/../config/Database.php';

class MenuModel {
    public static function getAll(): array {
        $db = Database::connect();
        $stmt = $db->query("SELECT * FROM menu_pool ORDER BY order_index ASC, label ASC");
        return $stmt->fetchAll();
    }

    public static function getActiveMenus(): array {
        $db = Database::connect();
        $stmt = $db->query("SELECT * FROM menu_pool WHERE is_active = 1 ORDER BY order_index ASC");
        return $stmt->fetchAll();
    }

    public static function toggleActive(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE menu_pool SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public static function create(array $data): string {
        $db = Database::connect();
        $id = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '_', $data['id'] ?? ('menu_' . time())));
        $stmt = $db->prepare("INSERT INTO menu_pool (id, label, icon, category, is_active, order_index, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['label'],
            $data['icon'] ?? 'folder',
            $data['category'] ?? 'custom',
            1,
            $data['order_index'] ?? 10,
            $data['description'] ?? ''
        ]);
        return $id;
    }
}
