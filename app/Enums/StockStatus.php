<?php

namespace App\Enums;

enum StockStatus: string
{
    case OUT_OF_STOCK = 'out_of_stock';
    case IN_STOCK = 'in_stock';
    case LOW_STOCK = 'low_stock';

    public function label(): string
    {
        return match ($this) {
            self::OUT_OF_STOCK => 'En rupture',
            self::IN_STOCK => 'En stock',
            self::LOW_STOCK => 'Stock critique',
        };
    }
}
