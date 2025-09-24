const fs = require('fs-extra');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const Tesseract = require('tesseract.js');
const pdfPoppler = require('pdf-poppler');

async function formatPDF(filePath) {

  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({
    data,
    standardFontDataUrl: path.join(__dirname, '../node_modules/pdfjs-dist/legacy/standard_fonts/')
  }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(' ') + '\n';
  }
  if (text.trim()) {

    return [
      `Archivo: ${path.basename(filePath)}`,
      `Tipo: PDF`,
      `Páginas: ${pdf.numPages}`,
      `Contenido:\n${text.trim()}`
    ];
  } else {
    const outputDir = path.join(__dirname, 'temp_pdf_images');
    fs.mkdirSync(outputDir, { recursive: true });

    const options = {
      format: 'jpeg',
      out_dir: outputDir,
      out_prefix: 'page',
      page: null
    };

    await pdfPoppler.convert(filePath, options);

    const imageFiles = fs.readdirSync(outputDir)
      .filter(file => file.endsWith('.jpg'))
      .map(file => path.join(outputDir, file));

    const ocrResults = await Promise.all(imageFiles.map(imgPath =>
      Tesseract.recognize(imgPath, 'eng').then(({ data }) => data.text)
    ));

    imageFiles.forEach(img => fs.unlinkSync(img));
    fs.rmdirSync(outputDir);

    const ocrText = ocrResults.join('\n');
    return [
      `Archivo: ${path.basename(filePath)}`,
      `Tipo: PDF (OCR)`,
      `Contenido:\n${ocrText.slice(0, 1200)}...`
    ];
  }
}

module.exports = formatPDF;