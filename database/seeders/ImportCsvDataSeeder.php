<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class ImportCsvDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('Début de l\'importation des données CSV...');

        // Import des cocktails
        $this->command->info('Importation des cocktails...');
        Artisan::call('import:csv', [
            'file' => 'src/csv/cocktails.csv',
            'model' => 'Product',
            '--mapping' => 'ID:id,Nom:name,Reference:reference,EstDansCarte:is_visible,Remarque:remark,Sync_Prix:price,Quantite:total_cl,estBrochette:has_skewers'
        ]);
        $this->command->info('Cocktails importés avec succès.');

        // Import des ingrédients
        $this->command->info('Importation des ingrédients...');
        Artisan::call('import:csv', [
            'file' => 'src/csv/ingredients.csv',
            'model' => 'Ingredient',
            '--mapping' => 'ID:id,Nom:name,TYPE:type,Prix:purchase_price,Quantite:stock_quantity,StockTotalEntree:purchase_quantity'
        ]);
        $this->command->info('Ingrédients importés avec succès.');

        // Import de la table pivot cocktails-ingredients
        $this->command->info('Importation des relations cocktails-ingrédients...');
        Artisan::call('import:csv', [
            'file' => 'src/csv/cocktails-ingredients.csv',
            'model' => 'ingredient_product',
            '--mapping' => 'ID_INGREDIENT:ingredient_id,ID_COCKTAIL:product_id,Quantite:quantity,Ordre:order'
        ]);
        $this->command->info('Relations cocktails-ingrédients importées avec succès.');

        $this->command->info('Toutes les données ont été importées avec succès !');
    }
}
