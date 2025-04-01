<?php

use App\Models\Ingredient;
use App\Models\User;


beforeEach(function () {

	$this->actingAs($user = User::factory()->create());

	$this->ingredient = Ingredient::factory()->create([
		'name' => 'Sauce',
		'unit' => 'ml',
		'stock_quantity' => 100, // 100 ml en stock
		'purchase_unit_size' => 100, // 100 ml par unité d'achat
		'purchase_unit' => 'bottle', // Bouteille d'achat de 100 ml
	]);
});

it('can supply an ingredient correctly', function () {
	$this
		->post(route('ingredients.supply', $this->ingredient), [
			'quantity' => 1, // 1 bouteille en plus
		])
		->assertRedirect();

	$this->assertEquals(200, $this->ingredient->fresh()->stock_quantity); // 200 ml en stock
});

it('can supply an ingredient with a different purchase unit size', function () {

	$this
		->post(route('ingredients.supply', $this->ingredient), [
			'quantity' => 1, // 1 bouteille en plus
			'purchase_unit_size' => 200, // 200 ml par bouteille
		])
		->assertRedirect();

	$this->assertEquals(300, $this->ingredient->fresh()->stock_quantity); // 200 ml en stock
});

it('can supply an ingredient with kg', function () {

	$ingredient = Ingredient::factory()->create([
		'name' => 'Flour',
		'unit' => 'kg',
		'stock_quantity' => 10, // 10 kg en stock
		'purchase_unit_size' => 1, // 1 kg par unité d'achat
		'purchase_unit' => 'bag', // Sac d'achat de 1 g
	]);

	$this
		->post(route('ingredients.supply', $ingredient), [
			'quantity' => 1, // 1 sac en plus
		])
		->assertRedirect();

	$this->assertEquals(11, $ingredient->fresh()->stock_quantity); // 11 kg en stock
});
