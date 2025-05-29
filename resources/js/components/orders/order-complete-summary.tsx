import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CartItem, useCart } from '@/contexts/cart';
import { cn } from '@/lib/utils';
import { Ingredient, Order } from '@/types';
import { usePage } from '@inertiajs/react';
import { Minus, MoveRight, NotebookPenIcon, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { FormField } from '../form-field';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

interface OrderSummaryProps {
    order: Order;
    openSummary: boolean;
    setOpenSummary: (open: boolean) => void;
    setOpenPayModal: (open: boolean) => void;
}

export const OrderSummary = ({ order, openSummary, setOpenSummary, setOpenPayModal }: OrderSummaryProps) => {
    return (
        <aside
            className={cn(
                'bg-background fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden p-6 transition-transform duration-300',
                'md:static md:col-span-4 md:w-auto md:transform-none',
                openSummary ? 'translate-x-0' : 'translate-x-full',
            )}
            aria-modal="true"
            role="dialog"
        >
            <OrderHeader order={order} onClose={() => setOpenSummary(false)} />
            <OrderDetails />
            <OrderFooter setOpenPayModal={setOpenPayModal} />
        </aside>
    );
};
// Sous-composant pour l'en-tête
const OrderHeader = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="border-b pb-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{order.customer}</h2>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onClose} aria-label="Fermer le résumé">
                    <X size={20} />
                </Button>
                <div className="bg-primary text-primary-foreground grid h-10 w-10 place-content-center rounded-lg p-2">
                    {order.type.value === 'dine-in' ? order.id : order.customer[0].charAt(0)}
                </div>
            </div>
        </div>
        <p className="text-muted-foreground text-xs font-semibold">
            Commande #{order.id} &nbsp;/&nbsp; {order.type.label} &nbsp;/&nbsp; {order.status.label}
        </p>
        <span className="text-muted-foreground mt-2 block text-sm">{order.created_at}</span>
    </div>
);

// Sous-composant pour les détails des articles
const OrderDetails = () => {
    const { cart } = useCart();
    return (
        <div className="flex flex-grow flex-col overflow-hidden py-6">
            <h2 className="mb-2 font-medium lg:text-lg">Détails de la commande</h2>
            <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                <div className="space-y-6">
                    {cart.map((item) => (
                        <CartItemCard key={item.id} item={item} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

// Composant pour un article individuel
const CartItemCard = ({ item }: { item: CartItem }) => {
    const { ingredients } = usePage<{
        ingredients: Ingredient[];
    }>().props;

    const { removeProduct } = useCart();

    const extrasTotalCents = item.extras.reduce((sum, e) => sum + Math.round(e.ingredient.price * 100) * e.quantity, 0);

    const productPriceCents = Math.round(item.product.price.selling_price * 100);

    const itemPriceCents = productPriceCents + extrasTotalCents;

    const totalItemPriceCents = itemPriceCents;

    // Formatage pour affichage
    const formattedPrice = (totalItemPriceCents / 100).toFixed(2);
    return (
        <div className="border-border border-b pb-4 last:border-0">
            <div className="flex items-center justify-between font-medium">
                <div>{item.product.name}</div>
                <Button onClick={() => removeProduct(item.id)} variant="ghost" size="icon" className="h-8 w-8" aria-label="Supprimer l'article">
                    <X size={20} />
                </Button>
            </div>

            <ItemModifiers extras={item.extras} notes={item.notes} />

            <div className="flex items-start justify-between">
                <div className="flex flex-col items-start justify-between gap-2">
                    <AddExtraOrNoteModal type="extra" ingredients={ingredients} item={item} />
                    <AddExtraOrNoteModal type="note" item={item} />
                </div>
                <span className="font-semibold">{formattedPrice} €</span>
            </div>
        </div>
    );
};

// Composant pour les extras/notes
export const ItemModifiers = ({ extras, notes }: Pick<CartItem, 'extras' | 'notes'>) => (
    <div className="text-muted-foreground my-2 space-y-2 divide-y text-sm">
        {extras?.length > 0 && (
            <div className="pb-2">
                <b>Extras</b>
                <ul className="list-disc">
                    {extras.map((extra, index) => (
                        <li key={`extra-${index}`}>
                            {extra.ingredient.name} ({extra.quantity}x {extra.ingredient.price_display})
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {notes?.length > 0 && (
            <div>
                <b>Notes</b>
                <ul className="list-disc">
                    {notes.map((note, index) => (
                        <li key={`note-${index}`}>{note}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

const AddExtraOrNoteModal = ({ type, ingredients, item }: { type: 'extra' | 'note'; ingredients?: Ingredient[]; item: CartItem }) => {
    const { cart, addExtra, removeExtra, addNote, removeNote } = useCart();
    const isExtra = type === 'extra';

    const [note, setNote] = useState<string>('');
    const handleAddNote = (note: string) => {
        if (note.trim() === '') return;
        addNote(item.id, note);
        setNote('');
    };
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
                            <Plus size={12} /> Ajouter un supplément
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
                            ingredients.map((ingredient) => {
                                const existing = cart.find((item) => item.id === item.id)?.extras.find((e) => e.ingredient.id === ingredient.id);
                                const qty = existing?.quantity ?? 0;

                                return (
                                    <div key={ingredient.id} className="flex items-center justify-between py-2">
                                        <span>{ingredient.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{ingredient.price_display}</span>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 rounded-full p-0"
                                                    onClick={() => removeExtra(item.id, ingredient.id)}
                                                    disabled={qty === 0}
                                                >
                                                    <Minus size={14} />
                                                </Button>
                                                <span className="w-4 text-center text-sm">{qty}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 rounded-full p-0"
                                                    onClick={() => addExtra(item.id, ingredient)}
                                                >
                                                    <Plus size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </ScrollArea>
                ) : (
                    <div>
                        <FormField id="note" label="Note">
                            <div className="flex gap-2">
                                <Input placeholder="Votre note ici..." value={note} onChange={(e) => setNote(e.target.value)} />
                                <Button
                                    className="shrink-0 rounded-full"
                                    size="icon"
                                    aria-label="Ajouter une note"
                                    onClick={() => handleAddNote(note)}
                                >
                                    <Plus size={12} />
                                </Button>
                            </div>
                        </FormField>
                        {item.notes.length > 0 && (
                            <div className="mt-2">
                                <ul className="divide-background-foreground list-disc space-y-2 divide-y">
                                    {item.notes.map((note, index) => (
                                        <li key={`note-${index}`} className="flex items-center justify-between py-0 pb-2">
                                            {note}
                                            <Button
                                                variant="link"
                                                size="icon"
                                                className="text-destructive h-auto w-auto p-0 hover:text-red-700"
                                                onClick={() => removeNote(item.id, note)}
                                                aria-label="Supprimer la note"
                                            >
                                                Supprimer
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

// Sous-composant pour le footer
export const OrderFooter = ({ setOpenPayModal }: { setOpenPayModal: (open: boolean) => void }) => {
    const { subtotal, taxTotals, total, cart } = useCart();
    return (
        <div className="border-accent space-y-4 border-t pt-4">
            <PriceRow label={`Total HTVA (${cart.length})`} value={subtotal} />

            {Object.entries(taxTotals).map(([taxRate, taxTotal]) => (
                <PriceRow key={taxRate} label={`Taxes ${taxRate}%`} value={taxTotal} />
            ))}

            <Button className="text-md flex h-12 w-full items-center justify-between" onClick={() => setOpenPayModal(true)}>
                <span className="text-lg">{total.toFixed(2)} €</span>
                <span className="flex items-center gap-2 text-sm">
                    Procéder au paiement
                    <MoveRight />
                </span>
            </Button>
        </div>
    );
};

// Composant réutilisable pour les lignes de prix
export const PriceRow = ({ label, value, className }: { label: string; value: number; className?: string }) => (
    <div className={cn('flex items-center justify-between py-2 text-sm font-medium', className)}>
        <span className={cn('text-muted-foreground', className)}>{label}</span>
        <span className={cn('font-medium', className)}>{value.toFixed(2)} €</span>
    </div>
);
