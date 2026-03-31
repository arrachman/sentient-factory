'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type WidgetSize = {
  w: number;
  h: number;
};

type WidgetDefinition = {
  id: string;
  minW: number;
  maxW?: number;
  minH: number;
  maxH?: number;
  defaultSize: {
    mobile: WidgetSize;
    tablet: WidgetSize;
    desktop: WidgetSize;
  };
  render: (context: { heightClass: string; width: number; height: number; columns: number }) => ReactNode;
};

type SuggestedLayoutItem = {
  id: string;
  w: number;
  h: number;
};

type CanvasLayoutItem = WidgetDefinition & {
  x: number;
  y: number;
  width: number;
  height: number;
};

const GRID_GAP = 16;
const GRID_ROW_HEIGHT = 88;
const COLLISION_GAP = 20;
const RESIZE_HOTSPOT = 28;
const CANVAS_PADDING = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getColumns(width: number) {
  if (width < 768) return 1;
  if (width < 1280) return 6;
  return 12;
}

function getDefaultSize(widget: WidgetDefinition, columns: number): WidgetSize {
  if (columns === 1) return widget.defaultSize.mobile;
  if (columns <= 6) return widget.defaultSize.tablet;
  return widget.defaultSize.desktop;
}

function getColumnWidth(containerWidth: number, columns: number) {
  return (containerWidth - GRID_GAP * Math.max(columns - 1, 0)) / Math.max(columns, 1);
}

function unitsToWidthPx(units: number, containerWidth: number, columns: number) {
  const columnWidth = getColumnWidth(containerWidth, columns);
  return columnWidth * units + GRID_GAP * Math.max(units - 1, 0);
}

function unitsToHeightPx(units: number) {
  return GRID_ROW_HEIGHT * units + GRID_GAP * Math.max(units - 1, 0);
}

function isOverlapping(a: CanvasLayoutItem, b: CanvasLayoutItem) {
  return (
    a.x < b.x + b.width + COLLISION_GAP &&
    a.x + a.width + COLLISION_GAP > b.x &&
    a.y < b.y + b.height + COLLISION_GAP &&
    a.y + a.height + COLLISION_GAP > b.y
  );
}

function resolveLayoutCollisions(
  items: CanvasLayoutItem[],
  activeId: string,
  containerWidth: number,
) {
  const active = items.find((item) => item.id === activeId);
  if (!active) {
    return items;
  }

  const placed: CanvasLayoutItem[] = [{ ...active }];
  const others = items
    .filter((item) => item.id !== activeId)
    .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));

  for (const item of others) {
    const next = {
      ...item,
      x: clamp(item.x, 0, Math.max(0, containerWidth - item.width)),
      y: Math.max(0, item.y),
    };

    let overlapping = placed.filter((placedItem) => isOverlapping(next, placedItem));
    while (overlapping.length > 0) {
      next.y = Math.max(...overlapping.map((placedItem) => placedItem.y + placedItem.height + COLLISION_GAP));
      overlapping = placed.filter((placedItem) => isOverlapping(next, placedItem));
    }

    placed.push(next);
  }

  const placedMap = new Map(placed.map((item) => [item.id, item]));
  return items.map((item) => placedMap.get(item.id) ?? item);
}

function heightToClass(heightPx: number) {
  if (heightPx <= 260) return 'h-[220px]';
  if (heightPx <= 340) return 'h-[280px]';
  if (heightPx <= 420) return 'h-[340px]';
  return 'h-[400px]';
}

function getMinWidthPx(widget: WidgetDefinition, containerWidth: number, columns: number) {
  return unitsToWidthPx(Math.min(widget.minW, columns), containerWidth, columns);
}

function getMaxWidthPx(widget: WidgetDefinition, containerWidth: number, columns: number) {
  if (typeof widget.maxW === 'number') {
    return unitsToWidthPx(Math.min(widget.maxW, columns), containerWidth, columns);
  }

  return containerWidth;
}

function getMinHeightPx(widget: WidgetDefinition) {
  return unitsToHeightPx(widget.minH);
}

function getMaxHeightPx(widget: WidgetDefinition) {
  if (typeof widget.maxH === 'number') {
    return unitsToHeightPx(widget.maxH);
  }

  return Number.POSITIVE_INFINITY;
}

function buildPackedLayout(
  widgets: WidgetDefinition[],
  containerWidth: number,
  columns: number,
  suggestionMap?: Map<string, SuggestedLayoutItem>,
) {
  let cursorX = 0;
  let cursorY = 0;
  let rowHeight = 0;

  return widgets.map<CanvasLayoutItem>((widget) => {
    const suggestion = suggestionMap?.get(widget.id);
    const defaultSize = getDefaultSize(widget, columns);
    const widthPx = clamp(
      unitsToWidthPx(suggestion?.w ?? defaultSize.w, containerWidth, columns),
      getMinWidthPx(widget, containerWidth, columns),
      getMaxWidthPx(widget, containerWidth, columns),
    );
    const heightPx = clamp(
      unitsToHeightPx(suggestion?.h ?? defaultSize.h),
      getMinHeightPx(widget),
      getMaxHeightPx(widget),
    );

    if (cursorX > 0 && cursorX + widthPx > containerWidth) {
      cursorX = 0;
      cursorY += rowHeight + GRID_GAP;
      rowHeight = 0;
    }

    const item = {
      ...widget,
      x: cursorX,
      y: cursorY,
      width: widthPx,
      height: heightPx,
    };

    cursorX += widthPx + GRID_GAP;
    rowHeight = Math.max(rowHeight, heightPx);

    return item;
  });
}

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

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(layout.map(({ id, x, y, width, height }) => ({ id, x, y, width, height }))),
    );
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
