'use client';

/**
 * Shared layout shell for ERP CRUD list pages (F2 Admin + F3 Master Data).
 * Provides: page-header with search + "Tambah" button, optional toolbar slot,
 * content area, and a loading/error state overlay.
 *
 * Atomic tier: Organism (composition of atoms + molecules).
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';

interface ErpListLayoutProps {
  title: string;
  code: string;
  loading?: boolean;
  error?: string | null;
  search: string;
  onSearch: (q: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  addLabel?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export function ErpListLayout({
  title,
  code,
  loading,
  error,
  search,
  onSearch,
  onAdd,
  onRefresh,
  addLabel = 'Tambah',
  toolbar,
  children,
}: ErpListLayoutProps) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          {title}
          <span className="code-tag">{code}</span>
        </h1>
        <div className="page-actions">
          <div className="search-input">
            <Icon name="search" size={12} />
            <input
              placeholder="Cari semua..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className="btn" onClick={onRefresh} title="Muat ulang">
            <Icon name="refresh" size={12} />
          </button>
          <button className="btn primary" onClick={onAdd}>
            <Icon name="plus" size={12} /> {addLabel}
          </button>
        </div>
      </div>

      {toolbar && <div className="toolbar">{toolbar}</div>}

      {error && (
        <div className="p-4 text-xs text-danger">
          Gagal memuat data: {error}
        </div>
      )}

      {loading && !error && (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Memuat...
        </div>
      )}

      {!loading && !error && children}
    </div>
  );
}
