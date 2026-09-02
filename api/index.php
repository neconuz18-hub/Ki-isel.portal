<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';

$endpoint = $_GET['endpoint'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// 1. AUTH ENDPOINTS
if ($endpoint === 'auth') {
    $action = $_GET['action'] ?? ($input['action'] ?? 'status');

    if ($action === 'status') {
        Response::json([
            'authenticated' => Auth::check(),
            'user'          => Auth::user()
        ]);
    }

    if ($action === 'login_admin') {
        $pin = $input['pin'] ?? '';
        if (Auth::loginAdmin($pin)) {
            Response::success(Auth::user(), 'Yönetici girişi başarılı');
        }
        Response::error('Hatalı Yönetici PIN!', 401);
    }

    if ($action === 'login_user') {
        $uid = $input['userId'] ?? null;
        $pin = $input['pin'] ?? null;
        $res = Auth::loginUser($uid, $pin);
        if ($res['success']) {
            Response::success(Auth::user(), 'Giriş başarılı');
        }
        Response::error($res['message'] ?? 'Giriş başarısız', 401);
    }

    if ($action === 'logout') {
        Auth::logout();
        Response::success(null, 'Oturum kapatıldı');
    }
}

// 2. USERS ENDPOINTS
if ($endpoint === 'users') {
    if ($method === 'GET') {
        Response::success(UserModel::getAll());
    }
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') {
            $id = UserModel::create($input);
            Response::success(['id' => $id], 'Kullanıcı oluşturuldu');
        }
        if ($action === 'update') {
            UserModel::update($input['id'], $input);
            Response::success(null, 'Kullanıcı güncellendi');
        }
        if ($action === 'delete') {
            UserModel::delete($input['id']);
            Response::success(null, 'Kullanıcı silindi');
        }
    }
}

Response::error('Geçersiz API Endpoint', 404);