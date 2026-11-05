<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pemesanan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_resi', 30)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('kategori_pakaian');
            $table->string('jenis_bahan');
            $table->string('warna_kain');
            $table->json('rincian_ukuran');
            $table->unsignedInteger('total_pcs');
            $table->string('file_desain');
            $table->text('catatan_pesanan')->nullable();
            $table->enum('status_pemesanan', [
                'Pesanan Diterima',
                'Antrean Produksi',
                'Sedang Dipotong & Dijahit',
                'QC & Finishing',
                'Selesai',
                'Dibatalkan'
            ])->default('Pesanan Diterima');
            $table->text('alasan_batal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanan');
    }
};

