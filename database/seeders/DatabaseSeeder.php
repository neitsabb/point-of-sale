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
            'Pain burger' => [
                'unit' => 'unit',
                'purchase_unit' => 'unit', // Unité d'achat : sac
                'purchase_unit_size' => 10, // 10 pièces par sac
                'purchase_price' => 5.00, // 5.00€ le sac
            ],
            'Pain Bicky' => [
                'unit' => 'unit',
                'purchase_unit' => 'unit', // Unité d'achat : sac
                'purchase_unit_size' => 8, // 8 pièces par sac
                'purchase_price' => 4.80, // 4.80€ le sac
            ],

            // Fromages
            'Cheddar' => [
                'unit' => 'unit',
                'purchase_unit' => 'g', // Unité d'achat : sac
                'purchase_unit_size' => 500, // 500g par sac
                'purchase_price' => 4.00, // 4.00€ le sac
            ],
            'Gouda' => [
                'unit' => 'unit',
                'purchase_unit' => 'unit', // Unité d'achat : sac
                'purchase_unit_size' => 10, // 500g par sac
                'purchase_price' => 2.50, // 3.50€ le sac
            ],

            // Légumes
            'Salade' => [
                'unit' => 'g',
                'purchase_unit' => 'g', // Unité d'achat : sac
                'purchase_unit_size' => 1000, // 1kg par sac
                'purchase_price' => 1.50, // 0.50€ le sac
            ],
            'Oignons frits' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : sac
                'purchase_unit_size' => 500, // 500g par sac
                'purchase_price' => 2.5, // 2.50€ le sac
            ],
            'Cornichons' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : bocal
                'purchase_unit_size' => 1000, // 1L par bocal
                'purchase_price' => 4, // 4€ le jar
            ],

            // Viandes
            'Viande Classic' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : kilogramme
                'purchase_unit_size' => 1, // 1kg par unité
                'purchase_price' => 2.00, // 2.00€ le kilo
            ],
            'Viande Bicky' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : kilogramme
                'purchase_unit_size' => 1, // 1kg par unité
                'purchase_price' => 4.00, // 2.00€ le kilo
            ],
            'Viande Poulet' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : kilogramme
                'purchase_unit_size' => 1, // 1kg par unité
                'purchase_price' => 4.50, // 2.50€ le kilo
            ],
            'Bacon' => [
                'unit' => 'g',
                'purchase_unit' => 'kg', // Unité d'achat : kilogramme
                'purchase_unit_size' => 1, // 1kg par unité
                "purchase_price" => 5.00, // 5€ le kilo
            ],

            // Sauces
            'Sauce Bicky' => [
                'unit' => 'ml',
                'purchase_unit' => 'l', // Unité d'achat : bouteille
                'purchase_unit_size' => 500, // 500ml par bouteille
                'purchase_price' => 1.50, // 1.50€ la bouteille
            ],
            'Sauce Poivre' => [
                'unit' => 'ml',
                'purchase_unit' => 'l', // Unité d'achat : bouteille
                'purchase_unit_size' => 500, // 500ml par bouteille
                'purchase_price' => 1.50, // 1.50€ la bouteille
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
