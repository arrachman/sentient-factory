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
import { MasterContactFormPanel } from '@/features/master-contact/ui/master-contact-form-panel';
import { MasterContactListPanel } from '@/features/master-contact/ui/master-contact-list-panel';
import { useMasterContactPage } from '@/features/master-contact/hooks/use-master-contact-page';

export function MasterContactPageView() {
  const {
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    items,
    cities,
    cityAutocompleteOptions,
    loading,
    loadingCity,
    submitting,
    applySearch,
    resetSearch,
    refreshList,
    changePage,
    openAddRoute,
    openEditRoute,
    onSubmit,
    onDelete,
    backToList,
  } = useMasterContactPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data Contact</ToolbarPageTitle>
          <ToolbarDescription>Manage customer, supplier, and company contacts.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddRoute}>
            <Plus />
            Add Contact
          </Button>
          <Button variant="outline" onClick={() => void refreshList()} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterContactListPanel
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
          <MasterContactFormPanel
            form={form}
            editingUuid={editingUuid}
            submitting={submitting}
            loadingCity={loadingCity}
            error={error}
            cityAutocompleteOptions={cityAutocompleteOptions}
            onFormChange={setForm}
            onSubmit={() => {
              void onSubmit();
            }}
            onBack={backToList}
            onCitySelect={(value) => {
              const selectedCity = cities.find((city) => city.name === value);
              setForm((prev) => ({
                ...prev,
                city: value,
                province: selectedCity?.province?.name ?? prev.province,
                zipCode: selectedCity?.postalCode ?? prev.zipCode,
              }));
            }}
          />
        )}

        {!showForm && error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

export default MasterContactPageView;
