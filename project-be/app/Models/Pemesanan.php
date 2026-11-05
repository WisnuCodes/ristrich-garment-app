<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pemesanan extends Model
{
    use HasFactory;

    protected $table = 'pemesanan';

    protected $fillable = [
        'kode_resi',
        'user_id',
        'kategori_pakaian',
        'jenis_bahan',
        'warna_kain',
        'rincian_ukuran',
        'total_pcs',
        'file_desain',
        'catatan_pesanan',
        'status_pemesanan',
        'alasan_batal',
    ];

    protected $casts = [
        'rincian_ukuran' => 'array',
        'total_pcs' => 'integer',
    ];

    protected $appends = [
        'file_desain_url',
        'status_step',
        'timeline',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getFileDesainUrlAttribute(): ?string
    {
        if (!$this->file_desain) {
            return null;
        }

        if (str_starts_with($this->file_desain, 'http://') || str_starts_with($this->file_desain, 'https://')) {
            return $this->file_desain;
        }

        return asset('storage/' . ltrim($this->file_desain, '/'));
    }

    /**
     * Mengembalikan step numerik (1 - 5) untuk progress bar.
     * Jika status 'Dibatalkan', return -1.
     */
    public function getStatusStepAttribute(): int
    {
        return match ($this->status_pemesanan) {
            'Pesanan Diterima'           => 1,
            'Antrean Produksi'           => 2,
            'Sedang Dipotong & Dijahit'  => 3,
            'QC & Finishing'             => 4,
            'Selesai'                    => 5,
            'Dibatalkan'                 => -1,
            default                      => 1,
        };
    }

    /**
     * Timeline visual alur konveksi busana.
     */
    public function getTimelineAttribute(): array
    {
        $currentStep = $this->status_step;
        $isCancelled = $this->status_pemesanan === 'Dibatalkan';

        $steps = [
            [
                'step' => 1,
                'label' => 'Pesanan Diterima',
                'description' => 'Pesanan baru masuk & spesifikasi diverifikasi tim admin',
                'completed' => !$isCancelled && $currentStep >= 1,
                'active' => !$isCancelled && $currentStep === 1,
            ],
            [
                'step' => 2,
                'label' => 'Antrean Produksi',
                'description' => 'Desain siap cetak, bahan baku dialokasikan dari gudang',
                'completed' => !$isCancelled && $currentStep >= 2,
                'active' => !$isCancelled && $currentStep === 2,
            ],
            [
                'step' => 3,
                'label' => 'Sedang Dipotong & Dijahit',
                'description' => 'Proses pemotongan pola kain, sablon/bordir, & perakitan jahit',
                'completed' => !$isCancelled && $currentStep >= 3,
                'active' => !$isCancelled && $currentStep === 3,
            ],
            [
                'step' => 4,
                'label' => 'QC & Finishing',
                'description' => 'Pembersihan sisa benang, steam uap, & quality control',
                'completed' => !$isCancelled && $currentStep >= 4,
                'active' => !$isCancelled && $currentStep === 4,
            ],
            [
                'step' => 5,
                'label' => 'Selesai',
                'description' => 'Pesanan selesai 100%, siap diambil atau dikirim ekspedisi',
                'completed' => !$isCancelled && $currentStep >= 5,
                'active' => !$isCancelled && $currentStep === 5,
            ],
        ];

        return $steps;
    }
}
