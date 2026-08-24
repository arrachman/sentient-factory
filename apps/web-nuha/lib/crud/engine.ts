import { prisma } from '@/lib/prisma';
import type { ClientEntity, Entity, Field, Row } from './types';

type Delegate = {
  findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  count: (args?: unknown) => Promise<number>;
  create: (args: unknown) => Promise<Record<string, unknown>>;
  update: (args: unknown) => Promise<Record<string, unknown>>;
  delete: (args: unknown) => Promise<Record<string, unknown>>;
};

export function delegateFor(entity: Entity): Delegate {
  const client = prisma as unknown as Record<string, Delegate>;
  const delegate = client[entity.model];
  if (!delegate) throw new Error(`Model "${entity.model}" tidak dikenal.`);
  return delegate;
}

export const castId = (entity: Entity, id: string) => (entity.idType === 'bigint' ? BigInt(id) : Number(id));

/** BigInt, Decimal, and Date have no JSON form, so flatten them for the client. */
export function serialize(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === 'object') {
    const source = value as { toFixed?: unknown };
    if (typeof source.toFixed === 'function') return Number(value);
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, serialize(item)]));
  }
  return value;
}

/** Reject unknown keys outright: only registry fields ever reach Prisma. */
export function coerce(entity: Entity, input: Record<string, unknown>, partial = false) {
  const data: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of entity.fields) {
    if (!(field.name in input)) {
      if (!partial && field.required) errors.push(`${field.label} wajib diisi.`);
      continue;
    }
    const raw = input[field.name];
    const blank = raw === '' || raw === null || raw === undefined;
    if (blank) {
      if (field.required) errors.push(`${field.label} wajib diisi.`);
      else data[field.name] = null;
      continue;
    }
    data[field.name] = convert(field, raw, errors);
  }

  return { data, errors };
}

function convert(field: Field, raw: unknown, errors: string[]): unknown {
  switch (field.type) {
    case 'number': {
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) errors.push(`${field.label} harus berupa angka.`);
      return parsed;
    }
    case 'boolean':
      return raw === true || raw === 'true' || raw === 'on' || raw === 1 || raw === '1';
    case 'date':
    case 'datetime': {
      const parsed = new Date(field.type === 'date' ? `${String(raw).slice(0, 10)}T00:00:00Z` : String(raw));
      if (Number.isNaN(parsed.getTime())) errors.push(`${field.label} bukan tanggal yang sah.`);
      return parsed;
    }
    case 'select': {
      const value = String(raw);
      if (field.options && !field.options.includes(value)) errors.push(`${field.label} tidak valid.`);
      return value;
    }
    default:
      return String(raw);
  }
}

const UKURAN_HALAMAN_CRUD = 25;

export async function countRows(entity: Entity): Promise<number> {
  return delegateFor(entity).count();
}

export async function listRows(entity: Entity, halaman = 1): Promise<Row[]> {
  const rows = await delegateFor(entity).findMany({
    include: entity.include,
    orderBy: entity.orderBy,
    skip: (Math.max(1, halaman) - 1) * UKURAN_HALAMAN_CRUD,
    take: UKURAN_HALAMAN_CRUD,
  });
  return rows.map((row) => ({ ...(serialize(row) as Record<string, unknown>), id: String(row.id) }));
}

export const toClientEntity = (entity: Entity): ClientEntity => ({
  key: entity.key,
  label: entity.label,
  fields: entity.fields.map(({ ref: _ref, ...field }) => field),
  columns: entity.columns,
});
