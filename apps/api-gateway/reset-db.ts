import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resetSQL = `
-- 1. MEMBERSIHKAN TABEL LAMA
DROP TABLE IF EXISTS public."auditlog" CASCADE;
DROP TABLE IF EXISTS public."session" CASCADE;
DROP TABLE IF EXISTS public."role_permission" CASCADE;
DROP TABLE IF EXISTS public."user_department" CASCADE;
DROP TABLE IF EXISTS public."user_role" CASCADE;
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

-- 3. TABEL user
CREATE TABLE public."user" (
    id SERIAL PRIMARY KEY,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    full_name text,
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp(3) without time zone,
    -- Audit Columns (Snake Case)
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    -- UUID di belakang
    uuid text NOT NULL
);
CREATE TRIGGER tr_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 4. TABEL role
CREATE TABLE public."role" (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    is_system boolean DEFAULT false NOT NULL,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_role_updated_at BEFORE UPDATE ON public."role" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 5. TABEL permission
CREATE TABLE public."permission" (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    module text NOT NULL,
    action text NOT NULL,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_permission_updated_at BEFORE UPDATE ON public."permission" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 6. TABEL department
CREATE TABLE public."department" (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    parent_id text,
    manager_id text,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_department_updated_at BEFORE UPDATE ON public."department" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 7. TABEL role_permission
CREATE TABLE public."role_permission" (
    id SERIAL PRIMARY KEY,
    role_id text NOT NULL,
    permission_id text NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_rolepermission_updated_at BEFORE UPDATE ON public."role_permission" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 8. TABEL user_department
CREATE TABLE public."user_department" (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    department_id text NOT NULL,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_userdepartment_updated_at BEFORE UPDATE ON public."user_department" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 9. TABEL user_role
CREATE TABLE public."user_role" (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    role_id text NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_userrole_updated_at BEFORE UPDATE ON public."user_role" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 10. TABEL auditlog
CREATE TABLE public."auditlog" (
    id SERIAL PRIMARY KEY,
    user_id text,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    old_data jsonb,
    new_data jsonb,
    ip_address text,
    user_agent text,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_auditlog_updated_at BEFORE UPDATE ON public."auditlog" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 11. TABEL session
CREATE TABLE public."session" (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    ip_address text,
    user_agent text,
    -- Audit Columns
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    uuid text NOT NULL
);
CREATE TRIGGER tr_session_updated_at BEFORE UPDATE ON public."session" FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
`;

async function main() {
  console.log('Resetting database with new schema...');
  try {
    // Execute entire SQL as one statement
    console.log('Executing SQL...');
    await prisma.$executeRawUnsafe(resetSQL);
    
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
    }

    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
