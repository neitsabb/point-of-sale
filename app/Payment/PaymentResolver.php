<?php

namespace App\Payment;

use App\Payment\Strategies\CashPaymentStrategy;
use InvalidArgumentException;

class PaymentResolver
{
	/**
	 * @param string $paymentMethod
	 */
	public function resolve(string $paymentMethod)
	{

		return match ($paymentMethod) {
			'cash' => app(CashPaymentStrategy::class),

			default => throw new InvalidArgumentException("Unsupported payment method: $paymentMethod"),
		};
	}
}
