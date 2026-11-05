<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

trait FileUploadTrait
{
    /**
     * Daftar ekstensi terlarang yang berpotensi mengeksekusi kode berbahaya.
     */
    protected array $dangerousExtensions = [
        'php', 'php3', 'php4', 'php5', 'phtml', 'phar', 'sh', 'bash',
        'exe', 'bat', 'cmd', 'vbs', 'js', 'jsp', 'asp', 'aspx', 'cgi',
        'pl', 'py', 'htm', 'html', 'htaccess', 'htpasswd', 'env', 'config'
    ];

    /**
     * Daftar ekstensi aman yang diizinkan untuk dokumen dan gambar garment.
     */
    protected array $allowedExtensions = [
        'jpg', 'jpeg', 'png', 'webp', 'pdf', 'zip', 'rar', 'cdr', 'ai', 'eps', 'svg'
    ];

    /**
     * Upload berkas ke storage publik dengan validasi keamanan tingkat tinggi.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string $disk
     * @return string
     * @throws InvalidArgumentException
     */
    public function uploadFile(UploadedFile $file, string $folder = 'uploads', string $disk = 'public'): string
    {
        // 1. Dapatkan ekstensi asli dan normalisasi ke huruf kecil
        $clientExt = strtolower($file->getClientOriginalExtension());
        $guessedExt = strtolower($file->guessExtension() ?? '');

        // 2. Blokir ekstensi berbahaya tanpa kompromi
        if (in_array($clientExt, $this->dangerousExtensions, true) || in_array($guessedExt, $this->dangerousExtensions, true)) {
            throw new InvalidArgumentException('Ekstensi berkas berbahaya terdeteksi dan diblokir oleh sistem keamanan.');
        }

        // 3. Pastikan ekstensi ada dalam whitelist
        $safeExtension = in_array($clientExt, $this->allowedExtensions, true) ? $clientExt : $guessedExt;
        if (!in_array($safeExtension, $this->allowedExtensions, true)) {
            throw new InvalidArgumentException('Tipe ekstensi berkas tidak diizinkan.');
        }

        // 4. Verifikasi MIME type asli berkas
        $mime = $file->getMimeType();
        $allowedMimes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
            'application/pdf', 'application/zip', 'application/x-zip-compressed',
            'application/octet-stream', 'application/illustrator', 'application/postscript',
            'application/vnd.corel-draw', 'image/x-eps'
        ];

        if ($mime && !in_array($mime, $allowedMimes, true)) {
            throw new InvalidArgumentException("Tipe konten berkas ({$mime}) tidak valid atau mencurigakan.");
        }

        // 5. Sanitasi nama folder untuk mencegah directory traversal
        $cleanFolder = trim(str_replace(['..', '/', '\\'], '', $folder));
        if (empty($cleanFolder)) {
            $cleanFolder = 'uploads';
        }

        // 6. Buat nama berkas acak yang tidak dapat ditebak secara kriptografis
        $randomHash = bin2hex(random_bytes(16));
        $safeFilename = $randomHash . '_' . time() . '.' . $safeExtension;

        return $file->storeAs($cleanFolder, $safeFilename, $disk);
    }

    /**
     * Hapus berkas dari storage publik dengan aman.
     *
     * @param string|null $path
     * @param string $disk
     * @return bool
     */
    public function deleteFile(?string $path, string $disk = 'public'): bool
    {
        if (!$path) {
            return false;
        }

        // Cegah path traversal pada penghapusan berkas
        if (str_contains($path, '..')) {
            return false;
        }

        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }
}
