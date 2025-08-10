// src/components/pdf-merger/MergePdfClient.tsx
'use client';

import { useCallback, useState } from 'react';
import { Dropzone } from '@/components/pdf-upload/dropzone';
import { Button } from '@/components/ui/button';
import { Combine, Files, Plus } from 'lucide-react';
import ToolSidebar from '@/components/shared/ToolSidebar';
import { formatFileSize } from '@/lib/utils';
import { usePdfActions } from '@/app/hooks/usePdfActions';
import DraggableFileGrid, { PdfFileWithPreview } from '../pdf-upload/draggableFileGrid';

export default function MergePdfClient() {
  const { isProcessing, openMergeDialog } = usePdfActions();
  const [files, setFiles] = useState<PdfFileWithPreview[]>([]);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalFiles = files.length;
  const totalPages = files.reduce((acc, file) => acc + (file.pageCount || 0), 0);
  const isAnyFileLoading = files.some(file => file.isLoading);

  const generateThumbnailForFile = useCallback(async (file: File): Promise<Partial<PdfFileWithPreview>> => {
    // Basic validation
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error('Archivo no válido o vacío');
      return { isLoading: false };
    }
  
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/generate-first-page-thumbnail', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al generar la miniatura');
      }
      
      const data = await response.json();
      return { 
        thumbnailUrl: data.thumbnailUrl, 
        pageCount: data.pageCount,
        isLoading: false,
      };
    } catch (error) {
      console.error(`Error generando miniatura para ${file.name}:`, error);
      return { 
        isLoading: false,
      };
    }
  }, []);

  const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
    // Create new files with the required properties
    const newFiles = acceptedFiles.map(file => {
      // Create a new File object to ensure we have a clean instance
      const newFile = new File([file], file.name, { 
        type: file.type,
        lastModified: file.lastModified 
      });
      
      // Add our custom properties
      return Object.assign(newFile, {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        isLoading: true,
        pageCount: 0,
        thumbnailUrl: undefined as string | undefined
      }) as PdfFileWithPreview;
    });
  
    // Update state with new files
    setFiles(prev => [...prev, ...newFiles]);
  
    // Generate thumbnails in the background
    newFiles.forEach(async (newFile) => {
      try {
        const previewData = await generateThumbnailForFile(newFile);
        setFiles(prevFiles => 
          prevFiles.map(f => {
            if (f.id === newFile.id) {
              return Object.assign(f, previewData);
            }
            return f;
          })
        );
      } catch (error) {
        console.error(`Error generando thumbnail para ${newFile.name}:`, error);
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === newFile.id ? Object.assign(f, { isLoading: false }) : f
          )
        );
      }
    });
  }, [generateThumbnailForFile]);

  const handleRemoveFile = (idToRemove: string) => {
    setFiles(prev => prev.filter(file => file.id !== idToRemove));
  };

  const handleReorderFiles = (reorderedFiles: PdfFileWithPreview[]) => {
    setFiles(reorderedFiles);
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
          <span className="font-medium text-gray-500">Tamaño total:</span>
          <span>{formatFileSize(totalSize)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Páginas totales:</span>
          <span className="text-gray-400 italic">
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
        <Dropzone onFileAccepted={handleFilesAccepted} multiple />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-6 gap-8">
      <section className="col-span-4 rounded-lg mb-20 relative">
        
        <DraggableFileGrid 
          files={files} 
          onRemoveFile={handleRemoveFile} 
          onReorderFiles={handleReorderFiles} 
        />

        <div className="mt-8 flex items-center justify-center">
          <Dropzone onFileAccepted={handleFilesAccepted} multiple>
            <Plus className="h-6 w-6 mx-auto"/>
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