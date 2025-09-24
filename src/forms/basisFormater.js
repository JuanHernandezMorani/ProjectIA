const fs = require('fs-extra');
const path = require('path');
const { readBasisInfo } = require('./basis/loader');

async function formatBasis(filePath) {
  const buffer = await fs.readFile(filePath);
  const fileName = path.basename(filePath);
  try {
    const info = await readBasisInfo(buffer);
    return [
      `File: ${fileName}`,
      `Format: Basis Universal`,
      `Width: ${info.width}`,
      `Height: ${info.height}`,
      `Has Alpha: ${info.hasAlpha ? 'yes' : 'no'}`,
    ].join('\n');
  } catch (err) {
    return [`[ERROR] Could not parse Basis file: ${fileName}`, err.message].join('\n');
  }
}

module.exports = formatBasis;