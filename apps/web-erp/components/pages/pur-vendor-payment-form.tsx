'use client';

/**
 * Vendor Payment (VP) / Payment Schedule (VPP) — thin wrapper.
 * These payment documents reuse the `fin_ap_payments` endpoint (Finance domain)
 * and the shared Finance AP payment form. The purchasing sidebar links to these
 * routes; the actual form organism (fin_ap_payments CRUD) is built in the Finance
 * module. This wrapper shows a "coming soon" until that form is wired here.
 *
 * transactionCode "PUR.VP" / "PUR.VPP" for Form Builder config loading.
 */

import * as React from 'react';

export function PurVendorPaymentForm({
  transactionCode,
  onBack,
}: {
  transactionCode: 'PUR.VP' | 'PUR.VPP';
  onBack: () => void;
}) {
  const title = transactionCode === 'PUR.VP' ? 'Pembayaran Vendor (VP)' : 'Jadwal Pembayaran (VPP)';
  return (
    <div className="p-8 text-center text-muted">
      <div className="text-lg font-medium mb-2">Form {title} — coming soon</div>
      <div className="text-sm">Form ini me-reuse modul Pembayaran AP dari Finance. Integrasi sedang disiapkan.</div>
      <button className="btn mt-4" onClick={onBack}>← Kembali ke daftar</button>
    </div>
  );
}
