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
import { useMasterCitySlaPage } from '@/features/master-city-sla/hooks/use-master-city-sla-page';
import { MasterCitySlaFormPanel } from '@/features/master-city-sla/ui/master-city-sla-form-panel';
import { MasterCitySlaListPanel } from '@/features/master-city-sla/ui/master-city-sla-list-panel';

export default function MasterDataCitySlaPage() {
  const {
    items,
    addableCities,
    selectableCities,
    selectedCityLabel,
    form,
    setForm,
    cityAutocompleteOpen,
    setCityAutocompleteOpen,
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
    refreshList,
    applySearch,
    resetSearch,
    changePage,
    openAddRoute,
    openEditRoute,
    onSubmit,
    onDelete,
    backToList,
  } = useMasterCitySlaPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data City SLA</ToolbarPageTitle>
          <ToolbarDescription>Manage standard lead time and standard DO return by city.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddRoute} disabled={loadingCity || addableCities.length === 0}>
            <Plus />
            Add City SLA
          </Button>
          <Button variant="outline" onClick={() => void refreshList()} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterCitySlaListPanel
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
            onPageChange={changePage}
          />
        ) : (
          <MasterCitySlaFormPanel
            form={form}
            selectableCities={selectableCities}
            selectedCityLabel={selectedCityLabel}
            cityAutocompleteOpen={cityAutocompleteOpen}
            editingUuid={editingUuid}
            loadingCity={loadingCity}
            submitting={submitting}
            onFormChange={setForm}
            onCityAutocompleteOpenChange={setCityAutocompleteOpen}
            onSubmit={() => {
              void onSubmit();
            }}
            onBack={backToList}
          />
        )}

        {error ? <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
