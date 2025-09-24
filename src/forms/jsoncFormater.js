const fs = require('fs-extra');
const jsonc = require('jsonc-parser');

async function formatJSONC(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const parsed = jsonc.parse(content);
  return [JSON.stringify(parsed, null, 2)];
}

module.exports = formatJSONC;