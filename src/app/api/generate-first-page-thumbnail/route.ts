// src/app/api/generate-first-page-thumbnail/route.ts
import { NextResponse } from 'next/server';
const { generatePdfThumbnails } = require('../../../lib/pdf-processor.js');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó un archivo válido.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await generatePdfThumbnails(new Uint8Array(arrayBuffer));

    if (result && result.thumbnails && result.thumbnails.length > 0) {
      return NextResponse.json({
        success: true,
        thumbnailUrl: result.thumbnails[0],
        pageCount: result.pageCount,
      });
    } else {
      throw new Error('No se pudo generar la miniatura.');
    }

  } catch (error: any) {
    console.error('Error en la API de miniatura:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}