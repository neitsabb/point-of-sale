<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'price',
        'auto_price_enabled',
        'round_price_enabled',
        'tax',
        'margin',
        'category_id',
    ];

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class)->withPivot('quantity');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class);
    }

    /**
     * Get the cost price of the product depends on ingredient's price
     * @return float|int
     */
    public function getCostPriceAttribute(): float|int
    {
        return $this->ingredients->sum(
            fn($ingredient) => $ingredient->price * $ingredient->pivot->quantity
        );
    }

    /**
     * Calculate the price of the product without tax, without applying the margin.
     * This price is the base price without margin and tax.
     * @return float
     */
    public function getSellingPriceWithoutTaxAttribute(): float
    {
        return $this->auto_price_enabled
            ? $this->cost_price
            : $this->price;
    }

    /**
     * Calculate the selling price with margin
     * @return float
     */
    public function getSellingPriceWithMarginAttribute(): float
    {
        return $this->selling_price_without_tax * (1 + $this->margin / 100);
    }

    /**
     * Calculate the selling price with tax by applying the tax rate
     * @return float
     */
    public function getSellingPriceWithTaxAttribute(): float
    {
        $priceWithTax = $this->selling_price_with_margin * (1 + $this->tax / 100);

        return $this->round_price_enabled
            ? $this->roundPrice($priceWithTax)
            : round($priceWithTax, 2);
    }


    /**
     * Round the price to the nearest 0.30, 0.50 or 0.70
     * @param float $price
     * @return float
     */
    private function roundPrice(float $price): float
    {
        $validCents = [0, 30, 50, 70];
        $cents = round($price * 100); // Convertir en centimes
        $euros = floor($cents / 100); // Partie entière en euros
        $remainder = $cents % 100;

        $closest = array_reduce(
            $validCents,
            fn($prev, $curr) => abs($curr - $remainder) < abs($prev - $remainder)
                ? $curr
                : $prev,
            $validCents[0]
        );

        return $euros + $closest / 100;
    }
}
