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
import { Edit, MoreHorizontal, PackagePlus } from 'lucide-react';

export const columns = (onEdit: (ingredient: Ingredient) => void, onSupply: (ingredient: Ingredient) => void): ColumnDef<Ingredient>[] => [
    {
        id: 'name',
        meta: 'Nom',
        accessorKey: 'name',
        header: 'Nom',
    },

    {
        id: 'price_display',
        meta: 'Prix unitaire',
        accessorKey: 'price_display',
        header: 'Prix unitaire',
        cell: ({ row }) => {
            return row.getValue('price_display') as string;
        },
    },
    {
        id: 'purchase_price_display',
        meta: "Prix d'achat",
        accessorKey: 'purchase_price_display',
        header: "Prix d'achat",
        cell: ({ row }) => {
            return row.getValue('purchase_price_display') as string;
        },
    },
    {
        id: 'products_count',
        meta: 'Produits associés',
        accessorKey: 'products_count',
        header: 'Produits associés',
    },

    {
        id: 'stock_quantity_display',
        meta: 'Quantité en stock',
        accessorKey: 'stock_quantity_display',
        header: 'En stock',
        cell: ({ row }) => {
            return row.getValue('stock_quantity_display') as string;
        },
    },
    {
        id: 'status',
        meta: 'Status',
        accessorKey: 'stock_status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as StockStatus;
            const { statusVariant } = renderStockStatusEnum(status.value);

            return <Badge variant={statusVariant}>{status.label}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes((row.getValue(id) as { value: string })?.value);
        },
    },
    {
        accessorKey: 'unit',
        id: 'unit',
        meta: 'Unité de mesure',
        header: 'Unité de mesure',
        cell: ({ row }) => <Badge variant="outline">{row.getValue('unit').label}</Badge>,
    },
    {
        id: 'actions',
        meta: 'Actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="translate-x-0 translate-y-0">
                    <div>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>Copier l'ID</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                        {' '}
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSupply(row.original)}>
                        {' '}
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Réapprovisionner
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
