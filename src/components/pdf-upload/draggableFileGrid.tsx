// src/components/shared/DraggableFileGrid.tsx
'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FileText, Loader2, X } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

export type PdfFileWithPreview = File & { 
  id: string;
  thumbnailUrl?: string;
  pageCount?: number;
  isLoading?: boolean;
};

interface DraggableFileGridProps {
  files: PdfFileWithPreview[];
  onRemoveFile: (id: string) => void;
  onReorderFiles: (files: PdfFileWithPreview[]) => void;
}

export default function DraggableFileGrid({ files, onRemoveFile, onReorderFiles }: DraggableFileGridProps) {

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onReorderFiles(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="pdf-files">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border min-h-[200px]"
          >
            {files.map((file, index) => (
              <Draggable key={file.id} draggableId={file.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative flex flex-col border border-gray-200 rounded-lg overflow-hidden transition-all hover:scale-102"
                  >
                    <button 
                      onClick={() => onRemoveFile(file.id)}
                      className="absolute top-2 left-2 bg-gray-900 text-white rounded-full p-0.5 hover:bg-gray-700 shadow"
                      aria-label="Eliminar archivo"
                    >
                       <X className="h-4 w-4"/>
                    </button>
                    
                    <div className="flex-grow flex items-center justify-center max-h-[200px] bg-gray-100">
                      {file.isLoading ? (
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2"/>
                          <span className="text-xs text-gray-500">Generando...</span>
                        </div>
                      ) : file.thumbnailUrl ? (
                        <img 
                          src={file.thumbnailUrl} 
                          alt={`Vista de ${file.name}`} 
                          className="w-full h-auto object-contain max-h-[200px] bg-white"
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



                    {/* <div className="relative flex flex-col border border-gray-200 rounded-lg overflow-hidden transition-all hover:scale-102">
                      <img
                        src={page.imageUrl}
                        alt={`Página ${page.pageNumber}`}
                        className="w-full h-auto object-contain bg-white"
                      />
                      <div className="p-2 bg-white text-center text-xs text-gray-500 border-t border-gray-200">
                        Página {page.pageNumber}
                      </div>
                      
                      {renderAction && renderAction(page.pageNumber)}
                    </div> */}


        
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}