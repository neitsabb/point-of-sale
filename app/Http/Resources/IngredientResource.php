<?php

namespace App\Http\Resources;

use App\Enums\StockStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 *  @mixin \App\Models\Ingredient
 */
class IngredientResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {

        $status = StockStatus::IN_STOCK;

        if ($this->stock_quantity === 0) {
            $status = StockStatus::OUT_OF_STOCK;
        } elseif ($this->stock_quantity <= $this->critical_stock) {
            $status = StockStatus::LOW_STOCK;
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description ?: 'No description',
            'type' => $this->type,
            'unit_price' => [
                'value' => $this->unit_price,
                'display' => "$this->unit_price € / " . $this->unit->symbol()
            ],
            'purchase_price'=> [
                'value' => $this->purchase_price,
                'display' => "$this->purchase_price € / $this->purchase_quantity" . $this->unit->symbol()
            ],
            'stock_quantity' => $this->stock_quantity,
            'critical_stock' => $this->critical_stock,
            'products_count' => $this->products_count ?: 0,
            'is_visible' => $this->is_visible ?? false,
            'unit' => [
                'value' => $this->unit,
                'label' => $this->unit->label(),
                'symbol' => $this->unit->symbol()
            ],
            'stock_status' => [
                'value' => $status,
                'label' => $status->label(),
            ],
        ];
    }
}
