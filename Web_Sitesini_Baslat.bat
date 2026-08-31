@echo off
chcp 65001 >nul
title Yonetici Asistani Web Sunucusu Baslatiliyor...

REM Port 5050 uzerindeki eski surecleri temizle
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5050 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Python sunucusunu arka planda baslat
start "Yonetici_Asistani_Sunucu" /min python "%~dp0server.py"
ping 127.0.0.1 -n 3 >nul

REM Tarayici ile ac
if exist "C:\Program Files\Mozilla Firefox\firefox.exe" (
    start "" "C:\Program Files\Mozilla Firefox\firefox.exe" http://localhost:5050
) else if exist "C:\Program Files (x86)\Mozilla Firefox\firefox.exe" (
    start "" "C:\Program Files (x86)\Mozilla Firefox\firefox.exe" http://localhost:5050
) else (
    start http://localhost:5050
)
