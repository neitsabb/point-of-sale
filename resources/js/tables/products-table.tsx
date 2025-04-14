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
import { Product, StockStatus } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, TagIcon } from 'lucide-react';

export const columns = (onEdit: (product: Product) => void): ColumnDef<Product>[] => [
    {
        accessorKey: 'image',
        header: ({ column }) => <div>Image</div>,
        cell: ({ row }) => {
            return (
                <div className="w-10">
                    <img src={row.getValue('image')} alt="product" className="h-10 w-10 rounded-full" />
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Nom',
    },
    {
        accessorKey: 'category',
        header: 'Catégorie',
        cell: ({ row }) =>
            row.getValue('category') && (
                <Badge variant="secondary">
                    <TagIcon />
                    {row.getValue('category')?.name}
                </Badge>
            ),
    },
    {
        accessorKey: 'price',
        header: 'Prix de base',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price').without_tax);
            const formatted = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            }).format(price);
            return formatted;
        },
    },
    {
        accessorKey: 'selling_price',
        header: 'Prix de vente',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price').selling_price);
            const formatted = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            }).format(price);
            return formatted;
        },
    },
    {
        accessorKey: 'status',
        header: 'Etat',
        cell: ({ row }) => {
            const status = row.getValue('status') as StockStatus;

            const { statusVariant } = renderStockStatusEnum(status.value);

            return <Badge variant={statusVariant}>{status.label}</Badge>;
        },
    },
    // {
    //     accessorKey: 'margin',
    //     header: 'Marge',
    //     cell: ({ row }) => {
    //         const margin = parseFloat(row.getValue('price').margin);

    //         return `${margin} %`;
    //     },
    // },

    {
        id: 'actions',
        cell: ({ row }) => (
            <div className="relative">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => console.log('click')}>
                        <div>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom" sideOffset={8} avoidCollisions={false}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir produit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];
