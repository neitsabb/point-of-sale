<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'type',
        'customer',
        'guests',
        'total_amount',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => OrderType::class,
            'status' => OrderStatus::class,
            'created_at' => 'datetime',
        ];
    }

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn(string $value) => ucfirst(Carbon::parse($value)
                ->translatedFormat('l j F Y, H:i')),
        );
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity');
    }
}
