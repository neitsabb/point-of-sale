<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Classe de base pour l'importation de fichiers CSV
 * Fournit des fonctionnalités communes à tous les imports
 */
class GenericCsvImport implements ImportCsvInterface {
    /** @var string|null Nom de la classe du modèle cible */
    protected ?string $modelClass;
    
    /** @var array Mapping des colonnes CSV vers les champs de la base de données */
    protected array $mapping;
    
    /** @var string|null Nom de la table cible (utilisé pour les tables sans modèle) */
    protected ?string $tableName;

    /**
     * @param string|null $modelClass Nom de la classe du modèle cible
     * @param array $mapping Mapping des colonnes
     * @param string|null $tableName Nom de la table cible (pour les tables sans modèle)
     */
    public function __construct(?string $modelClass, array $mapping, ?string $tableName = null)
    {
        $this->modelClass = $modelClass;
        $this->mapping = $mapping;
        $this->tableName = $tableName;
    }
    
    /**
     * Récupère le nom de la classe du modèle
     */
    public function getModelClass(): ?string
    {
        return $this->modelClass;
    }
    
    /**
     * Récupère le mapping des colonnes
     */
    public function getMapping(): array
    {
        return $this->mapping;
    }
    
    /**
     * Récupère le nom de la table cible
     */
    public function getTableName(): ?string
    {
        return $this->tableName;
    }

    public function processRow(array $mappedRow, array $originalRow): array
    {
        // Par défaut, retourne la ligne inchangée
        return $mappedRow;
    }

    
}
