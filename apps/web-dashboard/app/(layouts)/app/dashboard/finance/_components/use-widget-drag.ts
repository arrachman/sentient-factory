'use client';

/**
 * Hook untuk drag + resize interaction FinanceEditableWidgetGrid.
 * Pasang global pointermove/pointerup listeners dan handle:
 *  - drag widget (auto-scroll dekat tepi viewport)
 *  - resize via pojok kanan-bawah (hotspot 28×28 px)
 *  - collision resolution agar widget tidak overlap
 *
 * Dipisah agar komponen utama tetap < 400 LOC dan pointer logic terisolasi.
 */
import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  CANVAS_PADDING,
  clamp,
  getMaxWidthPx,
  getMinHeightPx,
  getMinWidthPx,
  resolveLayoutCollisions,
  type CanvasLayoutItem,
} from './widget-grid-utils';

type DragState = {
  id: string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

type ResizeState = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
};

export type WidgetDragApi = {
  draggingId: string | null;
  resizingId: string | null;
  startDrag: (
    event: React.PointerEvent<HTMLElement>,
    widget: CanvasLayoutItem,
    rect: DOMRect,
  ) => void;
  startResize: (
    event: React.PointerEvent<HTMLElement>,
    widget: CanvasLayoutItem,
  ) => void;
};

export function useWidgetDrag(
  gridRef: RefObject<HTMLDivElement | null>,
  setLayout: React.Dispatch<React.SetStateAction<CanvasLayoutItem[]>>,
  containerWidth: number,
  columns: number,
): WidgetDragApi {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const autoScroll = (clientY: number) => {
      const edgeThreshold = 120;
      const maxStep = 24;
      if (clientY > window.innerHeight - edgeThreshold) {
        const intensity =
          (clientY - (window.innerHeight - edgeThreshold)) / edgeThreshold;
        window.scrollBy({
          top: Math.ceil(maxStep * intensity),
          behavior: 'auto',
        });
      } else if (clientY < edgeThreshold) {
        const intensity = (edgeThreshold - clientY) / edgeThreshold;
        window.scrollBy({
          top: -Math.ceil(maxStep * intensity),
          behavior: 'auto',
        });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      autoScroll(event.clientY);
      const containerRect = gridRef.current?.getBoundingClientRect();

      const dragState = dragStateRef.current;
      if (dragState && dragState.pointerId === event.pointerId && containerRect) {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = window.requestAnimationFrame(() => {
          setLayout((current) => {
            const next = current.map((item) =>
              item.id === dragState.id
                ? {
                    ...item,
                    x: clamp(
                      event.clientX -
                        containerRect.left -
                        CANVAS_PADDING -
                        dragState.offsetX,
                      0,
                      Math.max(0, containerWidth - item.width),
                    ),
                    y: Math.max(
                      event.clientY -
                        containerRect.top -
                        CANVAS_PADDING -
                        dragState.offsetY,
                      0,
                    ),
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
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = window.requestAnimationFrame(() => {
          setLayout((current) => {
            const next = current.map((item) =>
              item.id === resizeState.id
                ? {
                    ...item,
                    width: clamp(
                      resizeState.startWidth +
                        (event.clientX - resizeState.startX),
                      getMinWidthPx(item, containerWidth, columns),
                      getMaxWidthPx(item, containerWidth, columns),
                    ),
                    height: Math.max(
                      resizeState.startHeight +
                        (event.clientY - resizeState.startY),
                      getMinHeightPx(item),
                    ),
                  }
                : item,
            );

            return resolveLayoutCollisions(
              next,
              resizeState.id,
              containerWidth,
            );
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
  }, [columns, containerWidth, gridRef, setLayout]);

  const startDrag: WidgetDragApi['startDrag'] = (event, widget, rect) => {
    dragStateRef.current = {
      id: widget.id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setDraggingId(widget.id);
  };

  const startResize: WidgetDragApi['startResize'] = (event, widget) => {
    resizeStateRef.current = {
      id: widget.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: widget.width,
      startHeight: widget.height,
    };
    setResizingId(widget.id);
  };

  return { draggingId, resizingId, startDrag, startResize };
}
