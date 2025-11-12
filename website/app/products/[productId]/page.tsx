import { mockProducts, getMockReviews } from "@/lib/mock-data";
import type { Product, Review } from "@/types";

import ProductClient from "./page.client";

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  params = await params;

  return <ProductClient params={params} />;
}
