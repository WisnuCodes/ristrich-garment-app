# Panduan Instalasi & Menjalankan Sistem (Setup Guide)
## CV Ristrich Garment - Sistem Informasi & Pemesanan Online Konveksi Busana

Panduan lengkap ini menjelaskan langkah demi langkah pemasangan dan pengoperasian backend Laravel 11 serta frontend React Vite MPA (Multi-Page Application) pada lingkungan lokal (khususnya Laragon di Windows maupun sistem operasi lain).

---

### Prasyarat Sistem (System Prerequisites)

1. **PHP**: Versi `>= 8.2` (Rekomendasi PHP 8.3)
   - Ekstensi PHP wajib aktif: `pdo`, `pdo_mysql` / `pdo_sqlite`, `curl`, `fileinfo`, `gd`, `mbstring`, `openssl`, `tokenizer`, `xml`.
2. **Composer**: Versi `>= 2.5`
3. **Node.js**: Versi `>= 18.0` (LTS direkomendasikan)
4. **NPM**: Versi `>= 9.0`
5. **Database**: MySQL (MariaDB) atau SQLite bawaan.

---

### Akun Bawaan Seeder (Default Credentials)

Setelah menjalankan seeder database, sistem telah menyiapkan akun berikut:

| Peran (Role) | Email | Password | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ristrich.com` | `password` | Mengakses dashboard admin, mengelola status produksi, download mockup, dan mengelola konten katalog. |
| **Pelanggan Demo** | `pelanggan@example.com` | `password` | Mengakses pemesanan online, melihat riwayat pesanan pribadi, dan mencoba fitur upload mockup. |

---

### Bagian 1: Instalasi & Menjalankan Backend (`project-be`)

1. **Buka terminal dan masuk ke direktori backend:**
   ```bash
   cd project-be
   ```

2. **Salin file konfigurasi environment:**
   ```bash
   cp .env.example .env
   # Atau di PowerShell / CMD Windows:
   copy .env.example .env
   ```

3. **Install dependensi Composer:**
   ```bash
   composer install
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Konfigurasi Database MySQL (Laragon) pada file `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=restrich
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Klik **"Start All"** pada kontrol panel Laragon untuk menjalankan MySQL service, lalu buat basis data bernama `restrich` melalui HeidiSQL atau phpMyAdmin)*

6. **Jalankan Migrasi Database dan Seeder Awal:**
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Perintah ini akan membuat semua tabel dan mengisi data katalog layanan, portofolio hasil produksi, akun admin/pelanggan, serta pesanan contoh.*

7. **Tautkan Direktori Publik Storage (Wajib untuk Foto & File Mockup):**
   ```bash
   php artisan storage:link
   ```

8. **Jalankan Server Backend API:**
   ```bash
   php artisan serve --port=8000
   ```
   *Backend API sekarang dapat diakses pada: `http://127.0.0.1:8000/api`*

---

### Bagian 2: Instalasi & Menjalankan Frontend (`project-fe`)

Frontend dibangun menggunakan arsitektur modern **React + Vite SPA (Single Page Application)** dengan React Router DOM, Tailwind CSS, Material UI (MUI Icons), font Poppins, dan Zustand state management berpedoman pada standar anti-slop design.

1. **Buka jendela terminal baru dan masuk ke direktori frontend:**
   ```bash
   cd project-fe
   ```

2. **Install dependensi Node.js:**
   ```bash
   npm install
   ```

3. **Jalankan Server Development Vite:**
   ```bash
   npm run dev
   ```
   *Aplikasi web frontend sekarang berjalan pada: `http://localhost:5173`*

4. **Membangun Bundel Produksi (Build Production):**
   ```bash
   npm run build
   ```
   *Seluruh aset terkompilasi akan tersimpan di direktori `project-fe/dist/`.*

---

### Peta Rute Halaman Frontend (SPA)

- `http://localhost:5173/`: Beranda CV Ristrich Garment & quick resi lookup
- `http://localhost:5173/profil`: Profil Workshop, Legalitas & Fasilitas Mesin Konveksi
- `http://localhost:5173/layanan`: Katalog Layanan & Rekomendasi Bahan Kain
- `http://localhost:5173/portofolio`: Galeri Portofolio & Hasil Produksi Klien
- `http://localhost:5173/lacak`: Pelacakan Resi Publik Real-time (dukung `?resi=RG-XXXX`)
- `http://localhost:5173/pesan`: Formulir Pemesanan Online (Matrix Ukuran S-XXL & Upload Mockup)
- `http://localhost:5173/sukses`: Tampilan Konfirmasi Sukses Pemesanan & Salin Resi
- `http://localhost:5173/riwayat`: Riwayat Pemesanan Pelanggan & Detail Status
- `http://localhost:5173/login`: Masuk Akun Pelanggan / Admin
- `http://localhost:5173/register`: Pendaftaran Akun Pelanggan Baru
- `http://localhost:5173/admin/dashboard`: Dashboard Statistik & Kapasitas Produksi Admin
- `http://localhost:5173/admin/pesanan`: Manajemen Pesanan, Update Status Produksi, Download Mockup
- `http://localhost:5173/admin/pelanggan`: Data Pelanggan Terdaftar & Riwayat Akumulasi PO
- `http://localhost:5173/admin/konten`: Manajemen Konten Portofolio & Katalog Layanan

---

### Pemecahan Masalah (Troubleshooting)

- **Masalah CORS saat Fetching API:**
  Pastikan backend telah mengonfigurasi `config/cors.php` dengan `supports_credentials => true` dan `allowed_origins => ['*']` atau `['http://localhost:5173']`.
- **Gambar dan Berkas Desain Tidak Tampil (404 Not Found):**
  Pastikan telah menjalankan perintah `php artisan storage:link` di direktori `project-be`.
- **Error Upload File Terlalu Besar:**
  Pastikan konfigurasi `upload_max_filesize = 20M` dan `post_max_size = 25M` pada `php.ini`. Validasi backend membatasi maksimal 10MB per berkas mockup.

