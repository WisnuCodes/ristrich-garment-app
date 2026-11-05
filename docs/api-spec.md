# Spesifikasi Kontrak API (API Specification)
## CV Ristrich Garment - Sistem Informasi & Pemesanan Online Konveksi Busana

Dokumen ini mendefinisikan seluruh kontrak RESTful API untuk platform konveksi CV Ristrich Garment. API dibangun dengan Laravel 11, menggunakan Laravel Sanctum untuk otentikasi berbasis token Bearer, dan mematuhi format respons terstandarisasi.

---

### Standar Format Respons Global (ApiResponseTrait)

Semua endpoint mengembalikan respons berformat JSON dengan format konsisten:

#### 1. Respons Berhasil (`HTTP 200 / 201`)
```json
{
  "success": true,
  "message": "Operasi berhasil dilakukan.",
  "data": { ... }
}
```

#### 2. Respons Gagal / Error (`HTTP 400 / 401 / 403 / 404 / 500`)
```json
{
  "success": false,
  "message": "Pesan deskripsi kesalahan.",
  "errors": null
}
```

#### 3. Respons Validasi Gagal (`HTTP 422 Unprocessable Content`)
```json
{
  "success": false,
  "message": "Validasi formulir gagal. Silakan periksa input Anda.",
  "errors": {
    "field_name": [
      "Pesan error spesifik dalam bahasa Indonesia."
    ]
  }
}
```

---

### Header Standar Request

| Header | Wajib | Nilai | Keterangan |
| :--- | :--- | :--- | :--- |
| `Accept` | **Ya** | `application/json` | Memastikan respons selalu berupa JSON |
| `Content-Type` | Kondisional | `application/json` atau `multipart/form-data` | Digunakan untuk body payload |
| `Authorization` | Kondisional | `Bearer {token}` | Wajib untuk endpoint terproteksi |

---

### Daftar Endpoint API

#### 1. Modul Otentikasi (`/api/auth`)

##### A. Registrasi Pelanggan
- **URL**: `POST /api/auth/register`
- **Akses**: Publik
- **Deskripsi**: Mendaftarkan akun pelanggan baru secara mandiri.
- **Request Body (`application/json`)**:
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone_number": "081234567890",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```
- **Respons Sukses (`HTTP 201 Created`)**:
```json
{
  "success": true,
  "message": "Pendaftaran akun berhasil. Selamat datang di CV Ristrich Garment!",
  "data": {
    "user": {
      "id": 2,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phone_number": "081234567890",
      "role": "pelanggan",
      "created_at": "2026-11-05T18:00:00.000000Z"
    },
    "token": "1|laravel_sanctum_token_hash_here..."
  }
}
```

##### B. Login Pengguna (Pelanggan / Admin)
- **URL**: `POST /api/auth/login`
- **Akses**: Publik
- **Request Body (`application/json`)**:
```json
{
  "email": "budi@example.com",
  "password": "Password123!"
}
```
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 2,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phone_number": "081234567890",
      "role": "pelanggan"
    },
    "token": "2|laravel_sanctum_token_hash_here..."
  }
}
```

##### C. Profil Pengguna Sedang Login
- **URL**: `GET /api/auth/me`
- **Akses**: Terotentikasi (`auth:sanctum`)
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Data profil berhasil diambil.",
  "data": {
    "id": 2,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "phone_number": "081234567890",
    "role": "pelanggan",
    "created_at": "2026-11-05T18:00:00.000000Z"
  }
}
```

##### D. Logout
- **URL**: `POST /api/auth/logout`
- **Akses**: Terotentikasi (`auth:sanctum`)
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Sesi Anda telah diakhiri. Token berhasil dicabut.",
  "data": null
}
```

---

#### 2. Modul Publik (Katalog & Informasi)

##### A. Daftar Layanan Konveksi
- **URL**: `GET /api/layanan`
- **Akses**: Publik
- **Query Params**: `search` (opsional)
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Daftar layanan berhasil diambil.",
  "data": [
    {
      "id": 1,
      "nama_layanan": "Kaos & Polo Shirt",
      "deskripsi": "Pembuatan kaos oblong, raglan, dan polo shirt berkerah bordir/sablon berkualitas distro.",
      "bahan_rekomendasi": "Cotton Combed 24s/30s, Lacoste Pique CVC, Cotton Bamboo",
      "gambar_url": "http://127.0.0.1:8000/storage/layanan/kaos-polo.jpg"
    }
  ]
}
```

##### B. Detail Layanan Konveksi
- **URL**: `GET /api/layanan/{id}`
- **Akses**: Publik

##### C. Galeri Portofolio Produksi
- **URL**: `GET /api/portofolio`
- **Akses**: Publik
- **Query Params**: `kategori` (opsional: Kaos, Kemeja, Jaket, Rompi, Jersey)
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Daftar portofolio berhasil diambil.",
  "data": [
    {
      "id": 1,
      "judul": "Uniform PT Jaya Konstruksi",
      "kategori": "Kemeja",
      "jumlah_produksi": 450,
      "deskripsi_singkat": "Kemeja PDL lapangan bahan American Drill dengan bordir komputer presisi tinggi.",
      "gambar_url": "http://127.0.0.1:8000/storage/portofolio/pdl-jaya.jpg",
      "created_at": "2026-11-01T10:00:00.000000Z"
    }
  ]
}
```

---

#### 3. Modul Pelacakan Resi Publik (`/api/tracking`)

##### Lacak Progres Pesanan Berdasarkan Nomor Resi
- **URL**: `GET /api/tracking/{kode_resi}`
- **Akses**: Publik (dapat diakses siapa saja yang memiliki kode resi valid)
- **Contoh URL**: `GET /api/tracking/RG-2026-8812`
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Informasi pelacakan pesanan berhasil ditemukan.",
  "data": {
    "kode_resi": "RG-2026-8812",
    "pelanggan_nama": "Budi Santoso (Inisial B***)",
    "kategori_pakaian": "Kemeja & PDH",
    "jenis_bahan": "American Drill 1919",
    "warna_kain": "Navy Blue kombinasi Abu Terang",
    "total_pcs": 120,
    "rincian_ukuran": {
      "S": 20,
      "M": 40,
      "L": 40,
      "XL": 15,
      "XXL": 5
    },
    "status_pemesanan": "Sedang Dipotong & Dijahit",
    "status_step": 3,
    "alasan_batal": null,
    "file_desain_url": "http://127.0.0.1:8000/storage/mockups/rg-2026-8812.pdf",
    "tanggal_masuk": "2026-11-02 09:30:00",
    "terakhir_diperbarui": "2026-11-05 14:15:00",
    "timeline": [
      { "step": 1, "label": "Pesanan Diterima", "completed": true, "timestamp": "2026-11-02 09:30:00" },
      { "step": 2, "label": "Antrean Produksi", "completed": true, "timestamp": "2026-11-03 11:00:00" },
      { "step": 3, "label": "Sedang Dipotong & Dijahit", "completed": true, "timestamp": "2026-11-05 14:15:00" },
      { "step": 4, "label": "QC & Finishing", "completed": false, "timestamp": null },
      { "step": 5, "label": "Selesai", "completed": false, "timestamp": null }
    ]
  }
}
```
- **Respons Gagal (`HTTP 404 Not Found`)**:
```json
{
  "success": false,
  "message": "Pesanan dengan nomor resi tersebut tidak ditemukan dalam sistem kami.",
  "errors": null
}
```

---

#### 4. Modul Pemesanan Pelanggan (`/api/pemesanan`)

##### A. Buat Pesanan Baru (Pemesanan Online)
- **URL**: `POST /api/pemesanan`
- **Akses**: Terotentikasi (`auth:sanctum`, role: `pelanggan`)
- **Format Header**: `Content-Type: multipart/form-data`
- **Field Request**:
  - `kategori_pakaian` (string, wajib, min: 2)
  - `jenis_bahan` (string, wajib, min: 2)
  - `warna_kain` (string, wajib, min: 2)
  - `rincian_ukuran` (string JSON atau nested array, wajib: minimal 1 pcs, kunci: S, M, L, XL, XXL)
  - `catatan_pesanan` (string, opsional)
  - `file_desain` (file binary, wajib: max 10240 KB / 10MB, mime: jpeg, png, jpg, pdf, zip)
- **Respons Sukses (`HTTP 201 Created`)**:
```json
{
  "success": true,
  "message": "Pesanan Anda berhasil dikirim ke antrean produksi CV Ristrich Garment!",
  "data": {
    "id": 15,
    "kode_resi": "RG-2026-9042",
    "kategori_pakaian": "Kaos Polos Distro",
    "jenis_bahan": "Cotton Combed 30s Reaktif",
    "warna_kain": "Hitam Solid",
    "rincian_ukuran": { "S": 10, "M": 25, "L": 30, "XL": 15, "XXL": 0 },
    "total_pcs": 80,
    "catatan_pesanan": "Sablon plastisol warna emas di dada kiri dan punggung.",
    "file_desain_url": "http://127.0.0.1:8000/storage/mockups/rg-2026-9042-mockup.zip",
    "status_pemesanan": "Pesanan Diterima",
    "created_at": "2026-11-05T18:05:00.000000Z"
  }
}
```

##### B. Riwayat Pesanan Saya
- **URL**: `GET /api/pemesanan`
- **Akses**: Terotentikasi (`auth:sanctum`, role: `pelanggan`)
- **Query Params**: `status` (opsional), `page` (opsional)
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Daftar riwayat pesanan berhasil diambil.",
  "data": [
    {
      "id": 15,
      "kode_resi": "RG-2026-9042",
      "kategori_pakaian": "Kaos Polos Distro",
      "total_pcs": 80,
      "status_pemesanan": "Pesanan Diterima",
      "created_at": "2026-11-05T18:05:00.000000Z"
    }
  ]
}
```

##### C. Detail Pesanan Saya
- **URL**: `GET /api/pemesanan/{id}`
- **Akses**: Terotentikasi (`auth:sanctum`, role: `pelanggan`)

---

#### 5. Modul Admin (`/api/admin/*`)

Semua endpoint admin mewajibkan autentikasi Sanctum dan middleware `role:admin`.

##### A. Statistik Dashboard Admin
- **URL**: `GET /api/admin/dashboard`
- **Akses**: Admin
- **Respons Sukses (`HTTP 200 OK`)**:
```json
{
  "success": true,
  "message": "Data statistik dashboard berhasil diambil.",
  "data": {
    "total_pesanan": 142,
    "pesanan_aktif": 18,
    "pesanan_selesai": 119,
    "pesanan_batal": 5,
    "total_pcs_produksi": 12850,
    "total_pelanggan": 94,
    "status_breakdown": {
      "Pesanan Diterima": 4,
      "Antrean Produksi": 6,
      "Sedang Dipotong & Dijahit": 5,
      "QC & Finishing": 3,
      "Selesai": 119,
      "Dibatalkan": 5
    },
    "pesanan_terbaru": [
      {
        "id": 15,
        "kode_resi": "RG-2026-9042",
        "pelanggan": "Budi Santoso",
        "kategori_pakaian": "Kaos Polos Distro",
        "total_pcs": 80,
        "status_pemesanan": "Pesanan Diterima",
        "created_at": "2026-11-05 18:05:00"
      }
    ]
  }
}
```

##### B. Manajemen Pesanan Masuk (Admin)
- **URL**: `GET /api/admin/pesanan`
- **Query Params**: `search`, `status`, `page`, `per_page`
- **Respons Sukses (`HTTP 200 OK`)**: Daftar seluruh pesanan pelanggan beserta info kontak pemesan.

##### C. Update Status Produksi Pesanan
- **URL**: `PATCH /api/admin/pesanan/{id}/status`
- **Request Body (`application/json`)**:
```json
{
  "status_pemesanan": "Sedang Dipotong & Dijahit",
  "alasan_batal": null
}
```
*Catatan: Jika `status_pemesanan` diubah menjadi `'Dibatalkan'`, field `alasan_batal` wajib diisi minimal 5 karakter.*
Contoh payload pembatalan:
```json
{
  "status_pemesanan": "Dibatalkan",
  "alasan_batal": "Ketersediaan bahan warna Sage Green kosong dari pabrik supplier dan pelanggan memilih membatalkan."
}
```

##### D. Unduh File Mockup Desain
- **URL**: `GET /api/admin/pesanan/{id}/download-desain`
- **Respons**: Binary file download stream.

##### E. Manajemen Data Pelanggan
- **URL**: `GET /api/admin/pelanggan`
- **Akses**: Admin
- **Menampilkan**: Seluruh data pelanggan terdaftar, kontak HP/WA, dan agregasi total pemesanan.

##### F. Manajemen Konten (Layanan & Portofolio)
- `POST /api/admin/layanan` (Tambah layanan baru)
- `PUT/PATCH /api/admin/layanan/{id}` (Update layanan)
- `DELETE /api/admin/layanan/{id}` (Hapus layanan)
- `POST /api/admin/portofolio` (Tambah portofolio dengan upload foto hasil jadi)
- `DELETE /api/admin/portofolio/{id}` (Hapus portofolio)

