import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useCreateMasterContactMutation,
  useDeleteMasterContactMutation,
  useMasterContactByIdQuery,
  useMasterContactCitiesQuery,
  useMasterContactListQuery,
  useUpdateMasterContactMutation,
} from '@/features/master-contact/hooks/use-master-contact-queries';
import {
  type ContactFormState,
  type ContactType,
  initialContactForm,
  type MasterDataContact,
} from '@/features/master-contact/model/types';
import { slugifyCode } from '@/features/master-contact/model/utils';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

function normalizePayload(form: ContactFormState): ContactFormState {
  const effectiveCode = form.code.trim() || slugifyCode(form.name);

  return {
    ...form,
    code: effectiveCode,
    tax: form.tax || '',
    website: form.website || '',
    address: form.address || '',
    street: form.street || '',
    city: form.city || '',
    province: form.province || '',
    zipCode: form.zipCode || '',
    contactFirstName: form.contactFirstName || '',
    contactEmail: form.contactEmail || '',
    contactPhone: form.contactPhone || '',
  };
}

function mapContactToForm(item: MasterDataContact): ContactFormState {
  return {
    code: item.code ?? '',
    name: item.name ?? '',
    tax: item.tax ?? '',
    website: item.website ?? '',
    address: item.address ?? '',
    street: item.street ?? '',
    city: item.city ?? '',
    province: item.province ?? '',
    zipCode: item.zipCode ?? '',
    type: item.type,
    contactFirstName: item.contactFirstName ?? '',
    contactEmail: item.contactEmail ?? '',
    contactPhone: item.contactPhone ?? '',
  };
}

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useMasterContactPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/master/contact/add';
  const isUpdateRoute = pathname === '/app/master/contact/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [form, setForm] = useState<ContactFormState>(initialContactForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);

  const listQuery = useMasterContactListQuery(page, limit, search);
  const citiesQuery = useMasterContactCitiesQuery();
  const updateItemQuery = useMasterContactByIdQuery(updateId, isUpdateRoute && Boolean(updateId) && !showForm);

  const createMutation = useCreateMasterContactMutation();
  const updateMutation = useUpdateMasterContactMutation();
  const deleteMutation = useDeleteMasterContactMutation();

  const items = useMemo(() => {
    if (!listQuery.data?.success) {
      return [];
    }
    return Array.isArray(listQuery.data.data) ? listQuery.data.data : [];
  }, [listQuery.data]);

  const cities = useMemo(() => {
    if (!citiesQuery.data?.success) {
      return [];
    }
    return Array.isArray(citiesQuery.data.data) ? citiesQuery.data.data : [];
  }, [citiesQuery.data]);

  const meta = listQuery.data?.success ? listQuery.data.meta : undefined;
  const totalPages = typeof meta?.totalPages === 'number' ? meta.totalPages : 1;
  const totalItems = typeof meta?.total === 'number' ? meta.total : 0;

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city.name,
        label: `${city.name}${city.province?.name ? ` - ${city.province.name}` : ''}${city.postalCode ? ` (${city.postalCode})` : ''}`,
        keywords: `${city.name} ${city.province?.name ?? ''} ${city.postalCode ?? ''}`.trim(),
      })),
    [cities],
  );

  const cityAutocompleteOptions = useMemo(() => {
    if (!form.city || cityOptions.some((option) => option.value === form.city)) {
      return cityOptions;
    }
    return [{ value: form.city, label: form.city }, ...cityOptions];
  }, [cityOptions, form.city]);

  const onEdit = useCallback((item: MasterDataContact) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm(mapContactToForm(item));
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingUuid(null);
    setForm(initialContactForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }

    const currentListItem = items.find((row) => row.uuid === updateId);
    if (currentListItem) {
      onEdit(currentListItem);
      return;
    }

    if (updateItemQuery.data?.success && updateItemQuery.data.data) {
      onEdit(updateItemQuery.data.data);
    }
  }, [isUpdateRoute, items, onEdit, showForm, updateId, updateItemQuery.data]);

  useEffect(() => {
    if (listQuery.error) {
      setError(extractMessage(listQuery.error, 'Failed to load data'));
    }
  }, [listQuery.error]);

  useEffect(() => {
    if (citiesQuery.error) {
      setError(extractMessage(citiesQuery.error, 'Failed to load city data'));
    }
  }, [citiesQuery.error]);

  useEffect(() => {
    if (updateItemQuery.error) {
      setError(extractMessage(updateItemQuery.error, 'Failed to load contact data'));
    }
  }, [updateItemQuery.error]);

  const onSubmit = useCallback(async () => {
    setError('');

    try {
      const payload = normalizePayload(form);
      if (editingUuid) {
        await updateMutation.mutateAsync({ uuid: editingUuid, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setForm(initialContactForm);
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/master/contact');
      }
      await listQuery.refetch();
    } catch (err) {
      setError(extractMessage(err, 'Failed to save data'));
    }
  }, [createMutation, editingUuid, form, isAddRoute, isUpdateRoute, listQuery, router, updateMutation]);

  const onDelete = useCallback(
    async (uuid: string) => {
      const ok = window.confirm('Delete this contact?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        await deleteMutation.mutateAsync(uuid);
        if (editingUuid === uuid) {
          setEditingUuid(null);
          setForm(initialContactForm);
          setShowForm(false);
          if (isAddRoute || isUpdateRoute) {
            router.push('/app/master/contact');
          }
        }
        await listQuery.refetch();
      } catch (err) {
        setError(extractMessage(err, 'Failed to delete data'));
      }
    },
    [deleteMutation, editingUuid, isAddRoute, isUpdateRoute, listQuery, router],
  );

  const applySearch = useCallback(() => {
    setPage(1);
    setSearch(searchInput.trim());
  }, [searchInput]);

  const resetSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  }, []);

  const refreshList = useCallback(async () => {
    setError('');
    await listQuery.refetch();
  }, [listQuery]);

  const changePage = useCallback((nextPage: number) => {
    if (!Number.isInteger(nextPage) || nextPage < 1) {
      return;
    }
    setPage(nextPage);
  }, []);

  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
  }, []);

  const openAddRoute = useCallback(() => {
    router.push('/app/master/contact/add');
  }, [router]);

  const openEditRoute = useCallback(
    (item: MasterDataContact) => {
      router.push(`/app/master/contact/update?ref=${encodeURIComponent(buildEntityRef(item.uuid, item.createdAt))}`);
    },
    [router],
  );

  const backToList = useCallback(() => {
    setEditingUuid(null);
    setForm(initialContactForm);
    setShowForm(false);
    router.push('/app/master/contact');
  }, [router]);

  return {
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    error,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    items,
    cities,
    cityAutocompleteOptions,
    loading: listQuery.isFetching,
    loadingCity: citiesQuery.isFetching,
    submitting: createMutation.isPending || updateMutation.isPending,
    applySearch,
    resetSearch,
    refreshList,
    changePage,
    openAddRoute,
    openEditRoute,
    onSubmit,
    onDelete,
    backToList,
    setError,
  };
}

export type MasterContactPageHook = ReturnType<typeof useMasterContactPage>;
export type MasterContactFormSetter = (next: ContactFormState) => void;
export type ContactTypeValue = ContactType;
