const fs = require('fs-extra');
const path = require('path');

async function formatLua(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: Lua`,
    `Contenido:\n${content.slice(0, 1200)}...`
  ];
}

module.exports = formatLua;