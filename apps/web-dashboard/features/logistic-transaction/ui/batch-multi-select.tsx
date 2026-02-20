'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type BatchOption = {
  batchNumber: string;
  qtyPcs: number;
  disabled?: boolean;
};

type BatchMultiSelectProps = {
  value: string[];
  options: BatchOption[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  required?: boolean;
};

export function BatchMultiSelect({
  value,
  options,
  onChange,
  placeholder = 'Select batches',
  searchPlaceholder = 'Search batch...',
  emptyText = 'No batch found.',
  disabled = false,
  required = false,
}: BatchMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (value.length === 0) {
      return '';
    }
    if (value.length === 1) {
      return `${value[0]} (1 batch)`;
    }
    return `${value.length} batch selected`;
  }, [value]);

  const toggleBatch = (batchNumber: string) => {
    if (value.includes(batchNumber)) {
      onChange(value.filter((item) => item !== batchNumber));
      return;
    }
    onChange([...value, batchNumber]);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-9 w-full justify-between px-2 text-sm font-normal"
          >
            <span className="truncate text-left">{selectedLabel || placeholder}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.batchNumber}
                  value={`${option.batchNumber} ${option.qtyPcs}`}
                  disabled={option.disabled}
                  onSelect={() => toggleBatch(option.batchNumber)}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value.includes(option.batchNumber) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{option.batchNumber}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {option.qtyPcs.toLocaleString('id-ID')} pcs
                  </span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        value={value.join(',')}
        readOnly
        required={required}
        tabIndex={-1}
        className="sr-only"
        aria-hidden
      />
    </div>
  );
}
