// src/lib/pdf-processor.js
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');

// Configuración específica para Node.js
if (typeof window === 'undefined') {
  // Mock de Web Worker
  global.Worker = class MockWorker {
    constructor() {
      this.onmessage = () => {};
      this.postMessage = () => {};
      this.terminate = () => {};
    }
  };

  // Mock de MessageChannel
  global.MessageChannel = class {
    constructor() {
      this.port1 = {
        postMessage: () => {},
        onmessage: () => {}
      };
      this.port2 = {
        postMessage: () => {},
        onmessage: () => {}
      };
    }
  };
}

// Configuración global de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = false;

async function generatePdfThumbnails(fileBuffer) {
  try {
    console.log('Iniciando procesamiento de PDF...');
    
    const pdf = await pdfjsLib.getDocument({
      data: fileBuffer,
      useSystemFonts: true,
      disableFontFace: true,
      disableRange: true,
      disableStream: true,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableCreateObjectURL: true,
      disableAutoFetch: true,
      disableWorker: true,
      verbosity: 0
    }).promise;

    console.log(`PDF cargado. Número de páginas: ${pdf.numPages}`);
    const thumbnails = [];
    const SCALE = 1.0;
    const MAX_PAGES = 5;

    for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
      console.log(`Procesando página ${i}...`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
        enableWebGL: false,
        renderInteractiveForms: false,
        background: 'rgba(0,0,0,0)'
      }).promise;

      thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
      console.log(`Página ${i} procesada.`);
    }

    return {
      success: true,
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