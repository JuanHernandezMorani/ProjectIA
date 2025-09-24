#!/bin/bash

# Definir las rutas
SOURCE_DIR="/c/Users/Juan/Desktop/ProjectIA/data"
DEST_DIR="/c/Users/Juan/Desktop/ProjectIA/test"

# Lista de extensiones que buscas
EXTENSIONS=(
  ".blend" ".rtf" ".gltf" ".csv" ".xlsx" ".pptx" ".env" ".lua" ".log" ".fbx" ".pdf"
  ".docx" ".bat" ".sh" ".bbmodel" ".mcmeta" ".mcfunction" ".mcaddon" ".mcpack" ".obj" 
  ".mtl" ".txt" ".md" ".cfg" ".ini" ".onnx" ".pt" ".pbtxt" ".mp4" ".webm" ".mkv"
  ".avi" ".js" ".ts" ".jsx" ".tsx" ".py" ".java" ".css" ".html" ".php" ".cpp" ".c" 
  ".cs" ".sql" ".xml" ".toml" ".yaml" ".yml" ".json" ".nbt" ".jsonc" ".vtt" ".srt" 
  ".ass" ".ogg" ".flac" ".wav" ".mp3" ".basis" ".jpg" ".jpeg" ".jp2" ".j2k" ".heif" 
  ".heic" ".avif" ".tif" ".tiff" ".webp" ".png" ".ftl" ".tga" ".bmp" ".dds" ".exr" 
  ".ktx2"
)

# Crear la carpeta de destino si no existe
mkdir -p "$DEST_DIR"

# Inicializar lista de extensiones faltantes
MISSING_EXTENSIONS=()

# Función para copiar archivos y mostrar barra de progreso
copy_files() {
  local found_count=0
  local total_exts=${#EXTENSIONS[@]}
  
  for i in "${!EXTENSIONS[@]}"; do
    ext="${EXTENSIONS[$i]}"
    file=$(find "$SOURCE_DIR" -type f -iname "*$ext" | head -n 1)

    if [[ -n "$file" ]]; then
      cp "$file" "$DEST_DIR"
      found_count=$((found_count + 1))
    else
      MISSING_EXTENSIONS+=("$ext")
    fi

    percent=$(((i + 1) * 100 / total_exts))
    bar=$(printf "%0.s#" $(seq 1 $((percent / 2))))
    printf "\rCopiando archivos: [%-50s] %d%%" "$bar" "$percent"
  done
  echo -e "\nProceso completado.\n"
}

# Ejecutar la función
copy_files

# Si hay extensiones faltantes, mostrarlas
if [[ ${#MISSING_EXTENSIONS[@]} -gt 0 ]]; then
  echo "⚠️  No se encontraron archivos para las siguientes extensiones:"
  for ext in "${MISSING_EXTENSIONS[@]}"; do
    echo " - $ext"
  done
else
  echo "✅ Se encontraron archivos para todas las extensiones."
fi

# Pausa para que el usuario pueda leer
echo -e "\nPresiona Enter para salir..."
read -r