ALTER TABLE "m0_users"
ADD CONSTRAINT "chk_m0_users_active_requires_warehouse"
CHECK (NOT "is_active" OR "warehouse_id" IS NOT NULL);
