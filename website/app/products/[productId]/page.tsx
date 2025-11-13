import ProductClient from "./page.client";
import { getProductData, getProductReviews } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  params = await params;

  const product = await getProductData(params.productId);

  if (!product) redirect("/");

  const reviews = (await getProductReviews(params.productId))!;

  return <ProductClient product={{ ...product, reviews }} />;
}
