import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MasterItemFormState } from '@/features/master-item/model/types';
import { slugifyCode } from '@/features/master-item/model/utils';

type MasterItemFormPanelProps = {
  form: MasterItemFormState;
  editingUuid: string | null;
  uomOptions: Array<{ value: string; label: string }>;
  loadingUom: boolean;
  submitting: boolean;
  error: string;
  onFormChange: (next: MasterItemFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterItemFormPanel({
  form,
  editingUuid,
  uomOptions,
  loadingUom,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: MasterItemFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Item' : 'Create Item'}</h2>
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
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                const nextName = e.target.value;
                onFormChange({
                  ...form,
                  name: nextName,
                  code: slugifyCode(nextName),
                });
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input id="code" value={form.code} onChange={(e) => onFormChange({ ...form, code: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="category">
              Kategori Barang <span className="text-destructive">*</span>
            </Label>
            <Input id="category" value={form.category} onChange={(e) => onFormChange({ ...form, category: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="itemType">
              Item Type <span className="text-destructive">*</span>
            </Label>
            <Input id="itemType" value={form.itemType} onChange={(e) => onFormChange({ ...form, itemType: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="uomId">
              UOM <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.uomId}
              onValueChange={(value) => onFormChange({ ...form, uomId: value })}
              options={uomOptions}
              placeholder={uomOptions.length === 0 ? 'No UOM available' : 'Select UOM'}
              searchPlaceholder="Search UOM..."
              emptyText="No UOM found."
              required
              disabled={loadingUom || uomOptions.length === 0}
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Kelola UOM di halaman <code>/app/master/uom</code>.
            </p>
          </div>
          <div>
            <Label htmlFor="isActive">
              Is Active <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.isActive ? 'true' : 'false'}
              onValueChange={(value) => onFormChange({ ...form, isActive: value === 'true' })}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              placeholder="Select status"
              searchPlaceholder="Search status..."
              emptyText="No status found."
              required
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting || loadingUom || uomOptions.length === 0}>
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
