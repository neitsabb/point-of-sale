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
import { Category, Ingredient, Order, OrderTypeEnum, Product } from '@/types';
import { router, usePage } from '@inertiajs/react';

// Types simplifiés pour l'exemple
const mockProducts = [
    {
        id: '1',
        name: 'Scrambled Eggs With Toast',
        description: 'Farm-fresh scrambled eggs served with toast',
        price: 16.99,
        image: '/api/placeholder/320/200',
        category_id: '1',
    },
    {
        id: '2',
        name: 'Greek Yogurt Parfait',
        description: 'A harmonious blend of creamy Greek yogurt with fruit and honey',
        price: 21.49,
        image: '/api/placeholder/320/200',
        category_id: '1',
    },
    {
        id: '3',
        name: 'Vegetable Omelette',
        description: 'Made with farm-fresh eggs filled with a medley of colorful vegetables',
        price: 17.09,
        image: '/api/placeholder/320/200',
        category_id: '1',
    },
    {
        id: '4',
        name: 'Smoked Salmon Bagel',
        description: 'A savory and satisfying breakfast with cream cheese and smoked salmon',
        price: 18.99,
        image: '/api/placeholder/320/200',
        category_id: '1',
    },
    {
        id: '5',
        name: 'French Toast & Potato',
        description: 'Cinnamon dusted French toast with sides of freshly cooked breakfast potatoes',
        price: 19.36,
        image: '/api/placeholder/320/200',
        category_id: '1',
    },
    {
        id: '6',
        name: 'Belgian Waffles',
        description: 'Fluffy waffles with a crisp golden exterior and a soft interior',
        price: 19.49,
        image: '/api/placeholder/320/200',
        category_id: '1',
    },
];

const mockCategories = [
    { id: '0', name: 'Tous', products_count: 23 },
    { id: '1', name: 'Breakfast', products_count: 13 },
    { id: '2', name: 'Fastfood', products_count: 9 },
    { id: '3', name: 'Soups', products_count: 11 },
    { id: '4', name: 'Pasta', products_count: 9 },
    { id: '5', name: 'Snack', products_count: 9 },
];

const mockIngredients = [
    { id: '1', name: 'Extra Egg', price: 1.5 },
    { id: '2', name: 'Bacon', price: 2.0 },
    { id: '3', name: 'Cheese', price: 1.0 },
    { id: '4', name: 'Avocado', price: 2.5 },
];

const mockOrder = {
    id: '925',
    customer: 'Arild Hikmat',
    status: { label: 'New' },
    created_at: 'Wed, July 12, 2023 • 06:12 PM',
    table: 'A4',
};

export default function CompleteOrder({
    order,
    products,
    categories,
    ingredients,
}: {
    order: Order;
    products: Product[];
    categories: Category[];
    ingredients: Ingredient[];
}) {
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
                                <span className="text-primary font-medium">{product.price.with_tax.toFixed(2)} €</span>
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

const OrderSummary = ({
    order,
    openSummary,
    setOpenSummary,
    cart,
}: {
    order: Order;
    openSummary: boolean;
    setOpenSummary: (open: boolean) => void;
    cart: CartItem[];
}) => {
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <aside
            className={cn(
                'bg-muted fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden p-6 transition-transform duration-300 md:static md:col-span-4 md:w-auto md:transform-none',
                openSummary ? 'translate-x-0' : 'translate-x-full',
            )}
        >
            {/* Summary Header */}
            <div className="flex items-center justify-between md:hidden">
                <h2 className="text-lg font-medium">Résumé de commande</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpenSummary(false)}>
                    <X size={20} />
                </Button>
            </div>

            {/* Header */}
            <header className="border-accent flex flex-col border-b pb-6">
                <div className="flex justify-between gap-x-2">
                    <div>
                        <h2 className="truncate text-xl font-medium">{order.customer}</h2>
                        <p className="text-muted-foreground text-xs">
                            Commande #{order.id} / {order.status.label}
                        </p>
                    </div>
                    <div className="bg-primary grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white">
                        {order.type.value === OrderTypeEnum.TAKE_AWAY ? 'OUT' : order.table}
                    </div>
                </div>
                <span className="text-muted-foreground mt-2 inline-block text-sm">{order.created_at}</span>
            </header>

            {/* Détails de la commande */}
            <div className="flex flex-grow flex-col overflow-hidden py-6">
                <h2 className="mb-2 font-medium lg:text-xl">Détails de la commande</h2>
                <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div key={item.product.id} className="border-border border-b pb-4 last:border-0">
                                <div className="flex items-center justify-between font-medium">
                                    <div>{item.product.name}</div>
                                    <div>x{item.quantity}</div>
                                </div>
                                <div className="text-muted-foreground my-2 text-sm">
                                    {item.extras && item.extras.length > 0 && <div>Extras : {item.extras?.join(', ')}</div>}
                                    {item.notes && item.notes.map((note, index) => <div key={index}>Note : {note}</div>)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 gap-1 border-none bg-cyan-50 px-2 text-xs text-cyan-700 shadow-none hover:bg-cyan-100 hover:text-cyan-700"
                                        >
                                            <Plus size={12} /> Ajouter un extra
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 gap-1 border-none bg-emerald-50 px-2 text-xs text-emerald-700 shadow-none hover:bg-emerald-100 hover:text-emerald-700"
                                        >
                                            <NotebookPenIcon size={12} /> Ajouter une note
                                        </Button>
                                    </div>
                                    <span className="font-semibold">{(item.product.price.with_tax * item.quantity).toFixed(2)} €</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Footer */}
            <div className="border-accent space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Produits ({cart.length})</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxes ({(taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-medium">{tax.toFixed(2)} €</span>
                </div>
                <Button className="text-md flex h-12 w-full items-center justify-between">
                    <span className="text-lg">{total.toFixed(2)} €</span>
                    <span className="flex items-center gap-2 text-sm">
                        Procéder au paiement
                        <MoveRight />
                    </span>
                </Button>
            </div>
        </aside>
    );
};

// 'use client';
// import { ArrowLeft, Minus, MoveRight, NotebookPenIcon, Plus } from 'lucide-react';

// import { FormField } from '@/components/form-field';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { CartItem, useCart } from '@/hooks/use-cart';
// import { cn } from '@/lib/utils';
// import { Category, Ingredient, Order, Product } from '@/types';
// import { usePage } from '@inertiajs/react';
// import { useMemo, useState } from 'react';

// export default function CompleteOrder({ order, products, ingredients }: { order: Order; products: Product[]; ingredients: Ingredient[] }) {
//     const [openSummary, setOpenSummary] = useState(true);

//     const { cart, addProduct, updateQuantity, removeProduct } = useCart();

//     const [search, setSearch] = useState<string>('');

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value);
//     };

//     const filteredProducts = useMemo(
//         () => products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())),
//         [products, search],
//     );

//     return (
//         <div className="grid h-full w-full grid-cols-12 overflow-hidden">
//             <div
//                 className={cn('col-span-12 w-full space-y-6 px-4 md:col-span-8', {
//                     '-translate-x-50 md:translate-x-0': !openSummary,
//                 })}
//             >
//                 <CompleteOrderHeader handleSearchChange={handleSearchChange} setOpenSummary={setOpenSummary} />
//                 <main className="flex flex-col gap-4 lg:flex-row">
//                     <Categories />
//                     <ScrollArea className="w-full pb-4 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-100px)]">
//                         <ul className="grid grid-cols-2 gap-4 pr-4 lg:grid-cols-3">
//                             {filteredProducts.map((product) => {
//                                 return (
//                                     <ProductCard
//                                         product={product}
//                                         cartItem={cart.find((item) => item.product.id === product.id)}
//                                         removeProduct={removeProduct}
//                                         updateQuantity={updateQuantity}
//                                         addProduct={addProduct}
//                                     />
//                                 );
//                             })}
//                         </ul>
//                     </ScrollArea>
//                 </main>
//             </div>
//             {/* <Drawer open={openSummary} onOpenChange={setOpenSummary} direction="right">
//                 <DrawerContent className="w-full max-w-xl">coucou</DrawerContent>
//             </Drawer> */}
//             <CompleteOrderSummary order={order} cart={cart} ingredients={ingredients} isOpen={openSummary} />
//         </div>
//     );
// }

// const ProductCard = ({
//     product,
//     removeProduct,
//     updateQuantity,
//     addProduct,
//     cartItem,
// }: {
//     product: Product;
//     removeProduct: (productId: string) => void;
//     updateQuantity: (productId: string, quantity: number) => void;
//     addProduct: (product: Product) => void;
//     cartItem: CartItem | undefined;
// }) => {
//     return (
//         <Card key={product.id} className="self-start !p-2">
//             <CardContent className="space-y-2 !p-0">
//                 <img src={product.image as string} className="aspect-video h-full w-full rounded-lg object-cover" />
//                 <div>
//                     <h2 className="truncate font-medium">{product.name}</h2>
//                     <p className="text-muted-foreground text-xs">{product?.description || 'Lorem ipsum'}</p>
//                 </div>
//             </CardContent>
//             <CardFooter className="flex items-center justify-between !p-0 pt-0">
//                 <span className="text-primary font-medium">{product.price.toFixed(2)} €</span>
//                 <div className="flex items-center space-x-2">
//                     <Button
//                         type="button"
//                         variant={'secondary'}
//                         size={'icon'}
//                         className="h-8 w-8 rounded-full"
//                         onClick={() => {
//                             if (cartItem) {
//                                 if (cartItem.quantity === 1) {
//                                     removeProduct(product.id);
//                                 } else {
//                                     updateQuantity(product.id, cartItem.quantity - 1);
//                                 }
//                             } else {
//                                 addProduct(product);
//                             }
//                         }}
//                     >
//                         <Minus strokeWidth={2} />
//                     </Button>
//                     <span className="text-sm font-medium">{cartItem?.quantity || 0}</span>
//                     <Button type="button" variant={'default'} size={'icon'} onClick={() => addProduct(product)} className="h-8 w-8 rounded-full">
//                         <Plus strokeWidth={2} />
//                     </Button>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// };

// const CategoryItem = ({ category }: { category: Category }) => {
//     return (
//         <li
//             key={category.name}
//             className={cn('bg-muted space-y-4 rounded-lg p-2 lg:p-4', {
//                 'bg-primary text-primary-foreground text-sm lg:text-base': category.id === '0',
//             })}
//         >
//             <b>{category.name}</b>
//             <p className={'text-muted-foreground hidden text-sm lg:block'}>{category.products_count} produits</p>
//         </li>
//     );
// };

// const CompleteOrderHeader = ({
//     handleSearchChange,
//     setOpenSummary,
// }: {
//     handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     setOpenSummary: (open: boolean) => void;
// }) => {
//     return (
//         <header className="flex h-[56px] items-center pt-6">
//             <div className="flex w-full items-center gap-4">
//                 <Button variant="outline" size="icon" className="rounded-full">
//                     <ArrowLeft />
//                 </Button>
//                 <h1 className="font-semibold lg:text-2xl">Choisis les produits</h1>
//             </div>
//             <div className="">
//                 <Input placeholder="Rechercher un produit" onChange={(value) => handleSearchChange(value)} />
//                 <Button onClick={() => setOpenSummary((prev) => !prev)}>Ouvrir</Button>
//             </div>
//         </header>
//     );
// };

// const CompleteOrderSummary = ({
//     order,
//     cart,
//     ingredients,
//     isOpen,
// }: {
//     order: Order;
//     cart: CartItem[];
//     ingredients: Ingredient[];
//     isOpen: boolean;
// }) => {
//     return (
//         <aside
//             className={cn('bg-muted z-50 col-span-4 flex h-full translate-x-100 flex-col p-6', {
//                 '-translate-x-150': isOpen,
//             })}
//         >
//             {/* Header */}
//             <header className="border-accent flex flex-col border-b pb-6">
//                 <div className="flex justify-between gap-x-2">
//                     <div>
//                         <h2 className="truncate text-xl font-medium">{order.customer}</h2>
//                         <p className="text-muted-foreground text-xs">Commande #925 / {order.status.label}</p>
//                     </div>
//                     <div className="bg-primary grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white">A4</div>
//                 </div>
//                 <span className="text-muted-foreground mt-2 inline-block text-sm">{order.created_at}</span>
//             </header>

//             {/* Détails de la commande */}
//             <div className="flex h-full flex-grow flex-col overflow-hidden py-6">
//                 <h2 className="mb-2 font-medium lg:text-xl">Détails de la commande</h2>
//                 <ScrollArea className="h-[calc(100vh-500px)] pr-4 lg:h-[calc(100vh-400px)]">
//                     <div className="space-y-4">
//                         {cart.map((product) => (
//                             <SummaryItem product={product} key={product.product.id} ingredients={ingredients} />
//                         ))}
//                     </div>
//                 </ScrollArea>
//             </div>

//             {/* Footer */}
//             <div className="mt-aut border-accent space-y-4 border-t pt-4">
//                 <div className="flex items-center justify-between">
//                     <span className="text-muted-foreground">Produits ({cart.length})</span>
//                     <span className="font-medium">73,79 €</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <span className="text-muted-foreground">Taxes (5%)</span>
//                     <span className="font-medium">3,65 €</span>
//                 </div>
//                 <Button className="text-md flex h-12 w-full items-center justify-between">
//                     <span className="text-lg">87,34 €</span>
//                     <span className="flex items-center gap-2 text-sm">
//                         Procéder au paiement
//                         <MoveRight />
//                     </span>
//                 </Button>
//             </div>
//         </aside>
//     );
// };

// const SummaryItem = ({ product: { product, quantity, notes, extras }, ingredients }: { product: CartItem; ingredients: Ingredient[] }) => {
//     return (
//         <div>
//             <div className="flex items-center justify-between font-medium">
//                 {product.name}
//                 <span className="">x{quantity}</span>
//             </div>
//             <div className="text-muted-foreground my-2 text-sm">
//                 {extras && <div>Extras : {extras?.join(', ')}</div>}
//                 {notes?.map((n) => <div>Note : {n}</div>)}
//             </div>
//             <div className="flex items-center justify-between">
//                 <div className="space-x-2">
//                     <AddExtraOrNoteModal type="extra" ingredients={ingredients} />
//                     <AddExtraOrNoteModal type="note" />
//                 </div>
//                 <span className="font-semibold">16,99 €</span>
//             </div>
//         </div>
//     );
// };

// const AddExtraOrNoteModal = ({ type, ingredients }: { type: 'extra' | 'note'; ingredients?: Ingredient[] }) => {
//     const isExtra = type === 'extra';

//     return (
//         <Dialog>
//             <DialogTrigger asChild>
//                 <Button
//                     variant={'outline'}
//                     size="sm"
//                     className={cn(
//                         'h-7 gap-1 border-none px-2 text-xs shadow-none',
//                         isExtra
//                             ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-700'
//                             : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700',
//                     )}
//                 >
//                     {type === 'extra' ? (
//                         <>
//                             <Plus /> Ajouter un extra
//                         </>
//                     ) : (
//                         <>
//                             <NotebookPenIcon /> Ajouter une note
//                         </>
//                     )}
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>{isExtra ? 'Ajouter un supplément' : 'Ajouter une note'}</DialogTitle>
//                     <DialogDescription>
//                         Vous pouvez ajouter {isExtra ? 'un' : 'une'} {isExtra ? 'supplément' : 'note'} ici.
//                     </DialogDescription>
//                 </DialogHeader>
//                 {isExtra ? (
//                     <div className="h-[500px] overflow-y-auto"></div>
//                 ) : (
//                     <FormField id="extra" label={'Note'}>
//                         <Input />
//                     </FormField>
//                 )}
//                 <DialogFooter>
//                     <Button type="submit">Save changes</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };
