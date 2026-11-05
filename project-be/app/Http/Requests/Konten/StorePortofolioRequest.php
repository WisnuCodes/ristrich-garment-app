<?php

namespace App\Http\Requests\Konten;

use Illuminate\Foundation\Http\FormRequest;

class StorePortofolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul'             => ['required', 'string', 'max:255'],
            'kategori'          => ['required', 'string', 'max:100'],
            'jumlah_produksi'   => ['required', 'integer', 'min:1'],
            'deskripsi_singkat' => ['required', 'string', 'max:1000'],
            'gambar'            => ['required', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required'             => 'Judul portofolio wajib diisi.',
            'kategori.required'          => 'Kategori busana wajib dipilih.',
            'jumlah_produksi.required'   => 'Jumlah kuantitas produksi wajib diisi.',
            'jumlah_produksi.integer'    => 'Jumlah kuantitas produksi harus berupa angka.',
            'jumlah_produksi.min'        => 'Jumlah kuantitas produksi minimal 1 pcs.',
            'deskripsi_singkat.required' => 'Deskripsi singkat hasil produksi wajib diisi.',
            'gambar.required'            => 'Foto hasil produksi wajib diunggah.',
            'gambar.image'               => 'File harus berupa gambar.',
            'gambar.max'                 => 'Ukuran foto maksimal 5 MB.',
            'gambar.mimes'               => 'Format foto harus berupa JPG, PNG, atau WEBP.',
        ];
    }
}

