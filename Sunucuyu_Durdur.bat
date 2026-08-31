@echo off
chcp 65001 >nul
title Sunucuyu Durdur - Yonetici Asistani
cls

echo =========================================================
echo       YONETICI ASISTANI WEB SUNUCUSU DURDURULUYOR
echo =========================================================
echo.

set FOUND=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5050 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    set FOUND=1
)

if "%FOUND%"=="1" (
    echo [OK] Web sunucusu (Port 5050) basariyla kapatildi.
) else (
    echo [BILGI] Port 5050 uzerinde calisan aktif sunucu bulunamadi.
)

echo.
ping 127.0.0.1 -n 2 >nul
