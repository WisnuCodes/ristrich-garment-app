<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortofolioResource;
use App\Models\Portofolio;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortofolioController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tampilkan galeri portofolio hasil produksi.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Portofolio::query();

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('deskripsi_singkat', 'like', "%{$search}%");
            });
        }

        $portofolio = $query->latest()->get();

        return $this->successResponse(
            PortofolioResource::collection($portofolio),
            'Daftar portofolio hasil produksi berhasil diambil.'
        );
    }

    /**
     * Tampilkan detail portofolio.
     */
    public function show(int $id): JsonResponse
    {
        $portofolio = Portofolio::find($id);

        if (!$portofolio) {
            return $this->errorResponse('Portofolio tidak ditemukan.', 404);
        }

        return $this->successResponse(
            new PortofolioResource($portofolio),
            'Detail portofolio berhasil diambil.'
        );
    }
}

