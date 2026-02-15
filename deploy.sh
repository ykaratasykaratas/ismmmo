#!/bin/bash

# Renkler
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Deploy işlemi başlatılıyor...${NC}"

# 1. En güncel kodu çek
echo -e "${GREEN}Git pull yapılıyor...${NC}"
git pull

# 2. Prod.db dosyası yoksa oluştur (Docker klasör olarak açmasın diye)
if [ ! -f "web/prod.db" ]; then
    echo -e "${GREEN}prod.db oluşturuluyor...${NC}"
    touch web/prod.db
fi

# 3. Veritabanı şemasını güncelle (Migrate)
echo -e "${GREEN}Veritabanı güncelleniyor...${NC}"
docker compose -f docker-compose.prod.yml run --rm --build migrator

# 4. Web uygulamasını başlat
echo -e "${GREEN}Uygulama başlatılıyor...${NC}"
docker compose -f docker-compose.prod.yml up -d --build web

# 5. Gereksiz image'ları temizle (Pi'de yer kazanmak için)
echo -e "${GREEN}Temizlik yapılıyor...${NC}"
docker image prune -f

echo -e "${GREEN}Deploy tamamlandı! 🚀${NC}"
