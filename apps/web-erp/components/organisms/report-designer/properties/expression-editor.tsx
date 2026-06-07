'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Kolom hasil query (gabungan semua data source) untuk autocomplete & picker. */
  columns: string[];
  rows?: number;
}

const AGGREGATES = ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN'] as const;
const SPECIAL = [
  { token: '{PageNumber}', label: 'Nomor halaman' },
  { token: '{TotalPageCount}', label: 'Total halaman' },
];

/** Token `{...}` yang sedang diketik tepat sebelum caret (untuk autocomplete). */
function openToken(text: string, caret: number): { start: number; query: string } | null {
  const before = text.slice(0, caret);
  const open = before.lastIndexOf('{');
  if (open < 0) return null;
  const between = before.slice(open + 1);
  if (between.includes('}')) return null; // sudah ditutup
  if (between.startsWith('{')) return null; // ini bagian dari {{agg}}
  return { start: open, query: between.trim() };
}

export function ExpressionEditor({ value, onChange, columns, rows = 2 }: Props) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [caret, setCaret] = React.useState(0);
  const [ac, setAc] = React.useState<{ start: number; query: string } | null>(null);
  const [hi, setHi] = React.useState(0);

  const suggestions = React.useMemo(() => {
    if (!ac) return [];
    const q = ac.query.toLowerCase();
    return columns.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
  }, [ac, columns]);

  function sync(el: HTMLTextAreaElement) {
    const c = el.selectionStart ?? el.value.length;
    setCaret(c);
    setAc(openToken(el.value, c));
    setHi(0);
  }

  /** Sisip teks di caret, ganti rentang [from,to). */
  function insertAt(text: string, from: number, to: number, caretOffset = text.length) {
    const next = value.slice(0, from) + text + value.slice(to);
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const pos = from + caretOffset;
      el.focus();
      el.setSelectionRange(pos, pos);
      sync(el);
    });
  }

  function pickColumn(col: string) {
    if (ac) insertAt(`{${col}}`, ac.start, caret);
    else insertAt(`{${col}}`, caret, caret);
    setAc(null);
  }

  function insertToken(token: string) {
    insertAt(token, caret, caret);
  }

  function insertAggregate(fn: string) {
    // butuh kolom — pakai placeholder bila belum ada pilihan
    const col = columns[0] ?? 'field';
    insertAt(`{{${fn}(${col})}}`, caret, caret);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!ac || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => (h + 1) % suggestions.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => (h - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pickColumn(suggestions[hi]); }
    else if (e.key === 'Escape') { setAc(null); }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1 mb-1">
        <PickerMenu icon="database" label="Field" items={columns} empty="Test Query dulu" onPick={pickColumn} />
        <PickerMenu icon="stats" label="Agregat" items={[...AGGREGATES]} onPick={insertAggregate} />
        {SPECIAL.map(s => (
          <button key={s.token} type="button" onClick={() => insertToken(s.token)} title={s.label}
            className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--bg-hover)] cursor-pointer">
            {s.label}
          </button>
        ))}
      </div>

      <textarea
        ref={ref}
        value={value}
        rows={rows}
        spellCheck={false}
        onChange={e => { onChange(e.target.value); sync(e.target); }}
        onKeyUp={e => sync(e.currentTarget)}
        onClick={e => sync(e.currentTarget)}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setAc(null), 120)}
        className="w-full border rounded px-2 py-1 text-sm font-mono resize-none bg-[var(--bg-card)]"
        placeholder="{field} · {{SUM(field)}} · teks bebas"
      />

      {ac && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded shadow-lg max-h-44 overflow-y-auto">
          {suggestions.map((c, i) => (
            <button
              key={c}
              type="button"
              onMouseDown={e => { e.preventDefault(); pickColumn(c); }}
              className={`w-full text-left px-2 py-1 text-xs font-mono cursor-pointer ${i === hi ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--bg-hover)]'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PickerMenu({ icon, label, items, empty, onPick }: {
  icon: string; label: string; items: string[]; empty?: string; onPick: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function h(e: MouseEvent) { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={wrap}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--bg-hover)] cursor-pointer">
        <Icon name={icon as never} size={10} />{label}
        <Icon name="chevdown" size={9} />
      </button>
      {open && (
        <div className="absolute z-50 left-0 mt-0.5 min-w-[140px] max-h-48 overflow-y-auto bg-[var(--bg-card)] border border-[var(--border)] rounded shadow-lg py-1">
          {items.length === 0 && <div className="px-2 py-1 text-[10px] text-[var(--fg-muted)] italic">{empty ?? 'Kosong'}</div>}
          {items.map(it => (
            <button key={it} type="button" onClick={() => { onPick(it); setOpen(false); }}
              className="w-full text-left px-2 py-1 text-xs font-mono hover:bg-[var(--bg-hover)] cursor-pointer">
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
