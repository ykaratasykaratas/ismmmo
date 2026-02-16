#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m' 

echo -e "${GREEN}HIZLI DEPLOY BASLATILIYOR...${NC}"

# 1. Git Pull (Script ve compose dosyasını güncelle)
git pull

# 2. Docker Image Çek (Build yok, sadece indirme var)
echo -e "${GREEN}Guncel Image Indiriliyor...${NC}"
sudo docker pull ykaratas421/ismmmo-web:latest

# 3. Klasörleri Hazırla
mkdir -p web/db
mkdir -p web/public/uploads
sudo chmod -R 777 web/db
sudo chmod -R 777 web/public/uploads

# 4. Veritabanı Güncelle
echo -e "${GREEN}Veritabani Guncelleniyor...${NC}"
sudo docker compose -f docker-compose.prod.yml run --rm migrator

# 5. Web App Yeniden Başlat
echo -e "${GREEN}Sistem Yeniden Baslatiliyor...${NC}"
sudo docker compose -f docker-compose.prod.yml up -d web

# 6. Temizlik
sudo docker image prune -f

echo -e "${GREEN}ISLEM TAMAMLANDI! 🚀${NC}"
