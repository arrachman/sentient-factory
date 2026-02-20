import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PermissionItem } from '@/features/administrator-role/model/types';
import { pickEntityId } from '@/features/administrator-role/model/utils';

type AdministratorRolePermissionDialogProps = {
  open: boolean;
  roleName: string;
  permissions: PermissionItem[];
  selectedPermissionIds: number[];
  loading: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePermission: (permissionId: number) => void;
  onSave: () => void;
};

export function AdministratorRolePermissionDialog({
  open,
  roleName,
  permissions,
  selectedPermissionIds,
  loading,
  submitting,
  onOpenChange,
  onTogglePermission,
  onSave,
}: AdministratorRolePermissionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !submitting) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="max-w-[820px] p-0">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle>Assign Permissions: {roleName || '-'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-5">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading role permissions...</p>
          ) : permissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No permission master data found.</p>
          ) : (
            <div className="max-h-[420px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">Use</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => {
                    const permissionId = Number(pickEntityId(permission));
                    const checked = selectedPermissionIds.includes(permissionId);
                    return (
                      <TableRow key={permissionId || permission.name}>
                        <TableCell>
                          <button
                            type="button"
                            className={`inline-flex size-7 items-center justify-center rounded border ${
                              checked ? 'bg-primary text-primary-foreground' : 'bg-background'
                            }`}
                            onClick={() => {
                              if (Number.isInteger(permissionId) && permissionId > 0) {
                                onTogglePermission(permissionId);
                              }
                            }}
                          >
                            {checked ? <Check className="size-4" /> : null}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.module}</TableCell>
                        <TableCell>{permission.action}</TableCell>
                        <TableCell className="max-w-[260px] truncate">{permission.description || '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter className="pt-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave} disabled={submitting || loading}>
              {submitting ? 'Saving...' : 'Save Assignments'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
