// src/components/shared/DraggableFileGrid.tsx
'use client';

import { cn, formatFileSize } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { X, FileText, Loader2 } from "lucide-react";

// El tipo no cambia
export type PdfFileWithPreview = File & { 
  id: string;
  thumbnailUrl?: string;
  pageCount?: number;
  isLoading?: boolean;
};

export function SortableFileCard({ file, onRemoveFile }: { file: PdfFileWithPreview, onRemoveFile: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFile(file.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-full"
    >
      <div
        className={cn(
          "relative flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm h-full",
          isDragging && "shadow-xl opacity-80"
        )}
      >
        <button 
          onClick={handleRemoveClick}
          className="absolute top-2 left-2 bg-gray-900 text-white rounded-full p-0.5 hover:bg-gray-700 shadow cursor-pointer"
          aria-label="Eliminar archivo"
        > <X className="h-4 w-4"/>
        </button>
        
        <div 
          className="flex-grow flex items-center justify-center h-[200px] max-h-[200px] bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
          {...listeners}
        >
          {file.isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2"/>
              <span className="text-xs text-gray-500">Generando...</span>
            </div>
          ) : file.thumbnailUrl ? (
            <img 
              src={file.thumbnailUrl} 
              alt={`Vista de ${file.name}`} 
              className="w-full h-auto object-contain max-h-[200px] bg-white pointer-events-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FileText className="h-12 w-12 mb-2"/>
              <span className="text-xs text-center">Vista previa no disponible</span>
            </div>
          )}
        </div>

        <div className="p-2 bg-white text-center text-xs text-gray-600 border-t border-gray-200">
          <p className="truncate font-medium" title={file.name}>{file.name}</p>
          <p className="text-gray-500 text-xs mt-1">
            {file.pageCount || 0} página(s) / {formatFileSize(file.size)}
          </p>
        </div>

      </div>
    </div>
  );
}
