const fs = require('fs-extra');
const { QdrantClient } = require('@qdrant/js-client-rest');
const axios = require('axios');

const client = new QdrantClient({ url: 'http://localhost:6333' });
const COLLECTION = 'minecraft-mod';

async function main() {
  await client.deleteCollection(COLLECTION).catch(() => { });

  await client.createCollection(COLLECTION, {
    vectors: { size: 384, distance: 'Cosine' },
  });

  await client.updateCollection(COLLECTION, {
    optimizer_config: {
      indexing_threshold: 1
    }
  });

  const files = await fs.readdir('./embeddings');
  let counter = 1;

  for (const file of files) {
    const data = await fs.readJson('./embeddings/' + file);

    if (!Array.isArray(data.vector)) {
      throw new Error(`El archivo ${file} no contiene un vector válido.`);
    }

    await client.upsert(COLLECTION, {
      points: [{
        id: counter++,
        vector: data.vector,
        payload: {
          text: data.text,
          filename: file.replace('.json', '')
        }
      }]
    });

    console.log(`indexeado completo al ${Math.min(((counter * 100) / files.length).toFixed(2),100)}%`);
  }

  console.log('Proceso de indexación completado');
}

main().catch((error) => {
  console.error('Error en el indexador:', error);
});