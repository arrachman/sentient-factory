import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type DeliveryOrderDetailForm, type ItemOption } from '@/features/logistic-transaction/model/types';

type LogisticTransactionItemListPanelProps = {
  details: DeliveryOrderDetailForm[];
  itemOptionMap: Map<string, ItemOption>;
  getAutoQtyPcs: (itemId: string, batchNumbers: string[], batchQtyMap: Record<string, string>) => string;
  onAddItem: () => void;
  onEditItem: (index: number) => void;
  onRemoveItem: (index: number) => void;
};

export function LogisticTransactionItemListPanel({
  details,
  itemOptionMap,
  getAutoQtyPcs,
  onAddItem,
  onEditItem,
  onRemoveItem,
}: LogisticTransactionItemListPanelProps) {
  return (
    <div className="rounded-lg border p-5 xl:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Item List</h3>
        <Button type="button" variant="outline" onClick={onAddItem}>
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
            <TableHead className="text-right">Qty PCS</TableHead>
            <TableHead className="text-right">Qty KG</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-muted-foreground">
                Belum ada item. Klik + Add Item untuk mulai input outbound.
              </TableCell>
            </TableRow>
          ) : (
            details.map((detail, index) => {
              const item = itemOptionMap.get(detail.itemId);
              const totalQtyPcs = Number(getAutoQtyPcs(detail.itemId, detail.batchNumbers, detail.batchQtyMap) || 0);
              return (
                <TableRow key={`${index}-${detail.itemId}-${detail.batchNumbers.join('|')}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item?.name || '-'}</div>
                    <div className="text-xs text-muted-foreground">{item?.code || detail.itemId || '-'}</div>
                  </TableCell>
                  <TableCell>{item?.uom?.name || item?.uom?.code || '-'}</TableCell>
                  <TableCell className="text-right">{detail.batchNumbers.length}</TableCell>
                  <TableCell className="text-right">{(Number.isFinite(totalQtyPcs) ? totalQtyPcs : 0).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">{(Number(detail.qtyKg || 0) || 0).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{detail.notes || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="icon" aria-label="Edit item" onClick={() => onEditItem(index)}>
                        <Pencil />
                      </Button>
                      <Button type="button" variant="destructive" size="icon" aria-label="Remove item" onClick={() => onRemoveItem(index)}>
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
  );
}
