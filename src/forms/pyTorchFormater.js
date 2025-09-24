const fs = require('fs-extra');
const path = require('path');

async function formatPyTorch(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return [
    `File: ${path.basename(filePath)}`,
    `Format: PyTorch model (.pt)`,
    `Content Preview: ${content.slice(0, 1200)}...`
  ];
}

module.exports = formatPyTorch;