const fs = require('fs');
const path = require('path');

const wasmPath = path.resolve(__dirname, 'basis_transcoder.wasm');
const BasisModuleFactory = require('./basis_transcoder.js');

let basisModulePromise = null;

function loadBasisModule() {
  if (!basisModulePromise) {
    basisModulePromise = BasisModuleFactory({
      locateFile: (file) => {
        if (file.endsWith('.wasm')) {
          return wasmPath;
        }
        return file;
      },
    });
  }
  return basisModulePromise;
}

async function readBasisInfo(buffer) {
  const basisModule = await loadBasisModule();

  const data = new Uint8Array(buffer);
  const dataPtr = basisModule._malloc(data.length);
  basisModule.HEAPU8.set(data, dataPtr);

  const reader = new basisModule.BasisFile(dataPtr, data.length);
  if (!reader.isValid()) {
    basisModule._free(dataPtr);
    throw new Error('Archivo Basis no válido.');
  }

  const width = reader.getWidth(0, 0);
  const height = reader.getHeight(0, 0);
  const hasAlpha = reader.getHasAlpha();

  reader.delete();
  basisModule._free(dataPtr);

  return { width, height, hasAlpha };
}

module.exports = { readBasisInfo };