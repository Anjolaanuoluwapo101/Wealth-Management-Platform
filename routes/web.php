<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('dashboard/data', [DashboardController::class,'save']);
    Route::get('dashboard/data', [DashboardController::class,'get']);
    Route::delete('/dashboard/data/{type}/{id}', [DashboardController::class, 'delete']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
