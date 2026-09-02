'use client';

import { FormEvent, MouseEvent, useEffect, useRef } from 'react';
import type { ClientEntity } from '@/lib/crud/types';
import { SEMUA } from '@/lib/crud/filter-nilai';

/** Jeda sebelum ketikan pada kotak cari ikut memicu filter. */
const JEDA_CARI_MS = 400;

type Props = {
  entity: ClientEntity;
  hrefBase?: string;
  filters: Record<string, string>;
  limit: number;
  /** Bila diisi, filter dikirim lewat callback (tanpa reload halaman) alih-alih submit GET biasa. */
  onFilterChange?: (filters: Record<string, string>) => void;
};

/** Bilah filter: cari teks bebas + dropdown per kolom select/vlookup. Submit GET biasa
 * kecuali `onFilterChange` diberikan, lalu filter dikirim lewat fetch tanpa reload. */
export function FilterBar({ entity, hrefBase, filters, limit, onFilterChange }: Props) {
  const filterableFields = entity.fields.filter((field) => (
    // Filter turunan relasi tidak punya kolom di tabel, tapi tetap boleh difilter.
    field.filterWhere
      ? Boolean(field.options?.length)
      : entity.columns.some((column) => column.name === field.name) && (field.refOptions || field.type === 'select')
  ));
  // Filter berbawaan (mis. Status = Mukim) tetap terhitung "aktif" hanya bila
  // operator memilih sesuatu selain bawaannya — reset mengembalikannya ke sana.
  const adaFilterAktif = Boolean(filters.q) || filterableFields.some((field) => filters[field.name] && filters[field.name] !== field.filterDefault);

  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bersihkan timer debounce saat komponen dilepas agar tidak submit form yatim.
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const kirim = () => formRef.current?.requestSubmit();

  const kirimTertunda = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(kirim, JEDA_CARI_MS);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (!onFilterChange) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    delete values.limit;
    onFilterChange(values);
  };

  const reset = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onFilterChange) return;
    event.preventDefault();
    formRef.current?.reset();
    onFilterChange({});
  };

  return (
    <form ref={formRef} method="get" action={hrefBase} onSubmit={submit} className="card bilah-filter">
      <input type="hidden" name="limit" value={limit} />
      <div className="bilah-filter-kolom" style={{ flex: '1 1 260px', maxWidth: 420 }}>
        <label htmlFor="filter-q">Cari</label>
        <input id="filter-q" type="text" name="q" defaultValue={filters.q ?? ''} placeholder="Cari nama, kode, atau kata kunci…" onChange={kirimTertunda} />
      </div>
      {filterableFields.map((field) => {
        const options = field.refOptions ?? (field.options ?? []).map((option) => ({ id: option, label: field.optionLabels?.[option] ?? option }));
        return <div className="bilah-filter-kolom" key={field.name} style={{ flex: '0 1 190px' }}>
          <label htmlFor={`filter-${field.name}`}>{field.label}</label>
          <select id={`filter-${field.name}`} name={field.name} defaultValue={filters[field.name] ?? field.filterDefault ?? ''} onChange={kirim}>
            <option value={field.filterDefault ? SEMUA : ''}>Semua</option>
            {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </div>;
      })}
      <div className="bilah-filter-aksi">
        <button className="btn" type="submit" title="Filter" aria-label="Filter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
        </button>
        {adaFilterAktif && <a className="btn btn-sekunder" href={`${hrefBase}?limit=${limit}`} onClick={reset}>Reset</a>}
      </div>
    </form>
  );
}
