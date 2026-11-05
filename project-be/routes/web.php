<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return response()->json([
        'app'     => 'CV Ristrich Garment API',
        'status'  => 'online',
        'version' => '1.0.0',
    ]);
});

/**
 * Endpoint aman untuk melayani berkas publik storage (gambar katalog & mockup)
 * Dilengkapi proteksi ketat anti-Directory Traversal, LFI, dan RCE.
 */
Route::get('/storage/{path}', function (string $path) {
    // 1. Blokir Null Byte & Path Traversal
    if (str_contains($path, "\0") || str_contains($path, '..') || str_contains($path, './') || str_contains($path, '//')) {
        abort(400, 'Akses path tidak valid.');
    }

    // 2. Batasi hanya folder yang sah (whitelist)
    $allowedPrefixes = ['layanan/', 'portofolio/', 'mockups/', 'uploads/'];
    $isValidFolder = false;
    foreach ($allowedPrefixes as $prefix) {
        if (str_starts_with($path, $prefix)) {
            $isValidFolder = true;
            break;
        }
    }

    if (!$isValidFolder) {
        abort(403, 'Akses ke direktori ini tidak diizinkan.');
    }

    // 3. Batasi hanya ekstensi aman
    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'zip', 'svg', 'cdr', 'ai'];
    if (!in_array($extension, $allowedExtensions, true)) {
        abort(403, 'Tipe berkas tidak diizinkan untuk diakses.');
    }

    // 4. Pastikan berkas fisik benar-benar ada di disk publik
    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'Berkas tidak ditemukan.');
    }

    $fullPath = Storage::disk('public')->path($path);

    return response()->file($fullPath, [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options'        => 'DENY',
        'Cache-Control'          => 'public, max-age=86400',
    ]);
})->where('path', '.*');
