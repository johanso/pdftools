// src/components/pdf-upload/draggableFileGrid.tsx
'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableFileCard } from './sortableFileCard';
import { PdfFileWithPreview } from '@/types';

interface DraggableFileGridProps {
  files: PdfFileWithPreview[];
  onRemoveFile: (id: string) => void;
  onReorderFiles: (files: PdfFileWithPreview[]) => void;
}

export default function DraggableFileGrid({ files, onRemoveFile, onReorderFiles }: DraggableFileGridProps) {

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex(f => f.id === active.id);
      const newIndex = files.findIndex(f => f.id === over.id);
      onReorderFiles(arrayMove(files, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border min-h-[200px]">
        <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
          {files.map(file => (
            <SortableFileCard key={file.id} file={file} onRemoveFile={onRemoveFile} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}