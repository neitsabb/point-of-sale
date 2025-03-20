import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import InputError from './input-error';
import { Label } from './ui/label';

interface FormFieldProps {
    id: string;
    label: string;
    required?: boolean;
    children: ReactNode;
    errors?: { [key: string]: string };
    className?: string;
}

export const FormField = ({ id, label, required = true, children, errors, className }: FormFieldProps) => {
    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor={id}>
                {label} {required && <span className="text-red-400">*</span>}
            </Label>
            {children}
            {errors && errors[id] && <InputError message={errors[id]} />}
        </div>
    );
};
