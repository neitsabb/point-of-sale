'use client';
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, MoveRight, NotebookPenIcon, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem, useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { Category, Ingredient, Order, Product } from '@/types';
import { router, usePage } from '@inertiajs/react';

export default function CompleteOrder({ order, products }: { order: Order; products: Product[]; categories: Category[]; ingredients: Ingredient[] }) {
    const [openSummary, setOpenSummary] = useState(true);
    const [search, setSearch] = useState('');
    const { cart, updateQuantity, addProduct, removeProduct } = useCart();
    const [selectedCategory, setSelectedCategory] = useState<string>('0');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            // If switching to mobile, close the summary if it was open
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
        <div className="grid h-screen w-full grid-cols-12 overflow-hidden">
            {/* Products Section */}
            <div
                className={cn('col-span-12 w-full space-y-6 px-4 transition-transform duration-300 md:col-span-8', {
                    'md:translate-x-0': !openSummary || !isMobile,
                })}
            >
                <CompleteOrderHeader order={order} search={search} setSearch={setSearch} openSummary={openSummary} setOpenSummary={setOpenSummary} />
                <main className="flex flex-col gap-4 lg:flex-row">
                    <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    <ProductsGrid
                        products={filteredProducts}
                        cart={cart}
                        removeProduct={removeProduct}
                        updateQuantity={updateQuantity}
                        addProduct={addProduct}
                    />
                </main>
            </div>

            {/* Order Summary */}
            <OrderSummary order={order} openSummary={openSummary} setOpenSummary={setOpenSummary} cart={cart} />
        </div>
    );
}

const CompleteOrderHeader = ({
    order,
    search,
    setSearch,
    openSummary,
    setOpenSummary,
}: {
    order: Order;
    search: string;
    setSearch: (search: string) => void;
    openSummary: boolean;
    setOpenSummary: (open: boolean) => void;
}) => {
    const handleCancel = () => {
        router.post(
            route('orders.cancel', order.id),
            {},
            {
                onSuccess: (resp) => console.log('succes', resp),
                onError: (err) => console.log(err),
            },
        );
    };

    return (
        <header className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
                <Button onClick={handleCancel} variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <ArrowLeft size={20} />
                </Button>
                <h1 className="text-xl font-semibold lg:text-2xl">Choisis les produits</h1>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
                <div className="relative flex-grow md:w-64">
                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input placeholder="Rechercher un produit" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant={openSummary ? 'secondary' : 'default'} onClick={() => setOpenSummary(!openSummary)} className="md:hidden">
                    {openSummary ? <ChevronLeft /> : <ChevronRight />} Résumé
                </Button>
            </div>
        </header>
    );
};

const ProductsGrid = ({
    products,
    cart,
    removeProduct,
    updateQuantity,
    addProduct,
}: {
    products: Product[];
    removeProduct: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    addProduct: (product: Product) => void;
    cart: CartItem[] | undefined;
}) => {
    return (
        <ScrollArea className="w-full [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-90px)]">
            <ul className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                    const cartItem = cart?.find((item) => item.product.id === product.id);
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
                                <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        variant={cartItem ? 'secondary' : 'outline'}
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => {
                                            if (cartItem) {
                                                if (cartItem.quantity === 1) {
                                                    removeProduct(product.id);
                                                } else {
                                                    updateQuantity(product.id, cartItem.quantity - 1);
                                                }
                                            }
                                        }}
                                        disabled={!cartItem}
                                    >
                                        <Minus size={16} />
                                    </Button>
                                    <span className="w-4 text-center text-sm font-medium">{cartItem?.quantity || 0}</span>
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => addProduct(product)}
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </ul>
        </ScrollArea>
    );
};

// Modal component for adding extras or notes (simplified)
const AddExtraOrNoteModal = ({ type, ingredients }) => {
    const isExtra = type === 'extra';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        'h-7 gap-1 border-none px-2 text-xs shadow-none',
                        isExtra
                            ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-700'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700',
                    )}
                >
                    {isExtra ? (
                        <>
                            <Plus size={12} /> Ajouter un extra
                        </>
                    ) : (
                        <>
                            <NotebookPenIcon size={12} /> Ajouter une note
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isExtra ? 'Ajouter un supplément' : 'Ajouter une note'}</DialogTitle>
                    <DialogDescription>
                        Vous pouvez ajouter {isExtra ? 'un' : 'une'} {isExtra ? 'supplément' : 'note'} ici.
                    </DialogDescription>
                </DialogHeader>
                {isExtra ? (
                    <ScrollArea className="h-[300px]">
                        {ingredients &&
                            ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-center justify-between py-2">
                                    <span>{ingredient.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span>{ingredient.price.toFixed(2)} €</span>
                                        <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0">
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </ScrollArea>
                ) : (
                    <FormField id="note" label="Note">
                        <Input placeholder="Votre note ici..." />
                    </FormField>
                )}
                <DialogFooter>
                    <Button type="submit">Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
                'bg-muted hover:bg-muted/80': category.id !== selectedCategory,
            })}
            onClick={() => setSelectedCategory(category.id)}
        >
            <div className="font-medium">{category.name}</div>
            <p className="text-muted-foreground hidden text-sm lg:block">{category.products_count} produits</p>
        </li>
    );
};

interface OrderSummaryProps {
    order: Order;
    openSummary: boolean;
    setOpenSummary: (open: boolean) => void;
    cart: CartItem[];
}

const OrderSummary = ({ order, openSummary, setOpenSummary, cart }: OrderSummaryProps) => {
    const subtotal = useMemo(
        () =>
            cart.reduce((total, item) => {
                const htPrice = item.product.price.selling_price / (1 + item.product.price.tax / 100);
                return total + htPrice * item.quantity;
            }, 0),
        [cart],
    );

    const taxTotals = useMemo(() => {
        return cart.reduce((taxes: Record<number, number>, item) => {
            const htPrice = item.product.price.selling_price / (1 + item.product.price.tax / 100);
            const taxAmount = htPrice * (item.product.price.tax / 100) * item.quantity;
            taxes[item.product.price.tax] = (taxes[item.product.price.tax] || 0) + taxAmount;
            return taxes;
        }, {});
    }, [cart]);

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.product.price.selling_price * item.quantity, 0), [cart]);

    return (
        <aside
            className={cn(
                'bg-muted fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden p-6 transition-transform duration-300',
                'md:static md:col-span-4 md:w-auto md:transform-none',
                openSummary ? 'translate-x-0' : 'translate-x-full',
            )}
            aria-modal="true"
            role="dialog"
        >
            <OrderHeader order={order} onClose={() => setOpenSummary(false)} />

            <OrderDetails cart={cart} />

            <OrderFooter cartLength={cart.length} subtotal={subtotal} taxTotals={taxTotals} total={total} />
        </aside>
    );
};
// Sous-composant pour l'en-tête
const OrderHeader = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="flex items-center justify-between md:hidden">
        <h2 className="text-lg font-medium">Résumé de commande</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Fermer le résumé">
            <X size={20} />
        </Button>
    </div>
);

// Sous-composant pour les détails des articles
const OrderDetails = ({ cart }: { cart: CartItem[] }) => (
    <div className="flex flex-grow flex-col overflow-hidden py-6">
        <h2 className="mb-2 font-medium lg:text-xl">Détails de la commande</h2>
        <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            <div className="space-y-6">
                {cart.map((item) => (
                    <CartItemCard key={item.product.id} item={item} />
                ))}
            </div>
        </ScrollArea>
    </div>
);

// Composant pour un article individuel
const CartItemCard = ({ item }: { item: CartItem }) => {
    const itemPrice = item.product.price.selling_price * item.quantity;

    return (
        <div className="border-border border-b pb-4 last:border-0">
            <div className="flex items-center justify-between font-medium">
                <div>{item.product.name}</div>
                <div>x{item.quantity}</div>
            </div>

            <ItemModifiers extras={item.extras} notes={item.notes} />

            <div className="flex items-center justify-between">
                <AddExtraButton />
                <span className="font-semibold">{formatPrice(itemPrice)}</span>
            </div>
        </div>
    );
};

// Composant pour les extras/notes
const ItemModifiers = ({ extras, notes }: Pick<CartItem, 'extras' | 'notes'>) => (
    <div className="text-muted-foreground my-2 text-sm">
        {extras?.length > 0 && <div>Extras : {extras.join(', ')}</div>}
        {notes?.map((note, index) => <div key={`note-${index}`}>Note : {note}</div>)}
    </div>
);

// Composant pour le bouton d'ajout d'extra
const AddExtraButton = () => (
    <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 border-none bg-cyan-50 px-2 text-xs text-cyan-700 shadow-none hover:bg-cyan-100 hover:text-cyan-700"
    >
        <Plus size={12} /> Ajouter un extra
    </Button>
);

// Sous-composant pour le footer
const OrderFooter = ({
    cartLength,
    subtotal,
    taxTotals,
    total,
}: {
    cartLength: number;
    subtotal: number;
    taxTotals: Record<number, number>;
    total: number;
}) => (
    <div className="border-accent space-y-4 border-t pt-4">
        <PriceRow label={`Produits (${cartLength})`} value={subtotal} />

        {Object.entries(taxTotals).map(([taxRate, taxTotal]) => (
            <PriceRow key={taxRate} label={`Taxes ${taxRate}%`} value={taxTotal} />
        ))}

        <Button className="text-md flex h-12 w-full items-center justify-between">
            <span className="text-lg">{formatPrice(total)}</span>
            <span className="flex items-center gap-2 text-sm">
                Procéder au paiement
                <MoveRight />
            </span>
        </Button>
    </div>
);

// Composant réutilisable pour les lignes de prix
const PriceRow = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{formatPrice(value)}</span>
    </div>
);

// Helper pour formater les prix
const formatPrice = (amount: number) => `${amount.toFixed(2)} €`;
