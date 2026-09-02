<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../models/NoteModel.php';
require_once __DIR__ . '/../models/MenuModel.php';

$endpoint = $_GET['endpoint'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = Auth::user()['id'] ?? null;

if ($endpoint === 'auth') {
    $action = $_GET['action'] ?? ($input['action'] ?? 'status');
    if ($action === 'status') {
        Response::json(['authenticated' => Auth::check(), 'user' => Auth::user()]);
    }
    if ($action === 'login_admin') {
        $pin = $input['pin'] ?? '';
        if (Auth::loginAdmin($pin)) Response::success(Auth::user(), 'Yönetici girişi başarılı');
        Response::error('Hatalı Yönetici PIN!', 401);
    }
    if ($action === 'login_user') {
        $uid = $input['userId'] ?? null;
        $pin = $input['pin'] ?? null;
        $res = Auth::loginUser($uid, $pin);
        if ($res['success']) Response::success(Auth::user(), 'Giriş başarılı');
        Response::error($res['message'] ?? 'Giriş başarısız', 401);
    }
    if ($action === 'logout') {
        Auth::logout();
        Response::success(null, 'Oturum kapatıldı');
    }
}

if ($endpoint === 'users') {
    if ($method === 'GET') Response::success(UserModel::getAll());
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => UserModel::create($input)], 'Kullanıcı eklendi');
        if ($action === 'delete') Response::success(UserModel::delete($input['id']), 'Kullanıcı silindi');
    }
}

if ($endpoint === 'notes') {
    if ($method === 'GET') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            Response::success(NoteModel::getById($id));
        } else {
            Response::success(NoteModel::getAll($userId));
        }
    }
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => NoteModel::create($input, $userId)], 'Not oluşturuldu');
        if ($action === 'update') Response::success(NoteModel::update($input['id'], $input), 'Not güncellendi');
        if ($action === 'toggle_pin') Response::success(NoteModel::togglePin($input['id']), 'Sabitleme güncellendi');
        if ($action === 'delete') Response::success(NoteModel::delete($input['id']), 'Not silindi');
    }
}

if ($endpoint === 'menus') {
    if ($method === 'GET') Response::success(MenuModel::getAll());
    if ($method === 'POST') {
        $action = $input['action'] ?? 'toggle';
        if ($action === 'toggle') Response::success(MenuModel::toggleActive($input['id']), 'Menü güncellendi');
        if ($action === 'create') Response::success(['id' => MenuModel::create($input)], 'Menü oluşturuldu');
    }
}

Response::error('Geçersiz API Endpoint', 404);
