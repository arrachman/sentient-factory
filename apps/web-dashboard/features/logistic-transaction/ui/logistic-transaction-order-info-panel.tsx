import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type CityOption,
  type ContactOption,
  type DeliveryOrderForm,
  type DivisionOption,
  type WarehouseOption,
} from '@/features/logistic-transaction/model/types';
import { pickEntityId } from '@/features/logistic-transaction/model/utils';

type LogisticTransactionOrderInfoPanelProps = {
  form: DeliveryOrderForm;
  buOptions: DivisionOption[];
  customers: ContactOption[];
  warehouses: WarehouseOption[];
  cities: CityOption[];
  lockedWarehouseId: string;
  onDoNumberChange: (value: string) => void;
  onBuChange: (value: string) => void;
  onDoDateChange: (value: string) => void;
  onDoReceivedDateChange: (value: string) => void;
  onCustomerChange: (value: string) => void;
  onWarehouseChange: (value: string) => void;
  onDestinationCityChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

export function LogisticTransactionOrderInfoPanel({
  form,
  buOptions,
  customers,
  warehouses,
  cities,
  lockedWarehouseId,
  onDoNumberChange,
  onBuChange,
  onDoDateChange,
  onDoReceivedDateChange,
  onCustomerChange,
  onWarehouseChange,
  onDestinationCityChange,
  onNotesChange,
}: LogisticTransactionOrderInfoPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h3 className="mb-4 text-base font-semibold">Informasi Delivery Order</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nomor DO</Label>
          <Input value={form.doNumber} onChange={(e) => onDoNumberChange(e.target.value)} placeholder="DO-2026-0001" required />
        </div>
        <div className="space-y-2">
          <Label>BU (Bagian Usaha)</Label>
          <AutocompleteSelect
            value={form.bu}
            onValueChange={onBuChange}
            options={buOptions.map((division) => ({
              value: division.code,
              label: `${division.code} - ${division.name}`,
            }))}
            placeholder="Select BU"
            searchPlaceholder="Search BU..."
            emptyText="No BU found."
          />
        </div>
        <div className="space-y-2">
          <Label>Tanggal DO</Label>
          <Input type="date" value={form.doDate} onChange={(e) => onDoDateChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Tanggal Masuk DO</Label>
          <Input type="date" value={form.doReceivedDate} onChange={(e) => onDoReceivedDateChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Tujuan / Customer</Label>
          <AutocompleteSelect
            value={form.customerId}
            onValueChange={onCustomerChange}
            options={customers.flatMap((customer) => {
              const value = pickEntityId(customer);
              if (!value) {
                return [];
              }
              return {
                value,
                label: String(customer.name ?? ''),
                keywords: customer.code,
              };
            })}
            placeholder="Select customer"
            searchPlaceholder="Search customer..."
            emptyText="No customer found."
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Warehouse</Label>
          <AutocompleteSelect
            value={form.warehouseId}
            onValueChange={onWarehouseChange}
            options={warehouses.flatMap((warehouse) => {
              const value = pickEntityId(warehouse);
              if (!value) {
                return [];
              }
              const cityName = String(warehouse.city?.name ?? '').trim();
              return {
                value,
                label: cityName ? `${String(warehouse.name ?? '')} - ${cityName}` : String(warehouse.name ?? ''),
                keywords: warehouse.locationName || undefined,
              };
            })}
            placeholder="Select warehouse"
            searchPlaceholder="Search warehouse..."
            emptyText="No warehouse found."
            disabled={Boolean(lockedWarehouseId)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Kota Tujuan</Label>
          <AutocompleteSelect
            value={form.destinationCityId}
            onValueChange={onDestinationCityChange}
            options={cities.flatMap((city) => {
              const value = pickEntityId(city);
              if (!value) {
                return [];
              }
              const cityName = String(city.name ?? '');
              const postalCode = String(city.postalCode ?? '');
              return {
                value,
                label: `${cityName}${postalCode ? ` (${postalCode})` : ''}`,
              };
            })}
            placeholder="Select city"
            searchPlaceholder="Search city..."
            emptyText="No city found."
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label>Catatan</Label>
        <Textarea value={form.notes} onChange={(e) => onNotesChange(e.target.value)} placeholder="Catatan tambahan DO" rows={3} />
      </div>
    </div>
  );
}
