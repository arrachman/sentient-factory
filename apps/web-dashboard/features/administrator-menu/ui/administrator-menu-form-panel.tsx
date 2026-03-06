import type { FormEvent } from 'react';
import type { AdministratorMenuFormState } from '@/features/administrator-menu/model/types';
import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CompactInput } from '@/components/ui/compact-input';
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
    <div className="rounded-lg border p-4">
      <h2 className="mb-0.5 text-sm font-semibold text-mono">
        {editingId ? 'Edit Menu' : 'Create Menu'}
      </h2>
      <p className="mb-3 text-[11px] text-muted-foreground">Compact mode: more fields in one screen.</p>

      <form className="space-y-2.5" onSubmit={onSubmit}>
        <section className="space-y-2 rounded-md border p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Basic</h3>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="title" className="text-xs">
                Title <span className="text-destructive">*</span>
              </Label>
              <CompactInput
                id="title"
                value={form.title}
                onChange={(e) => onFormChange({ ...form, title: e.target.value })}
                placeholder="User Management"
                required
              />
            </div>
            <div>
              <Label htmlFor="key" className="text-xs">
                Key <span className="text-destructive">*</span>
              </Label>
              <CompactInput
                id="key"
                value={form.key}
                onChange={(e) => onFormChange({ ...form, key: e.target.value })}
                placeholder="administrator.users"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-xs">
                Type <span className="text-destructive">*</span>
              </Label>
              <CompactInput
                id="type"
                value={form.type}
                onChange={(e) => onFormChange({ ...form, type: e.target.value })}
                placeholder="ITEM"
                required
              />
            </div>
            <div>
              <Label htmlFor="sortOrder" className="text-xs">
                Sort Order <span className="text-destructive">*</span>
              </Label>
              <CompactInput
                id="sortOrder"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => onFormChange({ ...form, sortOrder: e.target.value })}
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-2 rounded-md border p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Navigation</h3>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="parentId" className="text-xs">Parent Menu</Label>
              <AutocompleteSelect
                value={form.parentId}
                onValueChange={(value) => onFormChange({ ...form, parentId: value })}
                options={parentSelectOptions}
                placeholder="No Parent"
                searchPlaceholder="Search parent menu..."
                emptyText="No menu found."
                triggerClassName="h-7 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="path" className="text-xs">Path</Label>
              <CompactInput
                id="path"
                value={form.path}
                onChange={(e) => onFormChange({ ...form, path: e.target.value })}
                placeholder="/app/administrator/menu"
              />
            </div>
            <div>
              <Label htmlFor="icon" className="text-xs">Icon</Label>
              <CompactInput
                id="icon"
                value={form.icon}
                onChange={(e) => onFormChange({ ...form, icon: e.target.value })}
                placeholder="Users"
              />
            </div>
            <div>
              <Label htmlFor="permissionName" className="text-xs">Permission</Label>
              <CompactInput
                id="permissionName"
                value={form.permissionName}
                onChange={(e) => onFormChange({ ...form, permissionName: e.target.value })}
                placeholder="menu.read"
              />
            </div>
          </div>
        </section>

        <section className="rounded-md border p-3">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
              <Checkbox
                id="isVisible"
                size="sm"
                checked={form.isVisible}
                onCheckedChange={(checked) => onFormChange({ ...form, isVisible: checked === true })}
              />
              <span>Visible in sidebar</span>
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
              <Checkbox
                id="isActive"
                size="sm"
                checked={form.isActive}
                onCheckedChange={(checked) => onFormChange({ ...form, isActive: checked === true })}
              />
              <span>Active</span>
            </label>
          </div>
        </section>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
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
