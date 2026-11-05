<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LayananResource;
use App\Models\Layanan;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LayananController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tampilkan seluruh daftar layanan konveksi busana.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Layanan::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_layanan', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhere('bahan_rekomendasi', 'like', "%{$search}%");
            });
        }

        $layanan = $query->latest()->get();

        return $this->successResponse(
            LayananResource::collection($layanan),
            'Daftar katalog layanan berhasil diambil.'
        );
    }

    /**
     * Tampilkan detail satu layanan.
     */
    public function show(int $id): JsonResponse
    {
        $layanan = Layanan::find($id);

        if (!$layanan) {
            return $this->errorResponse('Layanan tidak ditemukan.', 404);
        }

        return $this->successResponse(
            new LayananResource($layanan),
            'Detail layanan berhasil diambil.'
        );
    }
}

