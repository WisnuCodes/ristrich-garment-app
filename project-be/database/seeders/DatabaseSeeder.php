<?php

namespace Database\Seeders;

use App\Models\Layanan;
use App\Models\Pemesanan;
use App\Models\Portofolio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Pastikan folder storage publik tersedia
        Storage::disk('public')->makeDirectory('layanan');
        Storage::disk('public')->makeDirectory('portofolio');
        Storage::disk('public')->makeDirectory('mockups');

        // Buat dummy mockup file jika belum ada
        if (!Storage::disk('public')->exists('mockups/sample_mockup.png')) {
            // 1x1 transparent PNG / placeholder
            $samplePng = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
            Storage::disk('public')->put('mockups/sample_mockup.png', $samplePng);
            Storage::disk('public')->put('layanan/kaos.png', $samplePng);
            Storage::disk('public')->put('layanan/polo.png', $samplePng);
            Storage::disk('public')->put('layanan/kemeja.png', $samplePng);
            Storage::disk('public')->put('layanan/jaket.png', $samplePng);
            Storage::disk('public')->put('layanan/rompi.png', $samplePng);
            Storage::disk('public')->put('layanan/jersey.png', $samplePng);
            Storage::disk('public')->put('portofolio/pdl1.png', $samplePng);
            Storage::disk('public')->put('portofolio/polo1.png', $samplePng);
            Storage::disk('public')->put('portofolio/kaos1.png', $samplePng);
            Storage::disk('public')->put('portofolio/jaket1.png', $samplePng);
        }

        // ==========================================
        // 1. SEED USERS (ADMIN & PELANGGAN)
        // ==========================================
        $admin = User::firstOrCreate(
            ['email' => 'admin@ristrich.com'],
            [
                'name'         => 'Administrator Workshop',
                'phone_number' => '081234567890',
                'password'     => Hash::make('password'),
                'role'         => 'admin',
            ]
        );

        $pelanggan1 = User::firstOrCreate(
            ['email' => 'pelanggan@example.com'],
            [
                'name'         => 'Budi Santoso',
                'phone_number' => '081399887766',
                'password'     => Hash::make('password'),
                'role'         => 'pelanggan',
            ]
        );

        $pelanggan2 = User::firstOrCreate(
            ['email' => 'siti@perusahaan.co.id'],
            [
                'name'         => 'Siti Rahmawati (PT Megah Abadi)',
                'phone_number' => '082155667788',
                'password'     => Hash::make('password'),
                'role'         => 'pelanggan',
            ]
        );

        $pelanggan3 = User::firstOrCreate(
            ['email' => 'fauzi@komunitas.org'],
            [
                'name'         => 'Ahmad Fauzi',
                'phone_number' => '085711223344',
                'password'     => Hash::make('password'),
                'role'         => 'pelanggan',
            ]
        );

        // ==========================================
        // 2. SEED LAYANAN KONVEKSI
        // ==========================================
        $layananList = [
            [
                'nama_layanan'      => 'Kemeja PDH & PDL Instansi',
                'deskripsi'         => 'Pembuatan kemeja dinas harian (PDH), kemeja dinas lapangan (PDL), kemeja tactical, seragam pabrik, dan kemeja korporat dengan pengerjaan presisi dan bordir komputer tajam.',
                'bahan_rekomendasi' => 'American Drill 1919, Nagata Drill Japan, Taipan Tropical, Castillo Drill',
                'gambar'            => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'nama_layanan'      => 'Kaos Oblong & Sablon Distro',
                'deskripsi'         => 'Produksi kaos katun premium standar distro distro lokal/ekspor. Pilihan sablon plastisol, discharge, rubber presisi tinggi, atau DTF full color.',
                'bahan_rekomendasi' => 'Cotton Combed 30s/24s Reaktif, Cotton Bamboo, Supima 40s',
                'gambar'            => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'nama_layanan'      => 'Polo Shirt Bordir Komputer',
                'deskripsi'         => 'Kaos polo berkerah elegan untuk seragam kantor semi-formal, event gathering, atau seragam tim sales. Jahitan rantai kuat dan kerah tidak mudah mengkerut.',
                'bahan_rekomendasi' => 'Lacoste Pique CVC 24s, Lacoste Katun 100%, Katun Honeycomb',
                'gambar'            => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'nama_layanan'      => 'Jaket Bomber, Parka & Hoodie',
                'deskripsi'         => 'Konveksi berbagai varian outer: hoodie zipper/pullover, varsity, bomber militer, hingga jaket parka waterproof tebal berfuring polar hangat.',
                'bahan_rekomendasi' => 'Cotton Fleece Tebal 280-330gsm, Taslan Balon Milky, Baby Terry Premium',
                'gambar'            => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'nama_layanan'      => 'Rompi Safety Lapangan & Wearpack',
                'deskripsi'         => 'Perlengkapan seragam kerja lapangan K3, rompi komunitas bermulti-saku, wearpack coverall tambang bersertifikasi scotlite reflektif 3M menyala di kegelapan.',
                'bahan_rekomendasi' => 'Ribstop Tornado, Drill Heavy Weight, Parasut Ripstop dengan Furing Mesh',
                'gambar'            => 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'nama_layanan'      => 'Jersey Printing Sublimasi Custom',
                'deskripsi'         => 'Jersey olahraga untuk futsal, sepakbola, sepeda (roadbike/MTB), e-sport, dan running dengan teknik full printing sublimasi warna anti luntur.',
                'bahan_rekomendasi' => 'Dryfit Milano, Dryfit Brazil, Serena Premium, Waffle Hexagon',
                'gambar'            => 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($layananList as $item) {
            Layanan::firstOrCreate(['nama_layanan' => $item['nama_layanan']], $item);
        }

        // ==========================================
        // 3. SEED PORTOFOLIO PRODUKSI
        // ==========================================
        $portofolioList = [
            [
                'judul'             => 'Kemeja PDL Lapangan PT Krakatau Steel',
                'kategori'          => 'Kemeja',
                'jumlah_produksi'   => 450,
                'deskripsi_singkat' => 'Seragam kemeja kerja lapangan bahan American Drill tebal warna Navy Blue kombinasi ventilasi jaring punggung dan bordir logo presisi.',
                'gambar'            => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'judul'             => 'Polo Shirt Gathering BUMN Telkom',
                'kategori'          => 'Polo Shirt',
                'jumlah_produksi'   => 850,
                'deskripsi_singkat' => 'Polo shirt seragam gathering nasional bahan Lacoste Pique CVC warna merah marun dengan variasi list putih di kerah dan manset.',
                'gambar'            => 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'judul'             => 'Kaos Merchandise Sound of Java Festival',
                'kategori'          => 'Kaos',
                'jumlah_produksi'   => 1200,
                'deskripsi_singkat' => 'Kaos festival musik bahan Cotton Combed 24s warna hitam pekat dengan sablon discharge bertekstur lembut menyatu dengan kain.',
                'gambar'            => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'judul'             => 'Jaket Hoodie Angkatan Fakultas Teknik UI',
                'kategori'          => 'Jaket',
                'jumlah_produksi'   => 320,
                'deskripsi_singkat' => 'Hoodie zipper angkatan bahan Cotton Fleece tebal 300gsm warna Charcoal Grey dengan bordir dada dan aplikasi sablon plastisol punggung.',
                'gambar'            => 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'judul'             => 'Rompi Safety Surveyor Proyek MRT Fase 2',
                'kategori'          => 'Rompi',
                'jumlah_produksi'   => 180,
                'deskripsi_singkat' => 'Rompi lapangan K3 warna High-Visibility Orange bahan Ripstop tahan robek dilengkapi pita scotchlite silver 3M 5cm dan 6 saku resleting.',
                'gambar'            => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'judul'             => 'Jersey Sublim Tim Futsal Juara Regional',
                'kategori'          => 'Jersey',
                'jumlah_produksi'   => 45,
                'deskripsi_singkat' => 'Setelan jersey full sublim bahan Dryfit Milano dengan gradasi gradien warna futuristik, nomor punggung, dan kerah v-neck elastis.',
                'gambar'            => 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($portofolioList as $item) {
            Portofolio::firstOrCreate(['judul' => $item['judul']], $item);
        }

        // ==========================================
        // 4. SEED SAMPLE PEMESANAN (ALUR TRACKING REALISTIK)
        // ==========================================
        $sampleOrders = [
            [
                'kode_resi'        => 'RG-2026-8812',
                'user_id'          => $pelanggan1->id,
                'kategori_pakaian' => 'Kemeja PDH & PDL Instansi',
                'jenis_bahan'      => 'American Drill 1919',
                'warna_kain'       => 'Navy Blue kombinasi Abu Terang',
                'rincian_ukuran'   => ['S' => 15, 'M' => 35, 'L' => 45, 'XL' => 20, 'XXL' => 5],
                'total_pcs'        => 120,
                'file_desain'      => 'mockups/sample_mockup.png',
                'catatan_pesanan'  => 'Bordir komputer logo instansi di dada kiri, bendera merah putih di lengan kanan.',
                'status_pemesanan' => 'Sedang Dipotong & Dijahit',
                'alasan_batal'     => null,
                'created_at'       => now()->subDays(4),
            ],
            [
                'kode_resi'        => 'RG-2026-1049',
                'user_id'          => $pelanggan1->id,
                'kategori_pakaian' => 'Kaos Oblong & Sablon Distro',
                'jenis_bahan'      => 'Cotton Combed 30s Reaktif',
                'warna_kain'       => 'Hitam Reaktif Solid',
                'rincian_ukuran'   => ['S' => 10, 'M' => 20, 'L' => 30, 'XL' => 15, 'XXL' => 0],
                'total_pcs'        => 75,
                'file_desain'      => 'mockups/sample_mockup.png',
                'catatan_pesanan'  => 'Sablon manual plastisol warna Gold di punggung.',
                'status_pemesanan' => 'Pesanan Diterima',
                'alasan_batal'     => null,
                'created_at'       => now()->subHours(8),
            ],
            [
                'kode_resi'        => 'RG-2026-2201',
                'user_id'          => $pelanggan2->id,
                'kategori_pakaian' => 'Polo Shirt Bordir Komputer',
                'jenis_bahan'      => 'Lacoste Pique CVC 24s',
                'warna_kain'       => 'Merah Maroon Solid',
                'rincian_ukuran'   => ['S' => 25, 'M' => 60, 'L' => 80, 'XL' => 30, 'XXL' => 5],
                'total_pcs'        => 200,
                'file_desain'      => 'mockups/sample_mockup.png',
                'catatan_pesanan'  => 'Bordir dada kiri dan punggung. Packing plastik satu-satu.',
                'status_pemesanan' => 'Antrean Produksi',
                'alasan_batal'     => null,
                'created_at'       => now()->subDays(2),
            ],
            [
                'kode_resi'        => 'RG-2026-3390',
                'user_id'          => $pelanggan2->id,
                'kategori_pakaian' => 'Jaket Bomber, Parka & Hoodie',
                'jenis_bahan'      => 'Cotton Fleece Tebal 300gsm',
                'warna_kain'       => 'Dark Grey Melange',
                'rincian_ukuran'   => ['S' => 10, 'M' => 25, 'L' => 35, 'XL' => 15, 'XXL' => 5],
                'total_pcs'        => 90,
                'file_desain'      => 'mockups/sample_mockup.png',
                'catatan_pesanan'  => 'Resleting besi YKK bakar antique brass, furing katun hero adem.',
                'status_pemesanan' => 'QC & Finishing',
                'alasan_batal'     => null,
                'created_at'       => now()->subDays(6),
            ],
            [
                'kode_resi'        => 'RG-2026-5510',
                'user_id'          => $pelanggan3->id,
                'kategori_pakaian' => 'Rompi Safety Lapangan & Wearpack',
                'jenis_bahan'      => 'Ribstop Tornado Water Repellent',
                'warna_kain'       => 'Hi-Vis Orange',
                'rincian_ukuran'   => ['S' => 10, 'M' => 20, 'L' => 20, 'XL' => 0, 'XXL' => 0],
                'total_pcs'        => 50,
                'file_desain'      => 'mockups/sample_mockup.png',
                'catatan_pesanan'  => 'Scotchlite 3M original 2 tingkat.',
                'status_pemesanan' => 'Selesai',
                'alasan_batal'     => null,
                'created_at'       => now()->subDays(12),
            ],
            [
                'kode_resi'        => 'RG-2026-9901',
                'user_id'          => $pelanggan3->id,
                'kategori_pakaian' => 'Kemeja PDH & PDL Instansi',
                'jenis_bahan'      => 'Taipan Tropical',
                'warna_kain'       => 'Sage Green Khusus',
                'rincian_ukuran'   => ['S' => 5, 'M' => 10, 'L' => 15, 'XL' => 5, 'XXL' => 0],
                'total_pcs'        => 35,
                'file_desain'      => 'mockups/sample_mockup.png',
                'catatan_pesanan'  => 'Warna Sage Green.',
                'status_pemesanan' => 'Dibatalkan',
                'alasan_batal'     => 'Ketersediaan bahan warna Sage Green kosong dari pabrik supplier kain dan pemesan memilih membatalkan pesanan.',
                'created_at'       => now()->subDays(8),
            ],
        ];

        foreach ($sampleOrders as $orderData) {
            Pemesanan::firstOrCreate(
                ['kode_resi' => $orderData['kode_resi']],
                $orderData
            );
        }
    }
}
