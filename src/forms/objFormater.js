const fs = require('fs-extra');

async function formatOBJ(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const vertexCount = (content.match(/^v\s/gm) || []).length;
  const faceCount = (content.match(/^f\s/gm) || []).length;
  const materialLibs = (content.match(/^mtllib\s(.+)/gm) || []).map(line => line.split(' ')[1]);

  return [`Archivo .obj con ${vertexCount} vértices`, `${faceCount} caras`, `${materialLibs.length} archivos de materiales: ${materialLibs.join(', ') || 'ninguno'}.`];
}

module.exports = formatOBJ;