/**
 * Seed data Indonesia minimal untuk md-legacy-batch (2026-05-20):
 * Country (Indonesia + 5 tetangga), Province (34 ID), Bank (top 6),
 * Expedition (top 5). Idempotent via upsert on `code`.
 * Run: npx ts-node prisma/seed-md-legacy.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Countries
  const countries = [
    { code: 'ID', name: 'Indonesia', isoCode: 'ID' },
    { code: 'SG', name: 'Singapore', isoCode: 'SG' },
    { code: 'MY', name: 'Malaysia', isoCode: 'MY' },
    { code: 'TH', name: 'Thailand', isoCode: 'TH' },
    { code: 'PH', name: 'Philippines', isoCode: 'PH' },
    { code: 'VN', name: 'Vietnam', isoCode: 'VN' },
  ];
  for (const c of countries) {
    await prisma.erpCountry.upsert({ where: { code: c.code }, update: c, create: c });
  }
  const id = await prisma.erpCountry.findUnique({ where: { code: 'ID' } });
  if (!id) throw new Error('Indonesia seed failed');

  // Provinces (34 — minus pemekaran 2022-2023, cukup untuk MVP)
  const provinces = [
    ['ACE', 'Aceh'], ['SUT', 'Sumatera Utara'], ['SUB', 'Sumatera Barat'], ['RIA', 'Riau'],
    ['JAM', 'Jambi'], ['SUS', 'Sumatera Selatan'], ['BEN', 'Bengkulu'], ['LAM', 'Lampung'],
    ['KEP', 'Kep. Bangka Belitung'], ['KER', 'Kep. Riau'], ['DKI', 'DKI Jakarta'],
    ['JAB', 'Jawa Barat'], ['JAT', 'Jawa Tengah'], ['DIY', 'DI Yogyakarta'], ['JAW', 'Jawa Timur'],
    ['BAN', 'Banten'], ['BAL', 'Bali'], ['NTB', 'Nusa Tenggara Barat'], ['NTT', 'Nusa Tenggara Timur'],
    ['KAB', 'Kalimantan Barat'], ['KAT', 'Kalimantan Tengah'], ['KAS', 'Kalimantan Selatan'],
    ['KAM', 'Kalimantan Timur'], ['KAU', 'Kalimantan Utara'], ['SUL', 'Sulawesi Utara'],
    ['SUE', 'Sulawesi Tengah'], ['SLS', 'Sulawesi Selatan'], ['SLT', 'Sulawesi Tenggara'],
    ['GOR', 'Gorontalo'], ['SLB', 'Sulawesi Barat'], ['MAL', 'Maluku'], ['MAU', 'Maluku Utara'],
    ['PAP', 'Papua'], ['PAB', 'Papua Barat'],
  ];
  for (const [code, name] of provinces) {
    await prisma.erpProvince.upsert({
      where: { code }, update: { name, countryId: id.id }, create: { code, name, countryId: id.id },
    });
  }

  // Cities (5 utama untuk awal)
  const dki = await prisma.erpProvince.findUnique({ where: { code: 'DKI' } });
  const jab = await prisma.erpProvince.findUnique({ where: { code: 'JAB' } });
  const jat = await prisma.erpProvince.findUnique({ where: { code: 'JAT' } });
  const jaw = await prisma.erpProvince.findUnique({ where: { code: 'JAW' } });
  const bal = await prisma.erpProvince.findUnique({ where: { code: 'BAL' } });
  if (dki && jab && jat && jaw && bal) {
    const cities = [
      { code: 'JKT', name: 'Jakarta', provinceId: dki.id },
      { code: 'BDG', name: 'Bandung', provinceId: jab.id },
      { code: 'SMG', name: 'Semarang', provinceId: jat.id },
      { code: 'SBY', name: 'Surabaya', provinceId: jaw.id },
      { code: 'DPS', name: 'Denpasar', provinceId: bal.id },
      { code: 'BGR', name: 'Bogor', provinceId: jab.id },
      { code: 'TGR', name: 'Tangerang', provinceId: dki.id },
      { code: 'BKS', name: 'Bekasi', provinceId: jab.id },
    ];
    for (const c of cities) {
      await prisma.erpCity.upsert({ where: { code: c.code }, update: c, create: c });
    }
  }

  // Banks (top 6 Indonesia)
  const banks = [
    { code: 'BCA', name: 'Bank Central Asia' },
    { code: 'BRI', name: 'Bank Rakyat Indonesia' },
    { code: 'MDR', name: 'Bank Mandiri' },
    { code: 'BNI', name: 'Bank Negara Indonesia' },
    { code: 'CMB', name: 'CIMB Niaga' },
    { code: 'DBS', name: 'DBS Indonesia' },
  ];
  for (const b of banks) {
    await prisma.erpBank.upsert({ where: { code: b.code }, update: b, create: b });
  }

  // Expeditions (top kurir)
  const exps = [
    { code: 'JNE', name: 'JNE Express' },
    { code: 'JNT', name: 'J&T Express' },
    { code: 'SCP', name: 'SiCepat' },
    { code: 'POS', name: 'POS Indonesia' },
    { code: 'TIK', name: 'Tiki' },
  ];
  for (const e of exps) {
    await prisma.erpExpedition.upsert({ where: { code: e.code }, update: e, create: e });
  }

  console.log('md-legacy seed complete:', {
    countries: countries.length, provinces: provinces.length, cities: 8, banks: banks.length, exps: exps.length,
  });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
