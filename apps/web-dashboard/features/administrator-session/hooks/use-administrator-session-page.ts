import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import {
  createSession,
  deleteSession,
  fetchSessions,
  fetchSessionUsers,
  updateSession,
} from '@/features/administrator-session/api/administrator-session.api';
import {
  type AdministratorSession,
  initialSessionForm,
  type SessionFormState,
  type UserOption,
} from '@/features/administrator-session/model/types';
import { formatUserLabel, pickSessionId, toDatetimeLocal, toEntityId } from '@/features/administrator-session/model/utils';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorSessionPage() {
  const [items, setItems] = useState<AdministratorSession[]>([]);
  const [form, setForm] = useState<SessionFormState>(initialSessionForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<UserOption[]>([]);
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
        const result = await fetchSessions({
          page: safePage,
          limit: targetLimit,
          search,
        });

        if (!result.success) {
          throw new Error(result.message || 'Failed to load sessions');
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
        setError(extractMessage(err, 'Failed to load sessions'));
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await fetchSessionUsers();
        if (!result.success) {
          return;
        }

        const options = (Array.isArray(result.data) ? result.data : [])
          .map((item) => {
            const id = toEntityId(item.id ?? item.uuid);
            if (!id) {
              return null;
            }
            return {
              value: id,
              label: formatUserLabel(item),
            };
          })
          .filter((item): item is UserOption => Boolean(item));

        setUsers(options);
      } catch {
        setUsers([]);
      }
    };

    void fetchUsers();
  }, []);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      const result = editingUuid ? await updateSession(editingUuid, form) : await createSession(form);
      if (!result.success) {
        throw new Error(result.message || 'Failed to save session');
      }

      setForm(initialSessionForm);
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(extractMessage(err, 'Failed to save session'));
    } finally {
      setSubmitting(false);
    }
  }, [editingUuid, fetchList, form, page]);

  const onEdit = useCallback((item: AdministratorSession) => {
    const sessionId = pickSessionId(item);
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    setEditingUuid(sessionId);
    setShowForm(true);
    setForm({
      userId: toEntityId(item.userId),
      token: item.token ?? '',
      expiresAt: toDatetimeLocal(item.expiresAt),
      ipAddress: item.ipAddress ?? '',
      userAgent: item.userAgent ?? '',
    });
  }, []);

  const onDelete = useCallback(
    async (sessionId: string) => {
      const ok = window.confirm('Delete this session?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        const result = await deleteSession(sessionId);
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete session');
        }

        if (editingUuid === sessionId) {
          setEditingUuid(null);
          setForm(initialSessionForm);
          setShowForm(false);
        }

        await fetchList(page);
      } catch (err) {
        setError(extractMessage(err, 'Failed to delete session'));
      }
    },
    [editingUuid, fetchList, page],
  );

  const refreshList = useCallback(async () => {
    await fetchList(page);
  }, [fetchList, page]);

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

  const openCreate = useCallback(() => {
    setEditingUuid(null);
    setForm(initialSessionForm);
    setShowForm(true);
  }, []);

  const backToList = useCallback(() => {
    setEditingUuid(null);
    setForm(initialSessionForm);
    setShowForm(false);
  }, []);


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
    users,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    refreshList,
    applySearch,
    resetSearch,
    changePage,
    openCreate,
    onSubmit,
    onEdit,
    onDelete,
    backToList,
  };
}
