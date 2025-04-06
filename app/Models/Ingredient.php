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
        'purchase_price'
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

                // Calculer le prix par unité d'achat
                $pricePerPurchaseUnit = $this->purchase_price / $this->purchase_unit_size;

                // Si les unités sont identiques, c'est simple
                if ($this->unit === $this->purchase_unit) {
                    return $pricePerPurchaseUnit;
                }

                // Gestion des conversions entre différentes unités
                // Cas 1 : grammes et kilogrammes
                if ($this->unit === 'g' && $this->purchase_unit === 'kg') {
                    return $pricePerPurchaseUnit / 1000;
                }

                // Cas 2 : millilitres et litres
                if ($this->unit === 'ml' && $this->purchase_unit === 'l') {
                    return $pricePerPurchaseUnit / 1000;
                }

                // Cas 3 : centilitres et litres
                if ($this->unit === 'cl' && $this->purchase_unit === 'l') {
                    return $pricePerPurchaseUnit / 100;
                }

                // Cas 4 : millilitres et centilitres
                if ($this->unit === 'ml' && $this->purchase_unit === 'cl') {
                    return $pricePerPurchaseUnit / 10;
                }

                // Cas 5 : kilogrammes et grammes (conversion inverse)
                if ($this->unit === 'kg' && $this->purchase_unit === 'g') {
                    return $pricePerPurchaseUnit * 1000;
                }

                // Cas 6 : litres et millilitres (conversion inverse)
                if ($this->unit === 'l' && $this->purchase_unit === 'ml') {
                    return $pricePerPurchaseUnit * 1000;
                }

                // Si aucune conversion n'est gérée, retourner simplement le prix par unité d'achat
                return $pricePerPurchaseUnit;
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
