/** Strip HTML tags for plaintext checks (server-safe). */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/** Plain text from HTML (e.g. min-length validation on rich text). */
export function getTextFromHtml(html: string): string {
  return stripHtml(html);
}
