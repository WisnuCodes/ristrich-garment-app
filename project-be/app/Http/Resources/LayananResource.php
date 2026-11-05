<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LayananResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'nama_layanan'      => $this->nama_layanan,
            'deskripsi'         => $this->deskripsi,
            'bahan_rekomendasi' => $this->bahan_rekomendasi,
            'minimal_order'     => (int) ($this->minimal_order ?? 24),
            'estimasi_hari'     => (int) ($this->estimasi_hari ?? 14),
            'standar_mesin'     => $this->standar_mesin ?? 'Bordir Komputer Tajima & Juki Jarum 2',
            'toleransi_qc'      => $this->toleransi_qc ?? '±0.5 cm CAD Optitex',
            'gambar'            => $this->gambar,
            'gambar_url'        => $this->gambar_url,
            'created_at'        => $this->created_at?->toIso8601String(),
        ];
    }
}

