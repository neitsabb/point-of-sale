import { Minus, Plus, PlusIcon } from 'lucide-react';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { OrderType } from '@/types';
import { useForm } from '@inertiajs/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { FormEvent, useEffect, useState } from 'react';

type CreateOrderDto = {
    customer: string;
    type: OrderType;
    guests?: number;
    phone?: string;
};

export function CreateOrderModal() {
    const { data, setData, post, errors, processing } = useForm<CreateOrderDto>({
        customer: '',
        type: 'dine-in',
        guests: 1,
        phone: '',
    });

    const [guestCount, setGuestCount] = useState(1);
    const [orderType, setOrderType] = useState('dine-in');

    const incrementGuest = () => {
        setGuestCount((prev) => prev + 1);
    };

    const decrementGuest = () => {
        setGuestCount((prev) => (prev > 1 ? prev - 1 : 1));
    };

    useEffect(() => {
        setData({
            ...data,
            guests: guestCount,
            type: orderType as OrderType,
        });
    }, [guestCount, orderType]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(data);

        post(route('orders.create'), {
            onSuccess: (r) => console.log(r),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon />
                    Créer une nouvelle commande
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Créer une nouvelle commande</DialogTitle>
                </DialogHeader>
                <div className="bg-secondary grid w-full grid-cols-2 gap-2 rounded-lg p-2">
                    <Button
                        variant={orderType === 'dine-in' ? 'outline' : 'ghost'}
                        className="hover:bg-white"
                        onClick={() => setOrderType('dine-in')}
                    >
                        Sur place
                    </Button>
                    <Button
                        variant={orderType === 'take-away' ? 'outline' : 'ghost'}
                        className="hover:bg-white"
                        onClick={() => setOrderType('take-away')}
                    >
                        A emporter
                    </Button>
                </div>

                <form className="mb-2 space-y-4" id="create-order-form" onSubmit={handleSubmit}>
                    <FormField label="Client" id="customer" errors={errors}>
                        <Input id="customer-name" placeholder="Entrez le nom du client" onChange={(e) => setData('customer', e.target.value)} />
                    </FormField>
                    {orderType === 'dine-in' ? (
                        <FormField label="Personnes" id="guests" errors={errors}>
                            <div className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                                <Button variant="outline" size="icon" className="h-6 w-6 shrink-0 rounded-full" onClick={decrementGuest}>
                                    <Minus className="h-2 w-2" />
                                </Button>
                                <span className="w-full text-center text-sm">{guestCount} personne(s)</span>
                                <Button variant="outline" size="icon" className="h-6 w-6 shrink-0 rounded-full" onClick={incrementGuest}>
                                    <Plus className="h-2 w-2" />
                                </Button>
                            </div>
                        </FormField>
                    ) : (
                        <FormField label="Téléphone" id="phone" required={false} errors={errors}>
                            <Input id="phone" placeholder="Entrez le numéro de téléphone" onChange={(e) => setData('phone', e.target.value)} />
                        </FormField>
                    )}
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={'secondary'}>
                            Annuler
                        </Button>
                    </DialogClose>

                    <Button form="create-order-form">Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
