import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { CreateOrUpdateProductForm } from '@/forms/product-form';
import AppLayout from '@/layouts/app-layout';
import { columns } from '@/tables/products-table';
import { BreadcrumbItem, Category, Product, StockStatusEnum } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface ProductsPageProps {
    products: Product[];
    categories: Category[];
    status: StockStatusEnum[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Produits', href: '/products' }];

export default function ProductsPage({ products, categories, status }: ProductsPageProps) {
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

            {/* <ProductsFilters filters={filters} categories={categories} /> */}

            <DataTable
                columns={columns({
                    onEdit: handleEdit,
                })}
                data={products}
                filters={{
                    status,
                    categories: categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                    })),
                }}
            />
        </AppLayout>
    );
}
