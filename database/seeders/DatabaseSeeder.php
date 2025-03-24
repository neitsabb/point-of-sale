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
            'Pain burger' => ['price' => 0.50, 'unit' => 'unit'],
            'Pain Bicky' => ['price' => 0.60, 'unit' => 'unit'],

            // Fromages
            'Cheddar' => ['price' => 0.80, 'unit' => 'unit'],
            'Gouda' => ['price' => 0.70, 'unit' => 'unit'],

            // Légumes
            'Salade' => ['price' => 0.03, 'unit' => 'g'],
            'Oignons frits' => ['price' => 0.02, 'unit' => 'g'],
            'Cornichons' => ['price' => 0.04, 'unit' => 'g'],

            // Viandes
            'Viande Classic' => ['price' => 0.03, 'unit' => 'g'], // 3€ les 100g
            'Viande Bicky' => ['price' => 0.025, 'unit' => 'g'], // 2.50€ les 100g
            'Viande Poulet' => ['price' => 0.028, 'unit' => 'g'], // 2.80€ les 100g
            'Bacon' => ['price' => 0.05, 'unit' => 'g'],

            // Sauces
            'Sauce Bicky' => ['price' => 0.25, 'unit' => 'ml'],
            'Sauce Poivre' => ['price' => 0.20, 'unit' => 'ml'],
        ])->map(function ($data, $name) {
            return Ingredient::firstOrCreate([
                'name' => $name,
                'price' => $data['price'],
                'unit' => $data['unit'],
                'stock_quantity' => rand(1000, 5000), // Quantités plus réalistes
                'critical_stock' => rand(500, 1000)
            ]);
        });

        $products = collect([
            // Burgers
            [
                'category' => 'Burgers',
                'name' => 'Burger Bicky',
                'tax' => 10,
                'ingredients' => [
                    ['name' => 'Pain Bicky', 'quantity' => 1],
                    ['name' => 'Viande Bicky', 'quantity' => 150],
                    ['name' => 'Sauce Bicky', 'quantity' => 20],
                    ['name' => 'Oignons frits', 'quantity' => 30],
                ]
            ],
            [
                'category' => 'Burgers',
                'name' => 'Chicken Burger',
                'tax' => 10,
                'ingredients' => [
                    ['name' => 'Pain burger', 'quantity' => 1],
                    ['name' => 'Viande Poulet', 'quantity' => 180],
                    ['name' => 'Salade', 'quantity' => 25],
                    ['name' => 'Cornichons', 'quantity' => 15],
                ]
            ],

            // Frites
            [
                'category' => 'Frites',
                'name' => 'Frites Classiques',
                'price' => 3.50,
                'tax' => 10
            ],
            [
                'category' => 'Frites',
                'name' => 'Frites Géantes',
                'price' => 5.00,
                'tax' => 10
            ],

            // Boissons
            [
                'category' => 'Boissons',
                'name' => 'Coca-Cola 33cl',
                'price' => 2.50,
                'tax' => 20
            ],
            [
                'category' => 'Boissons',
                'name' => 'Eau 50cl',
                'price' => 1.80,
                'tax' => 20
            ],

            // Sauces
            [
                'category' => 'Sauces',
                'name' => 'Sauce Andalouse',
                'price' => 0.70,
                'tax' => 10
            ],
            [
                'category' => 'Sauces',
                'name' => 'Sauce Samouraï',
                'price' => 0.70,
                'tax' => 10
            ],

            // Viandes
            [
                'category' => 'Viandes',
                'name' => 'Brochette de Poulet',
                'tax' => 10,
                'ingredients' => [
                    ['name' => 'Viande Poulet', 'quantity' => 200]
                ]
            ]
        ]);

        $products->each(function ($productData) use ($categories, $ingredients) {
            $category = $categories[$productData['category']];
            $autoPrice = isset($productData['ingredients']);

            $product = Product::create([
                'name' => $productData['name'],
                'category_id' => $category->id,
                'tax' => $productData['tax'],
                'auto_price_enabled' => $autoPrice,
                'price' => $autoPrice ?: $productData['price']
            ]);



            if (!empty($productData['ingredients'])) {
                $product->ingredients()->attach(collect($productData['ingredients'])->mapWithKeys(
                    fn($ing) => [$ingredients[$ing['name']]->id => ['quantity' => $ing['quantity']]]
                ));
            }
        });
    }
}
