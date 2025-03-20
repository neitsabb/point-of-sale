<?php

namespace App\Enums;

enum OrderType: string
{
    case DINE_IN = 'dine-in';
    case TAKE_AWAY = 'take-away';

    public function label()
    {
        return match ($this) {
            self::DINE_IN => 'Sur place',
            self::TAKE_AWAY => 'A emporter',
        };
    }
}
