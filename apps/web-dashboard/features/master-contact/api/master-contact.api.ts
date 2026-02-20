import type { ApiEnvelope } from '@/shared/types/api';
import { requestJson } from '@/shared/api/http';
import type {
  ContactFormState,
  MasterDataCity,
  MasterDataContact,
} from '@/features/master-contact/model/types';

export async function fetchContacts(params: { page: number; limit: number; search?: string }): Promise<ApiEnvelope<MasterDataContact[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  return requestJson<MasterDataContact[]>(`/api/master-data-contacts?${query.toString()}`);
}

export async function fetchContactCities(): Promise<ApiEnvelope<MasterDataCity[]>> {
  const query = new URLSearchParams({ page: '1', limit: '100' });
  return requestJson<MasterDataCity[]>(`/api/master-data-cities?${query.toString()}`);
}

export async function fetchContactById(uuid: string): Promise<ApiEnvelope<MasterDataContact>> {
  return requestJson<MasterDataContact>(`/api/master-data-contacts/${uuid}`);
}

export async function createContact(payload: ContactFormState): Promise<ApiEnvelope<MasterDataContact>> {
  return requestJson<MasterDataContact>('/api/master-data-contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateContact(uuid: string, payload: ContactFormState): Promise<ApiEnvelope<MasterDataContact>> {
  return requestJson<MasterDataContact>(`/api/master-data-contacts/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteContact(uuid: string): Promise<ApiEnvelope<MasterDataContact>> {
  return requestJson<MasterDataContact>(`/api/master-data-contacts/${uuid}`, {
    method: 'DELETE',
  });
}
