<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Ingredient;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('creates a product and it appears in the list with correct price values', function () {
	$this->actingAs($user = User::factory()->create());

	$this
		->post(route('products.store'), [
			'name' => 'Test Product',
			'auto_price_enabled' => false,
			'round_price_enabled' => false,
			'price_without_tax' => 10,
			'tax' => 21,
			'margin' => 20,
			'ingredients' => [],
			'category_id' => Category::factory()->create()->id,
		])
		->assertRedirect();

	$this
		->get(route('products.index'))
		->assertInertia(
			fn($page) =>
			$page->component('products')
				->has('products.data', 1)
				->where('products.data.0.name', 'Test Product')
				->where('products.data.0.price.without_tax', 10)
				->where('products.data.0.price.with_margin', 12)
				->where('products.data.0.price.selling_price', 14.52)
		);
});

it('updates a product and it appears in the list with correct price values', function () {
	$this->actingAs($user = User::factory()->create());

	$product = Product::factory()->create([
		'name' => 'Old Product',
		'auto_price_enabled' => false,
		'round_price_enabled' => false,
		'price' => 5,
		'tax' => 20,
		'margin' => 10,
		'category_id' => Category::factory()->create()->id,
	]);


	$this
		->post(route('products.update', $product), [
			'name' => 'Updated Product',
			'auto_price_enabled' => false,
			'round_price_enabled' => false,
			'price_without_tax' => 15,
			'tax' => 21,
			'margin' => 20,
			'ingredients' => [],
			'category_id' => $product->category_id,
		])
		->assertRedirect();

	$this
		->get(route('products.index'))
		->assertInertia(
			fn($page) =>
			$page->component('products')
				->has('products.data', 1)
				->where('products.data.0.name', 'Updated Product')
				->where('products.data.0.price.without_tax', 15)
				->where('products.data.0.price.with_margin', 18)
				->where('products.data.0.price.selling_price', 21.78)
		);
});
