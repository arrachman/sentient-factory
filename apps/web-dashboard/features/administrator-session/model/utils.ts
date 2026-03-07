import type { AdministratorSession, UserApiItem } from '@/features/administrator-session/model/types';

export function toEntityId(value: unknown): string {
  if (value == null) {
    return '';
  }
  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }
  return id;
}

export function pickSessionId(item?: AdministratorSession | null): string {
  return toEntityId(item?.id ?? item?.uuid);
}

export function toDatetimeLocal(value?: string | null): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

export function fromDatetimeLocal(value: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString();
}

export function formatDate(value?: string): string {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleString();
}

export function formatRemainingTime(value?: string): string {
  if (!value) {
    return '-';
  }

  const expiresAt = new Date(value);
  if (Number.isNaN(expiresAt.getTime())) {
    return '-';
  }

  const diffMs = expiresAt.getTime() - Date.now();
  if (diffMs <= 0) {
    return 'Expired';
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}h ${hours}j ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }

  return `${minutes}m`;
}

export function formatUserLabel(user: UserApiItem): string {
  const fullName = user.fullName?.trim();
  const username = user.username?.trim();
  const email = user.email?.trim();
  const main = fullName || username || email || 'User';
  const sub = username && email ? `${username} • ${email}` : username || email || '';
  return sub && sub !== main ? `${main} (${sub})` : main;
}
