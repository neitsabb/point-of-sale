import Heading from '@/components/heading';
import ProductsFilters from '@/components/products-filters';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { CreateOrUpdateProductForm } from '@/forms/product-form';
import AppLayout from '@/layouts/app-layout';
import { columns } from '@/tables/products-table';
import { BreadcrumbItem, Category, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface ProductsPageProps {
    products: {
        data: Product[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    categories: Category[];
    filters: ProductsFilters;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Produits', href: '/products' }];

export default function ProductsPage({ products, categories, filters }: ProductsPageProps) {
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

    const handlePageChange = (page: number) => {
        router.get('/products', { ...filters, page }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produits" />
            <Heading title="Les produits" action={<Button onClick={handleCreate}>Ajouter un produit</Button>} />
            <CreateOrUpdateProductForm product={selectedProduct} open={open} onClose={handleCloseDrawer} onSuccess={handleCloseDrawer} />

            <ProductsFilters filters={filters} categories={categories} />

            <DataTable
                columns={columns(handleEdit)}
                data={products.data}
                pagination={{
                    total: products.meta.total,
                    currentPage: products.meta.current_page,
                    perPage: products.meta.per_page,
                    onPageChange: handlePageChange,
                }}
            />
        </AppLayout>
    );
}
