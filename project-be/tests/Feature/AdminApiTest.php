<?php

namespace Tests\Feature;

use App\Models\Layanan;
use App\Models\Pemesanan;
use App\Models\Portofolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_admin_endpoints(): void
    {
        $customer = User::factory()->create(['role' => 'pelanggan']);
        $token = $customer->createToken('token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_admin_can_access_dashboard_metrics(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('token')->plainTextToken;

        $customer = User::factory()->create(['role' => 'pelanggan']);

        Pemesanan::create([
            'kode_resi'        => 'RG-2026-1001',
            'user_id'          => $customer->id,
            'kategori_pakaian' => 'Kemeja PDH',
            'jenis_bahan'      => 'American Drill',
            'warna_kain'       => 'Biru',
            'rincian_ukuran'   => ['S' => 50, 'M' => 0, 'L' => 0, 'XL' => 0, 'XXL' => 0],
            'total_pcs'        => 50,
            'file_desain'      => 'mockups/1.pdf',
            'status_pemesanan' => 'Antrean Produksi',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_pesanan'      => 1,
                    'pesanan_aktif'      => 1,
                    'total_pcs_produksi' => 50,
                    'total_pelanggan'    => 1,
                ]
            ]);
    }

    public function test_admin_can_update_order_status_to_production(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('token')->plainTextToken;
        $customer = User::factory()->create(['role' => 'pelanggan']);

        $pesanan = Pemesanan::create([
            'kode_resi'        => 'RG-2026-1002',
            'user_id'          => $customer->id,
            'kategori_pakaian' => 'Polo Shirt',
            'jenis_bahan'      => 'Lacoste Pique',
            'warna_kain'       => 'Hitam',
            'rincian_ukuran'   => ['S' => 25, 'M' => 0, 'L' => 0, 'XL' => 0, 'XXL' => 0],
            'total_pcs'        => 25,
            'file_desain'      => 'mockups/2.png',
            'status_pemesanan' => 'Pesanan Diterima',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/admin/pesanan/{$pesanan->id}/status", [
                'status_pemesanan' => 'Sedang Dipotong & Dijahit',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status_pemesanan', 'Sedang Dipotong & Dijahit')
            ->assertJsonPath('data.status_step', 3);

        $this->assertEquals('Sedang Dipotong & Dijahit', $pesanan->fresh()->status_pemesanan);
    }

    public function test_cancelling_order_requires_alasan_batal(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('token')->plainTextToken;
        $customer = User::factory()->create(['role' => 'pelanggan']);

        $pesanan = Pemesanan::create([
            'kode_resi'        => 'RG-2026-1003',
            'user_id'          => $customer->id,
            'kategori_pakaian' => 'Jaket Hoodie',
            'jenis_bahan'      => 'Fleece',
            'warna_kain'       => 'Navy',
            'rincian_ukuran'   => ['S' => 10, 'M' => 0, 'L' => 0, 'XL' => 0, 'XXL' => 0],
            'total_pcs'        => 10,
            'file_desain'      => 'mockups/3.png',
            'status_pemesanan' => 'Pesanan Diterima',
        ]);

        // Attempt cancel without reason
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/admin/pesanan/{$pesanan->id}/status", [
                'status_pemesanan' => 'Dibatalkan',
                'alasan_batal'     => null,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['alasan_batal']);

        // Attempt cancel with valid reason
        $successResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/admin/pesanan/{$pesanan->id}/status", [
                'status_pemesanan' => 'Dibatalkan',
                'alasan_batal'     => 'Ketersediaan bahan habis di supplier pabrik.',
            ]);

        $successResponse->assertStatus(200)
            ->assertJsonPath('data.status_pemesanan', 'Dibatalkan')
            ->assertJsonPath('data.alasan_batal', 'Ketersediaan bahan habis di supplier pabrik.');
    }

    public function test_admin_can_manage_portofolio_and_layanan(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('token')->plainTextToken;

        $image = UploadedFile::fake()->image('portofolio.jpg');

        // Store Portofolio
        $portoResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/portofolio', [
                'judul'             => 'Seragam Lapangan Telkomsel',
                'kategori'          => 'Kemeja',
                'jumlah_produksi'   => 500,
                'deskripsi_singkat' => 'Bordir presisi komputer',
                'gambar'            => $image,
            ]);

        $portoResponse->assertStatus(201)
            ->assertJsonPath('data.judul', 'Seragam Lapangan Telkomsel');

        $portoId = $portoResponse->json('data.id');

        // Delete Portofolio
        $deletePorto = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/admin/portofolio/{$portoId}");

        $deletePorto->assertStatus(200);
        $this->assertDatabaseMissing('portofolio', ['id' => $portoId]);
    }
}

