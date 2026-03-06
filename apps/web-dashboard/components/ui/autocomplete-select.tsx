import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type AutocompleteSelectOption = {
  value: string;
  label: string;
  keywords?: string;
  disabled?: boolean;
};

type AutocompleteSelectProps = {
  value?: string | null;
  onValueChange: (value: string) => void;
  options: AutocompleteSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  clearText?: string;
  className?: string;
  triggerClassName?: string;
};

export function AutocompleteSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  emptyText = 'No result found.',
  disabled = false,
  required = false,
  clearable = false,
  clearText = 'Clear selection',
  className,
  triggerClassName,
}: AutocompleteSelectProps) {
  const [open, setOpen] = useState(false);
  const normalizedValue = value ?? '';

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === normalizedValue)?.label ?? '',
    [options, normalizedValue],
  );

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn('h-7 w-full justify-between px-2.5 text-xs font-normal', triggerClassName)}
          >
            <span className="truncate text-left">{selectedLabel || placeholder}</span>
            <ChevronsUpDown className="ml-2 size-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {clearable && normalizedValue && !disabled ? (
                <CommandItem
                  value={clearText}
                  onSelect={() => {
                    onValueChange('');
                    setOpen(false);
                  }}
                >
                  <X className="mr-2 size-4 opacity-70" />
                  {clearText}
                </CommandItem>
              ) : null}
              {options.map((option, index) => (
                <CommandItem
                  key={`${option.value || 'option'}-${index}`}
                  value={`${option.label} ${option.keywords ?? ''}`}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(option.value ?? '');
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 size-4', normalizedValue === option.value ? 'opacity-100' : 'opacity-0')}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input value={normalizedValue} readOnly required={required} tabIndex={-1} className="sr-only" aria-hidden />
    </div>
  );
}
