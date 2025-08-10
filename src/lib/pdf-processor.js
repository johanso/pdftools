// src/lib/pdf-processor.js
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');

// La función ahora espera directamente el buffer de datos.
async function generatePdfThumbnails(fileBuffer) { // fileBuffer es un Uint8Array
  try {
    console.log('Iniciando procesamiento de PDF...');
    
    // Usamos el buffer directamente. No hay que extraer nada.
    const pdf = await pdfjsLib.getDocument({
      data: fileBuffer,
      disableWorker: true,
      useSystemFonts: true,
    }).promise;

    console.log(`PDF cargado. Número de páginas: ${pdf.numPages}`);
    const thumbnails = [];
    const SCALE = 1.0;
    const MAX_PAGES = 10;

    for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
      console.log(`Procesando página ${i}...`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
        background: 'rgba(255, 255, 255, 1)', // Fondo blanco
      }).promise;

      thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
      console.log(`Página ${i} procesada.`);
    }

    return {
      thumbnails,
      pageCount: pdf.numPages,
      processedPages: Math.min(pdf.numPages, MAX_PAGES)
    };

  } catch (error) {
    console.error('Error en generatePdfThumbnails:', error);
    throw error;
  }
}

module.exports = { generatePdfThumbnails };