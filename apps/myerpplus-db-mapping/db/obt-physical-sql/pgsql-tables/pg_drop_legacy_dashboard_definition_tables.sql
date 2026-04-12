-- Drop legacy custom dashboard catalog tables after migration to:
--   public.dashboard
--   public.dashboard_widget
--   public.dashboard_widget_query
--   public.dashboard_filter

BEGIN;

DROP TABLE IF EXISTS public.dashboard_filter_definition CASCADE;
DROP TABLE IF EXISTS public.dashboard_widget_definition CASCADE;
DROP TABLE IF EXISTS public.dashboard_definition CASCADE;

COMMIT;
