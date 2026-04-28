-- Metric alert builder context view.
-- Purpose:
--   1. Menyediakan satu row per business metric untuk kebutuhan alert-rule builder.
--   2. Menggabungkan business metric + semantic metric + system metric + goals + UI condition mapping.
--   3. Mengurangi join manual di backend/frontend saat menampilkan context metric.

CREATE OR REPLACE VIEW public.v_metric_alert_builder_context AS
WITH goal_agg AS (
  SELECT
    g.metric_id,
    jsonb_agg(
      jsonb_build_object(
        'metric_goal_id', g.metric_goal_id,
        'stakeholder_role', g.stakeholder_role,
        'stakeholder_name', g.stakeholder_name,
        'goal_statement', g.goal_statement,
        'decision_context', g.decision_context,
        'business_question', g.business_question,
        'priority', g.priority,
        'owner_name', g.owner_name,
        'is_primary', g.is_primary,
        'sort_order', g.sort_order,
        'metadata', g.metadata
      )
      ORDER BY g.is_primary DESC, g.sort_order ASC, g.metric_goal_id ASC
    ) AS goals,
    count(*) AS goal_count
  FROM public.metric_business_goal g
  WHERE g.deleted_at IS NULL
    AND g.is_active = true
  GROUP BY g.metric_id
),
condition_agg AS (
  SELECT
    b.metric_id,
    jsonb_agg(
      jsonb_build_object(
        'mapping_id', c.mapping_id,
        'semantic_ref', c.semantic_ref,
        'comparison_type', c.comparison_type,
        'value_type', c.value_type,
        'ui_condition_key', c.ui_condition_key,
        'ui_condition_label', c.ui_condition_label,
        'operator_key', c.operator_key,
        'operator_label', c.operator_label,
        'example_metric_key', c.example_metric_key,
        'example_condition', c.example_condition,
        'input_config', c.input_config,
        'metadata', c.metadata,
        'is_default', c.is_default,
        'sort_order', c.sort_order
      )
      ORDER BY c.is_default DESC, c.sort_order ASC, c.mapping_id ASC
    ) AS condition_mappings,
    count(*) AS condition_mapping_count
  FROM public.metric_business_registry b
  JOIN public.metric_condition_ui_mapping c
    ON c.semantic_ref = b.semantic_ref
   AND c.deleted_at IS NULL
   AND c.is_active = true
  WHERE b.deleted_at IS NULL
  GROUP BY b.metric_id
)
SELECT
  b.metric_id,
  b.metric_key,
  b.label,
  b.short_label,
  b.module_key,
  b.description,
  b.business_definition,
  b.unit,
  b.value_type,
  b.comparison_type,
  b.semantic_ref,
  s.canonical_semantic_key,
  s.label AS semantic_label,
  s.entity_key AS semantic_entity_key,
  s.measure_key AS semantic_measure_key,
  s.definition AS semantic_definition,
  s.calculation_summary AS semantic_calculation_summary,
  b.system_metric_ref,
  sys.label AS system_metric_label,
  sys.source_table AS system_source_table,
  sys.aggregation_type AS system_aggregation_type,
  b.source_type,
  b.source_ref,
  b.supported_dimensions,
  b.default_filters,
  b.tags,
  b.owner_name,
  b.review_status,
  b.is_active,
  b.sort_order,
  COALESCE(g.goal_count, 0) AS goal_count,
  COALESCE(g.goals, '[]'::jsonb) AS goals,
  COALESCE(c.condition_mapping_count, 0) AS condition_mapping_count,
  COALESCE(c.condition_mappings, '[]'::jsonb) AS condition_mappings,
  b.created_at,
  b.updated_at
FROM public.metric_business_registry b
LEFT JOIN public.metric_semantic_registry s
  ON s.semantic_key = b.semantic_ref
LEFT JOIN public.metric_system_registry sys
  ON sys.metric_key = b.system_metric_ref
LEFT JOIN goal_agg g
  ON g.metric_id = b.metric_id
LEFT JOIN condition_agg c
  ON c.metric_id = b.metric_id
WHERE b.deleted_at IS NULL;
