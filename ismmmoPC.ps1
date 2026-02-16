docker login

Write-Host "Build islemi baslatiliyor... (Hedef platform: Linux/ARM64 - Raspberry Pi)" -ForegroundColor Green

# 1. Image Olustur
docker buildx build --platform linux/arm64 -t ykaratas421/ismmmo-web:latest ./web --push

# Eger hata yoksa
if ($?) {
    Write-Host "ISLEM BASARILI! Image Docker Hub'a yuklendi." -ForegroundColor Green
    Write-Host "Simdi Pi uzerinde ./ismmmoPi.sh calistirabilirsiniz." -ForegroundColor Cyan
} else {
    Write-Host "HATA: Build isleminde sorun olustu." -ForegroundColor Red
}
