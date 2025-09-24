const fs = require('fs-extra');

async function formatMCMETA(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  let json;
  try {
    json = JSON.parse(content);
  } catch {
    return ['Archivo .mcmeta inválido: JSON no válido.'];
  }

  if (json.animation) {
    return [json, 'Archivo .mcmeta que define una animación para una textura.'];
  } else if (json.pack) {
    const desc = json.pack.description || 'Sin descripción';
    const format = json.pack.pack_format || 'desconocido';
    return [json, `Archivo .mcmeta de paquete con descripción: "${desc}" y formato: ${format}.`];
  }

  return [json, 'Archivo .mcmeta con estructura desconocida.'];
}

module.exports = formatMCMETA;