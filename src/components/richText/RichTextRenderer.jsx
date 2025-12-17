/**
 * RichTextRenderer - Renders saved rich text HTML content
 * No sanitization applied (trusted content from event hosts)
 * 
 * @param {string} html - HTML content to render
 * @param {string} className - Additional CSS classes
 */
export default function RichTextRenderer({ html, className = "" }) {
  if (!html || html === "<p><br></p>" || html.trim() === "") {
    return null;
  }

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

