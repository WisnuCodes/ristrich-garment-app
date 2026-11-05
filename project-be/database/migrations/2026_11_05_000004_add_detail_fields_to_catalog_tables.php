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
        Schema::table('layanan', function (Blueprint $table) {
            $table->unsignedInteger('minimal_order')->default(24)->after('bahan_rekomendasi');
            $table->unsignedInteger('estimasi_hari')->default(14)->after('minimal_order');
            $table->string('standar_mesin')->nullable()->default('Bordir Komputer Tajima & Juki Jarum 2')->after('estimasi_hari');
            $table->string('toleransi_qc')->nullable()->default('±0.5 cm CAD Optitex')->after('standar_mesin');
        });

        Schema::table('portofolio', function (Blueprint $table) {
            $table->string('klien')->nullable()->after('jumlah_produksi');
            $table->string('teknik_identitas')->nullable()->default('Bordir Komputer Tajima')->after('klien');
            $table->string('bahan_terpakai')->nullable()->after('teknik_identitas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('layanan', function (Blueprint $table) {
            $table->dropColumn(['minimal_order', 'estimasi_hari', 'standar_mesin', 'toleransi_qc']);
        });

        Schema::table('portofolio', function (Blueprint $table) {
            $table->dropColumn(['klien', 'teknik_identitas', 'bahan_terpakai']);
        });
    }
};
