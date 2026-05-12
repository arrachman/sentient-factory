/**
 * Types untuk Administrator Test Workflow page.
 */
export type WorkflowApiPayload = {
  success?: boolean;
  message?: string;
  detail?: unknown;
  data?: {
    request_id?: string | null;
    answer?: string;
    model?: string;
    provider?: string;
    data_source?: string | null;
    workflow_mode?: string | null;
    workflow_passes?: number | null;
    schema_key?: string | null;
    schema_source?: string | null;
    suggested_queries?: Array<{
      sql?: string;
      rationale?: string;
      safety?: string;
    }>;
    query_result?: {
      sql?: string;
      row_count?: number;
      rows?: Array<Record<string, unknown>>;
    } | null;
  };
};

export type WorkflowProgressEvent = {
  event?: string;
  request_id?: string;
  timestamp?: string;
  error?: string;
  data?: WorkflowApiPayload['data'];
  label?: string;
  summary?: string;
  progress?: number;
  [key: string]: unknown;
};

export type WorkflowRequestSnapshot = {
  prompt: string;
  schemaKey: string;
  messagesJson: string;
  includeSchema: boolean;
  includeSamples: boolean;
  executeReadOnlyQuery: boolean;
  fastMode: boolean;
};
