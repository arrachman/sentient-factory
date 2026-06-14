import type { PromptAttachment } from './attachment-utils';
import type {
  AiChatResult,
  HistorySessionItem,
  PromptAttachmentFile,
  ResultViewKey,
  RunHistoryItem,
  SelectedStreamChart,
  SelectedStreamTable,
  WorkflowStreamEntry,
} from './_types';
import type { buildWorkflowSteps } from './_utils-workflow';

export interface AiWorkflowOptions {
  prompt: string;
  attachments: PromptAttachment[];
  attachmentFiles: PromptAttachmentFile[];
  runHistory: RunHistoryItem[];
  currentSessionKey: string | null;
  activeHistorySession: HistorySessionItem | null;
  currentRequestId: string | null;
  activeRequestIdRef: React.MutableRefObject<string | null>;
  eventSourceRef: React.MutableRefObject<EventSource | null>;
  requestAbortControllerRef: React.MutableRefObject<AbortController | null>;
  workflowStreamEntriesRef: React.MutableRefObject<WorkflowStreamEntry[]>;
  selectedStreamTableRef: React.MutableRefObject<SelectedStreamTable | null>;
  selectedStreamChartRef: React.MutableRefObject<SelectedStreamChart | null>;
  activePromptDraftRef: React.MutableRefObject<string>;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  setSubmittedPrompt: React.Dispatch<React.SetStateAction<string>>;
  setSubmittedAt: React.Dispatch<React.SetStateAction<string>>;
  setAttachments: React.Dispatch<React.SetStateAction<PromptAttachment[]>>;
  setAttachmentFiles: React.Dispatch<React.SetStateAction<PromptAttachmentFile[]>>;
  setSubmittedAttachments: React.Dispatch<React.SetStateAction<PromptAttachment[]>>;
  setAiError: React.Dispatch<React.SetStateAction<string | null>>;
  setAiResult: React.Dispatch<React.SetStateAction<AiChatResult | null>>;
  setIsRunningAi: React.Dispatch<React.SetStateAction<boolean>>;
  setWorkflowSteps: React.Dispatch<React.SetStateAction<ReturnType<typeof buildWorkflowSteps>>>;
  setWorkflowStreamEntries: React.Dispatch<React.SetStateAction<WorkflowStreamEntry[]>>;
  setCurrentRequestId: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentSessionKey: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveStreamDataEntryId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedStreamTable: React.Dispatch<React.SetStateAction<SelectedStreamTable | null>>;
  setSelectedStreamChart: React.Dispatch<React.SetStateAction<SelectedStreamChart | null>>;
  setSelectedDashboardBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  setRunHistory: React.Dispatch<React.SetStateAction<RunHistoryItem[]>>;
  setResultView: React.Dispatch<React.SetStateAction<ResultViewKey>>;
  restoreRightPanelWidth: () => void;
  scrollLeftPanelToBottom: () => void;
  refreshHistoryAfterRun: (sessionKeyOverride?: string | null) => Promise<void>;
  promptTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
}
