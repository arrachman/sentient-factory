'use client';

import { Eye, TrendingUp, Plus, Download } from 'lucide-react';
import { Sparkline } from '@/components/atoms/sparkline';
import type { Translator } from '@/lib/i18n';

const PREVIEW_SERIES = [42, 48, 45, 53, 49, 58, 61, 57, 64, 68];

/** Static "Pratinjau Langsung" card — reflects live tweaks via CSS vars. */
export function LivePreviewCard({ t }: { t: Translator }) {
  return (
    <div className="card" style={{ gridColumn: 'span 12' }}>
      <div className="card-h">
        <span
          style={{
            display: 'inline-flex',
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--primary-soft)',
            color: 'var(--primary-soft-fg)',
            borderRadius: 5,
          }}
        >
          <Eye size={13} />
        </span>
        <div>
          <div className="title">{t('Pratinjau Langsung')}</div>
          <div className="sub" style={{ marginTop: 1 }}>
            {t('Perubahan diterapkan seketika')}
          </div>
        </div>
      </div>
      <div
        className="card-b"
        style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}
      >
        <div
          style={{
            flex: '1 1 220px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <div className="kpi" style={{ padding: 0 }}>
            <div className="label">{t('Output bulan ini')}</div>
            <div className="value">12.480 pcs</div>
            <div className="delta up">
              <TrendingUp size={11} /> +9,2%
            </div>
            <div className="spark">
              <Sparkline data={PREVIEW_SERIES} color="var(--primary)" />
            </div>
          </div>
        </div>
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn primary">
              <Plus size={12} /> {t('Tambah')}
            </button>
            <button type="button" className="btn">
              <Download size={12} /> {t('Export')}
            </button>
            <button type="button" className="btn ghost">
              {t('Batal')}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="pill success">
              <span className="dot" />
              Completed
            </span>
            <span className="pill warn">
              <span className="dot" />
              In Progress
            </span>
            <span className="pill primary">
              <span className="dot" />
              Released
            </span>
          </div>
          <table className="tbl" style={{ border: '1px solid var(--border)', borderRadius: 8 }}>
            <thead>
              <tr>
                <th>{t('No')}</th>
                <th>{t('Nama')}</th>
                <th className="col-num">{t('Total')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">PO-2606-0042</td>
                <td>Line A · Shift 1</td>
                <td className="num">4.250</td>
              </tr>
              <tr className="selected">
                <td className="mono">PO-2606-0041</td>
                <td>Line B · Shift 2</td>
                <td className="num">1.875</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
