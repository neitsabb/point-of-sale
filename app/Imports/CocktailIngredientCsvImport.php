<?php

namespace App\Imports;

use App\Models\Ingredient;
use App\Models\Product;

/**
 * Classe d'importation pour la table pivot des ingrédients de cocktails
 * Gère la validation et la transformation des données spécifiques à cette table
 */
class CocktailIngredientCsvImport extends GenericCsvImport
{
    /**
     * @inheritDoc
     */
    public function __construct(?string $modelClass, array $mapping, ?string $tableName = null)
    {
        parent::__construct($modelClass, $mapping, $tableName);
    }
    
    public function processRow(array $mappedRow, array $originalRow): array
    {
        // Convertir les IDs en entiers
        $mappedRow['ingredient_id'] = (int)$mappedRow['ingredient_id'];
        $mappedRow['product_id'] = (int)$mappedRow['product_id'];
        
        // Convertir la quantité en float
        $mappedRow['quantity'] = (float)str_replace(',', '.', $mappedRow['quantity']);
        
        // Vérifier que l'ingrédient et le produit existent
        if (!Ingredient::where('id', $mappedRow['ingredient_id'])->exists()) {
            throw new \Exception("L'ingrédient avec l'ID {$mappedRow['ingredient_id']} n'existe pas");
        }
        
        if (!Product::where('id', $mappedRow['product_id'])->exists()) {
            throw new \Exception("Le produit avec l'ID {$mappedRow['product_id']} n'existe pas");
        }
        
        return $mappedRow;
    }
}
