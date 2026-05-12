// Business metric / saved query / system metric option types.

export type BusinessMetricGoal = {
  metric_goal_id: number;
  stakeholder_role: string;
  stakeholder_name: string | null;
  goal_statement: string;
  decision_context: string | null;
  business_question: string | null;
  priority: string;
  owner_name: string | null;
  is_primary: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
};

export type MetricConditionMapping = {
  mapping_id: number;
  semantic_ref: string;
  comparison_type: string;
  value_type: string;
  ui_condition_key: string;
  ui_condition_label: string;
  operator_key: string;
  operator_label: string;
  example_metric_key: string | null;
  example_condition: string | null;
  input_config: Record<string, unknown>;
  metadata: Record<string, unknown>;
  is_default: boolean;
  sort_order: number;
};

export type BusinessMetricOption = {
  metric_id: number;
  metric_key: string;
  label: string;
  short_label: string | null;
  module_key: string;
  description: string | null;
  business_definition: string | null;
  unit: string | null;
  value_type: string;
  comparison_type: string | null;
  source_type: string;
  source_ref: string | null;
  semantic_ref: string | null;
  canonical_semantic_key: string | null;
  semantic_label: string | null;
  semantic_entity_key: string | null;
  semantic_measure_key: string | null;
  semantic_definition: string | null;
  semantic_calculation_summary: string | null;
  system_metric_ref: string | null;
  system_metric_label: string | null;
  system_source_table: string | null;
  system_aggregation_type: string | null;
  supported_dimensions: string[];
  default_filters: Record<string, unknown>;
  tags: string[];
  owner_name: string | null;
  review_status: string;
  goal_count: number;
  goals: BusinessMetricGoal[];
  condition_mapping_count: number;
  condition_mappings: MetricConditionMapping[];
};

export type SavedQueryOption = {
  session_id: string;
  prompt_id: string;
  title: string;
  prompt: string;
  query_sql: string;
  channel: string | null;
  mode: string | null;
  last_prompt_at: string | null;
  created_at: string | null;
};


export type SystemMetricOption = {
  system_metric_id: number;
  metric_key: string;
  label: string;
  module_key: string;
  description: string | null;
  source_table: string | null;
  source_type: string;
  resolver_key: string | null;
  aggregation_type: string | null;
  value_type: string;
  supported_dimensions: string[];
  supported_filters: string[];
  default_filters: Record<string, unknown>;
  tags: string[];
  owner_name: string | null;
  review_status: string;
};
