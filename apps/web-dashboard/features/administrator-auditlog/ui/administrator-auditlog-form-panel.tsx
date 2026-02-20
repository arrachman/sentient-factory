import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AuditLogFormState } from '@/features/administrator-auditlog/model/types';

type AdministratorAuditlogFormPanelProps = {
  form: AuditLogFormState;
  editingUuid: string | null;
  submitting: boolean;
  error: string;
  onFormChange: (next: AuditLogFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AdministratorAuditlogFormPanel({
  form,
  editingUuid,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: AdministratorAuditlogFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Auditlog' : 'Create Auditlog'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="action">
              Action <span className="text-destructive">*</span>
            </Label>
            <Input id="action" value={form.action} onChange={(e) => onFormChange({ ...form, action: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="entityType">
              Entity Type <span className="text-destructive">*</span>
            </Label>
            <Input
              id="entityType"
              value={form.entityType}
              onChange={(e) => onFormChange({ ...form, entityType: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="entityId">Entity ID</Label>
            <Input id="entityId" value={form.entityId} onChange={(e) => onFormChange({ ...form, entityId: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={form.userId}
              onChange={(e) => onFormChange({ ...form, userId: e.target.value })}
              placeholder="Optional numeric user ID"
            />
          </div>
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="oldData">Old Data (JSON)</Label>
            <Textarea
              id="oldData"
              value={form.oldData}
              onChange={(e) => onFormChange({ ...form, oldData: e.target.value })}
              rows={6}
              placeholder='{"before": "..."}'
            />
          </div>
          <div>
            <Label htmlFor="newData">New Data (JSON)</Label>
            <Textarea
              id="newData"
              value={form.newData}
              onChange={(e) => onFormChange({ ...form, newData: e.target.value })}
              rows={6}
              placeholder='{"after": "..."}'
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
