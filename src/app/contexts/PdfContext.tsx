// src/contexts/PdfContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

export interface PdfPage {
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
}

interface PdfContextType {
  currentFile: File | null;
  pages: PdfPage[];
  setCurrentFile: (file: File | null) => void;
  setPages: (pages: PdfPage[]) => void;
  clearPdf: () => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children: ReactNode }) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);

  const clearPdf = () => {
    // Limpiar URLs de objetos para evitar fugas de memoria
    pages.forEach(page => URL.revokeObjectURL(page.imageUrl));
    setPages([]);
    setCurrentFile(null);
  };

  return (
    <PdfContext.Provider value={{ currentFile, pages, setCurrentFile, setPages, clearPdf }}>
      {children}
    </PdfContext.Provider>
  );
}

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdf debe usarse dentro de un PdfProvider');
  }
  return context;
}