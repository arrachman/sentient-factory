'use client';

import { useEffect, useState } from 'react';

export type OpsiOrang = { id: string; nama: string; keterangan: string };

const JEDA_KETIK = 250;

/**
 * Autocomplete identitas: daftar `orang` terlalu besar untuk dropdown biasa,
 * jadi cari di server sambil mengetik dan kunci pilihan ke satu hidden input.
 */
export function PencariOrang({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const [ketik, setKetik] = useState('');
  const [hasil, setHasil] = useState<OpsiOrang[]>([]);
  const [dipilih, setDipilih] = useState<OpsiOrang | null>(null);
  const [memuat, setMemuat] = useState(false);

  useEffect(() => {
    if (dipilih || ketik.trim().length < 2) { setHasil([]); return; }
    const batal = new AbortController();
    const timer = setTimeout(async () => {
      setMemuat(true);
      try {
        const response = await fetch(`/api/orang/cari?q=${encodeURIComponent(ketik.trim())}`, { signal: batal.signal });
        const json = await response.json();
        setHasil(json.success ? json.data : []);
      } catch {
        // Permintaan dibatalkan saat ketikan berubah — bukan kegagalan.
      } finally {
        setMemuat(false);
      }
    }, JEDA_KETIK);
    return () => { clearTimeout(timer); batal.abort(); };
  }, [ketik, dipilih]);

  if (dipilih) {
    return <div className="field">
      <label>{label}</label>
      <div className="pilihan-terkunci">
        <div>
          <strong>{dipilih.nama}</strong>
          {dipilih.keterangan && <p className="petunjuk" style={{ margin: '2px 0 0' }}>{dipilih.keterangan}</p>}
        </div>
        <button type="button" className="btn btn-sekunder" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => { setDipilih(null); setKetik(''); }}>Ganti</button>
      </div>
      <input type="hidden" name={name} value={dipilih.id} />
    </div>;
  }

  return <div className="field" style={{ position: 'relative' }}>
    <label htmlFor={`cari-${name}`}>{label} <span className="wajib">*</span></label>
    <input
      id={`cari-${name}`}
      type="text"
      autoComplete="off"
      value={ketik}
      onChange={(event) => setKetik(event.target.value)}
      placeholder="Ketik minimal 2 huruf nama…"
    />
    {hint && <p className="petunjuk">{hint}</p>}
    {ketik.trim().length >= 2 && <ul className="saran">
      {memuat && <li className="saran-kosong">Mencari…</li>}
      {!memuat && hasil.length === 0 && <li className="saran-kosong">Tidak ada yang cocok.</li>}
      {hasil.map((item) => <li key={item.id}>
        <button type="button" onClick={() => { setDipilih(item); setHasil([]); }}>
          <strong>{item.nama}</strong>
          {item.keterangan && <span>{item.keterangan}</span>}
        </button>
      </li>)}
    </ul>}
  </div>;
}
