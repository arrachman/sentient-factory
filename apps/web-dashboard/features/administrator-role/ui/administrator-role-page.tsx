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
import { AdministratorRoleMenuDialog } from '@/features/administrator-role/ui/administrator-role-menu-dialog';
import { AdministratorRolePermissionDialog } from '@/features/administrator-role/ui/administrator-role-permission-dialog';

export function AdministratorRolePageView() {
  const {
    items,
    menus,
    permissions,
    form,
    setForm,
    editingId,
    showForm,
    permissionDialogRole,
    setPermissionDialogRole,
    selectedPermissionIds,
    menuDialogRole,
    setMenuDialogRole,
    selectedMenuIds,
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
    menuLoading,
    menuSubmitting,
    fetchList,
    changeLimit,
    onSubmit,
    onEdit,
    onDelete,
    openPermissionDialog,
    openMenuDialog,
    togglePermission,
    toggleMenu,
    toggleMenusBulk,
    saveRolePermissions,
    saveRoleMenus,
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
            onOpenMenus={(item) => {
              void openMenuDialog(item);
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

        <AdministratorRoleMenuDialog
          open={Boolean(menuDialogRole)}
          roleName={menuDialogRole?.name || ''}
          menus={menus}
          selectedMenuIds={selectedMenuIds}
          loading={menuLoading}
          submitting={menuSubmitting}
          onOpenChange={(open) => {
            if (!open) {
              setMenuDialogRole(null);
            }
          }}
          onToggleMenu={toggleMenu}
          onToggleMenusBulk={toggleMenusBulk}
          onSave={() => {
            void saveRoleMenus();
          }}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

export default AdministratorRolePageView;
