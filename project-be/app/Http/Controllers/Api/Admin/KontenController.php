<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Konten\StorePortofolioRequest;
use App\Http\Resources\LayananResource;
use App\Http\Resources\PortofolioResource;
use App\Models\Layanan;
use App\Models\Portofolio;
use App\Traits\ApiResponseTrait;
use App\Traits\FileUploadTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KontenController extends Controller
{
    use ApiResponseTrait, FileUploadTrait;

    // ==========================================
    // PORTOFOLIO MANAGEMENT
    // ==========================================

    /**
     * Tambah data portofolio baru.
     */
    public function storePortofolio(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul'             => ['required', 'string', 'max:255'],
            'kategori'          => ['required', 'string', 'max:100'],
            'jumlah_produksi'   => ['required', 'integer', 'min:1'],
            'klien'             => ['nullable', 'string', 'max:255'],
            'teknik_identitas'  => ['nullable', 'string', 'max:255'],
            'bahan_terpakai'    => ['nullable', 'string', 'max:255'],
            'deskripsi_singkat' => ['required', 'string'],
            'gambar'            => ['required', 'image', 'max:5120'],
        ]);

        $filePath = $this->uploadFile($request->file('gambar'), 'portofolio');

        $portofolio = Portofolio::create([
            'judul'             => $validated['judul'],
            'kategori'          => $validated['kategori'],
            'jumlah_produksi'   => $validated['jumlah_produksi'],
            'klien'             => $validated['klien'] ?? null,
            'teknik_identitas'  => $validated['teknik_identitas'] ?? 'Bordir Komputer Tajima',
            'bahan_terpakai'    => $validated['bahan_terpakai'] ?? null,
            'deskripsi_singkat' => $validated['deskripsi_singkat'],
            'gambar'            => $filePath,
        ]);

        return $this->successResponse(
            new PortofolioResource($portofolio),
            'Portofolio hasil produksi berhasil ditambahkan ke katalog.',
            201
        );
    }

    /**
     * Perbarui data portofolio.
     */
    public function updatePortofolio(Request $request, int $id): JsonResponse
    {
        $portofolio = Portofolio::find($id);

        if (!$portofolio) {
            return $this->errorResponse('Data portofolio tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'judul'             => ['sometimes', 'required', 'string', 'max:255'],
            'kategori'          => ['sometimes', 'required', 'string', 'max:100'],
            'jumlah_produksi'   => ['sometimes', 'required', 'integer', 'min:1'],
            'klien'             => ['nullable', 'string', 'max:255'],
            'teknik_identitas'  => ['nullable', 'string', 'max:255'],
            'bahan_terpakai'    => ['nullable', 'string', 'max:255'],
            'deskripsi_singkat' => ['sometimes', 'required', 'string'],
            'gambar'            => ['nullable', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('gambar')) {
            $this->deleteFile($portofolio->gambar);
            $validated['gambar'] = $this->uploadFile($request->file('gambar'), 'portofolio');
        }

        $portofolio->update($validated);

        return $this->successResponse(
            new PortofolioResource($portofolio),
            'Data portofolio berhasil diperbarui.'
        );
    }

    /**
     * Hapus data portofolio.
     */
    public function destroyPortofolio(int $id): JsonResponse
    {
        $portofolio = Portofolio::find($id);

        if (!$portofolio) {
            return $this->errorResponse('Data portofolio tidak ditemukan.', 404);
        }

        $this->deleteFile($portofolio->gambar);
        $portofolio->delete();

        return $this->successResponse(null, 'Portofolio berhasil dihapus.');
    }

    // ==========================================
    // LAYANAN MANAGEMENT
    // ==========================================

    /**
     * Tambah data layanan konveksi baru.
     */
    public function storeLayanan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_layanan'      => ['required', 'string', 'max:255'],
            'deskripsi'         => ['required', 'string'],
            'bahan_rekomendasi' => ['required', 'string', 'max:255'],
            'minimal_order'     => ['nullable', 'integer', 'min:1'],
            'estimasi_hari'     => ['nullable', 'integer', 'min:1'],
            'standar_mesin'     => ['nullable', 'string', 'max:255'],
            'toleransi_qc'      => ['nullable', 'string', 'max:255'],
            'gambar'            => ['required', 'image', 'max:5120'],
        ], [
            'nama_layanan.required'      => 'Nama layanan wajib diisi.',
            'deskripsi.required'         => 'Deskripsi spesifikasi layanan wajib diisi.',
            'bahan_rekomendasi.required' => 'Rekomendasi bahan kain wajib diisi.',
            'gambar.required'            => 'Foto banner layanan wajib diunggah.',
            'gambar.image'               => 'File banner harus berupa format gambar valid.',
        ]);

        $filePath = $this->uploadFile($request->file('gambar'), 'layanan');

        $layanan = Layanan::create([
            'nama_layanan'      => $validated['nama_layanan'],
            'deskripsi'         => $validated['deskripsi'],
            'bahan_rekomendasi' => $validated['bahan_rekomendasi'],
            'minimal_order'     => $validated['minimal_order'] ?? 24,
            'estimasi_hari'     => $validated['estimasi_hari'] ?? 14,
            'standar_mesin'     => $validated['standar_mesin'] ?? 'Bordir Komputer Tajima & Juki Jarum 2',
            'toleransi_qc'      => $validated['toleransi_qc'] ?? '±0.5 cm CAD Optitex',
            'gambar'            => $filePath,
        ]);

        return $this->successResponse(
            new LayananResource($layanan),
            'Layanan baru berhasil ditambahkan ke katalog.',
            201
        );
    }

    /**
     * Update data layanan konveksi.
     */
    public function updateLayanan(Request $request, int $id): JsonResponse
    {
        $layanan = Layanan::find($id);

        if (!$layanan) {
            return $this->errorResponse('Layanan tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'nama_layanan'      => ['sometimes', 'required', 'string', 'max:255'],
            'deskripsi'         => ['sometimes', 'required', 'string'],
            'bahan_rekomendasi' => ['sometimes', 'required', 'string', 'max:255'],
            'minimal_order'     => ['nullable', 'integer', 'min:1'],
            'estimasi_hari'     => ['nullable', 'integer', 'min:1'],
            'standar_mesin'     => ['nullable', 'string', 'max:255'],
            'toleransi_qc'      => ['nullable', 'string', 'max:255'],
            'gambar'            => ['nullable', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('gambar')) {
            $this->deleteFile($layanan->gambar);
            $validated['gambar'] = $this->uploadFile($request->file('gambar'), 'layanan');
        }

        $layanan->update($validated);

        return $this->successResponse(
            new LayananResource($layanan),
            'Data layanan berhasil diperbarui.'
        );
    }

    /**
     * Hapus data layanan konveksi.
     */
    public function destroyLayanan(int $id): JsonResponse
    {
        $layanan = Layanan::find($id);

        if (!$layanan) {
            return $this->errorResponse('Layanan tidak ditemukan.', 404);
        }

        $this->deleteFile($layanan->gambar);
        $layanan->delete();

        return $this->successResponse(null, 'Layanan berhasil dihapus dari katalog.');
    }
}

