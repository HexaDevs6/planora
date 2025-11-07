import {
   Dropzone,
   DropzoneContent,
   DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";
import { Trash2, X } from "lucide-react";

const DragZone = ({ onChange, acceptMultiple = false, files = null }) => {
   const [file, setFile] = useState(files);
   const [filePreview, setFilePreview] = useState(acceptMultiple ? files : null);

   const handleDrop = (acceptedFiles) => {
      console.log(acceptedFiles);
      setFile(acceptedFiles);

      if (acceptedFiles && acceptedFiles.length > 0) {
         if (acceptMultiple) {
            // Handle multiple files
            const previews = [];
            let loadedCount = 0;

            acceptedFiles.forEach((file, index) => {
               const reader = new FileReader();
               reader.onload = (e) => {
                  previews[index] = e.target?.result;
                  loadedCount++;

                  // Update state only when all files are loaded
                  if (loadedCount === acceptedFiles.length) {
                     setFilePreview(previews);
                  }
               };
               reader.readAsDataURL(file);
            });

            onChange?.(acceptedFiles);
         } else {
            // Handle single file
            const reader = new FileReader();
            reader.onload = (e) => {
               setFilePreview(e.target?.result);
            };
            reader.readAsDataURL(acceptedFiles[0]);
            onChange?.(acceptedFiles[0]);
         }
      }
   };

   const handleRemove = (indexToRemove) => {
      if (acceptMultiple) {
         // Remove from multiple files
         const updatedFiles = Array.isArray(file)
            ? file.filter((_, index) => index !== indexToRemove)
            : [];
         const updatedPreviews = filePreview.filter(
            (_, index) => index !== indexToRemove
         );

         setFile(updatedFiles);
         setFilePreview(updatedPreviews);
         onChange?.(updatedFiles);
      } else {
         // Remove single file
         setFile(null);
         setFilePreview(null);
         onChange?.(null);
      }
   };
   return (
      <Dropzone
         accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
         maxFiles={acceptMultiple ? 5 : 1}
         onDrop={handleDrop}
         onError={console.error}
         src={file}
      >
         <DropzoneEmptyState />
         <DropzoneContent>
            {!acceptMultiple && filePreview && (
               <div className="h-[150px] w-full relative group">
                  <img
                     alt="Preview"
                     className="absolute top-0 left-0 h-full w-full object-cover rounded-md"
                     src={filePreview}
                  />
                  <span
                     onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(0);
                     }}
                     className="absolute top-1 right-1 bg-red-500/20 text-red-700 rounded-md p-1 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                     title="Remove image"
                  >
                     <Trash2 className="h-4 w-4" />
                  </span>
               </div>
            )}
            {acceptMultiple &&
               filePreview &&
               Array.isArray(filePreview) &&
               filePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full p-2">
                     {filePreview.map((preview, index) => (
                        <div
                           key={index}
                           className="h-[120px] w-full relative group"
                        >
                           <img
                              alt={`Preview ${index + 1}`}
                              className="absolute top-0 left-0 h-full w-full object-cover rounded-md"
                              src={preview}
                           />
                           <span
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleRemove(index);
                              }}
                              className="absolute top-1 right-1 bg-red-500/20 text-red-700 rounded-md p-1 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Remove image"
                           >
                              <Trash2 className="h-3 w-3" />
                           </span>
                        </div>
                     ))}
                  </div>
               )}
         </DropzoneContent>
      </Dropzone>
   );
};
export default DragZone;
