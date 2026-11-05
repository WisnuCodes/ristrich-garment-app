<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PesananResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'kode_resi'        => $this->kode_resi,
            'user_id'          => $this->user_id,
            'pelanggan'        => $this->user ? [
                'id'           => $this->user->id,
                'name'         => $this->user->name,
                'email'        => $this->user->email,
                'phone_number' => $this->user->phone_number,
            ] : null,
            'kategori_pakaian' => $this->kategori_pakaian,
            'jenis_bahan'      => $this->jenis_bahan,
            'warna_kain'       => $this->warna_kain,
            'rincian_ukuran'   => $this->rincian_ukuran,
            'total_pcs'        => $this->total_pcs,
            'file_desain'      => $this->file_desain,
            'file_desain_url'  => $this->file_desain_url,
            'catatan_pesanan'  => $this->catatan_pesanan,
            'status_pemesanan' => $this->status_pemesanan,
            'status_step'      => $this->status_step,
            'timeline'         => $this->timeline,
            'alasan_batal'     => $this->alasan_batal,
            'created_at'       => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'       => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}

