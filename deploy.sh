#!/bin/bash

# En son kodları çek
git pull

# Container'ları yeniden oluştur ve başlat (arka planda)
# --build: Dockerfile'da değişiklik varsa image'ı yeniden oluşturur
# -d: Detached mode (arka plan)
docker-compose up -d --build

# Kullanılmayan image'ları temizle (isteğe bağlı, yer kazanmak için)
docker image prune -f
