<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;

class BannerImageService
{
    private ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    public function storeWebp(UploadedFile $file): string
    {
        // 👉 Read & normalize image
        $image = $this->manager
            ->read($file)
            ->orient() // fix EXIF orientation
            ->cover(3780, 1323) // FIXED RATIO banner
            ->toWebp(80); // quality optimal

        $filename = 'banners/' . Str::uuid() . '.webp';

        Storage::disk('public')->put(
            $filename,
            $image->toString()
        );

        return $filename;
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
