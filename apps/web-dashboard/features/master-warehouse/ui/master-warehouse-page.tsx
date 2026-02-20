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
import { useMasterWarehousePage } from '@/features/master-warehouse/hooks/use-master-warehouse-page';
import { MasterWarehouseFormPanel } from '@/features/master-warehouse/ui/master-warehouse-form-panel';
import { MasterWarehouseListPanel } from '@/features/master-warehouse/ui/master-warehouse-list-panel';

export default function MasterDataWarehousePage() {
  const {
    items,
    cities,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    loadingCity,
    submitting,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    fetchList,
    onSubmit,
    onDelete,
    openAddRoute,
    openEditRoute,
    backToList,
    applySearch,
    resetSearch,
  } = useMasterWarehousePage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data Warehouse</ToolbarPageTitle>
          <ToolbarDescription>Manage warehouse master data.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddRoute}>
            <Plus />
            Add Warehouse
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterWarehouseListPanel
            items={items}
            cities={cities}
            loading={loading}
            searchInput={searchInput}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={applySearch}
            onSearchReset={resetSearch}
            onEdit={openEditRoute}
            onDelete={(uuid) => {
              void onDelete(uuid);
            }}
            onPageChange={fetchList}
          />
        ) : (
          <MasterWarehouseFormPanel
            form={form}
            cities={cities}
            editingUuid={editingUuid}
            loadingCity={loadingCity}
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
