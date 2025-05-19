import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Ingredient } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

interface CreateOrUpdateIngredientFormProps {
    ingredient?: Ingredient | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type CreateOrUpdateIngredientDto = {
    name: string;
    description: string;
    price: string;
    unit: string;
    stock_quantity: number;
    critical_stock: number;
    purchase_unit: string;
    purchase_unit_size: number;
    purchase_price: number;
};

export const CreateOrUpdateIngredientForm = ({ ingredient, open, onClose, onSuccess }: CreateOrUpdateIngredientFormProps) => {
    const isEdit = Boolean(ingredient);

    const { data, setData, post, put, processing, errors, reset } = useForm<CreateOrUpdateIngredientDto>({
        name: '',
        description: '',
        price: '0',
        unit: 'unit',
        stock_quantity: 0,
        critical_stock: 0,
        purchase_unit: 'unit',
        purchase_unit_size: 0,
        purchase_price: 0,
    });

    useEffect(() => {
        if (ingredient) {
            setData({
                name: ingredient.name,
                description: ingredient.description || '',
                price: ingredient.price.toString(),
                unit: ingredient.unit.value,
                stock_quantity: ingredient.stock_quantity,
                critical_stock: ingredient.critical_stock,
                purchase_unit: ingredient.purchase_unit.value,
                purchase_unit_size: ingredient.purchase_unit_size,
                purchase_price: ingredient.purchase_price,
            });
        } else {
            reset();
        }
    }, [ingredient, reset, setData]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const action = isEdit ? put : post;

        action(route(isEdit ? 'ingredients.update' : 'ingredients.store', { id: ingredient?.id }), {
            ...data,
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: (e) => console.error(e),
        });
    };

    return (
        <Drawer open={open} onOpenChange={onClose} direction="right">
            <DrawerContent className="w-full max-w-xl">
                <div className="w-full">
                    <DrawerHeader>
                        <DrawerTitle>{isEdit ? "Modifier l'ingrédient" : 'Ajouter un ingrédient'}</DrawerTitle>
                        <DrawerDescription>
                            {isEdit ? 'Vous pouvez modifier cet ingrédient ici.' : 'Ajoutez un nouveau ingrédient ici.'}
                        </DrawerDescription>
                    </DrawerHeader>
                    <form onSubmit={onSubmit} id="ingredient-form" className="space-y-4">
                        <FormField id="name" label="Nom" errors={errors}>
                            <Input
                                name="name"
                                id="name"
                                placeholder="Nom de l'ingrédient"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                            />
                        </FormField>
                        <FormField id="description" label="Description" errors={errors}>
                            <Textarea
                                name="description"
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                            />
                        </FormField>
                        <div className="grid grid-cols-2 space-x-4">
                            {/* <FormField id="price" label="Prix unitaire" errors={errors}>
                                <Input
                                    name="price"
                                    id="price"
                                    placeholder="Prix unitaire"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    disabled={processing}
                                />
                            </FormField> */}
                            <FormField id="unit" label="Unité de mesure" errors={errors}>
                                <Select defaultValue={data.unit} onValueChange={(value) => setData('unit', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir une unité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="unit">Unitaire</SelectItem>
                                            <SelectItem value="g">Gramme</SelectItem>
                                            <SelectItem value="kg">Kilogramme</SelectItem>
                                            <SelectItem value="ml">Mililitre</SelectItem>
                                            <SelectItem value="cl">Centilitre</SelectItem>
                                            <SelectItem value="l">Litre</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField id="purchase_unit" label="Unité d'achat" errors={errors}>
                                <Select
                                    defaultValue={data.purchase_unit}
                                    onValueChange={(value) => setData('purchase_unit', value)}
                                    name="purchase_unit"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir une unité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="unit">Contenant</SelectItem>
                                            <SelectItem value="g">Gramme</SelectItem>
                                            <SelectItem value="kg">Kilogramme</SelectItem>
                                            <SelectItem value="ml">Mililitre</SelectItem>
                                            <SelectItem value="cl">Centilitre</SelectItem>
                                            <SelectItem value="l">Litre</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 space-x-4">
                            <FormField id="purchase_price" label="Prix d'achat (en €)" errors={errors}>
                                <Input
                                    name="purchase_price"
                                    id="purchase_price"
                                    placeholder="Prix d'achat (en €)"
                                    type="number"
                                    value={data.purchase_price}
                                    onChange={(e) => setData('purchase_price', parseFloat(e.target.value))}
                                    disabled={processing}
                                />
                            </FormField>
                            <FormField id="purchase_unit_size" label="Quantité par achat" errors={errors}>
                                <Input
                                    name="purchase_unit_size"
                                    id="purchase_unit_size"
                                    placeholder={`Quantité par achat (en ${data.purchase_unit})`}
                                    type="number"
                                    value={data.purchase_unit_size}
                                    onChange={(e) => setData('purchase_unit_size', parseFloat(e.target.value))}
                                    disabled={processing}
                                />
                            </FormField>
                        </div>
                        <FormField id="unit_price" label="Prix unitaire" required={false}>
                            <Input value={0} disabled={true} />
                        </FormField>

                        <div className="grid grid-cols-2 space-x-4">
                            <FormField id="quantity" label="En stock" errors={errors}>
                                <Input
                                    name="quantity"
                                    id="quantity"
                                    placeholder="Stock disponible"
                                    type="number"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', parseFloat(e.target.value))}
                                    disabled={processing}
                                />
                            </FormField>
                            <FormField id="critical_stock" label="Seuil de stock critique" errors={errors}>
                                <Input
                                    name="critical_stock"
                                    id="critical_stock"
                                    placeholder="Seuil de stock critique"
                                    type="number"
                                    value={data.critical_stock}
                                    onChange={(e) => setData('critical_stock', parseFloat(e.target.value))}
                                    disabled={processing}
                                />
                            </FormField>
                        </div>
                    </form>
                    <DrawerFooter>
                        <Button type="submit" form="ingredient-form" disabled={processing}>
                            {isEdit ? 'Modifier' : 'Ajouter'}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
