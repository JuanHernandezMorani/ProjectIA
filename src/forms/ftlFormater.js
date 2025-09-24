const fs = require('fs-extra');
const path = require('path');
const { parseFluent } = require('fluent-syntax');

async function formatFTL(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const ast = parseFluent(content);

  const entries = ast.body
    .filter(entry => entry.type === 'Message')
    .map(entry => `• ${entry.id.name}${entry.value ? `: ${entry.value.value}` : ''}`);

  return [`File: ${path.basename(filePath)}\nEntries:\n${entries.join('\n')}`];
}

module.exports = formatFTL;