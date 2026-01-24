<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();

            // ===== DATA UTAMA =====
            $table->string('title');
            $table->string('slug')->unique();

            // kategori utama produk
            $table->enum('category', [
                'shae-muslim',
                'shae-life',
                'shae-kreasi',
            ]);

            // harga dalam rupiah (tanpa titik)
            $table->unsignedInteger('price');

            // path poster (storage/public/classes/xxx.jpg)
            $table->string('poster');

            // link external (shaelife.myr.id / zoom / dll)
            $table->string('external_link');

            // status publish
            $table->enum('status', [
                'draft',
                'published',
                'archived',
            ])->default('published');

            // ===== OPTIONAL (future ready) =====
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('clicks')->default(0);

            $table->timestamps();

            // ===== INDEXING =====
            $table->index('category');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
