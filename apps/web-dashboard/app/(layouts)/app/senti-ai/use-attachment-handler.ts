'use client';

import { useCallback, useRef, useState } from 'react';
import { parsePromptAttachmentOffMainThread, type PromptAttachment } from './attachment-utils';
import type { PromptAttachmentFile } from './_types';
import { revokeAttachmentPreviewUrl } from './attachment-file-tile';

export interface AttachmentHandlerState {
  attachments: PromptAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<PromptAttachment[]>>;
  attachmentFiles: PromptAttachmentFile[];
  setAttachmentFiles: React.Dispatch<React.SetStateAction<PromptAttachmentFile[]>>;
  submittedAttachments: PromptAttachment[];
  setSubmittedAttachments: React.Dispatch<React.SetStateAction<PromptAttachment[]>>;
  isPreparingAttachments: boolean;
  isDraggingAttachment: boolean;
  setIsDraggingAttachment: React.Dispatch<React.SetStateAction<boolean>>;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  attachmentsRef: React.RefObject<PromptAttachment[]>;
  handleSelectAttachments: (fileList: FileList | null) => Promise<void>;
  handlePasteAttachments: (items: DataTransferItemList | null) => Promise<boolean>;
  handleDropAttachments: (files: FileList | null) => Promise<void>;
  removeAttachment: (attachmentId: string) => void;
}

export function useAttachmentHandler(): AttachmentHandlerState {
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<PromptAttachmentFile[]>([]);
  const [submittedAttachments, setSubmittedAttachments] = useState<PromptAttachment[]>([]);
  const [isPreparingAttachments, setIsPreparingAttachments] = useState(false);
  const [isDraggingAttachment, setIsDraggingAttachment] = useState(false);

  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsRef = useRef<PromptAttachment[]>([]);

  const handleSelectAttachments = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    setIsPreparingAttachments(true);
    try {
      const selectedFiles = Array.from(fileList).slice(0, 5).map((file) => ({
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        file,
      }));
      const parsedFiles: PromptAttachment[] = [];
      for (let index = 0; index < selectedFiles.length; index += 1) {
        const entry = selectedFiles[index];
        parsedFiles.push(await parsePromptAttachmentOffMainThread(entry.file, entry.id));
        if (index < selectedFiles.length - 1) {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 0);
          });
        }
      }
      const validAttachmentIds = new Set(
        parsedFiles
          .filter((attachment) => attachment.status !== 'failed')
          .map((attachment) => attachment.id),
      );
      setAttachments((current) => {
        const nextMap = new Map(current.map((attachment) => [attachment.name, attachment]));
        parsedFiles.forEach((attachment) => {
          const existing = nextMap.get(attachment.name);
          if (existing && existing.previewUrl && existing.previewUrl !== attachment.previewUrl) {
            revokeAttachmentPreviewUrl(existing);
          }
          nextMap.set(attachment.name, attachment);
        });
        return Array.from(nextMap.values()).sort((left, right) => left.addedAt - right.addedAt);
      });
      setAttachmentFiles((current) => {
        const nextMap = new Map(current.map((entry) => [entry.file.name, entry]));
        selectedFiles.forEach((entry) => {
          if (validAttachmentIds.has(entry.id)) {
            nextMap.set(entry.file.name, entry);
          }
        });
        return Array.from(nextMap.values());
      });
    } finally {
      setIsPreparingAttachments(false);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = '';
      }
    }
  }, []);

  const handlePasteAttachments = useCallback(
    async (items: DataTransferItemList | null) => {
      if (!items || items.length === 0) {
        return false;
      }
      const pastedFiles: File[] = [];
      Array.from(items).forEach((item, index) => {
        if (item.kind !== 'file') {
          return;
        }
        const file = item.getAsFile();
        if (!file) {
          return;
        }
        const fallbackExtension = file.type.startsWith('image/') ? 'png' : 'bin';
        const hasExplicitName = file.name && file.name !== 'image.png';
        const nextFile = hasExplicitName
          ? file
          : new File([file], `pasted-${Date.now()}-${index}.${fallbackExtension}`, {
              type: file.type || 'application/octet-stream',
              lastModified: Date.now(),
            });
        pastedFiles.push(nextFile);
      });
      if (pastedFiles.length === 0) {
        return false;
      }
      const dataTransfer = new DataTransfer();
      pastedFiles.forEach((file) => dataTransfer.items.add(file));
      await handleSelectAttachments(dataTransfer.files);
      return true;
    },
    [handleSelectAttachments],
  );

  const handleDropAttachments = useCallback(
    async (files: FileList | null) => {
      setIsDraggingAttachment(false);
      await handleSelectAttachments(files);
    },
    [handleSelectAttachments],
  );

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === attachmentId);
      if (target) {
        revokeAttachmentPreviewUrl(target);
      }
      return current.filter((attachment) => attachment.id !== attachmentId);
    });
    setAttachmentFiles((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );
  }, []);

  return {
    attachments,
    setAttachments,
    attachmentFiles,
    setAttachmentFiles,
    submittedAttachments,
    setSubmittedAttachments,
    isPreparingAttachments,
    isDraggingAttachment,
    setIsDraggingAttachment,
    attachmentInputRef,
    attachmentsRef,
    handleSelectAttachments,
    handlePasteAttachments,
    handleDropAttachments,
    removeAttachment,
  };
}
