<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BannerImageService
{
    private ?ImageManager $image = null;

    public function __construct()
    {
        // Local only (GD + WebP)
        if (app()->environment('local') && function_exists('imagewebp')) {
            $this->image = new ImageManager(new Driver());
        }
    }

    /**
     * =====================================
     * STORE IMAGE (SINGLE ENTRY POINT)
     * =====================================
     */
    public function store(UploadedFile $file): string
    {
        // =========================
        // PRODUCTION → CLOUD
        // =========================
        if (app()->environment('production')) {
            $upload = Cloudinary::upload(
                $file->getRealPath(),
                [
                    'folder' => 'banners',
                    'format' => 'webp',
                    'transformation' => [
                        'width'  => 3780,
                        'height' => 1323,
                        'crop'   => 'fill',
                        'quality'=> 80,
                    ],
                ]
            );

            return $upload->getSecurePath(); // FULL URL
        }

        // =========================
        // LOCAL → STORAGE
        // =========================
        if ($this->image) {
            $processed = $this->image
                ->read($file)
                ->orient()
                ->cover(3780, 1323)
                ->toWebp(80);

            $path = 'banners/' . Str::uuid() . '.webp';

            Storage::disk('public')->put(
                $path,
                $processed->toString()
            );

            return $path; // PATH lokal
        }

        // fallback local
        return $file->store('banners', 'public');
    }

    /**
     * =====================================
     * DELETE IMAGE (SAFE)
     * =====================================
     */
    public function delete(?string $path): void
    {
        if (!$path) return;

        // Cloud URL
        if (str_starts_with($path, 'http')) {
            $publicId = $this->cloudPublicId($path);
            if ($publicId) {
                Cloudinary::destroy($publicId);
            }
            return;
        }

        // Local file
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * =====================================
     * HELPER
     * =====================================
     */
    private function cloudPublicId(string $url): ?string
    {
        if (preg_match('/upload\/(?:v\d+\/)?(.+)\.\w+$/', $url, $m)) {
            return $m[1];
        }
        return null;
    }
}
