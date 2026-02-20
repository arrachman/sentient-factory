import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type MasterProvinceFormState } from '@/features/master-province/model/types';

type MasterProvinceFormPanelProps = {
  form: MasterProvinceFormState;
  editingUuid: string | null;
  submitting: boolean;
  error: string;
  onFormChange: (next: MasterProvinceFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterProvinceFormPanel({
  form,
  editingUuid,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: MasterProvinceFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Province' : 'Create Province'}</h2>
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
            <Label htmlFor="isoCode">
              ISO Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="isoCode"
              placeholder="ID-JI"
              value={form.isoCode}
              onChange={(e) => onFormChange({ ...form, isoCode: e.target.value })}
              required
            />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
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
