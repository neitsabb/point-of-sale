import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProductFilters } from '@/hooks/use-products-filters';
import type { ProductsFilters } from '@/types';
import { Category } from '@/types';
import { CheckIcon, ChevronsUpDownIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';

const ProductsFilters = ({ filters, categories }: { filters: ProductsFilters; categories: Category[] }) => {
    const { statusOptions, categoryOptions, handleFilterChange, handleResetFilters } = useProductFilters(filters, categories);

    const [openCategory, setOpenCategory] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);

    // Fonction pour fermer le popover lorsque vous sélectionnez un élément
    const handleCategorySelect = (categoryId: string) => {
        handleFilterChange('category_id', categoryId);
        setOpenCategory(false); // Ferme le popover après sélection
    };

    const handleStatusSelect = (statusValue: string) => {
        handleFilterChange('status', statusValue);
        setOpenStatus(false); // Ferme le popover après sélection
    };

    return (
        <div className="mb-4 flex items-center justify-end space-x-4">
            {/* Catégories */}
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                    <div>
                        <Button variant="outline" size="sm" role="combobox">
                            {filters.category_id ? categoryOptions.find((c) => c.id == filters.category_id)?.name : 'Toutes les catégories'}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="end">
                    <Command>
                        <CommandInput placeholder="Rechercher une catégorie..." />
                        <CommandList>
                            <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                            <CommandGroup>
                                {categoryOptions.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.id}
                                        onSelect={() => handleCategorySelect(category.id)} // Fermer le popover après sélection
                                    >
                                        {category.name}
                                        <CheckIcon className={`ml-auto ${filters.category_id === category.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* État */}
            <Popover open={openStatus} onOpenChange={setOpenStatus}>
                <PopoverTrigger asChild>
                    <div>
                        <Button variant="outline" size="sm" role="combobox">
                            {filters.status ? statusOptions.find((s) => s.value === filters.status)?.label : 'Tous les états'}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-0" align="end">
                    <Command>
                        <CommandInput placeholder="Rechercher un état..." />
                        <CommandList>
                            <CommandEmpty>Aucun état trouvé.</CommandEmpty>
                            <CommandGroup>
                                {statusOptions.map((status) => (
                                    <CommandItem key={status.value} value={status.value} onSelect={() => handleStatusSelect(status.value)}>
                                        {status.label}
                                        <CheckIcon className={`ml-auto ${filters.status === status.value ? 'opacity-100' : 'opacity-0'}`} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {(filters.category_id || filters.status) && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                {' '}
                                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                                    <RotateCcwIcon />
                                </Button>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="end">
                            <p>Réinitialiser les filtres</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};

export default ProductsFilters;
