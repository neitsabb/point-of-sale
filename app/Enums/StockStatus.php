<?php

namespace App\Enums;

enum StockStatus: string
{
    case OUT = 'out-of-stock';
    case IN = 'in-stock';
    case CRITICAL = 'critical-stock';

    public function label()
    {
        return match ($this) {
            self::OUT => 'En rupture',
            self::IN => 'En stock',
            self::CRITICAL => 'Stock critique',
        };
    }
}
