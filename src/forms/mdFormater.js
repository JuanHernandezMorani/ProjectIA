const fs = require('fs-extra');
const path = require('path');
const markdown = require('markdown-it')();

async function formatMarkdown(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const md = markdown.render(content);
  return [`File: ${path.basename(filePath)}`, `md preview:\n${md.slice(0, 1200)}...`];
}

module.exports = formatMarkdown;