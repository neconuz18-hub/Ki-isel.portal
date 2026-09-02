<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$action = $_GET['action'] ?? ($_POST['action'] ?? 'status');

if ($action === 'status') {
    echo json_encode([
        'authenticated' => isset($_SESSION['role']),
        'role' => $_SESSION['role'] ?? null,
        'userId' => $_SESSION['user_id'] ?? null,
        'userName' => $_SESSION['user_name'] ?? null
    ]);
    exit;
}

if ($action === 'login_admin') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $pin = $input['pin'] ?? '';
    
    if ($pin === ADMIN_PIN) {
        $_SESSION['role'] = 'ADMIN';
        $_SESSION['user_id'] = 'admin';
        $_SESSION['user_name'] = 'Sistem Yöneticisi';
        echo json_encode(['success' => true, 'role' => 'ADMIN']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hatalı PIN!']);
    }
    exit;
}

if ($action === 'login_user') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $userId = $input['userId'] ?? null;
    
    if ($userId) {
        $users = Database::getUsers();
        $user = null;
        foreach ($users as $u) {
            if ($u['id'] === $userId) {
                $user = $u;
                break;
            }
        }
        
        if ($user) {
            if (!empty($user['pin'])) {
                $pin = $input['pin'] ?? '';
                if ($pin !== $user['pin']) {
                    echo json_encode(['success' => false, 'message' => 'Hatalı Kullanıcı PIN!']);
                    exit;
                }
            }
            $_SESSION['role'] = 'USER';
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['preset_id'] = $user['presetId'] ?? 'bireysel_zen';
            echo json_encode(['success' => true, 'user' => $user]);
            exit;
        }
    }
    
    // Misafir giriş
    $_SESSION['role'] = 'USER';
    $_SESSION['user_id'] = null;
    $_SESSION['user_name'] = 'Misafir Kullanıcı';
    echo json_encode(['success' => true, 'role' => 'USER']);
    exit;
}

if ($action === 'logout') {
    session_unset();
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['error' => 'Geçersiz işlem']);