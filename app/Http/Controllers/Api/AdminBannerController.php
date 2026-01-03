<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminBannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::query();

        if ($request->category) {
            $query->where('category', $request->category);
        }

        return response()->json([
            'data' => $query->orderBy('order')->get()->map(fn($b) => [
                'id' => $b->id,
                'category' => $b->category,
                'image' => asset('storage/' . $b->image),
                'order' => $b->order,
                'is_active' => $b->is_active,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|in:shae-muslim,shae-life,shae-professional',
            'image' => 'required|image|max:2048',
            'order' => 'nullable|integer',
        ]);

        $path = $request->file('image')->store('banners', 'public');

        $banner = Banner::create([
            'category' => $request->category,
            'image' => $path,
            'order' => $request->order ?? 0,
            'is_active' => true,
        ]);

        return response()->json($banner, 201);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        Storage::disk('public')->delete($banner->image);
        $banner->delete();

        return response()->json(['message' => 'Banner dihapus']);
    }

    public function toggle($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->update(['is_active' => !$banner->is_active]);

        return response()->json(['message' => 'Status diubah']);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'category' => 'required|in:shae-muslim,shae-life,shae-professional',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($banner->image);
            $path = $request->file('image')->store('banners', 'public');
            $banner->image = $path;
        }

        $banner->category = $request->category;
        if ($request->has('order')) {
            $banner->order = $request->order;
        }
        if ($request->has('is_active')) {
            $banner->is_active = $request->is_active;
        }
        $banner->save();

        return response()->json($banner);
    }

    public function show($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                'message' => 'Banner tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $banner->id,
                'title' => $banner->title,
                'category' => $banner->category,
                'order' => $banner->order,
                'is_active' => $banner->is_active,
                'image' => $banner->image,
            ]
        ]);
    }
    public function byCategory(string $category)
    {
        $banners = Banner::where('category', $category)
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn($b) => [
                'id'    => $b->id,
                'image' => asset('storage/' . $b->image),
            ]);

        return response()->json([
            'data' => $banners,
        ]);
    }
}
