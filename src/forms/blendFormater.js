const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');

async function formatGLTFFromPath(gltfPath) {
  try{const content = await fs.readFile(gltfPath, 'utf-8');
    const json = JSON.parse(content);
  
    const scenes = json.scenes ? json.scenes : 0;
    const meshes = json.meshes ? json.meshes : 0;
    const materials = json.materials ? json.materials : 0;
    const animations = json.animations ? json.animations : 0;
  
    return {
      scenes,
      meshes,
      materials,
      animations
    };}
    catch(e){
      return {
        scenes: null,
        meshes: null,
        materials: null,
        animations: null
      }
    }
  
}

async function formatBlend(filePath) {
  let tmpDir;

  try {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'blend2gltf-'));
    const outputGLTF = path.join(tmpDir, 'converted.gltf');
    const exportScript = path.join(tmpDir, 'export_gltf.py');

    const scriptContent = `
import bpy
bpy.ops.wm.open_mainfile(filepath=${JSON.stringify(filePath)})
bpy.ops.export_scene.gltf(filepath=${JSON.stringify(outputGLTF)}, export_format='GLTF_SEPARATE')
`;

    await fs.writeFile(exportScript, scriptContent);

    await new Promise((resolve, reject) => {
      execFile('blender', ['--background', '--python', exportScript], (error, stdout, stderr) => {
        if (error) {
          reject(`Blender error: ${stderr}`);
        } else {
          resolve();
        }
      });
    });

    const data = await formatGLTFFromPath(outputGLTF);

    return [
      `Archivo: ${path.basename(filePath)}`,
      `Tipo: Blender (.blend)`,
      `Exportado temporalmente como .gltf para análisis`,
      `Cantidad de Escenas: ${data.scenes.length}`,
      `Escenas: ${data.scenes}`,
      `Cantidad de Mallas: ${data.meshes.length}`,
      `Mallas: ${data.meshes}`,
      `Cantidad de Materiales: ${data.materials.length}`,
      `Materiales: ${data.materials}`,
      `Cantidad de Animaciones: ${data.animations.length}`,
      `Animaciones: ${data.animations}`
    ];
  } catch (e) {
    return [
      `Archivo: ${path.basename(filePath)}`,
      `Tipo: Blender (.blend)`,
      `Error procesando archivo: ${e}`
    ];
  } finally {
    if (tmpDir) {
      await fs.remove(tmpDir);
    }
  }
}

module.exports = formatBlend;