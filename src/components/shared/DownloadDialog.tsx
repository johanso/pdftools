// src/components/shared/DownloadDialog.tsx
'use client';

import React, { useState } from 'react';
import { useDownloadDialog } from '@/app/contexts/DownloadDialogContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

export default function DownloadDialog() {
  const { isOpen, closeDialog, startDownload } = useDownloadDialog();
  const [fileName, setFileName] = useState('documento_modificado');

  // Asegúrate de que el nombre del archivo no contenga la extensión .pdf
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value.replace(/\.pdf$/i, ''));
  };

  const handleConfirm = () => {
    if (fileName.trim()) {
      startDownload(fileName.trim() + '.pdf');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nombrar y Descargar Archivo</DialogTitle>
          <DialogDescription>
            Elige un nombre para tu nuevo documento PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2 pb-4">
          <div className="flex items-center">
            <Input
              id="fileName"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Ej: mi_documento_editado"
            />
            <span className="ml-2 text-black">.pdf</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="link" onClick={closeDialog}>Cancelar</Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Download className="h-4 w-4" />
            Confirmar y Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}