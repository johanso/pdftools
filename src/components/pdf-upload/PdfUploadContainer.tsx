// src/components/pdf-upload/PdfUploadContainer.tsx
'use client';
import React from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import PdfThumbnails from '@/components/pdf-upload/PdfThumbnails';
import DropzoneInfoFile from '@/components/pdf-upload/dropzoneInfoFile';
import { Dropzone } from '@/components/pdf-upload/dropzone';

export default function PdfUploadContainer() {
  const { currentFile, pageCount, setCurrentFile } = usePdf();

  const handleFileAccepted = (file: File) => {
    setCurrentFile(file);
  };

  if (currentFile) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <DropzoneInfoFile uploadedFile={currentFile} pageCount={pageCount} />
        </div>
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