// src/app/api/merge-pdfs/route.ts

import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // 'getAll' es crucial para recibir múltiples archivos con el mismo nombre de campo
    const files = formData.getAll('files') as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: 'Se necesitan al menos dos archivos para unir.' },
        { status: 400 }
      );
    }

    // Crear un nuevo documento PDF vacío donde uniremos los demás
    const mergedPdf = await PDFDocument.create();

    // Iterar sobre cada archivo enviado en el orden correcto
    for (const file of files) {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Copiar todas las páginas del documento actual al documento fusionado
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Guardar el PDF fusionado en un buffer
    const mergedPdfBytes = await mergedPdf.save();

    return new Response(mergedPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documento_unido.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error al unir PDFs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar los archivos';
    return NextResponse.json(
      { error: `Error al procesar los archivos: ${errorMessage}` },
      { status: 500 }
    );
  }
}