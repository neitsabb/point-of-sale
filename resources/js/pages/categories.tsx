import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { CreateOrUpdateCategoryForm } from '@/forms/category-form';
import AppLayout from '@/layouts/app-layout';
import { columns } from '@/tables/categories-table';
import { BreadcrumbItem, Category } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface CategoriesPageProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Produits', href: '/products' }];

export default function CategoriesPage({ categories }: CategoriesPageProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [open, setOpen] = useState(false);
    const handleEdit = (product: Category) => {
        setSelectedCategory(product);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
        setSelectedCategory(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catégories" />
            <Heading title="Les catégories" action={<Button onClick={handleCreate}>Ajouter une catégorie</Button>} />
            <CreateOrUpdateCategoryForm category={selectedCategory} open={open} onClose={handleCloseDrawer} onSuccess={handleCloseDrawer} />
            <DataTable columns={columns(handleEdit)} data={categories} />
        </AppLayout>
    );
}
