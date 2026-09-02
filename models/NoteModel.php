<?php
require_once __DIR__ . '/../config/Database.php';

class NoteModel {
    public static function getAll(?string $userId = null): array {
        $db = Database::connect();
        if ($userId && $userId !== 'usr_admin') {
            $stmt = $db->prepare("SELECT * FROM notes WHERE user_id = ? OR user_id IS NULL ORDER BY pinned DESC, updated_at DESC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC");
        }
        return $stmt->fetchAll();
    }

    public static function create(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'note_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO notes (id, user_id, title, content, color, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            $data['title'],
            $data['content'] ?? '',
            $data['color'] ?? 'blue',
            $data['pinned'] ?? 0,
            date('c'),
            date('c')
        ]);
        return $id;
    }

    public static function togglePin(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE notes SET pinned = CASE WHEN pinned = 1 THEN 0 ELSE 1 END WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM notes WHERE id = ?");
        return $stmt->execute([$id]);
    }
}