const fs = require('fs-extra');

async function formatMTL(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const materialCount = (content.match(/^newmtl\s/gm) || []).length;
  return [(content.match(/^newmtl\s/gm) || []), `Archivo .mtl con ${materialCount} materiales definidos.`];
}

module.exports = formatMTL;