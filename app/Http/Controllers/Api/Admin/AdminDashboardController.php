<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassItem;
use App\Models\Banner;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        try {
            // total kelas
            $totalClasses = ClassItem::count();

            // active classes
            $activeClasses = ClassItem::count(); // placeholder jika tidak ada kolom active

            // active banners
            $activeBanners = Banner::count(); // jika ada kolom status bisa filter

            // last update (ambil dari ClassItem updated_at terakhir)
            $lastClass = ClassItem::orderBy('updated_at', 'desc')->first();
            $lastUpdate = $lastClass ? $lastClass->updated_at->format('Y-m-d H:i:s') : Carbon::now()->format('Y-m-d H:i:s');

            return response()->json([
                'totalClasses' => $totalClasses,
                'activeClasses' => $activeClasses,
                'activeBanners' => $activeBanners,
                'lastUpdate' => $lastUpdate,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal fetch dashboard: ' . $e->getMessage()
            ], 500);
        }
    }
    public function chartActivity()
    {
        try {
            // Ambil jumlah total kelas
            $total = ClassItem::count();

            // Kita buat dummy chart 7 hari terakhir dengan distribusi sederhana
            $dates = collect(range(0, 6))->map(function ($i) {
                return Carbon::now()->subDays(6 - $i)->format('Y-m-d');
            });

            $chartData = $dates->map(function ($date) use ($total) {
                // Distribusi random atau proporsional
                $created = rand(0, max(1, (int)($total / 7)));
                $published = rand(0, $created); // published <= created

                return [
                    'date' => $date,
                    'created' => $created,
                    'published' => $published,
                ];
            });

            return response()->json($chartData);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal ambil data chart',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // AdminDashboardController.php
    public function dashboard()
    {
        try {
            // Total kelas
            $totalClasses = ClassItem::count();

            // Total banner aktif (misal ada kolom status)
            $activeBanners = Banner::where('status', 'active')->count();

            // Chart data: jumlah kelas & banner per hari selama 30 hari terakhir
            $chartData = collect();
            for ($i = 30; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $classes = ClassItem::whereDate('created_at', $date)->count();
                $banners = Banner::whereDate('created_at', $date)->count();
                $chartData->push([
                    'date' => $date,
                    'classes' => $classes,
                    'banners' => $banners,
                ]);
            }

            return response()->json([
                'totalClasses' => $totalClasses,
                'activeBanners' => $activeBanners,
                'chartData' => $chartData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal fetch dashboard: ' . $e->getMessage()
            ], 500);
        }
    }
}
