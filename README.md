# 🌐 Evrensel Kişisel Yönetim Portalı (Enterprise Personal OS) — V3.0 PRO

Bu proje; amatör statik betiklerin ve tarayıcıya hapsolmuş `localStorage` yapılarının ötesinde, **gerçek bir SQLite Veritabanı (PDO), sunucu taraflı oturum güvenliği (Server-Side Auth), REST API ve MVC (Model-View-Controller) mimarisiyle inşa edilmiş kurumsal düzeyde bir Kişisel İşletim Sistemi**dir.

---

## 🏛️ 1. Mimari Tasarım & Sağlamlaştırılmış Çekirdek

```
panel/
├── index.php                      # Ana Yönlendirici (Front Controller)
├── config/
│   ├── config.php                 # Temel Sistem Konfigürasyonu
│   └── Database.php               # SQLite PDO Singleton & Otomatik Migration Motoru
├── core/
│   ├── Auth.php                   # Gerçek Sunucu Taraflı Session & PIN Güvenliği
│   └── Response.php               # Standart JSON REST API Yanıtlayıcısı
├── models/                        # SQLite Veri Modelleri (Repository Layer)
│   ├── UserModel.php              # Kullanıcılar, Roller & Modül Yetkileri
│   ├── TaskModel.php              # Görevler & Durum Yönetimi
│   ├── ReminderModel.php          # Zamanlanmış Hatırlatıcılar
│   ├── NoteModel.php              # Sabitlenebilir Zengin Notlar
│   ├── SubscriptionModel.php      # Abonelik & Sabit Giderler
│   ├── FinanceModel.php           # Borsa Portföy Pozisyonları
│   └── VaultModel.php             # Şifreli Kasa Kayıtları
├── api/
│   └── index.php                  # Birleşik JSON REST API Router (/api/index.php?endpoint=...)
├── views/                         # Sunucu Taraflı Render Edilen Temiz Şablonlar
│   ├── layout/
│   │   ├── header.php             # 3 Çizgili Menü, Baloncuk Dock, Canlı Saat
│   │   ├── sidebar.php            # Dinamik & Yetkilendirilmiş Menü
│   │   ├── modals.php             # Standartlaştırılmış Modal Dialoglar
│   │   └── footer.php             # Script Entegrasyonu & Lucide İkonları
│   ├── auth/
│   │   └── gateway.php            # Güvenli Giriş Kapısı (Yönetici & Kullanıcılar)
│   └── modules/
│       ├── dashboard.php          # Ana Sayfa, İstatistikler & Widget Grid
│       ├── tasks.php              # Görev Yönetimi
│       ├── reminders.php          # Hatırlatıcılar
│       ├── notes.php              # Hızlı Notlar
│       ├── finance.php            # Borsa, Altın & Finans
│       ├── subscriptions.php      # Abonelik Radarı
│       ├── vault.php              # Güvenli Kasa
│       └── admin.php              # Kullanıcı Yönetimi & Sistem Ayarları
├── js/
│   └── portal.js                  # 25 dosya yerine TEK, MODÜLER ve TEMİZ Frontend Motoru
└── data/
    └── portal.sqlite              # Otomatik Tablo Oluşturan İlişkisel Veritabanı
```

---

## 🌟 2. Temel Çekirdek Modüller

1. **📊 Dashboard & Widget Panosu:**
   - Günün özeti, başarı oranı çubuğu, hızlı görev giriş alanı (`Quick Capture`) ve dinamik widget ızgarası.
   - **Küçültülen Widget Baloncuk Dock'u:** Widget eksi (`-`) butonuna basılınca üst başlıkta yarı saydam baloncuk olarak kalır; fare gelince parlar ve tıklanınca yerine geri açılır.
   - **☰ 3 Çizgili Menü Butonu:** Masaüstünde ve mobilde sol menüyü akıcı şekilde açıp kapatır.

2. **✅ Görev & İş Yönetimi (`tasks`):**
   - SQLite veritabanı destekli, kategori ve öncelik bazlı görev listesi.

3. **⏰ Zamanlanmış Hatırlatıcılar (`reminders`):**
   - Saatli alarmlar ve yaklaşan randevu takibi.

4. **📝 Hızlı Not Defteri (`notes`):**
   - Sabitlenebilir zengin notlar ve fikir alanı.

5. **📈 Borsa, Döviz & Altın Takipçisi (`finance`):**
   - Canlı gram, çeyrek altın, USD/EUR kurları ve portföy pozisyon takibi.

6. **💳 Abonelik & Ödeme Radarı (`subscriptions`):**
   - Aylık/yıllık düzenli harcamalar ve yaklaşan ödeme takvimi.

7. **🔒 Güvenli Kasa (`vault`):**
   - Banka, kart ve gizli notlar için şifrelenmiş depolama alanı.

8. **👥 Yönetim Merkezi (`admin`):**
   - Yeni kullanıcı ekleme, PIN şifresi atama ve modül yetkilerini belirleme.

---

## 🚀 3. Nasıl Çalıştırılır?

Herhangi bir PHP 7.4+ veya PHP 8+ ortamında (XAMPP, WAMP, Laragon, cPanel veya PHP Dahili Sunucusu):

```bash
php -S localhost:8000
```

1. Tarayıcınızdan **`http://localhost:8000`** adresine gidin.
2. Açılışta **Sistem Yöneticisi** (`PIN: 1234`) veya **Misafir Girişi** seçeneğini kullanarak portala erişebilirsiniz.
3. Tablolar ilk çalıştırmada SQLite (`data/portal.sqlite`) içinde otomatik olarak oluşturulur.

---

## 🔒 4. Kurumsal Güvenlik

* Kimlik doğrulama kontrolleri tarayıcıda değil, **PHP oturumları (`$_SESSION`)** ile sunucu tarafında doğrulanır.
* F12 / Geliştirici konsolu üzerinden yetki yükseltme veya veri sızıntısı yapılamaz.
* Tüm API istekleri standart HTTP durum kodları (`200`, `401`, `404`) ve JSON formatı ile yanıt verir.
