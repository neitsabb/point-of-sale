<?php

namespace App\Models;

use App\Enums\ContainerUnit;
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
        'id',
        'name',
        'type',
        'critical_stock',
        'stock_quantity',
        'purchase_quantity',
        'purchase_price',
        'unit',
        'is_visible'
    ];

    protected $casts = [
        'on_card' => 'boolean',
        'price' => 'float',
        'stock_quantity' => 'float',
        'critical_stock' => 'float',
        'unit' => Unit::class,  
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '>', 'critical_stock');
    }

    /**
     * Prix unitaire de l'ingrédient selon son unité
     * - Pour les ingrédients en unités : prix par pièce
     * - Pour les liquides : prix par centilitre
     * 
     * @return Attribute
     */
    public function unitPrice(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->purchase_quantity > 0 
                ? round($this->purchase_price / $this->purchase_quantity, 2)
                : 0
        );
    }

    /**
     * Prix au centilitre (toujours en €/cl)
     * Utile pour les calculs avec les produits
     * 
     * @return float
     */
    

    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', 0);
    }

    public function scopeCritical($query): Builder
    {
        return $query->whereColumn('stock_quantity', '<=', 'critical_stock');
    }
}
