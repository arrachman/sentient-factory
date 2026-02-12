import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resetSQL = `
-- 1. MEMBERSIHKAN TABEL LAMA DAN BARU
DROP TABLE IF EXISTS public."m0_auditlog" CASCADE;
DROP TABLE IF EXISTS public."m0_session" CASCADE;
DROP TABLE IF EXISTS public."m0_role_menu" CASCADE;
DROP TABLE IF EXISTS public."m0_role_permission" CASCADE;
DROP TABLE IF EXISTS public."m0_user_department" CASCADE;
DROP TABLE IF EXISTS public."m0_user_role" CASCADE;
DROP TABLE IF EXISTS public."m0_menu" CASCADE;
DROP TABLE IF EXISTS public."m0_users" CASCADE;
DROP TABLE IF EXISTS public."m0_department" CASCADE;
DROP TABLE IF EXISTS public."m0_role" CASCADE;
DROP TABLE IF EXISTS public."m0_permission" CASCADE;

DROP TABLE IF EXISTS public."auditlog" CASCADE;
DROP TABLE IF EXISTS public."session" CASCADE;
DROP TABLE IF EXISTS public."role_menu" CASCADE;
DROP TABLE IF EXISTS public."role_permission" CASCADE;
DROP TABLE IF EXISTS public."user_department" CASCADE;
DROP TABLE IF EXISTS public."user_role" CASCADE;
DROP TABLE IF EXISTS public."menu" CASCADE;
DROP TABLE IF EXISTS public."users" CASCADE;
DROP TABLE IF EXISTS public."user" CASCADE;
DROP TABLE IF EXISTS public."department" CASCADE;
DROP TABLE IF EXISTS public."role" CASCADE;
DROP TABLE IF EXISTS public."permission" CASCADE;

-- 2. FUNGSI TRIGGER UNTUK UPDATE OTOMATIS updated_at
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. TABEL m0_users
CREATE TABLE public."m0_users" (
    id SERIAL PRIMARY KEY,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    full_name text,
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_users_updated_at BEFORE UPDATE ON public."m0_users" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 4. TABEL m0_role
CREATE TABLE public."m0_role" (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_role_updated_at BEFORE UPDATE ON public."m0_role" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 5. TABEL m0_permission
CREATE TABLE public."m0_permission" (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    module text NOT NULL,
    action text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_permission_updated_at BEFORE UPDATE ON public."m0_permission" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 6. TABEL m0_department
CREATE TABLE public."m0_department" (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    parent_id text,
    manager_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_department_updated_at BEFORE UPDATE ON public."m0_department" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 7. TABEL m0_menu
CREATE TABLE public."m0_menu" (
    id SERIAL PRIMARY KEY,
    key text NOT NULL,
    title text NOT NULL,
    path text,
    icon text,
    type text DEFAULT 'ITEM' NOT NULL,
    parent_id text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    permission_name text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_menu_updated_at BEFORE UPDATE ON public."m0_menu" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 8. TABEL m0_role_permission
CREATE TABLE public."m0_role_permission" (
    id SERIAL PRIMARY KEY,
    role_id text NOT NULL,
    permission_id text NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_role_permission_updated_at BEFORE UPDATE ON public."m0_role_permission" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 9. TABEL m0_role_menu
CREATE TABLE public."m0_role_menu" (
    id SERIAL PRIMARY KEY,
    role_id text NOT NULL,
    menu_id text NOT NULL,
    can_view boolean DEFAULT true NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_role_menu_updated_at BEFORE UPDATE ON public."m0_role_menu" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 10. TABEL m0_user_department
CREATE TABLE public."m0_user_department" (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    department_id text NOT NULL,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_user_department_updated_at BEFORE UPDATE ON public."m0_user_department" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 11. TABEL m0_user_role
CREATE TABLE public."m0_user_role" (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    role_id text NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_user_role_updated_at BEFORE UPDATE ON public."m0_user_role" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 12. TABEL m0_auditlog
CREATE TABLE public."m0_auditlog" (
    id SERIAL PRIMARY KEY,
    user_id text,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    old_data jsonb,
    new_data jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_auditlog_updated_at BEFORE UPDATE ON public."m0_auditlog" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 13. TABEL m0_session
CREATE TABLE public."m0_session" (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_m0_session_updated_at BEFORE UPDATE ON public."m0_session" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
`;

async function main() {
  console.log('Resetting database with m0_* schema...');
  try {
    await prisma.$executeRawUnsafe(resetSQL);
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
