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
import { useMasterCityPage } from '@/features/master-city/hooks/use-master-city-page';
import { MasterCityFormPanel } from '@/features/master-city/ui/master-city-form-panel';
import { MasterCityListPanel } from '@/features/master-city/ui/master-city-list-panel';

export default function MasterDataCityPage() {
  const {
    items,
    provinces,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    loadingProvince,
    submitting,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    fetchList,
    changeLimit,
    onSubmit,
    onDelete,
    openAddRoute,
    openEditRoute,
    backToList,
    applySearch,
    resetSearch,
  } = useMasterCityPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data City</ToolbarPageTitle>
          <ToolbarDescription>Manage city and postal code by province.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddRoute}>
            <Plus />
            Add City
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterCityListPanel
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
            onEdit={openEditRoute}
            onDelete={(uuid) => {
              void onDelete(uuid);
            }}
            onPageChange={fetchList}
            onLimitChange={changeLimit}
          />
        ) : (
          <MasterCityFormPanel
            form={form}
            provinces={provinces}
            editingUuid={editingUuid}
            loadingProvince={loadingProvince}
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
