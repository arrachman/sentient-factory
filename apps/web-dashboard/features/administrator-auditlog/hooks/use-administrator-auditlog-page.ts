import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import {
  createAuditLog,
  deleteAuditLog,
  fetchAuditLogs,
  updateAuditLog,
} from '@/features/administrator-auditlog/api/administrator-auditlog.api';
import {
  type AuditLogFormState,
  type AuditLogItem,
  initialAuditLogForm,
} from '@/features/administrator-auditlog/model/types';
import { pickAuditLogId, stringifyJson } from '@/features/administrator-auditlog/model/utils';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorAuditlogPage() {
  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [form, setForm] = useState<AuditLogFormState>(initialAuditLogForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const result = await fetchAuditLogs({
          page: safePage,
          limit: targetLimit,
          search,
        });

        if (!result.success) {
          throw new Error(result.message || 'Failed to load audit logs');
        }

        const normalizedItems = (Array.isArray(result.data) ? result.data : []).map((item) => ({
          ...item,
          id: item.id ?? item.uuid,
          uuid: item.uuid ?? item.id,
        }));

        setItems(normalizedItems);
        setPage(typeof result.meta?.page === 'number' ? result.meta.page : safePage);
        setTotalPages(typeof result.meta?.totalPages === 'number' ? result.meta.totalPages : 1);
        setTotalItems(typeof result.meta?.total === 'number' ? result.meta.total : 0);
      } catch (err) {
        setError(extractMessage(err, 'Failed to load audit logs'));
      } finally {
        setLoading(false);
      }
    },
    [limit, page, search],
  );

  useEffect(() => {
    void fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      const result = editingUuid ? await updateAuditLog(editingUuid, form) : await createAuditLog(form);
      if (!result.success) {
        throw new Error(result.message || 'Failed to save audit log');
      }

      setForm(initialAuditLogForm);
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save audit log'));
    } finally {
      setSubmitting(false);
    }
  }, [editingUuid, fetchList, form, page]);

  const onEdit = useCallback((item: AuditLogItem) => {
    const auditLogId = pickAuditLogId(item);
    if (!auditLogId) {
      setError('Audit log ID is missing');
      return;
    }

    setEditingUuid(auditLogId);
    setShowForm(true);
    setForm({
      userId: item.userId ? String(item.userId) : '',
      action: item.action ?? '',
      entityType: item.entityType ?? '',
      entityId: item.entityId ?? '',
      oldData: stringifyJson(item.oldData),
      newData: stringifyJson(item.newData),
      ipAddress: item.ipAddress ?? '',
      userAgent: item.userAgent ?? '',
    });
  }, []);

  const onDelete = useCallback(
    async (auditLogId: string) => {
      const ok = window.confirm('Delete this audit log?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        const result = await deleteAuditLog(auditLogId);
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete audit log');
        }

        if (editingUuid === auditLogId) {
          setEditingUuid(null);
          setForm(initialAuditLogForm);
          setShowForm(false);
        }

        await fetchList(page);
      } catch (err) {
        setError(extractMessage(err, 'Failed to delete audit log'));
      }
    },
    [editingUuid, fetchList, page],
  );

  const openCreate = useCallback(() => {
    setEditingUuid(null);
    setForm(initialAuditLogForm);
    setShowForm(true);
  }, []);

  const backToList = useCallback(() => {
    setEditingUuid(null);
    setForm(initialAuditLogForm);
    setShowForm(false);
  }, []);

  const applySearch = useCallback(() => {
    setPage(1);
    setSearch(searchInput.trim());
  }, [searchInput]);

  const resetSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  }, []);

  const changePage = useCallback(
    (nextPage: number) => {
      if (!Number.isInteger(nextPage) || nextPage < 1) {
        return;
      }
      void fetchList(nextPage);
    },
    [fetchList],
  );

  const refreshList = useCallback(async () => {
    await fetchList(page);
  }, [fetchList, page]);


  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
    void fetchList(1, nextLimit);
  }, [fetchList]);

  return {
    items,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    submitting,
    error,
    setError,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    onSubmit,
    onEdit,
    onDelete,
    openCreate,
    backToList,
    applySearch,
    resetSearch,
    changePage,
    refreshList,
  };
}
