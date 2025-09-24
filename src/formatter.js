const path = require('path');
const { formatBlend,
  formatRTF,
  formatGLTF,
  formatCSV,
  formatXLSX,
  formatPPTX,
  formatEnv,
  formatLua,
  formatLog,
  formatFBX,
  formatPDF,
  formatDOCX,
  formatBat,
  formatSH,
  formatBBModel,
  formatMCMETA,
  formatMCFunction,
  formatMCAddonOrPack,
  formatOBJ,
  formatMTL,
  formatTXTHeuristic,
  formatMarkdown,
  formatCFG,
  formatINI,
  formatONNX,
  formatPyTorch,
  formatPBText,
  formatVideo,
  formatCode,
  formatXML,
  formatTOML,
  formatYAML,
  formatJSON,
  formatNBT,
  formatJSONC,
  formatSubtitles,
  formatAudio,
  formatBasis,
  formatJPEG,
  formatImageGeneric,
  formatPNG,
  formatFTL,
  formatTGA,
  formatBMP,
  formatDDS,
  formatEXR,
  formatKTX2 } = require('./indexForms');

async function formatFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    switch (ext) {
      case '.blend':
        return formatBlend(filePath);
      case '.rtf':
        return formatRTF(filePath);
      case '.gltf':
        return formatGLTF(filePath);
      case '.csv':
        return formatCSV(filePath);
      case '.xlsx':
        return formatXLSX(filePath);
      case '.pptx':
        return formatPPTX(filePath);
      case '.env':
        return formatEnv(filePath);
      case '.lua':
        return formatLua(filePath);
      case '.log':
        return formatLog(filePath);
      case '.fbx':
        return formatFBX(filePath);
      case '.pdf':
        return formatPDF(filePath);
      case '.docx':
        return formatDOCX(filePath);
      case '.bat':
        return await formatBat(filePath);
      case '.sh':
        return await formatSH(filePath);
      case '.bbmodel':
        return await formatBBModel(filePath);
      case '.mcmeta':
        return await formatMCMETA(filePath);
      case '.mcfunction':
        return await formatMCFunction(filePath);
      case '.mcaddon':
      case '.mcpack':
        return await formatMCAddonOrPack(filePath);
      case '.obj':
        return await formatOBJ(filePath);
      case '.mtl':
        return await formatMTL(filePath);
      case '.txt':
        return await formatTXTHeuristic(filePath);
      case '.md':
        return await formatMarkdown(filePath);
      case '.cfg':
        return await formatCFG(filePath);
      case '.ini':
        return await formatINI(filePath);
      case '.onnx':
        return await formatONNX(filePath);
      case '.pt':
        return await formatPyTorch(filePath);
      case '.pbtxt':
        return await formatPBText(filePath);
      case '.mp4':
      case '.webm':
      case '.mkv':
      case '.avi':
        return await formatVideo(filePath);
      case '.js':
      case '.ts':
      case '.jsx':
      case '.tsx':
      case '.py':
      case '.java':
      case '.css':
      case '.html':
      case '.php':
      case '.cpp':
      case '.c':
      case '.cs':
      case '.sql':
        return await formatCode(filePath);
      case '.xml':
        return await formatXML(filePath);
      case '.toml':
        return await formatTOML(filePath);
      case '.yaml':
      case '.yml':
        return await formatYAML(filePath);
      case '.json':
        return await formatJSON(filePath);
      case '.nbt':
        return await formatNBT(filePath);
      case '.jsonc':
        return await formatJSONC(filePath);
      case '.vtt':
      case '.srt':
      case '.ass':
        return await formatSubtitles(filePath);
      case '.ogg':
      case '.flac':
      case '.wav':
      case '.mp3':
        return await formatAudio(filePath);
      case '.basis':
        return await formatBasis(filePath);
      case '.jpg':
      case '.jpeg':
        return await formatJPEG(filePath);
      case '.jp2':
      case '.j2k':
      case ".heif":
      case ".heic":
      case ".avif":
      case ".tif":
      case ".tiff":
      case ".webp":
        return await formatImageGeneric(filePath);
      case '.png':
        return await formatPNG(filePath);
      case '.ftl':
        return await formatFTL(filePath);
      case '.tga':
        return await formatTGA(filePath);
      case '.bmp':
        return await formatBMP(filePath);
      case '.dds':
        return await formatDDS(filePath);
      case '.exr':
        return await formatEXR(filePath);
      case '.ktx2':
        return await formatKTX2(filePath);
      default:
        return [`Unsupported file extension: ${ext}`];
    }
  } catch (err) {
    console.error(`Error formatting ${filePath}:`, err);
    return [`Error formatting ${ext} type file.`];
  }

}

module.exports = { formatFile };