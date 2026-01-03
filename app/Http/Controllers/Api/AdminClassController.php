<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminClassController extends Controller
{
    /* =====================================================
     | ADMIN: LIST
     ===================================================== */
    public function index()
    {
        $classes = ClassItem::latest()->get();

        return response()->json([
            'data' => $classes->map(fn($item) => $this->formatClass($item))
        ]);
    }

    /* =====================================================
     | ADMIN: STORE
     ===================================================== */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string',
            'category'      => 'required|in:shae-muslim,shae-life,shae-professional',
            'topic'         => 'required|string',
            'price'         => 'required|integer',
            'external_link' => 'required|url',
            'poster'        => 'required|image|max:2048',
        ]);

        $posterPath = $request->file('poster')->store('classes', 'public');

        $class = ClassItem::create([
            'title'         => $validated['title'],
            'slug'          => Str::slug($validated['title']) . '-' . Str::random(5),
            'category'      => $validated['category'],
            'topic'         => $validated['topic'],
            'price'         => $validated['price'],
            'poster'        => $posterPath,
            'external_link' => $validated['external_link'],
            'status'        => 'published',
        ]);

        return response()->json([
            'message' => 'Kelas berhasil ditambahkan',
            'data'    => $this->formatClass($class)
        ], 201);
    }

    /* =====================================================
     | ADMIN: UPDATE
     ===================================================== */
    public function update(Request $request, $id)
    {
        $class = ClassItem::findOrFail($id);

        $validated = $request->validate([
            'title'         => 'required|string',
            'category'      => 'required|in:shae-muslim,shae-life,shae-professional',
            'topic'         => 'required|string',
            'price'         => 'required|integer',
            'external_link' => 'required|url',
            'poster'        => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('poster')) {
            Storage::disk('public')->delete($class->poster);
            $validated['poster'] = $request->file('poster')->store('classes', 'public');
        }

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);

        $class->update($validated);

        return response()->json([
            'message' => 'Kelas berhasil diperbarui',
            'data'    => $this->formatClass($class)
        ]);
    }

    /* =====================================================
     | ADMIN: SHOW
     ===================================================== */
    public function show($id)
    {
        $class = ClassItem::findOrFail($id);

        return response()->json([
            'data' => $this->formatClass($class)
        ]);
    }

    /* =====================================================
     | ADMIN: DELETE
     ===================================================== */
    public function destroy($id)
    {
        $class = ClassItem::findOrFail($id);

        Storage::disk('public')->delete($class->poster);
        $class->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus'
        ]);
    }

    /* =====================================================
     | PUBLIC: LIST BY CATEGORY + TOPIC
     | /api/classes/{category}?topic=doa
     ===================================================== */
    public function publicByCategory(Request $request, $category)
    {
        if (!in_array($category, [
            'shae-muslim',
            'shae-life',
            'shae-professional'
        ])) {
            return response()->json([
                'message' => 'Kategori tidak valid'
            ], 404);
        }

        $query = ClassItem::where('category', $category)
            ->where('status', 'published');

        // 🔎 FILTER TOPIC
        if ($request->filled('topic') && $request->topic !== 'all') {
            $query->where('topic', $request->topic);
        }

        // 🔍 SEARCH (judul)
        if ($request->filled('search')) {
            $query->where('title', 'LIKE', '%' . $request->search . '%');
        }

        $classes = $query->latest()->paginate(6);

        return response()->json([
            'data' => collect($classes->items())->map(fn($item) => $this->formatClass($item)),
            'current_page' => $classes->currentPage(),
            'last_page' => $classes->lastPage(),
            'per_page' => $classes->perPage(),
            'total' => $classes->total(),
        ]);
    }




    /* =====================================================
     | FORMAT RESPONSE (SINGLE SOURCE OF TRUTH)
     ===================================================== */
    private function formatClass(ClassItem $item)
    {
        return [
            'id'            => $item->id,
            'title'         => $item->title,
            'slug'          => $item->slug,
            'price'         => $item->price,
            'category'      => $item->category,
            'topic'         => $item->topic,
            'external_link' => $item->external_link,
            'poster'        => $item->poster
                ? asset('storage/' . $item->poster)
                : null,
            'created_at'    => $item->created_at?->format('Y-m-d H:i'),
        ];
    }
}
