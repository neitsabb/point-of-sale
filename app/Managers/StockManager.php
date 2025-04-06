<?php

namespace App\Managers;

use App\Models\Ingredient;

class StockManager
{
	private const CONVERSION_FACTORS = [
		'kg' => ['g' => 1000],
		'l' => ['ml' => 1000, 'cl' => 100],
		'cl' => ['ml' => 10],
	];


	public function supply(Ingredient $ingredient, float $numberOfPackages, ?float $quantityPerPackage = null): void
	{
		$addedStock = $numberOfPackages * ($quantityPerPackage ?? $ingredient->purchase_unit_size);

		if ($ingredient->unit !== $ingredient->purchase_unit) {
			$addedStock *= $this->getConversionFactor(
				$ingredient->purchase_unit,
				$ingredient->unit
			);
		}

		$ingredient->stock_quantity += $addedStock;
		$ingredient->save();
	}

	public function consume(Ingredient $ingredient, float $soldQuantity): void
	{
		if ($ingredient->stock_quantity < $soldQuantity) {
			throw new \Exception("Not enough stock.");
		}

		$ingredient->stock_quantity -= $soldQuantity;
		$ingredient->save();
	}

	/**
	 * Retourne le facteur de conversion pour convertir une quantité d'une unité à une autre.
	 * @param string $fromUnit
	 * @param string $toUnit
	 * @throws \Exception
	 * @return float
	 */
	private function getConversionFactor(string $fromUnit, string $toUnit): float
	{
		if (isset(self::CONVERSION_FACTORS[$fromUnit][$toUnit])) {
			return self::CONVERSION_FACTORS[$fromUnit][$toUnit];
		}

		// Si la conversion inverse existe (kg to gr), on retourne l'inverse pour diviser
		if (isset(self::CONVERSION_FACTORS[$toUnit][$fromUnit])) {
			return 1 / self::CONVERSION_FACTORS[$toUnit][$fromUnit];
		}

		throw new \Exception("Conversion non supportée entre $fromUnit et $toUnit.");
	}
}
