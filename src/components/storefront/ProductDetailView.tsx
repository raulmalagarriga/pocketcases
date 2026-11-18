"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Product, StoreSettings } from "@/types/database";
import { DEFAULT_CARD_MODELS } from "@/lib/seed-data";
import {
  getLocalCachedProducts,
  getLocalCachedSettings,
} from "@/lib/queries/cms";
import { useCartStore } from "@/store/useCartStore";
import { ProductCard } from "./ProductCard";
import { WaitlistModal } from "./WaitlistModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ProductDetailViewProps {
  slug: string;
  initialProduct: Product | null;
  initialRelatedProducts: Product[];
  settings: StoreSettings;
}

const BG_STYLE_MAP: Record<string, string> = {
  "secondary-fixed": "bg-secondary-fixed/50",
  "primary-fixed": "bg-primary-fixed/40",
  "surface-container": "bg-surface-container",
  "primary-fixed-dim": "bg-primary-fixed-dim/40",
  "secondary-container": "bg-secondary-container/40",
  "surface-container-high": "bg-surface-container-high",
};

export function ProductDetailView({
  slug,
  initialProduct,
  initialRelatedProducts,
  settings,
}: ProductDetailViewProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(
    initialRelatedProducts
  );
  const [liveSettings, setLiveSettings] = useState<StoreSettings>(settings);
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem, currencyMode, wishlistIds, toggleWishlist } = useCartStore();

  useEffect(() => {
    const cachedSettings = getLocalCachedSettings();
    if (cachedSettings) {
      setLiveSettings((prev) => ({ ...prev, ...cachedSettings }));
    } else {
      setLiveSettings(settings);
    }

    const cachedProducts = getLocalCachedProducts();
    if (cachedProducts && cachedProducts.length > 0) {
      const localMatch = cachedProducts.find((p) => p.slug === slug);
      if (localMatch) {
        setProduct(localMatch);
      }
      const localRelated = cachedProducts
        .filter((p) => p.is_live && p.slug !== slug)
        .slice(0, 4);
      if (localRelated.length > 0) {
        setRelatedProducts(localRelated);
      }
    }
  }, [slug, settings]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const urls = [
      product.primary_image_url,
      ...(product.gallery_urls || []),
    ].filter(Boolean);
    return Array.from(new Set(urls));
  }, [product]);

  const defaultColor = useMemo(() => {
    if (!product) {
      return {
        id: "default",
        product_id: "",
        name: "Original",
        name_en: "Original",
        hex_code: "#F06292",
        sku_suffix: "-ORG",
        stock_units: 10,
        is_default: true,
        sort_order: 1,
      };
    }
    return (
      product.color_variants.find((c) => c.is_default) ||
      product.color_variants[0] || {
        id: "default",
        product_id: product.id,
        name: "Original",
        name_en: "Original",
        hex_code: "#F06292",
        sku_suffix: "-ORG",
        stock_units: product.total_stock,
        is_default: true,
        sort_order: 1,
      }
    );
  }, [product]);

  const availableModels = useMemo(() => {
    if (!product) return DEFAULT_CARD_MODELS;
    return product.supported_models && product.supported_models.length > 0
      ? product.supported_models
      : DEFAULT_CARD_MODELS;
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>(
    initialProduct?.primary_image_url || ""
  );
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedDevice, setSelectedDevice] = useState<string>(
    availableModels[0]
  );
  const [selectedFinish, setSelectedFinish] = useState<string>(
    initialProduct?.default_finish || "Grip Mate"
  );
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.primary_image_url);
      setSelectedColor(
        product.color_variants.find((c) => c.is_default) ||
          product.color_variants[0] ||
          defaultColor
      );
      const models =
        product.supported_models && product.supported_models.length > 0
          ? product.supported_models
          : DEFAULT_CARD_MODELS;
      setSelectedDevice(models[0]);
      setSelectedFinish(product.default_finish || "Grip Mate");
    }
  }, [product, defaultColor]);

  if (!product) {
    return (
      <section className="max-w-4xl mx-auto px-margin md:px-margin-desktop py-space-2xl text-center">
        <div className="bg-surface-container-lowest p-space-2xl rounded-xl shadow-[4px_4px_0px_#2a3235] space-y-space-md">
          <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary mx-auto flex items-center justify-center shadow-[2px_2px_0px_#2a3235]">
            <span className="material-symbols-outlined text-[32px]">
              search_off
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
            Forro no encontrado
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            El producto que buscas no existe o fue retirado temporalmente de la
            colección.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-space-xl py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-[3px_3px_0px_#2a3235] hover:bg-primary-container hover:text-on-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              <span>Volver al Catálogo Principal</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isOutOfStock =
    product.stock_status === "out_of_stock" || product.total_stock === 0;
  const isLowStock =
    !isOutOfStock &&
    (product.stock_status === "low_stock" ||
      product.show_low_stock_badge ||
      product.total_stock <= 5);

  const isWishlisted = wishlistIds.includes(product.id);
  const imageBgClass =
    BG_STYLE_MAP[product.card_bg_style] || "bg-secondary-fixed/50";

  const discountPercentage =
    product.compare_at_price_usd &&
    product.compare_at_price_usd > product.price_usd
      ? Math.round(
          ((product.compare_at_price_usd - product.price_usd) /
            product.compare_at_price_usd) *
            100
        )
      : null;

  const formatPrice = (usd: number) => {
    if (currencyMode === "VES") {
      return `Bs. ${(usd * liveSettings.bcv_exchange_rate).toFixed(2)}`;
    }
    return `$${usd.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setWaitlistProduct(product);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem(
        {
          productId: product.id,
          sku: `${product.sku}${selectedColor.sku_suffix}`,
          title: product.title,
          priceUsd: product.price_usd,
          imageUrl: selectedImage || product.primary_image_url,
          cardBgStyle: product.card_bg_style,
          deviceModel: selectedDevice,
          finish: selectedFinish,
          colorName: selectedColor.name,
          colorHex: selectedColor.hex_code,
        },
        i === quantity - 1
      );
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const directWhatsappUrl = `https://wa.me/${liveSettings.whatsapp_number.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    [
      "¡Hola Pocket Cases! ✨ Quiero pedir este forro:",
      "",
      `• *Producto:* ${product.title} (SKU: ${product.sku}${selectedColor.sku_suffix})`,
      `• *Modelo:* ${selectedDevice}`,
      `• *Color:* ${selectedColor.name}`,
      `• *Acabado:* ${selectedFinish}`,
      `• *Cantidad:* ${quantity}`,
      `• *Subtotal:* $${(product.price_usd * quantity).toFixed(2)} USD (Ref. Bs. ${(
        product.price_usd *
        quantity *
        liveSettings.bcv_exchange_rate
      ).toFixed(2)})`,
      "",
      "¿Me indican los datos para concretar el pago y envío?",
    ].join("\n")
  )}`;

  const finishesList =
    product.finishes && product.finishes.length > 0
      ? product.finishes
      : ["Grip Mate", "Brillo Jelly"];

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-lg md:py-space-xl">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 font-label-md text-label-md text-on-surface-variant"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/#product-catalog"
            className="hover:text-primary transition-colors"
          >
            Colección
          </Link>
          <span>/</span>
          <span className="text-on-surface-variant">
            {product.category_badge}
          </span>
          <span>/</span>
          <span className="text-primary font-bold">{product.title}</span>
        </nav>

        <Link
          href="/#product-catalog"
          className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed/40 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          <span>Volver al catálogo</span>
        </Link>
      </div>

      {/* 2-Column Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Media Gallery (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-space-md lg:sticky lg:top-24">
          <div
            className={`relative w-full aspect-square rounded-xl ${imageBgClass} p-space-md flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_#2a3235] transition-all`}
            style={{
              boxShadow: `4px 4px 0px #2a3235, inset 0 0 0 3px ${selectedColor.hex_code}85`,
            }}
          >
            <img
              src={selectedImage || product.primary_image_url}
              alt={product.title}
              className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${
                isOutOfStock ? "grayscale-[25%]" : ""
              }`}
            />

            {/* Top Floating Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 bg-surface-container-highest text-outline font-label-badge text-label-badge px-3 py-1 rounded-full shadow-[1px_1px_0px_#2a3235] font-bold">
                    ✕ Agotado
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 bg-[#ffe0b2] text-[#c62828] font-label-badge text-label-badge px-3 py-1 rounded-full shadow-[1px_1px_0px_#c62828] font-bold animate-pulse">
                    ⚠️ ¡Solo quedan {product.total_stock}!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-badge text-label-badge px-3 py-1 rounded-full shadow-[1px_1px_0px_#2a3235] font-bold">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    {product.total_stock <= 25
                      ? `Disponible (quedan ${product.total_stock})`
                      : "Disponible en Stock"}
                  </span>
                )}

                {product.promo_tag &&
                  product.promo_tag !== "UNPUBLISHED" &&
                  product.promo_tag !== "WAITLIST" && (
                    <span className="bg-primary text-on-primary font-label-badge text-label-badge px-2.5 py-1 rounded-full font-extrabold uppercase shadow-[1px_1px_0px_#2a3235]">
                      {product.promo_tag}
                    </span>
                  )}
              </div>

              <button
                type="button"
                aria-label="Guardar en favoritos"
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-[2px_2px_0px_#2a3235] transition-transform hover:scale-105 ${
                  isWishlisted
                    ? "text-primary bg-primary-fixed"
                    : "text-outline hover:text-primary"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{
                    fontVariationSettings: isWishlisted
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Bottom Floating Active Color & Category Pill */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
              <span className="bg-surface-container-lowest/95 backdrop-blur px-3 py-1 rounded-full font-label-badge text-label-badge text-on-surface font-bold inline-flex items-center gap-2 shadow-[2px_2px_0px_#2a3235]">
                <span
                  className="w-3 h-3 rounded-full border border-outline-variant"
                  style={{ backgroundColor: selectedColor.hex_code }}
                />
                <span>Tono: {selectedColor.name}</span>
              </span>

              <span className="bg-surface-container-lowest/95 backdrop-blur px-3 py-1 rounded-full font-label-badge text-label-badge text-on-surface font-bold shadow-[2px_2px_0px_#2a3235]">
                {product.category_badge}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-space-sm">
              {galleryImages.map((imgUrl, index) => {
                const isSelected = imgUrl === selectedImage;
                return (
                  <button
                    key={`${imgUrl}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative aspect-square rounded-lg p-1 overflow-hidden transition-all cursor-pointer ${imageBgClass} ${
                      isSelected
                        ? "ring-2 ring-primary shadow-[3px_3px_0px_#2a3235] -translate-y-0.5"
                        : "opacity-80 hover:opacity-100 shadow-[1px_1px_0px_#2a3235]"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.title} vista ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Configurator & Conversion (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-[4px_4px_0px_#2a3235] flex flex-col gap-space-lg">
          {/* Header Info */}
          <div className="space-y-space-xs border-b border-outline-variant/30 pb-space-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed font-label-badge text-label-badge px-3 py-1 rounded-full font-bold uppercase shadow-[1px_1px_0px_#2a3235]">
                <span className="material-symbols-outlined text-[14px]">
                  verified
                </span>
                {product.category_badge}
              </span>

              <span className="font-label-badge text-label-badge text-outline uppercase tracking-wider font-bold">
                SKU: {product.sku}
                {selectedColor.sku_suffix}
              </span>
            </div>

            <h1 className="font-display-hero-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight pt-1">
              {product.title}
            </h1>
            <p className="font-body-lg text-body-md text-on-surface-variant">
              {product.subtitle}
            </p>

            {/* Rating Pill */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-[#f59e0b]">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                4.9 / 5
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">
                (Calidad verificada • Drop Y2K)
              </span>
            </div>

            {/* Price Block */}
            <div className="pt-space-sm flex flex-wrap items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-black text-primary">
                {formatPrice(product.price_usd)}
              </span>
              {product.compare_at_price_usd && (
                <span className="font-headline-sm text-headline-sm text-outline line-through">
                  {formatPrice(product.compare_at_price_usd)}
                </span>
              )}
              {discountPercentage && (
                <span className="bg-tertiary-fixed text-on-tertiary-container font-label-badge text-label-badge px-2.5 py-0.5 rounded-full font-extrabold shadow-[1px_1px_0px_#2a3235]">
                  AHORRA {discountPercentage}%
                </span>
              )}
            </div>

            {liveSettings.show_ves_reference && (
              <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full font-label-badge text-label-badge text-on-surface-variant shadow-[1px_1px_0px_#2a3235]">
                <span className="material-symbols-outlined text-[14px] text-tertiary">
                  currency_exchange
                </span>
                <span>
                  Ref.{" "}
                  <strong className="text-on-surface">
                    Bs.{" "}
                    {(product.price_usd * liveSettings.bcv_exchange_rate).toFixed(
                      2
                    )}
                  </strong>{" "}
                  a tasa BCV ({liveSettings.bcv_exchange_rate} Bs/$)
                </span>
              </div>
            )}
          </div>

          {/* 1. Selector de Color (Swatches) */}
          {product.color_variants.length > 0 && (
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface uppercase font-extrabold tracking-wide">
                  1. Color:{" "}
                  <span className="text-primary">{selectedColor.name}</span>
                </label>
                <span className="font-label-badge text-label-badge text-on-surface-variant font-bold">
                  {selectedColor.stock_units > 0
                    ? `${selectedColor.stock_units} disponibles en este tono`
                    : "Tono sin stock"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {product.color_variants.map((variant) => {
                  const isSelected = variant.id === selectedColor.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedColor(variant)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary-fixed text-on-primary-fixed font-extrabold ring-2 ring-primary shadow-[2px_2px_0px_#2a3235]"
                          : "bg-surface-container-low text-on-surface hover:bg-surface-container font-medium shadow-[1px_1px_0px_#2a3235]"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-outline-variant shrink-0 shadow-[1px_1px_0px_#2a3235]"
                        style={{ backgroundColor: variant.hex_code }}
                      />
                      <span>{variant.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Selector de Modelo de Teléfono */}
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface uppercase font-extrabold tracking-wide">
                2. Modelo de Teléfono:{" "}
                <span className="text-primary">{selectedDevice}</span>
              </label>
              <span className="font-label-badge text-label-badge text-tertiary font-bold">
                Ajuste milimétrico
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
              {availableModels.map((model) => {
                const isSelected = model === selectedDevice;
                return (
                  <button
                    key={model}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedDevice(model)}
                    className={`px-3 py-2 rounded-lg font-label-md text-xs text-left truncate transition-all cursor-pointer ${
                      isSelected
                        ? "bg-inverse-surface text-inverse-on-surface font-bold shadow-[2px_2px_0px_#ab2c5d]"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container shadow-[1px_1px_0px_#2a3235]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {model}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Selector de Acabado */}
          <div className="space-y-space-xs">
            <label className="font-label-md text-label-md text-on-surface uppercase font-extrabold tracking-wide block">
              3. Textura y Acabado:{" "}
              <span className="text-primary">{selectedFinish}</span>
            </label>
            <div className="grid grid-cols-2 gap-space-sm pt-1">
              {finishesList.map((finish) => {
                const isSelected = finish === selectedFinish;
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`py-2.5 px-4 rounded-xl font-label-lg text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary-container text-on-primary-container font-extrabold shadow-[2px_2px_0px_#2a3235]"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-bold shadow-[1px_1px_0px_#2a3235]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {finish.toLowerCase().includes("mate")
                        ? "pan_tool"
                        : "auto_awesome"}
                    </span>
                    <span>{finish}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Cantidad + Botones de Compra */}
          <div className="pt-space-xs space-y-space-sm">
            {!isOutOfStock ? (
              <>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between bg-surface-container-low rounded-full px-3 py-2 shadow-[2px_2px_0px_#2a3235] sm:w-36">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface font-bold flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      −
                    </button>
                    <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface px-3">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(Math.max(1, product.total_stock), q + 1)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface font-bold flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-space-lg rounded-full font-label-lg text-label-lg font-extrabold shadow-[3px_3px_0px_#2a3235] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      justAdded
                        ? "bg-tertiary-fixed text-on-tertiary-fixed"
                        : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {justAdded ? "check_circle" : "shopping_bag"}
                    </span>
                    <span>
                      {justAdded
                        ? "¡Agregado a tu Carrito!"
                        : `Agregar a la Bolsa • ${formatPrice(
                            product.price_usd * quantity
                          )}`}
                    </span>
                  </button>
                </div>

                {/* Direct WhatsApp Buy Button */}
                {product.allow_whatsapp_checkout !== false && (
                  <a
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-space-md rounded-full bg-[#25D366] text-white font-label-lg text-label-md font-bold flex items-center justify-center gap-2 shadow-[3px_3px_0px_#07521d] hover:bg-[#20ba5a] transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chat
                    </span>
                    <span>
                      ⚡ Pedir este forro directo por WhatsApp ({selectedDevice})
                    </span>
                  </a>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setWaitlistProduct(product)}
                className="w-full py-3.5 px-space-lg rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-extrabold shadow-[3px_3px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications_active
                </span>
                <span>Avisarme por WhatsApp cuando vuelva</span>
              </button>
            )}
          </div>

          {/* 3 Spec & Guarantee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-sm border-t border-outline-variant/30">
            <div className="p-3 rounded-lg bg-surface-container-low shadow-[1px_1px_0px_#2a3235] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                shield
              </span>
              <div>
                <p className="font-label-md text-xs font-extrabold text-on-surface">
                  Protección Militar 3m
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Bordes elevados para cámaras y pantalla
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low shadow-[1px_1px_0px_#2a3235] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0">
                bolt
              </span>
              <div>
                <p className="font-label-md text-xs font-extrabold text-on-surface">
                  MagSafe Qi2 Ready
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Imanes N52 de agarre ultra firme
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low shadow-[1px_1px_0px_#2a3235] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                local_shipping
              </span>
              <div>
                <p className="font-label-md text-xs font-extrabold text-on-surface">
                  Envíos a toda VE
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Delivery Caracas y MRW / Zoom nacional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-space-2xl pt-space-xl border-t border-outline-variant/30">
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-lg">
              <div>
                <span className="inline-block bg-secondary-fixed text-on-secondary-fixed font-label-badge text-label-badge px-3 py-1 rounded-full font-bold uppercase shadow-[1px_1px_0px_#2a3235] mb-2">
                  COMBINA TU ESTILO
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                  Completa tu Colección Y2K
                </h2>
              </div>
              <Link
                href="/#product-catalog"
                className="font-label-lg text-label-md text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>Ver todo el catálogo</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {relatedProducts.map((relProduct, idx) => (
              <ScrollReveal
                key={relProduct.id}
                direction="up"
                delayMs={idx * 70}
              >
                <ProductCard
                  product={relProduct}
                  settings={liveSettings}
                  onJoinWaitlist={(p) => setWaitlistProduct(p)}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {waitlistProduct && (
        <WaitlistModal
          product={waitlistProduct}
          onClose={() => setWaitlistProduct(null)}
        />
      )}
    </div>
  );
}
