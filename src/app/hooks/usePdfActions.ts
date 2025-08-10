// src/hooks/usePdfActions.ts
'use client';

import { useState } from 'react';
import { useDownloadDialog } from '@/app/contexts/DownloadDialogContext';

type PageModification = { 
  pageNumber: number; 
  rotation?: number; 
  delete?: boolean; 
};


export function usePdfActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { openDialog } = useDownloadDialog();

  // Función genérica para manejar la descarga del blob
  const handleBlobDownload = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Acción para ELIMINAR páginas
  const processDelete = async (file: File, pagesToDelete: Set<number>, fileName: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pagesToDelete', Array.from(pagesToDelete).join(','));
    
    try {
      const response = await fetch('/api/delete-pages', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Error del servidor al eliminar páginas.');
      const blob = await response.blob();
      handleBlobDownload(blob, fileName);
    } catch (error) {
      console.error('Error en processDelete:', error);
      alert('Ocurrió un error al eliminar las páginas.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Acción para UNIR PDFs
  const processMerge = async (files: File[], fileName: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/merge-pdfs', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Error del servidor al unir los PDFs.');
      const blob = await response.blob();
      handleBlobDownload(blob, fileName);
    } catch (error) {
      console.error('Error en processMerge:', error);
      alert('Ocurrió un error al unir los archivos.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Nueva acción para MODIFICAR páginas
  const processModify = async (file: File, modifications: PageModification[], fileName: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('modifications', JSON.stringify(modifications));
    
    try {
      const response = await fetch('/api/modify-pages', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Error del servidor al modificar páginas.');
      const blob = await response.blob();
      handleBlobDownload(blob, fileName);
    } catch (error) {
      console.error('Error en processModify:', error);
      alert('Ocurrió un error al modificar las páginas.');
    } finally {
      setIsProcessing(false);
    }
  };


  return {
    isProcessing,
    openDeleteDialog: (file: File, pagesToDelete: Set<number>) => {
      if (!file || pagesToDelete.size === 0) return;
      openDialog((fileName) => processDelete(file, pagesToDelete, fileName), 'documento_editado');
    },
    openMergeDialog: (files: File[]) => {
      if (files.length < 2) return;
      openDialog((fileName) => processMerge(files, fileName), 'documento_unido');
    },
    openModifyDialog: (file: File, modifications: PageModification[]) => {
      if (!file || modifications.length === 0) return;
      openDialog((fileName) => processModify(file, modifications, fileName), 'documento_rotado');
    },
  };
}