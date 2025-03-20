<?php

namespace App\Http\Resources;

use App\Enums\StockStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 *  @mixin \App\Models\Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = StockStatus::IN;

        foreach ($this->ingredients as $ingredient) {
            if ($ingredient->stock_quantity == 0) {
                $status = StockStatus::OUT;
                break;
            }
            if ($ingredient->stock_quantity <= $ingredient->critical_stock) {
                $status = StockStatus::CRITICAL;
                break;
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => [
                'cost' => $this->cost_price,
                'without_tax' => $this->selling_price_without_tax, // Prix sans marge et sans TVA
                'with_margin' => $this->selling_price_with_margin, // Prix sans TVA, avec la marge appliquée
                'selling_price' => $this->selling_price_with_tax, // Prix TTC (avec marge et TVA)
                'tax' => $this->tax,
                'margin' => $this->margin,
                'auto_price_calculation' => $this->auto_price_enabled,
                'round_price_enabled' => $this->round_price_enabled,
            ],
            'cost_price' => $this->cost_price,
            'image' => Str::startsWith($this->image, 'http')
                ? $this->image
                : Storage::url($this->image),
            'category' => $this->category,
            'ingredients_count' => $this->ingredients_count ?: 0,
            'ingredients' => $this->whenLoaded(
                'ingredients',
                fn() => $this->ingredients->map(
                    fn($ingredient) => [
                        'id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'quantity' => $ingredient->pivot->quantity,
                    ]
                )
            ),
            'status' => [
                'value' => $status,
                'label' => $status->label(),
            ],
        ];
    }
}
