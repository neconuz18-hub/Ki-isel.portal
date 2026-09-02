<?php
require_once __DIR__ . '/../config/Database.php';

class ReminderModel {
    public static function getAll(?string $userId = null): array {
        $db = Database::connect();
        if ($userId && $userId !== 'usr_admin') {
            $stmt = $db->prepare("SELECT * FROM reminders WHERE user_id = ? OR user_id IS NULL ORDER BY datetime ASC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT * FROM reminders ORDER BY datetime ASC");
        }
        return $stmt->fetchAll();
    }

    public static function create(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'rem_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO reminders (id, user_id, title, datetime, notes, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            $data['title'],
            $data['datetime'],
            $data['notes'] ?? '',
            0,
            date('c')
        ]);
        return $id;
    }

    public static function toggle(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE reminders SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM reminders WHERE id = ?");
        return $stmt->execute([$id]);
    }
}