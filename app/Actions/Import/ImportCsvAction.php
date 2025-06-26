<?php

namespace App\Actions\Import;

use App\Imports\ImportCsvInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Console\Concerns\InteractsWithIO;
use Symfony\Component\Console\Output\NullOutput;

class ImportCsvAction
{
    use InteractsWithIO;
    
    protected $output;

    public function __construct($output = null)
    {
        $this->output = $output ?? new NullOutput();
    }
    
    protected function info($message)
    {
        if ($this->output) {
            $this->output->writeln("<info>{$message}</info>");
        }
    }
    
    protected function error($message)
    {
        if ($this->output) {
            $this->output->writeln("<error>{$message}</error>");
        }
    }
    
    protected function warn($message)
    {
        if ($this->output) {
            $this->output->writeln("<comment>{$message}</comment>");
        }
    }
    
    /**
     * Convertit un nombre de jours Excel en date MySQL
     */
    protected function excelToMysqlDate($excelDate)
    {
        if (empty($excelDate) || !is_numeric($excelDate)) {
            return null;
        }
        
        // 25569 = nombre de jours entre 1900-01-01 et 1970-01-01
        $unixTimestamp = ($excelDate - 25569) * 86400; // 86400 secondes dans un jour
        return date('Y-m-d H:i:s', $unixTimestamp);
    }
    
    /**
     * Nettoie et convertit une chaîne de caractères
     */
    protected function cleanString($value)
    {
        if (!is_string($value)) {
            return $value;
        }
        
        // Convertir l'encodage si nécessaire
        $encoding = mb_detect_encoding($value, 'UTF-8, ISO-8859-1, WINDOWS-1252', true);
        if ($encoding !== 'UTF-8') {
            $value = mb_convert_encoding($value, 'UTF-8', $encoding);
        }
        
        // Nettoyer les caractères de contrôle et les espaces superflus
        $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value);
        return trim($value);
    }
    
    /**
     * Nettoie et convertit une valeur numérique
     */
    protected function cleanNumeric($value, $columnName = '')
    {
        if (is_numeric($value)) {
            return $value;
        }
        
        // Si c'est une chaîne, nettoyer et convertir
        if (is_string($value)) {
            // Remplacer les virgules par des points pour les nombres décimaux
            $value = str_replace(',', '.', $value);
            
            // Supprimer tout ce qui n'est pas un chiffre, un point ou un signe moins
            $value = preg_replace('/[^0-9.-]/', '', $value);
            
            // Si la chaîne est vide après nettoyage, retourner null
            if ($value === '') {
                return 0; // ou null selon votre préférence
            }
            
            // Convertir en float
            return (float) $value;
        }
        
        // Pour les autres types, essayer de caster en float
        return (float) $value;
    }

    public function execute(UploadedFile $file, array $columnMapping, ?string $modelClass, string $delimiter = ';', $importInstance = null) : int
    {
        $this->info("Démarrage de l'importation...");
        $this->info("Fichier : " . $file->getPathname());
        $this->info("Délimiteur : " . $delimiter);
        // Vérifier que le fichier existe et est lisible
        if (!file_exists($file->getPathname()) || !is_readable($file->getPathname())) {
            throw new \Exception("Le fichier n'existe pas ou n'est pas lisible");
        }

        // Lire le fichier CSV directement depuis le chemin avec gestion des erreurs
        ini_set('auto_detect_line_endings', true);
        $handle = @fopen($file->getPathname(), 'r');
        
        if ($handle === false) {
            throw new \Exception('Impossible d\'ouvrir le fichier CSV. Vérifiez les permissions.');
        }

        // Lire et nettoyer les en-têtes
        $this->info("Lecture des en-têtes...");
        $headers = fgetcsv($handle, 0, $delimiter);
        if ($headers === false) {
            fclose($handle);
            throw new \Exception('Le fichier CSV est vide ou mal formaté');
        }
        $headers = array_map('trim', $headers);
        
        // Afficher les en-têtes pour débogage
        $this->info("En-têtes détectés (" . count($headers) . " colonnes) : " . implode(', ', $headers));
        $this->info("Mapping des colonnes : " . json_encode($columnMapping, JSON_PRETTY_PRINT));
        
        // Afficher les premières lignes pour débogage
        $this->info("\nAperçu des premières lignes :");
        $previewLines = 0;
        $previewHandle = fopen($file->getPathname(), 'r');
        while (($row = fgetcsv($previewHandle, 0, $delimiter)) !== false && $previewLines < 3) {
            $this->info("Ligne " . ($previewLines + 1) . ": " . implode(' | ', array_map('trim', $row)));
            $previewLines++;
        }
        fclose($previewHandle);
        
        // Vérifier que toutes les colonnes requises sont présentes
        $missingColumns = array_diff(array_keys($columnMapping), $headers);
        if (!empty($missingColumns)) {
            fclose($handle);
            throw new \Exception('Colonnes manquantes dans le fichier CSV : ' . implode(', ', $missingColumns));
        }

        // Préparer le batch d'insertion
        $batchSize = 100;
        $data = [];
        $lineNumber = 1;
        $totalImported = 0;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $lineNumber++;

            if (count($row) !== count($headers)) {
                $this->warn("Ligne $lineNumber ignorée : nombre de colonnes incorrect (" . count($row) . " au lieu de " . count($headers) . ")");
                continue;
            }

            $rowData = array_combine($headers, $row);
            $this->info("Données brutes de la ligne $lineNumber : " . json_encode($rowData, JSON_PRETTY_PRINT));

            $mappedData = [];
            foreach ($columnMapping as $csvColumn => $dbColumn) {
                $value = $rowData[$csvColumn] ?? null;
                
                // Nettoyer la valeur si c'est une chaîne
                if (is_string($value)) {
                    $value = $this->cleanString($value);
                }
                
                // Conversion des dates Excel si nécessaire
                if ($dbColumn === 'created_at' || $dbColumn === 'updated_at') {
                    $value = $this->excelToMysqlDate($value);
                }
                
                // Nettoyer les valeurs numériques
                if (in_array($dbColumn, ['price', 'total_cl', 'tax', 'margin', 'purchase_price', 'purchase_quantity', 'stock_quantity', 'critical_stock'])) {
                    $value = $this->cleanNumeric($value, $dbColumn);
                }
                
                $mappedData[$dbColumn] = $value;
            }
            // Applique la logique custom (processRow) après le mapping, si elle existe
            if (isset($importInstance) && method_exists($importInstance, 'processRow')) {
                $mappedData = $importInstance->processRow($mappedData, $rowData);
            }

            $this->info("Données mappées de la ligne $lineNumber : " . json_encode($mappedData, JSON_PRETTY_PRINT));

            $data[] = $mappedData;

            if (count($data) >= $batchSize) {
                try {
                    // Déterminer le nom de la table cible
                    $tableName = $this->getTargetTableName($modelClass, $importInstance);
                    
                    // Insérer les données dans la table
                    DB::table($tableName)->insert($data);
                    $totalImported += count($data);
                    $data = []; // Réinitialise pour le prochain chunk
                } catch (\Exception $e) {
                    $this->error("Erreur à la ligne $lineNumber lors de l'insertion du lot : " . $e->getMessage());
                    $this->error("Détails de l'erreur : " . $e->getTraceAsString());
                }
            }
        }

        // Insère les lignes restantes
        if (!empty($data)) {
            try {
                // Déterminer le nom de la table cible
                $tableName = $this->getTargetTableName($modelClass, $importInstance);
                
                // Insérer les données dans la table
                DB::table($tableName)->insert($data);
                $totalImported += count($data);
            } catch (\Exception $e) {
                $this->error("Erreur lors de l'insertion du dernier lot : " . $e->getMessage());
                $this->error("Détails de l'erreur : " . $e->getTraceAsString());
            }
        }

        fclose($handle);
        return $totalImported;
    }
    
    /**
     * Détermine le nom de la table cible en fonction du modèle ou de l'instance d'import
     */
    /**
     * Détermine le nom de la table cible en fonction du modèle ou de l'instance d'import
     * 
     * @param string|null $modelClass Nom de la classe du modèle
     * @param ImportCsvInterface|null $importInstance Instance de l'import personnalisé
     * @return string
     * @throws \Exception Si la table cible ne peut pas être déterminée
     */
    protected function getTargetTableName(?string $modelClass, $importInstance = null): string
    {
        // Vérifier si on a une instance d'import personnalisée avec un nom de table
        if ($importInstance && $importInstance->getTableName()) {
            return $importInstance->getTableName();
        }
        
        // Si on a un modèle, on l'utilise directement
        if ($modelClass) {
            if (class_exists($modelClass)) {
                $model = new $modelClass;
                return $model->getTable();
            }
            // Sinon on considère que $modelClass est le nom de la table
            return $modelClass;
        }
        
        throw new \Exception("Impossible de déterminer la table cible pour l'importation");
    }
}
