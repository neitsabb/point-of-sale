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
            'unit' => $this->unit,
            'stock_quantity' => $this->stock_quantity,
            'critical_stock' => $this->critical_stock,
            'products_count' => $this->products_count ?: 0,
            'stock_status' => [
                'value' => $status,
                'label' => $status->label(),
            ],
        ];
    }
}
