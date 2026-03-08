<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminClassController;
use App\Http\Controllers\Api\Admin\AdminBannerController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Public\PublicBannerController;
use App\Http\Controllers\Api\Public\PublicClassController;


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // AUTH
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/verify-otp', [AdminAuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [AdminAuthController::class, 'resendOtp']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        route::get('/dashboard-stats', [AdminDashboardController::class, 'index']);
        route::get('/chart-activity', [AdminDashboardController::class, 'chartActivity']);


        Route::apiResource('classes', AdminClassController::class)
            ->except(['create', 'edit']);

        Route::apiResource('banners', AdminBannerController::class)
            ->except(['create', 'edit']);

        Route::patch('banners/{id}/toggle', [AdminBannerController::class, 'toggle']);
    });
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('public')->group(function () {

    Route::get('/banners/{category}', [PublicBannerController::class, 'byCategory'])
        ->whereIn('category', [
            'shae-academy',
            'shae-muslim',
            'shae-life',
            'shae-profesional',
        ]);

    Route::get('/classes/category/{category}', [PublicClassController::class, 'byCategory']);
});


