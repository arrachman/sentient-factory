'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format, isValid, parseISO } from 'date-fns';
import { id as idLocale } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

export type { DateRange };

interface DateRangePickerProps {
  /** ISO date string YYYY-MM-DD */
  from: string;
  to: string;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;
  id?: string;
  disabled?: boolean;
}

function toDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = parseISO(iso);
  return isValid(d) ? d : undefined;
}

function toIso(d: Date | undefined): string {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

const inputStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--fg)',
  fontSize: 'calc(13px * var(--font-scale, 1))',
  outline: 'none',
  padding: 0,
  cursor: 'text',
  width: 120,
};

export function DateRangePicker({
  from, to, onChangeFrom, onChangeTo, id, disabled,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(() => toDate(from) ?? new Date());

  // Saat popover dibuka, navigate ke bulan tanggal mulai (atau hari ini bila kosong)
  function handleOpenChange(next: boolean) {
    if (next) setMonth(toDate(from) ?? new Date());
    setOpen(next);
  }

  const selected: DateRange = { from: toDate(from), to: toDate(to) };

  function handleSelect(range: DateRange | undefined) {
    onChangeFrom(toIso(range?.from));
    onChangeTo(toIso(range?.to));
    if (range?.from && range?.to) setOpen(false);
  }

  function handleClear() {
    onChangeFrom('');
    onChangeTo('');
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0 10px',
          height: 34,
          border: '1px solid var(--border)',
          borderRadius: 6,
          background: 'var(--panel)',
          gap: 6,
        }}
      >
        {/* Manual-editable start date */}
        <input
          id={id}
          type="date"
          value={from}
          onChange={(e) => onChangeFrom(e.target.value)}
          disabled={disabled}
          className="drp-input"
          style={inputStyle}
        />

        <span style={{ color: 'var(--fg-faint)', fontSize: 'calc(12px * var(--font-scale, 1))', flexShrink: 0 }}>→</span>

        {/* Manual-editable end date */}
        <input
          type="date"
          value={to}
          onChange={(e) => onChangeTo(e.target.value)}
          disabled={disabled}
          className="drp-input"
          style={{ ...inputStyle, flex: 1 }}
        />

        {/* Clear button — visible only when any date is set */}
        {(from || to) && (
          <button
            type="button"
            onClick={handleClear}
            title="Hapus tanggal"
            style={{
              background: 'none',
              border: 'none',
              padding: '0 2px',
              cursor: 'pointer',
              color: 'var(--fg-subtle)',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <XIcon />
          </button>
        )}

        {/* Calendar icon — opens range picker popover */}
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            title="Buka kalender"
            style={{
              background: 'none',
              border: 'none',
              padding: '0 2px',
              cursor: 'pointer',
              color: 'var(--fg-muted)',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <CalendarIcon />
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-flyout)',
            padding: 12,
            zIndex: 9999,
            color: 'var(--fg)',
          }}
        >
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={2}
            locale={idLocale}
          />
          {(from || to) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  fontSize: 'calc(12px * var(--font-scale, 1))',
                  color: 'var(--danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 6px',
                }}
              >
                Hapus tanggal
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2.5" width="14" height="12" rx="2" />
      <path d="M1 6.5h14M5 1v3M11 1v3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 2l8 8M10 2l-8 8" />
    </svg>
  );
}
