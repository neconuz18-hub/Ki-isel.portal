# 🌐 Evrensel Kişisel İşletim Sistemi (Universal Personal OS) — V2.5

Bu proje; sıradan bir görev veya not alma uygulamasının ötesinde, **kullanıcının mesleğine ve yaşam tarzına göre saniyeler içinde şekil alan, yönetici ve çoklu kullanıcı destekli, yapay zeka destekli ve modüler bir Kişisel İşletim Sistemi (Personal OS)** olarak inşa edilmiştir.

---

## 🏛️ 1. Proje Felsefesi ve Mimari Yapı

Proje, herhangi bir harici backend sunucusuna veya karmaşık veritabanı kurulumuna ihtiyaç duymadan, doğrudan tarayıcı üzerinde **"Offline-First" (İnternetsiz de Çalışabilen)** ve **"Serverless"** mimari ile çalışır.

### A. Giriş Kapısı & Yetkilendirme (Gateway & Auth — `auth.js`)
* **Sistem Yöneticisi Girişi (PIN Korumalı — `1234`):** Modül havuzunu yönetme, kullanıcı tanımlama, şablon uygulama ve veri yedekleme yetkilerine sahip ana kumanda merkezi.
* **Kayıtlı Özel Kullanıcılar:** Yöneticinin sisteme eklediği personel, öğrenci, hasta veya müvekkiller (opsiyonel PIN koruması ile).
* **Misafir / Hızlı Giriş:** Varsayılan temel modüllerle hızlı başlangıç.

### B. Çoklu Kullanıcı & Profil Yönetimi (`userManager.js`)
* **Kullanıcı Tanımlama & CRUD:** İsim, telefon, özel PIN ve atanacak modüllerin seçimi.
* **Hızlı Meslek Şablonu Entegrasyonu:** Tek tıkla ilgili mesleğin (Öğretmen, Doktor, Avukat vb.) tüm modüllerini kullanıcıya atama.
* **Kullanıcı Bazlı İzolasyon:** Her kullanıcı giriş yaptığında yalnızca yöneticinin ona yetki verdiği modülleri ve sekmeleri görür.

### C. Dinamik Widget Sistemi & Akıllı Dock Paneli (`app.js`)
* **Yetki Bazlı Widget Filtreleme:** Kullanıcıya atanmamış modüllerin widget'ları ana sayfada asla görünmez.
* **☰ 3 Çizgili Menü Açma/Kapama Çubuğu:** Masaüstü ve mobilde sol menüyü akıcı şekilde daraltıp genişleten buton.
* **🫧 Küçültülen Widget Baloncuk Dock'u:** Widget'ın eksi (`-`) butonuna basıldığında widget kaybolmaz; üst başlıkta yarı saydam (%60) şık bir simge baloncuk olarak konumlanır.
* **Hover Parlaması & Geri Yükleme:** Fare imleci baloncuğun üzerine geldiğinde saydamlık kalkar ve parlar. Tıklandığında widget pürüzsüz bir animasyonla ana sayfadaki eski yerine döner.

### D. 5 Evrensel Çekirdek Primitif (Polymorphic Engine — `polymorphicStore.js`)
1. **CONTACT (Kişi):** Müşteri, Hasta, Müvekkil, Öğrenci, Veli, Kiracı.
2. **TRANSACTION (Para & Akış):** Veresiye Borcu, Tahsilat, Özel Ders Ücreti, Kapora, Aidat.
3. **TIMELINE_EVENT (Zaman & Takvim):** Nöbet, Duruşma, Özel Ders Saati, Görüşme, Randevu.
4. **COMPLIANCE_EXPIRY (Kritik Süre & Alarm):** Hak Düşürücü Dava Süresi, Araç Muayenesi, Kasko, Pasaport/Vize.
5. **ENTITY (Varlık & Dosya):** Dava Dosyası, Gayrimenkul Portföyü, Hisse Senedi, Teçhizat.

---

## 🎯 2. Sektörel ve Mesleki Modüller

### 🎓 1. Eğitim Koçluğu & Özel Ders Portalı (`ogretmen`)
* **Bugün Aranacaklar Şeridi:** Gün içerisinde ödev/çalışma kontrolü yapılması gereken öğrencilerin hızlı arama listesi.
* **360° Öğrenci Koçluk Dosyası:** Öğrenciye tıklandığında açılan detaylı analiz paneli.
* **Dinamik SVG Net Gelişim Eğrisi:** Öğrencinin girdiği deneme sınavlarının kronolojik net artış/azalış grafiği.
* **Özel Ders Paket & Finans Defteri:** 10 derslik paket hapları (1, 2, 3... ✓), tamamlanan ve kalan ders saati, ücret takibi.
* **Haftalık Soru Hedef Çubuğu (Burn-down):** "1200 / 1500 Soru (%80)" haftalık tempo göstergesi.
* **1-Tıkla WhatsApp Veli Raporu:** Tek tuşla veliye gönderilmeye hazır formatta haftalık durum özeti kopyalama.

### 📈 2. Canlı Borsa & Finans V2 (`finance`)
* **Yahoo Finance v8 API Entegrasyonu:** Borsa İstanbul (BIST), Döviz (USD, EUR, GBP) ve ONS üzerinden matematiksel formüllerle anlık **Gram Altın, Çeyrek, Yarım ve Tam Altın** fiyatları.
* **CORS Proxy Kaskadı:** Kesintisiz veri akışı sağlayan yedekli proxy altyapısı.
* **Canlı Ticker Bandı:** Sayfanın en üstünde canlı piyasa verilerini gösteren ekonomi bandı.
* **Gerçek Kar/Zarar:** Portföye girilen lot ve maliyete göre anlık kar/zarar hesaplama.

### 💳 3. Abonelik & Ödeme Radarı (`subscriptions`)
* Standartlaştırılmış widget başlığı, sürükle-bırak tutamacı, aylık sabit yük göstergesi ve yaklaşan fatura uyarıları.

### 🛒 4. Bakkal & Esnaf Paketi (`veresiye`)
* 3 saniyede hızlı veresiye pedi, müşteri borç/alacak bakiyesi ve toptancı vade takvimi.

### 🩺 5. Doktor & Sağlık Çalışanı Paketi (`nobet`)
* 24 saatlik nöbet çizelgeleri, icap görevleri ve nöbet takas takibi.

### ⚖️ 6. Avukat & Hukukçu Paketi (`durusma`)
* Duruşma ajandası, mahkeme salonu ve istinaf/temyiz için kritik süre sayacı.

### 🏠 7. Emlak & Gayrimenkul Paketi (`emlak`)
* İlan portföyü, satılık/kiralık daireler, mal sahibi irtibatı ve alıcı kriter eşleştirme.

### 🛡️ 8. Asker, Polis & Güvenlik Paketi (`zimmet`)
* Vardiya planı, zimmetli teçhizat listesi ve periyodik bakım takvimi.

---

## 🛠️ 3. Dosya Yapısı ve Görev Dağılımı

| Dosya | Görevi ve Sorumluluğu |
| :--- | :--- |
| **`index.html`** | Ana iskelet, TailwindCSS + Glassmorphic UI arayüzü, Gateway kilit ekranı ve modallar. |
| **`js/auth.js`** | Oturum kontrolcüsü, Gateway kilit ekranı, PIN doğrulama ve kullanıcı yönlendirmesi. |
| **`js/userManager.js`** | Kullanıcı CRUD, profil atamaları, modül yetkilendirmesi ve kullanıcı hafızası. |
| **`js/admin.js`** | 5 sekmeli Süper Yönetici Paneli (Kullanıcılar, Modül Havuzu, Şablonlar, Test Fabrikası, Yedekleme). |
| **`js/polymorphicStore.js`** | 5 çekirdek primitifi yöneten, offline-first yerel veritabanı motoru. |
| **`js/moduleRegistry.js`** | 8 meslek şablonu, profil ayarları ve modül tanımları. |
| **`js/menus.js`** | Kullanıcı rolüne göre dinamik filtrelenen sol menü ve Modül Mağazası. |
| **`js/professionModules.js`** | Koçluk, Veresiye, Nöbet, Duruşma ve Emlak panelleri + GlassModal motoru. |
| **`js/marketDataService.js`** | Canlı piyasa API servisi, CORS proxy kaskadı ve altın hesaplayıcı. |
| **`js/finance_v2.js`** | Borsa V2 iş mantığı, portföy hesaplama ve Ticker Tape. |
| **`js/subscriptions.js`** | Abonelik ve düzenli ödeme radarı takip motoru. |
| **`js/app.js`** | Ana uygulama orkestratörü, widget baloncuk dock'u, menü daraltma ve sekme yönlendirici. |

---

## 🚀 4. Nasıl Çalıştırılır?

Proje hiçbir harici kütüphane kurulumu veya harici veritabanı gerektirmez:

1. Proje klasöründe terminali / PowerShell'i açın.
2. Yerel sunucuyu başlatın:
   ```bash
   python -m http.server 5050
   ```
3. Tarayıcınızdan **`http://localhost:5050`** adresine gidin.
4. **Sistem Yöneticisi** (`PIN: 1234`) veya **Kullanıcılar** arasından seçim yaparak portalı kullanmaya başlayabilirsiniz!

---

## 🔒 5. Güvenlik ve Gizlilik

* Tüm verileriniz tarayıcınızın **LocalStorage / IndexedDB** belleğinde tutulur.
* Hiçbir kişisel veri, öğrenci notu, müşteri borcu veya portföy bilgisi harici bir sunucuya gönderilmez.
* Veritabanınızı tek tıkla JSON olarak yedekleyebilir veya başka bir cihaza aktarabilirsiniz.
