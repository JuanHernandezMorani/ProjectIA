const fs = require('fs-extra');
const path = require('path');
const nbt = require('prismarine-nbt');
const zlib = require('zlib');

async function formatNBT(filePath) {
    const compressed = await fs.readFile(filePath);
    const buffer = await new Promise((resolve, reject) => {
      zlib.gunzip(compressed, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  
    const { parsed } = await nbt.parse(buffer);
    return [
      `File: ${path.basename(filePath)}`,
      `Format: NBT (Named Binary Tag)`,
      `Top-level tag: ${parsed.value ? Object.keys(parsed.value).join(', ') : 'None'}`
    ];
  }

  module.exports = formatNBT;