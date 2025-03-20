<?php

namespace App\Http\Controllers;

use App\Http\Resources\IngredientResource;
use App\Models\Ingredient;

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
}
