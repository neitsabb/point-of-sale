<?php

namespace App\Http\Controllers;

use App\Http\Resources\IngredientResource;
use App\Managers\StockManager;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index()
    {
        return inertia('ingredients', [
            'ingredients' => IngredientResource::collection(
                Ingredient::withCount('products')->get()
            ),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|numeric',
            'critical_stock' => 'required|numeric',
            'unit' => 'required|in:g,kg,ml,cl,l,unit',
            'purchase_unit' => 'required',
            'purchase_unit_size' => 'required|numeric',
        ]);

        Ingredient::create($validated);

        return to_route('ingredients.index')->withSuccess('Ingredient created.');
    }

    public function supply(Ingredient $ingredient, Request $request)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric',
            'purchase_unit_size' => 'nullable|numeric'
        ]);

        app(StockManager::class)
            ->supply($ingredient, $validated['quantity'], $validated['purchase_unit_size'] ?? null);

        return to_route('ingredients.index')->withSuccess('Ingredient supplied.');
    }
}
