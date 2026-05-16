// Financial reports — Neraca / Laba Rugi / Arus Kas / Perubahan Modal
const L = (label, cur, prev, opt = {}) => ({ label, cur, prev, ...opt });
const SEC = (label) => ({ label, section: true });

const REPORT_DATA = {
  pl: () => [
    SEC('Pendapatan'),
    L('Penjualan Barang Jadi', 4875200000, 4203800000),
    L('Penjualan Jasa', 612400000, 548900000),
    L('Retur & Potongan', -184300000, -161200000),
    L('Total Pendapatan', 5303300000, 4591500000, { total: true }),
    SEC('Harga Pokok Penjualan'),
    L('Bahan Baku', -1942100000, -1718400000),
    L('Tenaga Kerja Langsung', -864500000, -792300000),
    L('Overhead Pabrik', -498700000, -451900000),
    L('Total HPP', -3305300000, -2962600000, { total: true }),
    L('Laba Kotor', 1998000000, 1628900000, { total: true, strong: true }),
    SEC('Beban Operasional'),
    L('Beban Penjualan', -412800000, -376500000),
    L('Beban Administrasi & Umum', -589300000, -544100000),
    L('Beban Penyusutan', -167400000, -158900000),
    L('Total Beban Operasional', -1169500000, -1079500000, { total: true }),
    L('Laba Operasi', 828500000, 549400000, { total: true, strong: true }),
    SEC('Pendapatan & Beban Lain'),
    L('Pendapatan Bunga', 38600000, 31200000),
    L('Beban Bunga', -94200000, -108700000),
    L('Laba Sebelum Pajak', 772900000, 471900000, { total: true }),
    L('Beban Pajak Penghasilan', -170038000, -103818000),
    L('Laba Bersih', 602862000, 368082000, { total: true, strong: true }),
  ],
  bs: () => [
    SEC('Aktiva Lancar'),
    L('Kas & Setara Kas', 1284910000, 982400000),
    L('Piutang Usaha', 876500000, 791300000),
    L('Persediaan', 1142800000, 1018600000),
    L('Biaya Dibayar Dimuka', 84200000, 76900000),
    L('Total Aktiva Lancar', 3388410000, 2869200000, { total: true }),
    SEC('Aktiva Tetap'),
    L('Tanah & Bangunan', 2450000000, 2450000000),
    L('Mesin & Peralatan', 1876400000, 1712300000),
    L('Kendaraan', 612800000, 548900000),
    L('Akumulasi Penyusutan', -1184300000, -1016900000),
    L('Total Aktiva Tetap', 3754900000, 3694300000, { total: true }),
    L('TOTAL AKTIVA', 7143310000, 6563500000, { total: true, strong: true }),
    SEC('Kewajiban Lancar'),
    L('Hutang Usaha', 742600000, 698400000),
    L('Hutang Pajak', 198400000, 164200000),
    L('Beban Akrual', 156300000, 142800000),
    L('Total Kewajiban Lancar', 1097300000, 1005400000, { total: true }),
    SEC('Kewajiban Jangka Panjang'),
    L('Hutang Bank Jangka Panjang', 1284000000, 1512000000),
    L('Total Kewajiban', 2381300000, 2517400000, { total: true }),
    SEC('Ekuitas'),
    L('Modal Disetor', 3500000000, 3500000000),
    L('Laba Ditahan', 1262010000, 546100000),
    L('TOTAL PASIVA', 7143310000, 6563500000, { total: true, strong: true }),
  ],
  cf: () => [
    SEC('Arus Kas dari Operasi'),
    L('Laba Bersih', 602862000, 368082000),
    L('Penyusutan & Amortisasi', 167400000, 158900000),
    L('Perubahan Piutang Usaha', -85200000, -62400000),
    L('Perubahan Persediaan', -124200000, -98700000),
    L('Perubahan Hutang Usaha', 44200000, 38600000),
    L('Kas Bersih dari Operasi', 605062000, 402982000, { total: true, strong: true }),
    SEC('Arus Kas dari Investasi'),
    L('Pembelian Mesin & Peralatan', -164100000, -142800000),
    L('Pembelian Kendaraan', -63900000, -48200000),
    L('Kas Bersih untuk Investasi', -228000000, -191000000, { total: true, strong: true }),
    SEC('Arus Kas dari Pendanaan'),
    L('Pembayaran Pokok Pinjaman', -228000000, -204000000),
    L('Pembayaran Dividen', -150000000, -120000000),
    L('Kas Bersih untuk Pendanaan', -378000000, -324000000, { total: true, strong: true }),
    L('Kenaikan (Penurunan) Kas', -870000, -112018000, { total: true }),
    L('Kas Awal Periode', 1285780000, 1397798000),
    L('Kas Akhir Periode', 1284910000, 1285780000, { total: true, strong: true }),
  ],
  eq: () => [
    SEC('Saldo Awal Periode'),
    L('Modal Disetor', 3500000000, 3500000000),
    L('Laba Ditahan', 546100000, 298018000),
    L('Total Ekuitas Awal', 4046100000, 3798018000, { total: true }),
    SEC('Perubahan Selama Periode'),
    L('Laba Bersih Tahun Berjalan', 602862000, 368082000),
    L('Tambahan Modal Disetor', 0, 0),
    L('Pembagian Dividen', -150000000, -120000000),
    L('Total Perubahan', 452862000, 248082000, { total: true }),
    SEC('Saldo Akhir Periode'),
    L('Modal Disetor', 3500000000, 3500000000),
    L('Laba Ditahan', 998962000, 546100000),
    L('Total Ekuitas Akhir', 4498962000, 4046100000, { total: true, strong: true }),
  ],
};

const FinancialReport = ({ moduleId, t }) => {
  const rep = window.REPORTS[moduleId];
  const [showPrev, setShowPrev] = React.useState(true);
  if (!rep) return <div style={{ padding: 24 }}>Laporan tidak ditemukan: {moduleId}</div>;
  const lines = REPORT_DATA[rep.type]();

  const delta = (cur, prev) => {
    if (!prev) return null;
    const d = ((cur - prev) / Math.abs(prev)) * 100;
    return d;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t(rep.label)}<span className="code-tag">{rep.code}</span></h1>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={12}/> 01/01 – 31/05/2026</button>
          <button className={`btn ${showPrev ? 'primary' : ''}`} onClick={() => setShowPrev(s => !s)}>
            <Icon name="history" size={12}/> {t('Tahun Lalu')}
          </button>
          <button className="btn"><Icon name="download" size={12}/> {t('Export')}</button>
          <button className="btn"><Icon name="file" size={12}/> PDF</button>
        </div>
      </div>

      <div className="toolbar">
        <span className="chip active"><Icon name="calendar" size={11}/><span className="label">{t('Periode')}</span><span className="val">Mei 2026 (YTD)</span></span>
        <span className="chip active"><span className="label">{t('Cabang')}</span><span className="val">Konsolidasi</span></span>
        <span className="chip"><span className="label">Mata Uang</span><span className="val">IDR</span></span>
        <div style={{ flex: 1 }}/>
        <span className="muted" style={{ fontSize: 11.5 }}>Disusun: 15/05/2026 · Belum diaudit</span>
      </div>

      <div className="tbl-wrap scrollbar">
        <table className="tbl rep-tbl">
          <thead>
            <tr>
              <th style={{ minWidth: 360 }}>Keterangan</th>
              <th className="col-num">{t('Tahun Berjalan')}</th>
              {showPrev && <th className="col-num">{t('Tahun Lalu')}</th>}
              {showPrev && <th className="col-num" style={{ width: 90 }}>Δ %</th>}
            </tr>
          </thead>
          <tbody>
            {lines.map((ln, i) => {
              if (ln.section) return (
                <tr key={i} className="rep-section">
                  <td colSpan={showPrev ? 4 : 2}>{ln.label}</td>
                </tr>
              );
              const d = delta(ln.cur, ln.prev);
              return (
                <tr key={i} className={`${ln.total ? 'rep-total' : ''} ${ln.strong ? 'rep-strong' : ''}`}>
                  <td style={{ paddingLeft: ln.total ? 10 : 26 }}>{ln.label}</td>
                  <td className="num" style={{ color: ln.cur < 0 ? 'var(--danger)' : 'inherit' }}>{fmtIDR(ln.cur)}</td>
                  {showPrev && <td className="num muted">{fmtIDR(ln.prev)}</td>}
                  {showPrev && (
                    <td className="num" style={{ color: d == null ? 'var(--fg-faint)' : d >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: 11.5 }}>
                      {d == null ? '—' : (d >= 0 ? '+' : '') + d.toFixed(1) + '%'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span className="muted">Laporan keuangan · {t(rep.label)}</span>
        <div className="spacer"/>
        <span className="muted">Nilai dalam Rupiah penuh · Mengikuti SAK</span>
      </div>
    </div>
  );
};

window.FinancialReport = FinancialReport;
