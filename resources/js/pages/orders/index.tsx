import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateOrderModal } from '@/forms/create-order-form';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Order, OrderStatusEnum, OrderTypeEnum } from '@/types';
import { Head } from '@inertiajs/react';
import { Info, MoveRight } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
export default function OrdersPage({ orders }: { orders: Order[] }) {
    const [activeTab, setActiveTab] = useState<string>('all');

    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return order.status.value === OrderStatusEnum.PENDING;
        if (activeTab === 'completed') return order.status.value === OrderStatusEnum.COMPLETED;
        if (activeTab === 'cancelled') return order.status.value === OrderStatusEnum.CANCELLED;
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Heading title="Commandes" action={<CreateOrderModal />} />
            <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList className="space-x-2">
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="pending">En attentes</TabsTrigger>
                    <TabsTrigger value="completed">Complétées</TabsTrigger>
                    <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {filteredOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}

function OrderCard({ order }: { order: Order }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case OrderStatusEnum.PENDING:
                return <Badge variant="orange">En attente</Badge>;
            case OrderStatusEnum.COMPLETED:
                return <Badge variant="green">Complétée</Badge>;
            case OrderStatusEnum.CANCELLED:
                return <Badge variant="destructive">Annulée</Badge>;
        }
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <div className="flex items-start gap-3">
                    <div
                        className={cn('bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md', {
                            'bg-muted text-muted-foreground': order.type.value === OrderTypeEnum.TAKE_AWAY,
                        })}
                    >
                        {order.type.value === OrderTypeEnum.DINE_IN ? 'A5' : 'TA'}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                                <h3 className="font-medium">{order.customer}</h3>
                                <div className="text-xs text-gray-500">
                                    Order #{order.id} / {order.type.label}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {getStatusBadge(order.status.value)}
                                <p className="truncate text-xs text-gray-500">{order.created_at}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex h-full flex-col p-4">
                <div className="mb-2 grid grid-cols-12 text-xs font-medium text-gray-500">
                    <div className="col-span-6">Produits</div>
                    <div className="col-span-2 text-center">Quantité</div>
                    <div className="col-span-4 text-right">Prix</div>
                </div>
                <div className="mb-3 space-y-2">
                    {order.products.slice(0, 4).map((item, index) => (
                        <div key={index} className="grid grid-cols-12 text-sm">
                            <div className="col-span-6 truncate">{item.name}</div>
                            <div className="col-span-2 text-center">{item.quantity}</div>
                            <div className="col-span-4 text-right">${item.price.toFixed(2)}</div>
                        </div>
                    ))}
                    {order.products.length > 4 && (
                        <div className="relative text-center text-xs font-medium">
                            <div className="absolute -top-10 bottom-0 left-0 flex h-10 w-full items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
                                <div className="text-center text-xs text-gray-500">
                                    + {order.products.length - 4} autre{order.products.length - 4 > 1 ? 's' : ''} produit
                                    {order.products.length - 4 > 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="font-medium">Total</div>
                    <div className="font-bold">${order.total_amount}</div>
                </div>
            </CardContent>
            <CardFooter className="mt-auto grid grid-cols-2 gap-4">
                <Button variant="outline">
                    <Info className="mr-2 h-4 w-4" />
                    Voir le détails
                </Button>
                <Button className="flex w-full items-center justify-center">
                    <MoveRight />
                    Payer
                </Button>
            </CardFooter>
        </Card>
    );
}
