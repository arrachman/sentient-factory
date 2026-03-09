import { Client } from 'pg';

type MirrorUser = {
  source_user_id: number;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  deleted_at: Date | null;
};

type MirrorRole = {
  source_role_id: number;
  name: string;
  description: string | null;
  deleted_at: Date | null;
};

type MirrorContact = {
  source_contact_id: number;
  code: string;
  name: string;
  type: string;
  contact_first_name: string | null;
  contact_email: string | null;
  deleted_at: Date | null;
};

export async function mergeCoreByTopic(db: Client, topic: string, payload: Record<string, unknown>) {
  switch (topic) {
    case 'myerpplus.myerpplus.users':
      await mergeUserRow(db, payload as unknown as MirrorUser);
      break;
    case 'myerpplus.myerpplus.roles':
      await mergeRoleRow(db, payload as unknown as MirrorRole);
      break;
    case 'myerpplus.myerpplus.contacts':
      await mergeContactRow(db, payload as unknown as MirrorContact);
      break;
    default:
      break;
  }
}

export async function mergeCoreFromUpsert(db: Client, tableName: string, row: Record<string, unknown>) {
  switch (tableName) {
    case 'cdc_myerpplus_users':
      await mergeUserRow(db, row as unknown as MirrorUser);
      break;
    case 'cdc_myerpplus_roles':
      await mergeRoleRow(db, row as unknown as MirrorRole);
      break;
    case 'cdc_myerpplus_contacts':
      await mergeContactRow(db, row as unknown as MirrorContact);
      break;
    default:
      break;
  }
}

export async function mergeAllCore(db: Client) {
  const users = await db.query<MirrorUser>('SELECT source_user_id, email, username, full_name, avatar_url, deleted_at FROM cdc_myerpplus_users ORDER BY source_user_id');
  for (const row of users.rows) {
    await mergeUserRow(db, row);
  }

  const roles = await db.query<MirrorRole>('SELECT source_role_id, name, description, deleted_at FROM cdc_myerpplus_roles ORDER BY source_role_id');
  for (const row of roles.rows) {
    await mergeRoleRow(db, row);
  }

  const contacts = await db.query<MirrorContact>('SELECT source_contact_id, code, name, type, contact_first_name, contact_email, deleted_at FROM cdc_myerpplus_contacts ORDER BY source_contact_id');
  for (const row of contacts.rows) {
    await mergeContactRow(db, row);
  }

  return { users: users.rows.length, roles: roles.rows.length, contacts: contacts.rows.length };
}

async function mergeUserRow(db: Client, row: MirrorUser) {
  let coreUserId: number | null = null;
  let matchedBy = 'inserted';

  const mapped = await db.query<{ core_user_id: number }>('SELECT core_user_id FROM cdc_myerpplus_user_core_map WHERE source_user_id = $1', [row.source_user_id]);
  if (mapped.rowCount) {
    coreUserId = mapped.rows[0].core_user_id;
    matchedBy = 'mapping';
  } else {
    const byUsername = await db.query<{ id: number }>('SELECT id FROM m0_users WHERE lower(username) = lower($1) LIMIT 1', [row.username]);
    if (byUsername.rowCount) {
      coreUserId = byUsername.rows[0].id;
      matchedBy = 'username';
    } else {
      const byEmail = await db.query<{ id: number }>('SELECT id FROM m0_users WHERE lower(email) = lower($1) LIMIT 1', [row.email]);
      if (byEmail.rowCount) {
        coreUserId = byEmail.rows[0].id;
        matchedBy = 'email';
      }
    }
  }

  if (coreUserId) {
    const taken = await isCoreIdTaken(db, 'cdc_myerpplus_user_core_map', 'core_user_id', 'source_user_id', coreUserId, row.source_user_id);
    if (taken) {
      coreUserId = null;
      matchedBy = 'inserted';
    }
  }

  if (coreUserId) {
    await db.query(
      `UPDATE m0_users
       SET full_name = COALESCE($2, full_name),
           avatar_url = COALESCE($3, avatar_url),
           deleted_at = $4,
           updated_at = NOW()
       WHERE id = $1`,
      [coreUserId, row.full_name, row.avatar_url, row.deleted_at],
    );
  } else {
    const email = await buildSafeUserEmail(db, row);
    const inserted = await db.query<{ id: number }>(
      `INSERT INTO m0_users (email, username, password_hash, full_name, avatar_url, is_active, warehouse_id, created_at, updated_at, deleted_at)
       VALUES ($1, $2, $3, $4, $5, false, NULL, NOW(), NOW(), $6)
       RETURNING id`,
      [email, row.username, 'cdc-import-locked', row.full_name, row.avatar_url, row.deleted_at],
    );
    coreUserId = inserted.rows[0].id;
  }

  await db.query(
    `INSERT INTO cdc_myerpplus_user_core_map (source_user_id, core_user_id, matched_by, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     ON CONFLICT (source_user_id)
     DO UPDATE SET core_user_id = EXCLUDED.core_user_id, matched_by = EXCLUDED.matched_by, updated_at = NOW()`,
    [row.source_user_id, coreUserId, matchedBy],
  );
}

async function mergeRoleRow(db: Client, row: MirrorRole) {
  let coreRoleId: number | null = null;
  let matchedBy = 'inserted';

  const mapped = await db.query<{ core_role_id: number }>('SELECT core_role_id FROM cdc_myerpplus_role_core_map WHERE source_role_id = $1', [row.source_role_id]);
  if (mapped.rowCount) {
    coreRoleId = mapped.rows[0].core_role_id;
    matchedBy = 'mapping';
  } else {
    const existing = await db.query<{ id: number }>('SELECT id FROM m0_role WHERE lower(name) = lower($1) LIMIT 1', [row.name]);
    if (existing.rowCount) {
      coreRoleId = existing.rows[0].id;
      matchedBy = 'name';
    }
  }

  if (coreRoleId) {
    const taken = await isCoreIdTaken(db, 'cdc_myerpplus_role_core_map', 'core_role_id', 'source_role_id', coreRoleId, row.source_role_id);
    if (taken) {
      coreRoleId = null;
      matchedBy = 'inserted';
    }
  }

  if (coreRoleId) {
    await db.query(
      `UPDATE m0_role
       SET description = COALESCE(m0_role.description, $2),
           deleted_at = $3,
           updated_at = NOW()
       WHERE id = $1`,
      [coreRoleId, row.description, row.deleted_at],
    );
  } else {
    const inserted = await db.query<{ id: number }>(
      `INSERT INTO m0_role (name, description, is_system, created_at, updated_at, deleted_at)
       VALUES ($1, $2, false, NOW(), NOW(), $3)
       RETURNING id`,
      [row.name, row.description, row.deleted_at],
    );
    coreRoleId = inserted.rows[0].id;
  }

  await db.query(
    `INSERT INTO cdc_myerpplus_role_core_map (source_role_id, core_role_id, matched_by, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     ON CONFLICT (source_role_id)
     DO UPDATE SET core_role_id = EXCLUDED.core_role_id, matched_by = EXCLUDED.matched_by, updated_at = NOW()`,
    [row.source_role_id, coreRoleId, matchedBy],
  );
}

async function mergeContactRow(db: Client, row: MirrorContact) {
  let coreContactId: number | null = null;
  let matchedBy = 'inserted';

  const mapped = await db.query<{ core_contact_id: number }>('SELECT core_contact_id FROM cdc_myerpplus_contact_core_map WHERE source_contact_id = $1', [row.source_contact_id]);
  if (mapped.rowCount) {
    coreContactId = mapped.rows[0].core_contact_id;
    matchedBy = 'mapping';
  } else {
    const byCode = await db.query<{ id: number }>('SELECT id FROM m1_contact WHERE lower(code) = lower($1) LIMIT 1', [row.code]);
    if (byCode.rowCount) {
      coreContactId = byCode.rows[0].id;
      matchedBy = 'code';
    } else {
      const byName = await db.query<{ id: number }>('SELECT id FROM m1_contact WHERE lower(name) = lower($1) AND lower(type) = lower($2) LIMIT 1', [row.name, row.type]);
      if (byName.rowCount) {
        coreContactId = byName.rows[0].id;
        matchedBy = 'name_type';
      }
    }
  }

  if (coreContactId) {
    const taken = await isCoreIdTaken(db, 'cdc_myerpplus_contact_core_map', 'core_contact_id', 'source_contact_id', coreContactId, row.source_contact_id);
    if (taken) {
      coreContactId = null;
      matchedBy = 'inserted';
    }
  }

  if (coreContactId) {
    await db.query(
      `UPDATE m1_contact
       SET contact_first_name = COALESCE($2, contact_first_name),
           contact_email = COALESCE($3, contact_email),
           deleted_at = $4,
           updated_at = NOW()
       WHERE id = $1`,
      [coreContactId, row.contact_first_name, row.contact_email, row.deleted_at],
    );
  } else {
    const safeCode = await buildSafeContactCode(db, row);
    const inserted = await db.query<{ id: number }>(
      `INSERT INTO m1_contact (code, name, type, contact_first_name, contact_email, created_at, updated_at, deleted_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6)
       RETURNING id`,
      [safeCode, row.name, row.type, row.contact_first_name, row.contact_email, row.deleted_at],
    );
    coreContactId = inserted.rows[0].id;
  }

  await db.query(
    `INSERT INTO cdc_myerpplus_contact_core_map (source_contact_id, core_contact_id, matched_by, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     ON CONFLICT (source_contact_id)
     DO UPDATE SET core_contact_id = EXCLUDED.core_contact_id, matched_by = EXCLUDED.matched_by, updated_at = NOW()`,
    [row.source_contact_id, coreContactId, matchedBy],
  );
}

async function buildSafeUserEmail(db: Client, row: MirrorUser) {
  const exact = await db.query('SELECT 1 FROM m0_users WHERE lower(email) = lower($1) LIMIT 1', [row.email]);
  if (!exact.rowCount) {
    return row.email;
  }
  return `source_user_${row.source_user_id}@myerpplus.local`;
}

async function buildSafeContactCode(db: Client, row: MirrorContact) {
  const exact = await db.query('SELECT 1 FROM m1_contact WHERE lower(code) = lower($1) LIMIT 1', [row.code]);
  if (!exact.rowCount) {
    return row.code;
  }
  return `${row.code}-${row.source_contact_id}`;
}

async function isCoreIdTaken(
  db: Client,
  tableName: string,
  coreColumn: string,
  sourceColumn: string,
  coreId: number,
  sourceId: number,
) {
  const query = `SELECT 1 FROM ${tableName} WHERE ${coreColumn} = $1 AND ${sourceColumn} <> $2 LIMIT 1`;
  const result = await db.query(query, [coreId, sourceId]);
  return (result.rowCount ?? 0) > 0;
}
