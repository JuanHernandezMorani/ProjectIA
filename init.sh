#!/bin/bash

echo "🧠 Verificando si Qdrant está corriendo..."
if curl -s http://localhost:6333/collections >/dev/null; then
  echo "✅ Qdrant ya está activo."
else
  echo "🚀 Iniciando Qdrant en Docker..."
  docker run -d --name qdrant \
    -p 6333:6333 \
    -v $(pwd)/qdrant:/qdrant/storage \
    qdrant/qdrant

  echo "⏳ Esperando que Qdrant esté disponible..."
  until curl -s http://localhost:6333/collections >/dev/null; do
    sleep 1
  done
  echo "✅ Qdrant está listo."
fi

echo "🔁 Ejecutando procesamiento de datos completo..."
npm run learn

echo -e "\nProceso completado. Presiona ENTER para salir."
read -r