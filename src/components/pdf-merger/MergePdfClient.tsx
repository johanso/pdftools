// src/components/pdf-merger/MergePdfClient.tsx
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dropzone } from '@/components/pdf-upload/dropzone';
import { Button } from '@/components/ui/button';
import { AArrowDown, AArrowUp, ArrowLeft, Combine, Files, Plus } from 'lucide-react';
import ToolSidebar from '@/components/shared/ToolSidebar';
import { formatFileSize } from '@/lib/utils';
import { usePdfActions } from '@/app/hooks/usePdfActions';
import { useFileProcessor } from '@/app/hooks/useFileProcessor';
import ToolHeader, { ActionConfig } from '@/components/shared/ToolHeader';
import DraggableFileGrid from '@/components/pdf-upload/draggableFileGrid';

export default function MergePdfClient() {
  const { isProcessing, openMergeDialog } = usePdfActions();
  const { files, addFiles, removeFile, reorderFiles, clearFiles } = useFileProcessor();

  const [fileToDeleteId, setFileToDeleteId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const confirmRemoveFile = () => {
    if (fileToDeleteId) {
      removeFile(fileToDeleteId);
    }
    setFileToDeleteId(null);
  };
  const promptRemoveFile = (id: string) => setFileToDeleteId(id);

  const handleSort = () => {
    const sortedFiles = [...files].sort((a, b) => {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    reorderFiles(sortedFiles);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleMergeClick = () => openMergeDialog(files);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalFiles = files.length;
  const totalPages = files.reduce((acc, file) => acc + (file.pageCount || 0), 0);
  const isAnyFileLoading = files.some(file => file.isLoading);
  const toolbarActions: ActionConfig[] = [
    {
      id: 'upload-new',
      icon: <ArrowLeft style={{ width: '22px', height: '22px' }} />,
      tooltip: 'Empezar de nuevo',
      onClick: clearFiles,
    },
    {
      id: 'sort-alpha',
      icon: sortOrder === 'asc' ? <AArrowUp style={{ width: '26px', height: '26px' }} /> : <AArrowDown style={{ width: '26px', height: '26px' }} />,
      tooltip: `Ordenar ${sortOrder === 'asc' ? 'A-Z' : 'Z-A'}`,
      onClick: handleSort,
      disabled: files.length < 2,
    },
  ];

  const mergeToolInfo = (
    <div className="text-sm border-t pt-4">
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
          <span className="font-medium text-gray-500">Tamaño total:</span>
          <span className="text-gray-700">{formatFileSize(totalSize)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Páginas totales:</span>
          <span className="text-gray-700">
            {isAnyFileLoading ? (
              <>Calculando...</>
            ) : (
              <>{totalPages}</>
            )}
          </span>
        </div>
      </div>
    </div>
  );

  if (files.length === 0) {
    return (
      <div className="max-w-xl mx-auto">
        <Dropzone onFileAccepted={addFiles} multiple />
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-6 gap-8">
        <section className="col-span-4 rounded-lg">
          <ToolHeader title={`Archivos a unir: ${totalFiles}`} actions={toolbarActions} />
          <div className="p-4 bg-gray-50 border-x border-b rounded-b-lg">
            <DraggableFileGrid 
              files={files} 
              onRemoveFile={promptRemoveFile} 
              onReorderFiles={reorderFiles} 
            />
            <div className="mt-8">
              <Dropzone onFileAccepted={addFiles} multiple>
                <Plus className="h-6 w-6 mx-auto"/>
                <div className="text-center text-sm text-gray-600">Añadir más archivos</div>
              </Dropzone>
            </div>
          </div>
        </section>

        <ToolSidebar
          documentDetails={mergeDocumentDetails}
          toolInfoSection={mergeToolInfo}
          actionButton={mergeActionButton}
          actionDescription="Los archivos se combinarán en el orden mostrado."
        />
      </div>

      <AlertDialog open={!!fileToDeleteId} onOpenChange={(isOpen) => !isOpen && setFileToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. El archivo será eliminado de la lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFileToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveFile}>Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}