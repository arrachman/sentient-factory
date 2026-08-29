import { ambilPohon } from './pohon';
import { bacaFilter } from './filter';

const tampil = async (label: string, sp: Record<string, string>) => {
  const f = bacaFilter(sp);
  const p = await ambilPohon(f);
  console.log(`\n=== ${label} === total=${p.total} tanpaKelas=${p.tanpaKelas}`);
  for (const u of p.unit) {
    console.log(`  ${u.nama}: jumlah=${u.jumlah} alumni=${u.alumni}`);
    for (const t of u.tingkat) {
      const isi = t.kelas.filter((k) => k.jumlah > 0);
      if (isi.length) console.log(`     ${t.label}: ${t.jumlah}  [${isi.map((k) => `${k.nama}=${k.jumlah}`).join(', ')}]`);
    }
  }
};

const main = async () => {
  await tampil('bawaan (Mukim)', {});
  await tampil('status=Alumni', { status: 'Alumni' });
  await tampil('alumni=3 (Madin)', { alumni: '3' });
};

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
