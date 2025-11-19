import {
   Dropzone,
   DropzoneContent,
   DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import i18next from "i18next";

const DragZone = ({ onChange, acceptMultiple = false, files = null, maxFiles = 5 }) => {
   const [file, setFile] = useState(files);
   const [filePreview, setFilePreview] = useState(acceptMultiple ? files : null);
   const lang = i18next.language;

   const handleDrop = (acceptedFiles) => {
      console.log(acceptedFiles);   

      if (acceptedFiles && acceptedFiles.length > 0) {
         if (acceptMultiple) {
            // Check current file count
            const currentFiles = Array.isArray(file) ? file : [];
            const currentPreviews = Array.isArray(filePreview) ? filePreview : [];
            
            // Calculate how many new files we can add
            const remainingSlots = maxFiles - currentFiles.length;
            
            // Prevent adding if max is reached
            if (remainingSlots <= 0) {
               toast.error(
                  lang === "ar"
                     ? `لا يمكنك إضافة أكثر من ${maxFiles} صور. يرجى حذف بعض الصور أولاً`
                     : `You cannot add more than ${maxFiles} images. Please delete some images first`
               );
               return;
            }

            // Only take as many files as we have room for
            const filesToAdd = acceptedFiles.slice(0, remainingSlots);
            
            if (filesToAdd.length < acceptedFiles.length) {
               toast.warning(
                  lang === "ar"
                     ? `تم إضافة ${filesToAdd.length} فقط من ${acceptedFiles.length} صور. الحد الأقصى هو ${maxFiles} صور`
                     : `Added only ${filesToAdd.length} of ${acceptedFiles.length} images. Maximum is ${maxFiles} images`
               );
            }

            // Combine existing files with new files
            const updatedFiles = [...currentFiles, ...filesToAdd];
            setFile(updatedFiles);

            // Handle multiple files previews
            const newPreviews = [...currentPreviews];
            let loadedCount = 0;

            filesToAdd.forEach((file, index) => {
               const reader = new FileReader();
               reader.onload = (e) => {
                  newPreviews[currentPreviews.length + index] = e.target?.result;
                  loadedCount++;

                  // Update state only when all new files are loaded
                  if (loadedCount === filesToAdd.length) {
                     setFilePreview(newPreviews);
                  }
               };
               reader.readAsDataURL(file);
            });

            onChange?.(updatedFiles);
         } else {
            // Handle single file
            setFile(acceptedFiles[0]); //(fix: store as File, not array)
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
   const currentFileCount = acceptMultiple 
      ? (Array.isArray(file) ? file.length : 0)
      : (file ? 1 : 0);
   
   const isMaxReached = acceptMultiple && currentFileCount >= maxFiles;

   return (
      <div className="relative">
         <Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            maxFiles={acceptMultiple ? maxFiles : 1}
            onDrop={handleDrop}
            onError={console.error}
            src={file}
         >
            <DropzoneEmptyState />
            <DropzoneContent>
               {!acceptMultiple && filePreview && (
               <div className="aspect-[5/2] w-full relative group">
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
                           className="aspect-[5/2] w-full relative group"
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
      {acceptMultiple && (
         <div className={`mt-2 text-sm text-center ${isMaxReached ? 'text-amber-600 dark:text-amber-500 font-medium' : 'text-muted-foreground'}`}>
            {lang === "ar" ? (
               <span>
                  {currentFileCount} من {maxFiles} صور
                  {isMaxReached && " • تم الوصول للحد الأقصى"}
               </span>
            ) : (
               <span>
                  {currentFileCount} of {maxFiles} images
                  {isMaxReached && " • Maximum reached"}
               </span>
            )}
         </div>
      )}
      </div>
   );
};
export default DragZone;
