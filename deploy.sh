#!/bin/bash

# Renkler
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Deploy işlemi başlatılıyor...${NC}"

# 1. En güncel kodu çek
echo -e "${GREEN}Git pull yapılıyor...${NC}"
git pull

# 2. Database klasörünü hazırla
if [ ! -d "web/db" ]; then
    echo -e "${GREEN}Database klasörü oluşturuluyor...${NC}"
    mkdir -p web/db
fi

# Eğer kök dizinde eski prod.db varsa onu içeri taşı
if [ -f "web/prod.db" ]; then
    echo -e "${GREEN}Eski veritabanı taşınıyor...${NC}"
    mv web/prod.db web/db/prod.db
fi

# DB yoksa oluştur
if [ ! -f "web/db/prod.db" ]; then
    echo -e "${GREEN}Yeni prod.db oluşturuluyor...${NC}"
    touch web/db/prod.db
fi

# İzinleri ayarla (Klasör ve dosya için)
chmod -R 777 web/db

# 2.5 Upload klasörünü hazırla
if [ ! -d "web/public/uploads" ]; then
    echo -e "${GREEN}Upload klasörü oluşturuluyor...${NC}"
    mkdir -p web/public/uploads
fi
chmod -R 777 web/public/uploads

# 3. Veritabanı şemasını güncelle (Migrate)
echo -e "${GREEN}Veritabanı güncelleniyor...${NC}"
# Migrator servisi de güncellenen docker-compose.prod.yml'yi kullanacak
docker compose -f docker-compose.prod.yml run --rm --build migrator

# 4. Web uygulamasını başlat
echo -e "${GREEN}Uygulama başlatılıyor...${NC}"
docker compose -f docker-compose.prod.yml up -d --build web

# 5. Gereksiz image'ları temizle (Pi'de yer kazanmak için)
echo -e "${GREEN}Temizlik yapılıyor...${NC}"
docker image prune -f

echo -e "${GREEN}Deploy tamamlandı! 🚀${NC}"
