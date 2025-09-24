const fs = require('fs-extra');
const path = require('path');
const { formatFile } = require('./formatter');
const cliProgress = require('cli-progress');
//'./data';
const INPUT = './test'; 
const OUTPUT = './dist';
const ERRORS = [];
const progressBar = new cliProgress.SingleBar({
  format: '📄 {file} | {bar} | {percentage}% | {value}/{total}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});
const TRACKER_PATH = path.resolve(__dirname, 'fine_tune_tracker.json');

function loadTracker() {
  if (!fs.existsSync(TRACKER_PATH)) return { usedFiles: [] };
  return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
}

function saveTracker(tracker) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2));
}

async function processFile(filePath, relativeName, index) {
  const chunks = await formatFile(filePath);
  try {
    await Promise.all(chunks.map((chunk, i) => {
      const chunkName = `${relativeName.replace(/[\\/]/g, '_')}-chunk${i}.txt`;
      const outFile = path.join(OUTPUT, chunkName);
      return fs.outputFile(outFile, chunk);
    }));
  }
  catch (e) {
    ERRORS.push({ "Index del archivo": index, "Dato de archivo": chunks, "Tipo de archivo": typeof chunks, "Error": e });
  }
}

async function walk(dir, base = '') {
  const entries = await fs.readdir(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relPath = path.join(base, entry);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      files.push(...await walk(fullPath, relPath));
    } else {
      files.push({ fullPath, relPath });
    }
  }
  return files;
}

async function contextualizeAll() {
  var counter = 0;
  try{
    await fs.ensureDir(OUTPUT);
    const filesWalk = await walk(INPUT);
    const tracker = loadTracker();
    const files = filesWalk.filter(f => !tracker.usedFiles.includes(f));
  
    if (files.length === 0) {
      console.log('No hay archivos nuevos que procesar.');
      return;
    }
    progressBar.start(files.length, 0, {
      file: 'Iniciando...'
    });
  
    for (const { fullPath, relPath } of files) {
      counter++;
      const name = path.parse(relPath).name.replace(/[\\/]/g, '_') + path.extname(fullPath).toLowerCase();;
      await processFile(fullPath, name, counter);
      progressBar.update(counter, { file: name.slice(0, 30) });
    }
  
    progressBar.stop();
    tracker.usedFiles.push(...files);
    saveTracker(tracker);
    if (ERRORS.length >= 1) console.error(ERRORS);
    console.log('✅ Contextualización completa.');
  }
  catch(error){
    console.error(error);
  }
}

contextualizeAll();