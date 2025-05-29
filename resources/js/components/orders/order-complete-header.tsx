import { Order } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const CompleteOrderHeader = ({
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
