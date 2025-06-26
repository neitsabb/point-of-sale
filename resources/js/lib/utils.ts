import { StockStatusEnum } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const renderStockStatusEnum = (status: StockStatusEnum) => {
    let statusVariant: 'green' | 'orange' | 'destructive';

    console.log('status', status);
    switch (status) {
        case StockStatusEnum.IN_STOCK:
            statusVariant = 'green';
            break;
        case StockStatusEnum.LOW_STOCK:
            statusVariant = 'orange';
            break;
        case StockStatusEnum.OUT_OF_STOCK:
            statusVariant = 'destructive';
            break;
    }

    return { statusVariant };
};

export const roundPrice = (price: number): number => {
    const validCents = [0, 30, 50, 70]; // Paliers d'arrondi possibles
    const cents = Math.round(price * 100); // Convertir en centimes
    const euros = Math.floor(cents / 100); // Partie entière en euros
    const remainder = cents % 100; // Centimes restants

    // Trouver le palier le plus proche parmi les paliers valides
    const closest = validCents.reduce((prev, curr) => (Math.abs(curr - remainder) < Math.abs(prev - remainder) ? curr : prev));

    // Retourner le prix arrondi avec le palier le plus proche
    return euros + closest / 100;
};
