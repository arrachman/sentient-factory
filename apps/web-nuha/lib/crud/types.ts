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
  /** Judul kelompok di form; field tanpa grup masuk ke kelompok pertama. */
  group?: string;
  /** Keterangan pendek di bawah input — jelaskan format atau akibatnya. */
  hint?: string;
  /** Contoh isian, ditaruh sebagai placeholder. */
  placeholder?: string;
  /** Label ramah per opsi select, mis. { L: 'Laki-laki' }. */
  optionLabels?: Record<string, string>;
  /** Teks di sisi toggle boolean, mis. 'Aktif'. */
  labelYa?: string;
  /** Lebar kolom di grid form: 1 (default) sampai 3. */
  span?: 1 | 2 | 3;
  /** Tidak disimpan ke kolom tabel; hanya dibaca oleh hook `sesudahBuat`. */
  virtual?: boolean;
  /** Hanya tampil saat menambah baris baru, bukan saat mengubah. */
  hanyaBaru?: boolean;
  /** Tampil hanya bila field lain bernilai salah satu dari `sama`. */
  tampilBila?: { field: string; sama: string[] };
};

/** Tautan ke modul lain yang memakai baris ini (mis. Orang → Santri/Pegawai/Akun). */
export type Keterkaitan = { label: string; detail: string; href?: string; nada?: 'hijau' | 'biru' | 'kuning' | 'netral' };

export type Column = { name: string; label: string };

export type Entity = {
  key: string;
  menu: string;
  model: string;
  label: string;
  /** Satu kalimat di kepala form: apa entitas ini dan kenapa diisi. */
  deskripsi?: string;
  idType: 'int' | 'bigint';
  fields: Field[];
  columns: Column[];
  include?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  take?: number;
  /**
   * Dijalankan setelah baris baru dibuat, untuk menindaklanjuti field virtual
   * (mis. mendaftarkan orang baru sebagai santri/pegawai/wali).
   */
  sesudahBuat?: (id: string, input: Record<string, unknown>, aktor: { id: string; nama: string }) => Promise<void>;
};

/** Serializable field shape handed to the browser (no Prisma types cross over). */
export type ClientField = Omit<Field, 'ref'> & { options?: string[]; refOptions?: { id: string; label: string }[] };

export type ClientEntity = {
  key: string;
  label: string;
  deskripsi?: string;
  fields: ClientField[];
  columns: Column[];
};

/** Baris tabel; `_kait` diisi engine untuk entitas yang punya relasi lintas modul. */
export type Row = Record<string, unknown> & { id: string; _kait?: Keterkaitan[] };
