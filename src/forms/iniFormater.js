const fs = require('fs-extra');
const path = require('path');

async function formatINI(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return [
    `File: ${path.basename(filePath)}`,
    `Format: INI`,
    `Content Preview: ${content.slice(0, 1200)}...`
  ];
}

module.exports = formatINI;