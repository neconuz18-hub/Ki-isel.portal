<?php
/**
 * Standart JSON REST API Yanıtlayıcı (core/Response.php)
 */
class Response {
    public static function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success($data = null, string $message = 'İşlem başarılı'): void {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ], 200);
    }

    public static function error(string $message = 'Bir hata oluştu', int $statusCode = 400): void {
        self::json([
            'success' => false,
            'message' => $message
        ], $statusCode);
    }
}