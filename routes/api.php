<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminClassController;

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // 🔐 AUTH
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/verify-otp', [AdminAuthController::class, 'verifyOtp']);

    Route::middleware('auth:sanctum')->group(function () {

        // 👤 SESSION
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // 📦 CRUD KELAS (ADMIN)
        Route::apiResource('classes', AdminClassController::class)
            ->except(['create', 'edit']);
    });
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (TANPA LOGIN)
|--------------------------------------------------------------------------
*/
Route::get('/classes/{category}', [
    AdminClassController::class,
    'publicByCategory'
]);
