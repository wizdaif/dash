"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function FileUploadPreview({
  images,
  setImages,
}: {
  images: {
    name: string;
    type: string;
    preview?: string;
    buffer: Promise<ArrayBuffer>;
  }[];
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        type: string;
        preview?: string;
        buffer: Promise<ArrayBuffer>;
      }[]
    >
  >;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];

    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const previews = imageFiles.map((file) => {
      return {
        name: file.name,
        type: file.type,
        buffer: file.arrayBuffer(),
        preview: URL.createObjectURL(file),
      };
    });

    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newList = [...prev];
      const img = newList[index];
      URL.revokeObjectURL(img.preview!);
      newList.splice(index, 1);
      return newList;
    });
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <label className="text-sm text-white/60 mb-1 block">
          Upload Images
        </label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {/* File Preview Grid */}
      <div className="flex flex-wrap gap-4">
        {images.map((file, idx) => (
          <Card
            key={idx}
            className="relative w-32 h-32 bg-white/5 border-white/10 text-red overflow-hidden group"
          >
            <CardTitle>
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red/50 rounded-full p-1 text-red-500"
              >
                <X size={14} />
              </button>
            </CardTitle>

            <CardContent
              className="p-0 w-full h-full flex items-center justify-center cursor-pointer"
              onClick={() => file.preview && setSelectedImage(file.preview!)}
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="object-cover w-full h-full transition-transform"
                />
              ) : (
                <div className="text-xs text-center p-2 text-white/60 break-all">
                  {file.name}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
