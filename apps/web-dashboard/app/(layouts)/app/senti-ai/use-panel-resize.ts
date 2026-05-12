'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const MIN_PANEL_WIDTH_PERCENT = 32;
const MAX_PANEL_WIDTH_PERCENT = 100;
const MIN_RIGHT_PANEL_WIDTH_PX = 300;

export interface PanelResizeState {
  leftPanelWidth: number;
  splitLayoutWidth: number;
  isResizingPanels: boolean;
  showLeftPanelBottomButton: boolean;
  leftPanelScrollRef: React.RefObject<HTMLDivElement | null>;
  splitLayoutRef: React.RefObject<HTMLDivElement | null>;
  splitHandleRef: React.RefObject<HTMLDivElement | null>;
  isRightPanelCollapsed: boolean;
  rightPanelCollapseThresholdPercent: number;
  leftPanelDesktopWidth: string;
  restoreRightPanelWidth: () => void;
  startPanelResize: (
    event: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => void;
  scrollLeftPanelToBottom: () => void;
  syncLeftPanelBottomButton: () => void;
  MIN_PANEL_WIDTH_PERCENT: number;
  MAX_PANEL_WIDTH_PERCENT: number;
}

export function usePanelResize(
  hasChartPanel: boolean,
  isRunningAi: boolean,
  workflowStreamEntriesLength: number,
): PanelResizeState {
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [splitLayoutWidth, setSplitLayoutWidth] = useState(0);
  const [isResizingPanels, setIsResizingPanels] = useState(false);
  const [showLeftPanelBottomButton, setShowLeftPanelBottomButton] = useState(false);

  const leftPanelScrollRef = useRef<HTMLDivElement | null>(null);
  const splitLayoutRef = useRef<HTMLDivElement | null>(null);
  const splitHandleRef = useRef<HTMLDivElement | null>(null);

  const rightPanelCollapseThresholdPercent =
    !hasChartPanel || splitLayoutWidth <= MIN_RIGHT_PANEL_WIDTH_PX
      ? MAX_PANEL_WIDTH_PERCENT
      : Math.min(
          MAX_PANEL_WIDTH_PERCENT,
          Math.max(
            MIN_PANEL_WIDTH_PERCENT,
            ((splitLayoutWidth - MIN_RIGHT_PANEL_WIDTH_PX) / splitLayoutWidth) * 100,
          ),
        );

  const isRightPanelCollapsed = hasChartPanel && leftPanelWidth >= rightPanelCollapseThresholdPercent;
  const leftPanelDesktopWidth = hasChartPanel ? `${leftPanelWidth}%` : '100%';

  const restoreRightPanelWidth = useCallback(() => {
    setLeftPanelWidth((current) =>
      current >= rightPanelCollapseThresholdPercent ? 58 : current,
    );
  }, [rightPanelCollapseThresholdPercent]);

  const clampPanelWidth = (value: number) => {
    if (value >= rightPanelCollapseThresholdPercent) {
      return MAX_PANEL_WIDTH_PERCENT;
    }
    return Math.min(MAX_PANEL_WIDTH_PERCENT, Math.max(MIN_PANEL_WIDTH_PERCENT, value));
  };

  const startPanelResize = (
    event: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    if (window.innerWidth < 1024 || !hasChartPanel) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if ('pointerId' in event) {
      splitHandleRef.current?.setPointerCapture?.(event.pointerId);
    }
    setIsResizingPanels(true);
  };

  const scrollLeftPanelToBottom = () => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      return;
    }
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };

  const syncLeftPanelBottomButton = () => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      setShowLeftPanelBottomButton(false);
      return;
    }
    setShowLeftPanelBottomButton(container.scrollHeight - container.clientHeight > 24);
  };

  useLayoutEffect(() => {
    if (!isRunningAi) {
      syncLeftPanelBottomButton();
      return;
    }
    const container = leftPanelScrollRef.current;
    if (!container) {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      scrollLeftPanelToBottom();
      syncLeftPanelBottomButton();
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isRunningAi, workflowStreamEntriesLength]);

  useEffect(() => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      setShowLeftPanelBottomButton(false);
      return;
    }
    syncLeftPanelBottomButton();
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    });
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    });
    observer.observe(container, { childList: true, subtree: true, characterData: true });
    resizeObserver.observe(container);
    const handleWindowResize = () => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const container = splitLayoutRef.current;
    if (!container) {
      return;
    }
    const syncSplitLayoutWidth = () => {
      setSplitLayoutWidth(container.getBoundingClientRect().width);
    };
    syncSplitLayoutWidth();
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncSplitLayoutWidth);
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', syncSplitLayoutWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncSplitLayoutWidth);
    };
  }, []);

  useEffect(() => {
    if (!isResizingPanels) {
      return;
    }
    const handlePointerMove = (event: PointerEvent) => {
      const container = splitLayoutRef.current;
      if (!container) {
        return;
      }
      const bounds = container.getBoundingClientRect();
      if (bounds.width <= 0) {
        return;
      }
      const widthPercentage = ((event.clientX - bounds.left) / bounds.width) * 100;
      setLeftPanelWidth(clampPanelWidth(widthPercentage));
    };
    const stopResizing = () => {
      setIsResizingPanels(false);
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResizing);
    window.addEventListener('pointercancel', stopResizing);
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResizing);
      window.removeEventListener('pointercancel', stopResizing);
    };
  }, [isResizingPanels]);

  return {
    leftPanelWidth,
    splitLayoutWidth,
    isResizingPanels,
    showLeftPanelBottomButton,
    leftPanelScrollRef,
    splitLayoutRef,
    splitHandleRef,
    isRightPanelCollapsed,
    rightPanelCollapseThresholdPercent,
    leftPanelDesktopWidth,
    restoreRightPanelWidth,
    startPanelResize,
    scrollLeftPanelToBottom,
    syncLeftPanelBottomButton,
    MIN_PANEL_WIDTH_PERCENT,
    MAX_PANEL_WIDTH_PERCENT,
  };
}
