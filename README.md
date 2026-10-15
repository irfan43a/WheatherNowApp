# 🌦️ PantauCuaca - Aplikasi Cuaca Real-Time

Aplikasi prakiraan cuaca modern, interaktif, dan real-time yang terintegrasi langsung dengan API cuaca global (**Open-Meteo & WMO**). Pengguna dapat memilih dan mencari berbagai daerah/kota di Indonesia maupun dunia secara instan tanpa perlu registrasi atau konfigurasi API Key manual.

---

## ✨ Fitur Utama

1. **Integrasi API Real-Time**:
   - Data cuaca langsung (suhu saat ini, suhu terasa seperti, kelembaban, kecepatan & arah angin, hembusan angin, tekanan atmosfer, curah hujan, tutupan awan).
   - Data kualitas udara (**Air Quality Index - AQI**, PM2.5, PM10) beserta rekomendasi kesehatan.
   - Waktu matahari terbit (*sunrise*) dan terbenam (*sunset*).
   - Indeks UV harian maksimal dengan kategori tingkat bahaya.

2. **Pilihan Daerah & Pencarian Fleksibel**:
   - **Pencarian Langsung (Live Search Autocomplete)**: Cari nama kota, kabupaten, atau provinsi (contoh: Jakarta, Bandung, Surabaya, Yogyakarta, Denpasar, Makassar, Medan, Tokyo, London, dll).
   - **Deteksi GPS Lokasi Saya**: Cukup klik tombol *"Lokasi Saya"* untuk mendeteksi koordinat Anda secara otomatis melalui browser Geolocation & Reverse Geocoding.
   - **Pilihan Cepat Kota Populer Indonesia**: Chip cepat untuk kota-kota besar di Indonesia (Jakarta, Surabaya, Bandung, Medan, Denpasar/Bali, Yogyakarta, Makassar, Semarang, Malang, Balikpapan, Palembang).
   - **Daftar Favorit Tersimpan**: Simpan kota favorit Anda menggunakan tombol bintang (⭐). Data disimpan di penyimpanan lokal browser (*localStorage*).

3. **Prakiraan Cuaca Komprehensif**:
   - **Prakiraan 24 Jam**: Prakiraan cuaca per jam lengkap dengan temperatur, ikon cuaca, dan persentase kemungkinan hujan.
   - **Prakiraan 7 Hari**: Ringkasan cuaca seminggu ke depan dilengkapi visualisasi bilah rentang temperatur harian (min-max).

4. **UI/UX & Desain Modern**:
   - **Dynamic Weather Themes**: Latar belakang berubah secara dinamis sesuai kondisi cuaca (Cerah, Berawan, Mendung, Hujan, Badai Petir, dan Malam Hari).
   - Efek *Glassmorphism* modern dengan tipografi *Plus Jakarta Sans*.
   - **Pengubah Unit Suhu**: Beralih antara Celsius (°C) dan Fahrenheit (°F) dengan satu klik.
   - Tombol perbarui data (*Refresh*) real-time.
   - Tampilan responsif optimal untuk layar desktop, tablet, maupun smartphone.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Node.js sudah terpasang di komputer Anda.

### 1. Masuk ke direktori aplikasi
```bash
cd d:\testProject\weatherApp
```

### 2. Jalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka URL lokal yang muncul di terminal (biasanya `http://localhost:5173`) di browser Anda.

### 3. Membangun untuk Produksi (Production Build)
```bash
npm run build
npm run preview
```

---

## 🛠️ Teknologi yang Digunakan

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Ikon cuaca & antarmuka)
- **Open-Meteo API** (Data Cuaca, Geocoding, & Kualitas Udara - Bebas API Key & Tanpa Kuota Terbatas)
