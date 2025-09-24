const fs = require('fs-extra');

async function formatTXTHeuristic(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const lower = content.toLowerCase();

  if (lower.includes('changelog') || lower.includes('version')) {
    return [lower, 'Archivo .txt posiblemente contiene un changelog o registro de versiones.'];
  }
  if (lower.includes('usage') || lower.includes('how to') || lower.includes('instrucciones')) {
    return [lower, 'Archivo .txt que parece contener instrucciones de uso.'];
  }
  if (lower.includes('license') || lower.includes('copyright')) {
    return [lower, 'Archivo .txt que parece contener una licencia o aviso legal.'];
  }
  if (lower.includes('todo') || lower.includes('fix') || lower.includes('idea')) {
    return [lower, 'Archivo .txt con ideas o tareas pendientes.'];
  }

  return [lower, 'Archivo .txt genérico sin heurísticas claras.'];
}

module.exports = formatTXTHeuristic;