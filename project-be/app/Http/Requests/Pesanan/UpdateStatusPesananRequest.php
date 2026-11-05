<?php

namespace App\Http\Requests\Pesanan;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusPesananRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_pemesanan' => [
                'required',
                'string',
                Rule::in([
                    'Pesanan Diterima',
                    'Antrean Produksi',
                    'Sedang Dipotong & Dijahit',
                    'QC & Finishing',
                    'Selesai',
                    'Dibatalkan'
                ])
            ],
            'alasan_batal' => [
                'nullable',
                Rule::requiredIf(fn () => $this->input('status_pemesanan') === 'Dibatalkan'),
                'string',
                'min:5',
                'max:1000'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status_pemesanan.required' => 'Status pemesanan wajib dipilih.',
            'status_pemesanan.in'       => 'Pilihan status pemesanan tidak valid.',
            'alasan_batal.required'     => 'Alasan pembatalan wajib diisi jika status diubah menjadi Dibatalkan.',
            'alasan_batal.min'          => 'Alasan pembatalan minimal 5 karakter agar informatif bagi pelanggan.',
            'alasan_batal.max'          => 'Alasan pembatalan maksimal 1000 karakter.',
        ];
    }
}

