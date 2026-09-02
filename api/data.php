<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$key = $_GET['key'] ?? 'portal_data';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $data = Database::get($key, []);
    echo json_encode($data);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input !== null) {
        $saved = Database::set($key, $input);
        echo json_encode(['success' => $saved]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Geçersiz JSON verisi']);
    }
    exit;
}

echo json_encode(['error' => 'Geçersiz istek']);