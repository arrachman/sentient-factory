import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MasterCityFormState, MasterDataProvince } from '@/features/master-city/model/types';

type MasterCityFormPanelProps = {
  form: MasterCityFormState;
  provinces: MasterDataProvince[];
  editingUuid: string | null;
  loadingProvince: boolean;
  submitting: boolean;
  error: string;
  onFormChange: (next: MasterCityFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterCityFormPanel({
  form,
  provinces,
  editingUuid,
  loadingProvince,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: MasterCityFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit City' : 'Create City'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="provinceId">
              Province <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.provinceId}
              onValueChange={(value) => onFormChange({ ...form, provinceId: value })}
              options={provinces.map((province) => ({
                value: province.uuid,
                label: `${province.name} (${province.isoCode})`,
              }))}
              placeholder={provinces.length === 0 ? 'No province available' : 'Select province'}
              searchPlaceholder="Search province..."
              emptyText="No province found."
              required
              disabled={loadingProvince || provinces.length === 0}
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>

          <div>
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="postalCode">
              Postal Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="postalCode"
              value={form.postalCode}
              onChange={(e) => onFormChange({ ...form, postalCode: e.target.value })}
              required
            />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting || loadingProvince || provinces.length === 0}>
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
