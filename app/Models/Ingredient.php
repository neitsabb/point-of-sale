<?php

namespace App\Models;

use App\Enums\ContainerUnit;
use App\Enums\IngredientUnit;
use App\Enums\Unit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    /** @use HasFactory<\Database\Factories\IngredientFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'critical_stock',
        'stock_quantity',
        'unit',
        'purchase_unit',
        'purchase_unit_size',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '>', 'critical_stock');
    }



    public function price(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->purchase_price <= 0 || $this->purchase_unit_size <= 0) {
                    return 0;
                }

                // Si l'unité est unit, on divise le prix par la quantité contenu
                if ($this->unit === Unit::UNIT->value && $this->purchase_unit === Unit::UNIT->value) {
                    return $pricePerUnit = $this->purchase_price / $this->purchase_unit_size;
                }

                $pricePerUnit = $this->purchase_price;

                if (
                    $this->unit === Unit::GRAM->value && $this->purchase_unit === Unit::KILOGRAM->value ||
                    $this->unit === Unit::MILLILITER->value && $this->purchase_unit === Unit::LITER->value ||
                    $this->unit === Unit::GRAM->value && $this->purchase_unit === Unit::GRAM->value
                ) {
                    $pricePerUnit = ($pricePerUnit / 1000) * 100;
                }

                return round($pricePerUnit, 2);
            }
        );
    }






    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', 0);
    }

    public function scopeCritical($query): Builder
    {
        return $query->whereColumn('stock_quantity', '<=', 'critical_stock');
    }
}
