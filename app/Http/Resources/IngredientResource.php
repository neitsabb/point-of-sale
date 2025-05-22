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

        $status = StockStatus::IN;

        if ($this->stock_quantity == 0) {
            $status = StockStatus::OUT;
        } elseif ($this->stock_quantity <= $this->critical_stock) {
            $status = StockStatus::CRITICAL;
        }

        return [
            'id' => $this->id,
            'image' => $this->image,
            'name' => $this->name,
            'description' => $this->description ?: 'No description',
            'price' => $this->price,
            'price_display' => number_format(
                in_array($this->unit->value, ['g', 'ml', 'cl']) ? $this->price * 100 : $this->price,
                2,
                ',',
                ' '
            ) . '€/' . match ($this->unit->value) {
                'g' => '100gr',
                'ml' => '100ml',
                'cl' => '100cl',
                default => 'unité',
            },
            'unit' => [
                'value' => $this->unit,
                'symbol' => $this->unit->symbol(),
                'label' => $this->unit->label(),
            ],
            'stock_quantity' => $this->stock_quantity,
            'stock_quantity_display' => $this->stock_quantity . ' '
                . $this->unit->symbol()
                . ($this->unit->value === 'unit' && $this->stock_quantity > 1 ? 's' : ''),
            'critical_stock' => $this->critical_stock,
            'products_count' => $this->products_count ?: 0,
            'stock_status' => [
                'value' => $status,
                'label' => $status->label(),
            ],
            'purchase_unit' => [
                'value' => $this->purchase_unit,
                'symbol' => $this->purchase_unit->symbol(),
                'label' => $this->purchase_unit->label(),
            ],
            'purchase_price' => $this->purchase_price,
            'purchase_price_display' => number_format($this->purchase_price, 2, ',', ' ')
                . ' €/'
                . $this->purchase_unit_size
                . $this->purchase_unit->symbol()
                . ($this->unit->value === 'unit' && $this->purchase_unit_size > 1 ? 's' : ''),
            'purchase_unit_size' => $this->purchase_unit_size,
        ];
    }
}
