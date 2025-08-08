// src/app/eliminar-pdf/page.tsx
// ¡¡¡SIN 'use client'!!! Esto ahora es un Server Component.

import type { Metadata } from 'next';
import DeletePdfClient from '@/components/pdf-editor/DeletePdfClient'; // Importamos el nuevo componente

// 1. Exportamos los metadatos para el SEO
export const metadata: Metadata = {
  title: 'Eliminar Páginas de un PDF Gratis | Herramienta Online',
  description: 'Sube tu archivo PDF, selecciona fácilmente las páginas que no necesitas y descarga una nueva versión limpia y optimizada. Rápido, seguro y online.',
  keywords: ['eliminar páginas pdf', 'quitar hojas pdf', 'editor pdf', 'pdf online', 'gratis'],
  // Puedes añadir más metadatos Open Graph para redes sociales
  openGraph: {
    title: 'Eliminar Páginas de un PDF Gratis | Herramienta Online',
    description: 'Una forma sencilla de limpiar tus documentos PDF eliminando páginas no deseadas.',
    // Añade la URL de tu imagen de vista previa
    // images: ['/path/to/your/preview-image.jpg'], 
  },
};

// 2. Este es el componente de la página
export default function EliminarPdfPage() {
  return (
    // Renderizamos el layout estático que los bots de Google verán
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold">
          Eliminar Páginas de un PDF
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Sube tu documento, selecciona las páginas y descarga tu PDF modificado al instante.
        </p>
      </div>

      <DeletePdfClient />
    </main>
  );
}