// src/app/rotar-pdf/page.tsx
import RotatePdfClient from '@/components/pdf-rotator/RotatePdfClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotar PDF Gratis | Girar Páginas de PDF Online',
  description: 'Gira fácilmente las páginas de tus archivos PDF. Rota páginas individuales o todo el documento a la izquierda o derecha. Herramienta online, rápida y segura.',
  keywords: ['rotar pdf', 'girar pdf', 'orientación pdf', 'pdf online', 'gratis'],
};

export default function RotarPdfPage() {
  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <div className="mx-auto text-center mb-10 md:mb-16 mt-6">
        <h1 className="text-3xl font-bold">Rotar Páginas de un PDF</h1>
        <p className="text-lg text-gray-600 mt-2">
          Gira páginas individuales o todo el documento con un solo clic.
        </p>
      </div>
      <RotatePdfClient />
    </main>
  );
}