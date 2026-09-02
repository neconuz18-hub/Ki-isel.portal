<?php
require_once __DIR__ . '/../config/Database.php';

class FinanceModel {
    public static function getPortfolio(?string $userId = null): array {
        $db = Database::connect();
        if ($userId && $userId !== 'usr_admin') {
            $stmt = $db->prepare("SELECT * FROM portfolio WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT * FROM portfolio ORDER BY created_at DESC");
        }
        return $stmt->fetchAll();
    }

    public static function addPosition(array $data, ?string $userId = null): string {
        $db = Database::connect();
        $id = 'pos_' . time() . '_' . rand(100, 999);
        $stmt = $db->prepare("INSERT INTO portfolio (id, user_id, symbol, name, shares, buy_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $userId,
            strtoupper($data['symbol']),
            $data['name'] ?? $data['symbol'],
            $data['shares'],
            $data['buy_price'],
            date('c')
        ]);
        return $id;
    }

    public static function deletePosition(string $id): bool {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM portfolio WHERE id = ?");
        return $stmt->execute([$id]);
    }
}