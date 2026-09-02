<?php
require_once __DIR__ . '/../config/Database.php';

class VaultModel {
    public static function getAll(?string $userId = null): array {
        $db = Database::connect();
        if ($userId && $userId !== 'usr_admin') {
            $stmt = $db->prepare("SELECT * FROM vault_records WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT * FROM vault_records ORDER BY created_at DESC");
        }
        $records = $stmt->fetchAll();
        foreach ($records as &$r) {
            $r['data'] = json_decode($r['data_json'], true);
        }
        return $records;
    }

    public static function create(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'vlt_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO vault_records (id, user_id, type, title, data_json, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            $data['type'] ?? 'secret_note',
            $data['title'],
            json_encode($data['data'] ?? []),
            date('c')
        ]);
        return $id;
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM vault_records WHERE id = ?");
        return $stmt->execute([$id]);
    }
}