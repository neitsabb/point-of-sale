<?php

namespace App\Actions\Orders;

use App\Models\Order;

final class CreateOrderAction
{
    /**
     * Create a new order
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): Order
    {
        return Order::create($data);
    }
}
