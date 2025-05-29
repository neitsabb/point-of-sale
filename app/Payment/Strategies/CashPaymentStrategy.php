<?php

namespace App\Payment\Strategies;

use App\Payment\Contracts\PaymentInterface;

use App\Models\Order;
use Illuminate\Validation\ValidationException;

class CashPaymentStrategy implements PaymentInterface
{
	/**
	 * Process the payment for the given order.
	 *
	 * @param \App\Models\Order $order
	 * @parram array<{amount_given: float, total: float}> $payload
	 * @return mixed
	 */
	public function process(Order $order, array $payload): array
	{
		$amountGiven = $payload['amount_given'];
		$total = $payload['total_ttc'];

		if ($amountGiven < $total) {
			throw ValidationException::withMessages([
				'amount_given' => 'Montant insuffisant.',
			]);
		}

		$change = round($amountGiven - $total, 2);

		// TODO : update orger status paid
		// $order->update([
		// 		// 'is_paid' => true,
		// 		'status' => OrderStatus::PEN
		// ])

		return [
			'status' => 'success',
			'message' => 'Paiement effectué avec succès.',
			'change' => $change,
		];
	}
}
