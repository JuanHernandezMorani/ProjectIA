const fs = require('fs-extra');
const path = require('path');
const parseEXR = require('parse-exr');

async function formatEXR(filePath) {
  const buffer = await fs.readFile(filePath);
  const fileName = path.basename(filePath);
  try {
    const result = await parseEXR(buffer);
    return [
      `File: ${fileName}`,
      `Format: EXR`,
      `Width: ${result.width}`,
      `Height: ${result.height}`,
      `Channels: ${result.channels.map(c => c.name).join(', ')}`,
    ].join('\n');
  } catch (err) {
    return [`[ERROR] Could not parse EXR file: ${fileName}`, err.message];
  }
}

module.exports = formatEXR;