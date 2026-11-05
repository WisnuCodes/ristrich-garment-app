<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\KontenController;
use App\Http\Controllers\Api\Admin\PelangganController;
use App\Http\Controllers\Api\Admin\PesananMasukController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LayananController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\PortofolioController;
use App\Http\Controllers\Api\TrackingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - CV Ristrich Garment
| Hardened with Rate Limiting & Strict Role-Based Middleware
|--------------------------------------------------------------------------
*/

// ========================================================
// 1. RUTE PUBLIK (OTENTIKASI & KATALOG INFORMASI)
// ========================================================

// Rate limiting ketat untuk mencegah serangan brute force pada login & registrasi (maks 10 percobaan/menit)
Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Katalog Layanan & Portofolio (Bisa diakses umum tanpa login, limit 120 req/menit)
Route::middleware('throttle:120,1')->group(function () {
    Route::get('/layanan', [LayananController::class, 'index']);
    Route::get('/layanan/{id}', [LayananController::class, 'show']);
    Route::get('/portofolio', [PortofolioController::class, 'index']);
    Route::get('/portofolio/{id}', [PortofolioController::class, 'show']);

    // Pelacakan Resi Publik (Limit 60 req/menit untuk mencegah scraper resi otomatis)
    Route::get('/tracking/{kode_resi}', [TrackingController::class, 'track'])->middleware('throttle:60,1');
});

// ========================================================
// 2. RUTE TEROTENTIKASI (SEMUA ROLE)
// ========================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// ========================================================
// 3. RUTE PELANGGAN (ROLE: PELANGGAN)
// ========================================================
Route::middleware(['auth:sanctum', 'role:pelanggan', 'throttle:60,1'])->prefix('pemesanan')->group(function () {
    Route::get('/', [PemesananController::class, 'index']);
    Route::post('/', [PemesananController::class, 'store']);
    Route::get('/{id}', [PemesananController::class, 'show']);
});

// ========================================================
// 4. RUTE ADMINISTRATOR (ROLE: ADMIN)
// ========================================================
Route::middleware(['auth:sanctum', 'role:admin', 'throttle:120,1'])->prefix('admin')->group(function () {
    // Ringkasan Statistik
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Manajemen Pesanan Masuk
    Route::get('/pesanan', [PesananMasukController::class, 'index']);
    Route::get('/pesanan/{id}', [PesananMasukController::class, 'show']);
    Route::patch('/pesanan/{id}/status', [PesananMasukController::class, 'updateStatus']);
    Route::delete('/pesanan/{id}', [PesananMasukController::class, 'destroy']);
    Route::get('/pesanan/{id}/download-desain', [PesananMasukController::class, 'downloadMockup']);

    // Manajemen Data Pelanggan
    Route::get('/pelanggan', [PelangganController::class, 'index']);
    Route::post('/pelanggan', [PelangganController::class, 'store']);
    Route::get('/pelanggan/{id}', [PelangganController::class, 'show']);
    Route::put('/pelanggan/{id}', [PelangganController::class, 'update']);
    Route::delete('/pelanggan/{id}', [PelangganController::class, 'destroy']);

    // Manajemen Konten (Portofolio & Layanan)
    Route::post('/portofolio', [KontenController::class, 'storePortofolio']);
    Route::post('/portofolio/{id}', [KontenController::class, 'updatePortofolio']);
    Route::put('/portofolio/{id}', [KontenController::class, 'updatePortofolio']);
    Route::delete('/portofolio/{id}', [KontenController::class, 'destroyPortofolio']);

    Route::post('/layanan', [KontenController::class, 'storeLayanan']);
    Route::post('/layanan/{id}', [KontenController::class, 'updateLayanan']);
    Route::put('/layanan/{id}', [KontenController::class, 'updateLayanan']);
    Route::delete('/layanan/{id}', [KontenController::class, 'destroyLayanan']);
});
