// src/components/pdf-upload/PdfThumbnails.tsx
'use client';

import { useEffect, useState, ReactNode, CSSProperties } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import Loader from '../shared/Loader';
import Image from 'next/image';

type RenderActionFunc = (pageNumber: number) => ReactNode;
type GetPageStyleFunc = (pageNumber: number) =>  CSSProperties | undefined;

interface PdfThumbnailsProps {
  renderAction?: RenderActionFunc;
  getPageStyle?: GetPageStyleFunc;
}

export default function PdfThumbnails({ renderAction, getPageStyle }: PdfThumbnailsProps) {
  const { currentFile, setPageCount, pdfIsLoading, setPdfIsLoading, } = usePdf();
  const [error, setError] = useState<string | null>(null);
  const [localPages, setLocalPages] = useState<{ pageNumber: number, imageUrl: string }[]>([]);

  useEffect(() => {
    if (!currentFile) {
      setLocalPages([]);
      setPageCount(0);
      return;
    }

    const generateThumbnails = async () => {
      setPdfIsLoading(true);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError('No se pudieron generar las vistas previas.');
      } finally {
        setPdfIsLoading(false);
      }
    };

    generateThumbnails();
  }, [currentFile, setPageCount, setPdfIsLoading]);

  if (pdfIsLoading) return <Loader text="Generando miniaturas..." />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (localPages.length === 0) return <div className="text-center py-8">No hay páginas para mostrar.</div>;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {localPages.map((page) => (
        <div 
          key={page.pageNumber} 
          className="relative flex flex-col border border-gray-200 rounded-lg overflow-hidden transition-all hover:scale-102"
        >
          <Image
            src={page.imageUrl}
            alt={`Página ${page.pageNumber}`}
            className="w-full h-auto max-h-[200px] object-contain object-center bg-white transition-transform duration-200 ease-in-out"
            style={getPageStyle?.(page.pageNumber)}
            width={500}
            height={500}
          />
          <div className="p-2 bg-white text-center text-xs text-gray-500 border-t border-gray-200 mt-auto">
            Página {page.pageNumber}
          </div>
          
          {renderAction && renderAction(page.pageNumber)}
        </div>
      ))}
    </div>
  );
}