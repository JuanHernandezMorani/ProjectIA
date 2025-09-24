const readline = require('readline-sync');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { pipeline } = require('@xenova/transformers');
const { createCanvas } = require('canvas');

const COLLECTION = 'minecraft-mod';
const client = new QdrantClient({ url: 'http://localhost:6333' });
const OUTPUT_DIR = './output';

function runPhi(prompt) {
  const command = `./llm/llama.cpp/main -m ./llm/llama.cpp/models/phi-2.gguf -p "${prompt}" -n 1024`;
  return execSync(command, { encoding: 'utf-8' });
}

async function retrieveContext(question, embedder) {
  const emb = await embedder(question, { pooling: 'mean', normalize: true });
  const res = await client.search(COLLECTION, {
    vector: emb.data[0],
    limit: 8
  });

  return res.map(r => r.payload.text).join('\n---\n');
}

async function saveToQdrant(text, embedder) {
  const emb = await embedder(text, { pooling: 'mean', normalize: true });
  await client.upsert(COLLECTION, [{
    id: Date.now(),
    vector: emb.data[0],
    payload: { text: text }
  }]);
}

function saveFile(type, name, content) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const ext = type === 'java' ? '.java' :
              type === 'geo' ? '.geo.json' :
              type === 'anim' ? '.animation.json' :
              type === 'json' ? '.json' : '';

  const filePath = path.join(OUTPUT_DIR, `${name}${ext}`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Archivo generado: ${filePath}`);
}

function generateTextureFromDescription(description, name) {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');

  if (description.includes('violeta')) ctx.fillStyle = '#4B0082';
  else ctx.fillStyle = '#888888';
  ctx.fillRect(0, 0, 64, 64);

  if (description.includes('patrones')) {
    ctx.fillStyle = '#222222';
    for (let i = 0; i < 64; i += 8) {
      ctx.fillRect(i, i, 8, 8);
    }
  }

  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(OUTPUT_DIR, `${name}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`🖼️ Textura generada: ${filePath}`);
}

async function generateAssetsFromPrompt(question, embedder) {
  const context = await retrieveContext(question, embedder);
  const prompt = `Usa el siguiente CONTEXTO para generar los archivos necesarios para la petición:\n\n${context}\n\nPETICIÓN:\n${question}\n\nResponde en formato JSON con los siguientes campos:\n{\n "java": "...",\n "geo": "...",\n "anim": "...",\n "texture_description": "..." \n}`;
  
  const rawResponse = runPhi(prompt);

  try {
    const startIndex = rawResponse.indexOf('{');
    const endIndex = rawResponse.lastIndexOf('}');
    const jsonText = rawResponse.slice(startIndex, endIndex + 1);
    const parsed = JSON.parse(jsonText);

    saveFile('java', 'MobEntity', parsed.java);
    saveFile('geo', 'mob_model', parsed.geo);
    saveFile('anim', 'mob_animations', parsed.anim);
    generateTextureFromDescription(parsed.texture_description || '', 'mob_texture');
  } catch (err) {
    console.error('❌ Error al parsear la respuesta de Phi-2:', err.message);
    console.log('\nRespuesta cruda:', rawResponse);
  }
}

async function main() {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  while (true) {
    const input = readline.question('\n🧠 ¿Qué deseas crear? (escribe "exit" para salir): ');
    if (input.toLowerCase() === 'exit') break;

    await generateAssetsFromPrompt(input, embedder);

    const remember = readline.question('\n¿Deseas guardar esta conversación en memoria? (sí/no): ');
    if (remember.toLowerCase() === 'sí') {
      await saveToQdrant(input, embedder);
    }
  }
}

main();