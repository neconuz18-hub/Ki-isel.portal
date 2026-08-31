# 🌐 Evrensel Kişisel İşletim Sistemi (Universal Personal OS) — V2

Bu proje; sıradan bir görev veya not alma uygulamasının ötesinde, **kullanıcının mesleğine ve yaşam tarzına göre saniyeler içinde şekil alan, yapay zeka destekli ve modüler bir Kişisel İşletim Sistemi (Personal OS)** olarak inşa edilmiştir.

---

## 🏛️ 1. Proje Felsefesi ve Mimari Yapı

Proje, herhangi bir harici backend sunucusuna ihtiyaç duymadan, doğrudan tarayıcı üzerinde **"Offline-First" (İnternetsiz de Çalışabilen)** ve **"Serverless"** mimari ile çalışır.

### A. 5 Evrensel Çekirdek Primitif (Polymorphic Engine - `polymorphicStore.js`)
Farklı mesleklerin (bakkalın veresiyesi, doktorun nöbeti, avukatın duruşması, koçun öğrencisi) verileri tek bir evrensel veri motoru üzerinde yönetilir:
1. **CONTACT (Kişi):** Müşteri, Hasta, Müvekkil, Öğrenci, Veli, Kiracı.
2. **TRANSACTION (Para & Akış):** Veresiye Borcu, Tahsilat, Özel Ders Ücreti, Kapora, Aidat.
3. **TIMELINE_EVENT (Zaman & Takvim):** Nöbet, Duruşma, Özel Ders Saati, Görüşme, Tapu Randevusu.
4. **COMPLIANCE_EXPIRY (Kritik Süre & Alarm):** Hak Düşürücü Dava Süresi, Araç Muayenesi, Kasko, Pasaport/Vize, İlaç SKT.
5. **ENTITY (Varlık & Dosya):** Dava Dosyası, Gayrimenkul Portföyü, Hisse Senedi, Teçhizat.

### B. Akıllı Teşhis Anketi (`onboarding.js`)
Kullanıcı ilk girişte tam ekran modern bir anketle karşılanır. Mesleğini ve önceliklerini seçtiğinde sol menü ve panolar saniyeler içinde o mesleğe özel olarak yeniden çizilir.

### C. Dinamik Menü & Modül Mağazası (`menus.js`)
Sol menünün altında bulunan **`[+ Modül Ekle / Çıkar]`** butonu ile kullanıcı dilediği an hibrit modülleri (Örn: Gündüz çalışan bir Doktorun akşam Borsa Portföyü takip etmesi) tek tıkla açıp kapatabilir.

---

## 🎯 2. Sektörel ve Mesleki Modüller (Neler Yapıldı?)

### 🎓 1. Eğitim Koçluğu & Özel Ders Portalı (`ogretmen`)
* **Bugün Aranacaklar Şeridi:** Gün içerisinde ödev/çalışma kontrolü yapılması gereken öğrencilerin hızlı arama listesi.
* **360° Öğrenci Koçluk Dosyası:** Öğrenciye tıklandığında açılan detaylı analiz paneli.
* **Dinamik SVG Net Gelişim Eğrisi:** Öğrencinin girdiği deneme sınavlarının kronolojik net artış/azalış grafiği.
* **Özel Ders Paket & Finans Defteri:** 10 derslik paket hapları (1, 2, 3... ✓), tamamlanan ve kalan ders saati, ücret takibi.
* **Haftalık Soru Hedef Çubuğu (Burn-down):** "1200 / 1500 Soru (%80)" haftalık tempo göstergesi.
* **1-Tıkla WhatsApp Veli Raporu:** Tek tuşla veliye gönderilmeye hazır formatta haftalık durum özeti kopyalama.

### 📈 2. Canlı Borsa & Finans V2 (`finance`)
* **Yahoo Finance v8 API Entegrasyonu:** Borsa İstanbul (BIST), Döviz (USD, EUR, GBP) ve ONS üzerinden matematiksel formüllerle anlık **Gram Altın, Çeyrek, Yarım ve Tam Altın** fiyatları.
* **CORS Proxy Kaskadı:** `corsproxy.io` ve `allorigins.win` ile kesintisiz veri akışı.
* **Canlı Ticker Bandı:** Sayfanın en üstünde canlı piyasa verilerini gösteren ekonomi bandı.
* **Gerçek Kar/Zarar:** Portföye girilen lot ve maliyete göre anlık kar/zarar hesaplama.

### 🛒 3. Bakkal & Esnaf Paketi (`veresiye`)
* **3 Saniyede Hızlı Veresiye Pedi:** Müşteri seçimi, dev Numpad tuşları ile borç yazma ve tahsilat düşme.
* **Toptancı Vade Takvimi:** Toptancı faturaları ve ödeme günü uyarıları.

### 🩺 4. Doktor & Sağlık Çalışanı Paketi (`nobet`)
* **Nöbet Çizelgesi & İcap:** 24 saatlik nöbetleri ve icap görevlerini takvime mühürleme.
* **Kritik Hasta & Vaka Notları:** Nöbet devirlerinde yatak bazlı kritik uyarılar.

### ⚖️ 5. Avukat & Hukukçu Paketi (`durusma`)
* **Duruşma Ajandası:** Mahkeme, dosya esas numarası ve duruşma saatleri.
* **Kritik Süre Sayacı:** İstinaf, itiraz ve temyiz için "Kalan 3 Gün" kırmızı geri sayım alarmları.

### 🏠 6. Emlak & Gayrimenkul Paketi (`emlak`)
* **İlan Portföyü:** Satılık/kiralık daire listesi, mal sahibi irtibatı ve anahtar durumu.
* **Alıcı Kriter Eşleştirme:** Bütçe ve oda sayısına göre alıcı-mülk eşleme.

### 🛡️ 7. Asker, Polis & Güvenlik Paketi (`zimmet`)
* **Vardiya/Devriye Planı:** 12/36 ve döngüsel nöbet takipleri.
* **Zimmetli Teçhizat Bakımı:** Silah ve teçhizat periyodik bakım takvimi.

---

## 🛠️ 3. Dosya Yapısı ve Görev Dağılımı

| Dosya | Görevi ve Sorumluluğu |
| :--- | :--- |
| **`index.html`** | Ana iskelet, TailwindCSS + Glassmorphic UI arayüzü ve modallar. |
| **`js/polymorphicStore.js`** | 5 çekirdek primitifi yöneten, offline-first yerel veritabanı motoru. |
| **`js/moduleRegistry.js`** | 8 meslek şablonu, profil ayarları ve modül tanımları. |
| **`js/onboarding.js`** | Açılıştaki akıllı meslek ve ihtiyaç tespit anketi. |
| **`js/menus.js`** | Profile göre dinamik sol menü ve Modül Mağazası (`[+ Modül Ekle]`). |
| **`js/professionModules.js`** | Koçluk, Veresiye, Nöbet, Duruşma ve Emlak hızlı panelleri + GlassModal motoru. |
| **`js/marketDataService.js`** | Yahoo Finance v8 API, CORS proxy kaskadı ve altın hesaplayıcı. |
| **`js/finance_v2.js`** | Borsa V2 iş mantığı, portföy hesaplama ve Ticker Tape. |
| **`js/bist_database.js`** | Borsa İstanbul hisseleri ve sektör veri tabanı. |
| **`js/app.js`** | Ana uygulama orkestrasyonu, sekme yönlendirmeleri ve depolama. |

---

## 🚀 4. Nasıl Çalıştırılır?

Proje hiçbir kurulum veya sunucu bağımlılığı gerektirmez:

1. Proje klasöründe terminali / PowerShell'i açın.
2. Yerel sunucuyu başlatın:
   ```bash
   python -m http.server 5050
   ```
3. Tarayıcınızdan `http://localhost:5050` adresine gidin.
4. Karşılama anketinden dilediğiniz mesleği seçerek asistanınızı hemen kullanmaya başlayabilirsiniz!

---

## 🔒 5. Güvenlik ve Gizlilik

* Tüm verileriniz tarayıcınızın **LocalStorage / IndexedDB** belleğinde güvenle tutulur.
* Hiçbir kişisel veri, öğrenci notu, müşteri borcu veya portföy bilgisi harici bir sunucuya gönderilmez.
* Verileriniz tamamen sizin cihazınızda ve kontrolünüzdedir.
