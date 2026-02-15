# İSMMMO Kartal Oda Temsilciliği - Proje Teknik Dokümanı

## 1. Proje Özeti ve Kapsam
Bu proje, İSMMMO Kartal Oda Temsilciliği üyeleri için bir mobil uygulama ve yönetim paneli sistemidir. Sistem; üye kayıt/onay mekanizması, kategori bazlı duyuru/bildirim sistemi ve etkinlik katılım takibi üzerine kuruludur.

## 2. Veritabanı Şeması (Database Schema)
Sistemin veritabanı aşağıdaki tabloları ve alanları içermelidir:

### Users (Üyeler)
- `id`: UUID
- `full_name`: String
- `phone`: String (Unique)
- `room_number`: String
- `email`: String
- `birth_date`: Date
- `status`: Enum ('Pending', 'Approved', 'Rejected')
- `category_id`: Relation (Categories table)
- `created_at`: Timestamp

### Announcements (Duyurular)
- `id`: UUID
- `title`: String
- `description`: Text
- `image_url`: String (Optional)
- `type`: Enum ('Standard', 'Event')
- `target_category`: Relation (Categories table or 'All')
- `event_date`: Timestamp (Only for Events)
- `is_closed`: Boolean (Participation status)

### Participations (Katılımlar)
- `id`: UUID
- `announcement_id`: Relation
- `user_id`: Relation
- `plus_count`: Integer (Ek kişi sayısı)
- `total_coming`: Integer (User + plus_count)

## 3. Sayfa Yönlendirme ve Akış (App Routing)

### Mobile App Flow
- **Splash Screen:** Logo ve yükleme.
- **Auth Screen:** Giriş Yap / Kayıt Ol sekmeleri.
- **Pending Approval:** Kayıt olan ancak admin onayı bekleyen üyeler için uyarı ekranı.
- **Home (Announcements):** Onaylı üyeler için duyuru listesi.
- **Detail Page:** Duyuru içeriği ve (varsa) katılım formu.

### Web Admin Flow
- **Dashboard:** Genel istatistikler ve bekleyen onaylar.
- **User Management:** Üye listesi, Excel karşılaştırma ve onay/red butonları.
- **Create Announcement:** Duyuru oluşturma, kategori seçimi ve Push Notification tetikleme.
- **Reports:** Etkinlik bazlı katılımcı listeleri ve Excel çıktı alma.

## 4. Tasarım ve Fonksiyonlar (Antigravity Promptundan)

**Tasarım Dili:**
- Kurumsal Lacivert (#1a237e) ve Turuncu (#ff6d00).
- Modern, temiz ve profesyonel UI.

**Mobil Fonksiyonlar:**
- Ad, Telefon, Oda No, Email ve Doğum Tarihi ile kayıt formu.
- Admin onayı bekleyenler için kısıtlı erişim ('Onay Bekleniyor').
- Kart yapısında duyuru akışı.
- Etkinliklerde '+ Kişi Sayısı' seçimi.
- Push Notification desteği.

**Web Admin Fonksiyonlar:**
- Üye yönetimi ve 'Excel ile Karşılaştır' özelliği.
- Hedef kitle (Kategori) seçimi ile duyuru oluşturma.
- Katılımcı raporlarını Excel olarak alma.

## 5. Stil Rehberi (CSS Variables & Snippets)

### Renk Paleti ve Değişkenler
```css
:root {
  --ismmmo-navy: #1a237e;    /* Ana kurumsal lacivert */
  --ismmmo-orange: #ff6d00;  /* Vurgu turuncusu */
  --ismmmo-white: #ffffff;
  --ismmmo-gray: #f5f5f5;
  --ismmmo-text: #333333;
  --border-radius: 12px;
  --shadow-soft: 0 4px 15px rgba(0,0,0,0.1);
}
```

### Bileşen Stilleri (Referans)
*Detaylı CSS sınıfları (announcement-card, auth-input, primary-button, admin-table, notification-box) analiz edilmiştir ve uygulamada kullanılacaktır.*
