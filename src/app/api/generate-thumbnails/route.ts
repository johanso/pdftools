// src/app/api/generate-thumbnails/route.ts
import { NextResponse } from 'next/server';
import { generatePdfThumbnails } from '../../../lib/pdf-processor';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await generatePdfThumbnails(Buffer.from(arrayBuffer));

    return NextResponse.json({
      ...result,
    });

  } catch (error: any) {
    console.error('Error en la API Route:', error);
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