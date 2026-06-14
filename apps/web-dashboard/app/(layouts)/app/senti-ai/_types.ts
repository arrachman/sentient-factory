// Types for senti-ai page. Extracted dari page.tsx untuk batas 400-baris.

export type AiModeKey = 'ask' | 'transform' | 'monitor';

export type RunHistoryItem = {
  sessionId?: string | null;
  sessionKey?: string | null;
  promptId?: string | null;
  requestId?: string | null;
  prompt: string;
  mode: AiModeKey;
  confidence: number;
  time: string;
  pinned: boolean;
  result?: AiChatResult | null;
  table?: SelectedStreamTable | null;
  chart?: SelectedStreamChart | null;
  streamEntries?: WorkflowStreamEntry[];
  error?: string | null;
};

export type HistorySessionItem = {
  id: string;
  session_key: string;
  user_id?: number | null;
  username?: string | null;
  channel: string;
  mode: AiModeKey;
  title?: string | null;
  status: string;
  started_at: string;
  ended_at?: string | null;
  last_prompt_at?: string | null;
  prompt_count: number;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type HistoryPromptItem = {
  id: string;
  session_id: string;
  request_id: string;
  turn_index: number;
  prompt_text: string;
  started_response?: string | null;
  explanation_response?: string | null;
  insight_response?: string | null;
  answer_text?: string | null;
  answer_json?: Record<string, unknown> | null;
  status: string;
  failure_type?: string | null;
  failure_message?: string | null;
  schema_key?: string | null;
  schema_source?: string | null;
  workflow_mode?: string | null;
  workflow_passes?: number | null;
  include_schema?: boolean;
  model?: string | null;
  provider?: string | null;
  data_source?: string | null;
  query_sql?: string | null;
  query_result?: AiChatResult['query_result'] | null;
  parsed_answer?: Record<string, unknown> | null;
  duration_ms?: number | null;
  prompt_created_at: string;
  completed_at?: string | null;
};

export type HistoryPromptEventItem = {
  id: number;
  prompt_id: string;
  request_id: string;
  event_name: string;
  event_type?: 'chain_of_thought' | 'data' | 'insight' | 'explanation' | 'failed' | null;
  progress?: number | null;
  label?: string | null;
  response_text?: string | null;
  payload?: Record<string, unknown> | null;
  created_at: string;
};

export type HistoryPromptDetail = {
  prompt: HistoryPromptItem;
  events: HistoryPromptEventItem[];
};

export type StepType =
  | 'thought'
  | 'commentary'
  | 'read_query'
  | 'generate_query'
  | 'chart_insight'
  | 'ai_insight'
  | 'summary';

export interface BaseStep {
  type: StepType;
}

export interface ThoughtStep extends BaseStep {
  type: 'thought';
  content: string;
}

export interface CommentaryStep extends BaseStep {
  type: 'commentary';
  content: string;
}

export interface ReadQueryStep extends BaseStep {
  type: 'read_query';
  target: string;
  description?: string;
}

export interface GenerateQueryStep extends BaseStep {
  type: 'generate_query';
  query_string: string;
  description: string;
  rows_affected?: number;
}

export interface ChartInsightStep extends BaseStep {
  type: 'chart_insight';
  chart_type: string;
  title: string;
  description: string;
}

export interface AiInsightSpecificStep extends BaseStep {
  type: 'ai_insight';
  finding: string;
  recommendation?: string;
}

export interface SummaryStep extends BaseStep {
  type: 'summary';
  content: string;
}

export type AiInsightStep =
  | ThoughtStep
  | CommentaryStep
  | ReadQueryStep
  | GenerateQueryStep
  | ChartInsightStep
  | AiInsightSpecificStep
  | SummaryStep;

export interface AiInsightLog {
  id: number;
  user_prompt: string;
  steps: AiInsightStep[];
}

export type AiSchemaTable = {
  schema: string;
  name: string;
  row_count_estimate?: number | null;
  primary_key: string[];
  columns: Array<{
    name: string;
    data_type: string;
    nullable: boolean;
  }>;
};

export type AiChatResult = {
  request_id?: string;
  answer: string;
  model: string;
  provider: string;
  data_source?: string | null;
  execution_status?: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED' | null;
  workflow_mode?: string;
  workflow_passes?: number;
  schema_key?: string;
  schema_source?: string;
  semantic_schema?: {
    tables: AiSchemaTable[];
  } | null;
  query_result?: {
    sql: string;
    row_count: number;
    columns: Array<{
      name: string;
    }>;
    rows: Array<Record<string, string | number | boolean | null>>;
  } | null;
  generated_queries?: Array<{
    id: string;
    name?: string | null;
    purpose: string;
    query: string;
    result_kind?: string | null;
  }>;
  query_results?: Array<{
    query_id: string;
    sql: string;
    success: boolean;
    error_message?: string | null;
    row_count: number;
    columns: Array<{
      name: string;
    }>;
    rows: Array<Record<string, string | number | boolean | null>>;
  }>;
  visualizations?: Array<{
    id: string;
    query_id: string;
    title: string;
    chart_type: 'table' | 'bar' | 'line' | 'pie' | 'stacked_bar';
    x_axis?: string | null;
    y_axis?: string[];
  }>;
  suggested_queries?: Array<{
    sql: string;
    rationale: string;
    safety: 'read_only';
  }>;
};

export type WorkflowStepStatus = 'pending' | 'active' | 'done';

export type WorkflowStep = {
  key: string;
  title: string;
  detail: string;
  status: WorkflowStepStatus;
};

export type WorkflowStreamEntry = {
  id: string;
  event: string;
  receivedAt: string;
  payload: string;
  kind?: 'user' | 'event';
};

export type WorkflowEventName =
  | 'started'
  | 'schema_selected'
  | 'query_execution_started'
  | 'query_execution_completed'
  | 'ai_insight_started'
  | 'ai_insight_completed'
  | 'analysis_started'
  | 'analysis_done'
  | 'draft_started'
  | 'draft_done'
  | 'review_started'
  | 'review_done'
  | 'completed'
  | 'failed';

export type PromptAttachmentFile = {
  id: string;
  file: File;
};

export type ResultViewKey = 'table' | 'chart';

export type WorkflowStreamPayload = {
  event?: WorkflowEventName;
  error?: string;
  label?: string;
  summary?: string;
  prompt_preview?: string;
  type?: 'chain_of_thought' | 'data' | 'insight' | 'explanation' | 'failed';
  response?: unknown;
  data?: AiChatResult;
};

export type WorkflowStreamDisplayPayload =
  | { kind: 'none'; text: string }
  | { kind: 'data'; text: string }
  | { kind: 'insight'; text: string }
  | { kind: 'explanation'; text: string }
  | { kind: 'raw'; text: string };

export type SelectedStreamTable = {
  title: string;
  columns: string[];
  rows: Array<Record<string, string>>;
};

export type SelectedStreamChart = {
  title: string;
  labels: string[];
  values: number[];
  valueLabel: string;
};

export type DashboardVisualizationBlock = {
  id: string;
  title: string;
  chartType: 'table' | 'bar' | 'line' | 'pie' | 'stacked_bar';
  table: SelectedStreamTable | null;
  chart: SelectedStreamChart | null;
};

export type DashboardPinTarget = {
  dashboard_id: string;
  dashboard_key: string;
  dashboard_title: string;
  menu_id: string;
  menu_key: string;
  menu_title: string;
  route_path: string;
};
