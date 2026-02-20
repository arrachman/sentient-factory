import { ArrowLeft, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import {
  AutocompleteSelect,
  type AutocompleteSelectOption,
} from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  type InboundBatchForm,
  type InboundDetailForm,
  type InboundForm,
  type ItemOption,
  type SupplierOption,
  type WarehouseOption,
  REQUIRED_FIELD_CLASS,
  REQUIRED_SELECT_TRIGGER_CLASS,
} from '@/features/logistic-inbound/model/types';
import { pickEntityId } from '@/features/logistic-inbound/model/utils';
import { LogisticInboundItemModal } from '@/features/logistic-inbound/ui/logistic-inbound-item-modal';

type LogisticInboundFormProps = {
  form: InboundForm;
  suppliers: SupplierOption[];
  warehouses: WarehouseOption[];
  itemOptions: ItemOption[];
  itemOptionMap: Map<string, ItemOption>;
  detailSummary: {
    totalItemTypes: number;
    totalBatch: number;
    totalQty: number;
  };
  currentUserId: string;
  isAdminRole: boolean;
  lockedWarehouseId: string;
  editingUuid: string | null;
  submitting: boolean;
  loadingOptions: boolean;
  isItemModalOpen: boolean;
  editingDetailIndex: number | null;
  draftDetail: InboundDetailForm;
  draftItemTotalQty: number;
  itemModalError: string;
  onFormChange: (next: InboundForm) => void;
  onSubmit: () => void;
  onBack: () => void;
  onOpenAddItemModal: () => void;
  onOpenEditItemModal: (index: number) => void;
  onRemoveDetailRow: (index: number) => void;
  onSetDraftField: (key: keyof InboundDetailForm, value: string) => void;
  onSetDraftBatchField: (batchIndex: number, key: keyof InboundBatchForm, value: string) => void;
  onAddDraftBatchRow: () => void;
  onRemoveDraftBatchRow: (batchIndex: number) => void;
  onCloseItemModal: () => void;
  onSaveDraftItem: () => void;
};

export function LogisticInboundForm({
  form,
  suppliers,
  warehouses,
  itemOptions,
  itemOptionMap,
  detailSummary,
  currentUserId,
  isAdminRole,
  lockedWarehouseId,
  editingUuid,
  submitting,
  loadingOptions,
  isItemModalOpen,
  editingDetailIndex,
  draftDetail,
  draftItemTotalQty,
  itemModalError,
  onFormChange,
  onSubmit,
  onBack,
  onOpenAddItemModal,
  onOpenEditItemModal,
  onRemoveDetailRow,
  onSetDraftField,
  onSetDraftBatchField,
  onAddDraftBatchRow,
  onRemoveDraftBatchRow,
  onCloseItemModal,
  onSaveDraftItem,
}: LogisticInboundFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-lg border p-5">
            <p className="mb-4 text-xs text-muted-foreground">Field dengan border biru wajib diisi.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Transaction No</Label>
                <Input
                  value={form.transactionNo}
                  onChange={(e) => onFormChange({ ...form, transactionNo: e.target.value })}
                  placeholder="Auto-generate jika kosong"
                />
              </div>
              <div className="space-y-2">
                <Label>Transaction Date</Label>
                <Input
                  type="date"
                  value={form.transactionDate}
                  onChange={(e) => onFormChange({ ...form, transactionDate: e.target.value })}
                  required
                  className={REQUIRED_FIELD_CLASS}
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <AutocompleteSelect
                  value={form.supplierId}
                  onValueChange={(value) => onFormChange({ ...form, supplierId: value })}
                  options={suppliers.flatMap<AutocompleteSelectOption>((supplier) => {
                    const value = pickEntityId(supplier);
                    if (!value) {
                      return [];
                    }
                    return {
                      value,
                      label: String(supplier.name ?? ''),
                      keywords: supplier.code,
                    };
                  })}
                  placeholder="Select supplier"
                  searchPlaceholder="Search supplier..."
                  emptyText="No supplier found."
                  required
                  triggerClassName={REQUIRED_SELECT_TRIGGER_CLASS}
                />
              </div>
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <AutocompleteSelect
                  value={form.warehouseId}
                  onValueChange={(value) => onFormChange({ ...form, warehouseId: value })}
                  options={warehouses.flatMap<AutocompleteSelectOption>((warehouse) => {
                    const value = pickEntityId(warehouse);
                    if (!value) {
                      return [];
                    }
                    const warehouseName = String(warehouse.name ?? '');
                    const cityName = warehouse.city?.name ? String(warehouse.city.name) : '';
                    return {
                      value,
                      label: `${warehouseName}${cityName ? ` - ${cityName}` : ''}`,
                      keywords: warehouse.locationName || undefined,
                    };
                  })}
                  placeholder="Select warehouse"
                  searchPlaceholder="Search warehouse..."
                  emptyText="No warehouse found."
                  disabled={!isAdminRole}
                  required
                  triggerClassName={REQUIRED_SELECT_TRIGGER_CLASS}
                />
                {!isAdminRole && lockedWarehouseId ? (
                  <p className="text-xs text-muted-foreground">Warehouse dikunci berdasarkan user login ({currentUserId}).</p>
                ) : null}
              </div>
              <input type="hidden" value={form.status} readOnly />
              <div className="space-y-2 md:col-span-2">
                <Label>Catatan</Label>
                <Textarea value={form.notes} onChange={(e) => onFormChange({ ...form, notes: e.target.value })} rows={2} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-5">
            <h3 className="mb-3 text-base font-semibold">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item Types</span>
                <span className="font-medium">{detailSummary.totalItemTypes}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Batch</span>
                <span className="font-medium">{detailSummary.totalBatch}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Qty</span>
                <span className="font-medium">{detailSummary.totalQty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Item List</h3>
          <Button type="button" variant="outline" size="sm" onClick={onOpenAddItemModal}>
            <Plus />
            Add Item
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">No</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead className="text-right">Total Batch</TableHead>
              <TableHead className="text-right">Total Qty</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.details.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  Belum ada item. Klik Add Item untuk mulai input batch.
                </TableCell>
              </TableRow>
            ) : (
              form.details.map((detail, detailIndex) => {
                const item = itemOptionMap.get(detail.itemId);
                const detailQty = detail.batches.reduce((sum, batch) => sum + (Number(batch.qty || 0) || 0), 0);

                return (
                  <TableRow key={`detail-${detailIndex}`}>
                    <TableCell>{detailIndex + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item?.name || '-'}</div>
                      <div className="text-xs text-muted-foreground">{item?.code || detail.itemId || '-'}</div>
                    </TableCell>
                    <TableCell>{item?.uom?.name || item?.uom?.code || '-'}</TableCell>
                    <TableCell className="text-right">{detail.batches.length}</TableCell>
                    <TableCell className="text-right">{detailQty}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{detail.notes || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="icon" aria-label="Edit item" onClick={() => onOpenEditItemModal(detailIndex)}>
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          aria-label="Remove item"
                          onClick={() => onRemoveDetailRow(detailIndex)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border p-5">
        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft />
            Back to List
          </Button>
          <Button type="submit" disabled={submitting || loadingOptions}>
            <Save />
            {submitting ? 'Saving...' : editingUuid ? 'Update Inbound' : 'Create Inbound'}
          </Button>
        </div>
      </div>

      <LogisticInboundItemModal
        open={isItemModalOpen}
        editingDetailIndex={editingDetailIndex}
        draftDetail={draftDetail}
        draftItemTotalQty={draftItemTotalQty}
        itemModalError={itemModalError}
        itemOptions={itemOptions}
        onSetDraftField={onSetDraftField}
        onSetDraftBatchField={onSetDraftBatchField}
        onAddDraftBatchRow={onAddDraftBatchRow}
        onRemoveDraftBatchRow={onRemoveDraftBatchRow}
        onCancel={onCloseItemModal}
        onSave={onSaveDraftItem}
      />
    </form>
  );
}
