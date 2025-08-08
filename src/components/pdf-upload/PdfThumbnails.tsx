// src/components/pdf-upload/PdfThumbnails.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';

// 1. Definimos el tipo para la nueva prop
type RenderActionFunc = (pageNumber: number) => ReactNode;

interface PdfThumbnailsProps {
  // 2. Hacemos que la prop sea opcional
  renderAction?: RenderActionFunc;
}

export default function PdfThumbnails({ renderAction }: PdfThumbnailsProps) {
  const { currentFile, setPageCount } = usePdf();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // El estado de las páginas ahora es local a este componente
  const [localPages, setLocalPages] = useState<{ pageNumber: number, imageUrl: string }[]>([]);

  useEffect(() => {
    if (!currentFile) {
      setLocalPages([]);
      setPageCount(0);
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

        if (!response.ok) throw new Error('Failed to generate thumbnails on the server.');
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Unknown error from API.');

        const newPages = data.thumbnails.map((url: string, index: number) => ({
          pageNumber: index + 1,
          imageUrl: url,
        }));
        
        setLocalPages(newPages);
        setPageCount(data.pageCount || 0);

      } catch (err: any) {
        console.error(err);
        setError('No se pudieron generar las vistas previas.');
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnails();
  }, [currentFile, setPageCount]);

  if (isLoading) return <div className="text-center py-8">Generando vistas previas...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (localPages.length === 0) return <div className="text-center py-8">No hay páginas para mostrar.</div>;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {localPages.map((page) => (
        // 3. Cada miniatura es un contenedor relativo
        <div key={page.pageNumber} className="relative flex flex-col border border-gray-200 rounded-lg overflow-hidden transition-all hover:scale-102">
          <img
            src={page.imageUrl}
            alt={`Página ${page.pageNumber}`}
            className="w-full h-auto object-contain bg-white"
          />
          <div className="p-2 bg-white text-center text-xs text-gray-500 border-t border-gray-200">
            Página {page.pageNumber}
          </div>
          
          {renderAction && renderAction(page.pageNumber)}
        </div>
      ))}
    </div>
  );
}