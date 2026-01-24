<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\ClassItem;
use Illuminate\Http\Request;

class PublicClassController extends Controller
{
    public function byCategory(Request $request, string $category)
    {
        if (!in_array($category, [
            'shae-muslim',
            'shae-life',
            'shae-kreasi',
        ])) {
            return response()->json(['message' => 'Kategori tidak valid'], 404);
        }

        $query = ClassItem::query()
            ->select([
                'id',
                'title',
                'price',
                'category',
                'topic',
                'poster',
                'external_link',
            ])
            ->where('category', $category)
            ->where('status', 'published');

        // FILTER TOPIC
        if ($request->filled('topic') && $request->topic !== 'all') {
            $query->where('topic', $request->topic);
        }

        // SEARCH
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // SORT
        match ($request->get('sort')) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default      => $query->latest(),
        };

        $classes = $query->paginate(12);

        return response()->json([
            'data' => collect($classes->items())->map(fn ($item) => [
                'id'            => $item->id,
                'title'         => $item->title,
                'price'         => $item->price,
                'category'      => $item->category,
                'topic'         => $item->topic,
                'external_link' => $item->external_link,
                'poster'        => $item->poster
                    ? asset('storage/' . $item->poster)
                    : null,
            ]),
            'current_page' => $classes->currentPage(),
            'last_page'    => $classes->lastPage(),
        ]);
    }
}
