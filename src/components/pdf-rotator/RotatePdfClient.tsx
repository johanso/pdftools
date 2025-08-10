// src/components/pdf-rotator/RotatePdfClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import { usePdfActions } from '@/app/hooks/usePdfActions';
import { Dropzone } from '@/components/pdf-upload/dropzone';
import PdfThumbnails from '@/components/pdf-upload/PdfThumbnails';
import ToolHeader, { ActionConfig } from '@/components/shared/ToolHeader';
import ToolSidebar from '@/components/shared/ToolSidebar';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, Trash2, Download, RefreshCw, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type PageState = {
  rotation: number;
  isDeleted: boolean;
};

export default function RotatePdfClient() {
  const { currentFile, pageCount, setCurrentFile, clearPdf } = usePdf();
  const { isProcessing, openModifyDialog } = usePdfActions();
  const [pageStates, setPageStates] = useState<Record<number, PageState>>({});
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);

  const handleFileAccepted = (files: File[]) => {
    if (files.length > 0) {
      setPageStates({});
      setCurrentFile(files[0]);
    }
  };

  const updatePageState = (pageNumber: number, newValues: Partial<PageState>) => {
    setPageStates(prevPageStates => {
      const currentPageState = prevPageStates[pageNumber] || { rotation: 0, isDeleted: false };
      return {
        ...prevPageStates,
        [pageNumber]: {
          ...currentPageState,
          ...newValues,
        },
      };
    });
  };
  
  const handleRotateAll = (degrees: 90 | -90) => {
    setPageStates(prevPageStates => {
      const newStates: Record<number, PageState> = { ...prevPageStates };
      for (let i = 1; i <= pageCount; i++) {
        const currentState = prevPageStates[i] || { rotation: 0, isDeleted: false };
        if (!currentState.isDeleted) {
          newStates[i] = { 
            ...currentState, 
            rotation: currentState.rotation + degrees, 
          };
        }
      }
      return newStates;
    });
  };
  
  const handleReset = () => setPageStates({});

  const modifications = useMemo(() => {
    return Object.entries(pageStates).map(([page, state]) => ({
      pageNumber: Number(page),
      rotation: (state.rotation % 360 + 360) % 360,
      delete: state.isDeleted,
    })).filter(mod => mod.rotation !== 0 || mod.delete);
  }, [pageStates]);

  const handleApplyChanges = () => {
    if (!currentFile || modifications.length === 0) {
      alert('No has realizado ningún cambio para aplicar.');
      return;
    }
    openModifyDialog(currentFile, modifications);
  };

  const confirmDeletePage = () => {
    if (pageToDelete) {
      updatePageState(pageToDelete, { isDeleted: true });
    }
    setPageToDelete(null);
  };
  
  // La UI para las acciones de cada miniatura
  const renderPageActions = (pageNumber: number) => {
    const state = pageStates[pageNumber] || { rotation: 0, isDeleted: false };

    const handleRotate = (page: number, degrees: number) => {
      setPageStates(prev => {
        const currentState = prev[page] || { rotation: 0, isDeleted: false };
        const newRotation = currentState.rotation + degrees;
        return {
          ...prev,
          [page]: {
            ...currentState,
            rotation: newRotation,
          }
        };
      });
    }

    if (state.isDeleted) {
      return (
        <div className="absolute inset-0 bg-red-800/60 flex items-center justify-center rounded-lg">
          <Button size="sm" variant="ghost" className="text-white bg-black/30 hover:bg-black/50" onClick={() => updatePageState(pageNumber, { isDeleted: false })}>
            Deshacer
          </Button>
        </div>
      );
    }

    return (
      <div className="absolute left-2 top-2 flex gap-1 p-2">
        <Button 
          size="icon" 
          variant="destructive" 
          className="rounded-full h-8 w-8" 
          onClick={() => setPageToDelete(pageNumber)}
        >
          <Trash2 size={16} />
        </Button>
        <Button 
          size="icon" 
          className="bg-black/90 hover:bg-black/80 text-white rounded-full h-8 w-8" 
          onClick={() => handleRotate(pageNumber, -90)}
        >
          <RotateCcw size={16} />
        </Button>
        <Button 
          size="icon" 
          className="bg-black/90 hover:bg-black/80 text-white rounded-full h-8 w-8" 
          onClick={() => handleRotate(pageNumber, 90)}
        >
          <RotateCw size={16} />
        </Button>
      </div>
    );
  };

  const toolbarActions: ActionConfig[] = [
    { id: 'rotate-all-left', 
      icon: <RotateCcw size={22} style={{ width: '22px', height: '22px' }} />, 
      tooltip: 'Rotar todo a la izquierda', 
      onClick: () => handleRotateAll(-90) },
    { id: 'rotate-all-right', 
      icon: <RotateCw size={22} style={{ width: '22px', height: '22px' }} />, 
      tooltip: 'Rotar todo a la derecha', 
      onClick: () => handleRotateAll(90) },
    { id: 'reset', 
      icon: <RefreshCw size={22} style={{ width: '22px', height: '22px' }} />, 
      tooltip: 'Restablecer todos los cambios', 
      onClick: handleReset, 
      disabled: modifications.length === 0 },
    { id: 'upload-new', 
      icon: <Upload size={22} style={{ width: '22px', height: '22px' }} />, 
      tooltip: 'Subir otro archivo', 
      onClick: clearPdf, 
      className: 'ml-auto' },
  ];

  const rotateToolInfo = (
    <>
      <div className="text-sm pt-2 mb-4">
        <p className="text-sm text-gray-700">Pasa el cursor sobre una página para ver las opciones de rotación y eliminación.</p>
      </div>
      <div>
        <div className="text-sm">
          <div className="hidden md:flex justify-between items-center pt-2 md:pt-4 border-t">
            <span className="text-gray-700">Total de Páginas a rotar:</span>
            <span className="font-bold text-lg">{modifications.length}</span>
          </div>
        </div>
      </div>
    </>
  );
  
  const rotateActionButton = (
    <Button onClick={handleApplyChanges} disabled={modifications.length === 0 || isProcessing} size="lg" className="w-full h-12 text-md font-bold gap-2">
      {isProcessing ? 'Procesando...' : <><Download size={20} /> Aplicar Cambios y Descargar</>}
    </Button>
  );

  if (!currentFile) {
    return (
      <div className="max-w-xl mx-auto">
        <Dropzone onFileAccepted={handleFileAccepted} />
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-6 gap-8">

        <section className="col-span-4 bg-gray-50 rounded-lg mb-20 relative">
          <ToolHeader title={`${modifications.length} cambio(s) pendientes`} actions={toolbarActions} />
          <PdfThumbnails 
            renderAction={renderPageActions}
            getPageStyle={(pageNumber) => ({ 
              transform: `rotate(${pageStates[pageNumber]?.rotation || 0}deg)`,
              transition: 'transform 0.2s ease-in-out',
              opacity: pageStates[pageNumber]?.isDeleted ? 0.5 : 1,
            })}
          />
        </section>

        <ToolSidebar
          toolInfoSection={rotateToolInfo}
          actionButton={rotateActionButton}
          actionDescription="Se descargará un nuevo PDF con todas las modificaciones aplicadas."
        />
      </div>

      <AlertDialog open={!!pageToDelete} onOpenChange={(isOpen) => !isOpen && setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta página?</AlertDialogTitle>
            <AlertDialogDescription>
              La página {pageToDelete} será eliminada cuando apliques los cambios. Puedes deshacer esta acción en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePage}>Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}