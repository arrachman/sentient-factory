/**
 * Pure helper functions for the clinic-psikolog domain.
 * No Prisma/service dependencies — safe to import anywhere.
 */
import { BadRequestException } from '@nestjs/common';

export function deriveUsername(email: string, fullName: string): string {
  // Prefer slug from fullName, fallback to email local-part
  const fromName = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (fromName.length >= 3) return fromName;
  return email.split('@')[0]?.toLowerCase() || `psikolog-${Date.now()}`;
}

export function userSelect() {
  return {
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      phone: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
  };
}

export function mapPsikologToResponse(
  user: {
    id: number;
    email: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    phone: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
  },
  profile: {
    id: number;
    title: string | null;
    specialty: string[];
    color: string | null;
    license: string | null;
    defaultSlots: number;
    weeklyAvailability?: unknown;
    bio: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  },
  serviceIds: number[] = [],
) {
  return {
    id: profile.id,
    userId: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    isActive: profile.isActive && user.isActive,
    title: profile.title,
    specialty: profile.specialty,
    color: profile.color,
    license: profile.license,
    defaultSlots: profile.defaultSlots,
    weeklyAvailability: (profile.weeklyAvailability ?? {}) as Record<
      string,
      { isOpen: boolean; slotIndices?: number[] }
    >,
    /**
     * Layanan yang ditangani psikolog. Kosong = handle SEMUA service
     * (default). Filled = hanya subset yang di-list.
     */
    serviceIds,
    bio: profile.bio,
    lastLogin: user.lastLogin,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

/**
 * Validate avatarUrl format + size.
 * Throws BadRequestException on invalid input.
 */
export function validateAvatarUrl(avatarUrl: string | null | undefined): void {
  if (!avatarUrl) return;

  const isDataUrl = avatarUrl.startsWith('data:image/');
  const isHttpUrl = avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');
  if (!isDataUrl && !isHttpUrl) {
    throw new BadRequestException(
      'avatarUrl harus data URL (data:image/...;base64,...) atau URL absolut',
    );
  }
  if (isDataUrl && avatarUrl.length > 1_500_000) {
    throw new BadRequestException('Foto terlalu besar — maksimal ~1MB setelah resize');
  }
}
