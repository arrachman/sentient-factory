import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { MasterDataCity, MasterDataWarehouse } from '@/features/master-warehouse/model/types';

type MasterWarehouseListPanelProps = {
  items: MasterDataWarehouse[];
  cities: MasterDataCity[];
  loading: boolean;
  searchInput: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: MasterDataWarehouse) => void;
  onDelete: (uuid: string) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function MasterWarehouseListPanel({
  items,
  cities,
  loading,
  searchInput,
  page,
  limit,
  totalPages,
  totalItems,
  onSearchInputChange,
  onSearchSubmit,
  onSearchReset,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
}: MasterWarehouseListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, city, location, address..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit();
              }
            }}
            className="pr-8"
          />
          {searchInput ? (
            <button
              type="button"
              aria-label="Reset search"
              onClick={onSearchReset}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <Button variant="outline" onClick={onSearchSubmit} disabled={loading}>
          <RefreshCw />
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Location Name</TableHead>
            <TableHead>Address Detail</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No warehouse data found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.uuid || `${item.name || 'warehouse'}-${item.cityId || 'city'}-${index}`}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.city?.name || cities.find((city) => city.uuid === item.cityId)?.name || '-'}</TableCell>
                <TableCell>{item.locationName || '-'}</TableCell>
                <TableCell>{item.addressDetail || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit warehouse" onClick={() => onEdit(item)}>
                      <Pencil />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label="Delete warehouse" onClick={() => onDelete(item.uuid)}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <StandardPagination page={page} limit={limit} totalPages={totalPages} totalItems={totalItems} loading={loading} onPageChange={onPageChange} onLimitChange={onLimitChange} />
    </div>
  );
}
