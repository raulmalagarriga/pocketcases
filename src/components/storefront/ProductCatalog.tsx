"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product, StoreSettings } from "@/types/database";
import { ProductCard } from "./ProductCard";
import { WaitlistModal } from "./WaitlistModal";
import { useCartStore } from "@/store/useCartStore";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ALL_SUPPORTED_MODELS } from "@/lib/seed-data";

interface ProductCatalogProps {
  initialProducts: Product[];
  settings: StoreSettings;
}

const FILTER_PILLS = [
  { id: "all", label: "Todos los modelos" },
  { id: "iphone", label: "Serie iPhone 16 / 15" },
  { id: "samsung", label: "Samsung Galaxy" },
  { id: "magsafe", label: "MagSafe Ultra Resistente" },
  { id: "slim", label: "Pastel Delgado" },
  { id: "collabs", label: "Edición Limitada" },
];

export function ProductCatalog({
  initialProducts,
  settings,
}: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);

  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } =
    useCartStore();

  // Real-time subscription to Supabase `products` & `product_color_variants`
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    const refreshCatalog = async () => {
      const { data } = await supabase
        .from("products")
        .select(
          `
          *,
          color_variants:product_color_variants(*)
        `
        )
        .eq("is_live", true)
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        const mapped = data.map((raw: Record<string, unknown>) => ({
          ...(raw as unknown as Product),
          price_usd: Number(raw.price_usd ?? 0),
          compare_at_price_usd:
            raw.compare_at_price_usd !== null &&
            raw.compare_at_price_usd !== undefined
              ? Number(raw.compare_at_price_usd)
              : null,
          cost_usd: Number(raw.cost_usd ?? 0),
          color_variants: Array.isArray(raw.color_variants)
            ? [...raw.color_variants].sort(
                (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
              )
            : [],
          supported_models: ALL_SUPPORTED_MODELS,
        }));
        setProducts(mapped);
      }
    };

    const channel = supabase
      .channel("realtime-storefront-catalog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          refreshCatalog();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_color_variants" },
        () => {
          refreshCatalog();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Category pill filter
    if (activeCategory !== "all") {
      list = list.filter((p) => {
        if (p.filter_tags?.includes(activeCategory)) return true;
        if (
          activeCategory === "magsafe" &&
          p.category_badge.toLowerCase().includes("magsafe")
        )
          return true;
        if (
          activeCategory === "slim" &&
          (p.category_badge.toLowerCase().includes("slim") ||
            p.category_badge.toLowerCase().includes("delgado") ||
            p.category_badge.toLowerCase().includes("resina"))
        )
          return true;
        if (
          activeCategory === "collabs" &&
          (p.promo_tag === "HOT DROP" || p.promo_tag === "BESTSELLER")
        )
          return true;
        return false;
      });
    }

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category_badge.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.color_variants.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price_usd - b.price_usd);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price_usd - a.price_usd);
    } else if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "available") {
      list.sort((a, b) => {
        const aOut = a.stock_status === "out_of_stock" ? 1 : 0;
        const bOut = b.stock_status === "out_of_stock" ? 1 : 0;
        return aOut - bOut || b.total_stock - a.total_stock;
      });
    } else {
      list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }

    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section
      className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop pt-space-xl pb-space-2xl"
      id="product-catalog"
    >
      {/* Header with Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-lg">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-1.5 font-label-badge text-label-badge text-primary uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-[14px]">
              grid_view
            </span>{" "}
            COLECCIÓN POCKET CANDY 2025
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Colección para tu cel
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Selecciona el modelo de tu teléfono, personaliza el acabado y
            agrégalo directo a tu bolsa.
          </p>
        </div>

        {/* Sort Selection Control */}
        <div className="flex items-center gap-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Ordenar por:
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-surface-container-lowest font-label-md text-label-md text-on-surface px-space-md py-2 pr-8 rounded-full shadow-[2px_2px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              id="catalogSort"
            >
              <option value="featured">Lanzamientos Destacados</option>
              <option value="price-asc">Precio: de Menor a Mayor</option>
              <option value="price-desc">Precio: de Mayor a Menor</option>
              <option value="newest">Lo Más Nuevo</option>
              <option value="available">Disponibilidad: Para Envío Ya</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Filter Category Pills Strip */}
      <div
        className="flex items-center gap-space-xs overflow-x-auto pb-space-md scrollbar-none"
        id="filterPillsContainer"
      >
        {FILTER_PILLS.map((pill) => {
          const isActive = activeCategory === pill.id;
          const label =
            pill.id === "all"
              ? `${pill.label} (${products.length})`
              : pill.label;

          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveCategory(pill.id)}
              className={
                isActive
                  ? "filter-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all bg-inverse-surface text-surface shadow-[2px_2px_0px_#ab2c5d] whitespace-nowrap"
                  : "filter-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all bg-surface-container-lowest text-on-surface shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container whitespace-nowrap"
              }
            >
              {label}
            </button>
          );
        })}

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="px-space-md py-1.5 rounded-full font-label-md text-label-md bg-primary-fixed text-primary shadow-[2px_2px_0px_#2a3235] flex items-center gap-1 whitespace-nowrap"
          >
            <span>Búsqueda: &ldquo;{searchQuery}&rdquo;</span>
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}
      </div>

      {/* 8 Product Grid Cards */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-lg p-space-xl text-center shadow-[3px_3px_0px_#2a3235] mt-space-md">
          <span className="material-symbols-outlined text-[40px] text-primary mb-2">
            search_off
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            No encontramos forros con ese filtro
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Prueba mostrando todos los modelos disponibles de la colección.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-space-md px-space-lg py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-full shadow-[2px_2px_0px_#2a3235]"
          >
            Ver todos los modelos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-md">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onJoinWaitlist={(prod) => setWaitlistProduct(prod)}
            />
          ))}
        </div>
      )}

      {/* Waitlist Modal */}
      {waitlistProduct && (
        <WaitlistModal
          product={waitlistProduct}
          onClose={() => setWaitlistProduct(null)}
        />
      )}
    </section>
  );
}
