'use client';

import * as React from 'react';

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const markCopied = React.useCallback(() => {
    setIsCopied(true);

    if (onCopy) {
      onCopy();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, timeout);
  }, [onCopy, timeout]);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !value) {
      return;
    }

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const copied = document.execCommand('copy');

        if (copied) {
          markCopied();
        }
      } catch (error) {
        console.error(error);
      } finally {
        document.body.removeChild(textarea);
      }
    };

    if (!navigator.clipboard?.writeText) {
      fallbackCopy();
      return;
    }

    navigator.clipboard.writeText(value).then(markCopied).catch((error) => {
      console.error(error);
      fallbackCopy();
    });
  };

  return { isCopied, copyToClipboard };
}
