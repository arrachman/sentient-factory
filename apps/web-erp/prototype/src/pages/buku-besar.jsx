// Buku Besar — running-balance ledger with account picker + search.
const GL_ACCOUNTS = [
  { code: '110101.101', name: 'Cash (IDR)', open: 250000000 },
  { code: '110102.001', name: 'Bank BCA 4520-xxx', open: 812400000 },
  { code: '110102.002', name: 'Bank Mandiri 1390-xxx', open: 318900000 },
  { code: '110201.101', name: 'Piutang Usaha', open: 876500000 },
  { code: '410101.101', name: 'Penjualan Barang Jadi', open: 0 },
  { code: '510101.101', name: 'HPP', open: 0 },
  { code: '610101.101', name: 'Beban Gaji', open: 0 },
];

const BukuBesar = ({ t }) => {
  const [active, setActive] = React.useState(GL_ACCOUNTS[0].code);
  const [q, setQ] = React.useState('');
  const [acctFocused, setAcctFocused] = React.useState(0);

  const acct = GL_ACCOUNTS.find(a => a.code === active) || GL_ACCOUNTS[0];
  const accounts = GL_ACCOUNTS.filter(a =>
    !q || a.code.includes(q) || a.name.toLowerCase().includes(q.toLowerCase()));

  useKey((e) => {
    if (window.__overlay) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setAcctFocused(f => Math.min(accounts.length - 1, f + 1)); }
    else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setAcctFocused(f => Math.max(0, f - 1)); }
    else if (e.key === 'Enter' && accounts[acctFocused]) { e.preventDefault(); setActive(accounts[acctFocused].code); }
  });

  const entries = React.useMemo(() => {
    const seed = active.split('').reduce((s, c) => s + c.charCodeAt(0), 7);
    const r = (typeof rng !== 'undefined')
      ? rng(seed)
      : (() => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
    const URA = (typeof URAIAN_KAS !== 'undefined') ? URAIAN_KAS : ['Transaksi'];
    let bal = acct.open;
    return Array.from({ length: 32 }, (_, i) => {
      const debit = r() > 0.5 ? Math.round(r() * 5000000 / 1000) * 1000 : 0;
      const credit = !debit ? Math.round(r() * 4500000 / 1000) * 1000 : 0;
      bal = bal + debit - credit;
      const day = (i % 12) + 1;
      return {
        id: i,
        ref: `${['CR', 'RM', 'GJ', 'SM', 'CD'][i % 5]}-2605-${String(2400 - i).padStart(4, '0')}`,
        tgl: `${String(day).padStart(2, '0')}/05/2026`,
        uraian: URA[i % URA.length],
        debit, credit, bal,
      };
    });
  }, [active]);

  const sumD = entries.reduce((s, e) => s + e.debit, 0);
  const sumK = entries.reduce((s, e) => s + e.credit, 0);
  const endBal = entries.length ? entries[entries.length - 1].bal : acct.open;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('Buku Besar')}<span className="code-tag">GL</span></h1>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={12}/> Mei 2026</button>
          <button className="btn" onClick={() => window.toast('Buku besar diekspor (.xlsx)', { type: 'success' })}>
            <Icon name="download" size={12}/> {t('Export')}
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100%', minHeight: 0, flex: 1 }}>
        <aside style={{ background: 'var(--panel)', borderRight: '1px solid var(--border)', overflow: 'auto' }} className="scrollbar">
          <div style={{ padding: 10, borderBottom: '1px solid var(--border)' }}>
            <div className="search-input" style={{ width: '100%' }}>
              <Icon name="search" size={12}/>
              <input placeholder="Cari akun..." value={q} onChange={e => setQ(e.target.value)}/>
            </div>
          </div>
          {accounts.map((a, i) => (
            <div key={a.code} className={`flyout-item ${a.code === active ? 'active' : ''} ${i === acctFocused ? 'focused' : ''}`}
              style={{ margin: 4, padding: '8px 10px' }} onClick={() => { setActive(a.code); setAcctFocused(i); }}>
              <span className="code" style={{ marginLeft: 0, marginRight: 8 }}>{a.code}</span>
              <span>{a.name}</span>
            </div>
          ))}
          {accounts.length === 0 && <div className="muted" style={{ padding: 16, fontSize: 12 }}>Akun tidak ditemukan</div>}
        </aside>
        <div className="tbl-wrap scrollbar">
          <div style={{ display: 'flex', gap: 16, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--panel-2)', fontSize: 12.5, flexWrap: 'wrap' }}>
            <div><span className="muted">Akun:</span> <strong style={{ fontFamily: 'Geist Mono, monospace' }}>{acct.code}</strong> {acct.name}</div>
            <div><span className="muted">Saldo Awal:</span> <span style={{ fontFamily: 'Geist Mono, monospace' }}>{fmtIDR(acct.open)}</span></div>
            <div><span className="muted">Debit:</span> <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--success)' }}>{fmtIDR(sumD)}</span></div>
            <div><span className="muted">Kredit:</span> <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--danger)' }}>{fmtIDR(sumK)}</span></div>
            <div style={{ marginLeft: 'auto' }}><span className="muted">Saldo Akhir:</span> <strong style={{ fontFamily: 'Geist Mono, monospace' }}>{fmtIDR(endBal)}</strong></div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Tanggal</th><th>Referensi</th><th>Uraian</th>
                <th className="col-num">Debit</th><th className="col-num">Kredit</th><th className="col-num">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td className="mono muted">{e.tgl}</td>
                  <td className="mono"><span style={{ color: 'var(--primary-soft-fg)' }}>{e.ref}</span></td>
                  <td className="muted">{e.uraian}</td>
                  <td className="num" style={{ color: e.debit ? 'var(--success)' : 'var(--fg-faint)' }}>{e.debit ? fmtIDR(e.debit) : '—'}</td>
                  <td className="num" style={{ color: e.credit ? 'var(--danger)' : 'var(--fg-faint)' }}>{e.credit ? fmtIDR(e.credit) : '—'}</td>
                  <td className="num"><strong>{fmtIDR(e.bal)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pager">
        <span className="muted">Pintasan: <Kbd>J</Kbd>/<Kbd>K</Kbd> navigasi akun · <Kbd>↵</Kbd> pilih akun</span>
      </div>
    </div>
  );
};

window.BukuBesar = BukuBesar;
