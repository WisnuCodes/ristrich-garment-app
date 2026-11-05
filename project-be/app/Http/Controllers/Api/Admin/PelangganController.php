<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PesananResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tampilkan seluruh data pelanggan konveksi yang terdaftar.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'pelanggan')
            ->withCount('pemesanan')
            ->withSum('pemesanan as total_pcs_dipesan', 'total_pcs')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $pelanggan = $query->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pelanggan berhasil diambil.',
            'data'    => $pelanggan->items(),
            'meta'    => [
                'current_page' => $pelanggan->currentPage(),
                'last_page'    => $pelanggan->lastPage(),
                'per_page'     => $pelanggan->perPage(),
                'total'        => $pelanggan->total(),
            ]
        ]);
    }

    /**
     * Tampilkan detail satu pelanggan dan riwayat pesanannya.
     */
    public function show(int $id): JsonResponse
    {
        $pelanggan = User::where('role', 'pelanggan')
            ->with(['pemesanan' => fn ($q) => $q->latest()])
            ->find($id);

        if (!$pelanggan) {
            return $this->errorResponse('Data pelanggan tidak ditemukan.', 404);
        }

        return $this->successResponse([
            'id'                  => $pelanggan->id,
            'name'                => $pelanggan->name,
            'email'               => $pelanggan->email,
            'phone_number'        => $pelanggan->phone_number,
            'created_at'          => $pelanggan->created_at?->format('Y-m-d H:i:s'),
            'total_pesanan'       => $pelanggan->pemesanan->count(),
            'total_pcs'           => $pelanggan->pemesanan->sum('total_pcs'),
            'riwayat_pemesanan'   => PesananResource::collection($pelanggan->pemesanan),
        ], 'Detail pelanggan berhasil diambil.');
    }

    /**
     * Tambah data akun pelanggan baru oleh admin.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'email'        => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone_number' => ['required', 'string', 'max:20'],
            'password'     => ['nullable', 'string', 'min:8'],
        ]);

        $pelanggan = User::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'password'     => bcrypt($validated['password'] ?? 'password123'),
            'role'         => 'pelanggan',
        ]);

        return $this->successResponse($pelanggan, 'Data pelanggan berhasil didaftarkan.', 201);
    }

    /**
     * Perbarui data pelanggan oleh admin.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $pelanggan = User::where('role', 'pelanggan')->find($id);

        if (!$pelanggan) {
            return $this->errorResponse('Data pelanggan tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'name'         => ['sometimes', 'required', 'string', 'max:255'],
            'email'        => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'phone_number' => ['sometimes', 'required', 'string', 'max:20'],
            'password'     => ['nullable', 'string', 'min:8'],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $pelanggan->update($validated);

        return $this->successResponse($pelanggan, 'Data pelanggan berhasil diperbarui.');
    }

    /**
     * Hapus data pelanggan.
     */
    public function destroy(int $id): JsonResponse
    {
        $pelanggan = User::where('role', 'pelanggan')->find($id);

        if (!$pelanggan) {
            return $this->errorResponse('Data pelanggan tidak ditemukan.', 404);
        }

        if ($pelanggan->pemesanan()->count() > 0) {
            return $this->errorResponse('Tidak dapat menghapus pelanggan yang memiliki riwayat pesanan.', 422);
        }

        $pelanggan->delete();

        return $this->successResponse(null, 'Akun pelanggan berhasil dihapus.');
    }
}

