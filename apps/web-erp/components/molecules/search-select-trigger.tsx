'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import { SearchSelectOption } from './search-select-types';

interface SearchSelectTriggerProps {
  id?: string;
  isMulti: boolean;
  disabled: boolean;
  error: boolean;
  placeholder: string;
  triggerDisplay: string;
  inputText: string;
  dropdownOpen: boolean;
  dropdownOptions: SearchSelectOption[];
  dropdownLoading: boolean;
  currentValue?: string;
  triggerRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onTriggerFocus: () => void;
  onSingleFocus: () => void;
  onSingleBlur: (e: React.FocusEvent) => void;
  onSingleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSingleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onIconMouseDown: (e: React.MouseEvent) => void;
  onSelectFromDropdown: (opt: SearchSelectOption) => void;
}

export function SearchSelectTrigger({
  id, isMulti, disabled, error, placeholder,
  triggerDisplay, inputText, dropdownOpen, dropdownOptions, dropdownLoading,
  currentValue, triggerRef, dropdownRef,
  onTriggerFocus, onSingleFocus, onSingleBlur, onSingleChange,
  onSingleKeyDown, onIconMouseDown, onSelectFromDropdown,
}: SearchSelectTriggerProps) {
  const baseInputClass = cn(
    'flex h-[26px] w-full rounded-md border border-border bg-card px-2 pr-7 text-[calc(12.5px*var(--font-scale,1))] outline-none transition-[border-color,box-shadow] duration-75',
    'focus:border-primary focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--primary)_22%,transparent)]',
    'disabled:cursor-not-allowed disabled:opacity-45',
    error && 'border-destructive focus:border-destructive focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--destructive)_22%,transparent)]',
  );

  return (
    <div className="relative w-full">
      {isMulti ? (
        /* Multi: readOnly, focus → modal */
        <input
          ref={triggerRef}
          id={id}
          type="text"
          readOnly
          disabled={disabled}
          value={triggerDisplay}
          placeholder={placeholder}
          onFocus={onTriggerFocus}
          aria-invalid={error || undefined}
          className={cn(
            baseInputClass,
            'cursor-pointer',
            triggerDisplay ? 'text-foreground' : 'text-[var(--fg-subtle)]',
          )}
        />
      ) : (
        /* Single: editable, type → inline search; icon → modal */
        <input
          ref={triggerRef}
          id={id}
          type="text"
          disabled={disabled}
          value={inputText}
          placeholder={placeholder}
          onFocus={onSingleFocus}
          onBlur={onSingleBlur}
          onChange={onSingleChange}
          onKeyDown={onSingleKeyDown}
          autoComplete="off"
          aria-invalid={error || undefined}
          className={cn(
            baseInputClass,
            inputText ? 'text-foreground' : 'text-[var(--fg-subtle)]',
          )}
        />
      )}

      {/* Search icon — always opens modal */}
      <span
        onMouseDown={onIconMouseDown}
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
        style={{ fontSize: 'calc(13px * var(--font-scale, 1))' }}
      >
        <Icon name="search" className={dropdownLoading ? 'animate-pulse' : ''} />
      </span>

      {/* Inline dropdown (single mode only) */}
      {!isMulti && dropdownOpen && dropdownOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-flyout)]"
        >
          {dropdownOptions.map((opt) => {
            const codeStr = opt.code ? String(opt.code) : null;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSelectFromDropdown(opt); }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-[calc(12.5px*var(--font-scale,1))] hover:bg-accent hover:text-accent-foreground',
                  opt.value === currentValue && 'bg-accent/20',
                )}
              >
                {codeStr && (
                  <span className="shrink-0 font-mono text-[calc(12px*var(--font-scale,1))] text-[hsl(var(--primary))]">{codeStr}</span>
                )}
                {codeStr && <span className="text-muted-foreground">—</span>}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
