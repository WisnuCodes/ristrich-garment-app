/**
 * Security utilities for Frontend (XSS, URL validation, Input sanitization)
 */

/**
 * Sanitasi URL untuk mencegah XSS melalui javascript: pseudoprotocol
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();

  // Cegah javascript:, vbscript:, data: text/html
  if (/^(javascript|vbscript|data:text\/html):/i.test(trimmed)) {
    console.warn('Blocked potentially malicious URL protocol:', trimmed);
    return fallback;
  }

  // Izinkan safe relative paths atau http/https
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  return fallback;
}

/**
 * Membersihkan string teks biasa dari potensi tag berbahaya
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^>]*>(.*?)<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .trim();
}

