const fs = require('fs-extra');
const path = require('path');

async function formatEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line && !line.startsWith('#'));
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: ENV`,
    `Variables:\n${lines.join('\n')}`
  ];
}

module.exports = formatEnv;