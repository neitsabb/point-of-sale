<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';

    case CANCELLED = 'cancelled';

    case COMPLETED = 'completed';

    public function label()
    {
        return match ($this) {
            self::PENDING => 'En attente',
            self::COMPLETED => 'Terminée',
            self::CANCELLED => 'Annulée',
        };
    }
}
