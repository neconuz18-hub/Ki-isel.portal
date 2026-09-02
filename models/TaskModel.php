<?php
require_once __DIR__ . '/../config/Database.php';

class TaskModel {
    public static function getAll(?string $userId = null): array {
        $db = Database::connect();
        if ($userId && $userId !== 'usr_admin') {
            $stmt = $db->prepare("SELECT * FROM tasks WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT * FROM tasks ORDER BY created_at DESC");
        }
        return $stmt->fetchAll();
    }

    public static function create(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'task_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO tasks (id, user_id, title, category, priority, due_date, due_time, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            $data['title'],
            $data['category'] ?? 'Genel',
            $data['priority'] ?? 'Normal',
            $data['due_date'] ?? date('Y-m-d'),
            $data['due_time'] ?? null,
            'pending',
            date('c')
        ]);
        return $id;
    }

    public static function toggle(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT status FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        $task = $stmt->fetch();
        if (!$task) return false;

        $newStatus = ($task['status'] === 'completed') ? 'pending' : 'completed';
        $update = $db->prepare("UPDATE tasks SET status = ? WHERE id = ?");
        return $update->execute([$newStatus, $id]);
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM tasks WHERE id = ?");
        return $stmt->execute([$id]);
    }
}