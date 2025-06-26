<?php

namespace App\Console\Commands;

use App\Actions\Import\ImportCsvAction;
use App\Imports\CocktailIngredientCsvImport;
use App\Imports\GenericCsvImport;
use App\Imports\IngredientCsvImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ImportCsvCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:csv 
                            {file : Chemin vers le fichier CSV à importer}
                            {model : Modèle cible (ex: Product, Category, etc.)}
                            {--mapping= : Mapping des colonnes au format "colonne1:db_field1,colonne2:db_field2"}
                            {--delimiter=; : Délimiteur utilisé dans le fichier CSV (par défaut: ;)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importer des données depuis un fichier CSV';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $importCsvAction = new ImportCsvAction($this->output);
        $filePath = $this->argument('file');
        $modelName = $this->argument('model');
        $delimiter = $this->option('delimiter');
        
        // Valider le fichier
        if (!file_exists($filePath) || !is_readable($filePath)) {
            $this->error("Le fichier n'existe pas ou n'est pas lisible : $filePath");
            return 1;
        }
        
        // Obtenir la classe du modèle ou vérifier si c'est une table sans modèle
        $modelClass = $this->getModelClass($modelName);
        
        // Si ce n'est ni une table connue ni un modèle valide, on arrête
        if ($modelClass === null && !$this->isTableWithoutModel($modelName)) {
            $this->error("Modèle ou table non reconnu : $modelName");
            return 1;
        }
        
        // Lire les en-têtes du CSV
        $headers = $this->readCsvHeaders($filePath, $delimiter);
        if (empty($headers)) {
            $this->error('Impossible de lire les en-têtes du fichier CSV ou le fichier est vide.');
            return 1;
        }
        
        // Demander le mapping si non fourni
        $mapping = $this->getColumnMapping($headers);
        if (empty($mapping)) {
            $this->info('Aucun mapping fourni, annulation de l\'import.');
            return 0;
        }
        
        // Valider le mapping
        $validation = $this->validateMapping($mapping, $modelClass);
        if (!$validation['valid']) {
            $this->error($validation['message']);
            return 1;
        }
        
        // Lancer l'importation
        $this->info('Début de l\'importation...');
        
        try {
            // Créer une instance de UploadedFile à partir du fichier local
            $uploadedFile = new \Illuminate\Http\UploadedFile(
                $filePath,
                basename($filePath),
                mime_content_type($filePath),
                null,
                true // Marquer comme déjà déplacé
            );
            
            // Obtenir la classe d'import personnalisée si elle existe
            $importClass = $this->getImportClass($modelClass, $modelName);
            
            // Si c'est une table sans modèle, on passe le nom de la table
            if ($this->isTableWithoutModel($modelName)) {
                $importInstance = new $importClass(null, $mapping, $modelName);
            } else {
                $importInstance = new $importClass($modelClass, $mapping);
            }
            
            // Lancer l'importation avec l'action d'import CSV
            $importCsvAction = new ImportCsvAction($this->output);
            $count = $importCsvAction->execute(
                $uploadedFile,
                $mapping,
                $modelClass,
                $delimiter,
                $importInstance // Passer l'instance de l'import personnalisé
            );

            $this->info("\nImportation terminée avec succès. $count enregistrements importés.");
            return 0;
            
        } catch (\Exception $e) {
            $this->error('Erreur lors de l\'importation : ' . $e->getMessage());
            return 1;
        }
    }
    
    /**
     * Lire les en-têtes du fichier CSV
     */
    protected function readCsvHeaders(string $filePath, string $delimiter): array
    {
        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            return [];
        }
        
        $headers = fgetcsv($handle, 0, $delimiter);
        fclose($handle);
        
        return is_array($headers) ? array_map('trim', $headers) : [];
    }
    
    /**
     * Obtenir le mapping des colonnes
     */
    protected function getColumnMapping(array $headers): array
    {
        $mapping = [];
        $providedMapping = $this->option('mapping');
        
        // Si un mapping est fourni en option
        if (!empty($providedMapping)) {
            $pairs = explode(',', $providedMapping);
            foreach ($pairs as $pair) {
                if (str_contains($pair, ':')) {
                    [$csvColumn, $dbColumn] = explode(':', $pair, 2);
                    $mapping[trim($csvColumn)] = trim($dbColumn);
                }
            }
            return $mapping;
        }
        
        // Sinon, demander à l'utilisateur
        $this->info('Veuillez mapper les colonnes CSV aux champs de la base de données :');
        
        $dbColumns = $this->getModelFillable($this->argument('model'));
        
        foreach ($headers as $header) {
            $selected = $this->choice(
                "À quel champ de la base de données correspond la colonne '$header'? (Entrez pour ignorer)",
                array_merge(['' => 'Ignorer'], array_combine($dbColumns, $dbColumns)),
                '',
                10,
                false
            );
            
            if (!empty($selected)) {
                $mapping[$header] = $selected;
            }
        }
        
        return $mapping;
    }
    
    /**
     * Valider le mapping par rapport au modèle ou à la table
     */
    protected function validateMapping(array $mapping, ?string $modelClass): array
    {
        // Si c'est une table sans modèle, on ne peut pas valider les champs fillable
        if ($modelClass === null || $this->isTableWithoutModel($modelClass)) {
            return ['valid' => true];
        }
        
        $model = new $modelClass;
        $fillable = $model->getFillable();
        $guarded = $model->getGuarded();
        
        foreach ($mapping as $dbColumn) {
            if (in_array($dbColumn, $guarded)) {
                return [
                    'valid' => false,
                    'message' => "Le champ '$dbColumn' est protégé (guarded) et ne peut pas être rempli en masse."
                ];
            }
            
            if (!in_array($dbColumn, $fillable) && !in_array('*', $fillable)) {
                return [
                    'valid' => false,
                    'message' => "Le champ '$dbColumn' n'est pas remplissable (fillable) dans le modèle."
                ];
            }
        }
        
        return ['valid' => true];
    }
    
    /**
     * Vérifie si une table n'a pas de modèle associé
     */
    protected function isTableWithoutModel(string $modelName): bool
    {
        // Liste des tables qui n'ont pas de modèle associé
        $tablesWithoutModel = [
            'ingredient_product',
        ];
        
        return in_array($modelName, $tablesWithoutModel);
    }
    
    /**
     * Obtenir la classe complète du modèle
     */
    protected function getModelClass(string $modelName): ?string
    {
        // Si c'est une table sans modèle, on retourne null
        if ($this->isTableWithoutModel($modelName)) {
            return null;
        }
        
        $modelClass = 'App\\Models\\' . ucfirst($modelName);
        
        if (!class_exists($modelClass)) {
            return null;
        }
        
        return $modelClass;
    }
    
    /**
     * Obtenir la liste des colonnes d'une table
     */
    protected function getTableColumns(string $tableName): array
    {
        $schema = \DB::getSchemaBuilder();
        
        if (!$schema->hasTable($tableName)) {
            return [];
        }
        
        $columns = $schema->getColumnListing($tableName);
        
        // Exclure les colonnes timestamps si elles existent
        $columns = array_diff($columns, ['created_at', 'updated_at']);
        
        // Ajouter les timestamps à la fin si elles existent
        if ($schema->hasColumn($tableName, 'created_at')) {
            $columns[] = 'created_at';
        }
        if ($schema->hasColumn($tableName, 'updated_at')) {
            $columns[] = 'updated_at';
        }
        
        return $columns;
    }
    
    /**
     * Obtenir les champs remplissables du modèle ou les colonnes de la table
     */
    protected function getModelFillable(string $modelName): array
    {
        $modelClass = $this->getModelClass($modelName);
        
        // Si c'est une table sans modèle, on retourne ses colonnes
        if ($modelClass === null && $this->isTableWithoutModel($modelName)) {
            return $this->getTableColumns($modelName);
        }
        
        if ($modelClass === null) {
            return [];
        }
        
        $model = new $modelClass;
        $fillable = $model->getFillable();
        
        // Toujours inclure 'id' dans les options de mapping
        if (!in_array('id', $fillable)) {
            array_unshift($fillable, 'id');
        }
        
        return array_unique($fillable);
    }
    
    /**
     * Retourne la classe d'import à utiliser en fonction du modèle
     */
    protected function getImportClass(?string $modelClass, string $modelName = null): string
    {
        $importMap = [
            'App\\Models\\Ingredient' => IngredientCsvImport::class,
            'ingredient_product' => CocktailIngredientCsvImport::class,
        ];
        
        // Si on a un modèle, on essaie de le trouver dans la map
        if ($modelClass !== null) {
            return $importMap[$modelClass] ?? GenericCsvImport::class;
        }
        
        // Sinon, on essaie avec le nom du modèle
        if ($modelName !== null) {
            return $importMap[$modelName] ?? GenericCsvImport::class;
        }
        
        return GenericCsvImport::class;
    }

}
