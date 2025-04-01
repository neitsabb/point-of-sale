<?php

use App\Enums\Unit;
use App\Managers\StockManager;
use App\Models\Ingredient;

it('can create an ingredient', function () {
	$ingredient = Ingredient::factory()->create([
		'name' => 'Sauce BBQ',
		'unit' => 'ml',
		'purchase_unit' => 'l',
		'purchase_unit_size' => 1.5,
		'purchase_price' => 3,
		'stock_quantity' => 150,
		'critical_stock' => 50,
	]);

	// Vérifie que l'ingrédient a été créé avec les bonnes valeurs
	expect($ingredient->name)->toBe('Sauce BBQ');
	expect($ingredient->purchase_unit)->toBe('l');
	expect($ingredient->purchase_unit_size)->toBe(1.5);
});

it('can supply ingredients with correct quantity', function () {
	$ingredient = Ingredient::factory()->create([
		'name' => 'Sauce BBQ',
		'unit' => 'ml',
		'purchase_unit' => 'ml',
		'purchase_unit_size' => 1000,
		'purchase_price' => 5,
		'stock_quantity' => 200,
		'critical_stock' => 50,
	]);


	// Vérifier le stock avant réapprovisionnement
	expect($ingredient->stock_quantity)->toBe(200);

	// Réapprovisionner l'ingrédient avec 2 bouteilles
	app(StockManager::class)
		->supply($ingredient, 2);

	// Vérifier que le stock a augmenté correctement
	expect($ingredient->stock_quantity)->toEqual(2200);
});

it('can supply ingredient with different purchase unit size', function () {
	$ingredient = Ingredient::factory()->create([
		'name' => 'Sauce BBQ',
		'unit' => 'ml',
		'purchase_unit' => 'ml',
		'purchase_unit_size' => 1500,
		'purchase_price' => 3.50,
		'stock_quantity' => 200,
		'critical_stock' => 50,
	]);

	// Vérifier le stock avant réapprovisionnement
	expect($ingredient->stock_quantity)->toBe(200);

	// Réapprovisionner l'ingrédient avec 2 bouteilles de 1L
	app(StockManager::class)
		->supply($ingredient, 2, 500);

	// Vérifier que le stock a augmenté correctement
	expect($ingredient->stock_quantity)->toEqual(1200);
});

it('can consume ingredients', function () {
	$ingredient = Ingredient::create([
		'name' => 'Sauce BBQ',
		'unit' => 'ml',
		'purchase_unit' => 'l',
		'purchase_unit_size' => 1.5,
		'purchase_price' => 4,
		'stock_quantity' => 500,
		'critical_stock' => 100,
	]);

	expect($ingredient->stock_quantity)->toBe(500);

	app(StockManager::class)
		->consume($ingredient, 50);

	expect($ingredient->stock_quantity)->toEqual(450);
});

it('calculates the price for unit-based ingredients correctly', function () {
	$purchasePrice = 3.50;
	$purchaseQuantity = 8;
	$ingredient = Ingredient::factory()->create([
		'purchase_price' => $purchasePrice,
		'purchase_unit_size' => $purchaseQuantity, // 8 unités par sachet
		'unit' => Unit::UNIT->value, // Unité de mesure de vente
		'purchase_unit' => Unit::UNIT->value, // Unité d'achat
	]);

	$expectedPrice = $purchasePrice / $purchaseQuantity;
	// Prix par unité = 3.50 / 8 = 0.4375 € par unité
	expect($ingredient->price)->toEqual($expectedPrice); // On arrondit à 2 décimales
});
