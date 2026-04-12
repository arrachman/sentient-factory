-- Deprecated.
-- Custom dashboard catalog has been simplified to:
--   public.dashboard
--   public.dashboard_widget
--   public.dashboard_widget_query
--   public.dashboard_filter
--
-- Active DDL and seed now live in:
--   pg_create_table_dashboard_catalog_layout.sql
--
-- This file is intentionally a no-op so reruns do not recreate legacy tables:
--   public.dashboard_definition
--   public.dashboard_widget_definition
--   public.dashboard_filter_definition

DO $$
BEGIN
  RAISE NOTICE 'Deprecated: use pg_create_table_dashboard_catalog_layout.sql for dashboard catalog.';
END $$;
