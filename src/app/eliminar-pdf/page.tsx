// src/app/eliminar-pdf/page.tsx

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

export default function EliminarPdfPage() {
  return (
    <main className="max-w-screen-xl mx-auto p-6">

      <div className="mx-auto text-center mb-10 md:mb-16 mt-6">
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