// src/hooks/useFileProcessor.ts
'use client';

import { useState, useCallback } from 'react';
import { PdfFileWithPreview } from '@/types';

export function useFileProcessor() {
  const [files, setFiles] = useState<PdfFileWithPreview[]>([]);
  
  const generateThumbnail = useCallback(async (file: File): Promise<Partial<PdfFileWithPreview>> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      // Usamos la API unificada con el modo 'single'
      const response = await fetch('/api/generate-thumbnails?mode=single', {
        method: 'POST', body: formData,
      });
      if (!response.ok) return { isLoading: false };
      const data = await response.json();
      return { 
        thumbnailUrl: data.thumbnailUrl, 
        pageCount: data.pageCount,
        isLoading: false,
      };
    } catch (error) {
      console.error(`Error generando miniatura para ${file.name}:`, error);
      return { isLoading: false };
    }
  }, []);

  const addFiles = useCallback((acceptedFiles: File[]) => {
    const newFiles: PdfFileWithPreview[] = acceptedFiles.map(file => Object.assign(file, {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        isLoading: true,
        pageCount: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(async (newFile) => {
      const previewData = await generateThumbnail(newFile);
      setFiles(prev => prev.map(f => f.id === newFile.id ? Object.assign(f, previewData) : f));
    });
  }, [generateThumbnail]);

  const removeFile = (idToRemove: string) => {
    setFiles(prev => prev.filter(file => file.id !== idToRemove));
  };

  const reorderFiles = (reorderedFiles: PdfFileWithPreview[]) => {
    setFiles(reorderedFiles);
  };
  
  const clearFiles = () => {
    setFiles([]);
  };

  return { files, addFiles, removeFile, reorderFiles, clearFiles };
}