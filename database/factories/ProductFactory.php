<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->name(),
            'price' => $this->faker->randomFloat(2, 4, 10),
            'category_id' => Category::factory(),
            'tax' => $this->faker->randomElement([
                12,
                21,
                6,
            ]),
        ];
    }
}
