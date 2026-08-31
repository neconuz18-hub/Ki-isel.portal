# 📊 Kişisel Portal V2 - Canlı Piyasa & Portföy Yönetim Sistemi

Bu proje, masaüstü ve mobil uyumlu, çok amaçlı bir kişisel yönetim portalıdır. Son yapılan V2 güncellemesi ile **Finans ve Borsa Modülü** tamamen sıfırdan yazılarak gerçek zamanlı veri sağlayan profesyonel bir portföy yönetim aracına dönüştürülmüştür.

---

## 🛠 Proje Mimarisi ve Çalışma Mantığı

Proje, hiçbir arka plan (backend) sunucusuna ihtiyaç duymadan, doğrudan tarayıcı üzerinde (frontend) çalışan "Serverless" mantığı ile inşa edilmiştir.

### 1. Veri Kaynağı (Yahoo Finance v8 API)
Canlı borsa ve döviz verileri, güvenilirliği en yüksek kaynaklardan biri olan **Yahoo Finance v8 API** üzerinden çekilir. 
- **CORS Proxy Kaskad Sistemi:** Tarayıcıların güvenlik duvarını (CORS) aşmak için veriler direkt olarak çekilmez; `corsproxy.io` ve `allorigins.win` proxy (vekil) sunucuları üzerinden geçirilir. Biri yanıt vermezse sistem otomatik olarak diğerine geçer.
- **Veri Gecikmesi:** Yasal standartlar gereği Borsa İstanbul (BIST) hisse verileri 15 dakika gecikmeli, döviz ve altın verileri ise anlık (canlı) olarak çekilmektedir.
- **Önbellek (Caching):** API limitlerine takılmamak ve performansı artırmak için çekilen veriler tarayıcı hafızasında 60 saniye boyunca tutulur (60s TTL).

### 2. Dosya Yapısı ve Görevleri
Finans modülü üç temel dosya üzerinden çalışır:

* **`marketDataService.js` (Veri Katmanı):** Sadece dış dünyadan (Yahoo Finance) veri çekmek, altın hesaplamaları yapmak ve önbelleği yönetmekle görevlidir. Ekranla (UI) hiçbir bağlantısı yoktur.
* **`finance_v2.js` (İş Mantığı ve UI Katmanı):** Kullanıcının portföy verilerini (Lot ve Maliyet) `localStorage` üzerinde saklar. `marketDataService`'den aldığı güncel piyasa fiyatları ile kullanıcının maliyetini karşılaştırıp **gerçek zamanlı Kar/Zarar hesabı** yapar ve bunu ekrana basar.
* **`bist_database.js` (Hisse Veritabanı):** Arama kutusuna hisse adı yazıldığında otomatik tamamlama (autocomplete) yapabilmek için Borsa İstanbul'daki önemli hisselerin ve sektörlerinin tutulduğu statik veri tabanıdır.

---

## 🚀 Öne Çıkan Özellikler (Neler Yapıldı?)

### 📈 Canlı Piyasa Bandı (Ticker Tape)
Sayfanın en üstünde, tıpkı ekonomi kanallarında olduğu gibi BIST100, Dolar, Euro ve Gram Altın fiyatlarını saniyelik gösteren dinamik bir bant bulunur. (Yeşil=Yükseliş, Kırmızı=Düşüş).

### 💼 Gerçek Zamanlı Portföy Kar/Zarar
Eski sistemdeki manuel / sahte rakamlar silindi. Artık "Hisse Ekle" diyerek örneğin 100 Lot `THYAO` (Türk Hava Yolları) girdiğinizde, sistem o anki THYAO hisse fiyatını internetten çeker ve cebinizdeki net kazancı/kaybı kuruşu kuruşuna hesaplar.

### 🔍 Akıllı Hisse Arama
Arama kutusuna "Türk Hava" veya "THYAO" yazdığınızda sistem bunu BIST veritabanında bulur. Tek tuşla **Takip Listesine** alabilir veya lot bilgisi girerek **Portföye** ekleyebilirsiniz.

### 💰 Kapsamlı Döviz & Altın Modülü
Uluslararası piyasadan çekilen (XAUTRY=X) ONS altın verisi üzerinden matematiksel formüllerle **Gerçek Gram Altın, Çeyrek, Yarım ve Tam (Ata) Altın** fiyatları hesaplanır ve "Döviz & Altın" sekmesinde canlı sunulur.

### 📱 Mobil Uyum (Responsive)
Tüm tablolar ve kartlar, telefondan girildiğinde (Mobil görünüm) taşıma ve daralma yapmayacak şekilde "Grid Kart" sistemine dönüştürülmüştür. Masaüstünde geniş tablolar, mobilde dokunmatik dostu kartlar olarak görünür.

---

## 💻 Nasıl Çalıştırılır?

Bu bir statik HTML/JS projesi olduğu için çalıştırması oldukça basittir:

1. Bilgisayarınızda projenin bulunduğu klasörde terminali (veya PowerShell'i) açın.
2. Aşağıdaki komutu yazarak lokal bir sunucu başlatın:
   ```bash
   python -m http.server 5050
   ```
3. Tarayıcınızı açıp `http://localhost:5050` adresine gidin.
4. Sol menüden **Finans & Borsa** sekmesine tıklayarak canlı piyasayı deneyimleyebilirsiniz.

> Tüm verileriniz tarayıcınızın LocalStorage belleğinde tutulur. Sunucu (Backend) olmadığı için verileriniz tamamen sizin cihazınızda ve güvendedir.
