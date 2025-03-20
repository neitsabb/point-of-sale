import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Ingredient } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

interface CreateOrUpdateIngredientFormProps {
    ingredient?: Ingredient | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateOrUpdateIngredientForm = ({ ingredient, open, onClose, onSuccess }: CreateOrUpdateIngredientFormProps) => {
    const isEdit = Boolean(ingredient);

    console.log(ingredient);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        price: '0',
    });

    const [initialData, setInitialData] = useState<Ingredient | null>(null);

    useEffect(() => {
        if (ingredient) {
            setInitialData(ingredient);
            setData({
                name: ingredient.name,
                price: ingredient.price.toString(),
            });
        } else {
            reset();
        }
    }, [ingredient, reset, setData]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const action = isEdit ? put : post;

        action(route(isEdit ? 'ingredient.update' : 'ingredient.store', { id: ingredient?.id }), {
            ...data,
            onSuccess: () => {
                onSuccess();
                onClose();
            },
        });
    };

    const hasDataChanged = () => {
        if (!initialData) return true;
        return data.name !== initialData.name || parseFloat(data.price) !== initialData.price;
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
                        <FormField id="price" label="Prix" errors={errors}>
                            <Input
                                name="price"
                                id="price"
                                placeholder="Prix de l'ingrédient"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                disabled={processing}
                            />
                        </FormField>
                    </form>
                    <DrawerFooter>
                        <Button type="submit" form="ingredient-form" disabled={processing || !hasDataChanged()}>
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
