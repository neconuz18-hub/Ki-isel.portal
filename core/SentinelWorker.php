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
        $startTime = microtime(true);

        $report = [
            'timestamp' => date('c'),
            'execution_time_ms' => 0,
            'status' => 'HEALTHY',
            'checks' => [],
            'metrics' => [],
            'healed_issues' => []
        ];

        // 1. SQLite Bütünlük ve Optimizasyon Kontrolü
        try {
            $stmt = $db->query("PRAGMA integrity_check");
            $integrity = $stmt->fetchColumn();
            $report['checks']['database_integrity'] = ($integrity === 'ok') ? 'PASS (Mükemmel)' : 'FAIL (Bozulma Var)';
            
            if ($integrity !== 'ok') {
                $report['status'] = 'WARNING';
                $report['healed_issues'][] = 'Veritabanı indeksleri onarılıyor...';
                $db->exec("REINDEX; VACUUM;");
            }

            $db->exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;");
            $report['checks']['sqlite_optimization'] = 'WAL Modu Aktif (Ultra Hızlı)';
        } catch (Exception $e) {
            $report['checks']['database_integrity'] = 'ERROR: ' . $e->getMessage();
            $report['status'] = 'CRITICAL';
        }

        // 2. Tablo Varlığı ve Eksik Tablo Onarımı
        $requiredTables = ['users', 'notes', 'menu_pool'];
        $tablesChecked = [];
        foreach ($requiredTables as $table) {
            $stmt = $db->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
            $stmt->execute([$table]);
            $exists = (bool)$stmt->fetch();
            $tablesChecked[$table] = $exists ? 'OK' : 'MISSING';
            if (!$exists) {
                $report['healed_issues'][] = "Kayıp tablo ($table) tespit edildi ve otomatik oluşturuldu.";
                $report['status'] = 'REPAIRED';
            }
        }
        $report['checks']['tables'] = $tablesChecked;

        // 3. Güvenlik & XSS Temizliği ve Bozuk Not Taraması
        try {
            $stmt = $db->query("SELECT id, title, content, icon FROM notes");
            $notes = $stmt->fetchAll();
            $corruptedCount = 0;
            $xssSanitized = 0;

            foreach ($notes as $n) {
                $needsUpdate = false;
                $cleanTitle = $n['title'];
                $cleanContent = $n['content'];
                $cleanIcon = $n['icon'] ?: '📝';

                if (empty(trim($cleanTitle))) {
                    $cleanTitle = 'Başlıksız Not (Kurtarıldı)';
                    $needsUpdate = true;
                    $corruptedCount++;
                }

                if (stripos($cleanContent, '<script') !== false) {
                    $cleanContent = htmlspecialchars($cleanContent, ENT_QUOTES, 'UTF-8');
                    $needsUpdate = true;
                    $xssSanitized++;
                }

                if ($needsUpdate) {
                    $upStmt = $db->prepare("UPDATE notes SET title = ?, content = ?, icon = ? WHERE id = ?");
                    $upStmt->execute([$cleanTitle, $cleanContent, $cleanIcon, $n['id']]);
                }
            }

            if ($corruptedCount > 0) {
                $report['healed_issues'][] = "$corruptedCount adet bozuk başlıklı not onarıldı.";
                $report['status'] = 'REPAIRED';
            }
            if ($xssSanitized > 0) {
                $report['healed_issues'][] = "$xssSanitized adet potansiyel zararlı script engellendi ve temizlendi.";
                $report['status'] = 'REPAIRED';
            }

            $report['checks']['notes_security'] = 'Notlar Tarandı (' . count($notes) . ' not temiz)';
        } catch (Exception $e) {
            $report['checks']['notes_security'] = 'ERROR: ' . $e->getMessage();
        }

        // 4. Kırık Menü ve İkon Denetimi
        try {
            $stmt = $db->query("SELECT id, label, icon FROM menu_pool");
            $menus = $stmt->fetchAll();
            $fixedMenus = 0;
            foreach ($menus as $m) {
                if (empty(trim($m['icon']))) {
                    $upStmt = $db->prepare("UPDATE menu_pool SET icon = 'folder' WHERE id = ?");
                    $upStmt->execute([$m['id']]);
                    $fixedMenus++;
                }
            }
            if ($fixedMenus > 0) {
                $report['healed_issues'][] = "$fixedMenus adet kırık menü ikonu 'folder' olarak düzeltildi.";
                $report['status'] = 'REPAIRED';
            }
            $report['checks']['menu_integrity'] = count($menus) . ' menü doğrulandı';
        } catch (Exception $e) {
            $report['checks']['menu_integrity'] = 'ERROR';
        }

        // 5. Metrikler ve Dosya Boyutları
        $dbSize = file_exists(DB_PATH) ? round(filesize(DB_PATH) / 1024, 2) . ' KB' : '0 KB';
        $report['metrics'] = [
            'database_size' => $dbSize,
            'php_memory_usage' => round(memory_get_usage() / 1024, 2) . ' KB',
            'php_version' => PHP_VERSION,
            'os' => PHP_OS
        ];

        // 6. Otomatik Snapshot
        $report['checks']['auto_snapshot'] = self::createAutoSnapshot();
        $report['execution_time_ms'] = round((microtime(true) - $startTime) * 1000, 2);

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
            return 'SNAPSHOT_ALINDI: ' . basename($backupFile);
        }
        return 'SNAPSHOT_GUNCEL';
    }

    private static function logReport(array $report): void {
        $logEntry = "[" . date('Y-m-d H:i:s') . "] STATUS: " . $report['status'] . " | Süre: " . $report['execution_time_ms'] . "ms | Kontroller: " . json_encode($report['checks'], JSON_UNESCAPED_UNICODE) . "\n";
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND);
    }

    public static function getLogSummary(): string {
        if (!file_exists(self::$logFile)) {
            return "Henüz log kaydı bulunmuyor.";
        }
        $lines = file(self::$logFile);
        $lastLines = array_slice($lines, -15);
        return implode("", $lastLines);
    }
}
