/**
 * Route-sync effects untuk Administrator Menu — buka form add/update otomatis
 * berdasarkan path & query string. Dipisah dari hook utama supaya
 * `use-administrator-menu-page.ts` tetap < 400 LOC.
 */
import { useEffect } from 'react';
import {
  type AdministratorMenu,
  type AdministratorMenuFormState,
  initialAdministratorMenuForm,
} from '@/features/administrator-menu/model/types';
import { fetchMenuDetail } from './use-administrator-menu-api';

export type RouteSyncArgs = {
  isAddRoute: boolean;
  isUpdateRoute: boolean;
  updateId: string;
  items: AdministratorMenu[];
  showForm: boolean;
  headers?: HeadersInit;
  setShowForm: (value: boolean) => void;
  setEditingId: (value: string | null) => void;
  setForm: (value: AdministratorMenuFormState) => void;
  setError: (value: string) => void;
  onEdit: (item: AdministratorMenu) => void;
};

export function useAdministratorMenuRouteSync({
  isAddRoute,
  isUpdateRoute,
  updateId,
  items,
  showForm,
  headers,
  setShowForm,
  setEditingId,
  setForm,
  setError,
  onEdit,
}: RouteSyncArgs) {
  // Add route: open empty form.
  useEffect(() => {
    if (!isAddRoute || showForm) return;
    setEditingId(null);
    setForm(initialAdministratorMenuForm);
    setShowForm(true);
  }, [isAddRoute, showForm, setEditingId, setForm, setShowForm]);

  // Update route: open form, hydrate from list or fetch detail.
  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) return;

    const id = Number(updateId);
    if (!Number.isInteger(id)) return;

    const item = items.find((row) => row.id === id);
    if (item) {
      onEdit(item);
      return;
    }

    let cancelled = false;

    (async () => {
      setError('');
      try {
        const detail = await fetchMenuDetail(id, headers);
        if (!cancelled) onEdit(detail);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load menu detail',
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [headers, isUpdateRoute, items, onEdit, showForm, updateId, setError]);
}
