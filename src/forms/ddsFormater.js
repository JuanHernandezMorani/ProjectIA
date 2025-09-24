const fs = require('fs-extra');
const path = require('path');
const dds = require('dds-parser');

async function formatDDS(filePath) {
  const buffer = await fs.readFile(filePath);
  const fileName = path.basename(filePath);
  try {
    const result = dds.parse(buffer);
    return [
      `File: ${fileName}`,
      `Format: DDS`,
      `Width: ${result.width}`,
      `Height: ${result.height}`,
      `Mipmaps: ${result.mipmapCount}`,
      `FourCC: ${result.fourCC}`,
    ].join('\n');
  } catch (err) {
    return [`[ERROR] Could not parse DDS file: ${fileName}`, err.message];
  }
}

module.exports = formatDDS;