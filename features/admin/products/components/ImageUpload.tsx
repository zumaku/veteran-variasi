"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: (File | { url: string; id?: number })[];
  onChange: (value: (File | { url: string; id?: number })[]) => void;
  onRemove?: (urlToRemove: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange([...value, ...acceptedFiles]);
    },
    [onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    maxSize: 1 * 1024 * 1024, // 1MB
  });

  const removeFile = (indexToRemove: number) => {
    const itemToRemove = value[indexToRemove];
    if (onRemove && !(itemToRemove instanceof File) && itemToRemove.url) {
      onRemove(itemToRemove.url);
    }
    const newValue = value.filter((_, index) => index !== indexToRemove);
    onChange(newValue);
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm text-center text-muted-foreground mb-1">
          <span className="font-semibold">Klik untuk unggah</span> atau seret
          dan lepas
        </p>
        <p className="text-xs text-center text-muted-foreground">
          PNG, JPG, WEBP maks 1MB per foto
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((file, index) => {
            const isFile = file instanceof File;
            const url = isFile ? URL.createObjectURL(file) : file.url;

            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border group"
              >
                <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Image
                  src={url}
                  alt={`Preview ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
