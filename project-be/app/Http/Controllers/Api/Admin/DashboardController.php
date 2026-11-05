<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PesananResource;
use App\Models\Pemesanan;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    /**
     * Dapatkan data ringkasan metrik statistik untuk dashboard admin.
     */
    public function index(): JsonResponse
    {
        $totalPesanan = Pemesanan::count();
        $pesananAktif = Pemesanan::whereIn('status_pemesanan', [
            'Pesanan Diterima',
            'Antrean Produksi',
            'Sedang Dipotong & Dijahit',
            'QC & Finishing'
        ])->count();
        $pesananSelesai = Pemesanan::where('status_pemesanan', 'Selesai')->count();
        $pesananBatal = Pemesanan::where('status_pemesanan', 'Dibatalkan')->count();

        $totalPcsProduksi = (int) Pemesanan::where('status_pemesanan', '!=', 'Dibatalkan')
            ->sum('total_pcs');

        $totalPelanggan = User::where('role', 'pelanggan')->count();

        // Status breakdown
        $statuses = [
            'Pesanan Diterima'          => 0,
            'Antrean Produksi'          => 0,
            'Sedang Dipotong & Dijahit' => 0,
            'QC & Finishing'            => 0,
            'Selesai'                   => 0,
            'Dibatalkan'                => 0,
        ];

        $countsByStatus = Pemesanan::selectRaw('status_pemesanan, count(*) as count')
            ->groupBy('status_pemesanan')
            ->pluck('count', 'status_pemesanan')
            ->toArray();

        foreach ($statuses as $status => $val) {
            $statuses[$status] = $countsByStatus[$status] ?? 0;
        }

        // Pesanan terbaru
        $recentOrders = Pemesanan::with('user')
            ->latest()
            ->take(6)
            ->get();

        return $this->successResponse([
            'total_pesanan'      => $totalPesanan,
            'pesanan_aktif'      => $pesananAktif,
            'pesanan_selesai'    => $pesananSelesai,
            'pesanan_batal'      => $pesananBatal,
            'total_pcs_produksi' => $totalPcsProduksi,
            'total_pelanggan'    => $totalPelanggan,
            'status_breakdown'   => $statuses,
            'pesanan_terbaru'    => PesananResource::collection($recentOrders),
        ], 'Data ringkasan statistik dashboard berhasil diambil.');
    }
}

