const fs = require('fs-extra');
const path = require('path');

async function formatRTF(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    parseRTF.string(content, (err, doc) => {
      if (err) return reject(err);
      const text = doc.content.map(part => part.value).join('');
      resolve([
        `Archivo: ${path.basename(filePath)}`,
        `Tipo: RTF`,
        `Contenido:\n${text.slice(0, 1000)}...`
      ]);
    });
  });
}

module.exports = formatRTF;