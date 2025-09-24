const path = require('path');
const mm = require('music-metadata');

async function formatVideo(filePath) {
  const metadata = await mm.parseFile(filePath);
  const { format, common } = metadata;

  return [
    `File: ${path.basename(filePath)}`,
    `Format: ${format.container}`,
    `Duration: ${format.duration.toFixed(2)} seconds`,
    `Video Codec: ${format.codec}`,
    `Audio Codec: ${common.codec}`,
    `Resolution: ${format.width}x${format.height}`
  ];
}

module.exports = formatVideo;