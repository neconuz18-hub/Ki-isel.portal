<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(Database::getUsers());
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $action = $input['action'] ?? 'create';
    $users = Database::getUsers();
    
    if ($action === 'create') {
        $newUser = [
            'id' => 'usr_' . time() . '_' . rand(100, 999),
            'name' => $input['name'] ?? 'Yeni Kullanıcı',
            'phone' => $input['phone'] ?? '',
            'role' => $input['role'] ?? 'genel',
            'presetId' => $input['presetId'] ?? null,
            'pin' => $input['pin'] ?? null,
            'assignedModules' => $input['assignedModules'] ?? ['dashboard', 'tasks', 'notes'],
            'createdAt' => date('c')
        ];
        $users[] = $newUser;
        Database::saveUsers($users);
        echo json_encode(['success' => true, 'user' => $newUser]);
        exit;
    }
    
    if ($action === 'update') {
        $id = $input['id'] ?? null;
        $updated = false;
        foreach ($users as &$u) {
            if ($u['id'] === $id) {
                if (isset($input['name'])) $u['name'] = $input['name'];
                if (isset($input['phone'])) $u['phone'] = $input['phone'];
                if (isset($input['pin'])) $u['pin'] = $input['pin'];
                if (isset($input['presetId'])) $u['presetId'] = $input['presetId'];
                if (isset($input['assignedModules'])) $u['assignedModules'] = $input['assignedModules'];
                $u['updatedAt'] = date('c');
                $updated = true;
                break;
            }
        }
        if ($updated) {
            Database::saveUsers($users);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Kullanıcı bulunamadı']);
        }
        exit;
    }
    
    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        $users = array_values(array_filter($users, fn($u) => $u['id'] !== $id));
        Database::saveUsers($users);
        echo json_encode(['success' => true]);
        exit;
    }
}

echo json_encode(['error' => 'Geçersiz istek']);