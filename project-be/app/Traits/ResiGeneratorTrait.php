<?php

namespace App\Traits;

use App\Models\Pemesanan;
use Illuminate\Support\Str;

trait ResiGeneratorTrait
{
    /**
     * Generate unique tracking receipt code with format RG-YYYY-XXXX
     * Example: RG-2026-8812 or RG-2026-A7B2
     *
     * @return string
     */
    public function generateKodeResi(): string
    {
        $year = date('Y');

        do {
            // Generate 4 characters (numeric/alphanumeric uppercase)
            $randomDigits = str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
            $kodeResi = "RG-{$year}-{$randomDigits}";
        } while (Pemesanan::where('kode_resi', $kodeResi)->exists());

        return $kodeResi;
    }
}

