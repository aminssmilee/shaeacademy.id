<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Services\BannerImageService;
use Illuminate\Http\Request;

class AdminBannerController extends Controller
{
    public function __construct(
        protected BannerImageService $imageService
    ) {
    }

    public function index(Request $request)
    {
        $banners = Banner::when(
            $request->category,
            fn($q) => $q->where('category', $request->category)
        )
            ->orderBy('order')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'category' => $b->category,
                'image' => str_starts_with($b->image, 'http')
                    ? $b->image
                    : asset('storage/' . $b->image),
                'order' => $b->order,
                'is_active' => $b->is_active,
            ]);

        return response()->json(['data' => $banners]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|in:shae-academy,shae-muslim,shae-life,shae-profesional',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
            'order' => 'nullable|integer',
        ]);

        // Validasi urutan unik per kategori
        if (Banner::where('category', $data['category'])->where('order', $data['order'] ?? 0)->exists()) {
            return response()->json([
                'message' => 'Urutan banner ' . ($data['order'] ?? 0) . ' sudah digunakan di kategori ini. Mohon gunakan urutan lain.'
            ], 422);
        }

        // $path = $this->imageService->storeWebp($data['image']);
        $path = $this->imageService->store($data['image']);

        $banner = Banner::create([
            'category' => $data['category'],
            'image' => $path,
            'order' => $data['order'] ?? 0,
            'is_active' => true,
        ]);

        return response()->json($banner, 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $data = $request->validate([
            'category' => 'required|in:shae-academy,shae-muslim,shae-life,shae-profesional',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($data['image'])) {
            $this->imageService->delete($banner->image);
            // $banner->image = $this->imageService->storeWebp($data['image']);
            $banner->image = $this->imageService->store($data['image']);
        }

        $banner->update(collect($data)->except('image')->toArray());

        return response()->json($banner);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        $this->imageService->delete($banner->image);
        $banner->delete();

        return response()->json(['message' => 'Banner dihapus']);
    }

    public function toggle($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->update(['is_active' => !$banner->is_active]);

        return response()->json(['message' => 'Status diubah']);
    }

    public function byCategory(string $category)
    {
        $banners = Banner::where('category', $category)
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'image' => str_starts_with($b->image, 'http')
                    ? $b->image
                    : asset('storage/' . $b->image),
            ]);

        return response()->json(['data' => $banners]);
    }
    public function show($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                'message' => 'Banner tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $banner->id,
                'title' => $banner->title,
                'category' => $banner->category,
                'order' => $banner->order,
                'is_active' => (bool) $banner->is_active,
                // 'image'     => asset('storage/' . $banner->image),
                'image' => str_starts_with($banner->image, 'http')
                    ? $banner->image
                    : asset('storage/' . $banner->image),
            ],
        ]);
    }
}
