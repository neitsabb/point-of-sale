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

            $table->string('image')->nullable()
                ->default('https://placehold.co/32x32');
            $table->string('name');

            $table->string('description')
                ->nullable();
            $table->enum(
                'unit',
                array_map(fn($unit) => $unit->value, Unit::cases())
            )->default(Unit::UNIT->value);
            $table->float('stock_quantity')
                ->default(0);
            $table->float('critical_stock')
                ->default(0);


            $table->enum(
                'purchase_unit',
                array_map(fn($unit) => $unit->value, array: array_merge(Unit::cases()))
            )->default(Unit::UNIT->value);
            $table->float('purchase_unit_size')->default(1); // Taille de l'unité d'achat
            $table->float('purchase_price')->default(0); // Prix d'achat de l'unité

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
