<?php

namespace App\Enums;

enum Unit: string
{
    case GRAM = 'g';
    case KILOGRAM = 'kg';
    case MILLILITER = 'ml';
    case CENTILITER = 'cl';
    case LITER = 'l';
    case UNIT = 'unit';

    public function label(): string
    {
        return match ($this) {
            self::GRAM => 'gramme',
            self::KILOGRAM => 'kilogramme',
            self::MILLILITER => 'millilitre',
            self::CENTILITER => 'centilitre',
            self::LITER => 'litre',
            self::UNIT => 'unité',
        };
    }

    public function symbol(): string
    {
        return match ($this) {
            self::GRAM => 'gr',
            self::KILOGRAM => 'kg',
            self::MILLILITER => 'ml',
            self::CENTILITER => 'cl',
            self::LITER => 'l',
            self::UNIT => 'unité',
        };
    }
}
