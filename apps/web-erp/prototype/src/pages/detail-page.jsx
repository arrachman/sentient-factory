// DetailPage — tampilkan detail satu baris dokumen/master.
// Props: { moduleId, t, onNavigate, onOpenTab }
// Data: window.__viewRow (di-set sebelum navigate ke halaman ini)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const { useState, useEffect, useCallback } = React;

const fmtNum = (v) => Number(v).toLocaleString('id-ID');

const FieldValue = ({ col, value }) => {
  const tp = col.t;
  if (value == null || value === '') return <span style={{ color: 'var(--fg-faint)' }}>—</span>;
  if (tp === 'money' || tp === 'moneyS') {
    const color = tp === 'moneyS' && value < 0 ? 'var(--danger)' : 'inherit';
    return <span className="num" style={{ color }}>{fmtIDR(value)}</span>;
  }
  if (tp === 'qty' || tp === 'qtyS' || tp === 'num') {
    const color = tp === 'qtyS' ? (value < 0 ? 'var(--danger)' : value > 0 ? 'var(--success)' : 'var(--fg-muted)') : 'inherit';
    return <span className="num" style={{ color }}>{tp === 'qtyS' && value > 0 ? '+' : ''}{fmtNum(value)}</span>;
  }
  if (tp === 'pct') return <span className="num">{value}%</span>;
  if (tp === 'code') return <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{value}</span>;
  if (tp === 'date') return <span className="mono muted">{value}</span>;
  if (tp === 'email') return <span className="muted">{value}</span>;
  if (tp === 'status') return <span className={`status ${String(value).toLowerCase().replace(/\s+/g, '-')}`}>{value}</span>;
  if (tp === 'ver') return <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{value}</span>;
  return <span>{value}</span>;
};

// ---------------------------------------------------------------------------
// Mock data helpers
// ---------------------------------------------------------------------------

const MOCK_TRX_LINES = [
  { akun: '1-1010.101', nama: 'Kas Besar', dk: 'Debit',  nominal: 4500000 },
  { akun: '4-4010.201', nama: 'Penjualan Barang Jadi', dk: 'Kredit', nominal: 4500000 },
  { akun: '5-5010.301', nama: 'HPP', dk: 'Debit', nominal: 2250000 },
  { akun: '1-1310.101', nama: 'Persediaan Barang Jadi', dk: 'Kredit', nominal: 2250000 },
];

const MOCK_AUDIT = {
  createdAt: '12/03/2026 08:41',
  createdBy: 'Adi Saputra',
  updatedAt: '18/05/2026 14:22',
  updatedBy: 'Fitri Handayani',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const DetailHeader = ({ row, moduleName, moduleId, cols, onNavigate, onOpenTab, t }) => {
  const codeCol = cols?.find((c) => c.t === 'code');
  const statusCol = cols?.find((c) => c.t === 'status');
  const docCode = codeCol ? row[codeCol.k] : null;
  const status = statusCol ? row[statusCol.k] : null;

  const isPending = status && (status === 'Pending' || status === 'Menunggu');

  const handleApprove = useCallback(() => {
    window.confirmAction({
      title: t('Setujui Dokumen'),
      message: t('Yakin ingin menyetujui dokumen ini?'),
      variant: 'success',
      onConfirm: () => window.toast(t('Dokumen disetujui'), { type: 'success' }),
    });
  }, [t]);

  const handleReject = useCallback(() => {
    window.confirmAction({
      title: t('Tolak Dokumen'),
      message: t('Yakin ingin menolak dokumen ini?'),
      variant: 'danger',
      onConfirm: () => window.toast(t('Dokumen ditolak'), { type: 'danger' }),
    });
  }, [t]);

  const handlePrint = useCallback(() => {
    window.toast(t('Mencetak dokumen…'), { type: 'info' });
  }, [t]);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'var(--panel)', borderBottom: '1px solid var(--border)',
      padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    }}>
      <button className="iconbtn" onClick={() => onNavigate(moduleId)} title={t('Kembali')}>
        <Icon name="chevleft" size={16} />
      </button>

      {docCode && (
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
          {docCode}
        </span>
      )}

      <span style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 14 }}>{moduleName}</span>

      {status && (
        <span className={`status ${String(status).toLowerCase().replace(/\s+/g, '-')}`} style={{ marginLeft: 4 }}>
          {status}
        </span>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {isPending && (
          <>
            <button className="btn sm" style={{ background: 'var(--success)', color: '#fff' }} onClick={handleApprove}>
              <Icon name="check" size={12} /> {t('Setujui')}
            </button>
            <button className="btn sm danger" onClick={handleReject}>
              <Icon name="x" size={12} /> {t('Tolak')}
            </button>
          </>
        )}
        <button className="btn sm" onClick={() => (onOpenTab || onNavigate)(`${moduleId}-new`)}>
          <Icon name="edit" size={12} /> {t('Edit')}
        </button>
        <button className="btn sm ghost" onClick={handlePrint}>
          <Icon name="printer" size={12} /> {t('Cetak')}
        </button>
      </div>
    </div>
  );
};

const FieldsGrid = ({ row, cols, t }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px 24px',
    padding: '20px 24px',
  }}>
    {cols.map((col) => (
      <div key={col.k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {col.h}
        </span>
        <span style={{ fontSize: 14, color: 'var(--fg)', wordBreak: 'break-word' }}>
          <FieldValue col={col} value={row[col.k]} />
        </span>
      </div>
    ))}
  </div>
);

const TrxLinesSection = ({ t }) => (
  <div style={{ margin: '0 24px 24px', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
    <div className="drawer-hd" style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
      {t('Rincian Transaksi')}
    </div>
    <table className="table" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>{t('No. Akun')}</th>
          <th>{t('Nama Akun')}</th>
          <th>{t('D/K')}</th>
          <th style={{ textAlign: 'right' }}>{t('Nominal')}</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_TRX_LINES.map((line, i) => (
          <tr key={i}>
            <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{line.akun}</span></td>
            <td>{line.nama}</td>
            <td>
              <span style={{ color: line.dk === 'Debit' ? 'var(--info)' : 'var(--success)', fontWeight: 500 }}>
                {line.dk}
              </span>
            </td>
            <td style={{ textAlign: 'right' }} className="num">{fmtIDR(line.nominal)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AuditSection = ({ t }) => (
  <div style={{ margin: '0 24px 24px', padding: '14px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8 }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: 12 }}>{t('Informasi Tambahan')}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
      {[
        { label: t('Dibuat'), value: MOCK_AUDIT.createdAt },
        { label: t('Dibuat oleh'), value: MOCK_AUDIT.createdBy },
        { label: t('Dimodifikasi'), value: MOCK_AUDIT.updatedAt },
        { label: t('Terakhir diubah oleh'), value: MOCK_AUDIT.updatedBy },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = ({ onNavigate, moduleId, t }) => (
  <div className="cm-empty" style={{ padding: 48, textAlign: 'center' }}>
    <Icon name="file-x" size={40} />
    <p style={{ color: 'var(--fg-muted)', margin: '12px 0 20px' }}>{t('Tidak ada data yang dipilih')}</p>
    <button className="btn" onClick={() => onNavigate(moduleId)}>
      <Icon name="chevleft" size={13} /> {t('Kembali ke daftar')}
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const DetailPage = ({ moduleId, t, onNavigate, onOpenTab }) => {
  const [row, setRow] = useState(() => window.__viewRow || null);

  useEffect(() => {
    setRow(window.__viewRow || null);
  }, [moduleId]);

  const mod = window.REGISTRY?.[moduleId] || window.MODULES?.[moduleId] || null;
  const moduleName = mod?.label || moduleId;
  const cols = mod?.cols || [];
  const isTrx = Boolean(window.MODULES?.[moduleId] || window.TRX_CFG?.[moduleId]);

  if (!row) {
    return <EmptyState onNavigate={onNavigate} moduleId={moduleId} t={t} />;
  }

  return (
    <div style={{ minHeight: '100%', background: 'var(--panel)', display: 'flex', flexDirection: 'column' }}>
      <DetailHeader
        row={row}
        moduleName={moduleName}
        moduleId={moduleId}
        cols={cols}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
        t={t}
      />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <FieldsGrid row={row} cols={cols} t={t} />
        </div>

        <div style={{ paddingTop: 20 }}>
          {isTrx ? (
            <TrxLinesSection t={t} />
          ) : (
            <AuditSection t={t} />
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { DetailPage });
