<?php
require_once __DIR__ . '/../config/Database.php';

class SubscriptionModel {
    public static function getAll(?string $userId = null): array {
        $db = Database::connect();
        if ($userId && $userId !== 'usr_admin') {
            $stmt = $db->prepare("SELECT * FROM subscriptions WHERE user_id = ? OR user_id IS NULL ORDER BY next_billing_date ASC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT * FROM subscriptions ORDER BY next_billing_date ASC");
        }
        return $stmt->fetchAll();
    }

    public static function create(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'sub_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO subscriptions (id, user_id, title, category, amount, currency, billing_cycle, next_billing_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            $data['title'],
            $data['category'] ?? 'entertainment',
            $data['amount'],
            $data['currency'] ?? 'TRY',
            $data['billing_cycle'] ?? 'monthly',
            $data['next_billing_date'],
            date('c')
        ]);
        return $id;
    }

    public static function delete(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM subscriptions WHERE id = ?");
        return $stmt->execute([$id]);
    }
}