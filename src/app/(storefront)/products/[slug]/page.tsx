import React from "react";
import { getProductBySlug } from "@/lib/queries/storefront";
import { Navbar } from "@/components/storefront/Navbar";
import { TopMarquee } from "@/components/storefront/TopMarquee";
import { ProductDetailView } from "@/components/storefront/ProductDetailView";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Footer } from "@/components/storefront/Footer";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const { product, relatedProducts, allProducts, settings } =
    await getProductBySlug(slug);

  return (
    <>
      <Navbar settings={settings} products={allProducts} />
      <main className="w-full bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <TopMarquee />
          <ProductDetailView
            slug={slug}
            initialProduct={product}
            initialRelatedProducts={relatedProducts}
            settings={settings}
          />
          <CartDrawer settings={settings} />
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
