'use client';

import { useEffect, useState } from 'react';

export type OpsiOrang = { id: string; nama: string; keterangan: string };
/** Satu baris pilihan: siapa orangnya + hubungannya dengan pihak seberang. */
export type PilihanRelasi = { orang: OpsiOrang; hubungan: string };

const JEDA_KETIK = 250;
const MIN_HURUF = 2;

type Props = {
  /** Nama hidden input; nilainya JSON array `{ id, hubungan }`. */
  name: string;
  /** Dipakai untuk aria-label saran; judulnya sendiri dirender pemanggil. */
  label: string;
  id?: string;
  hint?: string;
  /** Pilihan hubungan per baris, mis. Ayah/Ibu/Wali. */
  hubungan: readonly string[];
  placeholder?: string;
  /** Hanya tampilkan orang yang sudah terdaftar sebagai santri. */
  hanyaSantri?: boolean;
};

/**
 * Relasi wali↔santri itu banyak-ke-banyak: satu santri boleh punya beberapa
 * wali, dan satu wali boleh mewakili beberapa santri. Jadi pemilihnya harus
 * bisa menumpuk beberapa orang sekaligus, masing-masing dengan hubungannya —
 * bukan satu dropdown seperti sebelumnya.
 */
export function PemilihBanyakOrang({ name, label, id, hint, hubungan, placeholder, hanyaSantri }: Props) {
  const [ketik, setKetik] = useState('');
  const [hasil, setHasil] = useState<OpsiOrang[]>([]);
  const [dipilih, setDipilih] = useState<PilihanRelasi[]>([]);
  const [memuat, setMemuat] = useState(false);

  useEffect(() => {
    if (ketik.trim().length < MIN_HURUF) { setHasil([]); return; }
    const batal = new AbortController();
    const timer = setTimeout(async () => {
      setMemuat(true);
      try {
        const url = `/api/orang/cari?q=${encodeURIComponent(ketik.trim())}${hanyaSantri ? '&santri=1' : ''}`;
        const response = await fetch(url, { signal: batal.signal });
        const json = await response.json();
        setHasil(json.success ? json.data : []);
      } catch {
        // Permintaan dibatalkan saat ketikan berubah — bukan kegagalan.
      } finally {
        setMemuat(false);
      }
    }, JEDA_KETIK);
    return () => { clearTimeout(timer); batal.abort(); };
  }, [ketik, hanyaSantri]);

  const tambah = (orang: OpsiOrang) => {
    setDipilih((prev) => (prev.some((item) => item.orang.id === orang.id) ? prev : [...prev, { orang, hubungan: hubungan[0] }]));
    setKetik('');
    setHasil([]);
  };
  const buang = (id: string) => setDipilih((prev) => prev.filter((item) => item.orang.id !== id));
  const ubahHubungan = (id: string, nilai: string) =>
    setDipilih((prev) => prev.map((item) => (item.orang.id === id ? { ...item, hubungan: nilai } : item)));

  const sudahAda = new Set(dipilih.map((item) => item.orang.id));

  return <div style={{ position: 'relative' }}>
    <input
      id={id ?? `pilih-${name}`}
      aria-label={label}
      type="text"
      autoComplete="off"
      value={ketik}
      onChange={(event) => setKetik(event.target.value)}
      placeholder={placeholder ?? 'Ketik minimal 2 huruf nama…'}
    />
    {hint && <p className="petunjuk">{hint}</p>}

    {ketik.trim().length >= MIN_HURUF && <ul className="saran">
      {memuat && <li className="saran-kosong">Mencari…</li>}
      {!memuat && hasil.length === 0 && <li className="saran-kosong">Tidak ada yang cocok.</li>}
      {hasil.map((item) => <li key={item.id}>
        <button type="button" disabled={sudahAda.has(item.id)} onClick={() => tambah(item)}>
          <strong>{item.nama}</strong>
          <span>{sudahAda.has(item.id) ? 'sudah dipilih' : item.keterangan}</span>
        </button>
      </li>)}
    </ul>}

    {dipilih.length > 0 && <ul className="pilihan-banyak">
      {dipilih.map((item) => <li key={item.orang.id}>
        <div className="pilihan-banyak-nama">
          <strong>{item.orang.nama}</strong>
          {item.orang.keterangan && <p className="petunjuk" style={{ margin: '2px 0 0' }}>{item.orang.keterangan}</p>}
        </div>
        <select
          aria-label={`Hubungan dengan ${item.orang.nama}`}
          value={item.hubungan}
          onChange={(event) => ubahHubungan(item.orang.id, event.target.value)}
        >
          {hubungan.map((pilihan) => <option key={pilihan} value={pilihan}>{pilihan}</option>)}
        </select>
        <button type="button" className="btn btn-sekunder" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => buang(item.orang.id)}>Hapus</button>
      </li>)}
    </ul>}

    <input type="hidden" name={name} value={JSON.stringify(dipilih.map((item) => ({ id: item.orang.id, hubungan: item.hubungan })))} />
  </div>;
}
