/**
 * Types untuk prompt attachment di senti-ai.
 */
export type PromptAttachmentStatus = 'ready' | 'metadata-only' | 'failed';

export type PromptAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  extension: string;
  addedAt: number;
  previewUrl?: string | null;
  status: PromptAttachmentStatus;
  content: string;
  preview: string;
  warning?: string | null;
  metadata: Record<string, string | number | boolean | null>;
};

export type ParsedAttachmentPayload = Omit<PromptAttachment, 'previewUrl'>;

export const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
export const PREVIEW_LIMIT = 240;
export const CONTENT_LIMIT = 12_000;
export const PRINTABLE_TEXT_PATTERN =
  /[A-Za-z0-9][A-Za-z0-9 \t.,:;!?()[\]{}"'/\\_+=@#%-]{20,}/g;
