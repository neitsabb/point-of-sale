import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Product = {
    id: string;
    name: string;
    price: {
        cost: number;
        selling_price: number;
        with_margin: number;
        without_tax: number;
        tax: number;
        margin: number;
        auto_price_calculation: boolean;
        round_price_enabled: boolean;
    };
    description?: string;
    status: {
        value: StockStatus;
        label: string;
    };
    image: string | File;
    category: Category;
    ingredients: ProductIngredient[];
};

export type Ingredient = {
    id: string;
    name: string;
    image: string;
    description?: string;
    price: number;
    unit: string;
    status: StockStatus;
    stock_quantity: number;
    critical_stock: number;
};

export type ProductIngredient = {
    id: string;
    quantity: number;
};

export interface StockStatus {
    value: StockStatusEnum;
    label: string;
}

export enum StockStatusEnum {
    IN_STOCK = 'in-stock',
    CRITICAL_STOCK = 'critical-stock',
    OUT_OF_STOCK = 'out-of-stock',
}

export type Category = {
    id: string;
    name: string;
    products_count: number;
};

export type OrderType = {
    value: OrderTypeEnum;
    label: string;
};

export enum OrderTypeEnum {
    DINE_IN = 'dine-in',
    TAKE_AWAY = 'take-away',
}
export type OrderStatus = {
    value: OrderStatusEnum;
    label: string;
};

export enum OrderStatusEnum {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface Order {
    id: string;
    type: OrderType;
    table?: number;
    itemsCount: number;
    customer: string;
    products: (Product & {
        quantity: number;
    })[];
    status: OrderStatus;
    total_amount: number;
    created_at: string;
}
