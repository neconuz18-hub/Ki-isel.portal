<?php
/**
 * Background Sentinel Worker CLI Entrypoint
 * Kullanım: php worker.php
 */
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/core/SentinelWorker.php';

echo "========================================\n";
echo "   PORTAL SENTINEL WORKER (PHP CLI)    \n";
echo "========================================\n";
echo "Zaman: " . date('Y-m-d H:i:s') . "\n";
echo "Veritabanı ve Kod Bütünlüğü Denetleniyor...\n\n";

$report = SentinelWorker::runDiagnostic();

echo "Sonuç Durumu: " . $report['status'] . "\n";
echo "Kontroller:\n";
foreach ($report['checks'] as $check => $val) {
    if (is_array($val)) {
        echo "  - $check: " . json_encode($val) . "\n";
    } else {
        echo "  - $check: $val\n";
    }
}

if (!empty($report['healed_issues'])) {
    echo "\nOnarılan Hatalar (Self-Healed):\n";
    foreach ($report['healed_issues'] as $issue) {
        echo "  [✓] $issue\n";
    }
}

echo "\n[OK] Sentinel kontrolü başarıyla tamamlandı.\n";
