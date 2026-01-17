<?php

use Illuminate\Support\Facades\Route;

// Homepage
Route::get('/', function () {
    return view('app', ['category' => null]); // HomePage tidak pakai category
});

// Category pages
Route::get('/shaemuslim', function () {
    return view('app', ['category' => 'muslim']);
});

Route::get('/shaelife', function () {
    return view('app', ['category' => 'life']);
});

Route::get('/shaeprofesional', function () {
    return view('app', ['category' => 'profesional']);
});

// Optional: fallback
Route::get('/{any}', function () {
    return view('app', ['category' => null]);
})->where('any', '.*');


