'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  type CanvasLayoutItem,
  type SuggestedLayoutItem,
  type WidgetDefinition,
  CANVAS_PADDING,
  RESIZE_HOTSPOT,
  buildPackedLayout,
  clamp,
  getColumns,
  getMaxHeightPx,
  getMaxWidthPx,
  getMinHeightPx,
  getMinWidthPx,
  heightToClass,
  resolveLayoutCollisions,
} from './widget-grid-layout';

export function FinanceEditableWidgetGrid({
  storageKey,
  widgets,
  resetVersion = 0,
  suggestedLayout,
  suggestedLayoutVersion = 0,
}: {
  storageKey: string;
  widgets: WidgetDefinition[];
  resetVersion?: number;
  suggestedLayout?: SuggestedLayoutItem[] | null;
  suggestedLayoutVersion?: number;
}) {
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [containerWidth, setContainerWidth] = useState(0);
  const [layout, setLayout] = useState<CanvasLayoutItem[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const persistLayoutTimeoutRef = useRef<number | null>(null);
  const layoutRef = useRef<CanvasLayoutItem[]>([]);
  const hasMountedRef = useRef(false);
  const dragStateRef = useRef<{
    id: string;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const resizeStateRef = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const columns = useMemo(() => getColumns(viewportWidth), [viewportWidth]);
  const canvasHeight = useMemo(() => {
    const contentBottom = layout.reduce((max, item) => Math.max(max, item.y + item.height), 0);
    return Math.max(560, contentBottom + CANVAS_PADDING);
  }, [layout]);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

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

  useEffect(() => {
    if (!containerWidth) return;

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setLayout(buildPackedLayout(widgets, containerWidth, columns));
      return;
    }

    try {
      const saved = JSON.parse(raw) as Array<{ id?: string; x?: number; y?: number; width?: number; height?: number }>;
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
            typeof persisted.height === 'number' ? persisted.height : item.height,
            getMinHeightPx(item),
          );

          return {
            ...item,
            x: clamp(typeof persisted.x === 'number' ? persisted.x : item.x, 0, Math.max(0, containerWidth - width)),
            y: Math.max(typeof persisted.y === 'number' ? persisted.y : item.y, 0),
            width,
            height,
          };
        }),
      );
    } catch {
      setLayout(buildPackedLayout(widgets, containerWidth, columns));
    }
  }, [columns, containerWidth, storageKey, widgets]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!containerWidth) return;
    window.localStorage.removeItem(storageKey);
    setLayout(buildPackedLayout(widgets, containerWidth, columns));
  }, [columns, containerWidth, resetVersion, storageKey, widgets]);

  useEffect(() => {
    if (!containerWidth || !suggestedLayoutVersion || !suggestedLayout?.length) return;

    const suggestionMap = new Map(suggestedLayout.map((item) => [item.id, item]));
    const orderedWidgets = [
      ...suggestedLayout
        .map((item) => widgets.find((widget) => widget.id === item.id))
        .filter((widget): widget is WidgetDefinition => Boolean(widget)),
      ...widgets.filter((widget) => !suggestionMap.has(widget.id)),
    ];

    setLayout(buildPackedLayout(orderedWidgets, containerWidth, columns, suggestionMap));
  }, [columns, containerWidth, suggestedLayout, suggestedLayoutVersion, widgets]);

  useEffect(() => {
    layoutRef.current = layout;
    if (!layout.length) return;

    if (persistLayoutTimeoutRef.current !== null) {
      window.clearTimeout(persistLayoutTimeoutRef.current);
    }

    persistLayoutTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(layout.map(({ id, x, y, width, height }) => ({ id, x, y, width, height }))),
      );
      persistLayoutTimeoutRef.current = null;
    }, 180);

    return () => {
      if (persistLayoutTimeoutRef.current !== null) {
        window.clearTimeout(persistLayoutTimeoutRef.current);
        persistLayoutTimeoutRef.current = null;
      }
    };
  }, [layout, storageKey]);

  useEffect(() => {
    const autoScroll = (clientY: number) => {
      const edgeThreshold = 120;
      const maxStep = 24;
      if (clientY > window.innerHeight - edgeThreshold) {
        const intensity = (clientY - (window.innerHeight - edgeThreshold)) / edgeThreshold;
        window.scrollBy({ top: Math.ceil(maxStep * intensity), behavior: 'auto' });
      } else if (clientY < edgeThreshold) {
        const intensity = (edgeThreshold - clientY) / edgeThreshold;
        window.scrollBy({ top: -Math.ceil(maxStep * intensity), behavior: 'auto' });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      autoScroll(event.clientY);
      const containerRect = gridRef.current?.getBoundingClientRect();

      const dragState = dragStateRef.current;
      if (dragState && dragState.pointerId === event.pointerId && containerRect) {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = window.requestAnimationFrame(() => {
          setLayout((current) => {
            const next = current.map((item) =>
              item.id === dragState.id
                ? {
                    ...item,
                    x: clamp(
                      event.clientX - containerRect.left - CANVAS_PADDING - dragState.offsetX,
                      0,
                      Math.max(0, containerWidth - item.width),
                    ),
                    y: Math.max(event.clientY - containerRect.top - CANVAS_PADDING - dragState.offsetY, 0),
                  }
                : item,
            );

            return resolveLayoutCollisions(next, dragState.id, containerWidth);
          });
        });
        return;
      }

      const resizeState = resizeStateRef.current;
      if (resizeState && resizeState.pointerId === event.pointerId) {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = window.requestAnimationFrame(() => {
          setLayout((current) => {
            const next = current.map((item) =>
              item.id === resizeState.id
                ? {
                    ...item,
                    width: clamp(
                      resizeState.startWidth + (event.clientX - resizeState.startX),
                      getMinWidthPx(item, containerWidth, columns),
                      getMaxWidthPx(item, containerWidth, columns),
                    ),
                    height: Math.max(
                      resizeState.startHeight + (event.clientY - resizeState.startY),
                      getMinHeightPx(item),
                    ),
                  }
                : item,
            );

            return resolveLayoutCollisions(next, resizeState.id, containerWidth);
          });
        });
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (dragStateRef.current?.pointerId === event.pointerId) {
        dragStateRef.current = null;
        setDraggingId(null);
      }

      if (resizeStateRef.current?.pointerId === event.pointerId) {
        resizeStateRef.current = null;
        setResizingId(null);
      }

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [columns, containerWidth]);

  return (
    <div
      ref={gridRef}
      className="relative overflow-visible rounded-[28px] border border-dashed border-border/70 bg-muted/12 p-3"
      style={{ minHeight: `${canvasHeight}px` }}
    >
      {layout.map((widget) => (
        <section
          key={widget.id}
          className={cn(
            'absolute min-h-0 min-w-0 touch-none transition-shadow duration-150 ease-out',
            draggingId === widget.id && 'z-50 rotate-[1.2deg] shadow-2xl',
            resizingId === widget.id && 'z-40 shadow-xl',
          )}
          style={{
            left: `${widget.x}px`,
            top: `${widget.y}px`,
            width: `${widget.width}px`,
            height: `${widget.height}px`,
            cursor: resizingId === widget.id ? 'nwse-resize' : draggingId === widget.id ? 'grabbing' : 'grab',
          }}
          onPointerDown={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('button, a, input, select, textarea, [role="button"]')) {
              return;
            }

            const rect = event.currentTarget.getBoundingClientRect();
            const isResizeIntent =
              rect.right - event.clientX <= RESIZE_HOTSPOT &&
              rect.bottom - event.clientY <= RESIZE_HOTSPOT;

            event.preventDefault();
            event.stopPropagation();

            if (isResizeIntent) {
              resizeStateRef.current = {
                id: widget.id,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startWidth: widget.width,
                startHeight: widget.height,
              };
              setResizingId(widget.id);
              return;
            }

            if (resizingId !== null) return;

            dragStateRef.current = {
              id: widget.id,
              pointerId: event.pointerId,
              offsetX: event.clientX - rect.left,
              offsetY: event.clientY - rect.top,
            };
            setDraggingId(widget.id);
          }}
        >
          <div className="h-full min-h-0 min-w-0 [&>*]:h-full">
            {widget.render({
              heightClass: heightToClass(widget.height),
              width: widget.width,
              height: widget.height,
              columns,
            })}
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 rounded-tl-xl bg-linear-to-tl from-primary/10 via-primary/4 to-transparent" />
        </section>
      ))}
    </div>
  );
}

export type { WidgetDefinition };
