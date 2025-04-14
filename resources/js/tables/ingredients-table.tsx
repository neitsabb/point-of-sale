import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { renderStockStatusEnum } from '@/lib/utils';
import { Ingredient, StockStatus } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export const columns = (onEdit: (ingredient: Ingredient) => void, onSupply: (ingredient: Ingredient) => void): ColumnDef<Ingredient>[] => [
    {
        accessorKey: 'name',
        header: 'Nom',
    },

    {
        accessorKey: 'price',
        header: 'Prix unitaire',
        cell: ({ row }) => {
            let price = parseFloat(row.getValue('price'));
            const unit = row.original.unit;

            // Multiplier par 100 pour g, ml, cl pour obtenir le prix par 100 unités
            if (unit === 'g' || unit === 'ml' || unit === 'cl') {
                price = price * 100;
            }

            const formatted = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            }).format(price);

            return `${formatted}/${unit === 'g' ? '100gr' : unit === 'ml' ? '100ml' : unit === 'cl' ? '100cl' : 'unité'}`;
        },
    },
    {
        accessorKey: 'purchase_price',
        header: "Prix d'achat",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('purchase_price'));
            const formatted = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            }).format(price);

            return `${formatted}/${row.original.purchase_unit_size}${row.original.purchase_unit}`;
        },
    },
    {
        accessorKey: 'products_count',
        header: 'Produits associés',
    },

    {
        accessorKey: 'stock_quantity',
        header: 'En stock',
        cell: ({ row }) => {
            const quantity = row.getValue('stock_quantity') as number;
            const unit = row.original.unit;

            return `${quantity} ${unit}`;
        },
    },
    {
        accessorKey: 'stock_status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('stock_status') as StockStatus;
            const { statusVariant } = renderStockStatusEnum(status.value);

            return <Badge variant={statusVariant}>{status.label}</Badge>;
        },
    },
    {
        accessorKey: 'unit',
        header: 'Unité de mesure',
        cell: ({ row }) => <Badge variant="outline">{row.getValue('unit')}</Badge>,
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSupply(row.original)}>Réapprovisionner</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
