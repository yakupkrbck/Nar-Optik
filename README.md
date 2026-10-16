# Nar Optik - Dijital Katalog & Tanıtım Platformu

Modern, mobil ve masaüstü uyumlu, Firebase Firestore entegrasyonlu optik cam, gözlük ve lens dijital katalog ve yönetim sistemi.

## 🚀 Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyebilirsiniz.

3. **Üretim (Production) Derlemesi:**
   ```bash
   npm run build
   ```

## 🛠️ Kullanılan Teknolojiler

- **React 19 & TypeScript:** Tip güvenli modern arayüz mimarisi
- **Vite:** Hızlı derleme ve geliştirme ortamı
- **Tailwind CSS v4:** Modern, responsive ve zarif tasarım
- **Firebase Firestore:** Gerçek zamanlı ürün, kategori ve mevzuat/KVKK metinleri yönetimi
- **Lucide Icons:** Zengin vektörel ikon seti

## 📁 Proje Yapısı

- `src/`: Uygulama kaynak kodları
  - `components/`: Arayüz bileşenleri (Navbar, Footer, AdminDashboardModal, LegalNoticeModal, ProductDetailModal, vb.)
  - `data/`: Varsayılan katalog ve kategori verileri
  - `firebase.ts`: Firebase Firestore bağlantısı, güvenlik ve veri eşitleme servisleri
  - `types.ts`: Tip tanımları
- `public/`: Statik varlıklar ve ürün görselleri
- `firestore.rules`: Firebase Firestore güvenlik kuralları
- `firebase-applet-config.json`: Firebase yapılandırma bilgileri
