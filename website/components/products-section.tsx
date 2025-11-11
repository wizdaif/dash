"use client"

import ProductCard from "@/components/product-card"

const products = [
  {
    id: "1",
    name: "Gradient Shader Pro",
    description:
      "Professional-grade shader system with advanced lighting and particle effects for stunning visual experiences.",
    price: "$49",
    images: [
      "/abstract-purple-gradient-shader.jpg",
      "/glowing-violet-mesh-gradient.jpg",
      "/animated-shader-effects.jpg",
    ],
    category: "Premium",
    tags: ["WebGL", "Interactive", "Performance"],
  },
  {
    id: "2",
    name: "Particle System",
    description:
      "Create mesmerizing particle effects with real-time physics and customizable parameters for any project.",
    price: "$39",
    images: ["/particle-effects-purple-glow.jpg", "/floating-particles-shader.jpg", "/dynamic-particle-system.jpg"],
    category: "Effects",
    tags: ["Physics", "Animation", "Customizable"],
  },
  {
    id: "3",
    name: "Lighting Studio",
    description:
      "Advanced lighting toolkit with dynamic shadows, reflections, and ambient occlusion for realistic renders.",
    price: "$59",
    images: ["/dramatic-studio-lighting.jpg", "/3d-lighting-effects.jpg", "/shader-lighting-system.jpg"],
    category: "Professional",
    tags: ["3D", "Realistic", "Dynamic"],
  },
  {
    id: "4",
    name: "Mesh Gradient Kit",
    description:
      "Beautiful mesh gradient library with smooth transitions and interactive controls for modern interfaces.",
    price: "$29",
    images: ["/smooth-mesh-gradient-background.jpg", "/colorful-gradient-mesh.jpg", "/interactive-gradient-shader.jpg"],
    category: "Starter",
    tags: ["Gradients", "UI", "Responsive"],
  },
  {
    id: "5",
    name: "Shader Effects Bundle",
    description: "Complete collection of shader effects including blur, distortion, and chromatic aberration effects.",
    price: "$79",
    images: ["/shader-effects-collection.jpg", "/post-processing-effects.jpg", "/visual-effects-shader.jpg"],
    category: "Bundle",
    tags: ["Complete", "Post-FX", "Pro"],
  },
  {
    id: "6",
    name: "Motion Graphics",
    description:
      "Dynamic motion graphics toolkit with keyframe animation and smooth easing functions for creative projects.",
    price: "$44",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    category: "Animation",
    tags: ["Motion", "Keyframes", "Creative"],
  },
]

export default function ProductsSection() {
  return (
    <section className="relative z-20 px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 border border-white/10">
            <span className="text-white/90 text-sm font-light">Featured Products</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            <span className="font-medium italic instrument">Premium</span> Shader Tools
          </h2>
          <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
            Explore our collection of professional shader tools and effects designed to elevate your creative projects
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
