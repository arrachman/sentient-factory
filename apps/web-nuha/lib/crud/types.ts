/**
 * One description of an entity drives its API validation, its table, and its
 * form. Adding a module means adding a registry entry, not another CRUD route.
 */
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'datetime' | 'select' | 'boolean';

/** Options pulled from another table; `label` may walk relations, e.g. `orang.nama`. */
export type FieldRef = {
  model: string;
  label: string;
  include?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  idType?: 'int' | 'bigint';
};

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  ref?: FieldRef;
  step?: number;
};

export type Column = { name: string; label: string };

export type Entity = {
  key: string;
  menu: string;
  model: string;
  label: string;
  idType: 'int' | 'bigint';
  fields: Field[];
  columns: Column[];
  include?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  take?: number;
};

/** Serializable field shape handed to the browser (no Prisma types cross over). */
export type ClientField = Omit<Field, 'ref'> & { options?: string[] };

export type ClientEntity = {
  key: string;
  label: string;
  fields: ClientField[];
  columns: Column[];
};

export type Row = Record<string, unknown> & { id: string };
