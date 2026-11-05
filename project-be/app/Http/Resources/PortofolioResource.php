<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortofolioResource extends JsonResource
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
            'judul'             => $this->judul,
            'kategori'          => $this->kategori,
            'klien'             => $this->klien,
            'jumlah_produksi'   => (int) $this->jumlah_produksi,
            'teknik_identitas'  => $this->teknik_identitas ?? 'Bordir Komputer Tajima',
            'bahan_terpakai'    => $this->bahan_terpakai,
            'deskripsi_singkat' => $this->deskripsi_singkat,
            'gambar'            => $this->gambar,
            'gambar_url'        => $this->gambar_url,
            'created_at'        => $this->created_at?->toIso8601String(),
        ];
    }
}

