import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { CreateOrUpdateIngredientForm } from '@/forms/ingredient-form';
import AppLayout from '@/layouts/app-layout';
import { columns } from '@/tables/ingredients-table';
import { BreadcrumbItem, Ingredient } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface IngredientsPageProps {
    ingredients: Ingredient[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Ingrédients', href: '/ingredients' }];

export default function IngredientsPage({ ingredients }: IngredientsPageProps) {
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [open, setOpen] = useState(false);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produits" />
            <Heading title="Les ingrédients" action={<Button onClick={handleCreate}>Ajouter un ingrédient</Button>} />
            <CreateOrUpdateIngredientForm ingredient={selectedIngredient} open={open} onClose={handleCloseDrawer} onSuccess={handleCloseDrawer} />
            <DataTable columns={columns(handleEdit)} data={ingredients} />
        </AppLayout>
    );
}
