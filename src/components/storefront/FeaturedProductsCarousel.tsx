"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Product, StoreSettings } from "@/types/database";
import { ProductCard } from "./ProductCard";
import { WaitlistModal } from "./WaitlistModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  getLocalCachedProducts,
  getLocalCachedSettings,
} from "@/lib/queries/cms";

interface FeaturedProductsCarouselProps {
  products: Product[];
  settings: StoreSettings;
}

export function FeaturedProductsCarousel({
  products: initialProducts,
  settings: initialSettings,
}: FeaturedProductsCarouselProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [liveSettings, setLiveSettings] =
    useState<StoreSettings>(initialSettings);
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const cachedSettings = getLocalCachedSettings();
    if (cachedSettings) {
      setLiveSettings((prev) => ({ ...prev, ...cachedSettings }));
    } else {
      setLiveSettings(initialSettings);
    }

    const cachedProducts = getLocalCachedProducts();
    if (cachedProducts && cachedProducts.length > 0) {
      const liveLocal = cachedProducts.filter((p) => p.is_live);
      if (liveLocal.length > 0) {
        setProducts(liveLocal);
      }
    }
  }, [initialSettings]);

  const featuredProducts = useMemo(() => {
    const liveList = products.filter((p) => p.is_live !== false);
    const scoreProduct = (p: Product) => {
      let score = 0;
      if (p.is_featured_hero) score += 100;
      if (p.promo_tag === "BESTSELLER") score += 60;
      if (p.promo_tag === "HOT DROP") score += 50;
      if (p.stock_status === "in_stock") score += 30;
      if (p.stock_status === "low_stock") score += 15;
      return score;
    };

    return [...liveList]
      .sort(
        (a, b) =>
          scoreProduct(b) - scoreProduct(a) ||
          (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
      .slice(0, 6);
  }, [products]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="featured-drops"
      className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-2xl scroll-mt-24"
    >
      <ScrollReveal direction="up">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-lg">
          <div className="space-y-space-xs max-w-2xl">
            <div className="inline-flex items-center gap-1.5 font-label-badge text-label-badge text-primary uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">
                auto_awesome
              </span>{" "}
              DROPS DESTACADOS 2025
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Los Favoritos de la Comunidad
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Desliza para ver los diseños más buscados o explora todo nuestro
              catálogo por modelo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Anterior"
                onClick={() => handleScroll("left")}
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed hover:text-primary transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={() => handleScroll("right")}
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed hover:text-primary transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>

            <Link
              href="/catalog"
              className="px-space-lg py-2.5 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-md font-bold shadow-[2px_2px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-all inline-flex items-center gap-1.5"
            >
              <span>Ver Catálogo Completo →</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Horizontal Snap Carousel */}
      <ScrollReveal direction="up" delayMs={80}>
        <div
          ref={scrollContainerRef}
          className="flex gap-space-lg overflow-x-auto snap-x snap-mandatory scrollbar-none pb-space-md pt-2"
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[310px] max-w-[320px] snap-start shrink-0"
            >
              <ProductCard
                product={product}
                settings={liveSettings}
                onJoinWaitlist={(prod) => setWaitlistProduct(prod)}
              />
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Bottom Centered CTA Banner */}
      <ScrollReveal direction="up" delayMs={140}>
        <div className="mt-space-xl bg-surface-container-low rounded-xl p-space-lg md:p-space-xl shadow-[3px_3px_0px_#2a3235] flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 font-label-badge text-label-badge text-tertiary uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">
                smartphone
              </span>
              IPHONE 13 AL 16 PRO MAX + SAMSUNG GALAXY
            </span>
            <h3 className="font-headline-sm text-headline-sm md:text-headline-md text-on-surface font-extrabold">
              ¿Buscas otro modelo de iPhone o Samsung Galaxy?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Filtra por tu dispositivo exacto, textura MagSafe, acabado espejo
              o disponibilidad inmediata.
            </p>
          </div>

          <Link
            href="/catalog"
            className="px-space-xl py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-extrabold shadow-[3px_3px_0px_#2a3235] hover:bg-primary-container hover:text-on-primary-container transition-all inline-flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">
              grid_view
            </span>
            <span>
              Explorar Catálogo Completo ({products.length} Diseños)
            </span>
          </Link>
        </div>
      </ScrollReveal>

      {waitlistProduct && (
        <WaitlistModal
          product={waitlistProduct}
          onClose={() => setWaitlistProduct(null)}
        />
      )}
    </section>
  );
}
