import type { PromptAttachmentFile } from './_types';
import { buildAttachmentContext, type PromptAttachment } from './attachment-utils';

interface AiChatRequestParams {
  nextPrompt: string;
  nextAttachments: PromptAttachment[];
  nextAttachmentFiles: PromptAttachmentFile[];
  sessionKey: string;
  responseMode: 'dashboard' | 'single';
  schemaKey: string;
  uiMode: string;
  signal: AbortSignal;
}

export async function submitAiChatRequest({
  nextPrompt,
  nextAttachments,
  nextAttachmentFiles,
  sessionKey,
  responseMode,
  schemaKey,
  uiMode,
  signal,
}: AiChatRequestParams): Promise<Response> {
  const endpoint = '/api/ai/chat';
  if (nextAttachmentFiles.length > 0) {
    const formData = new FormData();
    formData.append('question', nextPrompt);
    formData.append('include_schema', 'true');
    formData.append('include_samples', 'false');
    formData.append('execute_read_only_query', 'true');
    formData.append('response_mode', responseMode);
    formData.append('schema_key', schemaKey);
    formData.append('session_key', sessionKey);
    formData.append('channel', 'manager_dashboard');
    formData.append('ui_mode', uiMode);
    nextAttachmentFiles.forEach((att) => {
      formData.append('files', att.file, att.file.name);
    });
    return fetch(endpoint, { method: 'POST', signal, body: formData });
  }

  const attachmentContext = buildAttachmentContext(nextAttachments);
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      question: nextPrompt,
      include_schema: true,
      include_samples: false,
      execute_read_only_query: true,
      response_mode: responseMode,
      schema_key: schemaKey,
      attachments: nextAttachments.map((att) => ({
        name: att.name,
        media_type: att.type,
        size_bytes: att.size,
        extension: att.extension,
        extraction_status: att.status,
        content: att.content,
        preview: att.preview,
        warning: att.warning,
        metadata: att.metadata,
      })),
      attachment_context: attachmentContext,
      session_key: sessionKey,
      channel: 'manager_dashboard',
      ui_mode: uiMode,
    }),
  });
}
