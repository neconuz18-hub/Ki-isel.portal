<?php
require_once __DIR__ . '/../config/Database.php';

class UserModel {
    public static function getAll(): array {
        $db = Database::connect();
        $stmt = $db->query("SELECT * FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        foreach ($users as &$u) {
            $u['assigned_modules'] = json_decode($u['assigned_modules'] ?? '[]', true);
        }
        return $users;
    }

    public static function getById(string $id): ?array {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $u = $stmt->fetch();
        if ($u) {
            $u['assigned_modules'] = json_decode($u['assigned_modules'] ?? '[]', true);
        }
        return $u ?: null;
    }

    public static function create(array $data): string {
        $db = Database::connect();
        $id = 'usr_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO users (id, name, phone, role, pin, assigned_modules, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['name'] ?? 'Yeni Kullanıcı',
            $data['phone'] ?? '',
            $data['role'] ?? 'USER',
            $data['pin'] ?? null,
            json_encode($data['assigned_modules'] ?? ['dashboard', 'tasks', 'notes']),
            date('c')
        ]);
        return $id;
    }

    public static function update(string $id, array $data): bool {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE users SET name = ?, phone = ?, pin = ?, assigned_modules = ? WHERE id = ?");
        return $stmt->execute([
            $data['name'],
            $data['phone'] ?? '',
            $data['pin'] ?? null,
            json_encode($data['assigned_modules'] ?? ['dashboard', 'tasks', 'notes']),
            $id
        ]);
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM users WHERE id = ? AND id != 'usr_admin'");
        return $stmt->execute([$id]);
    }
}