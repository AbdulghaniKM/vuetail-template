const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * Format bytes into a human-readable string.
 *
 * formatFileSize(0)          → "0 B"
 * formatFileSize(1024)       → "1.0 KB"
 * formatFileSize(1048576)    → "1.0 MB"
 * formatFileSize(5242880)    → "5.0 MB"
 * formatFileSize(1073741824) → "1.0 GB"
 */
export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '-' + formatFileSize(-bytes, decimals);

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, UNITS.length - 1);

  return `${(bytes / Math.pow(k, index)).toFixed(decimals)} ${UNITS[index]}`;
}

/**
 * Extract file extension from a filename or path.
 *
 * getFileExtension('report.pdf')          → "pdf"
 * getFileExtension('archive.tar.gz')      → "gz"
 * getFileExtension('.gitignore')           → ""
 * getFileExtension('no-extension')         → ""
 */
export function getFileExtension(filename: string): string {
  const base = filename.split('/').pop() ?? filename;
  const dot = base.lastIndexOf('.');
  if (dot <= 0) return '';
  return base.slice(dot + 1).toLowerCase();
}

const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif', 'tiff',
]);

const VIDEO_EXTENSIONS = new Set([
  'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv',
]);

const AUDIO_EXTENSIONS = new Set([
  'mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a',
]);

const DOCUMENT_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf', 'odt',
]);

/**
 * Check if a filename has an image extension.
 *
 * isImage('photo.jpg')    → true
 * isImage('data.json')    → false
 */
export function isImage(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(getFileExtension(filename));
}

/**
 * Check if a filename has a video extension.
 */
export function isVideo(filename: string): boolean {
  return VIDEO_EXTENSIONS.has(getFileExtension(filename));
}

/**
 * Check if a filename has an audio extension.
 */
export function isAudio(filename: string): boolean {
  return AUDIO_EXTENSIONS.has(getFileExtension(filename));
}

/**
 * Check if a filename has a document extension.
 */
export function isDocument(filename: string): boolean {
  return DOCUMENT_EXTENSIONS.has(getFileExtension(filename));
}

/**
 * Categorize a MIME type or filename into a broad category.
 *
 * getFileCategory('image/png')  → "image"
 * getFileCategory('video/mp4')  → "video"
 * getFileCategory('report.pdf') → "document"
 * getFileCategory('data.json')  → "other"
 */
export function getFileCategory(
  filenameOrMime: string,
): 'image' | 'video' | 'audio' | 'document' | 'other' {
  // MIME type
  if (filenameOrMime.includes('/')) {
    const type = filenameOrMime.split('/')[0];
    if (type === 'image') return 'image';
    if (type === 'video') return 'video';
    if (type === 'audio') return 'audio';
    if (filenameOrMime.includes('pdf') || type === 'text' || filenameOrMime.includes('document') || filenameOrMime.includes('spreadsheet') || filenameOrMime.includes('presentation')) return 'document';
    return 'other';
  }

  // Filename
  if (isImage(filenameOrMime)) return 'image';
  if (isVideo(filenameOrMime)) return 'video';
  if (isAudio(filenameOrMime)) return 'audio';
  if (isDocument(filenameOrMime)) return 'document';
  return 'other';
}
