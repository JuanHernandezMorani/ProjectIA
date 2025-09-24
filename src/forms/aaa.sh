#!/bin/bash

# Obtener el directorio donde está este script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Crear o sobrescribir el archivo de salida
OUTPUT_FILE="$DIR/aallNames.txt"
> "$OUTPUT_FILE"

# Recorrer todos los archivos en el mismo directorio
for file in "$DIR"/*.js; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # Buscar la línea con 'export default async function' y extraer el nombre de la función
    function_name=$(grep -Po '^export default async function \K\w+' "$file")
    
    # Si se encontró un nombre de función, incluirlo entre paréntesis
    if [ -n "$function_name" ]; then
      echo "$filename ($function_name)" >> "$OUTPUT_FILE"
    else
      echo "$filename" >> "$OUTPUT_FILE"
    fi
  fi
done

echo "Archivo 'aallNames.txt' generado con los nombres de los archivos y funciones."