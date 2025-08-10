// src/app/api/modify-pages/route.ts
import { NextResponse } from 'next/server';
import { PDFDocument, RotationTypes } from 'pdf-lib';

// Definimos la forma de las instrucciones que esperamos
interface PageModification {
  pageNumber: number; // Basado en 1
  rotation?: number;  // Grados (ej: 90, -90, 180)
  delete?: boolean;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const modificationsStr = formData.get('modifications') as string | null;

    if (!file || !modificationsStr) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
    }

    const modifications: PageModification[] = JSON.parse(modificationsStr);
    
    const pdfBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Aplicamos las rotaciones primero
    for (const mod of modifications) {
      if (mod.rotation) {
        // Los índices de pdf-lib son basados en 0
        const page = pdfDoc.getPage(mod.pageNumber - 1);
        const currentRotation = page.getRotation().angle;
        // La nueva rotación se suma a la existente
        page.setRotation({ 
          type: RotationTypes.Degrees, 
          angle: (currentRotation + mod.rotation) % 360 
        });
      }
    }
    
    // Eliminamos las páginas marcadas (en orden descendente para no afectar índices)
    const pagesToDelete = modifications
      .filter(mod => mod.delete)
      .map(mod => mod.pageNumber)
      .sort((a, b) => b - a);
      
    for (const pageNumber of pagesToDelete) {
      pdfDoc.removePage(pageNumber - 1);
    }

    const newPdfBytes = await pdfDoc.save();

    return new Response(newPdfBytes, {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' },
    });

  } catch (error: any) {
    console.error('Error al modificar páginas:', error);
    return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
  }
}