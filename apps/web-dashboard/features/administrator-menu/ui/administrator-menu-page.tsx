'use client';

import { Plus, RefreshCw } from 'lucide-react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Button } from '@/components/ui/button';
import { AdministratorMenuFormPanel } from '@/features/administrator-menu/ui/administrator-menu-form-panel';
import { AdministratorMenuListPanel } from '@/features/administrator-menu/ui/administrator-menu-list-panel';
import { useAdministratorMenuPage } from '@/features/administrator-menu/hooks/use-administrator-menu-page';

export default function AdministratorMenuPage() {
  const {
    items,
    form,
    setForm,
    editingId,
    showForm,
    search,
    setSearch,
    parentFilter,
    setParentFilter,
    loading,
    submitting,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    parentSelectOptions,
    parentFilterOptions,
    fetchList,
    openAddForm,
    backToList,
    openEditRoute,
    onDelete,
    submitForm,
  } = useAdministratorMenuPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Menu</ToolbarPageTitle>
          <ToolbarDescription>Manage sidebar menu structure and visibility.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddForm}>
            <Plus />
            Add Menu
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorMenuListPanel
            items={items}
            loading={loading}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            search={search}
            onSearchChange={setSearch}
            parentFilter={parentFilter}
            onParentFilterChange={setParentFilter}
            parentFilterOptions={parentFilterOptions}
            onApplyFilter={() => fetchList(1)}
            onEdit={openEditRoute}
            onDelete={onDelete}
            onPageChange={fetchList}
          />
        ) : null}

        {showForm ? (
          <AdministratorMenuFormPanel
            form={form}
            editingId={editingId}
            submitting={submitting}
            error={error}
            parentSelectOptions={parentSelectOptions}
            onFormChange={setForm}
            onSubmit={(event) => {
              event.preventDefault();
              submitForm();
            }}
            onBackToList={backToList}
          />
        ) : null}
      </div>
    </div>
  );
}
