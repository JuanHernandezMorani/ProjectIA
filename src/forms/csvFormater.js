const fs = require('fs-extra');
const path = require('path');
const { parse } = require('csv-parse/sync');

function formatCSV(filePath) {
  const rawBuffer = fs.readFileSync(filePath);
  const decoded = iconv.decode(rawBuffer, 'utf16le');
  try {
    const cleaned = decoded
      .split('\n')
      .filter(line => line.trim().split(',').length >= 2)
      .join('\n');
    const records = parse(cleaned, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
    return [
      `Archivo: ${path.basename(filePath)}`,
      `Tipo: CSV`,
      `Registros: ${records.length}`,
      `Columnas: ${Object.keys(records[0] || {}).join(', ')}`
    ];
  } catch (err) {
    return [`Error al parsear CSV: ${err.message}`];
  }
}

module.exports = formatCSV;