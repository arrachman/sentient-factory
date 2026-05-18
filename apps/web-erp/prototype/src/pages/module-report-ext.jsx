// ModuleReportExt — extended module reports (Prd/Sls/Pur/Inv adj)
// CDN React 18 + Babel Standalone, no import/export — globals via window.*
// Requires module-report.jsx to be loaded first (window.MODULE_REPORTS must exist)

const _seed = (i, mod = 1e9) => ((i * 1103515245 + 12345) & 0x7fffffff) % mod;
const _rng  = (i, lo, hi) => lo + (_seed(i * 31 + 7) % (hi - lo + 1));
const _pick = (i, arr) => arr[_seed(i * 17) % arr.length];
const _fmtD = (d) => d.toISOString().slice(0, 10);
const _today = new Date();
const _thisMonth = () => {
  const y = _today.getFullYear(), m = String(_today.getMonth() + 1).padStart(2, '0');
  return { from: `${y}-${m}-01`, to: _fmtD(_today) };
};

const SUPPLIERS = [
  'PT Anugerah Jaya','CV Mitra Sejahtera','PT Bumi Raya','UD Karya Mandiri',
  'PT Sinar Abadi','CV Wijaya Utama','PT Global Teknik','UD Maju Bersama',
  'PT Nusantara Prima','CV Harapan Jaya','PT Delta Industri','UD Sukses Makmur',
  'PT Cipta Kreasi','CV Artha Mulia','PT Berkah Sentosa',
];
const CUSTOMERS = [
  'PT Agung Persada','CV Cahaya Mas','PT Indah Karya','UD Setia Kawan',
  'PT Mega Utama','CV Putra Bangsa','PT Ratu Samudra','UD Fajar Baru',
  'PT Graha Mulya','CV Sejuk Abadi','PT Timur Jaya','UD Bintang Lima',
  'PT Andalan Group','CV Matahari Indo','PT Kencana Abadi',
];
const CITIES = ['Jakarta','Surabaya','Bandung','Semarang','Medan','Makassar','Yogyakarta','Palembang'];
const GUDANGS = ['GDG-01','GDG-02','GDG-03'];
const ITEMS   = ['Baut M8','Plat Baja 2mm','Pipa PVC 3"','Kabel NYA 4mm','Cat Epoxy',
                 'Oli Mesin','Filter Udara','Bearing 6205','Seal Ring','Gasket Set'];
const ALASANS = ['Selisih Hitung','Kerusakan','Kadaluarsa','Penyesuaian Fisik','Error Input'];
const PRODS   = ['Motor Listrik 5kW','Pompa Sentrifugal','Panel Kontrol 3P','Blower Industri',
                 'Kompresor Mini','Conveyor Belt 2m','Heat Exchanger','Valve Ball 2"'];

// ── per-type definitions ──────────────────────────────────────────────────────
const TYPES_EXT = {
  'prd-bom': {
    extraFilter: null,
    stats: (rows) => {
      const aktif  = rows.filter(r => r.status === 'Aktif').length;
      const bulanIni = rows.filter(r => r.updBulanIni).length;
      const totalKomp = rows.reduce((s, r) => s + r.jmlKomp, 0);
      return [
        { label: 'Total BOM',         val: rows.length },
        { label: 'Total Komponen',     val: totalKomp },
        { label: 'BOM Aktif',          val: aktif },
        { label: 'Update Bulan Ini',   val: bulanIni },
      ];
    },
    cols: ['Kode BOM','Produk','Versi','Jml Komponen','Update Terakhir','Status'],
    rows: () => Array.from({ length: 18 }, (_, i) => {
      const versi   = `v${_rng(i, 1, 5)}.${_rng(i + 1, 0, 9)}`;
      const jmlKomp = _rng(i + 2, 4, 32);
      const daysAgo = _rng(i + 3, 1, 90);
      const d = new Date(_today); d.setDate(d.getDate() - daysAgo);
      const updBulanIni = daysAgo <= 30;
      const status = i < 15 ? 'Aktif' : 'Draft';
      return {
        jmlKomp, updBulanIni, status,
        cells: [
          `BOM-${String(i + 1).padStart(3, '0')}`,
          PRODS[i % PRODS.length],
          versi, jmlKomp, _fmtD(d), status,
        ],
      };
    }),
  },

  'sls-cust': {
    extraFilter: null,
    stats: (rows) => {
      const total = rows.reduce((s, r) => s + r.nilai, 0);
      const avg   = Math.round(total / rows.length);
      const max   = rows.reduce((best, r) => r.nilai > best.nilai ? r : best, rows[0]);
      return [
        { label: 'Total Customer',        val: rows.length },
        { label: 'Total Nilai',           val: fmtIDR(total) },
        { label: 'Rata-rata per Customer', val: fmtIDR(avg) },
        { label: 'Customer Terbesar',      val: max?.custName ?? '-' },
      ];
    },
    cols: ['Kode','Customer','Kota','Total SO','Total DO','Total Faktur','Nilai','Status Piutang'],
    rows: () => Array.from({ length: 15 }, (_, i) => {
      const totalSO  = _rng(i + 4, 3, 40);
      const totalDO  = _rng(i + 5, 1, totalSO);
      const totalInv = _rng(i + 6, 1, totalDO);
      const nilai    = _rng(i + 7, 50, 2000) * 1e6;
      const stPiutang = _pick(i, ['Lunas','Sebagian','Overdue','Belum Jatuh Tempo']);
      return {
        nilai,
        custName: CUSTOMERS[i % CUSTOMERS.length],
        cells: [
          `CUST-${String(i + 1).padStart(3, '0')}`,
          CUSTOMERS[i % CUSTOMERS.length],
          CITIES[i % CITIES.length],
          totalSO, totalDO, totalInv,
          fmtIDR(nilai), stPiutang,
        ],
      };
    }),
  },

  'pur-supp': {
    extraFilter: null,
    stats: (rows) => {
      const total = rows.reduce((s, r) => s + r.nilai, 0);
      const avg   = Math.round(total / rows.length);
      const max   = rows.reduce((best, r) => r.nilai > best.nilai ? r : best, rows[0]);
      return [
        { label: 'Total Supplier',        val: rows.length },
        { label: 'Total Nilai',           val: fmtIDR(total) },
        { label: 'Rata-rata per Supplier', val: fmtIDR(avg) },
        { label: 'Supplier Terbesar',      val: max?.suppName ?? '-' },
      ];
    },
    cols: ['Kode','Supplier','Kota','Total PO','Total Penerimaan','Total Faktur','Nilai','Status Hutang'],
    rows: () => Array.from({ length: 15 }, (_, i) => {
      const totalPO  = _rng(i + 8, 2, 30);
      const totalGR  = _rng(i + 9, 1, totalPO);
      const totalInv = _rng(i + 10, 1, totalGR);
      const nilai    = _rng(i + 11, 30, 1500) * 1e6;
      const stHutang = _pick(i + 3, ['Lunas','Sebagian','Overdue','Belum Jatuh Tempo']);
      return {
        nilai,
        suppName: SUPPLIERS[i % SUPPLIERS.length],
        cells: [
          `SUPP-${String(i + 1).padStart(3, '0')}`,
          SUPPLIERS[i % SUPPLIERS.length],
          CITIES[(i + 3) % CITIES.length],
          totalPO, totalGR, totalInv,
          fmtIDR(nilai), stHutang,
        ],
      };
    }),
  },

  'inv-adj': {
    extraFilter: null,
    stats: (rows) => {
      const totalNilai = rows.reduce((s, r) => s + r.nilaiSelisih, 0);
      const positif    = rows.filter(r => r.qtySelisih > 0).length;
      const negatif    = rows.filter(r => r.qtySelisih < 0).length;
      return [
        { label: 'Total Penyesuaian', val: rows.length },
        { label: 'Nilai Selisih',     val: fmtIDR(Math.abs(totalNilai)) },
        { label: 'Positif',           val: positif },
        { label: 'Negatif',           val: negatif },
      ];
    },
    cols: ['Tanggal','No Dokumen','Gudang','Item','Qty Selisih','Nilai Selisih','Alasan','User'],
    rows: () => Array.from({ length: 20 }, (_, i) => {
      const daysAgo    = _rng(i + 12, 0, 29);
      const d = new Date(_today); d.setDate(d.getDate() - daysAgo);
      const sign       = (i % 3 === 2) ? -1 : 1;
      const qtySelisih = sign * _rng(i + 13, 1, 50);
      const nilaiSelisih = qtySelisih * _rng(i + 14, 10000, 500000);
      const users      = ['admin','wh.staff','inv.mgr','andi.s','budi.h'];
      return {
        qtySelisih, nilaiSelisih,
        cells: [
          _fmtD(d),
          `ADJ-${String(2025000 + i)}`,
          GUDANGS[i % GUDANGS.length],
          ITEMS[i % ITEMS.length],
          qtySelisih > 0 ? `+${qtySelisih}` : String(qtySelisih),
          fmtIDR(Math.abs(nilaiSelisih)),
          ALASANS[i % ALASANS.length],
          users[i % users.length],
        ],
      };
    }),
  },
};

// ── extended module registry ──────────────────────────────────────────────────
const MODULE_REPORTS_EXT = {
  'prd-rep-bom':  { label: 'Rekap BOM',           group: 'Produksi',   type: 'prd-bom' },
  'sls-rep-cust': { label: 'Rekap per Customer',   group: 'Sales',      type: 'sls-cust' },
  'pur-rep-supp': { label: 'Rekap per Supplier',   group: 'Pembelian',  type: 'pur-supp' },
  'inv-rep-adj':  { label: 'Rekap Penyesuaian',    group: 'Persediaan', type: 'inv-adj' },
};

// ── sub-components ────────────────────────────────────────────────────────────
const { useState: useStateE, useMemo: useMemoE } = React;

function StatCardsExt({ stats }) {
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

function DataTableExt({ cols, rows, focused, onSetFocused }) {
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

function FilterBarExt({ from, to, setFrom, setTo, branch, setBranch, onShow, onExport }) {
  const locs = (window.POOLS?.loc || []).slice(0, 5);
  const inp = { padding: '6px 10px', border: '1px solid var(--border)',
    borderRadius: 6, background: 'var(--panel)', color: 'var(--fg)', fontSize: 13 };
  const btnPrimary = {
    padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
    background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: 13,
  };
  const btnGhost = { ...btnPrimary, background: 'transparent', color: 'var(--fg)',
    border: '1px solid var(--border)' };
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
      <button style={btnPrimary} onClick={onShow}>Tampilkan</button>
      <button style={btnGhost} onClick={onExport}>
        <Icon name="download" size={14} /> Ekspor
      </button>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function ModuleReportExt({ moduleId, t }) {
  const meta = MODULE_REPORTS_EXT[moduleId];
  const def  = TYPES_EXT[meta?.type];
  const { from: defFrom, to: defTo } = _thisMonth();

  const [from, setFrom]     = useStateE(defFrom);
  const [to, setTo]         = useStateE(defTo);
  const [branch, setBranch] = useStateE('');
  const [show, setShow]     = useStateE(true);
  const [focused, setFocused] = useStateE(0);

  const rows  = useMemoE(() => def?.rows() || [], [moduleId]);
  const stats = useMemoE(() => def?.stats(rows) || [], [rows]);

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
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-faint)', marginBottom: 2 }}>{meta.group}</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>{meta.label}</h2>
      </div>
      <FilterBarExt
        from={from} to={to} setFrom={setFrom} setTo={setTo}
        branch={branch} setBranch={setBranch}
        onShow={() => setShow(true)}
        onExport={handleExport}
      />
      {show && <StatCardsExt stats={stats} />}
      {show && <DataTableExt cols={def.cols} rows={rows} focused={focused} onSetFocused={setFocused} />}
    </div>
  );
}

// ── extend global registries ──────────────────────────────────────────────────
Object.assign(window.MODULE_REPORTS, MODULE_REPORTS_EXT);
Object.assign(window, { ModuleReportExt, MODULE_REPORTS_EXT });
