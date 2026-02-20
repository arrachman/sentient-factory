import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { RoleFormState } from '@/features/administrator-role/model/types';

type AdministratorRoleFormPanelProps = {
  form: RoleFormState;
  editingId: string | null;
  submitting: boolean;
  onFormChange: (next: RoleFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AdministratorRoleFormPanel({
  form,
  editingId,
  submitting,
  onFormChange,
  onSubmit,
  onBack,
}: AdministratorRoleFormPanelProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-lg border p-5 space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Role Name</Label>
          <Input
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="manager"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>System Role</Label>
          <label className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
            <input
              type="checkbox"
              checked={form.isSystem}
              onChange={(e) => onFormChange({ ...form, isSystem: e.target.checked })}
              disabled={Boolean(editingId && form.isSystem)}
            />
            <span>Mark as system role</span>
          </label>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
            placeholder="Optional description"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
        <Button type="submit" disabled={submitting}>
          <Save />
          {submitting ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
}
