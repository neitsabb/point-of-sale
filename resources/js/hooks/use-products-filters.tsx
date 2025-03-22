import { Category, ProductsFilters } from '@/types';
import { router } from '@inertiajs/react';
import { useCallback } from 'react';

export const useProductFilters = (filters: ProductsFilters, categories: Category[]) => {
    const statusOptions = [
        { value: 'all', label: 'Tous les états' },
        { value: 'in_stock', label: 'En stock' },
        { value: 'out_of_stock', label: 'Rupture de stock' },
        { value: 'critical', label: 'Stock critique' },
    ];

    const categoryOptions = [{ id: 'all', name: 'Toutes les catégories' }, ...categories];

    const handleFilterChange = useCallback(
        (key: string, value: string | number | null) => {
            const updatedFilters = {
                ...filters,
                [key]: value === 'all' ? null : value,
                page: 1,
            };

            router.get('/products', updatedFilters, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        },
        [filters],
    );

    const handleResetFilters = () => {
        router.get('/products', { page: 1 }, { preserveScroll: true, preserveState: true, replace: true });
    };

    return {
        statusOptions,
        categoryOptions,
        handleFilterChange,
        handleResetFilters,
    };
};
