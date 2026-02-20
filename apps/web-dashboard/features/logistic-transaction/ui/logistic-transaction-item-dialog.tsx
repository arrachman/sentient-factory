import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BatchMultiSelect, type BatchOption } from '@/features/logistic-transaction/ui/batch-multi-select';
import {
  type DeliveryOrderDetailForm,
  type ItemOption,
} from '@/features/logistic-transaction/model/types';
import { pickEntityId, toEntityId } from '@/features/logistic-transaction/model/utils';

type LogisticTransactionItemDialogProps = {
  open: boolean;
  editingDetailIndex: number | null;
  draftDetail: DeliveryOrderDetailForm;
  draftItemId: string;
  draftItemTotalPcs: number;
  itemModalError: string;
  itemOptions: ItemOption[];
  formDetails: DeliveryOrderDetailForm[];
  batchOptionsByItemId: Record<string, BatchOption[]>;
  onClose: () => void;
  onSave: () => void;
  onSetDraftItemId: (value: string) => void;
  onSetDraftField: (key: 'qtyKg' | 'notes', value: string) => void;
  onSetDraftBatchNumbers: (batchNumbers: string[]) => void;
  onSetDraftBatchQty: (batchNumber: string, value: string) => void;
  getBatchQtyPcs: (itemId: string, batchNumber: string) => number;
  getSelectedBatchQtyPcs: (
    itemId: string,
    batchNumber: string,
    batchQtyMap: Record<string, string>,
  ) => number;
};

export function LogisticTransactionItemDialog({
  open,
  editingDetailIndex,
  draftDetail,
  draftItemId,
  draftItemTotalPcs,
  itemModalError,
  itemOptions,
  formDetails,
  batchOptionsByItemId,
  onClose,
  onSave,
  onSetDraftItemId,
  onSetDraftField,
  onSetDraftBatchNumbers,
  onSetDraftBatchQty,
  getBatchQtyPcs,
  getSelectedBatchQtyPcs,
}: LogisticTransactionItemDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-[980px] p-0">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle>
            {editingDetailIndex == null ? 'Tambah Item' : 'Edit Item'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Item</Label>
              <AutocompleteSelect
                value={draftDetail.itemId}
                onValueChange={onSetDraftItemId}
                options={itemOptions.flatMap((item) => {
                  const value = pickEntityId(item);
                  if (!value) {
                    return [];
                  }
                  const code = String(item.code ?? '');
                  const name = String(item.name ?? '');
                  const uomCode = String(item.uom?.code ?? '');
                  return {
                    value,
                    label: `${code} - ${name}${uomCode ? ` (UOM: ${uomCode})` : ''}`,
                  };
                })}
                placeholder="Select item"
                searchPlaceholder="Search item..."
                emptyText="No item found."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Qty KG</Label>
              <Input
                type="number"
                min={0.001}
                step="0.001"
                value={draftDetail.qtyKg}
                onChange={(e) => onSetDraftField('qtyKg', e.target.value)}
                placeholder="Contoh: 150.5"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Batch</Label>
            <BatchMultiSelect
              value={draftDetail.batchNumbers}
              onChange={onSetDraftBatchNumbers}
              options={(batchOptionsByItemId[draftItemId] || []).map((option) => {
                const taken = formDetails.some(
                  (row, rowIndex) =>
                    rowIndex !== editingDetailIndex &&
                    toEntityId(row.itemId) === draftItemId &&
                    row.batchNumbers.includes(option.batchNumber),
                );
                return {
                  ...option,
                  disabled: taken || option.qtyPcs <= 0,
                };
              })}
              placeholder={draftItemId ? 'Select batch(es)' : 'Select item first'}
              searchPlaceholder="Search batch..."
              emptyText={draftItemId ? 'No batch found for this item.' : 'Select item first.'}
              disabled={!draftItemId}
              required
            />
          </div>

          {draftDetail.batchNumbers.length > 0 ? (
            <div className="rounded-md border">
              <div className="border-b px-3 py-2 text-sm font-medium">
                Selected Batches
              </div>
              <div className="space-y-2 p-3">
                {draftDetail.batchNumbers.map((batchNumber) => {
                  const maxQtyPcs = getBatchQtyPcs(draftDetail.itemId, batchNumber);
                  const qtyPcs = getSelectedBatchQtyPcs(
                    draftDetail.itemId,
                    batchNumber,
                    draftDetail.batchQtyMap,
                  );
                  const rawQtyPcs = draftDetail.batchQtyMap[batchNumber] ?? '';
                  return (
                    <div key={`${draftDetail.itemId}-${batchNumber}`} className="grid gap-2 md:grid-cols-[1fr_170px]">
                      <div className="flex items-center text-sm">{batchNumber}</div>
                      <Input
                        type="number"
                        min={1}
                        max={maxQtyPcs}
                        step={1}
                        value={rawQtyPcs}
                        onChange={(e) => onSetDraftBatchQty(batchNumber, e.target.value)}
                        className="text-right"
                      />
                      <div className="md:col-span-2 text-xs text-muted-foreground">
                        {qtyPcs.toLocaleString('id-ID')} pcs dipakai (max {maxQtyPcs.toLocaleString('id-ID')} pcs)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={draftDetail.notes}
              onChange={(e) => onSetDraftField('notes', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
            <span>Total Qty Item (PCS)</span>
            <span className="font-semibold">{draftItemTotalPcs.toLocaleString('id-ID')}</span>
          </div>

          {itemModalError ? <p className="text-sm text-destructive">{itemModalError}</p> : null}

          <DialogFooter className="pt-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave}>
              {editingDetailIndex == null ? 'Simpan/Add Item' : 'Update Item'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
