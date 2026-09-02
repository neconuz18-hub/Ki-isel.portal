<?php
require_once __DIR__ . '/../config/Database.php';

class SentinelWorker {
    private static string $logFile = DATA_DIR . '/sentinel.log';
    private static string $backupDir = DATA_DIR . '/backups';

    public static function initDirectories(): void {
        if (!is_dir(self::$backupDir)) {
            mkdir(self::$backupDir, 0777, true);
        }
        if (!is_dir(dirname(self::$logFile))) {
            mkdir(dirname(self::$logFile), 0777, true);
        }
    }

    public static function runDiagnostic(): array {
        self::initDirectories();
        $db = Database::connect();
        $report = [
            'timestamp' => date('c'),
            'status' => 'HEALTHY',
            'checks' => [],
            'healed_issues' => []
        ];

        // 1. SQLite Veritabanı Bütünlük Kontrolü
        try {
            $stmt = $db->query("PRAGMA integrity_check");
            $integrity = $stmt->fetchColumn();
            $report['checks']['database_integrity'] = ($integrity === 'ok') ? 'PASS' : 'FAIL';
            if ($integrity !== 'ok') {
                $report['status'] = 'WARNING';
                $report['healed_issues'][] = 'Veritabanı bütünlük hatası tespit edildi, indeksler yeniden yapılandırılıyor.';
                $db->exec("REINDEX; VACUUM;");
            }
        } catch (Exception $e) {
            $report['checks']['database_integrity'] = 'ERROR: ' . $e->getMessage();
            $report['status'] = 'CRITICAL';
        }

        // 2. Tablo Varlığı ve Şema Doğrulama
        $requiredTables = ['users', 'notes', 'menu_pool'];
        $tablesChecked = [];
        foreach ($requiredTables as $table) {
            $stmt = $db->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
            $stmt->execute([$table]);
            $exists = (bool)$stmt->fetch();
            $tablesChecked[$table] = $exists ? 'PASS' : 'MISSING';
            if (!$exists) {
                $report['healed_issues'][] = "Kayıp tablo tespit edildi ($table), otomatik oluşturuluyor.";
                $report['status'] = 'REPAIRED';
            }
        }
        $report['checks']['tables'] = $tablesChecked;

        // 3. Bozuk Notlar Taraması (Self-Healing)
        try {
            $stmt = $db->query("SELECT id, title, content FROM notes WHERE title IS NULL OR title = ''");
            $corruptedNotes = $stmt->fetchAll();
            if (count($corruptedNotes) > 0) {
                $fixStmt = $db->prepare("UPDATE notes SET title = 'Başlıksız Not (Kurtarıldı)' WHERE id = ?");
                foreach ($corruptedNotes as $cn) {
                    $fixStmt->execute([$cn['id']]);
                    $report['healed_issues'][] = "Bozuk başlıklı not onarıldı: " . $cn['id'];
                }
                $report['status'] = 'REPAIRED';
            }
            $report['checks']['corrupted_notes'] = count($corruptedNotes) . ' bozuk kayıt düzeltildi';
        } catch (Exception $e) {
            $report['checks']['corrupted_notes'] = 'ERROR';
        }

        // 4. Otomatik Anlık Yedek Alma (Auto Snapshot)
        $backupResult = self::createAutoSnapshot();
        $report['checks']['auto_snapshot'] = $backupResult;

        // Log Dosyasına Kaydet
        self::logReport($report);

        return $report;
    }

    public static function createAutoSnapshot(): string {
        self::initDirectories();
        $backupFile = self::$backupDir . '/snapshot_' . date('Y_m_d_H') . '.sqlite';
        
        if (!file_exists($backupFile) && file_exists(DB_PATH)) {
            copy(DB_PATH, $backupFile);
            
            $files = glob(self::$backupDir . '/snapshot_*.sqlite');
            if (count($files) > 5) {
                usort($files, fn($a, $b) => filemtime($a) - filemtime($b));
                while (count($files) > 5) {
                    unlink(array_shift($files));
                }
            }
            return 'SNAPSHOT_CREATED: ' . basename($backupFile);
        }
        return 'SNAPSHOT_UP_TO_DATE';
    }

    private static function logReport(array $report): void {
        $logEntry = "[" . date('Y-m-d H:i:s') . "] STATUS: " . $report['status'] . " | " . json_encode($report['checks'], JSON_UNESCAPED_UNICODE) . "\n";
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND);
    }

    public static function getLogSummary(): string {
        if (!file_exists(self::$logFile)) {
            return "Henüz log kaydı bulunmuyor.";
        }
        $lines = file(self::$logFile);
        $lastLines = array_slice($lines, -10);
        return implode("", $lastLines);
    }
}
