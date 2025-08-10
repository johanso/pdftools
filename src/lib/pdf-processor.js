// src/lib/pdf-processor.js
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');

async function generatePdfThumbnails(fileBuffer, options = {}) {

  const { maxPages = 10 } = options;

  try {
    const pdf = await pdfjsLib.getDocument({
      data: fileBuffer,
      disableWorker: true,
      useSystemFonts: true,
    }).promise;

    const thumbnails = [];
    const SCALE = 1.0;

    for (let i = 1; i <= Math.min(pdf.numPages, maxPages); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
        background: 'rgba(255, 255, 255, 1)',
      }).promise;

      thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
    }

    return {
      thumbnails,
      pageCount: pdf.numPages,
      processedPages: Math.min(pdf.numPages, maxPages)
    };

  } catch (error) {
    console.error('Error en generatePdfThumbnails:', error);
    throw error;
  }
}

module.exports = { generatePdfThumbnails };