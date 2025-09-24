const fs = require('fs-extra');
const path = require('path');
const { pipeline } = require('@xenova/transformers');

let embedder;

async function initEmbedder() {
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

async function embedText(text) {
  const result = await embedder(text, { pooling: 'mean', normalize: true });

  const vector = Array.from(result.data);
  
  if (!Array.isArray(vector)) {
    throw new Error("El vector generado no es un array de números flotantes.");
  }

  if (vector.length === 0) {
    throw new Error("El vector generado está vacío.");
  }

  return vector;
}

async function embedAll() {
  await initEmbedder();
  const files = await fs.readdir('./dist');
  await fs.ensureDir('./embeddings');
  const total = files.length;
  let count = 0;

  for (const file of files) {
    const content = await fs.readFile(`./dist/${file}`, 'utf-8');
    const vector = await embedText(content);
    const outPath = path.join('./embeddings', file.replace('.txt', '.json'));
    await fs.writeJson(outPath, { text: content, vector });
    console.log(`Embeddings completos al ${((count * 100)/total).toFixed(2)}%`);
    count++;
  }
}

embedAll();