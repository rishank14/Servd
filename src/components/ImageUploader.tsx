"use client";

import { useState, useCallback, useRef, type ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { RingLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
   onImageSelect: (file: File | null) => void;
   loading?: boolean;
   image?: File | null;
}

export default function ImageUploader({
   onImageSelect,
   loading = false,
   image,
}: ImageUploaderProps) {
   const [internalPreview, setInternalPreview] = useState<string | null>(null);
   const preview =
      image === undefined ? internalPreview : image ? internalPreview : null;
   const fileInputRef = useRef<HTMLInputElement>(null);

   const onDrop = useCallback(
      (acceptedFiles: File[]) => {
         const file = acceptedFiles[0];

         if (!file) return;

         const reader = new FileReader();

         reader.onloadend = () => {
            if (typeof reader.result === "string") {
               setInternalPreview(reader.result);
            }
         };

         reader.readAsDataURL(file);
         onImageSelect(file);
      },
      [onImageSelect],
   );

   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      accept: {
         "image/jpeg": [".jpeg", ".jpg"],
         "image/png": [".png"],
         "image/webp": [".webp"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024,
      noClick: true,
      noKeyboard: true,
      disabled: loading,
   });

   const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
         onDrop([file]);
      }
   };

   const clearImage = () => {
      if (loading) return;

      setInternalPreview(null);
      onImageSelect(null);

      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   if (preview) {
      return (
         <div className="relative aspect-video max-h-64 sm:max-h-72 w-full overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-900/5">
            <Image
               src={preview}
               alt="Pantry image preview"
               fill
               unoptimized
               sizes="(max-width: 768px) 100vw, 600px"
               className="object-contain"
            />

            {!loading && (
               <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Remove selected image"
                  className="absolute right-3 top-3 rounded-full bg-white/95 p-1.5 shadow-md transition-colors hover:bg-white hover:text-red-600"
               >
                  <X className="h-4 w-4 text-stone-700" />
               </button>
            )}

            {loading && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <RingLoader color="#ffffff" />
               </div>
            )}
         </div>
      );
   }

   return (
      <div
         {...getRootProps()}
         className={`relative w-full rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-all flex flex-col items-center justify-center text-center gap-3 sm:gap-4 overflow-hidden ${
            loading
               ? "cursor-not-allowed border-stone-200 bg-stone-100 opacity-70"
               : isDragActive
                 ? "scale-[1.01] border-[#d13228] bg-orange-50"
                 : "cursor-pointer border-stone-300 bg-stone-50 hover:border-[#d13228] hover:bg-orange-50/50"
         }`}
      >
         <input {...getInputProps()} />

         <div
            className={`rounded-full p-3 sm:p-4 transition-all ${
               isDragActive ? "scale-110 bg-[#d13228]" : "bg-orange-100"
            }`}
         >
            {isDragActive ? (
               <ImageIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            ) : (
               <Camera className="h-6 w-6 sm:h-7 sm:w-7 text-[#d13228]" />
            )}
         </div>

         <div className="max-w-md px-2">
            <h3 className="mb-1 text-lg sm:text-xl font-bold tracking-tight text-stone-900">
               {isDragActive ? "Drop your image here" : "Scan Your Pantry"}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
               {isDragActive
                  ? "Release to upload your image"
                  : "Take a photo or drag and drop an image of your fridge or pantry."}
            </p>
         </div>

         {!isDragActive && (
            <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-none">
               <Button
                  type="button"
                  disabled={loading}
                  onClick={(event) => {
                     event.stopPropagation();
                     fileInputRef.current?.click();
                  }}
                  className="w-full sm:w-auto gap-2 bg-[#d13228] text-white hover:bg-[#b82720]"
               >
                  <Camera className="h-4 w-4" />
                  Take Photo
               </Button>

               <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={(event) => {
                     event.stopPropagation();
                     open();
                  }}
                  className="w-full sm:w-auto gap-2 border-orange-200 text-[#d13228] hover:bg-orange-50"
               >
                  <Upload className="h-4 w-4" />
                  Browse Files
               </Button>
            </div>
         )}

         <p className="text-[11px] sm:text-xs text-stone-400">
            Supports JPG, PNG, and WebP · Max 10MB
         </p>

         <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            disabled={loading}
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="Choose a pantry image"
         />
      </div>
   );
}
