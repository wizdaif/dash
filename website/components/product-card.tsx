"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { base64ToFile } from "@/lib/utils";

interface ProductCardProps {
  _id: string;
  name: string;
  description: string;
  price: {
    price: number;
    robux: number;
  };
  images: string[];
  category: string;
  tags: string[];
}

export default function ProductCard({
  _id,
  name,
  description,
  price,
  images,
  category,
  tags,
}: ProductCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  images = images
    .filter((i: any) => i.type === "image")
    .map((image: any) => {
      const file = base64ToFile(image.value, image.name!, image.filetype!);

      return URL.createObjectURL(file)
    });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      onClick={() => router.push(`/products/${_id}`)}
      className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-black/40">
        {images.map((image, index) => (
          <img
            key={index}
            src={image || "/placeholder.svg"}
            alt={`${name} - ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-white/90 text-xs font-light">{category}</span>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white w-6" : "bg-white/40"
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-medium text-white mb-2 text-balance">
          {name}
        </h3>
        <p className="text-sm text-white/70 mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs text-white/80 bg-white/5 rounded-md border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-light text-white">
            ${price.price.toLocaleString()}
          </span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${_id}`);
            }}
            className="px-6 py-2 rounded-full bg-white text-black font-normal text-sm hover:bg-white/90 transition-all duration-200"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
