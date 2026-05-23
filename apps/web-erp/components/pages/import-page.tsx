'use client';

/**
 * Admin — Import Data page.
 * Frontend-only: entity selector + file upload + template download.
 * Backend import endpoint not yet implemented.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { notify } from '@/lib/feedback';

// ─── Constants ────────────────────────────────────────────────────────────────

const IMPORT_ENTITIES = [
  { value: 'items', label: 'Barang (Items)' },
  { value: 'partners', label: 'Partner / Kontak' },
  { value: 'units', label: 'Satuan (Units)' },
  { value: 'currencies', label: 'Mata Uang' },
  { value: 'payment-terms', label: 'Termin Pembayaran' },
  { value: 'item-categories', label: 'Kategori Barang' },
  { value: 'accounts', label: 'Akun (Chart of Accounts)' },
  { value: 'taxes', label: 'Pajak' },
  { value: 'warehouses', label: 'Gudang' },
  { value: 'branches', label: 'Cabang' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpImportPage() {
  const [entity, setEntity] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const selectedLabel = IMPORT_ENTITIES.find((e) => e.value === entity)?.label ?? '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus(null);
  };

  const handleImport = () => {
    if (!entity) {
      notify('Pilih entitas terlebih dahulu', 'warn');
      return;
    }
    if (!file) {
      notify('Pilih file untuk diimport', 'warn');
      return;
    }
    notify('Fitur import belum tersedia — backend endpoint belum diimplementasi', 'info');
    setStatus(`Siap import: ${file.name} → ${selectedLabel}`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: 640 }}>
      <h2 style={{ marginBottom: 20, fontSize: 'calc(15px * var(--font-scale, 1))' }}>
        Import Data
      </h2>

      <div className="lines">
        {/* Entity selector */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="imp-entity"
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 'calc(12.5px * var(--font-scale, 1))',
              color: 'var(--fg)',
            }}
          >
            Entitas
          </label>
          <select
            id="imp-entity"
            value={entity}
            onChange={(e) => { setEntity(e.target.value); setStatus(null); }}
            style={{
              height: 26,
              width: '100%',
              maxWidth: 360,
              fontSize: 'calc(12.5px * var(--font-scale, 1))',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--fg)',
              padding: '0 8px',
              cursor: 'pointer',
            }}
          >
            <option value="">— Pilih entitas —</option>
            {IMPORT_ENTITIES.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* File upload */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="imp-file"
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 'calc(12.5px * var(--font-scale, 1))',
              color: 'var(--fg)',
            }}
          >
            File (.csv, .xlsx)
          </label>
          <input
            id="imp-file"
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            style={{
              fontSize: 'calc(12.5px * var(--font-scale, 1))',
              color: 'var(--fg)',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Template download link */}
        {entity && (
          <div style={{ marginBottom: 16 }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); notify('Template CSV belum tersedia — akan ditambahkan bersama endpoint import', 'info'); }}
              style={{
                fontSize: 'calc(12.5px * var(--font-scale, 1))',
                color: 'var(--primary)',
                cursor: 'pointer',
              }}
            >
              Download Template CSV — {selectedLabel}
            </a>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn primary" onClick={handleImport}>
            Import
          </button>
          <button
            className="btn ghost"
            onClick={() => { setEntity(''); setFile(null); setStatus(null); }}
          >
            Reset
          </button>
        </div>

        {/* Status area */}
        {status && (
          <div
            style={{
              marginTop: 20,
              padding: '10px 14px',
              background: 'var(--bg-hover)',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 'calc(12px * var(--font-scale, 1))',
              color: 'var(--fg-subtle)',
            }}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
