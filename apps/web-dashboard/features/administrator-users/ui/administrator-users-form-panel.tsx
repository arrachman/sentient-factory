import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserFormState, WarehouseOption } from '@/features/administrator-users/model/types';

type AdministratorUsersFormPanelProps = {
  form: UserFormState;
  roles: WarehouseOption[];
  warehouses: WarehouseOption[];
  editingUuid: string | null;
  submitting: boolean;
  error: string;
  onFormChange: (next: UserFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AdministratorUsersFormPanel({
  form,
  roles,
  warehouses,
  editingUuid,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: AdministratorUsersFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit User' : 'Create User'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => onFormChange({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => onFormChange({ ...form, username: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onFormChange({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">
              {editingUuid ? 'New Password (optional)' : 'Password'} {!editingUuid ? <span className="text-destructive">*</span> : null}
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => onFormChange({ ...form, password: e.target.value })}
              required={!editingUuid}
              minLength={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label>
              Roles <span className="text-destructive">*</span>
            </Label>
            <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
              {roles.length === 0 ? (
                <p className="text-xs text-muted-foreground">No role found.</p>
              ) : (
                roles.map((role) => {
                  const checked = form.roleIds.includes(role.value);
                  return (
                    <label key={role.value} className="flex cursor-pointer items-center gap-2 text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(next) => {
                          onFormChange({
                            ...form,
                            roleIds: next
                              ? Array.from(new Set([...form.roleIds, role.value]))
                              : form.roleIds.filter((item) => item !== role.value),
                          });
                        }}
                      />
                      <span>{role.label}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="isActive">Status</Label>
            <AutocompleteSelect
              value={form.isActive ? 'active' : 'inactive'}
              onValueChange={(value) => onFormChange({ ...form, isActive: value === 'active' })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              placeholder="Select status"
              searchPlaceholder="Search status..."
              emptyText="No status found."
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
          <div>
            <Label htmlFor="warehouseId">
              Warehouse <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.warehouseId}
              onValueChange={(value) => onFormChange({ ...form, warehouseId: value })}
              options={warehouses}
              placeholder="Select warehouse"
              searchPlaceholder="Search warehouse..."
              emptyText="No warehouse found."
              triggerClassName="h-8.5 text-[0.8125rem]"
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
