<?php

namespace App\Managers;

use App\Models\Ingredient;

class StockManager
{
	public function supply(Ingredient $ingredient, float $purchaseQuantity, ?float $purchaseUnitSize = null): void
	{
		$ingredient->stock_quantity += $purchaseQuantity * ($purchaseUnitSize ?? $ingredient->purchase_unit_size);
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
}
