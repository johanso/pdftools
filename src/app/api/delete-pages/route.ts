// src/app/api/delete-pages/route.ts

import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const pagesToDeleteStr = formData.get('pagesToDelete') as string | null; // e.g., "1,3,5"

    if (!file || !pagesToDeleteStr) {
      return NextResponse.json(
        { error: 'Faltan el archivo o las páginas a eliminar.' },
        { status: 400 }
      );
    }

    // Convertir la cadena de páginas a un array de números
    const pagesToDelete = pagesToDeleteStr.split(',').map(Number);
    
    const pdfBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Es más seguro eliminar las páginas en orden descendente para no alterar los índices
    // de las páginas que aún no se han procesado.
    pagesToDelete.sort((a, b) => b - a);

    for (const pageNumber of pagesToDelete) {
      // Los arrays en pdf-lib están basados en 0, así que restamos 1
      pdfDoc.removePage(pageNumber - 1);
    }

    // Guardar el PDF modificado en un buffer
    const newPdfBytes = await pdfDoc.save();

    // Devolver el nuevo PDF como un archivo para descargar
    return new Response(newPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documento_modificado.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error al eliminar páginas del PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar el PDF';
    return NextResponse.json(
      { error: `Error al procesar el PDF: ${errorMessage}` },
      { status: 500 }
    );
  }
}