'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanContext, type KanbanContextProps, type KanbanMoveEvent } from './sortable-kanban.context';

export interface KanbanRootProps<T> {
  value: Record<string, T[]>;
  onValueChange: (value: Record<string, T[]>) => void;
  getItemValue: (item: T) => string;
  children: React.ReactNode;
  className?: string;
  onMove?: (event: KanbanMoveEvent) => void;
}

export function Kanban<T>({ value, onValueChange, getItemValue, children, className, onMove }: KanbanRootProps<T>) {
  const columns = value;
  const setColumns = onValueChange;
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const columnIds = React.useMemo(() => Object.keys(columns), [columns]);

  const isColumn = React.useCallback((id: UniqueIdentifier) => columnIds.includes(id as string), [columnIds]);

  const findContainer = React.useCallback(
    (id: UniqueIdentifier) => {
      if (isColumn(id)) return id as string;
      return columnIds.find((key) => columns[key].some((item) => getItemValue(item) === id));
    },
    [columns, columnIds, getItemValue, isColumn],
  );

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      if (onMove) {
        return;
      }

      const { active, over } = event;
      if (!over) return;

      if (isColumn(active.id)) return;

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
        return;
      }

      const activeItems = columns[activeContainer];
      const overItems = columns[overContainer];

      const activeIndex = activeItems.findIndex((item: T) => getItemValue(item) === active.id);
      let overIndex = overItems.findIndex((item: T) => getItemValue(item) === over.id);

      if (isColumn(over.id)) {
        overIndex = overItems.length;
      }

      const newOverItems = [...overItems];
      const [movedItem] = activeItems.splice(activeIndex, 1);
      newOverItems.splice(overIndex, 0, movedItem);

      setColumns({
        ...columns,
        [activeContainer]: [...activeItems],
        [overContainer]: newOverItems,
      });
    },
    [findContainer, getItemValue, isColumn, setColumns, columns, onMove],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      if (onMove && !isColumn(active.id)) {
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer && overContainer) {
          const activeIndex = columns[activeContainer].findIndex((item: T) => getItemValue(item) === active.id);
          const overIndex = isColumn(over.id)
            ? columns[overContainer].length
            : columns[overContainer].findIndex((item: T) => getItemValue(item) === over.id);

          onMove({
            event,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
          });
        }
        return;
      }

      if (isColumn(active.id) && isColumn(over.id)) {
        const activeIndex = columnIds.indexOf(active.id as string);
        const overIndex = columnIds.indexOf(over.id as string);
        if (activeIndex !== overIndex) {
          const newOrder = arrayMove(Object.keys(columns), activeIndex, overIndex);
          const newColumns: Record<string, T[]> = {};
          newOrder.forEach((key) => {
            newColumns[key] = columns[key];
          });
          setColumns(newColumns);
        }
        return;
      }

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      if (activeContainer && overContainer && activeContainer === overContainer) {
        const container = activeContainer;
        const activeIndex = columns[container].findIndex((item: T) => getItemValue(item) === active.id);
        const overIndex = columns[container].findIndex((item: T) => getItemValue(item) === over.id);

        if (activeIndex !== overIndex) {
          setColumns({
            ...columns,
            [container]: arrayMove(columns[container], activeIndex, overIndex),
          });
        }
      }
    },
    [columnIds, columns, findContainer, getItemValue, isColumn, setColumns, onMove],
  );

  const contextValue = React.useMemo(
    () => ({
      columns,
      setColumns,
      getItemId: getItemValue,
      columnIds,
      activeId,
      setActiveId,
      findContainer,
      isColumn,
    }),
    [columns, setColumns, getItemValue, columnIds, activeId, findContainer, isColumn],
  );

  return (
    <KanbanContext.Provider value={contextValue as unknown as KanbanContextProps<unknown>}>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div data-slot="kanban" data-dragging={activeId !== null} className={cn(className)}>
          {children}
        </div>
      </DndContext>
    </KanbanContext.Provider>
  );
}
