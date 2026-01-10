<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Banner;

class PublicBannerController extends Controller
{
    /**
     * Banner publik by category
     * GET /api/banners/{category}
     */
    public function byCategory(string $category)
    {
        $banners = Banner::query()
            ->where('category', $category)
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn ($b) => [
                'id'    => $b->id,
                'title' => $b->title,
                'image' => asset('storage/' . $b->image),
            ]);

        return response()->json([
            'data' => $banners,
        ]);
    }
}
