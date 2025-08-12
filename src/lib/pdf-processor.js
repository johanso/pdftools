// src/lib/pdf-processor.js

// 1. Usamos 'require' para importar las librerías, que es más robusto en el backend.
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('@napi-rs/canvas');

// 2. Creamos la 'CanvasFactory' para inyectar nuestra implementación de canvas.
class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function generatePdfThumbnails(fileBuffer, options = {}) {
  const { maxPages = 10 } = options;
  try {
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;

    const thumbnails = [];
    const SCALE = 1.0;
    const canvasFactory = new NodeCanvasFactory();

    for (let i = 1; i <= Math.min(pdf.numPages, maxPages); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: SCALE });
      const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
      
      // 3. Pasamos la fábrica a la función de renderizado.
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport: viewport,
        canvasFactory: canvasFactory,
        background: 'rgba(255, 255, 255, 1)',
      };

      await page.render(renderContext).promise;

      thumbnails.push(canvasAndContext.canvas.toDataURL('image/jpeg', 0.8));
      canvasFactory.destroy(canvasAndContext);
    }

    return {
      thumbnails,
      pageCount: pdf.numPages,
      processedPages: Math.min(pdf.numPages, maxPages),
    };
  } catch (error) {
    console.error('Error en generatePdfThumbnails:', error);
    throw error;
  }
}

// 4. Usamos module.exports, que es el estándar para archivos .js con 'require'.
module.exports = { generatePdfThumbnails };