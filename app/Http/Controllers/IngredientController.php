<?php

namespace App\Http\Controllers;

use App\Enums\StockStatus;
use App\Http\Resources\IngredientResource;
use App\Managers\StockManager;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class IngredientController extends Controller
{
    public function index()
    {
        return inertia('ingredients', [
            'ingredients' => IngredientResource::collection(
                Ingredient::withCount('products')->get()
            ),
            'status' => array_map(
                fn(StockStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ],
                StockStatus::cases()
            )
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'unit' => 'required|in:g,kg,ml,cl,l,unit',
            'stock_quantity' => 'required|numeric',
            'critical_stock' => 'required|numeric',
            'purchase_unit' => 'required|in:g,kg,ml,cl,l,unit',
            'purchase_unit_size' => 'required|numeric',
            'purchase_price' => 'required|numeric',
        ]);

        Ingredient::create($validated);

        return to_route('ingredients.index')->withSuccess('Ingredient created.');
    }

    public function update(Ingredient $ingredient, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'unit' => 'required|in:g,kg,ml,cl,l,unit',
            'stock_quantity' => 'required|numeric',
            'critical_stock' => 'required|numeric',
            'purchase_unit' => 'required|in:g,kg,ml,cl,l,unit',
            'purchase_unit_size' => 'required|numeric',
            'purchase_price' => 'required|numeric',
        ]);

        $ingredient->update($validated);

        return to_route('ingredients.index')->withSuccess('Ingredient created.');
    }

    public function supply(Ingredient $ingredient, Request $request)
    {
        $validated = $request->validate([
            'number_of_packages' => 'required|numeric',
            'quantity_per_package' => 'required|numeric',
        ]);

        // TODO : Catch exception
        app(StockManager::class)
            ->supply(
                $ingredient,
                $validated['number_of_packages'],
                $validated['quantity_per_package'] ?? null
            );

        return to_route('ingredients.index')->withSuccess('Ingredient supplied.');
    }
}
