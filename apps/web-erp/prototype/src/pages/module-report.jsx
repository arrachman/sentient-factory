// ModuleReport — operational module reports (Inv/Pur/Sls/Mfg/FA)
// CDN React 18 + Babel Standalone, no import/export — globals via window.*

const MODULE_REPORTS = {
  'inv-rep-stok':  { label: 'Stok Akhir',          group: 'Persediaan',  type: 'inv-stok' },
  'inv-rep-kartu': { label: 'Kartu Stok',           group: 'Persediaan',  type: 'inv-kartu' },
  'pur-rep-aging': { label: 'Aging Hutang',          group: 'Pembelian',   type: 'pur-aging' },
  'pur-rep-rekap': { label: 'Rekap Pembelian',       group: 'Pembelian',   type: 'pur-rekap' },
  'sls-rep-aging': { label: 'Aging Piutang',         group: 'Sales',       type: 'sls-aging' },
  'sls-rep-rekap': { label: 'Rekap Penjualan',       group: 'Sales',       type: 'sls-rekap' },
  'mfg-rep-wo':    { label: 'Rekap Work Order',      group: 'Produksi',    type: 'mfg-wo' },
  'fa-rep-rekap':  { label: 'Rekap Aset',            group: 'Fixed Asset', type: 'fa-rekap' },
  'fa-rep-dep':    { label: 'Laporan Penyusutan',    group: 'Fixed Asset', type: 'fa-dep' },
};

// ── helpers ──────────────────────────────────────────────────────────────────
const seed = (i, mod = 1e9) => ((i * 1103515245 + 12345) & 0x7fffffff) % mod;
const rng  = (i, lo, hi) => lo + (seed(i * 31 + 7) % (hi - lo + 1));
const pick = (i, arr) => arr[seed(i * 17) % arr.length];
const fmtD = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const thisMonth = () => {
  const y = today.getFullYear(), m = String(today.getMonth() + 1).padStart(2, '0');
  return { from: `${y}-${m}-01`, to: fmtD(today) };
};

// ── per-type column/stats/data definitions ───────────────────────────────────
const TYPES = {
  'inv-stok': {
    extraFilter: null,
    stats: (rows) => [
      { label: 'Total Item',       val: rows.length },
      { label: 'Total Nilai Stok', val: fmtIDR(rows.reduce((s, r) => s + r.nilai, 0)) },
      { label: 'Di Bawah Min',     val: rows.filter(r => r.akhir < 10).length },
      { label: 'Nilai Terbesar',   val: fmtIDR(Math.max(...rows.map(r => r.nilai))) },
    ],
    cols: ['Kode Item','Nama Item','Kategori','Gudang','Stok Awal','Masuk','Keluar','Stok Akhir','Nilai Stok'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const masuk = rng(i, 50, 500), keluar = rng(i + 1, 10, masuk), awal = rng(i + 2, 0, 100);
      const akhir = awal + masuk - keluar;
      const nilai = akhir * rng(i + 3, 50000, 500000);
      return {
        akhir, nilai,
        cells: [`ITM-${String(i+1).padStart(3,'0')}`, `Item Produk ${i+1}`,
                pick(i, ['Bahan Baku','Setengah Jadi','Jadi']), pick(i, ['GDG-01','GDG-02','GDG-03']),
                awal, masuk, keluar, akhir, fmtIDR(nilai)],
      };
    }),
  },
  'inv-kartu': {
    extraFilter: 'item',
    stats: (rows) => {
      const masukT = rows.reduce((s, r) => s + r.masuk, 0);
      const keluarT = rows.reduce((s, r) => s + r.keluar, 0);
      return [
        { label: 'Saldo Awal',   val: 100 },
        { label: 'Total Masuk',  val: masukT },
        { label: 'Total Keluar', val: keluarT },
        { label: 'Saldo Akhir',  val: 100 + masukT - keluarT },
      ];
    },
    cols: ['Tanggal','No Dokumen','Keterangan','Masuk','Keluar','Saldo','Nilai'],
    rows: () => {
      let saldo = 100;
      return Array.from({ length: 20 }, (_, i) => {
        const masuk = i % 3 === 0 ? rng(i, 20, 80) : 0;
        const keluar = i % 3 !== 0 ? rng(i, 5, 30) : 0;
        saldo += masuk - keluar;
        const nilai = saldo * rng(i + 5, 50000, 200000);
        const d = new Date(today); d.setDate(d.getDate() - (19 - i));
        return {
          masuk, keluar,
          cells: [fmtD(d), `DOC-${2025000 + i}`, masuk ? 'Penerimaan' : 'Pengeluaran',
                  masuk || '-', keluar || '-', saldo, fmtIDR(nilai)],
        };
      });
    },
  },
  'pur-aging': {
    extraFilter: null,
    stats: (rows) => {
      const total = rows.reduce((s, r) => s + r.amt, 0);
      const cur   = rows.filter(r => r.aging <= 30).reduce((s, r) => s + r.amt, 0);
      const ov30  = rows.filter(r => r.aging > 30 && r.aging <= 60).reduce((s, r) => s + r.amt, 0);
      const ov60  = rows.filter(r => r.aging > 60).reduce((s, r) => s + r.amt, 0);
      return [
        { label: 'Total Hutang',    val: fmtIDR(total) },
        { label: 'Current 0–30',    val: fmtIDR(cur) },
        { label: 'Overdue 30–60',   val: fmtIDR(ov30) },
        { label: 'Overdue >60',     val: fmtIDR(ov60) },
      ];
    },
    cols: ['Supplier','No Faktur','Tgl Faktur','Jatuh Tempo','Total','Aging (hr)','Bucket'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const aging = rng(i, 0, 90);
      const amt   = rng(i + 1, 5, 200) * 1e6;
      const d = new Date(today); d.setDate(d.getDate() - aging);
      const jt = new Date(d); jt.setDate(jt.getDate() + 30);
      const bucket = aging <= 30 ? 'Current' : aging <= 60 ? '30–60' : '90+';
      return { aging, amt, cells: [`Supplier ${String.fromCharCode(65+i%10)} ${Math.floor(i/10)+1}`,
               `INV-PUR-${2025000+i}`, fmtD(d), fmtD(jt), fmtIDR(amt), aging, bucket] };
    }),
  },
  'pur-rekap': {
    extraFilter: null,
    stats: (rows) => {
      const total = rows.reduce((s, r) => s + r.amt, 0);
      const diterima = rows.filter(r => r.status === 'Diterima').length;
      return [
        { label: 'Total PO',         val: rows.length },
        { label: 'Total Nilai',       val: fmtIDR(total) },
        { label: 'Sudah Diterima',    val: diterima },
        { label: 'Belum Diterima',    val: rows.length - diterima },
      ];
    },
    cols: ['No PO','Tgl','Supplier','Jml Item','Total','Status','No Penerimaan'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const status = pick(i, ['Diterima','Sebagian','Pending']);
      const amt = rng(i + 2, 10, 500) * 1e6;
      const d = new Date(today); d.setDate(d.getDate() - rng(i, 1, 30));
      return { amt, status, cells: [`PO-${2025000+i}`, fmtD(d),
               `Supplier ${String.fromCharCode(65+i%8)}`, rng(i+3,1,15),
               fmtIDR(amt), status, status === 'Diterima' ? `GR-${2025000+i}` : '-'] };
    }),
  },
  'sls-aging': {
    extraFilter: null,
    stats: (rows) => {
      const total = rows.reduce((s, r) => s + r.amt, 0);
      const cur  = rows.filter(r => r.aging <= 30).reduce((s, r) => s + r.amt, 0);
      const ov30 = rows.filter(r => r.aging > 30 && r.aging <= 60).reduce((s, r) => s + r.amt, 0);
      const ov60 = rows.filter(r => r.aging > 60).reduce((s, r) => s + r.amt, 0);
      return [
        { label: 'Total Piutang',  val: fmtIDR(total) },
        { label: 'Current 0–30',   val: fmtIDR(cur) },
        { label: 'Overdue 30–60',  val: fmtIDR(ov30) },
        { label: 'Overdue >60',    val: fmtIDR(ov60) },
      ];
    },
    cols: ['Customer','No Faktur','Tgl Faktur','Jatuh Tempo','Total','Aging (hr)','Bucket'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const aging = rng(i + 5, 0, 90);
      const amt   = rng(i + 6, 10, 300) * 1e6;
      const d = new Date(today); d.setDate(d.getDate() - aging);
      const jt = new Date(d); jt.setDate(jt.getDate() + 30);
      const bucket = aging <= 30 ? 'Current' : aging <= 60 ? '30–60' : '90+';
      return { aging, amt, cells: [`Customer ${String.fromCharCode(65+i%10)} ${Math.floor(i/10)+1}`,
               `INV-SLS-${2025000+i}`, fmtD(d), fmtD(jt), fmtIDR(amt), aging, bucket] };
    }),
  },
  'sls-rekap': {
    extraFilter: null,
    stats: (rows) => {
      const total = rows.reduce((s, r) => s + r.amt, 0);
      const doDone = rows.filter(r => r.stDO === 'Terkirim').length;
      const invDone = rows.filter(r => r.stInv === 'Invoiced').length;
      return [
        { label: 'Total SO',        val: rows.length },
        { label: 'Total Nilai',      val: fmtIDR(total) },
        { label: 'Sudah DO',         val: doDone },
        { label: 'Sudah Invoiced',   val: invDone },
      ];
    },
    cols: ['No SO','Tgl','Customer','Jml Item','Total','Status DO','Status Invoice'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const stDO  = pick(i, ['Terkirim','Sebagian','Pending']);
      const stInv = stDO === 'Terkirim' ? pick(i+1, ['Invoiced','Draft']) : 'Pending';
      const amt   = rng(i + 7, 5, 400) * 1e6;
      const d = new Date(today); d.setDate(d.getDate() - rng(i+4, 1, 30));
      return { amt, stDO, stInv, cells: [`SO-${2025000+i}`, fmtD(d),
               `Customer ${String.fromCharCode(65+i%9)}`, rng(i+8,1,20), fmtIDR(amt), stDO, stInv] };
    }),
  },
  'mfg-wo': {
    extraFilter: null,
    stats: (rows) => {
      const done  = rows.filter(r => r.status === 'Selesai').length;
      const inpro = rows.filter(r => r.status === 'Proses').length;
      const batal = rows.filter(r => r.status === 'Batal').length;
      return [
        { label: 'Total WO',      val: rows.length },
        { label: 'Selesai',       val: done },
        { label: 'Dalam Proses',  val: inpro },
        { label: 'Batal',         val: batal },
      ];
    },
    cols: ['No WO','Produk','Qty Rencana','Qty Jadi','Progress (%)','Status','Tgl Mulai','Tgl Selesai'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const status = pick(i, ['Selesai','Proses','Batal']);
      const plan   = rng(i + 9, 100, 1000);
      const jadi   = status === 'Selesai' ? plan : status === 'Proses' ? rng(i+10, 10, plan-1) : 0;
      const pct    = Math.round(jadi / plan * 100);
      const start  = new Date(today); start.setDate(start.getDate() - rng(i+11, 5, 30));
      const end    = new Date(start); end.setDate(end.getDate() + rng(i+12, 3, 14));
      return { status, cells: [`WO-${2025000+i}`, `Produk ${String.fromCharCode(65+i%6)} Series`,
               plan, jadi, `${pct}%`, status, fmtD(start), status === 'Proses' ? '-' : fmtD(end)] };
    }),
  },
  'fa-rekap': {
    extraFilter: null,
    stats: (rows) => {
      const totalHP  = rows.reduce((s, r) => s + r.hp, 0);
      const totalNB  = rows.reduce((s, r) => s + r.nb, 0);
      const totalAkm = rows.reduce((s, r) => s + r.akm, 0);
      return [
        { label: 'Total Aset Aktif',         val: rows.filter(r => r.status === 'Aktif').length },
        { label: 'Total Harga Perolehan',     val: fmtIDR(totalHP) },
        { label: 'Total Nilai Buku',          val: fmtIDR(totalNB) },
        { label: 'Total Akum Penyusutan',     val: fmtIDR(totalAkm) },
      ];
    },
    cols: ['Kode','Nama Aset','Kategori','Tgl Perolehan','Harga Perolehan','Akum Penyusutan','Nilai Buku','Status'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const hp  = rng(i + 13, 50, 2000) * 1e6;
      const akm = Math.round(hp * rng(i + 14, 10, 80) / 100);
      const nb  = hp - akm;
      const status = i < 17 ? 'Aktif' : 'Nonaktif';
      const d = new Date(2018, rng(i, 0, 11), rng(i+1, 1, 28));
      return { hp, akm, nb, status, cells: [`FA-${String(i+1).padStart(3,'0')}`,
               `${pick(i, ['Mesin','Kendaraan','Komputer','Gedung'])} ${i+1}`,
               pick(i, ['Mesin','Kendaraan','Peralatan','Bangunan']), fmtD(d),
               fmtIDR(hp), fmtIDR(akm), fmtIDR(nb), status] };
    }),
  },
  'fa-dep': {
    extraFilter: null,
    stats: (rows) => {
      const bln  = rows.reduce((s, r) => s + r.depBln, 0);
      const akm  = rows.reduce((s, r) => s + r.akmIni, 0);
      const full = rows.filter(r => r.nb === 0).length;
      return [
        { label: 'Penyusutan Bulan Ini',  val: fmtIDR(bln) },
        { label: 'Total Akumulasi',        val: fmtIDR(akm) },
        { label: 'Fully Depreciated',      val: full },
        { label: 'Aset Aktif',             val: rows.length - full },
      ];
    },
    cols: ['Kode Aset','Nama','Metode','Harga Perolehan','Akum s/d Lalu','Penyusutan Bln Ini','Akum s/d Ini','Nilai Buku'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const hp     = rng(i + 15, 100, 1500) * 1e6;
      const akmLalu = Math.round(hp * rng(i + 16, 5, 95) / 100);
      const depBln  = i > 17 ? 0 : Math.round(hp / (rng(i + 17, 24, 60)));
      const akmIni  = akmLalu + depBln;
      const nb      = Math.max(0, hp - akmIni);
      return { depBln, akmIni, nb, cells: [`FA-${String(i+1).padStart(3,'0')}`,
               `${pick(i, ['Mesin CNC','Forklift','Server','AC','Genset'])} ${i+1}`,
               pick(i, ['Garis Lurus','Saldo Menurun']),
               fmtIDR(hp), fmtIDR(akmLalu), fmtIDR(depBln), fmtIDR(akmIni), fmtIDR(nb)] };
    }),
  },
};

// ── sub-components ────────────────────────────────────────────────────────────
const { useState, useMemo } = React;

function StatCards({ stats }) {
  return (
    <div style={{ display:'flex', gap: 12, flexWrap:'wrap', marginBottom: 20 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: 'var(--panel)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '12px 18px', minWidth: 140, flex: '1 1 140px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>{s.val}</div>
        </div>
      ))}
    </div>
  );
}

function DataTable({ cols, rows, focused, onSetFocused }) {
  const PAGE = 20;
  const cells = rows.map(r => r.cells);
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--panel)', borderBottom: '2px solid var(--border)' }}>
              {cols.map(c => (
                <th key={c} style={{ padding: '8px 12px', textAlign: 'left',
                  color: 'var(--fg-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, i) => (
              <tr key={i} className={i === focused ? 'focused' : ''}
                style={{ borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'transparent' : 'var(--panel)' }}
                onClick={() => onSetFocused(i)}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '7px 12px', color: 'var(--fg)', whiteSpace: 'nowrap' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Pintasan: <Kbd>J</Kbd>/<Kbd>K</Kbd> navigasi baris</span>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Menampilkan 1–{Math.min(PAGE, cells.length)} dari {cells.length}</span>
      </div>
    </div>
  );
}

function FilterBar({ from, to, setFrom, setTo, branch, setBranch, extraFilter, onShow, onExport, t }) {
  const locs = (window.POOLS?.loc || []).slice(0, 5);
  const items = (window.POOLS?.item || []).slice(0, 8);
  const inp = { padding: '6px 10px', border: '1px solid var(--border)',
    borderRadius: 6, background: 'var(--panel)', color: 'var(--fg)', fontSize: 13 };
  const btnPrimary = {
    padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
    background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: 13,
  };
  const btnGhost = {
    ...btnPrimary, background: 'transparent', color: 'var(--fg)',
    border: '1px solid var(--border)',
  };
  return (
    <div style={{ display:'flex', gap: 10, flexWrap:'wrap', alignItems:'center', marginBottom: 18 }}>
      <label style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Dari</label>
      <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={inp} />
      <label style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Sampai</label>
      <input type="date" value={to} onChange={e => setTo(e.target.value)} style={inp} />
      <select value={branch} onChange={e => setBranch(e.target.value)} style={inp}>
        <option value="">Semua Cabang</option>
        {locs.map(l => <option key={l.id} value={l.id}>{l.name || l.id}</option>)}
      </select>
      {extraFilter === 'item' && (
        <select style={inp}>
          <option value="">Semua Item</option>
          {items.map(it => <option key={it.id} value={it.id}>{it.name || it.id}</option>)}
        </select>
      )}
      <button style={btnPrimary} onClick={onShow}>Tampilkan</button>
      <button style={btnGhost} onClick={onExport}>
        <Icon name="download" size={14} /> Ekspor
      </button>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function ModuleReport({ moduleId, t }) {
  const meta = MODULE_REPORTS[moduleId];
  const def  = TYPES[meta?.type];
  const { from: defFrom, to: defTo } = thisMonth();

  const [from, setFrom]     = useState(defFrom);
  const [to, setTo]         = useState(defTo);
  const [branch, setBranch] = useState('');
  const [show, setShow]     = useState(true);
  const [focused, setFocused] = useState(0);

  const rows  = useMemo(() => def?.rows() || [], [moduleId]);
  const stats = useMemo(() => def?.stats(rows) || [], [rows]);

  useKey((e) => {
    if (window.__overlay) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(rows.length - 1, f + 1)); }
    else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
  });

  if (!meta || !def) {
    return <div style={{ color: 'var(--danger)', padding: 24 }}>Laporan tidak dikenal: {moduleId}</div>;
  }

  const handleExport = () => {
    if (window.showToast) window.showToast('Ekspor berhasil', 'success');
    else alert('Ekspor berhasil');
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-faint)', marginBottom: 2 }}>
          {meta.group}
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>
          {meta.label}
        </h2>
      </div>

      {/* Filter bar */}
      <FilterBar
        from={from} to={to} setFrom={setFrom} setTo={setTo}
        branch={branch} setBranch={setBranch}
        extraFilter={def.extraFilter}
        onShow={() => setShow(true)}
        onExport={handleExport}
        t={t}
      />

      {/* Stats */}
      {show && <StatCards stats={stats} />}

      {/* Table */}
      {show && <DataTable cols={def.cols} rows={rows} focused={focused} onSetFocused={setFocused} />}
    </div>
  );
}

Object.assign(window, { ModuleReport, MODULE_REPORTS });
