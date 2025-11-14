"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, ShoppingCart } from "lucide-react";
import type { Product, Review } from "@/types";
import { base64ToFile } from "@/lib/utils";

export default function ProductDetailPage({
  product: { images, ...product },
}: {
  product: Product;
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(product.reviews!);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  images = images
    .filter((i) => i.type === "image")
    .map((image) => {
      const file = base64ToFile(image.value, image.name!, image.filetype!);

      return {
        name: file.name,
        type: file.type,
        buffer: file.arrayBuffer(),
        preview: URL.createObjectURL(file),
      };
    }) as any;

  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [product]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={(image as any).preview || "/placeholder.svg"}
                  alt={`${product.name} - ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* Category Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-white/90 text-sm font-light">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-white"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={(image as any)?.preview || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-white mb-4 text-balance">
                {product.name}
              </h1>
              <p className="text-lg text-white/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/70">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm text-white/80 bg-white/5 rounded-lg border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Price & Purchase */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-light text-white">
                  ${product.price.price}
                </span>
                <span className="text-white/50">USD</span>
              </div>

              <div className="space-y-4">
                <Button className="w-full py-6 rounded-full bg-white text-black text-lg font-normal hover:bg-white/90 transition-all duration-200">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button className="w-full py-6 rounded-full bg-white/10 text-white text-lg font-normal hover:bg-white/20 border border-white/20 transition-all duration-200">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-light text-white mb-4">
                {"What's Included"}
              </h3>
              <ul className="space-y-3 text-white/70">
                {product.features.map((feature, index) => (
                  <li className="flex items-start gap-3" key={index}>
                    <span className="text-white mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-light text-white mb-8">
            Customer Reviews
          </h2>
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg text-white font-normal">
                      {review.username}
                    </h4>
                    <p className="text-sm text-white/50">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
