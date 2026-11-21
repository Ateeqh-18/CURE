import sharp from 'sharp';
import * as mupdf from 'mupdf';
import { DocumentPageImage } from './provider-interface';

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB safety guard
export const MAX_PDF_PAGES = 12; // Prevents excessive memory use on 16 GB RAM machines
const MAX_VISION_IMAGE_DIM = 2048; // Balanced for Gemini Vision & local Qwen2.5-VL 3B

export interface ValidatedUpload {
  valid: boolean;
  kind: 'image' | 'pdf' | 'unsupported';
  mimeType: string;
  error?: string;
}

export interface PreparedDocument {
  kind: 'image' | 'pdf';
  mimeType: string;
  originalBuffer: Buffer;
  pageImages: DocumentPageImage[];
  totalPages: number;
  warnings: string[];
  pageErrors: { pageNumber: number; error: string }[];
}

export function validateDocumentBuffer(
  buffer: Buffer,
  declaredMime?: string,
  fileName?: string
): ValidatedUpload {
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      kind: 'unsupported',
      mimeType: '',
      error: 'Uploaded file is empty (0 bytes).',
    };
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      kind: 'unsupported',
      mimeType: '',
      error: `File exceeds the maximum allowed size of 20 MB (${(buffer.length / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  // Magic-byte verification
  if (buffer.subarray(0, 5).toString('ascii') === '%PDF-') {
    return { valid: true, kind: 'pdf', mimeType: 'application/pdf' };
  }
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, kind: 'image', mimeType: 'image/png' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, kind: 'image', mimeType: 'image/jpeg' };
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { valid: true, kind: 'image', mimeType: 'image/webp' };
  }

  const lower = (fileName || '').toLowerCase();
  if (declaredMime === 'application/pdf' || lower.endsWith('.pdf')) {
    return {
      valid: false,
      kind: 'unsupported',
      mimeType: 'application/pdf',
      error: 'Invalid or corrupted PDF document (missing %PDF header).',
    };
  }

  return {
    valid: false,
    kind: 'unsupported',
    mimeType: declaredMime || 'application/octet-stream',
    error: `Unsupported file type (${declaredMime || fileName || 'unknown'}). Upload PNG, JPG, JPEG, WEBP, or PDF.`,
  };
}

/**
 * Prepares a single image for Vision AI without destroying visual layout or handwriting details.
 * Preserves the original buffer separately; only applies EXIF auto-orientation and a safe max-dimension cap.
 */
async function normalizeImageForVision(
  originalBuffer: Buffer,
  mimeType: string
): Promise<DocumentPageImage> {
  try {
    const img = sharp(originalBuffer).rotate(); // Respect EXIF camera orientation
    const meta = await img.metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;

    let pipeline = img;
    if (w > MAX_VISION_IMAGE_DIM || h > MAX_VISION_IMAGE_DIM) {
      pipeline = pipeline.resize({
        width: MAX_VISION_IMAGE_DIM,
        height: MAX_VISION_IMAGE_DIM,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const outMime = mimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    const { data, info } =
      outMime === 'image/jpeg'
        ? await pipeline.jpeg({ quality: 92 }).toBuffer({ resolveWithObject: true })
        : await pipeline.png({ compressionLevel: 6 }).toBuffer({ resolveWithObject: true });

    return {
      pageNumber: 1,
      buffer: data,
      mimeType: outMime,
      width: info.width,
      height: info.height,
    };
  } catch (err: any) {
    // Fallback to original bytes if sharp metadata/transform fails
    const safeMime =
      mimeType === 'image/jpeg' || mimeType === 'image/webp' ? mimeType : 'image/png';
    return {
      pageNumber: 1,
      buffer: originalBuffer,
      mimeType: safeMime,
      renderWarning: `Image normalization skipped: ${err?.message || 'unknown error'}`,
    };
  }
}

/**
 * Renders every page of a PDF (up to MAX_PDF_PAGES) into clean PNG images using mupdf.
 * Does NOT use Tesseract — produces direct visual page images for Gemini Vision or Local Qwen2.5-VL.
 */
export async function renderPdfPagesToImages(pdfBuffer: Buffer): Promise<{
  pageImages: DocumentPageImage[];
  totalPages: number;
  warnings: string[];
  pageErrors: { pageNumber: number; error: string }[];
}> {
  let doc: any;
  let totalPages = 0;
  try {
    doc = mupdf.Document.openDocument(pdfBuffer, 'application/pdf');
    totalPages = doc.countPages();
  } catch (err: any) {
    throw new Error(`Corrupted or unreadable PDF document: ${err?.message || 'Failed to open PDF'}`);
  }

  if (totalPages <= 0) {
    throw new Error('PDF document contains 0 pages.');
  }

  const warnings: string[] = [];
  const pageErrors: { pageNumber: number; error: string }[] = [];
  const pageImages: DocumentPageImage[] = [];

  const pagesToProcess = Math.min(totalPages, MAX_PDF_PAGES);
  if (totalPages > MAX_PDF_PAGES) {
    warnings.push(
      `PDF has ${totalPages} pages; processing the first ${MAX_PDF_PAGES} pages to prevent excessive memory use.`
    );
  }

  for (let i = 0; i < pagesToProcess; i++) {
    const pageNumber = i + 1;
    try {
      const page = doc.loadPage(i);
      // 2.0x scale (~144 DPI) preserves handwriting crispness while keeping memory/payload reasonable
      const pixmap = page.toPixmap(mupdf.Matrix.scale(2.0, 2.0), mupdf.ColorSpace.DeviceRGB, false, true);
      const rawPng = Buffer.from(pixmap.asPNG());
      const norm = await normalizeImageForVision(rawPng, 'image/png');
      pageImages.push({
        ...norm,
        pageNumber,
      });
    } catch (err: any) {
      const message = err?.message || 'Failed to render PDF page to image';
      pageErrors.push({ pageNumber, error: message });
      warnings.push(`Page ${pageNumber} failed to render: ${message}`);
    }
  }

  if (pageImages.length === 0) {
    throw new Error(
      `None of the ${pagesToProcess} PDF pages could be rendered (${pageErrors[0]?.error || 'unknown error'}).`
    );
  }

  return { pageImages, totalPages: pagesToProcess, warnings, pageErrors };
}

/**
 * Validates and prepares an uploaded image or PDF document for Vision AI providers.
 */
export async function prepareUploadedDocument(
  buffer: Buffer,
  declaredMime?: string,
  fileName?: string,
  options: { renderPdfPages?: boolean } = {}
): Promise<PreparedDocument> {
  const check = validateDocumentBuffer(buffer, declaredMime, fileName);
  if (!check.valid || check.kind === 'unsupported') {
    throw new Error(check.error || 'Unsupported file upload.');
  }

  if (check.kind === 'image') {
    const pageImg = await normalizeImageForVision(buffer, check.mimeType);
    const warnings = pageImg.renderWarning ? [pageImg.renderWarning] : [];
    return {
      kind: 'image',
      mimeType: check.mimeType,
      originalBuffer: buffer,
      pageImages: [pageImg],
      totalPages: 1,
      warnings,
      pageErrors: [],
    };
  }

  // PDF: verify readability + page count, and render page images when requested (always needed for Ollama, and fallback for Gemini)
  if (options.renderPdfPages !== false) {
    const rendered = await renderPdfPagesToImages(buffer);
    return {
      kind: 'pdf',
      mimeType: 'application/pdf',
      originalBuffer: buffer,
      pageImages: rendered.pageImages,
      totalPages: rendered.totalPages,
      warnings: rendered.warnings,
      pageErrors: rendered.pageErrors,
    };
  }

  // Quick page count validation without rasterization
  let totalPages = 1;
  try {
    const doc = mupdf.Document.openDocument(buffer, 'application/pdf');
    totalPages = doc.countPages();
    if (totalPages <= 0) throw new Error('PDF contains 0 pages.');
  } catch (err: any) {
    throw new Error(`Corrupted or unreadable PDF document: ${err?.message || 'Parse error'}`);
  }

  return {
    kind: 'pdf',
    mimeType: 'application/pdf',
    originalBuffer: buffer,
    pageImages: [],
    totalPages: Math.min(totalPages, MAX_PDF_PAGES),
    warnings:
      totalPages > MAX_PDF_PAGES
        ? [`PDF has ${totalPages} pages; safe processing limit is ${MAX_PDF_PAGES} pages.`]
        : [],
    pageErrors: [],
  };
}
