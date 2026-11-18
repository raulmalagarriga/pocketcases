"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { StoreSettings } from "@/types/database";
import { getLocalCachedSettings } from "@/lib/queries/cms";
import { smoothScrollTo } from "@/components/ui/ScrollReveal";

interface NavbarProps {
  settings: StoreSettings;
}

const NAV_ITEMS = [
  { label: "Ver Todo", path: "all", href: "#product-catalog" },
  { label: "Nuevos Drops", path: "collabs", href: "#product-catalog" },
  { label: "Más Vendidos", path: "iphone", href: "#product-catalog" },
  { label: "MagSafe", path: "magsafe", href: "#product-catalog" },
  { label: "Sobre Nosotros", path: "about", href: "#social-proof" },
];

export function Navbar({ settings }: NavbarProps) {
  const [liveSettings, setLiveSettings] = useState<StoreSettings>(settings);

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

  const handleNavClick = (path: string, href: string) => {
    if (path !== "about") {
      setActiveCategory(path);
    }
    smoothScrollTo(href);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-40">
      <div className="h-20 bg-surface/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(42,50,53,0.06)]">
        <div className="h-full max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
          {/* Brand Logo */}
          <a href="#" className="flex items-center">
            <img
              alt={liveSettings.store_name || "Pocket Cases"}
              className="h-11 w-auto object-contain rounded-lg shadow-[2px_2px_0px_#2a3235] hover:scale-[1.02] transition-transform"
              src={liveSettings.logo_url || "/logo.png"}
            />
          </a>

          {/* Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-space-xs font-label-lg text-label-lg flex-nowrap whitespace-nowrap">
            {NAV_ITEMS.map((item) => {
              const isActive =
                (item.path === "all" && activeCategory === "all") ||
                (item.path !== "all" &&
                  item.path !== "about" &&
                  activeCategory === item.path);

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
            {/* Search Input */}
            <div className="relative hidden xl:flex items-center">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length === 1) {
                    smoothScrollTo("#product-catalog");
                  }
                }}
                className="w-64 pl-9 pr-space-md py-1.5 rounded-full bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#2a3235] transition-all"
                placeholder="Buscar fundas, accesorios, modelos..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 text-primary text-[18px]">
                search
              </span>
            </div>

            {/* Currency Switcher (USD / BCV Bs.) */}
            <button
              type="button"
              onClick={toggleCurrencyMode}
              title={`Tasa BCV referencial: Bs. ${settings.bcv_exchange_rate.toFixed(
                2
              )} / $1 USD (Clic para alternar)`}
              className="flex items-center bg-surface-container-lowest rounded-full px-space-sm py-1 shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed/40 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary mr-1">
                payments
              </span>
              <span className="font-label-badge text-label-badge text-on-surface font-bold">
                {currencyMode === "USD"
                  ? "USD ($)"
                  : `Bs. (${settings.bcv_exchange_rate})`}
              </span>
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              className="hidden sm:flex items-center gap-1 bg-primary text-on-primary font-label-md text-label-md px-space-md py-1.5 rounded-full shadow-[2px_2px_0px_#2a3235] hover:bg-primary-container transition-all whitespace-nowrap"
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
              className="relative p-2 rounded-full bg-surface-container-lowest text-on-surface shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-high hover:text-on-surface transition-all"
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
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[2px_2px_0px_#2a3235] hover:bg-primary-container transition-colors"
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
