<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $categories = ['Burgers', 'Boissons', 'Frites', 'Sauces', 'Viandes'];

        foreach ($categories as $categoryName) {
            Category::factory()->create([
                'name' => $categoryName,
            ]);
        }

        $categories = Category::all();

        $products = Product::factory(50)->create()->each(function ($product) use ($categories) {
            $product->category()->associate($categories->random())->save();
        });

        $ingredients = Ingredient::factory(20)->create();

        foreach ($products as $product) {
            if (rand(0, 1)) {
                $randomIngredients = $ingredients->random(rand(1, 5));

                foreach ($randomIngredients as $ingredient) {
                    $product->ingredients()->attach($ingredient->id, [
                        'quantity' => rand(1, 20) / 10,
                    ]);
                }
            }
        }

        $orders = Order::factory(20)->create();

        foreach ($orders as $order) {
            $randomProducts = $products->random(min(rand(1, 5), $products->count()));

            foreach ($randomProducts as $product) {
                $product->orders()->attach($order->id, [
                    'quantity' => rand(1, 20) / 10,
                ]);
            }
        }
    }
}
