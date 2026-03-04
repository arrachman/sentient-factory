import type { FormEvent } from 'react';
import type { AdministratorMenuFormState } from '@/features/administrator-menu/model/types';
import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AdministratorMenuFormPanelProps = {
  form: AdministratorMenuFormState;
  editingId: string | null;
  submitting: boolean;
  error: string;
  parentSelectOptions: Array<{ value: string; label: string }>;
  onFormChange: (next: AdministratorMenuFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBackToList: () => void;
};

export function AdministratorMenuFormPanel({
  form,
  editingId,
  submitting,
  error,
  parentSelectOptions,
  onFormChange,
  onSubmit,
  onBackToList,
}: AdministratorMenuFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">
        {editingId ? 'Edit Menu' : 'Create Menu'}
      </h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="key">
              Key <span className="text-destructive">*</span>
            </Label>
            <Input
              id="key"
              value={form.key}
              onChange={(e) => onFormChange({ ...form, key: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div>
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              value={form.path}
              onChange={(e) => onFormChange({ ...form, path: e.target.value })}
              placeholder="/app/administrator/menu"
            />
          </div>
          <div>
            <Label htmlFor="icon">Icon (Lucide)</Label>
            <Input
              id="icon"
              value={form.icon}
              onChange={(e) => onFormChange({ ...form, icon: e.target.value })}
              placeholder="Users"
            />
          </div>
          <div>
            <Label htmlFor="permissionName">Permission</Label>
            <Input
              id="permissionName"
              value={form.permissionName}
              onChange={(e) =>
                onFormChange({ ...form, permissionName: e.target.value })
              }
              placeholder="menu.read"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
          <div>
            <Label htmlFor="sortOrder">
              Sort Order <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) =>
                onFormChange({ ...form, sortOrder: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div>
            <Label htmlFor="parentId">Parent Menu</Label>
            <AutocompleteSelect
              value={form.parentId}
              onValueChange={(value) =>
                onFormChange({ ...form, parentId: value })
              }
              options={parentSelectOptions}
              placeholder="Select parent menu"
              searchPlaceholder="Search parent menu..."
              emptyText="No menu found."
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="isVisible"
              checked={form.isVisible}
              onCheckedChange={(checked) =>
                onFormChange({ ...form, isVisible: checked === true })
              }
            />
            <Label htmlFor="isVisible">Visible</Label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                onFormChange({ ...form, isActive: checked === true })
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            <Save />
            {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onBackToList}>
            <ArrowLeft />
            Back to List
          </Button>
        </div>
      </form>
    </div>
  );
}
