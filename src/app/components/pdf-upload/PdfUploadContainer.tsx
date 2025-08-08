// src/components/pdf-upload/PdfUploadContainer.tsx
'use client';

import { Upload } from 'lucide-react';
import PdfThumbnails from './PdfThumbnails';
import { Dropzone } from './dropzone';
import { Button } from '../ui/button';
import { usePdf } from '@/app/contexts/PdfContext';

export default function PdfUploadContainer() {
  const { currentFile, clearPdf, setCurrentFile } = usePdf();

  const handleNewUpload = () => {
    clearPdf();
  };

  const handleFileAccepted = (file: File) => {
    setCurrentFile(file);
  };

  if (currentFile) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Vista previa del PDF</h2>
          <Button 
            variant="outline" 
            onClick={handleNewUpload}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Subir otro archivo
          </Button>
        </div>
        {/* PdfThumbnails ahora se encarga de llamar al backend */}
        <PdfThumbnails />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-4">
            Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionarlo.
          </p>
          <Dropzone 
            onFileAccepted={handleFileAccepted}
            className="mb-4"
          />
        </div>
      </div>
    </div>
  );
}