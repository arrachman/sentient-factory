'use client';

import { Banknote, Receipt, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Payment } from '../../api/booking.api';
import { PAYMENT_STATUS_LABEL, rp } from './format';
import { DetailRow } from './detail-row';

/**
 * Tab "Pembayaran" — payment summary, record DP/sisa, download PDF, kirim WA.
 */
export function BookingPaymentTab({
  isLoading,
  payment,
  paidAmount,
  setPaidAmount,
  paymentMethod,
  setPaymentMethod,
  creating,
  recording,
  sending,
  onCreatePayment,
  onRecordPayment,
  onSendReceipt,
}: {
  isLoading: boolean;
  payment: Payment | undefined;
  paidAmount: string;
  setPaidAmount: (next: string) => void;
  paymentMethod: string;
  setPaymentMethod: (next: string) => void;
  creating: boolean;
  recording: boolean;
  sending: boolean;
  onCreatePayment: () => void;
  onRecordPayment: (amount: number, method: string) => void;
  onSendReceipt: (paymentId: number) => void;
}) {
  if (isLoading) return <div className="caption">Memuat...</div>;

  if (!payment) {
    return (
      <div className="card-althea p-4 text-center bg-cream-50 space-y-2">
        <div className="caption text-fg-muted">
          Belum ada record pembayaran untuk booking ini.
        </div>
        <button
          type="button"
          onClick={onCreatePayment}
          disabled={creating}
          className="btn btn-primary btn-sm"
        >
          Buat Record Pembayaran (auto DP 50% + PPN 11%)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PaymentSummaryGrid payment={payment} />
      {payment.status !== 'lunas' && payment.status !== 'refunded' ? (
        <PaymentRecorder
          payment={payment}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          recording={recording}
          onRecord={() => {
            const amount = Number(paidAmount);
            if (!amount || amount <= 0) {
              toast.error('Nominal harus > 0');
              return;
            }
            onRecordPayment(amount, paymentMethod);
          }}
        />
      ) : null}
      <PaymentDocActions
        paymentId={payment.id}
        sending={sending}
        onSendReceipt={onSendReceipt}
      />
    </div>
  );
}

function PaymentSummaryGrid({ payment }: { payment: Payment }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <DetailRow
        label="Status"
        value={
          <span className="badge badge-sage">
            {PAYMENT_STATUS_LABEL[payment.status] || payment.status}
          </span>
        }
      />
      <DetailRow label="Total" value={rp(payment.totalAmount)} />
      <DetailRow label="PPN" value={rp(payment.taxAmount)} />
      <DetailRow label="DP" value={rp(payment.dpAmount)} />
      <DetailRow
        label="Dibayar"
        value={
          <span className="font-medium text-success">
            {rp(payment.paidAmount)}
          </span>
        }
      />
      <DetailRow
        label="Sisa"
        value={rp(
          Number(payment.totalAmount) - Number(payment.paidAmount),
        )}
      />
    </div>
  );
}

function PaymentRecorder({
  payment,
  paidAmount,
  setPaidAmount,
  paymentMethod,
  setPaymentMethod,
  recording,
  onRecord,
}: {
  payment: Payment;
  paidAmount: string;
  setPaidAmount: (next: string) => void;
  paymentMethod: string;
  setPaymentMethod: (next: string) => void;
  recording: boolean;
  onRecord: () => void;
}) {
  return (
    <div className="card-althea p-3 bg-cream-50 space-y-2">
      <div className="caption font-medium">Record Pembayaran</div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min={0}
          placeholder="Nominal (Rp)"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
          className="input-althea"
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="input-althea"
        >
          <option value="cash">Cash</option>
          <option value="transfer">Transfer</option>
          <option value="qris">QRIS</option>
          <option value="card">Kartu</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRecord}
          disabled={recording}
          className="btn btn-primary btn-sm"
        >
          <Banknote className="h-3.5 w-3.5" /> Record
        </button>
        <button
          type="button"
          onClick={() =>
            setPaidAmount(String(Number(payment.dpAmount)))
          }
          className="btn btn-outline btn-sm"
        >
          Isi DP
        </button>
        <button
          type="button"
          onClick={() =>
            setPaidAmount(
              String(
                Number(payment.totalAmount) - Number(payment.paidAmount),
              ),
            )
          }
          className="btn btn-outline btn-sm"
        >
          Isi Sisa
        </button>
      </div>
    </div>
  );
}

function PaymentDocActions({
  paymentId,
  sending,
  onSendReceipt,
}: {
  paymentId: number;
  sending: boolean;
  onSendReceipt: (paymentId: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-border pt-3">
      <a
        href={`/api/clinic/payment/${paymentId}/receipt.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline btn-sm"
      >
        <Receipt className="h-3.5 w-3.5" /> Download PDF
      </a>
      <button
        type="button"
        onClick={() => onSendReceipt(paymentId)}
        disabled={sending}
        className="btn btn-outline btn-sm"
      >
        <Send className="h-3.5 w-3.5" /> Kirim Receipt via WA
      </button>
    </div>
  );
}
