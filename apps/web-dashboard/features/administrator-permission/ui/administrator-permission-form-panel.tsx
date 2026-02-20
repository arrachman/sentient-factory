import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type PermissionFormState } from '@/features/administrator-permission/model/types';

type AdministratorPermissionFormPanelProps = {
  form: PermissionFormState;
  editingId: string | null;
  submitting: boolean;
  onFormChange: (next: PermissionFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AdministratorPermissionFormPanel({
  form,
  editingId,
  submitting,
  onFormChange,
  onSubmit,
  onBack,
}: AdministratorPermissionFormPanelProps) {
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
          <Label>Permission Name</Label>
          <Input
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="user:create"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Module</Label>
          <Input
            value={form.module}
            onChange={(e) => onFormChange({ ...form, module: e.target.value })}
            placeholder="user"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Action</Label>
          <Input
            value={form.action}
            onChange={(e) => onFormChange({ ...form, action: e.target.value })}
            placeholder="create"
            required
          />
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
          {submitting ? 'Saving...' : editingId ? 'Update Permission' : 'Create Permission'}
        </Button>
      </div>
    </form>
  );
}
