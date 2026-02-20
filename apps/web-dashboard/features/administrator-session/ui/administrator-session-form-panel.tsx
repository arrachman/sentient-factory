import { ArrowLeft, Save } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SessionFormState, UserOption } from '@/features/administrator-session/model/types';

type AdministratorSessionFormPanelProps = {
  form: SessionFormState;
  users: UserOption[];
  editingUuid: string | null;
  submitting: boolean;
  error: string;
  onFormChange: (next: SessionFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AdministratorSessionFormPanel({
  form,
  users,
  editingUuid,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: AdministratorSessionFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Session' : 'Create Session'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <Label htmlFor="userId">
            User <span className="text-destructive">*</span>
          </Label>
          <AutocompleteSelect
            value={form.userId}
            onValueChange={(value) => onFormChange({ ...form, userId: value })}
            options={users}
            placeholder="Select user"
            searchPlaceholder="Search user..."
            emptyText="No user found."
            triggerClassName="h-8.5 text-[0.8125rem]"
            required
          />
        </div>

        <div>
          <Label htmlFor="token">
            Token <span className="text-destructive">*</span>
          </Label>
          <Input id="token" value={form.token} onChange={(e) => onFormChange({ ...form, token: e.target.value })} required />
        </div>

        <div>
          <Label htmlFor="expiresAt">
            Expires At <span className="text-destructive">*</span>
          </Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) => onFormChange({ ...form, expiresAt: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={form.ipAddress}
              onChange={(e) => onFormChange({ ...form, ipAddress: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="userAgent">User Agent</Label>
            <Input
              id="userAgent"
              value={form.userAgent}
              onChange={(e) => onFormChange({ ...form, userAgent: e.target.value })}
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
