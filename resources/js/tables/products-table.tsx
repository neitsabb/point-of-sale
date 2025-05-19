// tables/products-table.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product, StockStatus, StockStatusEnum } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from 'lucide-react';

export const columns = ({ onEdit }: { onEdit: (produit: Product) => void }): ColumnDef<Product>[] => {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Sélectionner toutes les lignes"
                    className="ml-1"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Sélectionner la ligne"
                    className="ml-1"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'image',
            meta: 'Image',
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }) => (
                <img
                    src={row.getValue('image') || '/placeholder.svg'}
                    alt={row.getValue('name')}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'name',
            meta: 'Nom',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Nom
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="ml-3 font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'category',
            meta: 'Catégorie',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Catégorie
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="ml-3 capitalize">{row.getValue('category').name}</div>,
            filterFn: (row, id, value) => {
                return value.includes((row.getValue(id) as { id: string })?.id);
            },
        },
        {
            accessorKey: 'price',
            meta: 'Prix de base',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="">
                        Prix de base
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const montant = Number.parseFloat(row.getValue('price').without_tax);
                const formatte = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(montant);

                return <div className="ml-3 font-medium">{formatte}</div>;
            },
        },
        {
            accessorKey: 'selling_price',
            meta: 'Prix de vente',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Prix de vente
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const montant = Number.parseFloat(row.getValue('price').selling_price);
                const formatte = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(montant);

                return <div className="ml-3 font-medium">{formatte}</div>;
            },
        },
        {
            accessorKey: 'status',
            meta: 'État',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const etat = row.getValue('status') as StockStatus;

                return (
                    <Badge
                        variant={
                            etat.value === StockStatusEnum.IN_STOCK
                                ? 'green'
                                : etat.value === StockStatusEnum.CRITICAL_STOCK
                                  ? 'orange'
                                  : 'destructive'
                        }
                        className="ml-3"
                    >
                        {etat.label}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes((row.getValue(id) as { value: string })?.value);
            },
        },
        {
            id: 'Actions',
            meta: 'Actions',
            cell: ({ row }) => {
                const produit = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(produit.id)}>Copier l'ID</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(produit)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};
