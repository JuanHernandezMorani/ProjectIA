const fs = require('fs-extra');

async function formatBBModel(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  let json;
  try {
    json = JSON.parse(content);
  } catch {
    return ['Archivo .bbmodel inválido: JSON no válido.'];
  }

  const name = json.name || 'modelo sin nombre';
  const elements = Array.isArray(json.elements) ? json.elements.length : 0;
  const textures = json.textures ? Object.keys(json.textures).length : 0;
  const bones = json.bones ? json.bones.length : 0;

  return [`Modelo Blockbench: ${name} con ${elements} elementos`, `${bones} huesos`, `${textures} texturas.`, json];
}

module.exports = formatBBModel;