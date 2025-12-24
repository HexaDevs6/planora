/**
 * RichTextRenderer - Renders saved rich text HTML content
 * No sanitization applied (trusted content from event hosts)
 * 
 * @param {string} html - HTML content to render
 * @param {string} className - Additional CSS classes
 */
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * RichTextRenderer - Renders saved rich text HTML content
 * No sanitization applied (trusted content from event hosts)
 * 
 * @param {string} html - HTML content to render
 * @param {string} className - Additional CSS classes
 * @param {number} maxHeight - Max height in pixels before truncating (0 to disable)
 * @param {string} readMoreText - Text for read more button
 * @param {string} readLessText - Text for read less button
 */
export default function RichTextRenderer({
  html,
  className = "",
  maxHeight = 0,
  readMoreText = "Read more",
  readLessText = "Show less"
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (maxHeight > 0 && contentRef.current) {
      setShouldShowButton(contentRef.current.scrollHeight > maxHeight);
    } else {
      setShouldShowButton(false);
    }
  }, [html, maxHeight]);

  if (!html || html === "<p><br></p>" || html.trim() === "") {
    return null;
  }

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`rich-text-container flex flex-col items-start ${className}`}>
      <div
        ref={contentRef}
        className="rich-text-content w-full transition-all duration-300 ease-in-out relative"
        style={{
          maxHeight: (maxHeight > 0 && !isExpanded) ? `${maxHeight}px` : 'none',
          overflow: 'hidden'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: html.replace(/&nbsp;/g, ' ') }} />

        {/* Gradient overlay when collapsed */}
        {shouldShowButton && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      {shouldShowButton && (
        <button
          onClick={toggleExpand}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          {isExpanded ? (
            <>
              {readLessText} <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {readMoreText} <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

