// tables/products-table.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { renderStockStatusEnum } from '@/lib/utils';
import { Ingredient, StockStatus } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export const columns = (onEdit: (ingredient: Ingredient) => void): ColumnDef<Ingredient>[] => [
    {
        accessorKey: 'name',
        header: 'Nom',
    },

    {
        accessorKey: 'price',
        header: 'Prix unitaire',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'));
            const formatted = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            }).format(price);
            return formatted;
        },
    },
    {
        accessorKey: 'products_count',
        header: 'Produits associés',
    },
    {
        accessorKey: 'unit',
        header: 'Unité de mesure',
    },
    {
        accessorKey: 'stock_quantity',
        header: 'En stock',
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Voir produit</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
