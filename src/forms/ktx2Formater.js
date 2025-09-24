const fs = require('fs-extra');
const path = require('path');
const parseKTX = require('ktx-parse');

async function formatKTX2(filePath) {
    const buffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    try {
      const result = parseKTX(buffer);
      return [
        `File: ${fileName}`,
        `Format: KTX2`,
        `Width: ${result.pixelWidth}`,
        `Height: ${result.pixelHeight}`,
        `Mip Levels: ${result.numberOfMipmapLevels}`,
      ].join('\n');
    } catch (err) {
      return [`[ERROR] Could not parse KTX2 file: ${fileName}`, err.message];
    }
  }

  module.exports = formatKTX2;