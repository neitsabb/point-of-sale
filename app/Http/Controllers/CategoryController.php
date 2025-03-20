<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return inertia('categories', [
            'categories' => CategoryResource::collection(
                Category::withCount('products')->get()
            ),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
        ]);

        Category::create($validated);

        return redirect()->back()->withSuccess('Catégorie créée avec succès');
    }

    public function update(Category $category, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
        ]);

        $category->update($validated);

        return redirect()->back()->withSuccess('Catégorie modifiée avec succès');
    }
}
