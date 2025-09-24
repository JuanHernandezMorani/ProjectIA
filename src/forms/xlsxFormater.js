const path = require('path');
const readXlsxFile = require('read-excel-file/node');

async function formatXLSX(filePath) {
  const rows = await readXlsxFile(filePath);
  const preview = rows.slice(0, 20).map(row => row.join(', ')).join('\n');
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: XLSX`,
    `Contenido:\n${preview}`
  ];
}

module.exports = formatXLSX;