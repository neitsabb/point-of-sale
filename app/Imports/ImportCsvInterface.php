<?php 

namespace App\Imports;

interface ImportCsvInterface
{
    public function processRow(array $mappedRow, array $originalRow): array;
}