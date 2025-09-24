const fs = require('fs-extra');
const path = require('path');
const { default: imageSize } = require('image-size');

async function formatTGA(filePath) {
    const buffer = await fs.readFile(filePath);
    const dimensions = imageSize(buffer);
    return [
      `File: ${path.basename(filePath)}`,
      `Dimensions: ${dimensions.width}x${dimensions.height}`,
      `Format: TGA`
    ];
  }

  module.exports = formatTGA;