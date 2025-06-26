<?php

use App\Enums\ContainerUnit;
use App\Enums\IngredientUnit;
use App\Enums\Unit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();

            // $table->string('image')->nullable()
            //     ->default('https://placehold.co/32x32');

            $table->string('name');

            $table->enum('type', [
                'aperitif',
                'beer',
                'coffee',
                'cocktail',
                'digestif',
                'shooter',
                'smart_drink',
                'soft_drink',
                'vitamin_drink',
                'wine',
            ])->default('cocktail');

            $table->float('stock_quantity')
                ->default(0);

            $table->float('critical_stock')
                ->default(0);

            $table->boolean('is_visible')
                ->default(true);


            $table->enum(
                'unit',
                array_map(fn($unit) => $unit->value, Unit::cases())
            )->default(Unit::UNIT->value);

            $table->float('purchase_quantity')->default(1); 

            $table->float('purchase_price')->default(0); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
