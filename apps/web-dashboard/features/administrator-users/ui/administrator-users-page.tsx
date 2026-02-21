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
import { useAdministratorUsersPage } from '@/features/administrator-users/hooks/use-administrator-users-page';
import { AdministratorUsersFormPanel } from '@/features/administrator-users/ui/administrator-users-form-panel';
import { AdministratorUsersListPanel } from '@/features/administrator-users/ui/administrator-users-list-panel';

export function AdministratorUsersPageView() {
  const {
    items,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    error,
    setError,
    warehouses,
    roles,
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
    applySearch,
    resetSearch,
  } = useAdministratorUsersPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Users</ToolbarPageTitle>
          <ToolbarDescription>Manage application users and their account status.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add User
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorUsersListPanel
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
            onDelete={(userId) => {
              void onDelete(userId);
            }}
            onPageChange={fetchList}
            onLimitChange={changeLimit}
            onError={setError}
          />
        ) : (
          <AdministratorUsersFormPanel
            form={form}
            roles={roles}
            warehouses={warehouses}
            editingUuid={editingUuid}
            submitting={submitting}
            error={error}
            onFormChange={setForm}
            onSubmit={() => {
              void onSubmit();
            }}
            onBack={backToList}
          />
        )}
      </div>
    </div>
  );
}

export default AdministratorUsersPageView;
