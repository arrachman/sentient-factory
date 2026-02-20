import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type MasterUomFormState } from '@/features/master-uom/model/types';

type MasterUomFormPanelProps = {
  form: MasterUomFormState;
  editingUuid: string | null;
  submitting: boolean;
  error: string;
  onFormChange: (next: MasterUomFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterUomFormPanel({
  form,
  editingUuid,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: MasterUomFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit UOM' : 'Create UOM'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              placeholder="ISO Standard"
              value={form.code}
              onChange={(e) => onFormChange({ ...form, code: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">
              Type <span className="text-destructive">*</span>
            </Label>
            <Input
              id="type"
              value={form.type}
              onChange={(e) => onFormChange({ ...form, type: e.target.value })}
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
