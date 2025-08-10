// src/app/api/generate-thumbnails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generatePdfThumbnails } from '../../../lib/pdf-processor.js';

export async function POST(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    // Leemos el modo: 'single' para la primera página, 'all' para múltiples
    const mode = searchParams.get('mode') || 'all';
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'No se proporcionó un archivo válido.' },
        { status: 400 }
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await generatePdfThumbnails(new Uint8Array(arrayBuffer), {
      maxPages: mode === 'single' ? 1 : 10,
    });

    if (mode === 'single') {
      return NextResponse.json({
        success: true,
        thumbnailUrl: result.thumbnails[0],
        pageCount: result.pageCount,
      });
    } else {
      return NextResponse.json({
        success: true,
        ...result,
      });
    }

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