const fs = require('fs-extra');
const path = require('path');

const INPUT = './data';
const OUTPUT = './dist';

function isCodeFile(file) {
  return ['.json', '.java', '.js', '.txt', '.cs'].includes(path.extname(file));
}

function processText(filePath) {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  if (ext === '.json') {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  }

  return content;
}

async function convertAll() {
  const files = await fs.readdir(INPUT);
  for (const file of files) {
    const full = path.join(INPUT, file);
    if (!isCodeFile(file)) continue;

    const content = processText(full);
    const outPath = path.join(OUTPUT, file + '.txt');
    await fs.writeFile(outPath, content);
    console.log(`✅ Procesado: ${file}`);
  }
}

convertAll();