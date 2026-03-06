'use client';

import { Plus, RefreshCw } from 'lucide-react';
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
    changeLimit,
    openAddForm,
    backToList,
    openEditRoute,
    onDelete,
    submitForm,
  } = useAdministratorMenuPage();

  return (
    <div className="container">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5">
          <h1 className="text-xl font-medium leading-tight text-mono">Administrator Menu</h1>
          <p className="text-sm text-secondary-foreground">Manage sidebar menu structure and visibility.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={openAddForm}>
            <Plus />
            Add Menu
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-2.5">
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
            onLimitChange={changeLimit}
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
