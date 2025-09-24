const fs = require('fs-extra');
const toml = require('toml');

async function formatTOML(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  try {
    const parsed = toml.parse(content);
    return [JSON.stringify(parsed, null, 2)];
  } catch {
    return [content];
  }
}

module.exports = formatTOML;