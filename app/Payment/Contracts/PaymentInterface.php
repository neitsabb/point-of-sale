<?php

namespace App\Payment\Contracts;

use App\Models\Order;

interface PaymentInterface
{
	/**
	 * Process the payment for the given order.
	 *
	 * @param \App\Models\Order $order
	 * @return mixed
	 */
	public function process(Order $order, array $payload);

	// /**
	//  * Refund the payment for the given order.
	//  *
	//  * @param \App\Models\Order $order
	//  * @return mixed
	//  */
	// public function refund(Order $order);
}
