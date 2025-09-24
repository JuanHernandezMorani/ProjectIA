const formatAudio = require('./forms/audioFormater.js');
const formatBasis = require('./forms/basisFormater.js');
const formatBat = require('./forms/batFormater.js');
const formatBBModel = require('./forms/bbmodelFormater.js');
const formatBlend = require('./forms/blendFormater.js');
const formatBMP = require('./forms/bmpFormater.js');
const formatCFG = require('./forms/cfgFormater.js');
const formatCode = require('./forms/commonDevsFormater.js');
const formatCSV = require('./forms/csvFormater.js');
const formatDDS = require('./forms/ddsFormater.js');
const formatDOCX = require('./forms/docxFormater.js');
const formatEnv = require('./forms/envFormater.js');
const formatEXR = require('./forms/exrFormater.js');
const formatFBX = require('./forms/fbxFormater.js');
const formatFTL = require('./forms/ftlFormater.js');
const formatGLTF = require('./forms/gltfFormater.js');
const { formatImageGeneric, formatPNG, formatJPEG } = require('./forms/imgFormater.js');
const formatINI = require('./forms/iniFormater.js');
const formatJSON = require('./forms/jsonFormater.js');
const formatJSONC = require('./forms/jsoncFormater.js');
const formatKTX2 = require('./forms/ktx2Formater.js');
const formatLog = require('./forms/logFormater.js');
const formatLua = require('./forms/luaFormater.js');
const formatMCAddonOrPack = require('./forms/mcAddonOrPackFormatter.js');
const formatMCFunction = require('./forms/mcFunctionFormatter.js');
const formatMCMETA = require('./forms/mcMetaFormater.js');
const formatMarkdown = require('./forms/mdFormater.js');
const formatMTL = require('./forms/mtlFormater.js');
const formatNBT = require('./forms/nbtFormater.js');
const formatOBJ = require('./forms/objFormater.js');
const formatONNX = require('./forms/onixFormater.js');
const formatPDF = require('./forms/pdfFormater.js');
const formatPPTX = require('./forms/pptxFormater.js');
const formatPBText = require('./forms/protoTextFormater.js');
const formatPyTorch = require('./forms/pyTorchFormater.js');
const formatRTF = require('./forms/rtfFormater.js');
const formatSH = require('./forms/shFormater.js');
const formatSubtitles = require('./forms/subtitlesFormater.js');
const formatTGA = require('./forms/tgaFormater.js');
const formatTOML = require('./forms/tomlFormater.js');
const formatTXTHeuristic = require('./forms/txtFormater.js');
const formatVideo = require('./forms/videoFormater.js');
const formatXLSX = require('./forms/xlsxFormater.js');
const formatXML = require('./forms/xmlFormater.js');
const formatYAML = require('./forms/yalmFormater.js');

module.exports = {
    formatBlend,
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
    formatKTX2,
  };