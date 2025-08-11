// src/app/contexts/DownloadDialogContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type DownloadFunction = (fileName: string) => Promise<void>;

interface DownloadDialogContextType {
  isOpen: boolean;
  openDialog: (downloadFunction: DownloadFunction, defaultFileName?: string) => void;
  closeDialog: () => void;
  startDownload: (fileName: string) => void;
}

const DownloadDialogContext = createContext<DownloadDialogContextType | undefined>(undefined);

export function useDownloadDialog() {
  const context = useContext(DownloadDialogContext);
  if (!context) {
    throw new Error('useDownloadDialog must be used within a DownloadDialogProvider');
  }
  return context;
}

export function DownloadDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Almacenamos la función que realmente hará el trabajo de descarga
  const [downloadFunction, setDownloadFunction] = useState<DownloadFunction | null>(null);
  const openDialog = (onConfirm: DownloadFunction) => {
    setDownloadFunction(() => onConfirm); // Guardamos la función de descarga
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDownloadFunction(null); // Limpiamos la función
  };

  const startDownload = async (fileName: string) => {
    if (downloadFunction) {
      await downloadFunction(fileName);
    }
    closeDialog();
  };

  const value = { isOpen, openDialog, closeDialog, startDownload };

  return (
    <DownloadDialogContext.Provider value={value}>
      {children}
    </DownloadDialogContext.Provider>
  );
}