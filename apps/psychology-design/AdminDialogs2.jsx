// Admin Dialogs · Popovers + Booking Detail + WA Template
// Anchored popovers (filter, sortir) + larger detail panels.

// ────────────────────────────────────────────────────────────
// Filter Klien — anchored popover, mounted over the Klien screen
// ────────────────────────────────────────────────────────────
function DialogFilterKlien() {
  const FilterRow = ({ label, sel, count }) => (
    <label className="row gap-2" style={{ padding: '7px 4px', cursor: 'pointer', justifyContent: 'space-between' }}>
      <div className="row gap-2">
        <span style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid ' + (sel ? 'var(--sage-500)' : 'var(--border-strong)'), background: sel ? 'var(--sage-500)' : 'transparent', display: 'grid', placeItems: 'center' }}>
          {sel && <Icon name="check" size={10} stroke="#fff" sw={2.8} />}
        </span>
        <span style={{ fontSize: 13, color: 'var(--fg)' }}>{label}</span>
      </div>
      {count !== undefined && <span className="caption" style={{ fontSize: 11 }}>{count}</span>}
    </label>
  );
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)', overflow: 'hidden' }}>
      {/* hint of klien table behind */}
      <div style={{ position: 'absolute', inset: 0, padding: 24, opacity: 0.35 }}>
        <div style={{ height: 56, background: 'var(--bg-elev)', borderRadius: 10, marginBottom: 12 }} />
        <div style={{ height: 40, background: 'var(--bg-elev)', borderRadius: 10, marginBottom: 8 }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 52, background: 'var(--bg-elev)', borderRadius: 8, marginBottom: 6 }} />
        ))}
      </div>
      {/* anchor pill (the "Filter" button) */}
      <div style={{ position: 'absolute', top: 96, left: 280, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--sage-500)', background: 'var(--sage-50)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--sage-800)' }}>
        <Icon name="filter" size={14} stroke="var(--sage-700)" />Filter <span className="badge badge-sage" style={{ height: 18, fontSize: 10, marginLeft: 4 }}>3</span>
      </div>
      {/* popover */}
      <div className="card" style={{
        position: 'absolute', top: 142, left: 280, width: 380,
        background: 'var(--bg-elev)', boxShadow: 'var(--shadow-lg)',
        padding: 16, display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Filter klien</span>
          <button style={{ background: 'none', border: 'none', padding: 0, fontSize: 11, fontWeight: 500, color: 'var(--sage-700)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>Reset</button>
        </div>

        <div className="col gap-1">
          <span className="eyebrow">Status</span>
          <FilterRow label="Aktif" sel={true} count={28} />
          <FilterRow label="Baru (≤ 14 hari)" sel={true} count={5} />
          <FilterRow label="Selesai paket" sel={false} count={9} />
          <FilterRow label="Stale (> 30 hari tidak booking)" sel={false} count={4} />
        </div>

        <div className="col gap-1">
          <span className="eyebrow">Kategori</span>
          <FilterRow label="Dewasa" sel={true} count={18} />
          <FilterRow label="Remaja" sel={false} count={8} />
          <FilterRow label="Anak" sel={false} count={11} />
          <FilterRow label="Pasangan" sel={false} count={3} />
          <FilterRow label="Keluarga" sel={false} count={2} />
        </div>

        <div className="col gap-1">
          <span className="eyebrow">Psikolog penanggung</span>
          <Select value="Semua psikolog" />
        </div>

        <div className="col gap-1">
          <span className="eyebrow">Periode terdaftar</span>
          <div className="row gap-2">
            <input className="input" defaultValue="01 Mei" style={{ flex: 1 }} />
            <span className="caption">→</span>
            <input className="input" defaultValue="20 Mei" style={{ flex: 1 }} />
          </div>
        </div>

        <div className="row gap-2" style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost grow">Batal</button>
          <button className="btn btn-primary grow">Terapkan filter</button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Sortir — small dropdown menu
// ────────────────────────────────────────────────────────────
function DialogSortir() {
  const Item = ({ label, hint, sel }) => (
    <div className="row" style={{ padding: '9px 12px', justifyContent: 'space-between', cursor: 'pointer', background: sel ? 'var(--sage-50)' : 'transparent' }}>
      <div className="col">
        <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: sel ? 600 : 400 }}>{label}</span>
        {hint && <span className="caption" style={{ fontSize: 11 }}>{hint}</span>}
      </div>
      {sel && <Icon name="check" size={14} stroke="var(--sage-700)" sw={2.2} />}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, padding: 24, opacity: 0.35 }}>
        <div style={{ height: 56, background: 'var(--bg-elev)', borderRadius: 10, marginBottom: 12 }} />
        <div style={{ height: 40, background: 'var(--bg-elev)', borderRadius: 10, marginBottom: 8 }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 52, background: 'var(--bg-elev)', borderRadius: 8, marginBottom: 6 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: 96, right: 220, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--sage-500)', background: 'var(--sage-50)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--sage-800)' }}>
        <Icon name="sort" size={14} stroke="var(--sage-700)" />Sortir
      </div>
      <div className="card" style={{
        position: 'absolute', top: 142, right: 220, width: 260,
        background: 'var(--bg-elev)', boxShadow: 'var(--shadow-lg)',
        padding: '8px 0', display: 'flex', flexDirection: 'column',
      }}>
        <span className="eyebrow" style={{ padding: '4px 12px 6px' }}>Urutkan berdasarkan</span>
        <Item label="Nama A → Z" sel={false} />
        <Item label="Nama Z → A" sel={false} />
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <Item label="Terdaftar terbaru" hint="Default" sel={true} />
        <Item label="Terdaftar terlama" sel={false} />
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <Item label="Sesi terdekat" hint="Booking aktif paling dekat" sel={false} />
        <Item label="Belum booking terlama" sel={false} />
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <Item label="Sesi terbanyak" sel={false} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Booking Detail — opens when admin clicks a booking on schedule grid
// ────────────────────────────────────────────────────────────
function DialogBookingDetail() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Sesi · Selasa, 21 Mei · 10.00 – 11.00"
        title="Konseling Individu — Sesi 3 dari 4"
        width={620}
        footer={<>
          <button className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Batalkan sesi</button>
          <span className="grow" />
          <button className="btn btn-outline">Reschedule</button>
          <button className="btn btn-primary">Tandai selesai</button>
        </>}>
        <div className="row gap-3" style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--sage-200)', display: 'grid', placeItems: 'center', color: 'var(--sage-800)', fontWeight: 600, fontSize: 17 }}>RA</div>
          <div className="col grow">
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)' }}>Rina Andreyani</span>
            <span className="caption">Dewasa · klien sejak 14 Mar 2026 · +62 821 9988 4412</span>
          </div>
          <button className="btn btn-outline btn-sm">Buka profil</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            ['Psikolog', 'Vina Permatasari, M.Psi', 'user', false],
            ['Ruangan', 'Sage Room · Lt. 2', 'door', false],
            ['Layanan', 'Konseling Dewasa — paket 4', 'list', true],
            ['Pembayaran', 'Lunas · Rp 1.200.000', 'check', false],
          ].map(([lbl, val, ic, editable]) => (
            <div key={lbl} className="card-flat" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--sage-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={ic} size={14} stroke="var(--sage-800)" />
              </div>
              <div className="col grow" style={{ minWidth: 0 }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="caption" style={{ fontSize: 11 }}>{lbl}</span>
                  {editable && (
                    <button className="btn btn-ghost btn-sm" style={{ height: 22, padding: '0 8px', fontSize: 11, color: 'var(--sage-700)' }}>
                      <Icon name="edit" size={11} stroke="var(--sage-700)" /> Ubah
                    </button>
                  )}
                </div>
                <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, marginTop: 2 }}>{val}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Penjelasan: ubah layanan = edit silent (tidak kirim WA) — admin tidak perlu hubungi psikolog manual */}
        <div className="card-flat" style={{ padding: 10, marginBottom: 16, background: 'var(--cream-50)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="bell" size={13} stroke="var(--fg-muted)" />
          <span className="caption" style={{ fontSize: 11.5, lineHeight: 1.5 }}>
            <strong>Ubah Layanan</strong> menyimpan tanpa mengirim notifikasi WA. Slot, ruangan, dan psikolog tetap.
            Reschedule / batalkan sesi <em>akan</em> kirim notifikasi WA otomatis ke klien & psikolog.
          </span>
        </div>

        <div className="col gap-2" style={{ marginBottom: 16 }}>
          <span className="eyebrow">Catatan untuk sesi ini</span>
          <textarea className="input" style={{ height: 70, padding: 12, resize: 'none', lineHeight: 1.5 }} defaultValue="Lanjutkan latihan grounding. Cek tidur minggu ini." />
        </div>

        <div className="col gap-2">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow">Riwayat sesi paket</span>
            <span className="caption" style={{ fontSize: 11 }}>3 dari 4</span>
          </div>
          {[
            ['Sesi 1', '07 Mei', 'Selesai', 'sage'],
            ['Sesi 2', '14 Mei', 'Selesai', 'sage'],
            ['Sesi 3', '21 Mei', 'Hari ini', 'teal'],
            ['Sesi 4', '— belum dijadwal', 'Belum', 'cream'],
          ].map(([s, d, st, c]) => (
            <div key={s} className="row" style={{ padding: '8px 12px', background: c === 'teal' ? 'var(--sage-50)' : 'var(--cream-50)', borderRadius: 8, border: c === 'teal' ? '1px solid var(--sage-300)' : '1px solid transparent' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)', width: 60 }}>{s}</span>
              <span className="grow caption" style={{ color: 'var(--fg)' }}>{d}</span>
              <span className="badge" style={{
                background: c === 'sage' ? 'var(--sage-100)' : c === 'teal' ? 'var(--teal-700)' : 'var(--cream-200)',
                color: c === 'sage' ? 'var(--sage-800)' : c === 'teal' ? '#fff' : 'var(--fg-muted)',
                height: 22,
              }}>{st}</span>
            </div>
          ))}
        </div>
      </DialogFrame>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// New WA Template
// ────────────────────────────────────────────────────────────
function DialogNewTemplate() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Template WhatsApp · Baru"
        title="Template Notifikasi Baru"
        width={640}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn btn-outline">Simpan & nonaktif</button>
          <button className="btn btn-primary">Simpan & aktifkan</button>
        </>}>
        <Field label="Nama template" required>
          <input className="input" defaultValue="Pengingat H-1 sebelum sesi" />
        </Field>

        <Field label="Pemicu otomatis" required hint="Kapan template dikirim">
          <div className="col gap-1" style={{ padding: 4 }}>
            {[
              ['Booking dibuat (konfirmasi)', false],
              ['1 hari sebelum sesi (pengingat)', true],
              ['30 menit sebelum sesi (pengingat · PRD BR-08)', false],
              ['Setelah sesi selesai (terima kasih + feedback)', false],
              ['Paket selesai (tawarkan lanjut)', false],
              ['Manual — kirim dari profil klien', false],
            ].map(([lbl, sel]) => (
              <label key={lbl} className="row gap-2" style={{ padding: '7px 8px', cursor: 'pointer', borderRadius: 6, background: sel ? 'var(--sage-50)' : 'transparent' }}>
                <span style={{ width: 16, height: 16, borderRadius: 999, border: '1.5px solid ' + (sel ? 'var(--sage-500)' : 'var(--border-strong)'), display: 'grid', placeItems: 'center' }}>
                  {sel && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--sage-500)' }} />}
                </span>
                <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: sel ? 600 : 400 }}>{lbl}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Berlaku untuk kategori klien">
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            {['Semua', 'Dewasa', 'Remaja', 'Anak', 'Pasangan', 'Keluarga'].map((t, i) => (
              <button key={t} className="btn btn-sm" style={{
                height: 28, padding: '0 10px', fontSize: 12,
                background: i === 0 ? 'var(--sage-100)' : 'var(--bg-elev)',
                border: '1px solid ' + (i === 0 ? 'var(--sage-400)' : 'var(--border-strong)'),
                color: i === 0 ? 'var(--sage-800)' : 'var(--teal-800)',
                fontWeight: i === 0 ? 600 : 500,
              }}>{t}</button>
            ))}
          </div>
        </Field>

        <Field label="Isi pesan" required hint="Klik variabel untuk menyisipkan">
          <div className="col" style={{ border: '1px solid var(--border-strong)', borderRadius: 8, overflow: 'hidden' }}>
            <div className="row gap-1" style={{ padding: 8, background: 'var(--cream-50)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {['{{nama}}', '{{tanggal}}', '{{jam}}', '{{psikolog}}', '{{ruangan}}', '{{sesi}}'].map(v => (
                <button key={v} className="btn btn-sm" style={{ height: 24, padding: '0 8px', fontSize: 11, fontFamily: 'ui-monospace, monospace', background: 'var(--bg-elev)', border: '1px solid var(--border)' }}>{v}</button>
              ))}
            </div>
            <textarea className="input" style={{ height: 110, padding: 12, border: 'none', resize: 'none', lineHeight: 1.6, fontSize: 13 }} defaultValue={'Halo {{nama}} 🌿\n\nMengingatkan jadwal sesi besok:\n📅 {{tanggal}} pukul {{jam}}\n👤 dengan {{psikolog}}\n📍 {{ruangan}}, Althea Psychology\n\nBalas YA untuk konfirmasi atau RESCHEDULE jika perlu ubah jadwal.'} />
          </div>
        </Field>

        <Field label="Preview ke nomor klien" hint="Pesan uji akan dikirim ke nomor di bawah">
          <div className="row gap-2">
            <input className="input grow" placeholder="+62 ..." />
            <button className="btn btn-outline btn-sm">Kirim uji</button>
          </div>
        </Field>
      </DialogFrame>
    </div>
  );
}

Object.assign(window, { DialogFilterKlien, DialogSortir, DialogBookingDetail, DialogNewTemplate });
