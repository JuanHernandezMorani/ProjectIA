const fs = require('fs-extra');

async function formatJSON(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  try {
    const parsed = JSON.parse(content);
    return [JSON.stringify(parsed, null, 2)];
  } catch {
    return [content];
  }
}

module.exports = formatJSON;