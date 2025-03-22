<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Http\RedirectResponse;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\IngredientResource;
use App\Http\Requests\StoreOrUpdateProductRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        return inertia('products', [
            'products' => ProductResource::collection(
                Product::withCount('ingredients')
                    ->with('ingredients', 'category')
                    ->withFilters(
                        $request->only(['search', 'category_id', 'status'])
                    )
                    ->paginate(10)
            ),
            'ingredients' => IngredientResource::collection(Ingredient::all()),
            'categories' => CategoryResource::collection(Category::all()),
            'filters' => $request->only(['search', 'category_id', 'status'])
        ]);
    }

    /**
     * Create a new product
     * @param \App\Http\Requests\StoreOrUpdateProductRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreOrUpdateProductRequest $request): RedirectResponse
    {
        $product = Product::create([
            ...$request->validated(),
            'price' => $request->input('price_without_tax'),
        ]);

        if ($request->has('ingredients')) {
            $product->ingredients()->sync(
                collect($request->input('ingredients'))
                    ->mapWithKeys(
                        fn($ingredient) => [$ingredient['id'] => ['quantity' => $ingredient['quantity']]]
                    )
            );
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')
                ->store('products', 'public');

            $product->image = $path;
            $product->save();
        }

        return redirect()->back()->withSuccess('Produit créé avec succès');
    }

    /**
     * Update an existing product
     * @param \App\Models\Product $product
     * @param \App\Http\Requests\StoreOrUpdateProductRequest $request
     */
    public function update(Product $product, StoreOrUpdateProductRequest $request): RedirectResponse
    {
        if ($request->has('ingredients')) {
            $product->ingredients()->sync(
                collect($request->input('ingredients'))
                    ->mapWithKeys(
                        fn($ingredient) => [$ingredient['id'] => ['quantity' => $ingredient['quantity']]]
                    )
            );
        }

        if ($request->hasFile('image')) {
            if ($product->image && Storage::exists($product->image)) {
                Storage::delete($product->image);
            }

            $path = $request->file('image')
                ->store('products', 'public');

            $product->image = $path;
        }

        $product->update([
            ...$request->validated(),
            'price' => $request->input('price_without_tax')
        ]);

        return redirect()->back()->withSuccess('Produit modifié avec succès');
    }
}
