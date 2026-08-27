'use client';

import { useState } from 'react';
import { PencariOrang } from './PencariOrang';
import { simpanRelasiWali } from './actions';
import { HUBUNGAN } from './konstanta';

type Santri = { orangId: string; nama: string; nis: string | null };

/** Form tambah/pindah wali: pilih identitas wali, lalu santri yang diampu. */
export function FormRelasiWali({ santri }: { santri: Santri[] }) {
  const [buka, setBuka] = useState(false);

  if (!buka) {
    return <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
      <button className="btn" type="button" onClick={() => setBuka(true)}>+ Hubungkan wali ke santri</button>
    </div>;
  }

  return <form action={simpanRelasiWali} className="card" style={{ marginTop: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div>
        <h3 className="card-judul" style={{ margin: 0 }}>Hubungkan wali ke santri</h3>
        <p className="kait-deskripsi" style={{ marginTop: 4 }}>
          Wali diambil dari identitas yang sudah ada. Bila orangnya belum terdaftar, buat dulu di Identitas orang.
          Satu santri boleh punya beberapa wali, tetapi hanya satu yang berstatus utama.
        </p>
      </div>
      <button className="btn btn-sekunder" type="button" onClick={() => setBuka(false)}>Tutup</button>
    </div>

    <div className="grid g3" style={{ marginTop: 14 }}>
      <PencariOrang name="waliId" label="Wali" hint="Cari nama, NIK, atau nomor HP." />

      <div className="field">
        <label htmlFor="anakId">Santri <span className="wajib">*</span></label>
        <select id="anakId" name="anakId" required defaultValue="">
          <option value="">Pilih santri…</option>
          {santri.map((item) => <option key={item.orangId} value={item.orangId}>
            {item.nama}{item.nis ? ` — NIS ${item.nis}` : ''}
          </option>)}
        </select>
        <p className="petunjuk">Hanya orang yang terdaftar sebagai santri yang muncul di sini.</p>
      </div>

      <div className="field">
        <label id="hubungan-label">Hubungan <span className="wajib">*</span></label>
        <div className="segmen" role="radiogroup" aria-labelledby="hubungan-label">
          {HUBUNGAN.map((item) => <label className="segmen-opsi" key={item}>
            <input type="radio" name="hubungan" value={item} required defaultChecked={item === 'Ayah'} />
            <span>{item}</span>
          </label>)}
        </div>
      </div>

      <div className="field">
        <label htmlFor="pekerjaan">Pekerjaan</label>
        <input id="pekerjaan" name="pekerjaan" type="text" placeholder="Wiraswasta" />
      </div>

      <div className="field" style={{ gridColumn: 'span 2' }}>
        <label>Wali utama</label>
        <label className="toggle">
          <input name="utama" type="checkbox" defaultChecked />
          <span className="toggle-jalur" aria-hidden><span className="toggle-bulat" /></span>
          <span className="toggle-teks">Jadikan wali utama</span>
        </label>
        <p className="petunjuk">Wali utama adalah penerima notifikasi WhatsApp dan pemegang akses portal wali. Menyalakannya akan menurunkan wali utama santri ini yang sebelumnya.</p>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 8 }}>
      <button className="btn" type="submit">Simpan relasi</button>
      <button className="btn btn-sekunder" type="button" onClick={() => setBuka(false)}>Batal</button>
    </div>
  </form>;
}
