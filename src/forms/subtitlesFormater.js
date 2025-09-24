const fs = require('fs-extra');
const path = require('path');

async function formatSubtitles(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return [
    `File: ${path.basename(filePath)}`,
    `Subtitle Format: ${path.extname(filePath).toUpperCase()}`,
    `Length: ${content.split('\n').length} lines`,
    `Content Preview: ${content.slice(0, 1200)}...`
  ];
}

module.exports = formatSubtitles;