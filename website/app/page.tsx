import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import ProductsSection from "@/components/products-section"

export default async function ShaderShowcase() {
  return (
    <ShaderBackground>
      <Header />
      <ProductsSection />
    </ShaderBackground>
  )
}
