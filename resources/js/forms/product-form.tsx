import { FormField } from '@/components/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useProductForm } from '@/hooks/use-product-form';
import { cn } from '@/lib/utils';
import { Ingredient, Product } from '@/types';
import { useMemo, useState } from 'react';

type ProductIngredient = {
    id: string;
    quantity: number;
};

interface CreateOrUpdateProductFormProps {
    product?: Product | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateOrUpdateProductForm = ({ product, open, onClose, onSuccess }: CreateOrUpdateProductFormProps) => {
    const {
        isEdit,
        data,
        setData,
        onSubmit,
        processing,
        errors,
        reset,
        ingredients,
        selectedIngredients,
        setSelectedIngredients,
        categories,
        selectedCategory,
        setSelectedCategory,
        autoPriceCalculation,
        setAutoPriceCalculation,
        costPrice,
        priceWithTax,
        priceWithMargin,
        priceWithoutTax,
        setPriceWithoutTax,
        margin,
        setMargin,
        tax,
        setTax,
        calculatePriceAutomatic,
        roundSellingPrice,
        setRoundSellingPrice,
    } = useProductForm({
        product,
        onClose,
        onSuccess,
    });

    return (
        <Drawer
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    reset();
                    setSelectedIngredients([]);
                    setSelectedCategory('');
                }
                onClose();
            }}
            direction="right"
        >
            <DrawerContent className="w-full max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>{isEdit ? 'Modifier le produit' : 'Ajouter un produit'}</DrawerTitle>
                    <DrawerDescription>{isEdit ? 'Vous pouvez modifier ce produit ici.' : 'Ajoutez un nouveau produit ici.'}</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={onSubmit} id="product-form" className="space-y-2" encType="multipart/form-data">
                    <FormField id="image" label="Image" errors={errors} required={false}>
                        <Input
                            id="image"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setData('image', e.target.files[0]);
                                }
                            }}
                        />
                    </FormField>
                    <div className="flex gap-4">
                        <FormField id="name" label="Nom" errors={errors} className="w-3/5">
                            <Input
                                name="name"
                                id="name"
                                placeholder="Nom du produit"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                            />
                        </FormField>
                        <FormField id="category_id" label="Catégorie" errors={errors} className="w-2/5">
                            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Catégorie du produit">
                                        {categories.find((c) => c.id == selectedCategory)?.name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Catégories</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>
                    {/* Prix */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField id="tax" label="Taux de TVA" errors={errors} required={true}>
                            <Select value={tax.toString()} onValueChange={(value) => setTax(parseFloat(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Taux de TVA" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">0 %</SelectItem>
                                    <SelectItem value="6">6 %</SelectItem>
                                    <SelectItem value="12">12 %</SelectItem>
                                    <SelectItem value="21">21 %</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField id="margin" label="Marge bénéficaire en %" errors={errors} required={false}>
                            <Input
                                name="margin"
                                id="margin"
                                placeholder="Marge bénéficiare"
                                value={margin}
                                type="number"
                                onChange={(e) => setMargin(parseInt(e.target.value))}
                            />
                        </FormField>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField id="price" label="Prix HTVA" errors={errors}>
                                <Input
                                    name="price"
                                    id="price"
                                    placeholder="Prix HTVA du produit"
                                    type="number"
                                    value={priceWithoutTax}
                                    onChange={(e) => {
                                        setPriceWithoutTax(parseFloat(e.target.value));
                                        setData('price_without_tax', parseFloat(e.target.value));
                                    }}
                                    disabled={autoPriceCalculation || processing} // Désactivé si auto calcul activé ou en traitement
                                />
                            </FormField>
                            <FormField id="price" label="Prix avec marge" errors={errors}>
                                <Input name="price" id="price" placeholder="Prix avec marge" type="number" value={priceWithMargin} disabled={true} />
                            </FormField>
                            <FormField id="price" label="Prix de vente" errors={errors} required={false}>
                                <Input name="price" id="price" placeholder="Prix de vente" type="number" value={priceWithTax} disabled={true} />
                            </FormField>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="col-span-2 flex items-center gap-2">
                                <Switch
                                    id="auto-price-calculation"
                                    checked={autoPriceCalculation}
                                    onCheckedChange={() => {
                                        setAutoPriceCalculation(!autoPriceCalculation);
                                        if (!autoPriceCalculation) {
                                            calculatePriceAutomatic();
                                        }
                                    }}
                                />
                                <Label htmlFor="auto-price-calculation" className="text-muted-foreground text-xs">
                                    Calculer automatiquement le prix en fonction des ingrédients
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="round-selling-price"
                                    checked={roundSellingPrice}
                                    onCheckedChange={() => {
                                        setRoundSellingPrice(!roundSellingPrice);
                                    }}
                                />
                                <Label htmlFor="round-selling-price" className="text-muted-foreground text-xs">
                                    Arrondir le prix de vente
                                </Label>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <FormField label="Ingredients" id="ingredients" required={false}>
                        <IngredientsList
                            ingredients={ingredients}
                            selectedIngredients={selectedIngredients}
                            setSelectedIngredients={setSelectedIngredients}
                        />
                    </FormField>
                </form>
                <DrawerFooter>
                    <Button type="submit" form="product-form" disabled={processing}>
                        {isEdit ? 'Modifier' : 'Ajouter'}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

const IngredientsList = ({
    ingredients,
    selectedIngredients,
    setSelectedIngredients,
}: {
    ingredients: Ingredient[];
    selectedIngredients: ProductIngredient[];
    setSelectedIngredients: React.Dispatch<React.SetStateAction<ProductIngredient[]>>;
}) => {
    const [search, setSearch] = useState<string>('');

    const filteredIngredients = useMemo(
        () =>
            ingredients
                .filter((ingredient) => ingredient.name.toLowerCase().includes(search.toLowerCase()))
                .sort((a, b) => {
                    const isASelected = selectedIngredients.some((selectedIngredient) => selectedIngredient.id === a.id);
                    const isBSelected = selectedIngredients.some((selectedIngredient) => selectedIngredient.id === b.id);

                    // Les ingrédients sélectionnés passent en premier
                    if (isASelected && !isBSelected) return -1;
                    if (!isASelected && isBSelected) return 1;
                    return 0; // Si les deux sont sélectionnés ou non, pas de changement
                }),
        [ingredients, search, selectedIngredients],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between gap-4">
                <Input type="search" placeholder="Rechercher un ingrédient" className="w-1/2" value={search} onChange={handleSearchChange} />
                <span className="text-muted-foreground text-sm">{filteredIngredients.length} ingrédient(s) trouvé(s).</span>
            </div>
            <ScrollArea type="scroll" className="h-full w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-660px)]">
                <ul role="list" className="divide-y divide-gray-100">
                    {filteredIngredients.map((ingredient) => (
                        <IngredientListItem
                            key={ingredient.id}
                            ingredient={ingredient}
                            selectedIngredients={selectedIngredients}
                            setSelectedIngredients={setSelectedIngredients}
                        />
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );
};

export const IngredientListItem = ({
    ingredient,
    selectedIngredients,
    setSelectedIngredients,
}: {
    ingredient: Ingredient;
    selectedIngredients: ProductIngredient[];
    setSelectedIngredients: React.Dispatch<React.SetStateAction<ProductIngredient[]>>;
}) => {
    const selectedIngredient = selectedIngredients.find((selected) => selected.id === ingredient.id);

    const [quantity, setQuantity] = useState<number>(selectedIngredient?.quantity || 0);

    const isSelected = useMemo(
        () => selectedIngredients.some((selectedIngredient) => selectedIngredient.id === ingredient.id),
        [selectedIngredients, ingredient.id],
    );

    const handleAddIngredient = () => {
        setSelectedIngredients((prev: ProductIngredient[]) => [
            ...prev,
            {
                id: ingredient.id,
                quantity: quantity,
            } as ProductIngredient,
        ]);
    };

    const handleUpdateIngredient = () => {
        if (quantity === 0) {
            setSelectedIngredients((prev: ProductIngredient[]) => prev.filter((selectedIngredient) => selectedIngredient.id !== ingredient.id));
            return;
        }

        setSelectedIngredients((prev: ProductIngredient[]) =>
            prev.map((selectedIngredient) => (selectedIngredient.id === ingredient.id ? { ...selectedIngredient, quantity } : selectedIngredient)),
        );
    };

    return (
        <li key={ingredient.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
                <img alt="" src={ingredient.image} className="size-12 flex-none rounded-full bg-gray-50" />
                <div className="min-w-0 flex-auto">
                    <div className="text-sm/6 font-semibold text-gray-900">
                        {ingredient.name}

                        {isSelected && (
                            <Badge variant="green" className="ml-2 py-0">
                                Sélectionné
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{ingredient.price} €/unité</p>
                </div>
            </div>
            <div className="hidden shrink-0 gap-2 sm:flex sm:flex-col sm:items-end md:flex-row">
                <IngredientQuantityInput unit={ingredient.unit} quantity={quantity} setQuantity={setQuantity} />
                <Button type="button" variant="outline" size="sm" onClick={isSelected ? handleUpdateIngredient : handleAddIngredient}>
                    {isSelected ? 'Modifier' : 'Ajouter'}
                </Button>
            </div>
        </li>
    );
};

const IngredientQuantityInput = ({ unit, quantity, setQuantity }: { unit: string; quantity: number; setQuantity: (quantity: number) => void }) => {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseFloat(e.target.value);
        if (newQuantity < 0 || isNaN(newQuantity)) return; // Empêche les quantités négatives
        setQuantity(newQuantity);
    };

    return (
        <div
            className={cn(
                'border-input bg-muted ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-within:ring-ring focus-disabled:cursor-not-allowed flex h-8 w-24 items-center gap-x-1 rounded-md border px-3 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-within:ring-2 focus-within:ring-offset-2 md:text-sm',
            )}
        >
            <input
                type="number"
                className="disabled:bg-muted w-full outline-none"
                step={0.5}
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Quantité"
            />
            <span>{unit}</span>
        </div>
    );
};
