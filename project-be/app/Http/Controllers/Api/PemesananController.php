<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pesanan\StorePesananRequest;
use App\Http\Resources\PesananResource;
use App\Models\Pemesanan;
use App\Traits\ApiResponseTrait;
use App\Traits\FileUploadTrait;
use App\Traits\ResiGeneratorTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PemesananController extends Controller
{
    use ApiResponseTrait, FileUploadTrait, ResiGeneratorTrait;

    /**
     * Tampilkan riwayat pesanan pelanggan yang sedang login.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = $user->pemesanan()->latest();

        if ($request->filled('status')) {
            $query->where('status_pemesanan', $request->status);
        }

        $pesanan = $query->get();

        return $this->successResponse(
            PesananResource::collection($pesanan),
            'Riwayat pesanan Anda berhasil diambil.'
        );
    }

    /**
     * Buat pemesanan baru dari pelanggan.
     */
    public function store(StorePesananRequest $request): JsonResponse
    {
        $user = $request->user();

        // 1. Generate kode resi unik
        $kodeResi = $this->generateKodeResi();

        // 2. Upload file desain mockup
        $filePath = $this->uploadFile($request->file('file_desain'), 'mockups');

        // 3. Hitung total pcs
        $sizes = $request->input('rincian_ukuran', []);
        $totalPcs = (int)($sizes['S'] ?? 0)
            + (int)($sizes['M'] ?? 0)
            + (int)($sizes['L'] ?? 0)
            + (int)($sizes['XL'] ?? 0)
            + (int)($sizes['XXL'] ?? 0);

        // 4. Simpan pesanan
        $pesanan = Pemesanan::create([
            'kode_resi'        => $kodeResi,
            'user_id'          => $user->id,
            'kategori_pakaian' => $request->kategori_pakaian,
            'jenis_bahan'      => $request->jenis_bahan,
            'warna_kain'       => $request->warna_kain,
            'rincian_ukuran'   => [
                'S'   => (int)($sizes['S'] ?? 0),
                'M'   => (int)($sizes['M'] ?? 0),
                'L'   => (int)($sizes['L'] ?? 0),
                'XL'  => (int)($sizes['XL'] ?? 0),
                'XXL' => (int)($sizes['XXL'] ?? 0),
            ],
            'total_pcs'        => $totalPcs,
            'file_desain'      => $filePath,
            'catatan_pesanan'  => $request->catatan_pesanan,
            'status_pemesanan' => 'Pesanan Diterima',
            'alasan_batal'     => null,
        ]);

        return $this->successResponse(
            new PesananResource($pesanan),
            'Pesanan Anda berhasil dikirim ke antrean produksi CV Ristrich Garment!',
            201
        );
    }

    /**
     * Tampilkan detail pesanan pelanggan.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $pesanan = $user->pemesanan()->find($id);

        if (!$pesanan) {
            return $this->errorResponse('Pesanan tidak ditemukan atau bukan milik Anda.', 404);
        }

        return $this->successResponse(
            new PesananResource($pesanan),
            'Detail pesanan berhasil diambil.'
        );
    }
}

