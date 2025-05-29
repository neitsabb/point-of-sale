<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Enums\OrderStatus;
use App\Models\Ingredient;
use App\Http\Resources\OrderResource;
use Illuminate\Http\RedirectResponse;
use App\Http\Resources\ProductResource;
use App\Http\Resources\CategoryResource;
use App\Actions\Orders\CreateOrderAction;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Resources\IngredientResource;
use App\Payment\PaymentResolver;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Render the order list view
     * @return \Inertia\Response
     */
    public function index(): \Inertia\Response
    {
        return inertia('orders/index', [
            'orders' => OrderResource::collection(
                Order::with([
                    'products.ingredients',
                    'products.category',
                ])->get()
            ),
        ]);
    }

    /**
     * Render the order completion view
     * @param \App\Models\Order $order
     * @return \Inertia\Response
     */
    public function complete(Order $order): \Inertia\Response
    {
        return inertia('orders/complete', [
            'order' => OrderResource::make($order),
            'products' => ProductResource::collection(
                Product::all()
            ),
            'categories' => CategoryResource::collection(
                Category::withCount('products')->get()
            ),
            'ingredients' => IngredientResource::collection(
                Ingredient::all()
            ),
        ]);
    }

    public function process(Order $order, Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:cash,credit_card',
            'payload' => 'required|array',
            'payload.amount_given' => 'required|numeric',
            'payload.total_htva' => 'required|numeric',
            'payload.total_ttc' => 'required|numeric',
            'products' => 'required|array',
        ]);

        $order->update([
            'total_amount' => $validated['payload']['total_ttc'],
        ]);

        $strategy = app(PaymentResolver::class)
            ->resolve($validated['payment_method']);

        $callback = $strategy->process($order, $validated['payload']);

        if ($callback['status'] === 'success') {
            $order->update([
                'is_paid' => true
            ]);
        }
    }

    /**
     * Create a new order
     * @param \App\Actions\Orders\CreateOrderAction $action
     * @param \App\Http\Requests\CreateOrderRequest $request
     * @return RedirectResponse
     */
    public function create(CreateOrderAction $action, CreateOrderRequest $request): RedirectResponse
    {
        $order = $action->handle($request->validated());

        return to_route('orders.complete', ['order' => $order]);
    }



    /**
     * Cancel an order
     * @param \App\Models\Order $order
     * @return RedirectResponse
     */
    public function cancel(Order $order): RedirectResponse
    {
        $order->update([
            'status' => OrderStatus::CANCELLED->value,
        ]);

        return to_route('orders.index');
    }
}
