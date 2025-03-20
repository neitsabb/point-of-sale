import { ReactNode } from 'react';

export default function Heading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
    return (
        <header className="mb-8 flex w-full items-center justify-between">
            <div className="space-y-0.5">
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>

            {action && action}
        </header>
    );
}
