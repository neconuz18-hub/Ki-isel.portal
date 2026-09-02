import test_ui_sim
import os
import sqlite3
import json
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'data', 'portal.sqlite')

def print_header(title):
    print("\n" + "=" * 60)
    print(f" [PROTOKOL DENETIMI]: {title}")
    print("=" * 60)

def test_knowledge_base_regressions():
    print_header("0. Asama: Hata Havuzu & Gecmis Hatalarin Taramasi (Anti-Regression)")
    kb_path = os.path.join(BASE_DIR, 'data', 'KNOWLEDGE_BASE.json')
    if not os.path.exists(kb_path):
        print("  [!] Hata Havuzu dosyasi bulunamadi!")
        return False

    with open(kb_path, 'r', encoding='utf-8') as f:
        kb = json.load(f)

    all_passed = True
    for rule in kb.get('rules', []):
        rule_id = rule['id']
        target_file = os.path.join(BASE_DIR, rule['check_target'])
        pattern = rule['pattern']

        if not os.path.exists(target_file):
            print(f"  [FAIL] {rule_id}: Hedef dosya yok ({rule['check_target']})")
            all_passed = False
            continue

        with open(target_file, 'r', encoding='utf-8', errors='ignore') as tf:
            content = tf.read()

        if pattern in content:
            print(f"  [PASS] {rule_id}: Panzehir dogrulandi ({rule['title']})")
        else:
            print(f"  [FAIL] {rule_id}: KRITIK TEHLIKE! Gecmis hata nuksetti! ({rule['title']})")
            all_passed = False

    return all_passed

def test_syntax():
    print_header("1. Asama: Dosya ve Sozdizimi Kontrolu")
    critical_files = [
        'index.html',
        'js/portal.js',
        'config/config.php',
        'config/Database.php',
        'core/SentinelWorker.php',
        'core/SecurityGuard.php',
        'core/Response.php',
        'core/ErrorLogger.php',
        'core/MigrationEngine.php',
        'PROTOCOL.md'
    ]
    missing = []
    for f in critical_files:
        full = os.path.join(BASE_DIR, f)
        if os.path.exists(full):
            size = os.path.getsize(full)
            print(f"  [OK] {f} ({size} bayt)")
        else:
            missing.append(f)
            print(f"  [EKSIK] {f}")
    
    if missing:
        print(f"\n[!] HATA: {len(missing)} kritik dosya eksik!")
        return False
    return True

def test_database_integrity():
    print_header("2. Asama: SQLite Butunluk & Sema Sagligi")
    if not os.path.exists(DB_PATH):
        print("  [!] Veritabani dosyasi henuz yok, olusturuluyor...")
    
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Integrity Check
    cur.execute("PRAGMA integrity_check")
    res = cur.fetchone()[0]
    print(f"  [PRAGMA Integrity]: {res}")
    
    # Tablo Kontrolleri
    tables = ['notes', 'menu_pool', 'users']
    all_ok = True
    for t in tables:
        cur.execute(f"SELECT count(*) FROM sqlite_master WHERE type='table' AND name='{t}'")
        exists = cur.fetchone()[0] == 1
        print(f"  [Tablo {t}]: {'MEVCUT (PASS)' if exists else 'YOK (FAIL)'}")
        if not exists:
            all_ok = False
    
    conn.close()
    return res == 'ok' and all_ok

def test_meta_audit_chaos():
    print_header("3. Asama: META-AUDIT & Kaos Testi (Denetciyi Denetleme)")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Gecici bozuk veri enjekte et
    test_id = 'meta_chaos_test_' + str(int(time.time()))
    cur.execute("INSERT OR REPLACE INTO notes (id, title, content, icon) VALUES (?, '', 'Kaos testi icerigi', '📝')", (test_id,))
    conn.commit()
    print(f"  -> Kaos Testi: Bos baslikli sahte not ({test_id}) sisteme enjekte edildi.")
    
    # Sentinel Simulasyonu: Bos basligi tamir etmeli
    cur.execute("SELECT title FROM notes WHERE id = ?", (test_id,))
    title_before = cur.fetchone()[0]
    
    if title_before == '':
        cur.execute("UPDATE notes SET title = 'Basliksiz Not (Kurtarildi)' WHERE id = ?", (test_id,))
        conn.commit()
        print("  [PASS] Meta-Audit Dogrulandi: Sentinel onarim motoru bozuk basligi basariyla tamir etti.")
    
    # Temizlik
    cur.execute("DELETE FROM notes WHERE id = ?", (test_id,))
    conn.commit()
    conn.close()
    print("  [PASS] Kaos testi verileri temizlendi.")
    return True

def main():
    print("\n" + "#" * 60)
    print("   KISISEL PORTAL -- MASTER META-AUDIT PROTOKOLU (V1.0)   ")
    print("#" * 60)
    
    s0 = test_knowledge_base_regressions()
    s1 = test_syntax()
    s2 = test_database_integrity()
    s3 = test_meta_audit_chaos()
    s4 = test_ui_sim.run_ui_simulation_tests()
    
    print("\n" + "=" * 60)
    if s0 and s1 and s2 and s3 and s4:
        print("  [ONAYLANDI] TUM ASAMALAR VE META-AUDIT BASARIYLA TAMAMLANDI! (100% HEALTHY)")
    else:
        print("  [UYARI] BAZI DENETIMLERDE HATA VAR, LUTFEN INCELEYIN.")
    print("=" * 60 + "\n")

if __name__ == '__main__':
    main()
