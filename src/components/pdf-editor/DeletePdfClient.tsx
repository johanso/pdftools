// src/components/pdf-editor/DeletePdfClient.tsx
'use client';

import { useState } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import { Dropzone } from '@/components/pdf-upload/dropzone';
import PdfThumbnails from '@/components/pdf-upload/PdfThumbnails';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckSquare, Trash2 } from 'lucide-react';
import ToolSidebar from '../shared/ToolSidebar';

// Renombramos el componente
export default function DeletePdfClient() { 
  const { currentFile, setCurrentFile } = usePdf();
  const [selectedPages, setSelectedPages] = useState(new Set<number>());
  const [isProcessing, setIsProcessing] = useState(false);

  // ... (TODA la lógica de togglePageSelection y handleDelete se queda aquí sin cambios)
  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(pageNumber)) {
        newSelection.delete(pageNumber);
      } else {
        newSelection.add(pageNumber);
      }
      return newSelection;
    });
  };

  const handleDelete = async () => {
    if (selectedPages.size === 0 || !currentFile) {
      alert('Por favor, selecciona al menos una página para eliminar.');
      return;
    }
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('pagesToDelete', Array.from(selectedPages).join(','));

    try {
      const response = await fetch('/api/delete-pages', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('La respuesta del servidor no fue exitosa.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento_modificado.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al eliminar páginas:', error);
      alert('Ocurrió un error al procesar el PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCheckboxAction = (pageNumber: number) => (
    <div className="transparent p-2 cursor-pointer w-full h-full absolute top-0 right-0" 
      onClick={() => togglePageSelection(pageNumber)}>
       <Checkbox
          className="h-8 w-8 rounded-full bg-white shadow-md"
          checked={selectedPages.has(pageNumber)}
          onCheckedChange={() => togglePageSelection(pageNumber)}
          onClick={(e) => e.stopPropagation()}
        />
    </div>
  );

  const getSelectionSummaryText = (): string => {
    if (selectedPages.size === 0) {
      return 'Ninguna página seleccionada.';
    }
    const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
    return sortedPages.join(', ');
  };
  

  const deleteToolInfo = (
    <div>
      <div className="text-sm">
        <div>
          <span className="text-gray-700">Páginas seleccionadas:</span>
          <div className="my-2 md:my-4 text-gray-800 bg-gray-100 p-2 rounded-md max-h-24 overflow-y-auto text-center border">
            <p className="break-words font-mono tracking-wider">
              {getSelectionSummaryText()}
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex justify-between items-center pt-2 md:pt-4 border-t">
          <span className="text-gray-700">Total de Páginas a eliminar:</span>
          <span className="font-bold text-lg">{selectedPages.size}</span>
        </div>

      </div>
    </div>
  );

  const deleteActionButton = (
    <Button
      onClick={handleDelete}
      disabled={selectedPages.size === 0 || isProcessing}
      className="gap-2 h-12 w-full text-md font-bold"
      size="lg"
    >
      {isProcessing ? 'Procesando...' : (
        <>
          Eliminar Páginas <ArrowRight className="h-5 w-5" />
        </>
      )}
    </Button>
  );

  if (!currentFile) {
    return (
      <div className="max-w-xl mx-auto">
        <Dropzone 
          onFileAccepted={setCurrentFile} 
          accept={{ 'application/pdf': ['.pdf'] }}
          maxSize={10 * 1024 * 1024} 
          maxFiles={1}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-6 gap-8">
      <section className="col-span-4 bg-gray-50 rounded-lg p-4 mb-20">
        <PdfThumbnails renderAction={renderCheckboxAction} /> 
      </section>

      <ToolSidebar 
        toolInfoSection={deleteToolInfo}
        actionButton={deleteActionButton}
        actionDescription="Se descargará un nuevo archivo PDF con las páginas seleccionadas eliminadas."
      />

    </div>
  );
}