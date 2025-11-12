import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions";

export default async function ProductsSection() {
  const products = await getProducts();

  return (
    <section className="relative z-20 px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 border border-white/10">
            <span className="text-white/90 text-sm font-light">
              {"Featured Products"}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            {"Premium Shader Tools"}
          </h2>
          <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
            {
              "Explore our collection of professional shader tools and effects designed to elevate your creative projects"
            }
          </p>
        </div>

        {/* Products Grid */}
        <div className={!products.length ? "flex" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
          {products.map((product: any) => (
            <ProductCard key={product._id} {...product} />
          ))}

          {!products.length && (
            <p className="text-center mx-auto text-xl">
              No Products Available
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
