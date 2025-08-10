// src/components/pdf-merger/MergePdfClient.tsx
'use client';

import { useState } from 'react';
import { Dropzone } from '@/components/pdf-upload/dropzone';
import { Button } from '@/components/ui/button';
import { Combine, Files, FileText, Plus, X } from 'lucide-react';
import ToolSidebar from '@/components/shared/ToolSidebar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { formatFileSize } from '@/lib/utils';
import { usePdfActions } from '@/app/hooks/usePdfActions';

// Definimos un tipo para nuestros archivos, añadiendo un ID para el drag-and-drop
type PdfFile = File & { id: string };

export default function MergePdfClient() {
  const { isProcessing, openMergeDialog } = usePdfActions();
  const [files, setFiles] = useState<PdfFile[]>([]);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalFiles = files.length;

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    const newFilesWithId = acceptedFiles.map(file => Object.assign(file, {
      id: `${file.name}-${file.lastModified}-${Math.random()}`
    }));
    setFiles(prev => [...prev, ...newFilesWithId]);
  };

  const handleRemoveFile = (idToRemove: string) => {
    setFiles(prev => prev.filter(file => file.id !== idToRemove));
  };
  
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFiles(items);
  };

  const handleMergeClick = async () => {
    if (files.length < 2) {
      alert('Necesitas al menos dos archivos para unir.');
      return;
    }
    openMergeDialog(files);
  };

  const mergeToolInfo = (
    <div className="text-sm">
      <p className="text-gray-500">
        Has cargado <span className="font-bold">{files.length}</span> archivo(s).
        Arrastra y suelta para cambiar el orden en que se unirán.
      </p>
    </div>
  );

  const mergeActionButton = (
    <Button
      onClick={handleMergeClick}
      disabled={files.length < 2 || isProcessing}
      className="gap-2 h-12 w-full text-md font-bold"
      size="lg"
    >
      {isProcessing ? 'Uniendo...' : (<><Combine className="h-5 w-5" /> Unir PDFs</>)}
    </Button>
  );

  const mergeDocumentDetails = (
    <div>
      <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
        <Files className="h-5 w-5" /> Resumen de Archivos
      </h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Archivos a unir:</span>
          <span className="font-bold">{totalFiles}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Tamaño final del pdf:</span>
          <span>{formatFileSize(totalSize)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Total páginas:</span>
          <span className="text-gray-400 italic">Se calcularán</span>
        </div>
      </div>
    </div>
  );

  if (files.length === 0) {
    return (
      <div className="max-w-xl mx-auto">
        <Dropzone onFileAccepted={handleFilesAccepted} multiple />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-6 gap-8">
      <section className="col-span-4 rounded-lg mb-20 relative">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="pdf-files">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {files.map((file, index) => (
                  <Draggable key={file.id} draggableId={file.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-3 rounded-lg shadow-sm border text-center relative"
                      >
                        <button 
                          onClick={() => handleRemoveFile(file.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 z-10"
                          aria-label="Eliminar archivo"
                        >
                            <X className="h-4 w-4"/>
                        </button>
                        <FileText className="h-12 w-12 mx-auto text-red-400 mb-2"/>
                        <p className="text-sm truncate" title={file.name}>{file.name}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-8 flex items-center justify-center">
          <Dropzone onFileAccepted={handleFilesAccepted} multiple>
            <Plus className="h-8 w-8 mx-auto"/>
            <div className="text-center text-sm text-gray-600">Añadir más archivos</div>
          </Dropzone>
        </div>
      </section>

      <ToolSidebar
        documentDetails={mergeDocumentDetails}
        toolInfoSection={mergeToolInfo}
        actionButton={mergeActionButton}
        actionDescription="Los archivos se combinarán en el orden mostrado."
      />
    </div>
  );
}