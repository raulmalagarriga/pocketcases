import React from "react";
import { getStorefrontData } from "@/lib/queries/storefront";
import { Navbar } from "@/components/storefront/Navbar";
import { TopMarquee } from "@/components/storefront/TopMarquee";
import { HeroSection } from "@/components/storefront/HeroSection";
import { TrustMetricsBar } from "@/components/storefront/TrustMetricsBar";
import { ProductCatalog } from "@/components/storefront/ProductCatalog";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { SocialProofReel } from "@/components/storefront/SocialProofReel";
import { FaqSection } from "@/components/storefront/FaqSection";
import { Footer } from "@/components/storefront/Footer";

export const dynamic = "force-dynamic";

export default async function StorefrontPage() {
  const { products, settings } = await getStorefrontData();

  return (
    <>
      <Navbar settings={settings} />
      <main className="w-full bg-background">
        <div className="flex flex-col w-full">
          <TopMarquee />
          <HeroSection settings={settings} />
          <TrustMetricsBar />
          <ProductCatalog initialProducts={products} settings={settings} />
          <CartDrawer settings={settings} />
          <SocialProofReel />
          <FaqSection />
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
