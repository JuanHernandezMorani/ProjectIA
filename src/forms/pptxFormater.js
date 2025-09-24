const path = require('path');
const officeParser = require('officeparser');

async function formatPPTX(filePath) {
  const text = await officeParser.parseOfficeAsync(filePath);
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: PPTX`,
    `Contenido:\n${text.slice(0, 1200)}...`
  ];
}

module.exports = formatPPTX;