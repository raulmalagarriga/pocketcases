"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Product, StoreSettings } from "@/types/database";
import { INITIAL_PRODUCTS } from "@/lib/seed-data";
import {
  getLocalCachedProducts,
  getLocalCachedSettings,
} from "@/lib/queries/cms";
import { smoothScrollTo } from "@/components/ui/ScrollReveal";

interface NavbarProps {
  settings: StoreSettings;
  products?: Product[];
}

const NAV_ITEMS = [
  { label: "Ver Todo", path: "all", href: "#product-catalog" },
  { label: "Nuevos Drops", path: "collabs", href: "#product-catalog" },
  { label: "Más Vendidos", path: "iphone", href: "#product-catalog" },
  { label: "MagSafe", path: "magsafe", href: "#product-catalog" },
  { label: "Sobre Nosotros", path: "about", href: "#social-proof" },
];

export function Navbar({ settings, products }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [liveSettings, setLiveSettings] = useState<StoreSettings>(settings);
  const [liveProducts, setLiveProducts] = useState<Product[]>(
    () => products || INITIAL_PRODUCTS.filter((p) => p.is_live)
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cached = getLocalCachedSettings();
    if (cached) {
      setLiveSettings((prev) => ({
        ...prev,
        ...cached,
        logo_url: cached.logo_url || prev.logo_url || "/logo.png",
      }));
    } else {
      setLiveSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    const cachedProducts = getLocalCachedProducts();
    if (cachedProducts && cachedProducts.length > 0) {
      setLiveProducts(cachedProducts.filter((p) => p.is_live));
    } else if (products && products.length > 0) {
      setLiveProducts(products);
    }
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    items,
    toggleCart,
    currencyMode,
    toggleCurrencyMode,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappUrl = `https://wa.me/${liveSettings.whatsapp_number.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    "¡Hola Pocket Cases! Quisiera asesoría sobre los forros disponibles."
  )}`;

  const matchingProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return liveProducts.filter((product) => {
      const matchesTitle = product.title.toLowerCase().includes(q);
      const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
      const matchesCategory = product.category_badge.toLowerCase().includes(q);
      const matchesSku = product.sku.toLowerCase().includes(q);
      const matchesColor = product.color_variants?.some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.name_en && c.name_en.toLowerCase().includes(q))
      );
      return (
        matchesTitle ||
        matchesSubtitle ||
        matchesCategory ||
        matchesSku ||
        matchesColor
      );
    });
  }, [liveProducts, searchQuery]);

  const formatPrice = (usd: number) => {
    if (currencyMode === "VES") {
      return `Bs. ${(usd * liveSettings.bcv_exchange_rate).toFixed(2)}`;
    }
    return `$${usd.toFixed(2)}`;
  };

  const handleNavClick = (path: string, href: string) => {
    if (path !== "about") {
      setActiveCategory(path);
    }
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    smoothScrollTo(href);
  };

  const handleViewAllSearchResults = () => {
    setIsSearchOpen(false);
    if (pathname !== "/") {
      router.push("/#product-catalog");
      return;
    }
    smoothScrollTo("#product-catalog");
  };

  return (
    <header className="sticky top-0 left-0 w-full z-40">
      <div className="h-20 bg-surface/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(42,50,53,0.06)]">
        <div className="h-full max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              alt={liveSettings.store_name || "Pocket Cases"}
              className="h-12 w-[112px] sm:w-[128px] shrink-0 object-contain rounded-lg shadow-[2px_2px_0px_#2a3235] hover:scale-[1.02] transition-transform bg-[#d8f3c8]"
              src={liveSettings.logo_url || "/logo.png"}
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </Link>

          {/* Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-space-xs font-label-lg text-label-lg flex-nowrap whitespace-nowrap">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === "/" &&
                ((item.path === "all" && activeCategory === "all") ||
                  (item.path !== "all" &&
                    item.path !== "about" &&
                    activeCategory === item.path));

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.path, item.href)}
                  className={
                    isActive
                      ? "px-space-md py-space-xs transition-all bg-primary text-on-primary font-bold rounded-full shadow-[2px_2px_0px_#2a3235] whitespace-nowrap"
                      : "px-space-md py-space-xs rounded-full text-on-surface-variant hover:bg-primary-fixed/50 hover:text-primary transition-all whitespace-nowrap"
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-space-sm sm:gap-space-md">
            {/* Search Input + Live Autocomplete Dropdown */}
            <div
              ref={searchContainerRef}
              className="relative hidden md:flex items-center"
            >
              <input
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearchOpen(false);
                  } else if (e.key === "Enter" && searchQuery.trim()) {
                    handleViewAllSearchResults();
                  }
                }}
                className="w-56 xl:w-64 pl-9 pr-8 py-1.5 rounded-full bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#2a3235] transition-all"
                placeholder="Buscar fundas, modelos..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 text-primary text-[18px] pointer-events-none">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 text-outline hover:text-on-surface flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              )}

              {/* Floating Live Search Results Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-DEFAULT shadow-[4px_4px_0px_#2a3235] border border-outline-variant/50 z-50 overflow-hidden">
                  <div className="px-3.5 py-2 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
                    <span className="font-label-badge text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Resultados para &ldquo;{searchQuery.trim()}&rdquo;
                    </span>
                    <span className="font-label-badge text-[10px] font-bold text-primary">
                      {matchingProducts.length}{" "}
                      {matchingProducts.length === 1
                        ? "coincidencia"
                        : "coincidencias"}
                    </span>
                  </div>

                  {matchingProducts.length === 0 ? (
                    <div className="p-space-md text-center">
                      <p className="font-label-md text-label-md text-on-surface font-bold">
                        No encontramos forros con ese nombre
                      </p>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                        Prueba buscando por color, MagSafe o modelo.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/25">
                        {matchingProducts.slice(0, 6).map((product) => {
                          const isOut =
                            product.stock_status === "out_of_stock" ||
                            product.total_stock <= 0;
                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 p-2.5 hover:bg-primary-fixed/25 transition-colors"
                            >
                              <img
                                src={product.primary_image_url}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover shrink-0 shadow-[1px_1px_0px_#2a3235] bg-secondary-fixed/40"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-label-lg text-label-md font-bold text-on-surface truncate">
                                    {product.title}
                                  </p>
                                  <span className="font-label-md text-label-md font-extrabold text-primary shrink-0">
                                    {formatPrice(product.price_usd)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                  <p className="font-body-sm text-xs text-on-surface-variant truncate">
                                    {product.category_badge} •{" "}
                                    {product.subtitle}
                                  </p>
                                  <span
                                    className={`font-label-badge text-[9px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                                      isOut
                                        ? "bg-surface-container-highest text-outline"
                                        : "bg-secondary-container text-on-secondary-container"
                                    }`}
                                  >
                                    {isOut ? "Agotado" : "Disponible"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={handleViewAllSearchResults}
                        className="w-full py-2.5 px-3 bg-surface-container-low hover:bg-primary-fixed/40 text-primary font-label-md text-xs font-bold flex items-center justify-center gap-1.5 border-t border-outline-variant/30 transition-colors cursor-pointer"
                      >
                        <span>
                          Ver resultados en el catálogo (
                          {matchingProducts.length})
                        </span>
                        <span className="material-symbols-outlined text-[15px]">
                          arrow_downward
                        </span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Currency Switcher (USD / BCV Bs.) */}
            <button
              type="button"
              onClick={toggleCurrencyMode}
              title={`Tasa BCV referencial: Bs. ${liveSettings.bcv_exchange_rate.toFixed(
                2
              )} / $1 USD (Clic para alternar)`}
              className="flex items-center bg-surface-container-lowest rounded-full px-space-sm py-1 shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed/40 transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[16px] text-primary mr-1">
                payments
              </span>
              <span className="font-label-badge text-label-badge text-on-surface font-bold">
                {currencyMode === "USD"
                  ? "USD ($)"
                  : `Bs. (${liveSettings.bcv_exchange_rate})`}
              </span>
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              className="hidden sm:flex items-center gap-1 bg-primary text-on-primary font-label-md text-label-md px-space-md py-1.5 rounded-full shadow-[2px_2px_0px_#2a3235] hover:bg-primary-container transition-all whitespace-nowrap shrink-0"
              href={whatsappUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>WhatsApp</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={toggleCart}
              aria-label="Abrir carrito"
              className="relative p-2 rounded-full bg-surface-container-lowest text-on-surface shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-high hover:text-on-surface transition-all shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                shopping_bag
              </span>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-on-primary font-label-badge text-label-badge flex items-center justify-center font-bold">
                {totalItems}
              </span>
            </button>

            {/* Admin / User Profile Link */}
            <Link
              href="/admin/products"
              title="Ir al Panel Administrativo (CMS)"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[2px_2px_0px_#2a3235] hover:bg-primary-container transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
