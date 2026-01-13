<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class BannerImageService
{
    private ?ImageManager $manager = null;

    public function __construct()
    {
        // Cek apakah GD + WebP tersedia
        if (function_exists('imagewebp')) {
            $this->manager = new ImageManager(new Driver());
        }
    }

    public function storeWebp(UploadedFile $file): string
    {
        // ==========================
        // FALLBACK (SERVER AMAN)
        // ==========================
        if (!$this->manager) {
            return $file->store('banners', 'public');
        }

        try {
            $image = $this->manager
                ->read($file)
                ->orient()
                ->cover(3780, 1323)
                ->toWebp(80);

            $filename = 'banners/' . Str::uuid() . '.webp';

            Storage::disk('public')->put(
                $filename,
                $image->toString()
            );

            return $filename;
        } catch (\Throwable $e) {
            // fallback jika server error
            return $file->store('banners', 'public');
        }
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
