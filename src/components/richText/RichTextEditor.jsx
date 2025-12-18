import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Label } from "@/components/ui/label";

/**
 * RichTextEditor - A reusable rich text editor component with Planora theming
 * 
 * @param {string} value - Current HTML content
 * @param {function} onChange - Callback when content changes (receives HTML string)
 * @param {string} dir - Text direction: "ltr" or "rtl"
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display
 * @param {string} label - Label for the editor
 * @param {string} id - Unique ID for the editor
 */
export default function RichTextEditor({
  value,
  onChange,
  dir = "ltr",
  placeholder = "",
  error = "",
  label = "",
  id = "rich-text-editor",
}) {
  const quillRef = useRef(null);

  // Custom toolbar with specified buttons
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ header: [1, 2, 3, false] }], // H1, H2, H3, Normal
          ["link"],
          [{ undo: "undo" }, { redo: "redo" }], // Custom undo/redo buttons
        ],
        handlers: {
          undo: () => {
            const quill = quillRef.current?.getEditor();
            if (quill) quill.history.undo();
          },
          redo: () => {
            const quill = quillRef.current?.getEditor();
            if (quill) quill.history.redo();
          },
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  const formats = [
    "bold",
    "italic",
    "underline",
    "header",
    "link",
  ];

  return (
    <div className="rich-text-wrapper">
      {label && (
        <Label htmlFor={id} className="block text-sm font-semibold mb-2">
          {label}
        </Label>
      )}
      <div
        className={`planora-quill ${dir === "rtl" ? "rtl-editor" : "ltr-editor"} ${
          error ? "error-state" : ""
        }`}
      >
        <ReactQuill
          ref={quillRef}
          value={value || ""}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          theme="snow"
          style={{
            direction: dir,
          }}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Custom icons for undo/redo buttons (add to Quill icons)
if (typeof window !== "undefined" && ReactQuill.Quill) {
  const icons = ReactQuill.Quill.import("ui/icons");
  icons.undo = `<svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
    <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
  </svg>`;
  icons.redo = `<svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
    <path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path>
  </svg>`;
}

