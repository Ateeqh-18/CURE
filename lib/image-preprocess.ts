import sharp from 'sharp';

export interface PreprocessOptions {
  rotationAngle?: 0 | 90 | 180 | 270;
  applyThreshold?: boolean;
  denoise?: boolean;
  targetMinWidth?: number;
  maxWidth?: number;
}

export interface PreprocessedImageResult {
  buffer: Buffer;
  width: number;
  height: number;
  operationsApplied: string[];
}

/**
 * Preprocesses a prescription image buffer for improved OCR accuracy.
 * Never mutates the original buffer — creates a fresh processed PNG buffer.
 */
export async function preprocessImageForOcr(
  originalBuffer: Buffer,
  options: PreprocessOptions = {}
): Promise<PreprocessedImageResult> {
  const operations: string[] = [];
  const targetMinWidth = options.targetMinWidth ?? 1600;
  const maxWidth = options.maxWidth ?? 2800;

  // Step 1: Read metadata from original buffer
  const meta = await sharp(originalBuffer).metadata();

  // Step 2: EXIF orientation correction first
  let pipeline = sharp(originalBuffer).rotate();
  operations.push('exif_auto_orient');

  // Optional explicit rotation (e.g. 90 / 180 / 270 degrees for rotated phone photos)
  if (options.rotationAngle) {
    pipeline = pipeline.rotate(options.rotationAngle);
    operations.push(`rotate_${options.rotationAngle}deg`);
  }

  // Step 3: Resize to optimal OCR DPI/width
  const effectiveWidth =
    options.rotationAngle === 90 || options.rotationAngle === 270
      ? meta.height || 1000
      : meta.width || 1000;

  if (effectiveWidth < targetMinWidth) {
    pipeline = pipeline.resize({
      width: targetMinWidth,
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    });
    operations.push(`upscale_to_${targetMinWidth}px`);
  } else if (effectiveWidth > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    });
    operations.push(`downscale_to_${maxWidth}px`);
  }

  // Step 4: Grayscale + contrast normalization
  pipeline = pipeline.grayscale().normalize();
  operations.push('grayscale', 'contrast_normalize');

  // Step 5: Noise reduction (light median filter) when requested
  if (options.denoise) {
    pipeline = pipeline.median(3);
    operations.push('median_denoise');
  }

  // Step 6: Unsharp masking to crisp up slightly blurred printed/handwritten strokes
  pipeline = pipeline.sharpen({ sigma: 1.4, m1: 1.0, m2: 2.0 });
  operations.push('sharpen');

  // Step 7: Optional binarization threshold for low-contrast / blurred documents
  if (options.applyThreshold) {
    pipeline = pipeline.threshold(165);
    operations.push('threshold_binarize');
  }

  // Flatten alpha onto crisp white background (crucial for transparent PNGs or rendered PDFs)
  pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  operations.push('white_background_flatten');

  const { data, info } = await pipeline.png({ compressionLevel: 6 }).toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    width: info.width,
    height: info.height,
    operationsApplied: operations,
  };
}
