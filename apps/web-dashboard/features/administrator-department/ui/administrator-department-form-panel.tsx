import { ArrowLeft, Save, X } from 'lucide-react';
import { type AutocompleteSelectOption, AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type DepartmentFormState } from '@/features/administrator-department/model/types';

type AdministratorDepartmentFormPanelProps = {
  form: DepartmentFormState;
  editingId: string | null;
  submitting: boolean;
  parentOptions: AutocompleteSelectOption[];
  onFormChange: (next: DepartmentFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AdministratorDepartmentFormPanel({
  form,
  editingId,
  submitting,
  parentOptions,
  onFormChange,
  onSubmit,
  onBack,
}: AdministratorDepartmentFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">{editingId ? 'Edit Department' : 'Create Department'}</h2>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft />
          Back to list
        </Button>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={form.code}
              onChange={(e) => onFormChange({ ...form, code: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="parent">Parent Department</Label>
            <AutocompleteSelect
              value={form.parentId}
              onValueChange={(value) => onFormChange({ ...form, parentId: value })}
              options={[{ value: '', label: 'No parent' }, ...parentOptions]}
              placeholder="Select parent department"
              searchPlaceholder="Search parent department..."
              emptyText="No parent department found."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
            <X />
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            <Save />
            {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}
