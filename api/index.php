<?php
/**
 * Kişisel Portal — REST JSON Front Controller & API Gateway
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/SecurityGuard.php';
require_once __DIR__ . '/../core/SentinelWorker.php';
require_once __DIR__ . '/../core/ErrorLogger.php';
require_once __DIR__ . '/../core/FinanceEngine.php';
require_once __DIR__ . '/../models/MenuModel.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

$endpoint = $_GET['endpoint'] ?? '';
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($endpoint) {
        case 'sentinel':
            if ($action === 'check') {
                $report = SentinelWorker::runIntegrityScan();
                Response::success($report, 'Sentinel sağlık taraması tamamlandı');
            }
            Response::error('Geçersiz sentinel aksiyonu', 400);
            break;

        case 'finance':
            if ($action === 'summary') {
                $summary = FinanceEngine::getPortfolioSummary();
                Response::success($summary, 'Portföy ve piyasa verileri yüklendi');
            } elseif ($action === 'quote') {
                $symbol = $_GET['symbol'] ?? 'THYAO';
                $quote = FinanceEngine::getStockQuote($symbol);
                Response::success($quote, "{$symbol} fiyat bilgisi çekildi");
            } elseif ($action === 'ipos') {
                $ipos = FinanceEngine::getUpcomingIPOs();
                Response::success($ipos, 'Halka arz takvimi yüklendi');
            } elseif ($action === 'add_asset' && $method === 'POST') {
                $body = json_decode(file_get_contents('php://input'), true);
                $symbol = strtoupper(trim($body['symbol'] ?? ''));
                $shares = floatval($body['shares'] ?? 0);
                $buyPrice = floatval($body['buy_price'] ?? 0);

                if (empty($symbol) || $shares <= 0 || $buyPrice <= 0) {
                    Response::error('Geçersiz sembol, adet veya maliyet', 400);
                }

                $db = Database::connect();
                $id = 'asset_' . uniqid();
                $stmt = $db->prepare("INSERT INTO portfolio_assets (id, symbol, shares, buy_price, created_at) VALUES (?, ?, ?, ?, datetime('now'))");
                $stmt->execute([$id, $symbol, $shares, $buyPrice]);
                Response::success(['id' => $id], 'Varlık portföye eklendi');
            } elseif ($action === 'delete_asset' && $method === 'POST') {
                $body = json_decode(file_get_contents('php://input'), true);
                $id = $body['id'] ?? '';
                if ($id) {
                    $db = Database::connect();
                    $stmt = $db->prepare("DELETE FROM portfolio_assets WHERE id = ?");
                    $stmt->execute([$id]);
                    Response::success(null, 'Varlık portföyden silindi');
                }
                Response::error('ID belirtilmedi', 400);
            }
            Response::error('Geçersiz finans aksiyonu', 400);
            break;

        case 'menus':
            if ($method === 'GET') {
                $menus = MenuModel::getAll();
                Response::success($menus);
            }
            break;

        default:
            Response::error('Bilinmeyen API Endpoint', 404);
            break;
    }
} catch (Exception $e) {
    ErrorLogger::log('CRITICAL', 'API Exception: ' . $e->getMessage());
    Response::error('Sunucu içi hata: ' . $e->getMessage(), 500);
}
