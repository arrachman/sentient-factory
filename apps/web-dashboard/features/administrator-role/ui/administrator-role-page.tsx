'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { useAdministratorRolePage } from '@/features/administrator-role/hooks/use-administrator-role-page';
import { AdministratorRoleFormPanel } from '@/features/administrator-role/ui/administrator-role-form-panel';
import { AdministratorRoleListPanel } from '@/features/administrator-role/ui/administrator-role-list-panel';
import { AdministratorRolePermissionDialog } from '@/features/administrator-role/ui/administrator-role-permission-dialog';

export function AdministratorRolePageView() {
  const {
    items,
    permissions,
    form,
    setForm,
    editingId,
    showForm,
    permissionDialogRole,
    setPermissionDialogRole,
    selectedPermissionIds,
    searchInput,
    setSearchInput,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    loading,
    submitting,
    permissionLoading,
    permissionSubmitting,
    fetchList,
    changeLimit,
    onSubmit,
    onEdit,
    onDelete,
    openPermissionDialog,
    togglePermission,
    saveRolePermissions,
    openCreate,
    backToList,
    applySearch,
    resetSearch,
  } = useAdministratorRolePage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Role</ToolbarPageTitle>
          <ToolbarDescription>Manage role master data and assign permissions per role.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add Role
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorRoleListPanel
            items={items}
            loading={loading}
            searchInput={searchInput}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={applySearch}
            onSearchReset={resetSearch}
            onEdit={onEdit}
            onDelete={(id) => {
              void onDelete(id);
            }}
            onOpenPermissions={(item) => {
              void openPermissionDialog(item);
            }}
            onPageChange={fetchList}
            onLimitChange={changeLimit}
          />
        ) : (
          <AdministratorRoleFormPanel
            form={form}
            editingId={editingId}
            submitting={submitting}
            onFormChange={setForm}
            onSubmit={() => {
              void onSubmit();
            }}
            onBack={backToList}
          />
        )}

        <AdministratorRolePermissionDialog
          open={Boolean(permissionDialogRole)}
          roleName={permissionDialogRole?.name || ''}
          permissions={permissions}
          selectedPermissionIds={selectedPermissionIds}
          loading={permissionLoading}
          submitting={permissionSubmitting}
          onOpenChange={(open) => {
            if (!open) {
              setPermissionDialogRole(null);
            }
          }}
          onTogglePermission={togglePermission}
          onSave={() => {
            void saveRolePermissions();
          }}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

export default AdministratorRolePageView;
