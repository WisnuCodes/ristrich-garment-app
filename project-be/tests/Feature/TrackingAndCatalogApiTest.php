<?php

namespace Tests\Feature;

use App\Models\Layanan;
use App\Models\Pemesanan;
use App\Models\Portofolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrackingAndCatalogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_layanan_katalog(): void
    {
        Layanan::create([
            'nama_layanan'      => 'Kemeja PDH Instansi',
            'deskripsi'         => 'Kemeja dinas harian berstandar',
            'bahan_rekomendasi' => 'American Drill',
            'gambar'            => 'layanan/kemeja.jpg',
        ]);

        $response = $this->getJson('/api/layanan');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nama_layanan', 'Kemeja PDH Instansi');
    }

    public function test_can_list_portofolio_and_filter_by_kategori(): void
    {
        Portofolio::create([
            'judul'             => 'Kemeja PT Maju',
            'kategori'          => 'Kemeja',
            'jumlah_produksi'   => 150,
            'deskripsi_singkat' => 'Bordir rapi',
            'gambar'            => 'portofolio/1.jpg',
        ]);

        Portofolio::create([
            'judul'             => 'Kaos Komunitas Motor',
            'kategori'          => 'Kaos',
            'jumlah_produksi'   => 200,
            'deskripsi_singkat' => 'Sablon plastisol',
            'gambar'            => 'portofolio/2.jpg',
        ]);

        // Filter by Kategori 'Kaos'
        $response = $this->getJson('/api/portofolio?kategori=Kaos');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.kategori', 'Kaos');
    }

    public function test_public_tracking_returns_order_stepper_and_details(): void
    {
        $customer = User::factory()->create([
            'name' => 'Budi Santoso',
            'role' => 'pelanggan',
        ]);

        $pesanan = Pemesanan::create([
            'kode_resi'        => 'RG-2026-8812',
            'user_id'          => $customer->id,
            'kategori_pakaian' => 'Kemeja PDH',
            'jenis_bahan'      => 'American Drill',
            'warna_kain'       => 'Navy Blue',
            'rincian_ukuran'   => ['S' => 10, 'M' => 20, 'L' => 30, 'XL' => 0, 'XXL' => 0],
            'total_pcs'        => 60,
            'file_desain'      => 'mockups/test.png',
            'catatan_pesanan'  => 'Bordir dada kiri',
            'status_pemesanan' => 'Sedang Dipotong & Dijahit',
        ]);

        $response = $this->getJson('/api/tracking/RG-2026-8812');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'kode_resi'        => 'RG-2026-8812',
                    'pelanggan_nama'   => 'Budi S***',
                    'status_pemesanan' => 'Sedang Dipotong & Dijahit',
                    'status_step'      => 3,
                    'total_pcs'        => 60,
                ]
            ])
            ->assertJsonStructure([
                'data' => ['timeline']
            ]);
    }

    public function test_public_tracking_returns_404_for_unknown_resi(): void
    {
        $response = $this->getJson('/api/tracking/RG-9999-0000');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }
}

