import { roundPrice } from '@/lib/utils';
import { Category, Ingredient, Product, ProductIngredient } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type CreateOrUpdateProductDto = {
    id?: string;
    name: string;
    price_without_tax: number;
    auto_price_enabled: boolean;
    round_price_enabled: boolean;
    tax: number;
    margin: number;
    image?: string | File | null;
    ingredients: ProductIngredient[];
    category_id: string;
};

interface useProductFormProps {
    product?: Product | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const useProductForm = ({ product, onClose, onSuccess }: useProductFormProps) => {
    const isEdit = Boolean(product);

    const { ingredients, categories } = usePage<{ ingredients: Ingredient[]; categories: Category[] }>().props;

    const { data, setData, processing, post, errors, reset } = useForm<CreateOrUpdateProductDto>({
        name: '',
        auto_price_enabled: false,
        round_price_enabled: false,
        price_without_tax: 0,
        tax: 0,
        margin: 0,
        ingredients: [],
        image: undefined,
        category_id: '',
    });

    const [autoPriceCalculation, setAutoPriceCalculation] = useState<boolean>(product?.price.auto_price_calculation || false);
    const [costPrice, setCostPrice] = useState<number>(0);
    const [priceWithoutTax, setPriceWithoutTax] = useState<number>(0);
    const [priceWithMargin, setPriceWithMargin] = useState<number>(0);
    const [priceWithTax, setPriceWithTax] = useState<number>(0);
    const [margin, setMargin] = useState<number>(data.margin);
    const [tax, setTax] = useState<number>(data.tax);
    const [roundSellingPrice, setRoundSellingPrice] = useState<boolean>(false);
    const [selectedIngredients, setSelectedIngredients] = useState<ProductIngredient[]>(product?.ingredients || []);
    const [selectedCategory, setSelectedCategory] = useState<string>(product?.category?.id || '');

    useEffect(() => {
        if (product) {
            setData({
                name: product.name,
                auto_price_enabled: product.price.auto_price_calculation,
                round_price_enabled: product.price.round_price_enabled,
                price_without_tax: product.price.without_tax,
                tax: product.price.tax,
                margin: product.price.margin,
                ingredients: product.ingredients,
                image: product.image,
                category_id: product?.category?.id,
            });
            setSelectedIngredients(product.ingredients);
            setSelectedCategory(product?.category?.id);
            setPriceWithoutTax(Math.round(product.price.without_tax * 100) / 100);
            setPriceWithMargin(product.price.with_margin);
            setTax(product.price.tax);
            setMargin(product.price.margin);
            setPriceWithTax(product.price.selling_price);
            setAutoPriceCalculation(product.price.auto_price_calculation);
            setRoundSellingPrice(product.price.round_price_enabled);
        } else {
            reset();
            setSelectedIngredients([]);
            setSelectedCategory('');
            setCostPrice(0);
            setPriceWithoutTax(0);
            setPriceWithMargin(0);
            setPriceWithTax(0);
            setAutoPriceCalculation(false);
            setRoundSellingPrice(false);
            setMargin(0);
            setTax(0);
        }
    }, [product, reset, setData]);

    useEffect(() => {
        setData((prev) => ({ ...prev, ingredients: selectedIngredients }));
    }, [selectedIngredients, setData]);

    const calculatePriceAutomatic = useCallback(() => {
        const coutTotalIngredients = selectedIngredients.reduce((acc, ingredient) => {
            const ingredientData = ingredients.find((i: Ingredient) => i.id === ingredient.id);
            return acc + (ingredientData ? ingredientData.price * ingredient.quantity : 0);
        }, 0);

        // Calcul du prix sans taxe
        const sellingPriceWithoutTax = Math.round(coutTotalIngredients * 100) / 100;

        // Calcul du prix sans taxe avec la marge
        const sellingPriceWithMargin = sellingPriceWithoutTax * (1 + margin / 100);

        // Arrondi du prix avec marge
        const roundedSellingPriceWithMargin = Math.round(sellingPriceWithMargin * 100) / 100;

        // Calcul du prix avec TVA
        let sellingPriceWithTax = roundedSellingPriceWithMargin * (1 + tax / 100);

        // Arrondi du prix TTC
        sellingPriceWithTax = roundSellingPrice ? roundPrice(sellingPriceWithTax) : Math.round(sellingPriceWithTax * 100) / 100;

        setData('price_without_tax', sellingPriceWithoutTax);
        setPriceWithoutTax(sellingPriceWithoutTax);
        setPriceWithMargin(roundedSellingPriceWithMargin);
        setPriceWithTax(sellingPriceWithTax);
    }, [selectedIngredients, ingredients, margin, tax, roundSellingPrice, setData]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log('submit!!', data);

        post(route(isEdit ? 'products.update' : 'products.store', product?.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                onSuccess();
            },
        });
    };

    useEffect(() => {
        if (autoPriceCalculation) {
            calculatePriceAutomatic();
        }
    }, [selectedIngredients, autoPriceCalculation, margin, tax, ingredients, calculatePriceAutomatic]);

    useEffect(() => {
        if (!autoPriceCalculation) {
            const sellingPriceWithMargin = priceWithoutTax * (1 + margin / 100);

            const roundedSellingPriceWithMargin = Math.round(sellingPriceWithMargin * 100) / 100;

            setPriceWithMargin(roundedSellingPriceWithMargin);

            let sellingPriceWithTax = roundedSellingPriceWithMargin * (1 + tax / 100);

            sellingPriceWithTax = roundSellingPrice ? roundPrice(sellingPriceWithTax) : Math.round(sellingPriceWithTax * 100) / 100;

            setPriceWithTax(sellingPriceWithTax);
        }
    }, [priceWithoutTax, margin, tax, roundSellingPrice, autoPriceCalculation]);

    useEffect(() => {
        setData('category_id', selectedCategory as string);
        setData('tax', tax);
        setData('margin', margin);
        setData('auto_price_enabled', autoPriceCalculation);
        setData('round_price_enabled', roundSellingPrice);
    }, [selectedCategory, setData, tax, margin, autoPriceCalculation, roundSellingPrice]);

    return {
        isEdit,
        data,
        setData,
        processing,
        errors,
        reset,
        onSubmit,
        ingredients,
        selectedIngredients,
        setSelectedIngredients,
        categories,
        selectedCategory,
        setSelectedCategory,
        autoPriceCalculation,
        setAutoPriceCalculation,
        costPrice,
        priceWithoutTax,
        priceWithMargin,
        priceWithTax,
        setPriceWithoutTax,
        margin,
        setMargin,
        tax,
        setTax,
        calculatePriceAutomatic,
        roundSellingPrice,
        setRoundSellingPrice,
    };
};
