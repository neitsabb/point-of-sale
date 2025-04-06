<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('storage/{file}', function ($file) {
    return response()->file(storage_path('app/public/' . $file));
})->name('storage');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('/products')
        ->as('products.')
        ->group(function () {
            Route::get('/', [ProductController::class, 'index'])
                ->name('index');
            Route::post('/store', [ProductController::class, 'store'])
                ->name('store');
            Route::post('/{product}', [ProductController::class, 'update'])
                ->name('update');
        });

    Route::prefix('/ingredients')
        ->as('ingredients.')
        ->group(function () {
            Route::get('/', [IngredientController::class, 'index'])
                ->name('index');

            Route::post('/store', [IngredientController::class, 'store'])
                ->name('store');

            Route::put('/{ingredient}', [IngredientController::class, 'update'])
                ->name('update');

            Route::post('/supply/{ingredient}', [IngredientController::class, 'supply'])
                ->name('supply');
        });

    Route::prefix('/categories')
        ->as('categories.')
        ->group(function () {
            Route::get('/', [CategoryController::class, 'index'])
                ->name('index');

            Route::post('/store', [CategoryController::class, 'store'])
                ->name('store');
            Route::post('/{category}', [CategoryController::class, 'update'])
                ->name('update');
        });

    Route::prefix('/orders')
        ->as('orders.')
        ->group(function () {
            Route::get('/', [OrderController::class, 'index'])
                ->name('index');
            Route::post('/create', [OrderController::class, 'create'])
                ->name('create');
            Route::get('/{order}/complete', [OrderController::class, 'complete'])
                ->name('complete');

            Route::post('/{order}/cancel', [OrderController::class, 'cancel'])
                ->name('cancel');
        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
