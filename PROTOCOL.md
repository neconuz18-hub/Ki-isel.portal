# 🛡️ KİŞİSEL PORTAL: GELİŞTİRME & DENETLEME PROTOKOLÜ (V1.0 ENTERPRISE)

Bu protokol, Kişisel Portal projesinde yapılacak her yeni güncellemenin, menü eklemesinin veya mimari değişikliğin sistem iskeletini bozmadan, en yüksek kalite ve güvenlik standartlarında uygulanmasını garanti eder.

---

## 🏛️ 1. Sarsılmaz İskelet Kuralları (Core Architecture Principles)
1. **Modüler İzolasyon (Sandbox):** Çekirdek motor (`Core Engine`: Menü, Auth, Veritabanı, Sentinel) dokunulmazdır. Yeni eklenen sayfalar/modüller bağımsız çalışır; bir modüldeki hata diğerlerini veya ana sayfayı çökertemez.
2. **Hata Duvarı (Error Boundaries):** Her JavaScript ve PHP fonksiyonu `try/catch` ve `ErrorLogger` ile sarılır. Hata kullanıcıya beyaz ekran olarak yansımaz, kara kutuya (`data/logs/error_triage.json`) kaydedilir.
3. **Kayıpsız Şema Göçü (Zero-Loss Migration):** Veritabanı tablolarına yeni sütunlar eklenirken eski veriler korunur ve `MigrationEngine` üzerinden versiyonlanır.

---

## 🔍 2. 6 Aşamalı Doğrulama ve Meta-Audit Süzgeci

Her güncelleme sırasıyla şu 6 adımdan geçmek zorundadır:

### Aşama 1: Sözdizimi & Kod Bütünlüğü (Syntax Integrity)
- Tüm PHP dosyalarında `php -l` kontrolü (Sıfır hata).
- JavaScript dosyalarında tanımsız değişken veya kapsam (`scope`) çakışması olmamalı.
- Tarayıcı konsolunda (F12) `0 Kırmızı Hata` kuralı.

### Aşama 2: Veritabanı & Şema Sağlığı (Database Watchdog)
- `PRAGMA integrity_check;` her sürümde `PASS` dönmeli.
- `notes`, `menu_pool`, `users` tabloları ve şemaları doğrulanmalı.
- Güncelleme öncesi otomatik snapshot alınmalı (`data/backups/`).

### Aşama 3: Görsel & Responsive UX Uyum (Visual Ergonomics)
- 2. Fotoğraftaki yan yana modüler widget ızgarası (`Rutinler` ve `Notlarım`) bozulmamalı.
- Mobil (`375px`), Tablet (`768px`) ve Masaüstü (`1440px`) ekranlarda yatay taşma (`horizontal overflow`) olmamalı.
- Veri olmadığında estetik "Boş Durum (Empty State)" illüstrasyonları gösterilmeli.

### Aşama 4: Güvenlik & XSS Kalkanı (Security Guard)
- Tüm kullanıcı girdileri `SecurityGuard::cleanInput` ve `Portal.escapeHtml` süzgecinden geçirilmeli.
- Admin PIN ve oturum korumaları (`HttpOnly`, `SameSite`) aşılmamalı.

### Aşama 5: META-AUDIT (Denetçiyi Denetleme & Kaos Testi)
- **Kaos Testi:** Sisteme bilerek geçici bozuk veri enjekte edilir. Eğer Sentinel Worker bu hatayı yakalayıp çözemezse güncelleme reddedilir.
- **Regresyon Kontrolü:** Yeni eklenen bir modülün eski bir özelliği (Örn: Pomodoro, Arama, Sol Menü) bozmadığı doğrulanır.
- **Çapraz Doğrulama:** Frontend raporu ile Backend SQLite raporu kıyaslanır.

### Aşama 6: Sürümleme & Senkronizasyon (Release Sync)
- Güncelleme açıklaması net bir Git Commit mesajı ile hem yerel ortama hem de GitHub `main` dalına pushlanır.

---

## 🛠️ 3. Protokolü Otomatik Çalıştırma Komutu

Tüm bu 6 aşamalı testi tek seferde çalıştırmak için:

```bash
python audit.py
```
veya terminalde:
```bash
php worker.php
```
komutları kullanılır.
