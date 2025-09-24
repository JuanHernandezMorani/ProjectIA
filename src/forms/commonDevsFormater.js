const fs = require('fs-extra');
const path = require('path');

async function formatCode(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.css', '.html', '.php', '.cpp', '.c', '.cs', '.sql'].includes(ext)) {
    const content = await fs.readFile(filePath, 'utf-8');
    return [content];
  }

  return [`Unsupported file type: ${filePath}`];
}

module.exports = formatCode;