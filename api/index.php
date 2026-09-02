<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../models/TaskModel.php';
require_once __DIR__ . '/../models/ReminderModel.php';
require_once __DIR__ . '/../models/NoteModel.php';
require_once __DIR__ . '/../models/SubscriptionModel.php';
require_once __DIR__ . '/../models/FinanceModel.php';
require_once __DIR__ . '/../models/VaultModel.php';

$endpoint = $_GET['endpoint'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = Auth::user()['id'] ?? null;

// 1. AUTH
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

// 2. USERS (Admin Only)
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

// 3. TASKS
if ($endpoint === 'tasks') {
    if ($method === 'GET') Response::success(TaskModel::getAll($userId));
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => TaskModel::create($input, $userId)], 'Görev eklendi');
        if ($action === 'toggle') Response::success(TaskModel::toggle($input['id']), 'Durum güncellendi');
        if ($action === 'delete') Response::success(TaskModel::delete($input['id']), 'Görev silindi');
    }
}

// 4. REMINDERS
if ($endpoint === 'reminders') {
    if ($method === 'GET') Response::success(ReminderModel::getAll($userId));
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => ReminderModel::create($input, $userId)], 'Hatırlatıcı eklendi');
        if ($action === 'toggle') Response::success(ReminderModel::toggle($input['id']), 'Durum güncellendi');
        if ($action === 'delete') Response::success(ReminderModel::delete($input['id']), 'Hatırlatıcı silindi');
    }
}

// 5. NOTES
if ($endpoint === 'notes') {
    if ($method === 'GET') Response::success(NoteModel::getAll($userId));
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => NoteModel::create($input, $userId)], 'Not eklendi');
        if ($action === 'toggle_pin') Response::success(NoteModel::togglePin($input['id']), 'Sabitleme güncellendi');
        if ($action === 'delete') Response::success(NoteModel::delete($input['id']), 'Not silindi');
    }
}

// 6. SUBSCRIPTIONS
if ($endpoint === 'subscriptions') {
    if ($method === 'GET') Response::success(SubscriptionModel::getAll($userId));
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => SubscriptionModel::create($input, $userId)], 'Abonelik eklendi');
        if ($action === 'delete') Response::success(SubscriptionModel::delete($input['id']), 'Abonelik silindi');
    }
}

// 7. FINANCE PORTFOLIO
if ($endpoint === 'finance') {
    if ($method === 'GET') Response::success(FinanceModel::getPortfolio($userId));
    if ($method === 'POST') {
        $action = $input['action'] ?? 'add';
        if ($action === 'add') Response::success(['id' => FinanceModel::addPosition($input, $userId)], 'Pozisyon eklendi');
        if ($action === 'delete') Response::success(FinanceModel::deletePosition($input['id']), 'Pozisyon silindi');
    }
}

// 8. VAULT
if ($endpoint === 'vault') {
    if ($method === 'GET') Response::success(VaultModel::getAll($userId));
    if ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        if ($action === 'create') Response::success(['id' => VaultModel::create($input, $userId)], 'Kayıt eklendi');
        if ($action === 'delete') Response::success(VaultModel::delete($input['id']), 'Kayıt silindi');
    }
}

Response::error('Geçersiz API Endpoint', 404);