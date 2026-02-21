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
import { useAdministratorPermissionPage } from '@/features/administrator-permission/hooks/use-administrator-permission-page';
import { AdministratorPermissionFormPanel } from '@/features/administrator-permission/ui/administrator-permission-form-panel';
import { AdministratorPermissionListPanel } from '@/features/administrator-permission/ui/administrator-permission-list-panel';

export function AdministratorPermissionPageView() {
  const {
    items,
    form,
    setForm,
    editingId,
    showForm,
    search,
    setSearch,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    loading,
    submitting,
    fetchList,
    changeLimit,
    onSubmit,
    onEdit,
    onDelete,
    openCreate,
    backToList,
  } = useAdministratorPermissionPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Permission</ToolbarPageTitle>
          <ToolbarDescription>Manage permission name, module, and action mapping.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add Permission
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorPermissionListPanel
            items={items}
            loading={loading}
            search={search}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchChange={setSearch}
            onSearchSubmit={() => fetchList(1)}
            onSearchReset={() => {
              setSearch('');
              fetchList(1);
            }}
            onEdit={onEdit}
            onDelete={(id) => {
              void onDelete(id);
            }}
            onPageChange={fetchList}
            onLimitChange={changeLimit}
          />
        ) : (
          <AdministratorPermissionFormPanel
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

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

export default AdministratorPermissionPageView;
