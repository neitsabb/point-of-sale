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
        id: 'unit_price',
        meta: 'Prix unitaire',
        accessorKey: 'unit_price',
        header: 'Prix unitaire',
        cell: ({ row }) => {
            const price = row.original.unit_price;
            if (price && typeof price === 'object' && 'display' in price) {
                return price.display;
            }
            return 'N/A';
        },
    },
    {
        id: 'purchase_price',
        meta: "Prix d' achat",
        accessorKey: 'purchase_price',
        header: "Prix d'achat",
        cell: ({ row }) => {
            const price = row.original.purchase_price;
            if (price && typeof price === 'object' && 'display' in price) {
                return price.display;
            }
            return 'N/A';
        },
    },
    {
        id: 'unit',
        meta: 'Unité',
        accessorKey: 'unit',
        header: 'Unité',
        cell: ({ row }) => {
            return row.getValue('unit')?.symbol;
        },
    },
    {
        id: 'on_card',
        meta: 'Sur la carte',
        accessorKey: 'on_card',
        header: 'Sur la carte',
        cell: ({ row }) => {
            return row.getValue('on_card') ? 'Oui' : 'Non';
        },
    },
    {
        id: 'products_count',
        meta: 'Produits associés',
        accessorKey: 'products_count',
        header: 'Produits associés',
    },
    {
        id: 'stock_quantity',
        meta: 'Stock (cl)',
        accessorKey: 'stock_quantity',
        header: 'Stock (cl)',
        cell: ({ row }) => {
            return row.getValue('stock_quantity') as string;
        },
    },
    // {
    //     id: 'critical_stock',
    //     meta: 'Stock critique (cl)',
    //     accessorKey: 'critical_stock',
    //     header: 'Stock critique (cl)',
    //     cell: ({ row }) => {
    //         return `${row.getValue('critical_stock')} cl`;
    //     },
    // },
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
