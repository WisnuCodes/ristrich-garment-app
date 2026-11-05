<?php

namespace Tests\Feature;

use App\Models\Pemesanan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PemesananApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_order_with_valid_data_and_file(): void
    {
        Storage::fake('public');

        $customer = User::factory()->create(['role' => 'pelanggan']);
        $token = $customer->createToken('token')->plainTextToken;

        $file = UploadedFile::fake()->create('mockup_baju.pdf', 1024, 'application/pdf');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/pemesanan', [
                'kategori_pakaian' => 'Kaos Polos Distro',
                'jenis_bahan'      => 'Cotton Combed 30s',
                'warna_kain'       => 'Hitam Reaktif',
                'rincian_ukuran'   => [
                    'S'   => 10,
                    'M'   => 20,
                    'L'   => 30,
                    'XL'  => 10,
                    'XXL' => 0,
                ],
                'catatan_pesanan'  => 'Sablon rubber putih di punggung.',
                'file_desain'      => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'kategori_pakaian' => 'Kaos Polos Distro',
                    'total_pcs'        => 70,
                    'status_pemesanan' => 'Pesanan Diterima',
                ]
            ]);

        $this->assertDatabaseHas('pemesanan', [
            'user_id'          => $customer->id,
            'kategori_pakaian' => 'Kaos Polos Distro',
            'total_pcs'        => 70,
        ]);

        $order = Pemesanan::first();
        $this->assertMatchesRegularExpression('/^RG-\d{4}-\d{4}$/', $order->kode_resi);
        Storage::disk('public')->assertExists($order->file_desain);
    }

    public function test_create_order_fails_if_total_pcs_is_zero(): void
    {
        Storage::fake('public');

        $customer = User::factory()->create(['role' => 'pelanggan']);
        $token = $customer->createToken('token')->plainTextToken;

        $file = UploadedFile::fake()->create('mockup.png', 500, 'image/png');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/pemesanan', [
                'kategori_pakaian' => 'Kaos Polos Distro',
                'jenis_bahan'      => 'Cotton Combed 30s',
                'warna_kain'       => 'Hitam Reaktif',
                'rincian_ukuran'   => [
                    'S'   => 0,
                    'M'   => 0,
                    'L'   => 0,
                    'XL'  => 0,
                    'XXL' => 0,
                ],
                'file_desain'      => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rincian_ukuran']);
    }

    public function test_customer_can_only_view_their_own_orders(): void
    {
        $customer1 = User::factory()->create(['role' => 'pelanggan']);
        $customer2 = User::factory()->create(['role' => 'pelanggan']);

        $token1 = $customer1->createToken('token1')->plainTextToken;

        // Order milik customer 1
        Pemesanan::create([
            'kode_resi'        => 'RG-2026-1111',
            'user_id'          => $customer1->id,
            'kategori_pakaian' => 'Kemeja PDH',
            'jenis_bahan'      => 'American Drill',
            'warna_kain'       => 'Hitam',
            'rincian_ukuran'   => ['S' => 10, 'M' => 0, 'L' => 0, 'XL' => 0, 'XXL' => 0],
            'total_pcs'        => 10,
            'file_desain'      => 'mockups/1.pdf',
            'status_pemesanan' => 'Pesanan Diterima',
        ]);

        // Order milik customer 2
        $order2 = Pemesanan::create([
            'kode_resi'        => 'RG-2026-2222',
            'user_id'          => $customer2->id,
            'kategori_pakaian' => 'Polo Shirt',
            'jenis_bahan'      => 'Lacoste Pique',
            'warna_kain'       => 'Merah',
            'rincian_ukuran'   => ['S' => 20, 'M' => 0, 'L' => 0, 'XL' => 0, 'XXL' => 0],
            'total_pcs'        => 20,
            'file_desain'      => 'mockups/2.pdf',
            'status_pemesanan' => 'Antrean Produksi',
        ]);

        // Customer 1 request index
        $indexResponse = $this->withHeader('Authorization', "Bearer {$token1}")
            ->getJson('/api/pemesanan');

        $indexResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.kode_resi', 'RG-2026-1111');

        // Customer 1 tries to view order 2
        $showResponse = $this->withHeader('Authorization', "Bearer {$token1}")
            ->getJson("/api/pemesanan/{$order2->id}");

        $showResponse->assertStatus(404);
    }
}

