import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { PrismaClient, TingkatWilayah } from '@prisma/client';
import { bangunUlangJalurWilayah } from '../wilayah-path';

type Row = {
  code: string;
  name: string;
  level: TingkatWilayah;
  parentCode?: string | null;
  typeLabel?: string | null;
  postalCode?: string | null;
};

type Input = {
  metadata: {
    source: string;
    version: string;
    sha256?: string;
    expectedCounts?: Partial<Record<TingkatWilayah, number>>;
  };
  country: { iso2: string; iso3: string; name: string; numericCode?: string };
  rows: Row[];
};

const LEVEL_ORDER: TingkatWilayah[] = ['Provinsi', 'Kota', 'Kecamatan', 'Desa'];
const PARENT_LEVEL: Partial<Record<TingkatWilayah, TingkatWilayah>> = {
  Kota: 'Provinsi',
  Kecamatan: 'Kota',
  Desa: 'Kecamatan',
};

function argumen(nama: string): string | undefined {
  const index = process.argv.indexOf(nama);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function gagal(pesan: string): never {
  throw new Error(`Import wilayah ditolak: ${pesan}`);
}

function validasi(input: Input, sha256: string): void {
  if (!input.metadata?.source?.trim()) gagal('metadata.source wajib diisi.');
  if (!input.metadata?.version?.trim()) gagal('metadata.version wajib diisi.');
  if (input.metadata.sha256 && input.metadata.sha256.toLowerCase() !== sha256) {
    gagal(`sha256 tidak cocok; berkas memiliki ${sha256}.`);
  }
  if (!input.country?.iso2 || !input.country.iso3 || !input.country.name) gagal('country tidak lengkap.');
  if (!Array.isArray(input.rows) || input.rows.length === 0) gagal('rows tidak boleh kosong.');

  const codes = new Set<string>();
  const byCode = new Map<string, Row>();
  for (const [index, row] of input.rows.entries()) {
    if (!row.code || !/^[0-9A-Za-z.-]{1,20}$/.test(row.code)) gagal(`kode baris ${index + 1} tidak valid.`);
    if (!row.name?.trim()) gagal(`nama baris ${index + 1} kosong.`);
    if (!LEVEL_ORDER.includes(row.level)) gagal(`tingkat baris ${index + 1} tidak valid.`);
    if (codes.has(row.code)) gagal(`kode duplikat: ${row.code}.`);
    codes.add(row.code);
    byCode.set(row.code, row);
  }

  for (const row of input.rows) {
    const parentLevel = PARENT_LEVEL[row.level];
    if (!parentLevel) {
      if (row.parentCode) gagal(`provinsi ${row.code} tidak boleh punya parentCode.`);
      continue;
    }
    if (!row.parentCode) gagal(`${row.level} ${row.code} wajib memiliki parentCode.`);
    const parent = byCode.get(row.parentCode);
    if (!parent) gagal(`parent ${row.parentCode} untuk ${row.code} tidak ditemukan.`);
    if (parent.level !== parentLevel) gagal(`parent ${row.parentCode} untuk ${row.code} harus ${parentLevel}.`);
  }

  for (const level of LEVEL_ORDER) {
    const actual = input.rows.filter((row) => row.level === level).length;
    const expected = input.metadata.expectedCounts?.[level];
    if (expected !== undefined && actual !== expected) gagal(`jumlah ${level} ${actual}, expected ${expected}.`);
  }
}

async function main() {
  const file = argumen('--file');
  const apply = process.argv.includes('--apply');
  if (!file) gagal('gunakan --file <json>.');

  const bytes = await readFile(file);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const input = JSON.parse(bytes.toString()) as Input;
  validasi(input, sha256);

  const counts = Object.fromEntries(LEVEL_ORDER.map((level) => [level, input.rows.filter((row) => row.level === level).length]));
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', source: input.metadata, sha256, counts }, null, 2));
  if (!apply) return;

  const prisma = new PrismaClient();
  try {
    const negara = await prisma.negara.upsert({
      where: { iso2: input.country.iso2.toUpperCase() },
      create: {
        iso2: input.country.iso2.toUpperCase(),
        iso3: input.country.iso3.toUpperCase(),
        nama: input.country.name,
        kodeNumerik: input.country.numericCode,
      },
      update: { iso3: input.country.iso3.toUpperCase(), nama: input.country.name, kodeNumerik: input.country.numericCode },
    });
    const ids = new Map<string, bigint>();
    for (const level of LEVEL_ORDER) {
      for (const row of input.rows.filter((item) => item.level === level)) {
        const parentId = row.parentCode ? ids.get(row.parentCode) : undefined;
        if (row.parentCode && !parentId) gagal(`parent ${row.parentCode} belum tersedia saat menulis ${row.code}.`);
        const wilayah = await prisma.wilayah.upsert({
          where: { negaraId_kode: { negaraId: negara.id, kode: row.code } },
          create: {
            negaraId: negara.id,
            indukId: parentId,
            tingkat: row.level,
            kode: row.code,
            nama: row.name.trim(),
            labelTipe: row.typeLabel?.trim() || null,
            kodePos: row.postalCode || null,
            aktif: true,
          },
          update: {
            indukId: parentId,
            tingkat: row.level,
            nama: row.name.trim(),
            labelTipe: row.typeLabel?.trim() || null,
            kodePos: row.postalCode || null,
            aktif: true,
          },
          select: { id: true },
        });
        ids.set(row.code, wilayah.id);
      }
    }
    await bangunUlangJalurWilayah(prisma, negara.id);
    console.log(`Import wilayah selesai: ${input.rows.length} baris untuk ${negara.nama}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
