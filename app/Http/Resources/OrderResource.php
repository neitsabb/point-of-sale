<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 *  @mixin \App\Models\Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->customer,
            'guests' => $this->guests,
            'type' => [
                'value' => $this->type,
                'label' => $this->type->label(),
            ],
            'products' => $this->whenLoaded(
                relationship: 'products',
                value: fn(): mixed => $this->products->map(
                    fn(Product $product): array => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'quantity' => $product->pivot?->quantity,
                        'price' => $product->price,
                    ]

                )
            ),
            'status' => [
                'value' => $this->status,
                'label' => $this->status->label(),
            ],
            'total_amount' => $this->total_amount,
            'created_at' => $this->created_at,
        ];
    }
}
