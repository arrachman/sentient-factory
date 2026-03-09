export type CdcEnvelope = {
  topic: string;
  key: string;
  payload: Record<string, unknown>;
};

export type DomainUpsert = {
  tableName: string;
  primaryKey: string;
  row: Record<string, unknown>;
};

type CdcRow = Record<string, unknown> & {
  __deleted?: string | boolean;
};

export function buildDomainUpserts(event: CdcEnvelope): DomainUpsert[] {
  const row = event.payload as CdcRow;

  switch (event.topic) {
    case 'myerpplus.myerpplus.users':
      return [mapUser(row)];
    case 'myerpplus.myerpplus.roles':
      return [mapRole(row)];
    case 'myerpplus.myerpplus.contacts':
      return [mapContact(row)];
    default:
      return [];
  }
}

function mapUser(row: CdcRow): DomainUpsert {
  const id = toNumber(row.UserId);
  const username = toStringValue(row.Username) ?? `myerp-user-${id}`;
  const email = toStringValue(row.Email) ?? `${username}@myerpplus.local`;
  const insertedAt = toDateValue(row.InsertDate) ?? new Date();
  const updatedAt = toDateValue(row.UpdateDate) ?? insertedAt;

  return {
    tableName: 'cdc_myerpplus_users',
    primaryKey: 'source_user_id',
    row: {
      source_user_id: id,
      email,
      username,
      password_hash: toStringValue(row.PasswordHash) ?? 'cdc-import',
      full_name: toStringValue(row.DisplayName) ?? username,
      avatar_url: toStringValue(row.UserImage),
      is_active: toBooleanValue(row.IsActive),
      created_at: insertedAt,
      created_by: toNullableNumber(row.InsertUserId),
      updated_at: updatedAt,
      updated_by: toNullableNumber(row.UpdateUserId),
      deleted_at: isDeleted(row) ? updatedAt : null,
    },
  };
}

function mapRole(row: CdcRow): DomainUpsert {
  const id = toNumber(row.RoleId);
  return {
    tableName: 'cdc_myerpplus_roles',
    primaryKey: 'source_role_id',
    row: {
      source_role_id: id,
      name: toStringValue(row.RoleName) ?? `role-${id}`,
      description: toStringValue(row.RoleKey),
      is_system: false,
      updated_at: new Date(),
      deleted_at: isDeleted(row) ? new Date() : null,
    },
  };
}

function mapContact(row: CdcRow): DomainUpsert {
  const id = toNumber(row.ContactId);
  const firstName = toStringValue(row.FirstName) ?? '';
  const lastName = toStringValue(row.LastName) ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || `Contact ${id}`;

  return {
    tableName: 'cdc_myerpplus_contacts',
    primaryKey: 'source_contact_id',
    row: {
      source_contact_id: id,
      code: `myerp-contact-${id}`,
      name: fullName,
      type: 'customer',
      contact_first_name: firstName || null,
      contact_email: toStringValue(row.Email),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: isDeleted(row) ? new Date() : null,
    },
  };
}

function toStringValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected numeric value but received: ${String(value)}`);
  }
  return parsed;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return toNumber(value);
}

function toBooleanValue(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function toDateValue(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return new Date(numeric);
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isDeleted(row: CdcRow): boolean {
  return row.__deleted === true || String(row.__deleted).toLowerCase() === 'true';
}
