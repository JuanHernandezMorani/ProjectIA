const fs = require('fs-extra');
const xml2js = require('xml2js');

async function formatXML(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  try {
    const parsed = await xml2js.parseStringPromise(content);
    return [JSON.stringify(parsed, null, 2)];
  } catch {
    return [content];
  }
}

module.exports = formatXML;