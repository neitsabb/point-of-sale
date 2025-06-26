<?php

namespace App\Imports;

use App\Imports\GenericCsvImport;
use App\Enums\Unit;

/**
 * Classe d'importation pour les ingrédients
 * Gère la logique spécifique à l'importation des ingrédients
 */
class IngredientCsvImport extends GenericCsvImport
{
    /**
     * @inheritDoc
     */
    public function __construct(?string $modelClass, array $mapping, ?string $tableName = null)
    {
        parent::__construct($modelClass, $mapping, $tableName);
    }
    /**
     * Process a row from the CSV file
     * @param array $mappedRow - Row mapped to the database
     * @param array $originalRow - Row from the CSV file
     * @return array
     */
    public function processRow(array $mappedRow, array $originalRow): array
    {
        // 1. Gestion du type - conversion du type numérique en valeur textuelle
        if (isset($originalRow['TYPE'])) {
            $mappedRow['type'] = $this->mapType($originalRow['TYPE']);
        }
        
        // 2. Gestion de l'unité - vérifie si Quantite ou StockTotalEntree = 1
        $isUnite = false;
        if (isset($originalRow['Quantite']) && $originalRow['Quantite'] == 1) {
            $isUnite = true;
        } elseif (isset($originalRow['StockTotalEntree']) && $originalRow['StockTotalEntree'] == 1) {
            $isUnite = true;
        }
        
        // Définit l'unité en fonction de la condition
        $mappedRow['unit'] = $isUnite ? Unit::UNIT->value : Unit::CENTILITER->value;
        
        
        return $mappedRow;
    }
    
    /**
     * Convertit le type numérique en valeur textuelle
     */
    protected function mapType($typeId): string
    {
        // Convertir en entier si c'est une chaîne numérique
        if (is_string($typeId) && is_numeric(trim($typeId))) {
            $typeId = (int) trim($typeId);
        }
        
        $types = [
            1 => 'aperitif',
            2 => 'beer',
            3 => 'coffee',
            4 => 'cocktail',
            5 => 'digestif',
            6 => 'shooter',
            7 => 'smart_drink',
            8 => 'soft_drink',
            9 => 'vitamin_drink',
            10 => 'wine',
        ];
        
        // Journalisation pour le débogage
        $result = $types[$typeId] ?? 'cocktail';
        \Log::info("Type mapping - Input: " . print_r($typeId, true) . ", Output: " . $result);
        
        return $result;
    }
}
