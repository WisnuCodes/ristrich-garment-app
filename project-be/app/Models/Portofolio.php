<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portofolio extends Model
{
    use HasFactory;

    protected $table = 'portofolio';

    protected $fillable = [
        'judul',
        'kategori',
        'jumlah_produksi',
        'klien',
        'teknik_identitas',
        'bahan_terpakai',
        'deskripsi_singkat',
        'gambar',
    ];

    protected $casts = [
        'jumlah_produksi' => 'integer',
    ];

    protected $appends = ['gambar_url'];

    public function getGambarUrlAttribute(): ?string
    {
        if (!$this->gambar) {
            return null;
        }

        if (str_starts_with($this->gambar, 'http://') || str_starts_with($this->gambar, 'https://')) {
            return $this->gambar;
        }

        return asset('storage/' . ltrim($this->gambar, '/'));
    }
}
