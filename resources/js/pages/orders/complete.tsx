'use client';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { CompleteOrderHeader } from '@/components/orders/order-complete-header';
import { OrderSummary } from '@/components/orders/order-complete-summary';
import { OrderPayModal } from '@/components/orders/order-pay-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartProvider, useCart } from '@/contexts/cart';
import { cn } from '@/lib/utils';
import { Category, Ingredient, Order, Product } from '@/types';
import { usePage } from '@inertiajs/react';

export default function CompleteOrder({ order, products }: { order: Order; products: Product[]; categories: Category[]; ingredients: Ingredient[] }) {
    const [openSummary, setOpenSummary] = useState(true);
    const [openPayModal, setOpenPayModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('0');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setOpenSummary(false);
            } else {
                setOpenSummary(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const filteredProducts = useMemo(
        () =>
            products.filter(
                (product) =>
                    product.name.toLowerCase().includes(search.toLowerCase()) &&
                    (selectedCategory === '0' || product.category.id === selectedCategory),
            ),
        [products, search, selectedCategory],
    );

    return (
        <CartProvider>
            <div className="bg-muted grid h-screen w-full grid-cols-12 overflow-hidden">
                {/* Products Section */}
                <div
                    className={cn('col-span-12 w-full space-y-6 px-4 transition-transform duration-300 md:col-span-8', {
                        'md:translate-x-0': !openSummary || !isMobile,
                    })}
                >
                    <CompleteOrderHeader
                        order={order}
                        search={search}
                        setSearch={setSearch}
                        openSummary={openSummary}
                        setOpenSummary={setOpenSummary}
                    />
                    <main className="flex flex-col gap-4 lg:flex-row">
                        <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        <ProductsGrid products={filteredProducts} />
                    </main>
                </div>

                {/* Order Summary */}
                <OrderSummary order={order} openSummary={openSummary} setOpenSummary={setOpenSummary} setOpenPayModal={setOpenPayModal} />

                <OrderPayModal order={order} open={openPayModal} setOpen={setOpenPayModal} />
            </div>
        </CartProvider>
    );
}

const ProductsGrid = ({ products }: { products: Product[] }) => {
    const { addProduct } = useCart();
    return (
        <ScrollArea className="w-full [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-90px)]">
            <ul className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                    return (
                        <Card key={product.id} className="gap-0 self-start overflow-hidden p-2">
                            <div className="relative">
                                <img src={product.image as string} alt={product.name} className="aspect-video w-full rounded-lg object-cover" />
                                {/* {Math.random() > 0.5 && (
                                    <div className="absolute top-2 right-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">Deal 10%</div>
                                )} */}
                            </div>
                            <CardContent className="space-y-2 p-0 py-2">
                                <h2 className="truncate text-sm font-medium lg:text-base">{product.name}</h2>
                                <p className="text-muted-foreground line-clamp-2 hidden text-xs lg:block">{product.description}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between p-0 pt-0">
                                <span className="text-primary font-medium">{product.price.selling_price.toFixed(2)} €</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                        addProduct(product);
                                    }}
                                >
                                    Ajouter
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </ul>
        </ScrollArea>
    );
};

const Categories = ({ selectedCategory, setSelectedCategory }: { selectedCategory: string; setSelectedCategory: (category: string) => void }) => {
    const { categories, products } = usePage<{
        categories: Category[];
        products: Product[];
    }>().props;
    return (
        <div className="flex w-full overflow-x-auto lg:w-auto lg:flex-col lg:overflow-visible">
            <ul className="flex gap-2 pb-2 lg:w-[160px] lg:flex-col lg:pb-0">
                <CategoryItem
                    category={{
                        id: '0',
                        name: 'Tous',
                        products_count: products.length,
                    }}
                    setSelectedCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                />
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                ))}
            </ul>
        </div>
    );
};

const CategoryItem = ({
    category,
    selectedCategory,
    setSelectedCategory,
}: {
    category: Category;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}) => {
    return (
        <li
            key={category.id}
            className={cn('min-w-[100px] cursor-pointer rounded-lg p-2 text-center transition-colors lg:min-w-0 lg:p-4 lg:text-left', {
                'bg-primary text-primary-foreground': category.id === selectedCategory,
                'bg-background hover:bg-background/80': category.id !== selectedCategory,
            })}
            onClick={() => setSelectedCategory(category.id)}
        >
            <div className="font-medium">{category.name}</div>
            <p className="text-muted-foreground hidden text-sm lg:block">{category.products_count} produits</p>
        </li>
    );
};
