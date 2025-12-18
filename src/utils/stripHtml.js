/**
 * Strips HTML tags and returns plain text
 * Used for validation of rich text content
 * 
 * @param {string} html - HTML string to strip
 * @returns {string} - Plain text without HTML tags
 */
export function stripHtml(html) {
  if (!html) return "";
  
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");
  
  // Decode common HTML entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  
  // Trim whitespace and return
  return textarea.value.trim();
}

