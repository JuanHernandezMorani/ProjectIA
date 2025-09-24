const mm = require('music-metadata');

async function formatAudio(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    const { format, common } = metadata;

    let type = 'unknown';
    const duration = format.duration || 0;

    if (common.genre && common.genre.length > 0) {
      type = `Genre: ${common.genre.join(', ')}`;
    } else if (duration > 60) {
      type = 'Likely background music or ambient';
    } else if (duration < 2) {
      type = 'Likely sound effect (e.g., click, hit, pop)';
    } else if (isLikelyVoice(format)) {
      type = 'Possibly human voice or speech recording';
    }

    return [
      `Audio info:\n` +
      `  - Duration: ${duration.toFixed(2)}s\n` +
      `  - Sample rate: ${format.sampleRate} Hz\n` +
      `  - Channels: ${format.numberOfChannels}\n` +
      `  - Codec: ${format.codec}\n` +
      `  - Type: ${type}`
    ];
  } catch (err) {
    return [`Error reading audio metadata: ${err.message}`];
  }
}

function isLikelyVoice(format) {
  const sr = format.sampleRate || 0;
  const ch = format.numberOfChannels || 0;
  const duration = format.duration || 0;
  return (sr >= 8000 && sr <= 22050) && ch <= 2 && duration >= 0.5 && duration <= 20;
}

module.exports = formatAudio;