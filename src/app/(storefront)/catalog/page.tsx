import React from "react";
import Link from "next/link";
import { getStorefrontData } from "@/lib/queries/storefront";
import { Navbar } from "@/components/storefront/Navbar";
import { TopMarquee } from "@/components/storefront/TopMarquee";
import { ProductCatalog } from "@/components/storefront/ProductCatalog";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Footer } from "@/components/storefront/Footer";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { products, settings } = await getStorefrontData();

  return (
    <>
      <Navbar settings={settings} products={products} />
      <main className="w-full bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <TopMarquee />

          {/* Clean Catalog Page Header / Breadcrumb */}
          <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop pt-space-lg">
            <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-3 rounded-xl shadow-[2px_2px_0px_#2a3235]">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant"
              >
                <Link
                  href="/"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    home
                  </span>
                  <span>Inicio</span>
                </Link>
                <span>/</span>
                <span className="text-primary font-extrabold">
                  Catálogo Completo
                </span>
              </nav>

              <Link
                href="/"
                className="inline-flex items-center gap-1 font-label-badge text-label-badge text-on-surface hover:text-primary font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">
                  arrow_back
                </span>
                <span>Volver al Inicio</span>
              </Link>
            </div>
          </div>

          <ProductCatalog initialProducts={products} settings={settings} />
          <CartDrawer settings={settings} />
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
