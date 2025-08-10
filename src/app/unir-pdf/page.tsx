// src/app/unir-pdf/page.tsx
import MergePdfClient from '@/components/pdf-merger/MergePdfClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unir PDFs Gratis | Combinar Múltiples Archivos PDF Online',
  description: 'Combina varios archivos PDF en un único documento. Sube tus PDFs, reordénalos si es necesario y descarga el archivo unido al instante. Fácil y seguro.',
  keywords: ['unir pdf', 'combinar pdf', 'juntar pdf', 'fusionar pdf', 'pdf online'],
};

export default function UnirPdfPage() {
  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <div className="mx-auto text-center mb-10 md:mb-16 mt-6">
        <h1 className="text-3xl font-bold">
          Unir Archivos PDF 
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Combina varios PDFs en un solo documento. Arrastra y suelta para reordenar.
        </p>
      </div>

      <MergePdfClient />
    </main>
  );
}