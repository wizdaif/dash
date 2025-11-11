import type { Product, OwnedProduct, Review, Analytics } from "@/types"

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Gradient Shader Pro",
    description:
      "Professional-grade shader system with advanced lighting and particle effects for stunning visual experiences.",
    category: "Premium",
    tags: ["WebGL", "Interactive", "Performance"],
    price: 49,
    images: [
      "/abstract-purple-gradient-shader.jpg",
      "/glowing-violet-mesh-gradient.jpg",
      "/animated-shader-effects.jpg",
    ],
  },
  {
    id: "2",
    name: "Particle System",
    description:
      "Create mesmerizing particle effects with real-time physics and customizable parameters for any project.",
    category: "Effects",
    tags: ["Physics", "Animation", "Customizable"],
    price: 39,
    images: ["/particle-effects-purple-glow.jpg", "/floating-particles-shader.jpg", "/dynamic-particle-system.jpg"],
  },
  {
    id: "3",
    name: "Lighting Studio",
    description:
      "Advanced lighting toolkit with dynamic shadows, reflections, and ambient occlusion for realistic renders.",
    category: "Professional",
    tags: ["3D", "Realistic", "Dynamic"],
    price: 59,
    images: ["/dramatic-studio-lighting.jpg", "/3d-lighting-effects.jpg", "/shader-lighting-system.jpg"],
  },
  {
    id: "4",
    name: "Mesh Gradient Kit",
    description:
      "Beautiful mesh gradient library with smooth transitions and interactive controls for modern interfaces.",
    category: "Starter",
    tags: ["Gradients", "UI", "Responsive"],
    price: 29,
    images: ["/smooth-mesh-gradient-background.jpg", "/colorful-gradient-mesh.jpg", "/interactive-gradient-shader.jpg"],
  },
  {
    id: "5",
    name: "Shader Effects Bundle",
    description: "Complete collection of shader effects including blur, distortion, and chromatic aberration effects.",
    category: "Bundle",
    tags: ["Complete", "Post-FX", "Pro"],
    price: 79,
    images: ["/shader-effects-collection.jpg", "/post-processing-effects.jpg", "/visual-effects-shader.jpg"],
  },
  {
    id: "6",
    name: "Motion Graphics",
    description:
      "Dynamic motion graphics toolkit with keyframe animation and smooth easing functions for creative projects.",
    category: "Animation",
    tags: ["Motion", "Keyframes", "Creative"],
    price: 44,
    images: ["/abstract-motion-graphics.png", "/keyframe-animation.jpg", "/creative-motion-effects.jpg"],
  },
]

export const getMockOwnedProducts = (userId: string): OwnedProduct[] => {
  return [
    {
      id: "owned_1",
      productId: "1",
      userId: userId,
      purchaseDate: "2024-01-15",
      licenseKey: "XXXX-XXXX-XXXX-" + Math.random().toString(36).substring(7).toUpperCase(),
      product: mockProducts[0],
    },
    {
      id: "owned_2",
      productId: "2",
      userId: userId,
      purchaseDate: "2024-02-20",
      licenseKey: "XXXX-XXXX-XXXX-" + Math.random().toString(36).substring(7).toUpperCase(),
      product: mockProducts[1],
    },
  ]
}

export const getMockReviews = (productId: string): Review[] => {
  return [
    {
      id: "review_1",
      productId: productId,
      userId: "user_1",
      username: "User123",
      rating: 5,
      comment: "Amazing product! Highly recommended.",
      date: "2024-01-20",
    },
    {
      id: "review_2",
      productId: productId,
      userId: "user_2",
      username: "Designer99",
      rating: 4,
      comment: "Great quality, works as expected.",
      date: "2024-02-10",
    },
  ]
}

export const getMockAnalytics = (): Analytics => {
  return {
    totalRevenue: 12450.5,
    totalPurchases: 156,
    activeUsers: 89,
    recentPurchases: [
      {
        id: "purchase_1",
        productName: "Gradient Shader Pro",
        username: "user123",
        amount: 49,
        date: "2024-03-15",
      },
      {
        id: "purchase_2",
        productName: "Particle System",
        username: "designer99",
        amount: 39,
        date: "2024-03-14",
      },
      {
        id: "purchase_3",
        productName: "Lighting Studio",
        username: "creator_x",
        amount: 59,
        date: "2024-03-13",
      },
    ],
    revenueChart: [
      { month: "Jan", revenue: 2500 },
      { month: "Feb", revenue: 3200 },
      { month: "Mar", revenue: 2800 },
      { month: "Apr", revenue: 3950 },
    ],
  }
}
