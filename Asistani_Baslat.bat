@echo off
chcp 65001 >nul
title Yonetici Asistani Paneli Baslatiliyor...
cls

echo ===================================================
echo     YÖNETİCİ ASİSTANI PANELİ BAŞLATILIYOR
echo ===================================================
echo.
echo Paneli varsayılan tarayıcınızda açıyoruz...
echo.

start "" "%~dp0index.html"

exit
