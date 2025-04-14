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
        // User::factory()->create([
        //     'email' => 'test@example.com',
        //     'password' => 'password',
        // ]);

        $categories = collect([
            'Burgers',
            'Boissons',
            'Frites',
            'Sauces',
            'Viandes'
        ])->mapWithKeys(fn($categoryName) => [
            $categoryName => Category::firstOrCreate(['name' => $categoryName])
        ]);

        $ingredients = collect([
            // Base
            'Pain Bicky' => [
                'unit' => 'unit',
                'purchase_unit' => 'unit', // Unité d'achat : sac
                'purchase_unit_size' => 6, // 8 pièces par sac
                'purchase_price' => 1.19, // 4.80€ le sac
            ],
            'Cheddar' => [
                'unit' => 'unit',
                'purchase_unit' => 'unit', // Unité d'achat : sac
                'purchase_unit_size' => 10, // 500g par sac
                'purchase_price' => 1.75, // 4.00€ le sac
            ],
            'Salade' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : sac
                'purchase_unit_size' => 1, // 1kg par sac
                'purchase_price' => 1, // 0.50€ le sac
            ],
            'Oignons frits' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : sac
                'purchase_unit_size' => 1, // 500g par sac
                'purchase_price' => 7.90, // 2.50€ le sac
            ],
            'Cornichons' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : bocal
                'purchase_unit_size' => 1, // 1L par bocal
                'purchase_price' => 6.99, // 4€ le jar
            ],

            'Viande Bicky' => [
                'unit' => 'unit',
                'purchase_unit' => 'unit', // Unité d'achat : kilogramme
                'purchase_unit_size' => 30, // 1kg par unité
                'purchase_price' => 26.91, // 2.00€ le kilo
            ],
            // Sauces
            'Sauce Bicky' => [
                'unit' => 'ml',
                'purchase_unit' => 'ml', // Unité d'achat : bouteille
                'purchase_unit_size' => 350, // 500ml par bouteille
                'purchase_price' => 8, // 1.50€ la bouteille
            ],
        ])->map(function ($data, $name) {
            return Ingredient::factory()->create([
                'name' => $name,
                'unit' => $data['unit'],
                'stock_quantity' => rand(1000, 5000),
                'critical_stock' => rand(500, 1000),
                'purchase_unit' => $data['purchase_unit'],
                'purchase_unit_size' => $data['purchase_unit_size'],
                'purchase_price' => $data['purchase_price'],
            ]);
        });
    }
}
