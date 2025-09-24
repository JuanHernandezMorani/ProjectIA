const fs = require('fs-extra');

async function formatMCFunction(filePath) {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const commandCount = lines.length;
    return [`Archivo .mcfunction con ${commandCount} comandos de Minecraft.`, content];
  }

  module.exports = formatMCFunction;