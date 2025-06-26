<?php

namespace App\Models;

use App\Enums\IngredientUnit;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'image',
        'price',
        'auto_price_enabled',
        'round_price_enabled',
        'tax',
        'margin',
        'category_id',
        'reference',
        'is_visible',
        'remark',
        'has_skewers',
        'total_cl',
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
     */
    public function costPrice(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->ingredients->sum(
                fn($ingredient) => $ingredient->unit_price * $ingredient->pivot->quantity
            )
        );
    }

    /**
     * Calculate the price of the product without tax, without applying the margin.
     * This price is the base price without margin and tax.
     */
    public function sellingPriceWithoutTax(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->auto_price_enabled ? $this->cost_price : $this->price
        );
    }

    /**
     * Calculate the selling price with margin
     */
    public function sellingPriceWithMargin(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->selling_price_without_tax * (1 + $this->margin / 100)
        );
    }

    /**
     * Calculate the selling price with tax by applying the tax rate
     */
    public function sellingPriceWithTax(): Attribute
    {
        return Attribute::make(
            get: function () {
                $priceWithTax = $this->selling_price_with_margin * (1 + $this->tax / 100);
                return $this->round_price_enabled
                    ? $this->roundPrice($priceWithTax)
                    : round($priceWithTax, 2);
            }
        );
    }

    /**
     * Scope to filter products
     */
    public function scopeWithFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn($q, $search) => $q->search($search))
            ->when($filters['category_id'] ?? null, fn($q, $categoryId) => $q->forCategory($categoryId))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->withStatus($status));
    }

    /**
     * Search products by name
     */
    public function scopeSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->where('name', 'LIKE', "%{$searchTerm}%");
    }

    /**
     * Filter products by category
     */
    public function scopeForCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Filter products by status of ingredients
     */
    public function scopeWithStatus(Builder $query, string $status): Builder
    {
        return $query->whereHas('ingredients', function ($subQuery) use ($status) {
            match ($status) {
                'in_stock' => $subQuery->inStock(),
                'out_of_stock' => $subQuery->outOfStock(),
                'critical' => $subQuery->critical(),
                default => null
            };
        });
    }



    /**
     * Round the price to the nearest 0.30, 0.50 or 0.70
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
