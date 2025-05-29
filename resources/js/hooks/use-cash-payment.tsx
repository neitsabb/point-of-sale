import { PaymentForm } from '@/components/orders/order-pay-modal';
import { InertiaFormProps } from '@inertiajs/react';
import { useState } from 'react';

export const useCashPayment = ({
    form,
    total_htva,
    total_ttc,
    initialAmount = '0',
}: {
    form: InertiaFormProps<PaymentForm>;
    total_htva: number;
    total_ttc: number;
    initialAmount?: string;
}) => {
    const [amount, setAmount] = useState(initialAmount);

    const updateAmount = (newAmount: string) => {
        setAmount(newAmount);
        form.setData('payload', {
            ...form.data.payload,
            amount_given: parseFloat(newAmount.replace(',', '.')),
            total_htva,
            total_ttc,
        });
    };

    const handleNumberClick = (num: string) => {
        let newAmount = amount;
        if (amount === '0' && num !== '.') {
            newAmount = num;
        } else {
            if (num === '.' && amount.includes('.')) return;
            newAmount = amount + num;
        }
        updateAmount(newAmount);
    };

    const handlePresetAmount = (value: string) => {
        updateAmount(value);
    };

    const handleBackspace = () => {
        const newAmount = amount.slice(0, -1) || '0';
        updateAmount(newAmount);
    };

    const change = parseFloat(amount.replace(',', '.')) - total_ttc;

    return {
        change,
        amount,
        handleNumberClick,
        handlePresetAmount,
        handleBackspace,
        isValid: parseFloat(amount.replace(',', '.')) >= total_ttc,
    };
};
