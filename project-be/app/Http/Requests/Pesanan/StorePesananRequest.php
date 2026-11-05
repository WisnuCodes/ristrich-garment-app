<?php

namespace App\Http\Requests\Pesanan;

use Illuminate\Foundation\Http\FormRequest;

class StorePesananRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Decode rincian_ukuran if sent as JSON string in multipart/form-data
        if (is_string($this->rincian_ukuran)) {
            $decoded = json_decode($this->rincian_ukuran, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $this->merge(['rincian_ukuran' => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'kategori_pakaian' => ['required', 'string', 'max:100'],
            'jenis_bahan'      => ['required', 'string', 'max:100'],
            'warna_kain'       => ['required', 'string', 'max:100'],
            'rincian_ukuran'   => ['required', 'array'],
            'rincian_ukuran.S'   => ['nullable', 'integer', 'min:0'],
            'rincian_ukuran.M'   => ['nullable', 'integer', 'min:0'],
            'rincian_ukuran.L'   => ['nullable', 'integer', 'min:0'],
            'rincian_ukuran.XL'  => ['nullable', 'integer', 'min:0'],
            'rincian_ukuran.XXL' => ['nullable', 'integer', 'min:0'],
            'file_desain'      => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,pdf,zip'],
            'catatan_pesanan'  => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $sizes = $this->input('rincian_ukuran');
            if (is_array($sizes)) {
                $total = (int)($sizes['S'] ?? 0)
                    + (int)($sizes['M'] ?? 0)
                    + (int)($sizes['L'] ?? 0)
                    + (int)($sizes['XL'] ?? 0)
                    + (int)($sizes['XXL'] ?? 0);

                if ($total < 1) {
                    $validator->errors()->add('rincian_ukuran', 'Total kuantitas pesanan minimal adalah 1 pcs pada salah satu ukuran.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'kategori_pakaian.required' => 'Kategori pakaian wajib dipilih.',
            'jenis_bahan.required'      => 'Jenis bahan kain wajib dipilih atau diisi.',
            'warna_kain.required'       => 'Warna kain wajib diisi.',
            'rincian_ukuran.required'   => 'Rincian ukuran pakaian wajib diisi.',
            'rincian_ukuran.array'      => 'Format rincian ukuran tidak valid.',
            'file_desain.required'      => 'File sketsa/mockup desain wajib diunggah.',
            'file_desain.file'          => 'File desain harus berupa berkas dokumen yang valid.',
            'file_desain.max'           => 'Ukuran file desain maksimal adalah 10 MB.',
            'file_desain.mimes'         => 'Format file desain harus berupa JPG, PNG, PDF, atau ZIP.',
            'catatan_pesanan.max'       => 'Catatan pesanan maksimal 2000 karakter.',
        ];
    }
}

