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
import { useMasterProvincePage } from '@/features/master-province/hooks/use-master-province-page';
import { MasterProvinceFormPanel } from '@/features/master-province/ui/master-province-form-panel';
import { MasterProvinceListPanel } from '@/features/master-province/ui/master-province-list-panel';

export default function MasterDataProvincePage() {
  const router = useRouter();
  const {
    items,
    form,
    setForm,
    editingUuid,
    showForm,
    search,
    setSearch,
    loading,
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
    openCreate,
    backToList,
    resetSearch,
  } = useMasterProvincePage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data Province</ToolbarPageTitle>
          <ToolbarDescription>Manage province name and ISO code.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add Province
          </Button>
          <Button variant="outline" onClick={() => void fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterProvinceListPanel
            items={items}
            loading={loading}
            search={search}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchChange={setSearch}
            onSearchSubmit={() => {
              void fetchList(1);
            }}
            onSearchReset={resetSearch}
            onEdit={(ref) => {
              router.push(`/app/master/province/update?ref=${encodeURIComponent(ref)}`);
            }}
            onDelete={(uuid) => {
              void onDelete(uuid);
            }}
            onPageChange={(nextPage) => {
              void fetchList(nextPage);
            }}
            onLimitChange={changeLimit}
          />
        ) : (
          <MasterProvinceFormPanel
            form={form}
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
