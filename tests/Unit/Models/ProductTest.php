<?php

use App\Models\Ingredient;
use App\Models\Product;

it('to array', function () {
    $product = Product::factory()->create()->refresh();

    expect(array_keys($product->toArray()))
        ->toEqualCanonicalizing([
            'id',
            'image',
            'name',
            'price',
            'auto_price_enabled',
            'round_price_enabled',
            'tax',
            'margin',
            'category_id',
            'created_at',
            'updated_at',
        ]);
});

it('belongs to a category', function () {
    $product = Product::factory()->create();

    expect($product->category)->toBeInstanceOf(\App\Models\Category::class);
});

it('may have ingredients', function () {
    $product = Product::factory()->hasIngredients(5)->create();

    expect($product->ingredients)->toHaveCount(5);
});

it('calculates the cost price', function () {
    $product = Product::factory()->create();

    $ingredient1 = Ingredient::factory()->create(['purchase_unit_size' => 8, 'purchase_price' => 3.50]);
    $ingredient2 = Ingredient::factory()->create(['purchase_unit_size' => 8, 'purchase_price' => 3.50]);

    $product->ingredients()->attach([$ingredient1->id => ['quantity' => 2]]);
    $product->ingredients()->attach([$ingredient2->id => ['quantity' => 3]]);

    expect($product->cost_price)->toEqual((3.50 / 8) * 2 + (3.50 / 8)  * 3);
});

it('calcules the price with margin', function () {
    $margin = 20;
    $priceWithoutTax = 10;

    $product = Product::factory()->create([
        'margin' => $margin,
        'price' => $priceWithoutTax,
        'auto_price_enabled' => false,
    ]);

    expect($product->selling_price_with_margin)->toEqual($priceWithoutTax * (1 + $margin / 100));
});

it('calculates the selling price when auto_price is true', function () {
    $marge = 20;
    $tva = 21;

    $ingredient1 = Ingredient::factory()->create(['purchase_unit_size' => 8, 'purchase_price' => 3.50]);
    $ingredient2 = Ingredient::factory()->create(['purchase_unit_size' => 8, 'purchase_price' => 3.50]);

    $product = Product::factory()->create([
        'auto_price_enabled' => true,
        'tax' => $tva,
        'margin' => $marge,
    ]);

    $product->ingredients()->attach([$ingredient1->id => ['quantity' => 2]]);
    $product->ingredients()->attach([$ingredient2->id => ['quantity' => 3]]);

    $costPrice = (3.50 / 8) * 2 + (3.50 / 8)  * 3; // 10 + 9 = 19€
    $priceWithMargin = $costPrice * (1 + $marge / 100); // 19 * 1.2 = 22.8€
    $sellingPrice = round($priceWithMargin * (1 + $tva / 100), 2); // 22.8 * 1.21 = 27.61€

    expect($product->selling_price_with_tax)->toEqual($sellingPrice);
});

it('calculates the selling price when auto_price is false', function () {
    $marge = 20;
    $tva = 21;
    $priceWithoutTax = 10;

    $product = Product::factory()->create([
        'auto_price_enabled' => false,
        'tax' => $tva,
        'margin' => $marge,
        'price' => $priceWithoutTax,
    ]);

    $priceWithMargin = $priceWithoutTax * (1 + $marge / 100);
    $sellingPrice = round($priceWithMargin * (1 + $tva / 100), 2);

    expect($product->selling_price_with_tax)->toEqual($sellingPrice);
});

it('rounds the price when round_price_enabled is true', function () {
    $product = Product::factory()->create([
        'price' => 10.35,
        'tax' => 0,
        'round_price_enabled' => true,
    ]);

    expect($product->selling_price_with_tax)->toEqual(10.30);
});
