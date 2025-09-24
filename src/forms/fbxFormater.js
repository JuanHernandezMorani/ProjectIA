const fs = require('fs-extra');
const path = require('path');
const { parseBinary } = require('fbx-parser');

async function formatFBX(filePath) {
  const buffer = fs.readFileSync(filePath);
  const fbxData = parseBinary(buffer);
  return [
    `Archivo: ${path.basename(filePath)}`,
    `Tipo: FBX`,
    `Nodos: ${fbxData.Objects?.length ?? 0}`,
    `Materiales: ${fbxData.Materials?.length ?? 0}`
  ];
}

module.exports = formatFBX;