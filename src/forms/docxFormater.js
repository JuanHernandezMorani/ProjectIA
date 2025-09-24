const path = require('path');
const officeParser = require('officeparser');

async function formatDOCX(filePath) {
  const text = await officeParser.parseOfficeAsync(filePath);
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: DOCX`,
    `Contenido:\n${text.slice(0, 1200)}...`
  ];
}

module.exports = formatDOCX;