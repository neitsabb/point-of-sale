import { Product } from '@/types';
import { useState } from 'react';

export type CartItem = {
    product: Product;
    quantity: number;
    notes: string[]; // Toujours initialisé
    extras: string[]; // Toujours initialisé
};

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addProduct = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                return [...prevCart, { product, quantity: 1, notes: [], extras: [] }];
            }
        });
    };

    const removeProduct = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart((prevCart) => {
            // Mettre à jour la quantité ou supprimer si la quantité est 0
            const updatedCart = prevCart.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: Math.max(1, quantity) } // Si quantité < 1, on force à 1 (autrement)
                    : item,
            );

            // Filtrer les produits dont la quantité est 0 (et les supprimer du panier)
            return updatedCart.filter((item) => item.quantity > 0);
        });
    };

    const addNote = (productId: string, note: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.product.id === productId ? { ...item, notes: [...item.notes, note] } : item)));
    };

    const addExtra = (productId: string, extra: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.product.id === productId ? { ...item, extras: [...item.extras, extra] } : item)));
    };

    return { cart, addProduct, removeProduct, updateQuantity, addNote, addExtra };
};
