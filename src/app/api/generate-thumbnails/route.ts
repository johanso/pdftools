// src/app/api/generate-thumbnails/route.ts
import { NextResponse } from 'next/server';
const { generatePdfThumbnails } = require('../../../lib/pdf-processor.js');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'No se proporcionó un archivo válido.' },
        { status: 400 }
      );
    }
    
    // 1. Extraemos el buffer aquí.
    const arrayBuffer = await file.arrayBuffer();
    
    // 2. Pasamos el buffer (como Uint8Array) al procesador.
    const result = await generatePdfThumbnails(new Uint8Array(arrayBuffer));

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error: any) {
    console.error('Error en la API Route (generate-thumbnails):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al procesar el PDF',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}