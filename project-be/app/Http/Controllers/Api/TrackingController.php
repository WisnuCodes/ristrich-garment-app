<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrackingResource;
use App\Models\Pemesanan;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class TrackingController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lacak progres pengerjaan pesanan berdasarkan kode resi unik (Publik).
     */
    public function track(string $kode_resi): JsonResponse
    {
        $kodeResiClean = trim(strtoupper($kode_resi));

        $pesanan = Pemesanan::with('user')
            ->where('kode_resi', $kodeResiClean)
            ->first();

        if (!$pesanan) {
            return $this->errorResponse(
                "Pesanan dengan nomor resi '{$kodeResiClean}' tidak ditemukan dalam sistem kami. Pastikan format penulisan benar (contoh: RG-2026-8812).",
                404
            );
        }

        return $this->successResponse(
            new TrackingResource($pesanan),
            'Informasi pelacakan pesanan berhasil ditemukan.'
        );
    }
}

