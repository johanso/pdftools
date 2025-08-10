// src/components/pdf-editor/DeletePdfClient.tsx
'use client';

import { useState } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import { Dropzone } from '@/components/pdf-upload/dropzone';
import PdfThumbnails from '@/components/pdf-upload/PdfThumbnails';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CircleCheckBig, CircleX, Upload } from 'lucide-react';
import ToolSidebar from '../shared/ToolSidebar';
import { usePdfActions } from '@/app/hooks/usePdfActions';
import ToolHeader, { ActionConfig } from '../shared/ToolHeader';

export default function DeletePdfClient() { 

  const { currentFile, pageCount, setCurrentFile, clearPdf } = usePdf();
  
  const { isProcessing, openDeleteDialog } = usePdfActions();
  const [selectedPages, setSelectedPages] = useState(new Set<number>());

  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages(prev => {
      const newSelection = new Set(prev);
      newSelection.has(pageNumber) ? newSelection.delete(pageNumber) : newSelection.add(pageNumber);
      return newSelection;
    });
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

  const handleDeleteClick = () => {
    if (selectedPages.size === 0 || !currentFile) {
      alert('Por favor, selecciona al menos una página para eliminar.');
      return;
    }
    openDeleteDialog(currentFile, selectedPages);
  };

  const handleFileAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedPages(new Set()); 
      setCurrentFile(acceptedFiles[0]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPages.size === pageCount) {
      setSelectedPages(new Set());
    } else {
      const allPageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
      setSelectedPages(new Set(allPageNumbers));
    }
  };

  const handleClearSelection = () => {
    setSelectedPages(new Set());
  };

  const toolbarActions: ActionConfig[] = [
    {
      id: 'upload-new',
      icon: <Upload style={{ width: '22px', height: '22px' }} />,
      tooltip: 'Subir un nuevo archivo',
      onClick: clearPdf,
      className: 'ml-auto',
    },
    {
      id: 'select-all',
      icon: <CircleCheckBig style={{ width: '22px', height: '22px' }} />,
      tooltip: selectedPages.size === pageCount ? 'Deseleccionar todo' : 'Seleccionar todo',
      onClick: handleSelectAll,
    },
    {
      id: 'clear-selection',
      icon: <CircleX style={{ width: '22px', height: '22px' }} />,
      tooltip: 'Borrar selección',
      onClick: handleClearSelection,
      disabled: selectedPages.size === 0,
      className: 'text-black',
    },
  ];

  const deleteToolInfo = (
    <div>
      <div className="text-sm">
        <div className="hidden md:flex justify-between items-center pt-2 md:pt-4 border-t">
          <span className="text-gray-700">Total de Páginas a eliminar:</span>
          <span className="font-bold text-lg">{selectedPages.size}</span>
        </div>
      </div>
    </div>
  );

  const deleteActionButton = (
    <Button
      onClick={handleDeleteClick}
      disabled={selectedPages.size === 0 || isProcessing}
      className="gap-2 h-12 w-full text-md font-bold"
      size="lg"
    >
      {isProcessing ? 'Procesando...' : (<><CircleX className="h-5 w-5" /> Eliminar Páginas</>)}
    </Button>
  );

  if (!currentFile) {
    return (
      <div className="max-w-xl mx-auto">
        <Dropzone onFileAccepted={handleFileAccepted} multiple={false}/>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-6 gap-8">
      <section className="col-span-4 bg-gray-50 rounded-lg mb-20 relative">
        
        <ToolHeader 
          title={`${selectedPages.size} / ${pageCount} seleccionadas`}
          actions={toolbarActions} 
        />

        <PdfThumbnails 
          renderAction={renderCheckboxAction} 
        /> 
      </section>

      <ToolSidebar 
        toolInfoSection={deleteToolInfo}
        actionButton={deleteActionButton}
        actionDescription="Se descargará un nuevo archivo PDF con las páginas seleccionadas eliminadas."
      />

    </div>
  );
}