const { execSync } = require('child_process');

async function runPipeline() {
  process.on('unhandledRejection', (reason) => {
    console.error('🔴 Unhandled Rejection:', reason);
  });
  console.log('🔄 1. Procesando archivos...');
  execSync('node src/contextualizer.js', { stdio: 'inherit' });
  console.log('📊 Proceso completado');

  console.log('🔄 2. Generando embeddings...');
  execSync('node src/embed.js', { stdio: 'inherit' });
  console.log('📊 Proceso completado');

  console.log('🔄 3. Indexando en Qdrant...');
  execSync('node src/indexer.js', { stdio: 'inherit' });
  console.log('📊 Proceso completado');

  console.log('🔄 4. Creando fine_tune_data.jsonl...');
  execSync('node src/indexer.js', { stdio: 'inherit' });
  console.log('📊 Proceso completado');

  console.log('✅ Pipeline completo.');
}

runPipeline();