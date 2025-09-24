const fs = require('fs-extra');
const path = require('path');
const { default: imageSize } = require('image-size');

async function formatBMP(filePath) {
  const buffer = await fs.readFile(filePath);
  const dimensions = imageSize(buffer);
  return [
    `File: ${path.basename(filePath)}`,
    `Dimensions: ${dimensions.width}x${dimensions.height}`,
    `Format: BMP`
  ];
}

module.exports = formatBMP;