const fs = require('fs-extra');
const path = require('path');

async function formatSH(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const summary = [];

  summary.push(`Archivo: ${path.basename(filePath)}`);
  summary.push(`Tipo: Script Bash/Linux (.sh)`);
  summary.push(`Líneas totales: ${lines.length}`);

  const commands = lines
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split(' ')[0].toLowerCase());

  const uniqueCommands = [...new Set(commands)];

  summary.push(`Comandos usados: ${uniqueCommands.join(', ')}`);

  if (commands.includes('npm') || commands.includes('apt') || commands.includes('pacman')) {
    summary.push(`Este script instala paquetes.`);
  }
  if (commands.includes('export')) summary.push(`Define variables de entorno.`);
  if (commands.includes('bash') || commands.includes('./')) summary.push(`Ejecuta otros scripts o binarios.`);

  summary.push('Contenido parcial del script:\n' + lines.slice(0, 5).map(l => `> ${l}`).join('\n'));

  return summary;
}

module.exports = formatSH;