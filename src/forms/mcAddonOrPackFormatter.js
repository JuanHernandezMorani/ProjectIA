const fs = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');

async function formatMCAddonOrPack(filePath) {
  const fileName = path.basename(filePath);
  const stats = await fs.stat(filePath);
  const summary = [];
  const extPreviewList = ['.json', '.lang', '.mcfunction'];

  if (stats.isFile()) {
    try {
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();

      const sizeKB = (stats.size / 1024).toFixed(2);
      summary.push(`Archivo: ${fileName}`);
      summary.push(`Tipo: ZIP (.mcaddon o .mcpack)`);
      summary.push(`Tamaño: ${sizeKB} KB`);

      const manifestEntry = entries.find(e => e.entryName.toLowerCase().includes('manifest.json'));
      let manifestData = null;

      if (manifestEntry) {
        try {
          manifestData = JSON.parse(manifestEntry.getData().toString('utf-8'));
          summary.push(`Nombre del addon: ${manifestData.header?.name || 'desconocido'}`);
          summary.push(`UUID: ${manifestData.header?.uuid || 'N/A'}`);
          summary.push(`Versión: ${manifestData.header?.version?.join('.') || 'N/A'}`);
          summary.push(`Tipo de módulos: ${manifestData.modules?.map(m => m.type).join(', ') || 'N/A'}`);
        } catch {
          summary.push('⚠️ No se pudo leer manifest.json');
        }
      } else {
        summary.push('⚠️ No se encontró manifest.json');
      }

      const names = entries.map(e => e.entryName.toLowerCase());
      if (names.some(n => n.includes('behavior_packs'))) summary.push(`Contiene: Behavior Pack`);
      if (names.some(n => n.includes('resource_packs'))) summary.push(`Contiene: Resource Pack`);
      if (names.some(n => n.includes('shaders'))) summary.push(`Contiene: Shader Pack`);

      summary.push(`Archivos totales: ${entries.length}`);
      summary.push(`Estructura de contenido:\n${formatTree(buildStructureTree(entries))}`);

      const samples = extractFileSamples(entries, extPreviewList);
      for (const ext of extPreviewList) {
        if (samples[ext].length) summary.push(...samples[ext]);
      }

      return summary;
    } catch (e) {
      return [`[ERROR] No se pudo leer el archivo ZIP ${fileName}`, e.message];
    }
  }

  if (stats.isDirectory()) {
    const manifestPath = path.join(filePath, 'manifest.json');
    const allItems = await fs.readdir(filePath);
    summary.push(`Directorio: ${fileName}`);
    summary.push(`Tipo: Carpeta descomprimida de .mcaddon o .mcpack`);

    let manifestData = null;
    if (await fs.exists(manifestPath)) {
      try {
        manifestData = await fs.readJson(manifestPath);
        summary.push(`Nombre del addon: ${manifestData.header?.name || 'desconocido'}`);
        summary.push(`UUID: ${manifestData.header?.uuid || 'N/A'}`);
        summary.push(`Versión: ${manifestData.header?.version?.join('.') || 'N/A'}`);
        summary.push(`Tipo de módulos: ${manifestData.modules?.map(m => m.type).join(', ') || 'N/A'}`);
      } catch {
        summary.push('⚠️ No se pudo leer manifest.json');
      }
    } else {
      summary.push('⚠️ No se encontró manifest.json');
    }

    if (allItems.includes('behavior_packs')) summary.push(`Contiene: Behavior Pack`);
    if (allItems.includes('resource_packs')) summary.push(`Contiene: Resource Pack`);
    if (allItems.includes('shaders')) summary.push(`Contiene: Shader Pack`);

    async function buildDirTree(dir) {
      const tree = {};
      const items = await fs.readdir(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const stat = await fs.stat(full);
        if (stat.isDirectory()) {
          tree[item] = await buildDirTree(full);
        } else {
          tree[item] = 'file';
        }
      }
      return tree;
    }

    const structure = await buildDirTree(filePath);
    summary.push(`Elementos totales: ${Object.keys(structure).length}`);
    summary.push(`Estructura de contenido:\n${formatTree(structure)}`);

    const samples = await extractDiskSamples(filePath, extPreviewList);
    for (const ext of extPreviewList) {
      if (samples[ext].length) summary.push(...samples[ext]);
    }

    return summary;
  }

  return [`[ERROR] No se reconoce el tipo del archivo ${fileName}`];
}

async function extractDiskSamples(folderPath, extList) {
  const samples = {};
  for (const ext of extList) samples[ext] = [];

  async function walk(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        await walk(full);
      } else {
        const fileExt = path.extname(file).toLowerCase();
        if (samples[fileExt] && samples[fileExt].length < 3) {
          try {
            const content = await fs.readFile(full, 'utf-8');
            samples[fileExt].push(`${fileExt}: ${content.slice(0, 300).trim()}`);
          } catch { }
        }
      }
    }
  }

  await walk(folderPath);
  return samples;
}

function buildStructureTree(entries) {
  const tree = {};
  for (const entry of entries) {
    const parts = entry.entryName.split('/');
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      if (!current[part]) {
        current[part] = (i === parts.length - 1 && !entry.isDirectory) ? 'file' : {};
      }
      current = current[part];
    }
  }
  return tree;
}

function formatTree(tree, indent = '') {
  return Object.entries(tree).map(([key, value]) => {
    if (value === 'file') return `${indent}- ${key}`;
    return `${indent}- ${key}/\n${formatTree(value, indent + '  ')}`;
  }).join('\n');
}

function extractFileSamples(entries, extList) {
  const samples = {};
  for (const ext of extList) samples[ext] = [];
  for (const entry of entries) {
    const ext = path.extname(entry.entryName).toLowerCase();
    if (samples[ext] && samples[ext].length < 3 && !entry.isDirectory) {
      try {
        const content = entry.getData().toString('utf-8').slice(0, 300).trim();
        samples[ext].push(`${ext}: ${content}`);
      } catch { }
    }
  }
  return samples;
}

module.exports = formatMCAddonOrPack;