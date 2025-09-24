const fs = require('fs-extra');
const path = require('path');

async function formatONNX(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return [
    `File: ${path.basename(filePath)}`,
    `Format: ONNX model`,
    `Content Preview: ${content.slice(0, 1200)}...`
  ];
}

module.exports = formatONNX;