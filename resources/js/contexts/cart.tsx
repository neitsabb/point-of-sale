import { Ingredient, Product } from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ExtraItem = {
    ingredient: Ingredient;
    quantity: number;
};

export type CartItem = {
    id: string;
    product: Product;
    notes: string[];
    extras: ExtraItem[];
};

type CartContextType = {
    cart: CartItem[];
    addProduct: (product: Product) => void;
    removeProduct: (itemId: string) => void;

    addNote: (itemId: string, note: string) => void;
    removeNote: (itemId: string, note: string) => void;

    addExtra: (itemId: string, ingredient: Ingredient) => void;
    removeExtra: (itemId: string, ingredientId: string) => void;

    subtotal: number;
    taxTotals: Record<number, number>;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addProduct = (product: Product, extras: ExtraItem[] = [], notes: string[] = []) => {
        setCart((prevCart) => [...prevCart, { id: uuidv4(), product, notes, extras }]);
    };

    const removeProduct = (itemId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const addNote = (itemId: string, note: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, notes: [...item.notes, note] } : item)));
    };

    const addExtra = (itemId: string, ingredient: Ingredient) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id !== itemId) return item;

                const existingExtra = item.extras.find((e) => e.ingredient.id === ingredient.id);
                if (existingExtra) {
                    return {
                        ...item,
                        extras: item.extras.map((e) => (e.ingredient.id === ingredient.id ? { ...e, quantity: e.quantity + 1 } : e)),
                    };
                }

                return {
                    ...item,
                    extras: [...item.extras, { ingredient, quantity: 1 }],
                };
            }),
        );
    };

    const removeExtra = (itemId: string, ingredientId: string) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id !== itemId) return item;

                const updatedExtras = item.extras
                    .map((e) => (e.ingredient.id === ingredientId ? { ...e, quantity: e.quantity - 1 } : e))
                    .filter((e) => e.quantity > 0);

                return { ...item, extras: updatedExtras };
            }),
        );
    };

    const removeNote = (itemId: string, note: string) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id !== itemId) return item;

                const updatedNotes = item.notes.filter((n) => n !== note);

                return { ...item, notes: updatedNotes };
            }),
        );
    };

    const subtotalCents = cart.reduce((total, item) => {
        const extrasTotalCents = item.extras.reduce((sum, e) => sum + Math.round(e.ingredient.price * 100) * e.quantity, 0);
        const productPriceCents = Math.round(item.product.price.selling_price * 100);
        const htPriceCents = productPriceCents + extrasTotalCents;

        return total + Math.round(htPriceCents / (1 + item.product.price.tax / 100));
    }, 0);

    const taxTotalsCents = cart.reduce((taxes: Record<number, number>, item) => {
        const extrasTotalCents = item.extras.reduce((sum, e) => sum + Math.round(e.ingredient.price * 100) * e.quantity, 0);
        const productPriceCents = Math.round(item.product.price.selling_price * 100);
        const htPriceCents = productPriceCents + extrasTotalCents;

        const taxAmountCents = Math.round((htPriceCents * item.product.price.tax) / 100);

        taxes[item.product.price.tax] = (taxes[item.product.price.tax] || 0) + taxAmountCents;
        return taxes;
    }, {});

    const totalCents = cart.reduce((sum, item) => {
        const extrasTotalCents = item.extras.reduce((sum, e) => sum + Math.round(e.ingredient.price * 100) * e.quantity, 0);
        const productPriceCents = Math.round(item.product.price.selling_price * 100);
        const itemPriceCents = productPriceCents + extrasTotalCents;

        return sum + itemPriceCents;
    }, 0);

    // Puis convertir pour affichage
    const subtotal = subtotalCents / 100;
    const taxTotals = Object.fromEntries(Object.entries(taxTotalsCents).map(([tax, val]) => [tax, val / 100]));
    const total = totalCents / 100;

    return (
        <CartContext.Provider
            value={{
                cart,
                addProduct,
                removeProduct,
                addNote,
                removeNote,
                addExtra,
                removeExtra,
                subtotal,
                taxTotals,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
