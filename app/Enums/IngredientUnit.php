<?php

namespace App\Enums;

enum IngredientUnit: string
{
    case GRAM = 'g';
    case KILOGRAM = 'kg';
    case MILLILITER = 'ml';
    case CENTILITER = 'cl';
    case LITER = 'l';
    case UNIT = 'unit';
}
