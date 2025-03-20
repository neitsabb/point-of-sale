import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

interface CreateOrUpdateCategoryFormProps {
    category?: Category | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateOrUpdateCategoryForm = ({ category, open, onClose, onSuccess }: CreateOrUpdateCategoryFormProps) => {
    const isEdit = Boolean(category);

    console.log(category);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });

    const [initialData, setInitialData] = useState<Category | null>(null);

    useEffect(() => {
        if (category) {
            setInitialData(category);
            setData({
                name: category.name,
            });
        } else {
            reset();
        }
    }, [category, reset, setData]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const action = isEdit ? put : post;

        action(route(isEdit ? 'categories.update' : 'categories.store', { id: category?.id }), {
            ...data,
            onSuccess: () => {
                onSuccess();
                onClose();
            },
        });
    };

    const hasDataChanged = () => {
        if (!initialData) return true;
        return data.name !== initialData.name;
    };

    return (
        <Drawer open={open} onOpenChange={onClose} direction="right">
            <DrawerContent className="w-full max-w-xl">
                <div className="w-full">
                    <DrawerHeader>
                        <DrawerTitle>{isEdit ? 'Modifier la catégorie' : 'Ajouter un catégorie'}</DrawerTitle>
                        <DrawerDescription>
                            {isEdit ? 'Vous pouvez modifier cet catégorie ici.' : 'Ajoutez une nouvelle catégorie ici.'}
                        </DrawerDescription>
                    </DrawerHeader>
                    <form onSubmit={onSubmit} id="category-form" className="space-y-4">
                        <FormField id="name" label="Nom" errors={errors}>
                            <Input
                                name="name"
                                id="name"
                                placeholder="Nom de la catégorie"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                            />
                        </FormField>
                    </form>
                    <DrawerFooter>
                        <Button type="submit" form="category-form" disabled={processing || !hasDataChanged()}>
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
