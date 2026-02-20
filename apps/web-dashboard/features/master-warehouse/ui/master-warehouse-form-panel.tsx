import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MasterDataCity, WarehouseFormState } from '@/features/master-warehouse/model/types';

type MasterWarehouseFormPanelProps = {
  form: WarehouseFormState;
  cities: MasterDataCity[];
  editingUuid: string | null;
  loadingCity: boolean;
  submitting: boolean;
  error: string;
  onFormChange: (next: WarehouseFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterWarehouseFormPanel({
  form,
  cities,
  editingUuid,
  loadingCity,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: MasterWarehouseFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Warehouse' : 'Create Warehouse'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="cityId">
              City <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.cityId}
              onValueChange={(value) => onFormChange({ ...form, cityId: value })}
              options={cities.map((city) => ({
                value: city.uuid,
                label: `${city.name} (${city.postalCode})`,
                keywords: city.province ? `${city.province.name} ${city.province.isoCode}` : undefined,
              }))}
              placeholder={cities.length === 0 ? 'No city available' : 'Select city'}
              searchPlaceholder="Search city..."
              emptyText="No city found."
              required
              disabled={loadingCity || cities.length === 0}
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
          <div>
            <Label htmlFor="locationName">Location Name</Label>
            <Input
              id="locationName"
              value={form.locationName}
              onChange={(e) => onFormChange({ ...form, locationName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="addressDetail">Address Detail</Label>
            <Input
              id="addressDetail"
              value={form.addressDetail}
              onChange={(e) => onFormChange({ ...form, addressDetail: e.target.value })}
            />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting || loadingCity || cities.length === 0}>
            <Save />
            {submitting ? 'Saving...' : editingUuid ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft />
            Back to List
          </Button>
        </div>
      </form>
    </div>
  );
}
