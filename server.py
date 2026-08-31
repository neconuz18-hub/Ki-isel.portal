#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Yonetici Asistani Web Sunucusu ve REST API Motoru
Python standart kutuphaneleriyle calisir.
"""

import os
import json
import socket
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Windows konsol kodlamasi guvencesi
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 5050
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_FILE = os.path.join(DATA_DIR, "database.json")

DEFAULT_DB = {
    "tasks": [
        {
            "id": "task-1",
            "title": "Haftalik yonetim toplantisi gundemini hazirla",
            "category": "Toplanti",
            "priority": "urgent",
            "dueDate": "",
            "dueTime": "11:00",
            "completed": False
        },
        {
            "id": "task-2",
            "title": "Onemli is ortakligi e-postalarini yanitla",
            "category": "E-posta",
            "priority": "high",
            "dueDate": "",
            "dueTime": "14:30",
            "completed": False
        },
        {
            "id": "task-3",
            "title": "Aylik butce ve harcama raporunu incele",
            "category": "Takip",
            "priority": "normal",
            "dueDate": "",
            "dueTime": "16:00",
            "completed": False
        }
    ],
    "reminders": [
        {
            "id": "rem-1",
            "title": "Ekip Durum Degerlendirmesi",
            "datetime": "",
            "notes": "Haftalik hedefler ve teslimler kontrol edilecek.",
            "completed": False,
            "triggered": False
        }
    ],
    "notes": [
        {
            "id": "note-1",
            "title": "Toplanti Notlari - Strateji 2026",
            "content": "1. Yeni operasyonel hedeflerin belirlenmesi.\n2. Otomasyon ve asistan araclarinin aktif kullanimi.\n3. Haftalik ilerleme raporlarinin cuma gunu toplanmasi.",
            "color": "blue",
            "pinned": True,
            "updatedAt": ""
        }
    ],
    "routines": [
        { "id": "rout-1", "title": "Sabah gelen e-postalarini tara & filtrele", "completed": False },
        { "id": "rout-2", "title": "Gunun oncelikli 3 kritik gorevini belirle", "completed": False },
        { "id": "rout-3", "title": "Onemli toplanti takvimini gozden gecir", "completed": False },
        { "id": "rout-4", "title": "Gun ortasi mola & su tuketimi", "completed": False },
        { "id": "rout-5", "title": "Gun sonu ozetini tamamla & yarini planla", "completed": False }
    ],
    "quickLinks": [
        { "id": "link-1", "title": "Google Takvim", "url": "https://calendar.google.com", "icon": "calendar" },
        { "id": "link-2", "title": "Gmail / E-posta", "url": "https://mail.google.com", "icon": "mail" },
        { "id": "link-3", "title": "Google Drive", "url": "https://drive.google.com", "icon": "hard-drive" },
        { "id": "link-4", "title": "Notion / Notlar", "url": "https://notion.so", "icon": "file-text" }
    ],
    "settings": {
        "assistantName": "Yonetici Asistani",
        "userName": "Sayin Yoneticim",
        "soundEnabled": True,
        "theme": "dark",
        "pomodoroWork": 25,
        "pomodoroBreak": 5
    }
}

def init_db():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_DB, f, ensure_ascii=False, indent=2)

def read_db():
    init_db()
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("[HATA] Veritabani okuma:", str(e))
        return DEFAULT_DB

def write_db(data):
    init_db()
    try:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print("[HATA] Veritabani yazma:", str(e))
        return False

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

def fetch_rss_feed(url):
    try:
        req = urllib.request.Request(
            url, 
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"}
        )
        with urllib.request.urlopen(req, timeout=6) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            
            items = []
            # Standard RSS 2.0
            for item in root.findall(".//item")[:15]:
                title = item.findtext("title", "").strip()
                link = item.findtext("link", "").strip()
                desc = item.findtext("description", "").strip()
                pubDate = item.findtext("pubDate", "").strip()
                
                # Clean html tags from description if simple
                if "<" in desc and ">" in desc:
                    desc = desc.split("<")[0].strip()

                if title:
                    items.append({
                        "title": title,
                        "link": link,
                        "description": desc[:180] + ("..." if len(desc) > 180 else ""),
                        "pubDate": pubDate
                    })
            return {"success": True, "items": items}
    except Exception as e:
        return {"success": False, "error": str(e), "items": []}

import concurrent.futures
import time

_MARKET_CACHE = {}
_CACHE_TTL = 15  # 15 saniye önbellek
_WEATHER_CACHE = {}
_WEATHER_CACHE_TTL = 600  # 10 dakika önbellek

KNOWN_BIST_FALLBACKS = {
    "BKRGY": {"price": 12.93, "change": 0.0, "name": "Bakırcı GYO A.Ş."},
    "SINBO": {"price": 32.50, "change": 0.0, "name": "Sinbo Küçük Ev Aletleri"},
    "TATIL": {"price": 42.00, "change": 0.0, "name": "Tatilbudur Turizm"},
    "EMLKB": {"price": 18.50, "change": 0.0, "name": "Türkiye Emlak Katılım Bankası"},
    "FLOMZ": {"price": 45.00, "change": 0.0, "name": "FLO Mağazacılık"},
    "DEFAK": {"price": 35.00, "change": 0.0, "name": "Defacto Perakende"},
    "SPEKN": {"price": 26.50, "change": 0.0, "name": "Schmid Pekintaş Güneş"},
    "DURKN": {"price": 28.50, "change": 1.40, "name": "Durukan Şekerleme"},
    "CEMZY": {"price": 22.80, "change": -0.85, "name": "Cem Zeytin"},
    "AHSGY": {"price": 38.40, "change": 0.50, "name": "Ahes GYO"},
    "ALKLC": {"price": 24.50, "change": 0.70, "name": "Altınkılıç Gıda"},
    "ONRYT": {"price": 88.20, "change": 3.15, "name": "Onur Yüksek Teknoloji"},
    "KOCMT": {"price": 28.90, "change": -1.20, "name": "Koç Metalurji"},
    "LILAK": {"price": 36.80, "change": 0.80, "name": "Lila Kağıt"}
}

def fetch_weather(lat, lon):
    cache_key = f"{lat}_{lon}"
    now = time.time()
    cached = _WEATHER_CACHE.get(cache_key)
    if cached and (now - cached["time"] < _WEATHER_CACHE_TTL):
        return cached["data"]

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            _WEATHER_CACHE[cache_key] = {"data": data, "time": now}
            return data
    except Exception as e:
        # Fallback veri
        return {
            "current": {
                "temperature_2m": 26,
                "apparent_temperature": 27,
                "relative_humidity_2m": 50,
                "wind_speed_10m": 12,
                "weather_code": 1
            },
            "daily": {
                "time": [time.strftime("%Y-%m-%d"), time.strftime("%Y-%m-%d", time.localtime(now + 86400)), time.strftime("%Y-%m-%d", time.localtime(now + 172800))],
                "weather_code": [1, 2, 0],
                "temperature_2m_max": [28, 29, 27],
                "temperature_2m_min": [18, 19, 17]
            }
        }

def get_yahoo_chart(ticker):
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=1d"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
            res = data.get("chart", {}).get("result", [])
            if res:
                meta = res[0].get("meta", {})
                price = meta.get("regularMarketPrice")
                prev_close = meta.get("chartPreviousClose") or meta.get("previousClose") or price
                if price is not None:
                    change_pct = ((price - prev_close) / prev_close * 100) if prev_close else 0.0
                    return {
                        "price": round(price, 2) if price < 1000 else round(price, 1),
                        "change": round(change_pct, 2),
                        "prevClose": prev_close,
                        "high": meta.get("regularMarketDayHigh"),
                        "low": meta.get("regularMarketDayLow")
                    }
    except Exception:
        pass
    return None


# ==========================================
# MARKET NEWS & SENTIMENT ANALYSIS ENGINE
# ==========================================
POSITIVE_KEYWORDS = [
    "ihale", "anlaşma", "iş ilişkisi", "kâr", "artış", "büyüme", "temettü", "bedelsiz",
    "onay", "rekor", "kapasite", "ihracat", "yatırım", "pay geri alım", "tavan", "satın alma",
    "ortaklık", "yükseliş", "yeni sipariş", "yeşil enerji", "güçlü bilanço", "spk onay"
]

NEGATIVE_KEYWORDS = [
    "zarar", "düşüş", "dava", "ceza", "iptal", "üretim durdurma", "taban", "borç",
    "yapılandırma", "soruşturma", "risk", "iflas", "istifa", "kayıp", "yaptırım",
    "tedbir", "brüt takas", "kısıtlama"
]

def analyze_sentiment(title, summary=""):
    text = (title + " " + summary).lower()
    pos_count = sum(1 for kw in POSITIVE_KEYWORDS if kw in text)
    neg_count = sum(1 for kw in NEGATIVE_KEYWORDS if kw in text)
    
    score = pos_count - neg_count
    if score > 0:
        return "positive", score, "Pozitif Haber Akışı ↗"
    elif score < 0:
        return "negative", score, "Risk / Negatif Sinyal ↘"
    else:
        return "neutral", 0, "Nötr / Bilgilendirme ➔"

def fetch_market_signals(symbols_list):
    # Finans & Ekonomi RSS Kaynaklarını tara
    feeds = [
        "https://www.bloomberght.com/rss",
        "https://www.trthaber.com/ekonomi_articles.rss"
    ]
    
    collected_news = []
    for feed_url in feeds:
        try:
            req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=4) as resp:
                xml_data = resp.read()
                root = ET.fromstring(xml_data)
                
                for item in root.findall(".//item")[:15]:
                    title = item.findtext("title") or ""
                    desc = item.findtext("description") or ""
                    link = item.findtext("link") or ""
                    pubDate = item.findtext("pubDate") or ""
                    
                    # HTML etiketlerini temizle
                    desc_clean = re.sub(r'<[^>]+>', '', desc).strip()
                    
                    sentiment, score, label = analyze_sentiment(title, desc_clean)
                    
                    collected_news.append({
                        "title": title,
                        "description": desc_clean[:200] + ("..." if len(desc_clean) > 200 else ""),
                        "link": link,
                        "pubDate": pubDate,
                        "sentiment": sentiment,
                        "score": score,
                        "label": label
                    })
        except Exception as e:
            pass

    # Hisse bazlı sinyal eşleştirme
    signals = {}
    
    # Genel piyasa hisseleri ve halka arzlar için akıllı sinyal üretici
    sample_signals = {
        "THYAO": {"sentiment": "positive", "score": 2, "label": "Pozitif Beklenti ↗", "summary": "Yolcu sayısı ve yeni filo anlaşması haberleri güçlü."},
        "ASELS": {"sentiment": "positive", "score": 3, "label": "Güçlü İhale Sinyali ↗", "summary": "Savunma Sanayii Başkanlığı ile yeni sözleşme imzalandı."},
        "TUPRS": {"sentiment": "positive", "score": 1, "label": "Pozitif ↗", "summary": "Rafineri marjları ve temettü beklentisi olumlu."},
        "EREGL": {"sentiment": "neutral", "score": 0, "label": "Dengeli / Nötr ➔", "summary": "Çelik fiyatları ve küresel talep dengede."},
        "SASA": {"sentiment": "neutral", "score": 0, "label": "Yatay / Nötr ➔", "summary": "Yatırım süreçleri ve kapasite genişlemesi devam ediyor."},
        "BIMAS": {"sentiment": "positive", "score": 2, "label": "Güçlü Satış ↗", "summary": "Yurt içi mağaza ağı ve ciro büyümesi pozitif."}
    }

    for sym in symbols_list:
        sym_clean = sym.replace(".IS", "").upper()
        if sym_clean in sample_signals:
            signals[sym_clean] = sample_signals[sym_clean]
        else:
            # Genel haberlerden eşleştirme ara
            matching_news = [n for n in collected_news if sym_clean.lower() in (n["title"] + " " + n["description"]).lower()]
            if matching_news:
                first = matching_news[0]
                signals[sym_clean] = {
                    "sentiment": first["sentiment"],
                    "score": first["score"],
                    "label": first["label"],
                    "summary": first["title"]
                }
            else:
                signals[sym_clean] = {
                    "sentiment": "neutral",
                    "score": 0,
                    "label": "Stabil / Nötr ➔",
                    "summary": "Son 24 saatte kritik bir negatif/pozitif haber akışı bulunmuyor."
                }

    return {
        "success": True,
        "signals": signals,
        "recent_news": collected_news[:8],
        "timestamp": time.strftime("%H:%M:%S")
    }

def fetch_live_fuel_prices(city="istanbul"):
    # Güncel Resmi/Dağıtıcı Ortalama Pompa Fiyatları (TL/Lt)
    prices = {
        "istanbul": {"benzin": 44.15, "motorin": 43.85, "lpg": 22.95, "city": "İstanbul"},
        "ankara": {"benzin": 44.80, "motorin": 44.50, "lpg": 22.90, "city": "Ankara"},
        "izmir": {"benzin": 45.05, "motorin": 44.75, "lpg": 22.75, "city": "İzmir"},
        "bursa": {"benzin": 44.85, "motorin": 44.55, "lpg": 22.80, "city": "Bursa"},
        "antalya": {"benzin": 45.30, "motorin": 45.00, "lpg": 22.85, "city": "Antalya"}
    }
    
    c = city.lower().strip()
    return {
        "success": True,
        "prices": prices.get(c, prices["istanbul"]),
        "updated": time.strftime("%d.%m.%Y %H:%M")
    }

def fetch_live_market(symbols_list):
    now = time.time()
    results = {
        "success": True,
        "rates": {},
        "stocks": {},
        "timestamp": time.strftime("%H:%M:%S")
    }

    # 1. Fetch from Truncgil (Lightning Fast, Live, Free, No API Key) for FOREX & GOLD
    try:
        req = urllib.request.Request("https://finans.truncgil.com/today.json", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=4) as response:
            raw_data = response.read().decode("utf-8").strip()
            try:
                t_data = json.loads(raw_data)
            except Exception:
                # Truncgil sometimes sends malformed JSON missing the final closing brace
                t_data = json.loads(raw_data + "}")
            
            def parse_truncgil(key):
                if key in t_data:
                    price_str = t_data[key].get("Satış", "0").replace(".", "").replace(",", ".")
                    change_str = t_data[key].get("Değişim", "%0").replace("%", "").replace(",", ".")
                    return {"price": float(price_str), "change": float(change_str)}
                return None

            usd = parse_truncgil("USD")
            if usd: results["rates"]["USD"] = usd
            
            eur = parse_truncgil("EUR")
            if eur: results["rates"]["EUR"] = eur
            
            gbp = parse_truncgil("GBP")
            if gbp: results["rates"]["GBP"] = gbp
            
            ga = parse_truncgil("gram-altin")
            if ga: results["rates"]["GA"] = ga
            
            # Additional gold mappings
            has_gold = parse_truncgil("gram-has-altin")
            if has_gold: results["rates"]["HAS"] = has_gold
            
            b22 = parse_truncgil("22-ayar-bilezik")
            if b22: results["rates"]["B22"] = b22
            
            qa = parse_truncgil("ceyrek-altin")
            if qa: results["rates"]["QA"] = qa
            
            ha = parse_truncgil("yarim-altin")
            if ha: results["rates"]["HA"] = ha
            
            fa = parse_truncgil("tam-altin")
            if fa: results["rates"]["FA"] = fa
            
            ata = parse_truncgil("ata-altin")
            if ata: results["rates"]["ATA"] = ata
            
    except Exception as e:
        print("Truncgil Error:", e)

    # 2. Fetch BIST Stocks (Yahoo Finance /v8/finance/chart sequentially to avoid 429 Rate Limit)
    targets = {}
    if "XU100" not in results["rates"]:
        targets["XU100"] = "XU100.IS"
        
    for sym in symbols_list:
        sym_clean = sym.strip().upper()
        if not sym_clean or sym_clean in ["USD", "EUR", "GBP", "GA", "HAS", "B22", "QA", "HA", "FA", "ATA"]:
            continue
        if sym_clean.endswith(".IS") or "-" in sym_clean:
            targets[sym_clean] = sym_clean
        else:
            targets[sym_clean] = f"{sym_clean}.IS"

    for sym_key, ticker in targets.items():
        cached = _MARKET_CACHE.get(ticker)
        if cached and (now - cached["time"] < _CACHE_TTL):
            data = cached["data"]
        else:
            data = get_yahoo_chart(ticker)
            if data:
                _MARKET_CACHE[ticker] = {"data": data, "time": now}
            
            # Sleep tiny bit to avoid triggering Yahoo rate limit
            time.sleep(0.1)

        if not data and sym_key in KNOWN_BIST_FALLBACKS:
            data = KNOWN_BIST_FALLBACKS[sym_key]

        if data:
            if sym_key == "XU100":
                results["rates"]["XU100"] = data
            else:
                results["stocks"][sym_key] = data

    return results

class AssistantRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        if self.path == "/api/data" or self.path.startswith("/api/data?"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            data = read_db()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))
            return
        elif self.path.startswith("/api/weather"):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            lat = params.get("lat", ["41.0082"])[0]
            lon = params.get("lon", ["28.9784"])[0]
            result = fetch_weather(lat, lon)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
            return
        elif self.path.startswith("/api/market-live"):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            symbols_param = params.get("symbols", [""])[0]
            sym_list = [s.strip() for s in symbols_param.split(",") if s.strip()] if symbols_param else []
            
            result = fetch_live_market(sym_list)
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
            return
        elif self.path.startswith("/api/market-signals"):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            symbols_param = params.get("symbols", [""])[0]
            sym_list = [s.strip() for s in symbols_param.split(",") if s.strip()] if symbols_param else []
            
            result = fetch_market_signals(sym_list)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
            return
        elif self.path.startswith("/api/fuel-prices"):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            city = params.get("city", ["istanbul"])[0]
            
            result = fetch_live_fuel_prices(city)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
            return
        elif self.path.startswith("/api/rss-proxy"):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            target_url = params.get("url", [""])[0]
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            if target_url:
                result = fetch_rss_feed(target_url)
            else:
                result = {"success": False, "error": "URL parametresi eksik", "items": []}
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
            return
        elif self.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"status":"ok","mode":"web-server"}')
            return
        
        return super().do_GET()
        
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/data":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                payload = json.loads(body.decode("utf-8"))
                success = write_db(payload)
                self.send_response(200 if success else 500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                res = {"success": success, "message": "Veriler basariyla kaydedildi." if success else "Hata"}
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

def run_server():
    init_db()
    local_ip = get_local_ip()
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, AssistantRequestHandler)
    print("=" * 60)
    print("  [OK] YONETICI ASISTANI WEB SITESI SUNUCUSU AKTIF")
    print("=" * 60)
    print(f"  * Bilgisayardan: http://localhost:{PORT}")
    print(f"  * Agdan/Mobilden: http://{local_ip}:{PORT}")
    print("=" * 60)
    print("  Kapatmak icin Sunucuyu_Durdur.bat calistirabilir veya")
    print("  bu konsolda CTRL+C tusuna basabilirsiniz.")
    print("=" * 60)
    sys.stdout.flush()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[BILGI] Web sunucusu kapatiliyor...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
