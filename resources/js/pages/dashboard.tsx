import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateOrderModal } from '@/forms/create-order-form';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Order, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ArrowDown, ArrowUp, ChevronRight, Clock, DollarSign, Filter, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const ORDERS: Order[] = [
    {
        id: '1',
        type: 'dine-in',
        table: 1,
        itemsCount: 2,
        customer: 'John Doe',
        status: 'pending',
    },
    {
        id: '2',
        type: 'take-away',
        itemsCount: 1,
        customer: 'Jane Doe',
        status: 'pending',
    },
];
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const cardData = [
    {
        title: "Commandes aujourd'hui",
        icon: ShoppingBag,
        value: formatNumber(42),
        trend: '+12.5%',
        trendIcon: ArrowUp,
        trendColor: 'text-emerald-500',
        description: 'par rapport à hier',
    },
    {
        title: 'Commandes en attente',
        icon: Clock,
        value: formatNumber(8),
        trend: '-3.2%',
        trendIcon: ArrowDown,
        trendColor: 'text-rose-500',
        description: 'par rapport à hier',
    },
    {
        title: "Ventes aujourd'hui",
        icon: DollarSign,
        value: formatPrice(1842.5),
        trend: '+18.2%',
        trendIcon: ArrowUp,
        trendColor: 'text-emerald-500',
        description: 'par rapport à hier',
    },
];

export default function Dashboard() {
    const [openOrderModal, setOpenOrderModal] = useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Heading title="Super! Nous avons 12 commandes 😋" action={<CreateOrderModal />} />
            <main className="grid grid-cols-6 gap-4">
                <div className="col-span-4 space-y-4">
                    {/* Résumé des commandes */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {cardData.map((card, index) => (
                            <Card key={index} className="flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                    <card.icon className="text-muted-foreground h-6 w-6" />
                                </CardHeader>
                                <CardContent className="mt-auto flex h-full flex-col justify-end">
                                    <div className="mt-auto mb-2 text-2xl font-bold">{card.value}</div>
                                    <div className="text-muted-foreground flex items-center text-sm">
                                        <card.trendIcon className={`mr-1 h-4 w-4 ${card.trendColor}`} />
                                        <span className={`text-xs font-medium ${card.trendColor}`}>{card.trend}</span> {card.description}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Statistiques et produits populaires */}
                    <div className="grid w-full grid-cols-2 gap-6">
                        {/* Order List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dernières commandes</CardTitle>
                                <div className="relative mt-2">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input placeholder="Search a Order" className="pl-10" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <OrderItem
                                        table="A4"
                                        name="Ariel Hikmat"
                                        items={5}
                                        status="ready"
                                        statusText="Ready to serve"
                                        bgColor="bg-teal-700"
                                    />

                                    <OrderItem
                                        table="B2"
                                        name="Denis Freeman"
                                        items={4}
                                        status="in-progress"
                                        statusText="Cooking Now"
                                        bgColor="bg-teal-700"
                                    />

                                    <OrderItem
                                        table="TA"
                                        name="Morgan Cox"
                                        items={6}
                                        status="in-progress"
                                        statusText="In the Kitchen"
                                        bgColor="bg-amber-400"
                                    />

                                    <OrderItem
                                        table="TA"
                                        name="Paul Rey"
                                        items={6}
                                        status="in-progress"
                                        statusText="In the Kitchen"
                                        bgColor="bg-amber-400"
                                    />

                                    <OrderItem
                                        table="A9"
                                        name="Maja Becker"
                                        items={8}
                                        status="completed"
                                        statusText="Waiting For Payment"
                                        bgColor="bg-teal-700"
                                    />

                                    <OrderItem
                                        table="C2"
                                        name="Erwan Richard"
                                        items={6}
                                        status="completed"
                                        statusText="Waiting For Payment"
                                        bgColor="bg-teal-700"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>En attente de paiement</CardTitle>
                                <div className="relative mt-2">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input placeholder="Search a Order" className="pl-10" />
                                </div>
                            </CardHeader>
                            <CardContent className="">
                                <div className="space-y-4">
                                    <PaymentItem table="A9" name="Maja Becker" orderId="#912" bgColor="bg-teal-700" />

                                    <PaymentItem table="C2" name="Erwan Richard" orderId="#908" bgColor="bg-teal-700" />

                                    <PaymentItem table="A2" name="Stefan Meijer" orderId="#904" bgColor="bg-teal-700" />

                                    <PaymentItem table="A3" name="Julie Madsen" orderId="#903" bgColor="bg-teal-700" />

                                    <PaymentItem table="B4" name="Aulia Julie" orderId="#897" bgColor="bg-teal-700" />

                                    <PaymentItem table="B7" name="Emma Fortin" orderId="#892" bgColor="bg-teal-700" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produits populaires</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <div className="space-y-4">
                                <PopularDish rank="01" name="Scrambled Eggs With Toast" orders={23} image="/placeholder.svg?height=48&width=48" />

                                <PopularDish rank="02" name="Tacos With Chicken Grilled" orders={16} image="/placeholder.svg?height=48&width=48" />

                                <PopularDish rank="03" name="Spaghetti Bolognese" orders={13} image="/placeholder.svg?height=48&width=48" />

                                <PopularDish rank="04" name="French Bread & Potato" orders={12} image="/placeholder.svg?height=48&width=48" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>En rupture</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <div className="space-y-4">
                                <OutOfStockItem name="Hawaiian Chicken Skewers" time="04:00 PM" />

                                <OutOfStockItem name="Veggie Supreme Pizza" time="03:30 PM" />

                                <OutOfStockItem name="Fish and Chips" time="04:20 PM" />

                                <OutOfStockItem name="Spaghetti Bolognese" time="Tomorrow" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recherche et liste des commandes */}
                {/* <RecentOrders /> */}
            </main>
        </AppLayout>
    );
}

function OrderItem({ table, name, items, status, statusText, bgColor }) {
    return (
        <div className="flex items-center gap-4">
            <div
                className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-md font-medium text-white',
                    table === 'TA' ? 'bg-chart-4' : 'bg-primary',
                )}
            >
                {table}
            </div>
            <div className="flex-1">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{items} Items</p>
            </div>
            <div className="flex flex-col items-end text-right">
                {status === 'ready' && (
                    <Badge variant="outline" className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Ready
                    </Badge>
                )}
                {status === 'in-progress' && (
                    <Badge variant="outline" className="flex items-center gap-1 border-amber-200 bg-amber-50 text-amber-700">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        In Progress
                    </Badge>
                )}
                {status === 'completed' && (
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        Completed
                    </Badge>
                )}
                <p className="mt-1 text-xs">
                    {status === 'ready' && <span className="text-green-600">● {statusText}</span>}
                    {status === 'in-progress' && <span className="text-amber-600">● {statusText}</span>}
                    {status === 'completed' && <span className="text-blue-600">● {statusText}</span>}
                </p>
            </div>
        </div>
    );
}

function PaymentItem({ table, name, orderId, bgColor }) {
    return (
        <div className="flex items-center gap-4">
            <div
                className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-md font-medium text-white',
                    table === 'TA' ? 'bg-chart-4' : 'bg-primary',
                )}
            >
                {table}
            </div>
            <div className="flex-1">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">Order {orderId}</p>
            </div>
            <Button size="sm" className="bg-amber-400 text-black hover:bg-amber-500">
                Pay Now <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
    );
}

function PopularDish({ rank, name, orders, image }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-6 font-medium text-gray-500">{rank}</div>
            <div className="h-10 w-10 overflow-hidden rounded-md">
                <img src={'https://placehold.co/32x32'} width={40} height={40} alt={name} className="object-cover" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-gray-500">Orders : {orders}</p>
            </div>
        </div>
    );
}

function OutOfStockItem({ name, time }) {
    return (
        <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500">Available : {time}</p>
        </div>
    );
}

const statusOptions = [
    { value: 'toutes', label: 'Toutes' },
    { value: 'en-attente', label: 'En attente' },
    { value: 'en-preparation', label: 'En préparation' },
    { value: 'livree', label: 'Livrées' },
];

const RecentOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('toutes'); // Filtre sur le statut des commandes

    const commandes = [
        {
            id: 'CMD-7845',
            client: { name: 'Sophie Martin', image: '/placeholder.svg?height=32&width=32' },
            items: ['Burger Signature', 'Frites', 'Coca-Cola'],
            amount: 18.5,
            time: '14:32',
            status: 'en-preparation',
        },
        {
            id: 'CMD-7844',
            client: { name: 'Thomas Dubois', image: '/placeholder.svg?height=32&width=32' },
            items: ['Pizza Margherita', 'Tiramisu'],
            amount: 22.9,
            time: '14:15',
            status: 'en-attente',
        },
        {
            id: 'CMD-7843',
            client: { name: 'Julie Leroy', image: '/placeholder.svg?height=32&width=32' },
            items: ['Salade César', 'Eau minérale'],
            amount: 12.5,
            time: '13:48',
            status: 'livree',
        },
        {
            id: 'CMD-7842',
            client: { name: 'Pierre Moreau', image: '/placeholder.svg?height=32&width=32' },
            items: ['Pâtes Carbonara', 'Vin rouge'],
            amount: 24.8,
            time: '13:30',
            status: 'livree',
        },
        {
            id: 'CMD-7841',
            client: { name: 'Emma Bernard', image: '/placeholder.svg?height=32&width=32' },
            items: ['Burger Végétarien', 'Frites', 'Limonade'],
            amount: 17.2,
            time: '13:05',
            status: 'livree',
        },
    ];

    // Filtrage des commandes selon le statut
    const filteredCommandes = commandes.filter((order) => {
        if (statusFilter === 'toutes') return true;
        return order.status === statusFilter;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Commandes récentes</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Rechercher une commande..."
                                className="w-[250px] pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Tabs */}
                <TabsPrimitive.Root value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsPrimitive.List className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1">
                        {statusOptions.map((status) => (
                            <TabsPrimitive.Trigger
                                key={status.value}
                                value={status.value}
                                className="data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                            >
                                {status.label}
                            </TabsPrimitive.Trigger>
                        ))}
                    </TabsPrimitive.List>
                </TabsPrimitive.Root>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="col-span-2">Client</TableHead>
                            <TableHead className="col-span-2">Commande</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Heure</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCommandes.map((order, i) => (
                            <TableRow key={order.id}>
                                <TableCell className="col-span-2 flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={order.client.image} alt={order.client.name} />
                                        <AvatarFallback>{order.client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{order.client.name}</p>
                                        <p className="text-muted-foreground text-xs">{order.id}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="col-span-2">
                                    <p className="font-medium">{order.items[0]}</p>
                                    {order.items.length > 1 && (
                                        <p className="text-muted-foreground text-xs">
                                            +{order.items.length - 1} autre{order.items.length > 2 ? 's' : ''} article
                                            {order.items.length > 2 ? 's' : ''}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell>{order.amount}€</TableCell>
                                <TableCell>{order.time}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            order.status === 'en-attente' ? 'outline' : order.status === 'en-preparation' ? 'secondary' : 'default'
                                        }
                                        className={
                                            order.status === 'en-attente'
                                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                                : order.status === 'en-preparation'
                                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                        }
                                    >
                                        {order.status === 'en-attente'
                                            ? 'En attente'
                                            : order.status === 'en-preparation'
                                              ? 'En préparation'
                                              : 'Livrée'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        Détails
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
                <div className="text-muted-foreground text-sm">Affichage de {filteredCommandes.length} commandes</div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                        Suivant
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
