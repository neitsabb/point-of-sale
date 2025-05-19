import { FormField } from '@/components/form-field';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CreateOrUpdateIngredientForm } from '@/forms/ingredient-form';
import AppLayout from '@/layouts/app-layout';
import { columns } from '@/tables/ingredients-table';
import { BreadcrumbItem, Ingredient, StockStatus } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface IngredientsPageProps {
    ingredients: Ingredient[];
    status: StockStatus[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Ingrédients', href: '/ingredients' }];

export default function IngredientsPage({ ingredients, status }: IngredientsPageProps) {
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [open, setOpen] = useState(false);
    const [supplyOpen, setSupplyOpen] = useState(false);

    const handleEdit = (Ingredient: Ingredient) => {
        setSelectedIngredient(Ingredient);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedIngredient(null);
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
        setSelectedIngredient(null);
    };

    const handleSupply = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        console.log(ingredient);
        setSupplyOpen(true);
    };

    console.log(ingredients);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produits" />
            <Heading title="Les ingrédients" action={<Button onClick={handleCreate}>Ajouter un ingrédient</Button>} />

            <DataTable
                filters={{
                    status: status.map((status) => ({
                        label: status.label,
                        value: status.value,
                    })),
                }}
                columns={columns(handleEdit, handleSupply)}
                data={ingredients}
                storageKey="ingredients-table"
            />

            <CreateOrUpdateIngredientForm ingredient={selectedIngredient} open={open} onClose={handleCloseDrawer} onSuccess={handleCloseDrawer} />

            <SupplyIngredientDialog ingredient={selectedIngredient} open={supplyOpen} onClose={() => setSupplyOpen(false)} />
        </AppLayout>
    );
}

interface ReSupplyIngredientDialogProps {
    ingredient: Ingredient | null;
    open: boolean;
    onClose: () => void;
}

const SupplyIngredientDialog = ({ ingredient, open, onClose }: ReSupplyIngredientDialogProps) => {
    const { data, setData, post, processing } = useForm({
        number_of_packages: 0,
        quantity_per_package: ingredient?.purchase_unit_size,
    });

    useEffect(() => {
        setData('quantity_per_package', ingredient?.purchase_unit_size || 0);
    }, [ingredient, setData]);

    const handleSupply = () => {
        post(route('ingredients.supply', { ingredient: ingredient?.id }), {
            onSuccess: () => {
                onClose();
            },
        });

        onClose();
    };

    if (!ingredient) return;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Ré-approvisionner {ingredient?.name}</DialogTitle>
                    <DialogDescription>Entrez la quantité à ajouter en stock pour cet ingrédient.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4 py-4">
                    <FormField label="Nombre de colis achetés" id="number_of_packages">
                        <Input
                            id="number_of_packages"
                            type="number"
                            value={data.number_of_packages}
                            onChange={(e) => setData('number_of_packages', parseFloat(e.target.value))}
                        />
                    </FormField>
                    <span className="mt-6">x</span>
                    <FormField label={`Contenance par colis (en ${ingredient.purchase_unit})`} id="quantity_per_package" required={false}>
                        <div className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 items-center space-x-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none">
                            <Input
                                id="quantity_per_package"
                                type="number"
                                value={data.quantity_per_package}
                                onChange={(e) => setData('quantity_per_package', parseFloat(e.target.value))}
                                className="focus-visible:ring-ring/50 border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                            />
                            <span className="text-sm text-gray-500">{ingredient.purchase_unit}</span>
                        </div>
                    </FormField>

                    {/* {ingredient.unit === 'unit' && (
                        <FormField label="Nombre d'unité par achat" id="purchase_unit_size" required={false}>
                            <div className="flex items-center space-x-2">
                                <div className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 items-center space-x-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none">
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={data.purchase_unit_size}
                                        onChange={(e) => setData('purchase_unit_size', parseFloat(e.target.value))}
                                        className="focus-visible:ring-ring/50 border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                                    />
                                    <span className="text-sm text-gray-500">{ingredient.unit}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">Par exemple: 8 pains par {ingredient.purchase_unit}</p>
                        </FormField>
                    )} */}
                </div>
                <DialogFooter>
                    <Button onClick={handleSupply} disabled={data.number_of_packages === 0 || processing}>
                        Ré-approvisionner
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
