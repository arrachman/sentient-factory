import {
  AutocompleteSelect,
  type AutocompleteSelectOption,
} from '@/components/ui/autocomplete-select';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import type { InboundDetailForm, ItemOption } from '@/features/logistic-inbound/model/types';
import {
  REQUIRED_FIELD_CLASS,
  REQUIRED_SELECT_TRIGGER_CLASS,
} from '@/features/logistic-inbound/model/types';
import { pickEntityId } from '@/features/logistic-inbound/model/utils';

type LogisticInboundItemModalProps = {
  open: boolean;
  editingDetailIndex: number | null;
  draftDetail: InboundDetailForm;
  draftItemTotalQty: number;
  itemModalError: string;
  itemOptions: ItemOption[];
  onSetDraftField: (key: keyof InboundDetailForm, value: string) => void;
  onSetDraftBatchField: (
    batchIndex: number,
    key: keyof InboundDetailForm['batches'][number],
    value: string,
  ) => void;
  onAddDraftBatchRow: () => void;
  onRemoveDraftBatchRow: (batchIndex: number) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function LogisticInboundItemModal({
  open,
  editingDetailIndex,
  draftDetail,
  draftItemTotalQty,
  itemModalError,
  itemOptions,
  onSetDraftField,
  onSetDraftBatchField,
  onAddDraftBatchRow,
  onRemoveDraftBatchRow,
  onCancel,
  onSave,
}: LogisticInboundItemModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent className="max-w-[1100px] p-0">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle>{editingDetailIndex == null ? 'Tambah Item' : 'Edit Item'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Item</Label>
              <AutocompleteSelect
                value={draftDetail.itemId}
                onValueChange={(value) => onSetDraftField('itemId', value)}
                options={itemOptions.flatMap<AutocompleteSelectOption>((item) => {
                  const value = pickEntityId(item);
                  if (!value) {
                    return [];
                  }
                  const code = String(item.code ?? '');
                  const name = String(item.name ?? '');
                  return {
                    value,
                    label: `${code} - ${name}`,
                    keywords: `${item.uom?.name ?? ''} ${item.uom?.code ?? ''}`,
                  };
                })}
                placeholder="Select item"
                searchPlaceholder="Search item..."
                emptyText="No item found."
                required
                triggerClassName={REQUIRED_SELECT_TRIGGER_CLASS}
              />
            </div>
            <div className="space-y-2">
              <Label>Catatan Item</Label>
              <Input
                value={draftDetail.notes}
                onChange={(e) => onSetDraftField('notes', e.target.value)}
                placeholder="Catatan item"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <p className="text-sm font-medium">Batch Rows</p>
              <Button type="button" variant="outline" size="sm" onClick={onAddDraftBatchRow}>
                <Plus />
                + Add Batch
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead className="w-[160px]">Qty</TableHead>
                  <TableHead className="w-[180px]">Exp Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[72px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftDetail.batches.map((batch, batchIndex) => (
                  <TableRow key={`draft-batch-${batchIndex}`}>
                    <TableCell>
                      <Input
                        placeholder="Batch number"
                        value={batch.batchIn}
                        onChange={(e) => onSetDraftBatchField(batchIndex, 'batchIn', e.target.value)}
                        className={REQUIRED_FIELD_CLASS}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Qty"
                        value={batch.qty}
                        onChange={(e) => onSetDraftBatchField(batchIndex, 'qty', e.target.value)}
                        className={REQUIRED_FIELD_CLASS}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={batch.expiredDate}
                        onChange={(e) => onSetDraftBatchField(batchIndex, 'expiredDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Catatan batch"
                        value={batch.notes}
                        onChange={(e) => onSetDraftBatchField(batchIndex, 'notes', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="destructive" size="icon" onClick={() => onRemoveDraftBatchRow(batchIndex)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
            <span>Total Qty Item</span>
            <span className="font-semibold">{draftItemTotalQty}</span>
          </div>

          {itemModalError ? <p className="text-sm text-destructive">{itemModalError}</p> : null}

          <DialogFooter className="pt-0">
            <Button type="button" variant="outline" onClick={onCancel}>
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
