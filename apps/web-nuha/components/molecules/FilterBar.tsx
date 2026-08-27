import type { ClientEntity } from '@/lib/crud/types';

type Props = {
  entity: ClientEntity;
  hrefBase: string;
  filters: Record<string, string>;
  limit: number;
};

/** Form GET server-side: cari teks bebas + dropdown per kolom select/vlookup. */
export function FilterBar({ entity, hrefBase, filters, limit }: Props) {
  const filterableFields = entity.fields.filter(
    (field) => entity.columns.some((column) => column.name === field.name) && (field.refOptions || field.type === 'select'),
  );
  const adaFilterAktif = Boolean(filters.q) || filterableFields.some((field) => filters[field.name]);

  return (
    <form method="get" action={hrefBase} className="card" style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <input type="hidden" name="limit" value={limit} />
      <div className="field" style={{ minWidth: 200, flex: 1 }}>
        <label htmlFor="filter-q">Cari</label>
        <input id="filter-q" type="text" name="q" defaultValue={filters.q ?? ''} placeholder="Cari..." />
      </div>
      {filterableFields.map((field) => {
        const options = field.refOptions ?? (field.options ?? []).map((option) => ({ id: option, label: option }));
        return <div className="field" key={field.name} style={{ minWidth: 160 }}>
          <label htmlFor={`filter-${field.name}`}>{field.label}</label>
          <select id={`filter-${field.name}`} name={field.name} defaultValue={filters[field.name] ?? ''}>
            <option value="">Semua</option>
            {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </div>;
      })}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" type="submit">Filter</button>
        {adaFilterAktif && <a className="btn btn-sekunder" href={`${hrefBase}?limit=${limit}`}>Reset</a>}
      </div>
    </form>
  );
}
