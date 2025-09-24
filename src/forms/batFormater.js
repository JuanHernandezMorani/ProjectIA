const fs = require('fs-extra');
const path = require('path');

async function formatBat(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const summary = [];

  summary.push(`Archivo: ${path.basename(filePath)}`);
  summary.push(`Tipo: Script de Windows (.bat)`);
  summary.push(`Líneas totales: ${lines.length}`);

  const commands = lines
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('::') && !l.startsWith('REM') && !l.startsWith('echo'))
    .map(l => l.split(' ')[0].toLowerCase());

  const uniqueCommands = [...new Set(commands)];

  summary.push(`Comandos usados: ${uniqueCommands.join(', ')}`);

  if (commands.includes('java')) summary.push(`Este script ejecuta una aplicación Java.`);
  if (commands.includes('start')) summary.push(`Este script abre otro programa o proceso.`);
  if (commands.includes('set')) summary.push(`Define variables de entorno.`);

  summary.push('Contenido parcial del script:\n' + lines.slice(0, 5).map(l => `> ${l}`).join('\n'));

  return summary;
}

module.exports = formatBat;