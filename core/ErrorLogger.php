<?php
/**
 * Enterprise Blackbox Error Logger & Triage Handler
 */
class ErrorLogger {
    private static string $logFile = DATA_DIR . '/logs/error_triage.json';

    public static function log(string $level, string $message, array $context = []): void {
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0777, true);
        }

        $entry = [
            'id' => 'err_' . uniqid(),
            'timestamp' => date('c'),
            'level' => strtoupper($level),
            'message' => $message,
            'context' => $context,
            'trace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3)
        ];

        $currentLogs = [];
        if (file_exists(self::$logFile)) {
            $data = file_get_contents(self::$logFile);
            $currentLogs = json_decode($data, true) ?: [];
        }

        array_unshift($currentLogs, $entry);
        if (count($currentLogs) > 100) {
            $currentLogs = array_slice($currentLogs, 0, 100);
        }

        file_put_contents(self::$logFile, json_encode($currentLogs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }

    public static function getRecentErrors(int $limit = 10): array {
        if (!file_exists(self::$logFile)) return [];
        $data = file_get_contents(self::$logFile);
        $logs = json_decode($data, true) ?: [];
        return array_slice($logs, 0, $limit);
    }
}
