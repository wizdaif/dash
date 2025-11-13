import Header from "@/components/header";
import ShaderBackground from "@/components/shader-background";
import ProductsSection from "@/components/products-section";
import { getSiteConfig } from "@/lib/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { SITE_TITLE: title, SITE_DESCRIPTION: description } =
    await getSiteConfig();

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Powered by getpulserbx.io`,
      description,
      siteName: title,
      type: "website",
      //url
      //locale: "en_US"
      //images: { url, width, height, alt }[]
    },
    // icons: { icon, shortcut, apple }
  };
}

export default async function ShaderShowcase() {
  return (
    <ShaderBackground>
      <Header />
      <ProductsSection />
    </ShaderBackground>
  );
}
