'use client';

import * as React from 'react';

export function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-[11px] text-[var(--fg-muted)] w-24 shrink-0 pt-1">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-semibold text-[var(--fg-muted)] uppercase tracking-wide mb-1 mt-2">{children}</div>;
}

export function NumInput({ value, onChange, min, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] font-mono"
    />
  );
}

export function TxtInput({ value, onChange, mono }: { value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] ${mono ? 'font-mono' : ''}`}
    />
  );
}

export function ChkInput({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="text-xs">{label}</span>
    </label>
  );
}

export function SelectInput<T extends string | number>({ value, options, onChange }: {
  value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={e => {
        const raw = e.target.value;
        const opt = options.find(o => String(o.value) === raw);
        if (opt) onChange(opt.value);
      }}
      className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] cursor-pointer"
    >
      {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
    </select>
  );
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 items-center">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-6 h-6 rounded border cursor-pointer shrink-0" />
      <TxtInput value={value} onChange={onChange} mono />
    </div>
  );
}
