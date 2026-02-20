import { Badge } from '@/components/ui/badge';
import { type DeliveryOrderForm } from '@/features/logistic-transaction/model/types';
import { addDays } from '@/features/logistic-transaction/model/utils';

type LogisticTransactionSummary = {
  itemTypeCount: number;
  totalBatch: number;
  totalPcs: number;
  totalKg: number;
};

type LogisticTransactionSummaryPanelsProps = {
  form: DeliveryOrderForm;
  summary: LogisticTransactionSummary;
};

export function LogisticTransactionSummaryPanels({ form, summary }: LogisticTransactionSummaryPanelsProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border p-5">
        <h3 className="mb-3 text-base font-semibold">SLA & KPI Preview</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span>STD Lead Time (Hari)</span>
            <span className="font-medium">{`${form.stdLeadTimeDays || '0'} hari`}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>SSTD Return DO (Hari)</span>
            <span className="font-medium">{`${form.stdReturnDoDays || '0'} hari`}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>Standard Barang Diterima</span>
            <span className="font-medium">{addDays(form.doDate, form.stdLeadTimeDays)}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>STD DO Kembali</span>
            <span className="font-medium">{addDays(form.doDate, form.stdReturnDoDays)}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>KPI 1 Ketepatan Pengiriman</span>
            <Badge variant="secondary">Auto by system</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>KPI 2 Ketepatan DO Kembali</span>
            <Badge variant="secondary">Auto by system</Badge>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-5">
        <h3 className="mb-3 text-base font-semibold">Ringkasan Barang</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span>Total Jenis Barang</span>
            <span className="font-semibold">{summary.itemTypeCount}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>Total Batch</span>
            <span className="font-semibold">{summary.totalBatch}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>Total PCS</span>
            <span className="font-semibold">{summary.totalPcs.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total KG</span>
            <span className="font-semibold">{summary.totalKg.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
