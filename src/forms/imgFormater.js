const fs = require('fs-extra');
const path = require('path');
const PNG = require('pngjs').PNG;
const sharp = require('sharp');
const { default: imageSize } = require('image-size');

function classifyPNG(name, width, height, hasAlpha, colorCount) {
  const lower = name.toLowerCase();
  if (/_n\./.test(lower)) return 'normal map';
  if (/_s\./.test(lower)) return 'specular map';
  if (width <= 16 && height <= 16) return 'block texture or crop stage';
  if (width === 64 && height === 64) return 'block texture';
  if (width === 1024 || height === 1024) return 'tool or item texture';
  if (width === 512 && height === 256) return 'mob texture (possibly split)';
  if (width === 90 && height === 90) return 'icon or HUD symbol';
  if (width === 256 && height === 256 && colorCount < 10) return 'aura or HUD overlay';
  return 'uncategorized texture';
}

export async function formatImageGeneric(filePath) {
  const metadata = await sharp(filePath).metadata();

  return [`File: ${path.basename(filePath)}\nFormat: ${metadata.format}\nDimensions: ${metadata.width}x${metadata.height}\nAlpha channel: ${metadata.hasAlpha ? 'yes' : 'no'}\nClassification: generic image`];
}

export async function formatPNG(filePath) {
  const buffer = await fs.readFile(filePath);
  const isPNG = buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
  if (!isPNG) {
    return [`[ERROR] ${path.basename(filePath)} is not a valid PNG file.`];
  }

  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(buffer, function (err, data) {
      if (err) {
        return reject(err);
      }

      const name = path.basename(filePath);
      const width = data.width;
      const height = data.height;
      const hasAlpha = data.alpha;
      const colors = new Set();

      for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
        colors.add(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
      }

      const classification = classifyPNG(name, width, height, hasAlpha, colors.size);
      const description = [
        `File: ${name}`,
        `Dimensions: ${width}x${height}`,
        `Alpha channel: ${hasAlpha ? 'yes' : 'no'}`,
        `Unique colors: ${colors.size}`,
        `Classification: ${classification}`
      ];

      resolve(description);
    });
  });
}

export async function formatJPEG(filePath) {
  const buffer = await fs.readFile(filePath);
  const dimensions = imageSize(buffer);
  return [
    `File: ${path.basename(filePath)}`,
    `Dimensions: ${dimensions.width}x${dimensions.height}`,
    `Format: JPEG`
  ];
}

module.exports = {
  formatImageGeneric,
  formatJPEG,
  formatPNG
};