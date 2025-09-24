const path = require('path');
const { NodeIO } = require('@gltf-transform/core');

async function formatGLTF(filePath) {
    const io = new NodeIO();
    const document = io.read(filePath);
    const root = document.getRoot();
    const scenes = root.listScenes();
    const meshes = root.listMeshes();
    const materials = root.listMaterials();
    const animations = root.listAnimations();
  
    return [
      `Archivo: ${path.basename(filePath)}`,
      `Tipo: glTF`,
      `Cantidad de Escenas: ${scenes.length}`,
      `Escenas: ${scenes}`,
      `Cantidad de Mallas: ${meshes.length}`,
      `Mallas: ${meshes}`,
      `Cantidad de Materiales: ${materials.length}`,
      `Materiales: ${materials}`,
      `Cantidad de Animaciones: ${animations.length}`,
      `Animaciones: ${animations}`
    ];
  }

  module.exports = formatGLTF;