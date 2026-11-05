<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Anonymize customer name for public tracking view
        $rawName = $this->user?->name ?? 'Pelanggan CV Ristrich';
        $words = explode(' ', trim($rawName));
        $anonymized = $words[0];
        if (count($words) > 1) {
            $anonymized .= ' ' . substr($words[1], 0, 1) . '***';
        }

        return [
            'kode_resi'           => $this->kode_resi,
            'pelanggan_nama'      => $anonymized,
            'kategori_pakaian'    => $this->kategori_pakaian,
            'jenis_bahan'         => $this->jenis_bahan,
            'warna_kain'          => $this->warna_kain,
            'rincian_ukuran'      => $this->rincian_ukuran,
            'total_pcs'           => $this->total_pcs,
            'file_desain_url'     => $this->file_desain_url,
            'status_pemesanan'    => $this->status_pemesanan,
            'status_step'         => $this->status_step,
            'timeline'            => $this->timeline,
            'alasan_batal'        => $this->alasan_batal,
            'tanggal_masuk'       => $this->created_at?->format('Y-m-d H:i:s'),
            'terakhir_diperbarui' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}

