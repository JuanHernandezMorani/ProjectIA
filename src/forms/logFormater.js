const fs = require('fs-extra');
const path = require('path');

async function formatLog(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const lastLines = lines.slice(-10);
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: Log`,
    `Últimas líneas:\n${lastLines.join('\n')}`
  ];
}

module.exports = formatLog;