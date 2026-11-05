<?php

putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE=' . __DIR__ . '/database/database.sqlite');
$_ENV['DB_CONNECTION'] = 'sqlite';
$_ENV['DB_DATABASE'] = __DIR__ . '/database/database.sqlite';

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

echo "=======================================================\n";
echo " CV RISTRICH GARMENT - BACKEND TEST RUNNER SUITE\n";
echo "=======================================================\n\n";

$passCount = 0;
$failCount = 0;

function runTest(string $title, callable $test) {
    global $passCount, $failCount;
    try {
        $test();
        echo "[ PASS ] {$title}\n";
        $passCount++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] {$title}\n";
        echo "         Error: " . $e->getMessage() . "\n";
        $failCount++;
    }
}

function sendRequest($kernel, string $method, string $uri, array $data = [], array $headers = []) {
    global $app;
    if ($app->bound('auth')) {
        $app['auth']->forgetGuards();
    }

    $server = [
        'HTTP_ACCEPT' => 'application/json',
        'CONTENT_TYPE' => 'application/json',
    ];

    $content = in_array(strtoupper($method), ['POST', 'PUT', 'PATCH']) ? json_encode($data) : null;
    $parameters = !in_array(strtoupper($method), ['POST', 'PUT', 'PATCH']) ? $data : [];

    $request = Illuminate\Http\Request::create(
        $uri,
        $method,
        $parameters,
        [],
        [],
        $server,
        $content
    );

    $request->headers->set('Accept', 'application/json');
    $request->headers->set('Content-Type', 'application/json');

    foreach ($headers as $k => $v) {
        $request->headers->set($k, $v);
    }

    $response = $kernel->handle($request);
    $content = $response->getContent();
    $json = json_decode($content, true);

    return [
        'status' => $response->getStatusCode(),
        'json' => $json,
        'raw' => $content,
    ];
}

// 1. Test Katalog Layanan
runTest("1. GET /api/layanan (Katalog Layanan Publik)", function () use ($kernel) {
    $res = sendRequest($kernel, 'GET', '/api/layanan');
    if ($res['status'] !== 200 || !($res['json']['success'] ?? false)) {
        throw new Exception("Expected 200 OK, got: " . $res['status'] . " " . $res['raw']);
    }
    if (count($res['json']['data']) < 1) {
        throw new Exception("Data layanan kosong.");
    }
});

// 2. Test Katalog Portofolio
runTest("2. GET /api/portofolio (Katalog Portofolio Publik)", function () use ($kernel) {
    $res = sendRequest($kernel, 'GET', '/api/portofolio');
    if ($res['status'] !== 200 || !($res['json']['success'] ?? false)) {
        throw new Exception("Expected 200 OK, got: " . $res['status']);
    }
    if (count($res['json']['data']) < 1) {
        throw new Exception("Data portofolio kosong.");
    }
});

// 3. Test Tracking Resi Valid
runTest("3. GET /api/tracking/RG-2026-8812 (Pelacakan Resi Publik Valid)", function () use ($kernel) {
    $res = sendRequest($kernel, 'GET', '/api/tracking/RG-2026-8812');
    if ($res['status'] !== 200 || !($res['json']['success'] ?? false)) {
        throw new Exception("Expected 200 OK, got: " . $res['status'] . " " . $res['raw']);
    }
    $data = $res['json']['data'];
    if ($data['kode_resi'] !== 'RG-2026-8812') {
        throw new Exception("Kode resi tidak cocok.");
    }
    if ($data['status_step'] !== 3) {
        throw new Exception("Step tidak sesuai (diharapkan 3, didapat {$data['status_step']}).");
    }
    if (!isset($data['timeline']) || count($data['timeline']) !== 5) {
        throw new Exception("Timeline stepper tidak valid.");
    }
});

// 4. Test Tracking Resi Tidak Ditemukan (404)
runTest("4. GET /api/tracking/RG-9999-0000 (Pelacakan Resi Tidak Dikenal)", function () use ($kernel) {
    $res = sendRequest($kernel, 'GET', '/api/tracking/RG-9999-0000');
    if ($res['status'] !== 404 || ($res['json']['success'] ?? true) !== false) {
        throw new Exception("Expected 404 Not Found, got: " . $res['status']);
    }
});

// 5. Test Registrasi Pelanggan Baru
$registeredToken = null;
runTest("5. POST /api/auth/register (Pendaftaran Akun Baru)", function () use ($kernel, &$registeredToken) {
    $email = 'tester_' . time() . '@example.com';
    $res = sendRequest($kernel, 'POST', '/api/auth/register', [
        'name' => 'Tester User',
        'email' => $email,
        'phone_number' => '081234567890',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    if ($res['status'] !== 201 || !($res['json']['success'] ?? false)) {
        throw new Exception("Expected 201 Created, got: " . $res['status'] . " " . $res['raw']);
    }
    $registeredToken = $res['json']['data']['token'];
    if (!$registeredToken) {
        throw new Exception("Token otentikasi tidak dikembalikan.");
    }
});

// 6. Test Validasi Registrasi Gagal (422)
runTest("6. POST /api/auth/register (Validasi Gagal dengan Pesan Bahasa Indonesia)", function () use ($kernel) {
    $res = sendRequest($kernel, 'POST', '/api/auth/register', [
        'name' => '',
        'email' => 'invalid-email',
        'phone_number' => '',
        'password' => 'short',
        'password_confirmation' => 'mismatch',
    ]);

    if ($res['status'] !== 422 || ($res['json']['success'] ?? true) !== false) {
        throw new Exception("Expected 422 Unprocessable Content, got: " . $res['status']);
    }
    $errors = $res['json']['errors'];
    if (!isset($errors['name']) || !isset($errors['email']) || !isset($errors['password'])) {
        throw new Exception("Format errors tidak lengkap.");
    }
});

// 7. Test Login Admin & Pelanggan
$adminToken = null;
$customerToken = null;
runTest("7. POST /api/auth/login (Login Administrator & Pelanggan)", function () use ($kernel, &$adminToken, &$customerToken) {
    // Admin login
    $adminRes = sendRequest($kernel, 'POST', '/api/auth/login', [
        'email' => 'admin@ristrich.com',
        'password' => 'password',
    ]);
    if ($adminRes['status'] !== 200) {
        throw new Exception("Admin login failed: " . $adminRes['raw']);
    }
    $adminToken = $adminRes['json']['data']['token'];

    // Customer login
    $custRes = sendRequest($kernel, 'POST', '/api/auth/login', [
        'email' => 'pelanggan@example.com',
        'password' => 'password',
    ]);
    if ($custRes['status'] !== 200) {
        throw new Exception("Customer login failed: " . $custRes['raw']);
    }
    $customerToken = $custRes['json']['data']['token'];
});

// 8. Test Auth Me
runTest("8. GET /api/auth/me (Data Profil Terotentikasi)", function () use ($kernel, &$adminToken) {
    $res = sendRequest($kernel, 'GET', '/api/auth/me', [], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($res['status'] !== 200 || $res['json']['data']['role'] !== 'admin') {
        throw new Exception("Expected admin user profile, got: " . $res['raw']);
    }
});

// 9. Test Riwayat Pemesanan Pelanggan
runTest("9. GET /api/pemesanan (Riwayat Pemesanan Saya)", function () use ($kernel, &$customerToken) {
    $res = sendRequest($kernel, 'GET', '/api/pemesanan', [], [
        'Authorization' => "Bearer {$customerToken}",
    ]);
    if ($res['status'] !== 200 || !($res['json']['success'] ?? false)) {
        throw new Exception("Gagal mengambil riwayat pesanan: " . $res['raw']);
    }
});

// 9b. Test Pembuatan Pesanan Baru oleh Pelanggan (Form Pemesanan)
runTest("9b. POST /api/pemesanan (Pemesanan Busana dengan Rincian Ukuran S-XXL & Mockup)", function () use ($kernel, &$customerToken) {
    $tempFile = __DIR__ . '/storage/app/temp_mockup.png';
    // 1x1 valid PNG binary
    file_put_contents($tempFile, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='));
    $uploadedFile = new Illuminate\Http\UploadedFile($tempFile, 'desain_seragam.png', 'image/png', null, true);

    global $app;
    $app['auth']->forgetGuards();

    $request = Illuminate\Http\Request::create(
        '/api/pemesanan',
        'POST',
        [
            'kategori_pakaian' => 'Kemeja PDH & PDL Instansi',
            'jenis_bahan'      => 'American Drill 1919',
            'warna_kain'       => 'Navy Blue Solid',
            'rincian_ukuran'   => json_encode([
                'S'   => 10,
                'M'   => 20,
                'L'   => 30,
                'XL'  => 15,
                'XXL' => 5,
            ]),
            'catatan_pesanan'  => 'Bordir logo perusahaan di dada kiri.',
        ],
        [],
        ['file_desain' => $uploadedFile],
        [
            'HTTP_ACCEPT' => 'application/json',
        ]
    );
    $request->headers->set('Accept', 'application/json');
    $request->headers->set('Authorization', "Bearer {$customerToken}");

    $response = $kernel->handle($request);
    $json = json_decode($response->getContent(), true);

    if ($response->getStatusCode() !== 201 || !($json['success'] ?? false)) {
        throw new Exception("Store order failed: " . $response->getContent());
    }

    if ($json['data']['total_pcs'] !== 80) {
        throw new Exception("Perhitungan total pcs salah: diharapkan 80, didapat {$json['data']['total_pcs']}");
    }

    if (!preg_match('/^RG-\d{4}-\d{4}$/', $json['data']['kode_resi'])) {
        throw new Exception("Format kode resi salah: {$json['data']['kode_resi']}");
    }
});

// 10. Test Role Security: Pelanggan tidak boleh akses endpoint admin (403)
runTest("10. Security: Pelanggan dicegah mengakses /api/admin/dashboard (403 Forbidden)", function () use ($kernel, &$customerToken) {
    $res = sendRequest($kernel, 'GET', '/api/admin/dashboard', [], [
        'Authorization' => "Bearer {$customerToken}",
    ]);
    if ($res['status'] !== 403 || ($res['json']['success'] ?? true) !== false) {
        throw new Exception("Expected 403 Forbidden, got: " . $res['status']);
    }
});

// 11. Test Admin Dashboard Statistik
runTest("11. GET /api/admin/dashboard (Ringkasan Statistik Dashboard Admin)", function () use ($kernel, &$adminToken) {
    $res = sendRequest($kernel, 'GET', '/api/admin/dashboard', [], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($res['status'] !== 200 || !($res['json']['success'] ?? false)) {
        throw new Exception("Expected 200 OK, got: " . $res['status'] . " " . $res['raw']);
    }
    $data = $res['json']['data'];
    if (!isset($data['total_pesanan']) || !isset($data['total_pcs_produksi']) || !isset($data['status_breakdown'])) {
        throw new Exception("Data statistik metrik tidak lengkap.");
    }
});

// 12. Test Admin Daftar Pesanan Masuk
$sampleOrderId = null;
runTest("12. GET /api/admin/pesanan (Daftar Pesanan Masuk Admin)", function () use ($kernel, &$adminToken, &$sampleOrderId) {
    $res = sendRequest($kernel, 'GET', '/api/admin/pesanan', [], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($res['status'] !== 200) {
        throw new Exception("Expected 200 OK, got: " . $res['status'] . " " . $res['raw']);
    }
    if (count($res['json']['data']) < 1) {
        throw new Exception("Daftar pesanan masuk kosong.");
    }
    $sampleOrderId = $res['json']['data'][0]['id'];
});

// 13. Test Update Status Pesanan ke Tahap Produksi
runTest("13. PATCH /api/admin/pesanan/{id}/status (Perbarui Status ke QC & Finishing)", function () use ($kernel, &$adminToken, &$sampleOrderId) {
    $res = sendRequest($kernel, 'PATCH', "/api/admin/pesanan/{$sampleOrderId}/status", [
        'status_pemesanan' => 'QC & Finishing',
    ], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($res['status'] !== 200 || $res['json']['data']['status_pemesanan'] !== 'QC & Finishing') {
        throw new Exception("Status update failed: " . $res['raw']);
    }
});

// 14. Test Validasi Update Status Dibatalkan (Wajib Alasan Batal)
runTest("14. PATCH /api/admin/pesanan/{id}/status (Mewajibkan Alasan Batal jika Dibatalkan)", function () use ($kernel, &$adminToken, &$sampleOrderId) {
    // Tanpa alasan_batal -> Harap 422
    $failRes = sendRequest($kernel, 'PATCH', "/api/admin/pesanan/{$sampleOrderId}/status", [
        'status_pemesanan' => 'Dibatalkan',
    ], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($failRes['status'] !== 422) {
        throw new Exception("Expected 422 when cancelling without reason, got: " . $failRes['status']);
    }

    // Dengan alasan_batal -> Harap 200
    $successRes = sendRequest($kernel, 'PATCH', "/api/admin/pesanan/{$sampleOrderId}/status", [
        'status_pemesanan' => 'Dibatalkan',
        'alasan_batal' => 'Kain warna biru habis dari pabrik supplier.',
    ], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($successRes['status'] !== 200 || $successRes['json']['data']['status_pemesanan'] !== 'Dibatalkan') {
        throw new Exception("Success cancellation failed: " . $successRes['raw']);
    }
});

// 15. Test Admin Daftar Pelanggan
runTest("15. GET /api/admin/pelanggan (Daftar Pelanggan Terdaftar)", function () use ($kernel, &$adminToken) {
    $res = sendRequest($kernel, 'GET', '/api/admin/pelanggan', [], [
        'Authorization' => "Bearer {$adminToken}",
    ]);
    if ($res['status'] !== 200 || count($res['json']['data']) < 1) {
        throw new Exception("Expected list of customers, got: " . $res['raw']);
    }
});

// 16. Test Logout
runTest("16. POST /api/auth/logout (Revoke Token dan Akhiri Sesi)", function () use ($kernel, &$registeredToken) {
    $res = sendRequest($kernel, 'POST', '/api/auth/logout', [], [
        'Authorization' => "Bearer {$registeredToken}",
    ]);
    if ($res['status'] !== 200) {
        throw new Exception("Logout failed: " . $res['raw']);
    }
});

echo "\n=======================================================\n";
echo " TEST SUMMARY: {$passCount} PASSED, {$failCount} FAILED\n";
echo "=======================================================\n";

if ($failCount > 0) {
    exit(1);
}
