// src/components/pdf-upload/dropzone.tsx
'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileAccepted?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
}

export function Dropzone({
  className,
  onFileAccepted,
  multiple = false,
  accept = { 'application/pdf': ['.pdf'] },
  maxSize = 10 * 1024 * 1024,
  children,
  ...props
}: DropzoneProps) {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);
      setPreviewFiles([]);

      if (!multiple && fileRejections.length > 1) {
        const rejection = fileRejections[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setError(`El archivo es demasiado grande. Máximo: ${maxSize / 1024 / 1024}MB`);
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          setError('Tipo de archivo no válido. Solo se permiten PDFs.');
        } else {
          setError('Error al cargar el archivo.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setPreviewFiles(acceptedFiles);
        onFileAccepted?.(acceptedFiles);
      }
    },
    [onFileAccepted, maxSize, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple, // La clave para permitir uno o varios.
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          className
        )}
        {...props}
      >
        <input {...getInputProps()} />
        
        {/* Si el Dropzone tiene hijos (como un botón), los renderiza. */}
        {children ? (
          children
        ) : (
          // Si no, muestra el contenido por defecto.
          <div className="space-y-2">
            <div className="flex justify-center">
            <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            {previewFiles.length > 0 ? (
              <p className="text-sm text-gray-600">
                <span className="font-medium">{previewFiles[0].name}</span>
                {previewFiles.length > 1 && ` y ${previewFiles.length - 1} más`}
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">Sube archivos</span> o arrástralos aquí
                </p>
                <p className="text-xs text-gray-500">
                  PDF (hasta {maxSize / 1024 / 1024}MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}