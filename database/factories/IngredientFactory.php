<?php

namespace Database\Factories;

use App\Enums\Unit;
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
            'image' => 'https://placehold.co/32x32',
            'description' => $this->faker->sentence(),

            'unit' => $this->faker->randomElement(['g', 'kg', 'ml', 'l']),
            'stock_quantity' => $this->faker->randomFloat(0, 0, 100),
            'critical_stock' => $this->faker->randomFloat(0, 0, 10),
            'purchase_unit' => $this->faker->randomElement(Unit::cases()),
            'purchase_unit_size' => $this->faker->randomFloat(0, 1, 10),

        ];
    }
}
