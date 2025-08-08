// src/components/pdf-upload/PdfThumbnails.tsx (Versión Backend)
'use client';

import { usePdf } from '@/app/contexts/PdfContext';
import { useEffect, useState } from 'react';

export default function PdfThumbnails() {
  const { currentFile, setPages } = usePdf();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPages, setLocalPages] = useState<{ pageNumber: number, imageUrl: string }[]>([]);

  useEffect(() => {
    if (!currentFile) {
      setLocalPages([]);
      return;
    }

    const generateThumbnails = async () => {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', currentFile);

      try {
        const response = await fetch('/api/generate-thumbnails', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to generate thumbnails on the server.');
        }

        const data = await response.json();
        const newPages = data.thumbnails.map((url: string, index: number) => ({
          pageNumber: index + 1,
          imageUrl: url,
        }));
        
        setLocalPages(newPages);
        // Opcional: si aún necesitas las páginas en el contexto global
        // setPages(newPages); 

      } catch (err: any) {
        console.error(err);
        // Intentamos obtener un mensaje más detallado del backend
        if (err.response) {
            const errorData = await err.response.json();
            setError(errorData.error || 'No se pudieron generar las vistas previas.');
        } else {
            setError('No se pudieron generar las vistas previas. Revisa la consola del servidor.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnails();

  }, [currentFile]);

  if (isLoading) {
    return <div className="text-center py-8">Generando vistas previas en el servidor...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (localPages.length === 0) {
    return <div className="text-center py-8">Selecciona un archivo PDF.</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {localPages.map((page) => (
          <div key={page.pageNumber} className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src={page.imageUrl}
              alt={`Página ${page.pageNumber}`}
              className="w-full h-auto object-contain bg-gray-200"
            />
            <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 border-t">
              Página {page.pageNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}