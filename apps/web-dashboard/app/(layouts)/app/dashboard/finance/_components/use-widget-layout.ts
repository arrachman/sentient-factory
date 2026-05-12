'use client';

/**
 * Hook untuk wiring layout state machine FinanceEditableWidgetGrid:
 *  - viewport / container width observers
 *  - hydrate dari localStorage (atau pakai default packed layout)
 *  - apply reset / AI suggestion
 *  - debounced persist ke localStorage
 *
 * Dipisah dari komponen utama agar `finance-editable-widget-grid.tsx`
 * tetap < 400 LOC dan logic state mudah diuji.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CANVAS_PADDING,
  buildPackedLayout,
  clamp,
  getColumns,
  getMaxWidthPx,
  getMinHeightPx,
  getMinWidthPx,
  type CanvasLayoutItem,
  type SuggestedLayoutItem,
  type WidgetDefinition,
} from './widget-grid-utils';

export function useWidgetLayout({
  storageKey,
  widgets,
  resetVersion,
  suggestedLayout,
  suggestedLayoutVersion,
}: {
  storageKey: string;
  widgets: WidgetDefinition[];
  resetVersion: number;
  suggestedLayout?: SuggestedLayoutItem[] | null;
  suggestedLayoutVersion: number;
}) {
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [containerWidth, setContainerWidth] = useState(0);
  const [layout, setLayout] = useState<CanvasLayoutItem[]>([]);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const persistTimeoutRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  const columns = useMemo(() => getColumns(viewportWidth), [viewportWidth]);
  const canvasHeight = useMemo(() => {
    const contentBottom = layout.reduce(
      (max, item) => Math.max(max, item.y + item.height),
      0,
    );
    return Math.max(560, contentBottom + CANVAS_PADDING);
  }, [layout]);

  // Track viewport width for breakpoint changes.
  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Observe container width (changes when sidebar collapses, etc.).
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const updateWidth = () => {
      setContainerWidth(Math.max(320, node.clientWidth - CANVAS_PADDING * 2));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Hydrate from localStorage, or pack default layout.
  useEffect(() => {
    if (!containerWidth) return;

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setLayout(buildPackedLayout(widgets, containerWidth, columns));
      return;
    }

    try {
      const saved = JSON.parse(raw) as Array<{
        id?: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      }>;
      const savedMap = new Map(saved.map((item) => [item.id, item]));
      const base = buildPackedLayout(widgets, containerWidth, columns);

      setLayout(
        base.map((item) => {
          const persisted = savedMap.get(item.id);
          if (!persisted) return item;

          const width = clamp(
            typeof persisted.width === 'number' ? persisted.width : item.width,
            getMinWidthPx(item, containerWidth, columns),
            getMaxWidthPx(item, containerWidth, columns),
          );
          const height = Math.max(
            typeof persisted.height === 'number'
              ? persisted.height
              : item.height,
            getMinHeightPx(item),
          );

          return {
            ...item,
            x: clamp(
              typeof persisted.x === 'number' ? persisted.x : item.x,
              0,
              Math.max(0, containerWidth - width),
            ),
            y: Math.max(
              typeof persisted.y === 'number' ? persisted.y : item.y,
              0,
            ),
            width,
            height,
          };
        }),
      );
    } catch {
      setLayout(buildPackedLayout(widgets, containerWidth, columns));
    }
  }, [columns, containerWidth, storageKey, widgets]);

  // Handle Reset Layout button.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!containerWidth) return;
    window.localStorage.removeItem(storageKey);
    setLayout(buildPackedLayout(widgets, containerWidth, columns));
  }, [columns, containerWidth, resetVersion, storageKey, widgets]);

  // Apply AI suggestion when version bumps.
  useEffect(() => {
    if (!containerWidth || !suggestedLayoutVersion || !suggestedLayout?.length)
      return;

    const suggestionMap = new Map(
      suggestedLayout.map((item) => [item.id, item]),
    );
    const orderedWidgets = [
      ...suggestedLayout
        .map((item) => widgets.find((widget) => widget.id === item.id))
        .filter((widget): widget is WidgetDefinition => Boolean(widget)),
      ...widgets.filter((widget) => !suggestionMap.has(widget.id)),
    ];

    setLayout(
      buildPackedLayout(orderedWidgets, containerWidth, columns, suggestionMap),
    );
  }, [
    columns,
    containerWidth,
    suggestedLayout,
    suggestedLayoutVersion,
    widgets,
  ]);

  // Persist layout to localStorage (debounced).
  useEffect(() => {
    if (!layout.length) return;

    if (persistTimeoutRef.current !== null) {
      window.clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(
          layout.map(({ id, x, y, width, height }) => ({
            id,
            x,
            y,
            width,
            height,
          })),
        ),
      );
      persistTimeoutRef.current = null;
    }, 180);

    return () => {
      if (persistTimeoutRef.current !== null) {
        window.clearTimeout(persistTimeoutRef.current);
        persistTimeoutRef.current = null;
      }
    };
  }, [layout, storageKey]);

  return {
    gridRef,
    layout,
    setLayout,
    columns,
    containerWidth,
    canvasHeight,
  };
}
