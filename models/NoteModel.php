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
        $notes = $stmt->fetchAll();
        foreach ($notes as &$n) {
            $n['tags'] = json_decode($n['tags'] ?? '[]', true) ?: [];
        }
        return $notes;
    }

    public static function getById(string $id): ?array {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM notes WHERE id = ?");
        $stmt->execute([$id]);
        $note = $stmt->fetch();
        if ($note) {
            $note['tags'] = json_decode($note['tags'] ?? '[]', true) ?: [];
        }
        return $note ?: null;
    }

    public static function create(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'note_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO notes (id, user_id, title, content, icon, color, tags, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            $data['title'] ?: 'Başlıksız Not',
            $data['content'] ?? '',
            $data['icon'] ?? '📝',
            $data['color'] ?? 'blue',
            json_encode($data['tags'] ?? []),
            $data['pinned'] ?? 0,
            date('c'),
            date('c')
        ]);
        return $id;
    }

    public static function update(string $id, array $data): bool {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE notes SET title = ?, content = ?, icon = ?, color = ?, tags = ?, pinned = ?, updated_at = ? WHERE id = ?");
        return $stmt->execute([
            $data['title'] ?: 'Başlıksız Not',
            $data['content'] ?? '',
            $data['icon'] ?? '📝',
            $data['color'] ?? 'blue',
            json_encode($data['tags'] ?? []),
            $data['pinned'] ?? 0,
            date('c'),
            $id
        ]);
    }

    public static function togglePin(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE notes SET pinned = CASE WHEN pinned = 1 THEN 0 ELSE 1 END, updated_at = ? WHERE id = ?");
        return $stmt->execute([date('c'), $id]);
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM notes WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
