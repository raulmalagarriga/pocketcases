"use client";

import React, { useState } from "react";
import { Product, StoreSettings } from "@/types/database";
import { DEFAULT_CARD_MODELS } from "@/lib/seed-data";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onJoinWaitlist: (product: Product) => void;
}

const BG_STYLE_MAP: Record<string, string> = {
  "secondary-fixed": "bg-secondary-fixed/50",
  "primary-fixed": "bg-primary-fixed/40",
  "surface-container": "bg-surface-container",
  "primary-fixed-dim": "bg-primary-fixed-dim/40",
  "secondary-container": "bg-secondary-container/40",
  "surface-container-high": "bg-surface-container-high",
};

export function ProductCard({
  product,
  settings,
  onJoinWaitlist,
}: ProductCardProps) {
  const { addItem, currencyMode, wishlistIds, toggleWishlist } = useCartStore();
  const isOutOfStock =
    product.stock_status === "out_of_stock" || product.total_stock === 0;
  const isLowStock =
    !isOutOfStock &&
    (product.stock_status === "low_stock" ||
      product.show_low_stock_badge ||
      product.total_stock <= 5);

  const defaultColor =
    product.color_variants.find((c) => c.is_default) ||
    product.color_variants[0] || {
      id: "default",
      name: "Original",
      hex_code: "#F06292",
      sku_suffix: "-ORG",
    };

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedDevice, setSelectedDevice] = useState(DEFAULT_CARD_MODELS[0]);
  const [selectedFinish, setSelectedFinish] = useState(
    product.default_finish || "Grip Mate"
  );
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const imageBgClass =
    BG_STYLE_MAP[product.card_bg_style] || "bg-secondary-fixed/50";

  const formatPrice = (usd: number) => {
    if (currencyMode === "VES") {
      return `Bs. ${(usd * settings.bcv_exchange_rate).toFixed(2)}`;
    }
    return `$${usd.toFixed(2)}`;
  };

  const handleQuickAdd = () => {
    if (isOutOfStock) {
      onJoinWaitlist(product);
      return;
    }

    addItem(
      {
        productId: product.id,
        sku: `${product.sku}${selectedColor.sku_suffix}`,
        title: product.title,
        priceUsd: product.price_usd,
        imageUrl: product.primary_image_url,
        cardBgStyle: product.card_bg_style,
        deviceModel: selectedDevice,
        finish: selectedFinish,
        colorName: selectedColor.name,
        colorHex: selectedColor.hex_code,
      },
      true
    );

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  if (isOutOfStock) {
    const isWaitlistList =
      product.restock_badge_text?.toLowerCase().includes("lista") ||
      product.slug.includes("vanilla");

    return (
      <div className="product-card group relative bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between opacity-85 shadow-[2px_2px_0px_#8a7176]">
        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <span className="inline-flex items-center gap-1 bg-surface-container-highest text-outline font-label-badge text-label-badge px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#8a7176]">
              ✕ Agotado
            </span>
            <button
              aria-label="Guardar en favoritos"
              onClick={() => toggleWishlist(product.id)}
              type="button"
              className={`wishlist-btn w-8 h-8 rounded-full bg-surface-container flex items-center justify-center transition-colors shadow-[1px_1px_0px_#2a3235] ${
                isWishlisted
                  ? "text-primary bg-primary-fixed"
                  : "text-outline hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
            </button>
          </div>

          <div
            className={`relative w-full aspect-square rounded-DEFAULT ${imageBgClass} p-space-sm flex items-center justify-center overflow-hidden mb-space-sm grayscale-[30%]`}
          >
            <img
              alt={product.title}
              className="w-full h-full object-cover rounded-DEFAULT"
              src={product.primary_image_url}
            />
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-inverse-surface text-inverse-on-surface font-label-badge text-label-badge px-3 py-1 rounded-full shadow-[1px_1px_0px_#2a3235] uppercase font-bold">
                {product.restock_badge_text || "Vuelve en 3 días"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
              {product.title}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {product.subtitle}
            </p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-headline-sm text-headline-sm text-on-surface-variant font-bold">
                {formatPrice(product.price_usd)}
              </span>
            </div>
          </div>

          <div className="mt-space-sm space-y-2">
            {product.color_variants.length >= 3 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-label-badge text-label-badge text-on-surface-variant uppercase font-bold tracking-wide">
                    Color:{" "}
                    <span className="text-primary font-bold">
                      {selectedColor.name}
                    </span>
                  </span>
                  <span className="font-label-badge text-label-badge text-outline">
                    {product.color_variants.length} tonos
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  {product.color_variants.map((variant) => {
                    const isSelected = variant.id === selectedColor.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedColor(variant)}
                        title={`${variant.name} (${variant.hex_code})`}
                        style={{ backgroundColor: variant.hex_code }}
                        className={
                          isSelected
                            ? "w-6 h-6 rounded-full shadow-[1px_1px_0px_#2a3235] ring-2 ring-primary ring-offset-1 transition-transform hover:scale-105"
                            : "w-5 h-5 rounded-full shadow-[1px_1px_0px_#2a3235] opacity-80 hover:opacity-100 transition-transform hover:scale-105 border border-outline-variant"
                        }
                      />
                    );
                  })}
                </div>
              </>
            )}

            <select
              className="w-full bg-surface-container text-outline font-body-sm text-body-sm py-1.5 px-space-sm rounded-DEFAULT border-0 cursor-not-allowed"
              disabled
            >
              <option>
                {product.restock_select_text || "Todos los modelos reservados"}
              </option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onJoinWaitlist(product)}
          className="mt-space-md w-full py-2.5 bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-full shadow-[2px_2px_0px_#2a3235] hover:bg-secondary-container transition-all flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isWaitlistList ? "list_alt" : "notifications_active"}
          </span>
          <span>
            {isWaitlistList
              ? "Unirme a la lista de espera"
              : "Avisarme cuando vuelva"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="product-card group relative bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-[3px_3px_0px_#2a3235] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_#ab2c5d]">
      <div>
        {/* Badge Header */}
        <div className="flex items-center justify-between mb-space-sm">
          {isLowStock ? (
            <span className="inline-flex items-center gap-1 bg-[#ffe0b2] text-[#c62828] font-label-badge text-label-badge px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#c62828] animate-pulse">
              ⚠️ ¡Solo quedan {product.total_stock}!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-badge text-label-badge px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#4e6952]">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>{" "}
              {product.total_stock <= 25
                ? `Disponible (quedan ${product.total_stock})`
                : "Disponible"}
            </span>
          )}

          <button
            aria-label="Guardar en favoritos"
            onClick={() => toggleWishlist(product.id)}
            type="button"
            className={`wishlist-btn w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:text-primary hover:bg-primary-fixed transition-colors shadow-[1px_1px_0px_#2a3235] ${
              isWishlisted ? "text-primary bg-primary-fixed" : "text-outline"
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{
                fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Image Container with Pastel Background */}
        <div
          className={`relative w-full aspect-square rounded-DEFAULT ${imageBgClass} p-space-sm flex items-center justify-center overflow-hidden mb-space-sm`}
        >
          <img
            alt={product.title}
            className="w-full h-full object-cover rounded-DEFAULT transition-transform duration-300 group-hover:scale-105"
            src={product.primary_image_url}
          />
          <span className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur font-label-badge text-label-badge px-2 py-0.5 rounded-full text-on-surface font-bold">
            {product.category_badge}
          </span>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
            {product.title}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {product.subtitle}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-headline-sm text-headline-sm text-primary font-black">
              {formatPrice(product.price_usd)}
            </span>
            {product.compare_at_price_usd && (
              <span className="font-body-sm text-body-sm text-outline line-through">
                {formatPrice(product.compare_at_price_usd)}
              </span>
            )}
          </div>
        </div>

        {/* Device, Color & Finish Selectors */}
        <div className="mt-space-sm space-y-2">
          {product.color_variants.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-label-badge text-label-badge text-on-surface-variant uppercase font-bold tracking-wide">
                  Color:{" "}
                  <span className="text-primary font-bold">
                    {selectedColor.name}
                  </span>
                </span>
                <span className="font-label-badge text-label-badge text-outline">
                  {product.color_variants.length} tonos
                </span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                {product.color_variants.map((variant) => {
                  const isSelected = variant.id === selectedColor.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedColor(variant)}
                      title={`${variant.name} (${variant.hex_code})`}
                      style={{ backgroundColor: variant.hex_code }}
                      className={
                        isSelected
                          ? "w-6 h-6 rounded-full shadow-[1px_1px_0px_#2a3235] ring-2 ring-primary ring-offset-1 transition-transform hover:scale-105"
                          : "w-5 h-5 rounded-full shadow-[1px_1px_0px_#2a3235] opacity-80 hover:opacity-100 transition-transform hover:scale-105 border border-outline-variant"
                      }
                    />
                  );
                })}
              </div>
            </>
          )}

          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="device-select w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm py-1.5 px-space-sm rounded-DEFAULT border-0 focus:ring-1 focus:ring-primary shadow-[1px_1px_0px_#2a3235] cursor-pointer"
          >
            {DEFAULT_CARD_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            {(product.finishes.length > 0
              ? product.finishes
              : ["Grip Mate", "Brillo Jelly"]
            ).map((finish) => {
              const isSelectedFinish = finish === selectedFinish;
              return (
                <button
                  key={finish}
                  type="button"
                  onClick={() => setSelectedFinish(finish)}
                  className={
                    isSelectedFinish
                      ? "finish-btn flex-1 py-1 rounded-full font-label-badge text-label-badge bg-primary-container text-on-primary-container font-bold shadow-[1px_1px_0px_#2a3235]"
                      : "finish-btn flex-1 py-1 rounded-full font-label-badge text-label-badge bg-surface-container text-on-surface-variant font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high"
                  }
                >
                  {finish}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleQuickAdd}
        className={
          justAdded
            ? "add-to-cart-btn mt-space-md w-full py-2.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md rounded-full shadow-[2px_2px_0px_#2a3235] transition-all flex items-center justify-center gap-1.5"
            : "add-to-cart-btn mt-space-md w-full py-2.5 bg-primary-container text-on-primary-container font-label-md text-label-md rounded-full shadow-[2px_2px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-1.5"
        }
      >
        <span className="material-symbols-outlined text-[18px]">
          {justAdded ? "check_circle" : "add_shopping_cart"}
        </span>
        <span>
          {justAdded
            ? "¡Agregado al Carrito!"
            : `Agregar rápido • ${formatPrice(product.price_usd)}`}
        </span>
      </button>
    </div>
  );
}
