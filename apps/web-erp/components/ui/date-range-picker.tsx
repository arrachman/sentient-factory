'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { isSameDay } from 'date-fns';
import { DayPicker, type DateRange } from 'react-day-picker';
import { id as idLocale } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import {
  calendarNavBounds,
  formatDate,
  parseDisplayDate,
  parseIsoDate,
  toIsoDate,
  useDateFormat,
  type DateFormat,
} from '@/lib/date-format';

export type { DateRange };

interface DateRangePickerProps {
  /** ISO date string YYYY-MM-DD */
  from: string;
  to: string;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;
  id?: string;
  disabled?: boolean;
  /**
   * Fill the parent's width (form/drawer contexts). Default true.
   * Pass `false` in a horizontal flex bar so the control sizes to its own
   * content instead of overflowing a too-narrow box (see §2.40 slim filter bar).
   */
  fullWidth?: boolean;
}

const toDate = parseIsoDate;
const toIso = toIsoDate;

const inputBaseStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--fg)',
  fontSize: 'calc(13px * var(--font-scale, 1))',
  outline: 'none',
  padding: 0,
  cursor: 'text',
};

// Width fits a formatted date (e.g. "31/05/2026") plus a little slack.
const startStyle: React.CSSProperties = { ...inputBaseStyle, width: 104, flexShrink: 0 };
const endStyle: React.CSSProperties = { ...inputBaseStyle, flex: '1 0 104px', minWidth: 104 };

/**
 * Free-text editable date field for one end of the range. Shows the date
 * formatted per sys_settings when filled, and a friendly placeholder (no
 * browser dd/mm/yyyy) when empty. Typing is parsed liberally via
 * parseDisplayDate; committed on blur/Enter. Mirrors <DateInput> (§2.39).
 */
function EditableDate({
  iso, onChangeIso, fmt, placeholder, disabled, style, id,
}: {
  iso: string;
  onChangeIso: (v: string) => void;
  fmt: DateFormat;
  placeholder: string;
  disabled?: boolean;
  style: React.CSSProperties;
  id?: string;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);
  const display = formatDate(iso, fmt);
  const text = draft ?? display;

  // Restrict typed chars to digits + the active format's separators.
  const sanitize = React.useCallback(
    (raw: string) => {
      const token = fmt.format;
      const seps = Array.from(new Set(token.replace(/[A-Za-z]/g, '')))
        .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('');
      const cls = /MMM/.test(token) ? `\\dA-Za-z\\s${seps}` : `\\d${seps}`;
      return raw.replace(new RegExp(`[^${cls}]`, 'g'), '');
    },
    [fmt.format],
  );

  function commitDraft() {
    if (draft === null) return;
    const parsed = parseDisplayDate(draft, fmt);
    if (parsed !== null && parsed !== iso) onChangeIso(parsed);
    setDraft(null);
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      disabled={disabled}
      placeholder={placeholder}
      value={text}
      onChange={(e) => setDraft(sanitize(e.target.value))}
      onBlur={commitDraft}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); commitDraft(); }
        else if (e.key === 'Escape' && draft !== null) { e.preventDefault(); setDraft(null); }
      }}
      className="drp-input placeholder:text-[var(--fg-subtle)]"
      style={style}
    />
  );
}

export function DateRangePicker({
  from, to, onChangeFrom, onChangeTo, id, disabled, fullWidth = true,
}: DateRangePickerProps) {
  const fmt = useDateFormat();
  const navBounds = React.useMemo(calendarNavBounds, []);
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(() => toDate(from) ?? new Date());
  /**
   * react-day-picker v9 (min=0) sets `{ from, to }` to the same day on the
   * first click. We treat that as "start only" and keep the popover open so
   * the user can pick the end date. Second click (same or different day)
   * commits the full range and closes.
   */
  const awaitingEndRef = React.useRef(false);

  // Saat popover dibuka, navigate ke bulan tanggal mulai (atau hari ini bila kosong).
  // If only Mulai is already filled, stay in "awaiting end" so the next click
  // completes the range instead of being treated as a new start.
  function handleOpenChange(next: boolean) {
    if (next) {
      setMonth(toDate(from) ?? new Date());
      awaitingEndRef.current = Boolean(from && !to);
    }
    setOpen(next);
  }

  const selected: DateRange = { from: toDate(from), to: toDate(to) };

  function handleSelect(range: DateRange | undefined) {
    if (!range?.from) {
      onChangeFrom('');
      onChangeTo('');
      awaitingEndRef.current = false;
      return;
    }

    const fromDay = range.from;
    const toDay = range.to;
    // First click of a new range: rdp v9 (min=0) yields from===to, or only
    // `from` when min>0. Treat both as "start only" and stay open for end.
    const isStartOnly =
      !toDay || (isSameDay(fromDay, toDay) && !awaitingEndRef.current);

    if (isStartOnly) {
      onChangeFrom(toIso(fromDay));
      onChangeTo('');
      awaitingEndRef.current = true;
      return;
    }

    onChangeFrom(toIso(fromDay));
    onChangeTo(toIso(toDay));
    awaitingEndRef.current = false;
    setOpen(false);
  }

  function handleClear() {
    onChangeFrom('');
    onChangeTo('');
    awaitingEndRef.current = false;
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: fullWidth ? '100%' : 'fit-content',
          padding: '0 10px',
          height: 34,
          border: '1px solid var(--border)',
          borderRadius: 6,
          background: 'var(--panel)',
          gap: 6,
        }}
      >
        {/* Manual-editable start date */}
        <EditableDate
          id={id}
          iso={from}
          onChangeIso={onChangeFrom}
          fmt={fmt}
          placeholder="Mulai"
          disabled={disabled}
          style={startStyle}
        />

        <span style={{ color: 'var(--fg-faint)', fontSize: 'calc(12px * var(--font-scale, 1))', flexShrink: 0 }}>→</span>

        {/* Manual-editable end date */}
        <EditableDate
          iso={to}
          onChangeIso={onChangeTo}
          fmt={fmt}
          placeholder="Selesai"
          disabled={disabled}
          style={endStyle}
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
            captionLayout="dropdown"
            startMonth={navBounds.startMonth}
            endMonth={navBounds.endMonth}
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
