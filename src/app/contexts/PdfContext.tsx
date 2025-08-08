// src/contexts/PdfContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

// No es necesario cambiar esta interfaz para el pageCount, ya que no es por página.
export interface PdfPage {
  pageNumber: number;
  imageUrl: string;
  width?: number;
  height?: number;
}

// 1. Actualizamos la interfaz del contexto para incluir la nueva información.
interface PdfContextType {
  currentFile: File | null;
  pages: PdfPage[]; // Este estado puede que ya no lo uses, pero lo dejamos.
  pageCount: number; // Número total de páginas del PDF.
  pdfIsLoading: boolean; // Indica si el PDF está cargando.
  setPdfIsLoading: (isLoading: boolean) => void; // Función para actualizar el estado de carga del PDF.
  setCurrentFile: (file: File | null) => void;
  setPages: (pages: PdfPage[]) => void; // Puede que ya no lo uses.
  setPageCount: (count: number) => void; // Función para actualizar el conteo.
  clearPdf: () => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children: ReactNode }) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);

  const clearPdf = () => {
    setPages([]);
    setCurrentFile(null);
    setPageCount(0);
  };

  const value = {
    currentFile,
    pages,
    pageCount,
    pdfIsLoading,
    setPdfIsLoading,
    setCurrentFile,
    setPages,
    setPageCount,
    clearPdf
  };

  return (
    <PdfContext.Provider value={value}>
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