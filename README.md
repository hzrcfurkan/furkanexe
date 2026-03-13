# PetCare Desktop — Kurulum Talimatları

## Gereksinimler
- Node.js (https://nodejs.org) — kurulu olmalı
- İnternet bağlantısı

## Build Adımları (Bir kez yapılır)

1. Bu klasörü bilgisayara kopyala
2. PowerShell / Terminalde klasörü aç:
   ```
   cd petcare-desktop
   ```
3. Paketleri kur:
   ```
   npm install
   ```
4. İkon dosyaları ekle (assets klasörüne):
   - `assets/icon.ico`  → 256x256 uygulama ikonu
   - `assets/tray.ico`  → 16x16 veya 32x32 tepsi ikonu
   (Geçici olarak herhangi bir .ico koyabilirsin)

5. .exe oluştur:
   ```
   npm run build
   ```
6. `dist/` klasöründe `PetCare Setup 1.0.0.exe` çıkar

## Kurulum Sonrası
- Setup.exe çalıştır → Kur
- Uygulama Windows başlangıcında otomatik açılır
- Sistem tepsisinde (sağ alt) çalışır
- Kapatınca kapanmaz, tray'de gizlenir
- Çift tıkla veya tray menüsünden "Çıkış" ile kapat

## Tray Menüsü
- PetCare'i Aç
- Windows Başlangıcında Çalış (açık/kapalı)
- Çıkış
