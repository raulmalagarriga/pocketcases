"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { StoreSettings } from "@/types/database";
import { buildWhatsAppCheckoutUrl } from "@/lib/whatsapp";
import { CheckoutModalVE } from "./CheckoutModalVE";

interface CartDrawerProps {
  settings: StoreSettings;
}

const THUMB_BG_MAP: Record<string, string> = {
  "secondary-fixed": "bg-secondary-fixed/50",
  "primary-fixed": "bg-primary-fixed/50",
  "surface-container": "bg-surface-container",
  "primary-fixed-dim": "bg-primary-fixed-dim/50",
  "secondary-container": "bg-secondary-container/50",
  "surface-container-high": "bg-surface-container-high",
};

export function CartDrawer({ settings }: CartDrawerProps) {
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
    currencyMode,
  } = useCartStore();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUsd = items.reduce(
    (sum, item) => sum + item.priceUsd * item.quantity,
    0
  );

  const threshold = settings.free_shipping_threshold_usd || 35.0;
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalUsd / threshold) * 100)
  );
  const isFreeShippingUnlocked = subtotalUsd >= threshold;
  const remainingForFreeShipping = Math.max(0, threshold - subtotalUsd);
  const shippingUsd =
    items.length === 0
      ? 0
      : isFreeShippingUnlocked
      ? 0
      : settings.shipping_flat_rate_usd;
  const totalUsd = subtotalUsd + shippingUsd;
  const totalVes = totalUsd * settings.bcv_exchange_rate;

  const whatsappCheckoutUrl = buildWhatsAppCheckoutUrl(items, settings);

  const formatPrice = (usd: number) => {
    if (currencyMode === "VES") {
      return `Bs. ${(usd * settings.bcv_exchange_rate).toFixed(2)}`;
    }
    return `$${usd.toFixed(2)}`;
  };

  return (
    <>
      {/* INTERACTIVE CART DRAWER (Persistent / Toggleable Canvas Component) */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest z-50 shadow-[-8px_0px_32px_rgba(42,50,53,0.18)] flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="cartDrawer"
      >
        {/* Header of Drawer */}
        <div className="p-space-lg bg-surface-container-low shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[20px]">
                shopping_bag
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Tu Carrito
              </h3>
              <p className="font-label-badge text-label-badge text-primary font-bold uppercase tracking-wider">
                {totalCount}{" "}
                {totalCount === 1
                  ? "producto seleccionado"
                  : "productos seleccionados"}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            type="button"
            aria-label="Cerrar carrito"
            className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[2px_2px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-all"
            id="closeCartBtn"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Free Shipping Progress Tracker Meter */}
        <div className="bg-secondary-fixed/60 px-space-lg py-space-sm">
          <div className="flex items-center justify-between text-on-secondary-fixed font-label-md text-label-md mb-1.5">
            <span className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                {isFreeShippingUnlocked ? "celebration" : "local_shipping"}
              </span>{" "}
              {isFreeShippingUnlocked
                ? "¡Desbloqueaste envío GRATIS a nivel nacional!"
                : `¡Agrega $${remainingForFreeShipping.toFixed(
                    2
                  )} más para envío GRATIS!`}
            </span>
            <span className="font-bold text-tertiary font-label-badge text-label-badge uppercase">
              {freeShippingProgress}% Desbloqueado
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-surface-container-lowest overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <div
              className="h-full bg-tertiary rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto p-space-lg space-y-space-md"
          id="cartItemsList"
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-space-xl">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-[2px_2px_0px_#2a3235] mb-space-md">
                <span className="material-symbols-outlined text-[28px]">
                  shopping_bag
                </span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Tu bolsa está vacía
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-xs">
                Explora nuestra colección Y2K y agrega tu funda favorita para
                desbloquear tu charm gratis.
              </p>
            </div>
          ) : (
            <>
              {items.map((item) => {
                const thumbBg =
                  THUMB_BG_MAP[item.cardBgStyle] || "bg-secondary-fixed/50";
                return (
                  <div
                    key={item.id}
                    className="cart-item bg-surface-container-low p-space-sm rounded-DEFAULT flex items-center gap-space-md shadow-[2px_2px_0px_#2a3235]"
                  >
                    <div
                      className={`w-16 h-16 rounded-DEFAULT ${thumbBg} p-1 flex-shrink-0 flex items-center justify-center`}
                    >
                      <img
                        alt={item.title}
                        className="w-full h-full object-cover rounded-DEFAULT"
                        src={item.imageUrl}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                          {item.title}
                        </h4>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold flex-shrink-0">
                          {formatPrice(item.priceUsd * item.quantity)}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {item.deviceModel} • {item.finish}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-surface-container-lowest rounded-full shadow-[1px_1px_0px_#2a3235] px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-on-surface-variant hover:text-primary font-bold px-1.5 text-label-sm"
                          >
                            −
                          </button>
                          <span className="font-label-md text-label-md px-2 font-bold text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-on-surface-variant hover:text-primary font-bold px-1.5 text-label-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Eliminar producto"
                          className="text-outline hover:text-error text-body-sm flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Free Gift Add-on Teaser */}
              <div className="p-space-sm rounded-DEFAULT bg-tertiary-fixed/30 border-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">
                    redeem
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-medium">
                    ¡Charm de regalo incluido!
                  </span>
                </div>
                <span className="font-label-badge text-label-badge text-tertiary font-bold bg-surface-container-lowest px-2 py-0.5 rounded-full">
                  $0.00
                </span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Checkout Actions */}
        <div className="p-space-lg bg-surface-container-lowest shadow-[0_-4px_16px_rgba(0,0,0,0.06)] space-y-space-sm">
          {/* Price Breakdown */}
          <div className="space-y-1 pb-space-xs">
            <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
              <span>Subtotal</span>
              <span
                className="font-bold text-on-surface"
                id="cartSubtotalText"
              >
                ${subtotalUsd.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
              <span>Envío nacional</span>
              <span className="font-bold text-tertiary uppercase">
                {items.length === 0
                  ? "$0.00"
                  : isFreeShippingUnlocked
                  ? "GRATIS"
                  : `$${shippingUsd.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-headline-sm text-headline-sm text-on-surface font-extrabold pt-1">
              <span>Total (USD)</span>
              <div className="text-right">
                <span className="text-primary" id="cartTotalText">
                  ${totalUsd.toFixed(2)}
                </span>
                {settings.show_ves_reference && (
                  <p className="font-label-badge text-label-badge text-outline font-bold">
                    Ref. Bs. {totalVes.toFixed(2)} (Tasa BCV{" "}
                    {settings.bcv_exchange_rate})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Primary High-Converting Direct WhatsApp Checkout Button */}
          <a
            className="w-full py-3.5 px-space-md rounded-full bg-[#25D366] text-white font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[3px_3px_0px_#07521d] hover:bg-[#20ba5a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            href={whatsappCheckoutUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[22px]">chat</span>
            <span className="font-bold">⚡ Pagar directo por WhatsApp</span>
          </a>

          {/* Secondary Standard Checkout Button */}
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-3 px-space-md rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-highest disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              credit_card
            </span>
            <span>Pagar con tarjeta o Pago Móvil / Zelle</span>
          </button>

          {/* Reassurance Guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-center text-outline font-body-sm text-body-sm pt-1">
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              support_agent
            </span>
            <span>
              Confirmación inmediata por WhatsApp y atención personalizada
            </span>
          </div>
        </div>
      </aside>

      {/* Sticky Bottom Quick Cart Reopen Trigger (Shown when drawer is minimized) */}
      <button
        type="button"
        onClick={openCart}
        className={`${
          isOpen ? "hidden" : "flex"
        } fixed bottom-6 right-6 z-40 bg-primary-container text-on-primary-container font-label-lg text-label-lg px-space-lg py-3 rounded-full shadow-[4px_4px_0px_#2a3235] hover:scale-105 transition-transform items-center gap-2`}
        id="floatingCartPill"
      >
        <span className="material-symbols-outlined text-[20px]">
          shopping_bag
        </span>
        <span>
          Ver Carrito ({totalCount}) • ${totalUsd.toFixed(2)}
        </span>
      </button>

      {/* Venezuela Payment Modal (Pago Móvil / Zelle / Tarjeta) */}
      {showCheckoutModal && (
        <CheckoutModalVE
          settings={settings}
          subtotalUsd={subtotalUsd}
          shippingUsd={shippingUsd}
          totalUsd={totalUsd}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </>
  );
}
