<?php

namespace App\Http\Controllers;

use App\Http\Resources\IngredientResource;
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
        ]);

        Ingredient::create($validated);

        return to_route('ingredients.index')->withSuccess('Ingredient created.');
    }
}
