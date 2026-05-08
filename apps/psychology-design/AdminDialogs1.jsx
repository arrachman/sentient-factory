// Admin Dialogs · Forms — modal-style frames for "Tambah X" and "Edit X" actions.
// Each renders as a centered card on a dimmed scrim so it can be presented
// in an artboard as if mounted over the underlying screen.

function DialogFrame({ title, eyebrow, width = 520, children, footer, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(20, 40, 40, 0.32)',
      backdropFilter: 'blur(2px)',
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div className="card" style={{
        width, maxWidth: '100%', maxHeight: '100%',
        background: 'var(--bg-elev)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <header style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div className="col">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 style={{ margin: '2px 0 0', fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 500, color: 'var(--teal-800)' }}>{title}</h2>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm"><Icon name="x" size={16} /></button>
        </header>
        <div style={{ padding: '20px 22px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
        {footer && <footer style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--cream-50)' }}>{footer}</footer>}
      </div>
    </div>
  );
}

const Field = ({ label, hint, required, children }) => (
  <div className="col gap-1" style={{ marginBottom: 14 }}>
    <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>
      {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
    </label>
    {children}
    {hint && <span className="caption" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{hint}</span>}
  </div>
);

const Select = ({ value, placeholder }) => (
  <div className="row" style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--bg-elev)', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 14, color: value ? 'var(--fg)' : 'var(--fg-subtle)' }}>{value || placeholder}</span>
    <Icon name="chevD" size={15} stroke="var(--fg-muted)" />
  </div>
);

// ────────────────────────────────────────────────────────────
// Add Klien Baru
// Field set per spec klien (semua required, tanpa opsional):
//   nama · jenis kelamin · umur · layanan · nomor rekam medis · no. WA.
// ────────────────────────────────────────────────────────────
function DialogAddKlien() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Klien · Baru"
        title="Tambah Klien Baru"
        width={580}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn btn-outline">Simpan & Jadwalkan</button>
          <button className="btn btn-primary">Simpan Klien</button>
        </>}>
        <div className="card-flat" style={{ padding: 10, marginBottom: 16, background: 'var(--cream-50)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="bell" size={14} stroke="var(--sage-700)" />
          <p className="caption" style={{ margin: 0, lineHeight: 1.5 }}>
            Semua kolom <strong style={{ color: 'var(--danger)' }}>wajib</strong> diisi. Tanpa nama panggilan, tanggal lahir, email, alamat, atau keluhan.
          </p>
        </div>

        <div className="col gap-2" style={{ marginBottom: 18 }}>
          <span className="eyebrow">Identitas</span>
          <Field label="Nama lengkap" required>
            <input className="input" defaultValue="Bayu Saputra" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Jenis kelamin" required>
              <div className="row gap-2">
                {[['l', 'Laki-laki', true], ['p', 'Perempuan', false]].map(([k, lbl, sel]) => (
                  <button key={k} className="btn btn-sm" style={{
                    flex: 1, height: 38,
                    background: sel ? 'var(--sage-100)' : 'var(--bg-elev)',
                    border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border-strong)'),
                    color: sel ? 'var(--sage-800)' : 'var(--teal-800)',
                    fontWeight: sel ? 600 : 500,
                  }}>{lbl}</button>
                ))}
              </div>
            </Field>
            <Field label="Umur" required hint="Dalam tahun (mis. 27)">
              <input className="input" defaultValue="27" type="number" min="0" max="120" />
            </Field>
          </div>
        </div>

        <div className="col gap-2" style={{ marginBottom: 18 }}>
          <span className="eyebrow">Klinis</span>
          <Field label="Layanan" required hint="Layanan yang akan diambil klien — bisa diubah saat menjadwalkan">
            <Select value="Konseling Individu Dewasa" />
          </Field>
          <Field label="Nomor rekam medis" required hint="ID unik klien — disarankan format NRM-YYYY-NNNN">
            <input className="input" defaultValue="NRM-2026-0148" />
          </Field>
        </div>

        <div className="col gap-2" style={{ marginBottom: 6 }}>
          <span className="eyebrow">Kontak</span>
          <Field label="No. WhatsApp" required hint="Dipakai untuk semua notifikasi otomatis (konfirmasi, pengingat, reschedule, batal)">
            <input className="input" defaultValue="+62 821 9988 4412" />
          </Field>
        </div>

        <div className="card-flat" style={{ padding: 12, background: 'var(--info-soft)', borderColor: '#cfdde8', display: 'flex', gap: 10, marginTop: 6 }}>
          <Icon name="wa" size={15} stroke="var(--info)" />
          <p className="body-sm" style={{ margin: 0, color: '#2c4a60' }}>Klien akan mendapat pesan WhatsApp selamat datang otomatis setelah disimpan.</p>
        </div>
      </DialogFrame>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Add Psikolog
// ────────────────────────────────────────────────────────────
function DialogAddPsikolog() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Psikolog · Baru"
        title="Tambah Anggota Tim"
        width={620}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn btn-primary">Tambahkan</button>
        </>}>
        <div className="row gap-3" style={{ marginBottom: 18, padding: 12, background: 'var(--cream-50)', borderRadius: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--cream-200)', border: '2px dashed var(--border-strong)', display: 'grid', placeItems: 'center', color: 'var(--fg-subtle)' }}>
            <Icon name="user" size={22} />
          </div>
          <div className="col grow">
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Foto profil</span>
            <span className="caption" style={{ marginTop: 2 }}>JPG/PNG · maks 2MB · disarankan persegi</span>
          </div>
          <button className="btn btn-outline btn-sm">Unggah</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Nama lengkap (dengan gelar)" required>
            <input className="input" defaultValue="Vina Permatasari, M.Psi" />
          </Field>
          <Field label="Nama panggilan" required>
            <input className="input" defaultValue="Vina" />
          </Field>
          <Field label="Email login" required>
            <input className="input" defaultValue="vina@altheapsychology.id" />
          </Field>
          <Field label="No. WhatsApp" required>
            <input className="input" defaultValue="+62 813 1122 5544" />
          </Field>
        </div>

        <Field label="Spesialisasi utama" required>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            {['Klinis Dewasa', 'Anak & Remaja', 'Pasangan', 'Keluarga', 'Tes Psikologi'].map((t, i) => (
              <button key={t} className="btn btn-sm" style={{
                height: 32, padding: '0 12px',
                background: i === 0 ? 'var(--sage-100)' : 'var(--bg-elev)',
                border: '1px solid ' + (i === 0 ? 'var(--sage-400)' : 'var(--border-strong)'),
                color: i === 0 ? 'var(--sage-800)' : 'var(--teal-800)',
              }}>{t}</button>
            ))}
          </div>
        </Field>

        <Field label="Tag spesialisasi (multi)" hint="Tampil di profil & dipakai untuk pencocokan klien">
          <div className="row gap-2" style={{ flexWrap: 'wrap', padding: 8, border: '1px solid var(--border-strong)', borderRadius: 8, minHeight: 42 }}>
            {['Anxiety', 'Burnout', 'Trauma'].map(t => (
              <span key={t} className="badge badge-sage" style={{ height: 24 }}>{t} <Icon name="x" size={11} /></span>
            ))}
            <span className="caption" style={{ alignSelf: 'center' }}>+ tambah tag…</span>
          </div>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Maks. klien per hari" hint="Slot ke-N akan otomatis terblokir">
            <input className="input" defaultValue="4" type="number" />
          </Field>
          <Field label="Mulai bergabung">
            <input className="input" defaultValue="01 / 06 / 2026" />
          </Field>
        </div>
      </DialogFrame>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Add Layanan
// ────────────────────────────────────────────────────────────
function DialogAddLayanan() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Layanan · Baru"
        title="Tambah Layanan"
        width={580}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn btn-outline">Simpan sebagai draft</button>
          <button className="btn btn-primary">Publikasi</button>
        </>}>
        <Field label="Nama layanan" required>
          <input className="input" defaultValue="Terapi Anak Singkat" />
        </Field>

        <Field label="Kategori" required>
          <div className="row gap-2">
            {[
              ['konseling', 'Konseling', false],
              ['terapi', 'Terapi', false],
              ['anak', 'Anak', true],
              ['tes', 'Tes', false],
            ].map(([k, lbl, sel]) => (
              <button key={k} className="btn btn-sm" style={{
                flex: 1, height: 36,
                background: sel ? 'var(--sage-100)' : 'var(--bg-elev)',
                border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border-strong)'),
                color: sel ? 'var(--sage-800)' : 'var(--teal-800)',
                fontWeight: sel ? 600 : 500,
              }}>{lbl}</button>
            ))}
          </div>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <Field label="Jumlah sesi" required>
            <input className="input" defaultValue="4" type="number" />
          </Field>
          <Field label="Durasi per sesi" required>
            <Select value="60 menit" />
          </Field>
          <Field label="Harga total" required>
            <input className="input" defaultValue="Rp 1.300.000" />
          </Field>
        </div>

        <Field label="Deskripsi singkat" hint="Tampil di katalog layanan & pesan WhatsApp konfirmasi">
          <textarea className="input" style={{ height: 90, padding: 12, resize: 'none', lineHeight: 1.5 }} defaultValue="Paket terapi singkat untuk anak usia 4–12 tahun. Cocok untuk masalah perilaku ringan hingga sedang seperti tantrum, kesulitan adaptasi, atau kecemasan." />
        </Field>

        {/* Status aktif/non-aktif — menggantikan "Aktifkan booking online" yang
            tidak relevan untuk klinik karena booking dilakukan admin (bukan klien). */}
        <Field label="Status layanan" hint="Layanan non-aktif tidak muncul di katalog & tidak bisa dibooking">
          <div className="row gap-3" style={{ padding: 12, background: 'var(--cream-50)', borderRadius: 8 }}>
            <div className="col grow">
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Aktifkan layanan ini</span>
              <span className="caption" style={{ marginTop: 2 }}>Saat ini: <strong style={{ color: 'var(--success)' }}>Aktif</strong> — admin dapat menjadwalkan klien ke layanan ini</span>
            </div>
            <div style={{ width: 32, height: 18, borderRadius: 999, background: 'var(--sage-500)', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: 16, width: 14, height: 14, borderRadius: 999, background: '#fff' }} />
            </div>
          </div>
        </Field>
      </DialogFrame>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Add Ruangan
// ────────────────────────────────────────────────────────────
function DialogAddRuangan() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Ruangan · Baru"
        title="Tambah Ruangan"
        width={520}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn btn-primary">Simpan</button>
        </>}>
        <Field label="Nama ruangan" required>
          <input className="input" defaultValue="Ocean Room" />
        </Field>

        <Field label="Tipe ruangan" required>
          <div className="row gap-2">
            {[
              ['konseling', 'Konseling', 'door', true],
              ['anak', 'Anak', 'door', false],
              ['tes', 'Tes', 'list', false],
              ['seminar', 'Seminar', 'users', false],
            ].map(([k, lbl, ic, sel]) => (
              <button key={k} className="btn btn-sm" style={{
                flex: 1, height: 56, flexDirection: 'column', gap: 4,
                background: sel ? 'var(--sage-100)' : 'var(--bg-elev)',
                border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border-strong)'),
                color: sel ? 'var(--sage-800)' : 'var(--teal-800)',
              }}>
                <Icon name={ic} size={16} />
                <span style={{ fontSize: 12 }}>{lbl}</span>
              </button>
            ))}
          </div>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Kapasitas" required>
            <input className="input" defaultValue="2" type="number" />
          </Field>
          <Field label="Lantai">
            <Select value="Lantai 2" />
          </Field>
        </div>

        <Field label="Fasilitas tersedia">
          <div className="col gap-1" style={{ padding: 10, border: '1px solid var(--border-strong)', borderRadius: 8 }}>
            {[
              ['Sofa 2-seater', true],
              ['Meja kecil', true],
              ['AC', true],
              ['Tisu', true],
              ['Whiteboard', false],
              ['Sound proof', false],
            ].map(([f, sel]) => (
              <label key={f} className="row gap-2" style={{ padding: '4px 0', cursor: 'pointer' }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, border: '1.5px solid ' + (sel ? 'var(--sage-500)' : 'var(--border-strong)'), background: sel ? 'var(--sage-500)' : 'transparent', display: 'grid', placeItems: 'center' }}>
                  {sel && <Icon name="check" size={11} stroke="#fff" sw={2.5} />}
                </span>
                <span style={{ fontSize: 13, color: 'var(--fg)' }}>{f}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Catatan internal">
          <textarea className="input" style={{ height: 60, padding: 10, resize: 'none' }} placeholder="opsional — lokasi, akses, dll" />
        </Field>
      </DialogFrame>
    </div>
  );
}

Object.assign(window, { DialogFrame, Field, Select, DialogAddKlien, DialogAddPsikolog, DialogAddLayanan, DialogAddRuangan });
