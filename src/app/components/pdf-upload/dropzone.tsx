'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

type FileWithPreview = File & {
  preview: string;
};

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileAccepted?: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
}

export function Dropzone({
  className,
  onFileAccepted,
  accept = {
    'application/pdf': ['.pdf'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  ...props
}: DropzoneProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('El archivo es demasiado grande. Tamaño máximo: 5MB');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Solo se permiten archivos PDF');
      } else {
        setError('Error al cargar el archivo');
      }
      return;
    }

    const acceptedFile = acceptedFiles[0];
    if (acceptedFile) {
      const fileWithPreview = Object.assign(acceptedFile, {
        preview: URL.createObjectURL(acceptedFile),
      });
      setFile(fileWithPreview);
      onFileAccepted?.(acceptedFile);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
  });

  React.useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

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
          {file ? (
            <p className="text-sm text-gray-600">
              Archivo seleccionado: <span className="font-medium">{file.name}</span>
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">Sube un archivo</span> o arrástralo aquí
              </p>
              <p className="text-xs text-gray-500">
                PDF (hasta 5MB)
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
