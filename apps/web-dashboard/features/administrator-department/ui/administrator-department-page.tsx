'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { useAdministratorDepartmentPage } from '@/features/administrator-department/hooks/use-administrator-department-page';
import { AdministratorDepartmentFormPanel } from '@/features/administrator-department/ui/administrator-department-form-panel';
import { AdministratorDepartmentListPanel } from '@/features/administrator-department/ui/administrator-department-list-panel';

export function AdministratorDepartmentPageView() {
  const router = useRouter();
  const {
    items,
    form,
    setForm,
    editingId,
    showForm,
    search,
    setSearch,
    error,
    setError,
    page,
    limit,
    totalPages,
    totalItems,
    loading,
    submitting,
    parentOptions,
    fetchList,
    changeLimit,
    onSubmit,
    onDelete,
    openCreate,
    backToList,
  } = useAdministratorDepartmentPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Department</ToolbarPageTitle>
          <ToolbarDescription>Manage department code, name, hierarchy, and description.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add Department
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorDepartmentListPanel
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
            onEdit={(ref) => {
              router.push(`/app/administrator/department/update?ref=${encodeURIComponent(ref)}`);
            }}
            onDelete={(id) => {
              if (!id) {
                setError('Department ID is missing');
                return;
              }
              void onDelete(id);
            }}
            onPageChange={fetchList}
            onLimitChange={changeLimit}
          />
        ) : (
          <AdministratorDepartmentFormPanel
            form={form}
            editingId={editingId}
            submitting={submitting}
            parentOptions={parentOptions}
            onFormChange={setForm}
            onSubmit={() => {
              void onSubmit();
            }}
            onBack={backToList}
          />
        )}

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdministratorDepartmentPageView;
