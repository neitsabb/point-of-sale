import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/cart';
import { useCashPayment } from '@/hooks/use-cash-payment';
import { Order } from '@/types';
import { InertiaFormProps, useForm } from '@inertiajs/react';
import { SkipBackIcon as Backspace, Banknote, CreditCard } from 'lucide-react';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { IconPayconiq } from '../ui/icon-payconiq';
import { Label } from '../ui/label';
import { PriceRow } from './order-complete-summary';

type Props = {
    order: Order;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export type PaymentForm = {
    payment_method: string;
    payload: {
        amount_given: number;
        total_htva: number;
        total_ttc: number;
    };
    products: {
        id: string;
        extras: { id: string; quantity: number }[];
        notes: string[];
    }[];
};

type CartItemWithExtras = {
    id: string;
    product: {
        name: string;
        price: {
            selling_price: number;
        };
    };
    extras: {
        ingredient: { name: string; price: number };
        quantity: number;
    }[];
};

export const OrderPayModal = ({ order, open, setOpen }: Props) => {
    const form = useForm<PaymentForm>({
        payment_method: 'cash',
        payload: {
            amount_given: 0,
            total_htva: 0,
            total_ttc: 0,
        },
        products: [],
    });

    const { data, setData, processing } = form;
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Paiement</DialogTitle>
                        <DialogDescription>Please select a payment method to proceed with your order.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                            <OrderInfo order={order} />

                            <TransactionSummary />
                        </div>
                        <div className="space-y-4">
                            <Label className="font-semibold">Méthodes de paiement</Label>
                            <Select
                                defaultValue={data.payment_method}
                                onValueChange={(value) => setData('payment_method', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">
                                        <Banknote /> Cash
                                    </SelectItem>
                                    <SelectItem value="cb">
                                        <CreditCard /> Carte bancaire
                                    </SelectItem>
                                    <SelectItem value="payconiq">
                                        <IconPayconiq />
                                        Payconiq
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div>{data.payment_method === 'cash' && <PaymentCashInterface order={order} form={form} />}</div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const OrderInfo = ({ order }: { order: Order }) => {
    const badgeContent = order.type.value === 'dine-in' ? order.id : order.customer.charAt(0);

    return (
        <div className="space-y-4">
            <h2 className="font-semibold">Informations</h2>
            <div className="pb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground grid h-10 w-10 place-content-center rounded-lg p-2">{badgeContent}</div>

                    <div className="flex w-full justify-between">
                        <div>
                            <span className="font-medium">{order.customer}</span>
                            <p className="text-muted-foreground text-xs font-semibold">
                                Commande #{order.id} &nbsp;/&nbsp; {order.type.label} &nbsp;/&nbsp; {order.status.label}
                            </p>
                        </div>
                        <span className="text-muted-foreground mt-2 block text-sm">{order.created_at}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransactionSummary = () => {
    const { total, taxTotals, cart, subtotal } = useCart();
    // Helper pour calculer le total extras par item (arrondi à 2 décimales)
    const getExtrasTotal = (extras: CartItemWithExtras[0]['extras']) => extras.reduce((sum, e) => sum + e.ingredient.price * e.quantity, 0);

    // Calcule le total item + extras avec arrondi
    const getItemTotal = (item: CartItemWithExtras) => +(item.product.price.selling_price + getExtrasTotal(item.extras)).toFixed(2);

    return (
        <div className="bg-accent text-accent-foreground rounded-xl p-4">
            <h2 className="font-semibold">Détails de la transaction</h2>
            <div className="mt-2 space-y-2 divide-y">
                {cart.map((item) => (
                    <div key={item.id} className="text-accent-foreground pb-2">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{item.product.name}</span>
                            <span className="mt-2 block text-sm font-medium">{item.product.price.selling_price.toFixed(2)} €</span>
                        </div>

                        {item.extras.length > 0 && (
                            <ul className="text-muted-foreground mt-2 flex flex-col gap-1 text-sm font-medium">
                                {item.extras.map((extra, index) => (
                                    <li key={`extra-${index}`} className="flex items-center justify-between">
                                        {extra.ingredient.name} x{extra.quantity}
                                        <span>+ {(extra.ingredient.price * extra.quantity).toFixed(2)} €</span>
                                    </li>
                                ))}
                                <li className="text-accent-foreground text-right font-medium">
                                    <span>{getItemTotal(item).toFixed(2)} €</span>
                                </li>
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-col pt-4">
                <PriceRow label={`Produits (${cart.length})`} value={subtotal} className="text-accent-foreground py-1" />
                {Object.entries(taxTotals).map(([taxRate, taxTotal]) => (
                    <PriceRow key={taxRate} label={`Taxes ${taxRate}%`} value={taxTotal} className="text-accent-foreground py-1" />
                ))}
                <PriceRow label="Total" value={total} className="text-accent-foreground text-lg font-bold" />
            </div>
        </div>
    );
};

const PaymentCashInterface = ({ order, form }: { order: Order; form: InertiaFormProps<PaymentForm> }) => {
    const [openSuccess, setOpenSuccess] = useState(false);

    const { total, subtotal, cart } = useCart();
    const { amount, handleNumberClick, handlePresetAmount, handleBackspace, isValid, change } = useCashPayment({
        form,
        total_htva: subtotal,
        total_ttc: total,
        initialAmount: '0',
    });

    const { data, errors, post, transform, wasSuccessful } = form;

    const handlePayment = () => {
        transform((data) => ({
            ...data,
            payload: {
                ...data.payload,
                amount_given: parseFloat(amount.replace(',', '.')),
                total_htva: subtotal,
                total_ttc: total,
            },
            products: cart.map((item) => ({
                id: item.id,
                extras: item.extras.map((extra) => ({ id: extra.ingredient.id, quantity: extra.quantity })),
                notes: [],
            })),
        }));

        post(route('orders.process', order.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpenSuccess(true);
            },
        });
    };

    return (
        <>
            <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center text-4xl font-medium">
                        <span className="text-muted-foreground">€</span>
                        <span>{amount}</span>
                    </div>
                    {errors.amount_given && (
                        <div className="mb-4 flex items-center justify-center text-red-500">
                            <span className="text-sm">{errors.amount_given}</span>
                        </div>
                    )}
                    {wasSuccessful && (
                        <div className="mb-4 flex flex-col items-center text-green-500">
                            <span className="text-sm">Paiement réussi !</span>
                            <span className="text-sm font-semibold">À rendre : {change.toFixed(2)} €</span>
                        </div>
                    )}
                    <div className="mb-6 grid grid-cols-4 gap-2">
                        {['5', '10', '20', '50'].map((val) => (
                            <Button
                                key={val}
                                variant="outline"
                                className="border-green-100 bg-green-50 text-green-800 hover:bg-green-100"
                                onClick={() => handlePresetAmount(val)}
                            >
                                {val} €
                            </Button>
                        ))}
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <Button key={num} variant="ghost" className="h-12 text-xl font-medium" onClick={() => handleNumberClick(num.toString())}>
                                {num}
                            </Button>
                        ))}
                        <Button variant="ghost" className="h-12 text-xl font-medium" onClick={() => handleNumberClick('.')}>
                            .
                        </Button>
                        <Button variant="ghost" className="h-12 text-xl font-medium" onClick={() => handleNumberClick('0')}>
                            0
                        </Button>
                        <Button variant="ghost" className="h-12 text-xl" onClick={handleBackspace}>
                            <Backspace className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button className="h-12 w-full" onClick={handlePayment} disabled={!isValid}>
                        Payer maintenant
                    </Button>
                </CardContent>
            </Card>

            <Drawer open={openSuccess} onOpenChange={setOpenSuccess}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Paiement réussi</DrawerTitle>
                            <DrawerDescription className="text-base">
                                &Agrave; rendre : <b>{change.toFixed(2)}€</b>
                            </DrawerDescription>
                        </DrawerHeader>

                        <DrawerFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setOpenSuccess(false);
                                    // Rediriger ou effectuer d'autres actions après le paiement réussi
                                }}
                            >
                                Fermer
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            {wasSuccessful && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    onConfettiComplete={() => setOpenSuccess(false)}
                    numberOfPieces={200}
                    className="pointer-events-none !fixed top-0 left-0 z-50 h-screen w-screen"
                />
            )}
        </>
    );
};
