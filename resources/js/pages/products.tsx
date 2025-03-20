import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { CreateOrUpdateProductForm } from '@/forms/product-form';
import AppLayout from '@/layouts/app-layout';
import { columns } from '@/tables/products-table';
import { BreadcrumbItem, Product } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface ProductsPageProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Produits', href: '/products' }];

export default function ProductsPage({ products }: ProductsPageProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [open, setOpen] = useState(false);
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produits" />
            <Heading title="Les produits" action={<Button onClick={handleCreate}>Ajouter un produit</Button>} />
            <CreateOrUpdateProductForm product={selectedProduct} open={open} onClose={handleCloseDrawer} onSuccess={handleCloseDrawer} />
            <DataTable columns={columns(handleEdit)} data={products} />
        </AppLayout>
    );
}
