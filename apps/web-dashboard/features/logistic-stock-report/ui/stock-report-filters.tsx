import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { FilterState, ItemOption, SupplierOption, WarehouseOption } from '@/features/logistic-stock-report/model/types';
import { toItemSelectOptions, toSupplierSelectOptions, toWarehouseSelectOptions } from '@/features/logistic-stock-report/model/utils';

type StockReportFiltersProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  warehouses: WarehouseOption[];
  suppliers: SupplierOption[];
  items: ItemOption[];
  loading: boolean;
  loadingOptions: boolean;
  isAdminRole: boolean;
  lockedWarehouseId: string;
  onShowData: () => void;
  onReset: () => void;
};

export function StockReportFilters({
  filters,
  onChange,
  warehouses,
  suppliers,
  items,
  loading,
  loadingOptions,
  isAdminRole,
  lockedWarehouseId,
  onShowData,
  onReset,
}: StockReportFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-5 md:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Warehouse</Label>
          <AutocompleteSelect
            value={filters.warehouseId}
            onValueChange={(value) => onChange({ ...filters, warehouseId: value })}
            options={toWarehouseSelectOptions(warehouses)}
            placeholder={loadingOptions ? 'Loading...' : 'All warehouses'}
            searchPlaceholder="Search warehouse..."
            emptyText="No warehouse found"
            disabled={loadingOptions || (!isAdminRole && Boolean(lockedWarehouseId))}
          />
          {!isAdminRole && lockedWarehouseId ? (
            <p className="text-xs text-muted-foreground">Warehouse dikunci berdasarkan user login.</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Supplier</Label>
          <AutocompleteSelect
            value={filters.supplierId}
            onValueChange={(value) => onChange({ ...filters, supplierId: value })}
            options={toSupplierSelectOptions(suppliers)}
            placeholder={loadingOptions ? 'Loading...' : 'All suppliers'}
            searchPlaceholder="Search supplier..."
            emptyText="No supplier found"
            disabled={loadingOptions}
          />
        </div>

        <div className="space-y-2">
          <Label>Item</Label>
          <AutocompleteSelect
            value={filters.itemId}
            onValueChange={(value) => onChange({ ...filters, itemId: value })}
            options={toItemSelectOptions(items)}
            placeholder={loadingOptions ? 'Loading...' : 'All items'}
            searchPlaceholder="Search item..."
            emptyText="No item found"
            disabled={loadingOptions}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button type="button" onClick={onShowData} disabled={loading}>
          Show Data
        </Button>
        <Button type="button" variant="outline" onClick={onReset} disabled={loading}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
