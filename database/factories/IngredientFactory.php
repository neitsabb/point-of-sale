<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ingredient>
 */
class IngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'price' => $this->faker->randomFloat(2, 0.29, 4.99),
            'image' => 'https://placehold.co/32x32',
            'description' => $this->faker->sentence(),

            'unit' => $this->faker->randomElement(['g', 'kg', 'ml', 'l']),
            'stock_quantity' => $this->faker->randomFloat(0, 0, 100),
            'critical_stock' => $this->faker->randomFloat(0, 0, 10),
        ];
    }
}
