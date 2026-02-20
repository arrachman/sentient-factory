import {
  createContact,
  deleteContact,
  fetchContactById,
  fetchContactCities,
  fetchContacts,
  updateContact,
} from '@/features/master-contact/api/master-contact.api';
import type { ContactFormState } from '@/features/master-contact/model/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMasterContactListQuery(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: ['master-contact', { page, limit, search }],
    queryFn: () => fetchContacts({ page, limit, search }),
  });
}

export function useMasterContactCitiesQuery() {
  return useQuery({
    queryKey: ['master-contact-cities'],
    queryFn: fetchContactCities,
  });
}

export function useMasterContactByIdQuery(uuid: string, enabled = true) {
  return useQuery({
    queryKey: ['master-contact', uuid],
    queryFn: () => fetchContactById(uuid),
    enabled: enabled && Boolean(uuid),
  });
}

export function useCreateMasterContactMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContactFormState) => createContact(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['master-contact'] });
    },
  });
}

export function useUpdateMasterContactMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: ContactFormState }) =>
      updateContact(uuid, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['master-contact'] });
    },
  });
}

export function useDeleteMasterContactMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteContact(uuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['master-contact'] });
    },
  });
}
