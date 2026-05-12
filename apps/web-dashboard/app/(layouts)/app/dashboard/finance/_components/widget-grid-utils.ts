/**
 * Pure helpers + types untuk FinanceEditableWidgetGrid.
 * Dipisah dari `finance-editable-widget-grid.tsx` agar komponen utama < 400 LOC
 * dan helper bisa di-unit-test tanpa render React.
 */
import type { ReactNode } from 'react';

export type WidgetSize = {
  w: number;
  h: number;
};

export type WidgetDefinition = {
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
  render: (context: {
    heightClass: string;
    width: number;
    height: number;
    columns: number;
  }) => ReactNode;
};

export type SuggestedLayoutItem = {
  id: string;
  w: number;
  h: number;
};

export type CanvasLayoutItem = WidgetDefinition & {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const GRID_GAP = 16;
export const GRID_ROW_HEIGHT = 88;
export const COLLISION_GAP = 20;
export const RESIZE_HOTSPOT = 28;
export const CANVAS_PADDING = 12;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getColumns(width: number) {
  if (width < 768) return 1;
  if (width < 1280) return 6;
  return 12;
}

export function getDefaultSize(
  widget: WidgetDefinition,
  columns: number,
): WidgetSize {
  if (columns === 1) return widget.defaultSize.mobile;
  if (columns <= 6) return widget.defaultSize.tablet;
  return widget.defaultSize.desktop;
}

export function getColumnWidth(containerWidth: number, columns: number) {
  return (
    (containerWidth - GRID_GAP * Math.max(columns - 1, 0)) /
    Math.max(columns, 1)
  );
}

export function unitsToWidthPx(
  units: number,
  containerWidth: number,
  columns: number,
) {
  const columnWidth = getColumnWidth(containerWidth, columns);
  return columnWidth * units + GRID_GAP * Math.max(units - 1, 0);
}

export function unitsToHeightPx(units: number) {
  return GRID_ROW_HEIGHT * units + GRID_GAP * Math.max(units - 1, 0);
}

export function isOverlapping(a: CanvasLayoutItem, b: CanvasLayoutItem) {
  return (
    a.x < b.x + b.width + COLLISION_GAP &&
    a.x + a.width + COLLISION_GAP > b.x &&
    a.y < b.y + b.height + COLLISION_GAP &&
    a.y + a.height + COLLISION_GAP > b.y
  );
}

export function resolveLayoutCollisions(
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

    let overlapping = placed.filter((placedItem) =>
      isOverlapping(next, placedItem),
    );
    while (overlapping.length > 0) {
      next.y = Math.max(
        ...overlapping.map(
          (placedItem) => placedItem.y + placedItem.height + COLLISION_GAP,
        ),
      );
      overlapping = placed.filter((placedItem) =>
        isOverlapping(next, placedItem),
      );
    }

    placed.push(next);
  }

  const placedMap = new Map(placed.map((item) => [item.id, item]));
  return items.map((item) => placedMap.get(item.id) ?? item);
}

export function heightToClass(heightPx: number) {
  if (heightPx <= 260) return 'h-[220px]';
  if (heightPx <= 340) return 'h-[280px]';
  if (heightPx <= 420) return 'h-[340px]';
  return 'h-[400px]';
}

export function getMinWidthPx(
  widget: WidgetDefinition,
  containerWidth: number,
  columns: number,
) {
  return unitsToWidthPx(Math.min(widget.minW, columns), containerWidth, columns);
}

export function getMaxWidthPx(
  widget: WidgetDefinition,
  containerWidth: number,
  columns: number,
) {
  if (typeof widget.maxW === 'number') {
    return unitsToWidthPx(
      Math.min(widget.maxW, columns),
      containerWidth,
      columns,
    );
  }

  return containerWidth;
}

export function getMinHeightPx(widget: WidgetDefinition) {
  return unitsToHeightPx(widget.minH);
}

export function getMaxHeightPx(widget: WidgetDefinition) {
  if (typeof widget.maxH === 'number') {
    return unitsToHeightPx(widget.maxH);
  }

  return Number.POSITIVE_INFINITY;
}

export function buildPackedLayout(
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
