<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pesanan\UpdateStatusPesananRequest;
use App\Http\Resources\PesananResource;
use App\Models\Pemesanan;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PesananMasukController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tampilkan seluruh daftar pesanan masuk untuk workshop.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pemesanan::with('user')->latest();

        // Filter status
        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status_pemesanan', $request->status);
        }

        // Pencarian berdasarkan resi, nama pelanggan, kategori, atau bahan
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode_resi', 'like', "%{$search}%")
                  ->orWhere('kategori_pakaian', 'like', "%{$search}%")
                  ->orWhere('jenis_bahan', 'like', "%{$search}%")
                  ->orWhere('warna_kain', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone_number', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = (int) $request->input('per_page', 20);
        $pesanan = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pesanan berhasil diambil.',
            'data'    => PesananResource::collection($pesanan->items()),
            'meta'    => [
                'current_page' => $pesanan->currentPage(),
                'last_page'    => $pesanan->lastPage(),
                'per_page'     => $pesanan->perPage(),
                'total'        => $pesanan->total(),
            ]
        ]);
    }

    /**
     * Tampilkan detail satu pesanan masuk.
     */
    public function show(int $id): JsonResponse
    {
        $pesanan = Pemesanan::with('user')->find($id);

        if (!$pesanan) {
            return $this->errorResponse('Pesanan tidak ditemukan.', 404);
        }

        return $this->successResponse(
            new PesananResource($pesanan),
            'Detail pesanan berhasil diambil.'
        );
    }

    /**
     * Perbarui status alur produksi atau batalkan pesanan.
     */
    public function updateStatus(UpdateStatusPesananRequest $request, int $id): JsonResponse
    {
        $pesanan = Pemesanan::find($id);

        if (!$pesanan) {
            return $this->errorResponse('Pesanan tidak ditemukan.', 404);
        }

        $newStatus = $request->status_pemesanan;
        $alasanBatal = $newStatus === 'Dibatalkan' ? $request->alasan_batal : null;

        $pesanan->update([
            'status_pemesanan' => $newStatus,
            'alasan_batal'     => $alasanBatal,
        ]);

        $pesanan->refresh()->load('user');

        // Broadcast event real-time ke Laravel Reverb (WebSocket)
        broadcast(new \App\Events\OrderStatusUpdated($pesanan));

        return $this->successResponse(
            new PesananResource($pesanan),
            "Status pesanan #{$pesanan->kode_resi} berhasil diperbarui menjadi '{$newStatus}'."
        );
    }

    /**
     * Unduh file desain mockup milik pesanan.
     */
    public function downloadMockup(int $id)
    {
        $pesanan = Pemesanan::find($id);

        if (!$pesanan || !$pesanan->file_desain) {
            return $this->errorResponse('Berkas desain untuk pesanan ini tidak ditemukan.', 404);
        }

        if (!Storage::disk('public')->exists($pesanan->file_desain)) {
            return $this->errorResponse('Berkas fisik mockup tidak ditemukan di storage server.', 404);
        }

        $path = Storage::disk('public')->path($pesanan->file_desain);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $downloadName = "Mockup_{$pesanan->kode_resi}.{$extension}";

        return response()->download($path, $downloadName);
    }

    /**
     * Hapus data pesanan dari sistem (hanya untuk pesanan tidak valid atau dibatalkan).
     */
    public function destroy(int $id): JsonResponse
    {
        $pesanan = Pemesanan::find($id);

        if (!$pesanan) {
            return $this->errorResponse('Pesanan tidak ditemukan.', 404);
        }

        if ($pesanan->file_desain) {
            Storage::disk('public')->delete($pesanan->file_desain);
        }

        $kodeResi = $pesanan->kode_resi;
        $pesanan->delete();

        return $this->successResponse(null, "Data pesanan #{$kodeResi} berhasil dihapus dari sistem.");
    }
}

