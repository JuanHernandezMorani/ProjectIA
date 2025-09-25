import base64
import pandas as pd
from PIL import Image, ImageFile, UnidentifiedImageError
import numpy as np
from pathlib import Path
import logging
import json
from typing import List, Tuple, Dict, Optional
import io

# Configuración inicial
ImageFile.LOAD_TRUNCATED_IMAGES = True
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _compute_has_alpha(mode: str, image: Image.Image) -> bool:
    if mode in {"RGBA", "LA"}:
        return True
    if mode == "P":
        return image.info.get("transparency") is not None
    return False


def format_image_to_record(image_path: str, context_text: str) -> Optional[Dict]:
    try:
        path_obj = Path(image_path)
        if not path_obj.exists():
            raise FileNotFoundError(f"Archivo no encontrado: {image_path}")

        with Image.open(path_obj) as img:
            img.load()
            width, height = img.size
            mode = img.mode
            has_alpha = _compute_has_alpha(mode, img)

            if mode not in {"RGB", "RGBA"}:
                conversion_mode = "RGBA" if has_alpha else "RGB"
                working_img = img.convert(conversion_mode)
            else:
                working_img = img

            unique_colors = len(set(working_img.getdata()))

            luminance_img = working_img.convert("L")
            luminance_array = np.array(luminance_img, dtype=np.float32)
            brightness_mean = float(np.mean(luminance_array))
            brightness_std = float(np.std(luminance_array))

        with open(path_obj, "rb") as file_stream:
            buffer = io.BytesIO(file_stream.read())
        base64_bytes = base64.b64encode(buffer.getvalue())
        base64_str = base64_bytes.decode("utf-8")

        record = {
            "file_name": path_obj.name,
            "file_path": str(path_obj.absolute()),
            "context_text": context_text,
            "base64_image": base64_str,
            "width": int(width),
            "height": int(height),
            "has_alpha": bool(has_alpha),
            "unique_colors": int(unique_colors),
            "brightness_mean": brightness_mean,
            "brightness_std": brightness_std,
        }

        metadata_log = {
            "file_name": record["file_name"],
            "width": record["width"],
            "height": record["height"],
            "has_alpha": record["has_alpha"],
            "unique_colors": record["unique_colors"],
            "brightness_mean": record["brightness_mean"],
            "brightness_std": record["brightness_std"],
        }
        logger.debug("Metadatos extraídos: %s", json.dumps(metadata_log, ensure_ascii=False))

        return record
    except FileNotFoundError as fnf_error:
        logger.error(str(fnf_error))
    except UnidentifiedImageError:
        logger.error("Formato inválido: %s", image_path)
    except Exception as exc:
        logger.error("Error procesando %s: %s", image_path, str(exc))
    return None


def process_images_to_dataset(
    images: List[Tuple[str, str]],
    output_path: str,
    format_type: str = "parquet",
) -> bool:
    try:
        if not images:
            logger.error("La lista de imágenes no puede estar vacía.")
            return False

        allowed_formats = {"parquet": ".parquet", "jsonl": ".jsonl"}
        normalized_format = format_type.lower()
        if normalized_format not in allowed_formats:
            logger.error("Formato de salida no soportado: %s", format_type)
            return False

        output_suffix = allowed_formats[normalized_format]
        if Path(output_path).suffix.lower() != output_suffix:
            logger.error(
                "La extensión del archivo de salida debe ser %s para el formato %s.",
                output_suffix,
                normalized_format,
            )
            return False

        records: List[Dict] = []
        for image_path, context_text in images:
            record = format_image_to_record(image_path, context_text)
            if record is not None:
                records.append(record)

        total_images = len(images)
        valid_images = len(records)
        logger.info("Imágenes válidas procesadas: %d/%d", valid_images, total_images)

        if not records:
            raise ValueError("No se procesaron imágenes válidas")

        df = pd.DataFrame(records)
        expected_columns = [
            "file_name",
            "file_path",
            "context_text",
            "base64_image",
            "width",
            "height",
            "has_alpha",
            "unique_colors",
            "brightness_mean",
            "brightness_std",
        ]
        df = df[expected_columns]

        output_file_path = Path(output_path)
        output_file_path.parent.mkdir(parents=True, exist_ok=True)

        if normalized_format == "parquet":
            df.to_parquet(output_file_path, index=False)
        else:
            df.to_json(output_file_path, orient="records", lines=True, force_ascii=False)

        logger.info(
            "Dataset exportado en %s con %d registros.",
            normalized_format,
            valid_images,
        )
        return True
    except ValueError as value_error:
        logger.error(str(value_error))
    except Exception as exc:
        logger.error("Error general al procesar imágenes: %s", str(exc))
    return False
