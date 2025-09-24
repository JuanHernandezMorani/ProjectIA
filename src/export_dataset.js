const fs = require('fs');
const { QdrantClient } = require('@qdrant/js-client-rest');

const COLLECTION = 'minecraft-mod';
const client = new QdrantClient({ url: 'http://localhost:6333' });

(async () => {
  const response = await client.scroll(COLLECTION, {
    limit: 100000,
    with_payload: true
  });

  const points = response.points;

  const dataset = points.map(point => ({
    instruction: "Contexto de desarrollo Minecraft Mod",
    input: point.payload.text,
    output: point.payload.response || ""
  }));

  fs.writeFileSync('fine_tune_data.jsonl', dataset.map(d => JSON.stringify(d)).join('\n'));
})();