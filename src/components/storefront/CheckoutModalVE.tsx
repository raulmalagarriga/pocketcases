"use client";

import React, { useState } from "react";
import { StoreSettings } from "@/types/database";
import { useCartStore } from "@/store/useCartStore";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { buildWhatsAppCheckoutUrl } from "@/lib/whatsapp";

interface CheckoutModalVEProps {
  settings: StoreSettings;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  onClose: () => void;
}

export function CheckoutModalVE({
  settings,
  subtotalUsd,
  shippingUsd,
  totalUsd,
  onClose,
}: CheckoutModalVEProps) {
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<
    "pago_movil" | "zelle" | "card"
  >("pago_movil");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Caracas");
  const [paymentRef, setPaymentRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrderNum, setSubmittedOrderNum] = useState<string | null>(
    null
  );

  const totalVes = (totalUsd * settings.bcv_exchange_rate).toFixed(2);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setSubmitting(true);
    let generatedRef = `PKT-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("orders")
          .insert({
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim(),
            customer_city: customerCity,
            payment_method: paymentMethod,
            payment_reference: paymentRef.trim() || null,
            items: items,
            subtotal_usd: subtotalUsd,
            shipping_usd: shippingUsd,
            total_usd: totalUsd,
            exchange_rate_bcv: settings.bcv_exchange_rate,
            status: "pending",
          })
          .select("order_number")
          .maybeSingle();

        if (data?.order_number) {
          generatedRef = `PKT-${data.order_number}`;
        }
      } catch {
        // Fallback to local order ref if Supabase table is not migrated yet
      }
    }

    setSubmitting(false);
    setSubmittedOrderNum(generatedRef);

    const waUrl = buildWhatsAppCheckoutUrl(items, settings, generatedRef);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-lg p-space-lg shadow-[4px_4px_0px_#2a3235] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              verified_user
            </span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Pasarela Segura Venezuela
              </h3>
              <p className="font-label-badge text-label-badge text-outline uppercase">
                Pago Móvil BCV • Zelle • Tarjeta Internacional
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center shadow-[1px_1px_0px_#2a3235]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submittedOrderNum ? (
          <div className="py-space-xl text-center space-y-space-md">
            <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-container mx-auto flex items-center justify-center shadow-[2px_2px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[32px]">
                check_circle
              </span>
            </div>
            <h4 className="font-headline-md text-headline-md text-on-surface font-extrabold">
              ¡Pedido #{submittedOrderNum} Registrado!
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
              Hemos abierto WhatsApp con el resumen de tu orden para validar tu
              comprobante y despachar tu pedido hoy mismo.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-space-xl py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-[2px_2px_0px_#2a3235]"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmOrder} className="space-y-space-md pt-space-md">
            {/* Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("pago_movil")}
                className={`py-2.5 px-2 rounded-DEFAULT font-label-md text-label-md flex flex-col items-center gap-1 shadow-[2px_2px_0px_#2a3235] transition-all ${
                  paymentMethod === "pago_movil"
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "bg-surface-container-low text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  smartphone
                </span>
                <span>Pago Móvil</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("zelle")}
                className={`py-2.5 px-2 rounded-DEFAULT font-label-md text-label-md flex flex-col items-center gap-1 shadow-[2px_2px_0px_#2a3235] transition-all ${
                  paymentMethod === "zelle"
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "bg-surface-container-low text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  currency_exchange
                </span>
                <span>Zelle ($)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2.5 px-2 rounded-DEFAULT font-label-md text-label-md flex flex-col items-center gap-1 shadow-[2px_2px_0px_#2a3235] transition-all ${
                  paymentMethod === "card"
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "bg-surface-container-low text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  credit_card
                </span>
                <span>Tarjeta / Apple</span>
              </button>
            </div>

            {/* Payment Details Box */}
            {paymentMethod === "pago_movil" && (
              <div className="bg-secondary-fixed/50 p-space-md rounded-DEFAULT shadow-[2px_2px_0px_#2a3235] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-badge text-label-badge uppercase text-on-secondary-fixed font-bold">
                    Datos Pago Móvil (Tasa BCV: Bs. {settings.bcv_exchange_rate})
                  </span>
                  <span className="font-label-md text-label-md text-tertiary font-extrabold">
                    Monto: Bs. {totalVes}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong>Banco:</strong> {settings.pago_movil_details.bank} •{" "}
                  <strong>Tel:</strong> {settings.pago_movil_details.phone} •{" "}
                  <strong>RIF:</strong> {settings.pago_movil_details.rif}
                </p>
              </div>
            )}

            {paymentMethod === "zelle" && (
              <div className="bg-primary-fixed/50 p-space-md rounded-DEFAULT shadow-[2px_2px_0px_#2a3235] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-badge text-label-badge uppercase text-on-primary-fixed font-bold">
                    Datos Zelle Directo
                  </span>
                  <span className="font-label-md text-label-md text-primary font-extrabold">
                    Monto: ${totalUsd.toFixed(2)} USD
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong>Correo:</strong> {settings.zelle_details.email} •{" "}
                  <strong>Titular:</strong> {settings.zelle_details.holder}
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="bg-surface-container p-space-md rounded-DEFAULT shadow-[2px_2px_0px_#2a3235] space-y-1">
                <span className="font-label-badge text-label-badge uppercase text-on-surface font-bold">
                  Link de Pago Internacional (Visa / Mastercard / Apple Pay)
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Al confirmar, recibirás el enlace directo por WhatsApp por{" "}
                  <strong>${totalUsd.toFixed(2)} USD</strong>.
                </p>
              </div>
            )}

            {/* Customer Shipping Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="font-label-badge text-label-badge uppercase text-on-surface-variant block mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Valentina Gómez"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-label-badge text-label-badge uppercase text-on-surface-variant block mb-1">
                  WhatsApp *
                </label>
                <input
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej. 0412-1234567"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="font-label-badge text-label-badge uppercase text-on-surface-variant block mb-1">
                  Ciudad / Destino (Venezuela)
                </label>
                <select
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
                >
                  <option value="Caracas (Delivery Express)">
                    Caracas (Delivery Express)
                  </option>
                  <option value="Lechería / Puerto La Cruz (MRW/Zoom)">
                    Lechería / Puerto La Cruz (MRW/Zoom)
                  </option>
                  <option value="Maracaibo (MRW/Zoom)">
                    Maracaibo (MRW/Zoom)
                  </option>
                  <option value="Valencia (MRW/Zoom)">
                    Valencia (MRW/Zoom)
                  </option>
                  <option value="Barquisimeto (MRW/Zoom)">
                    Barquisimeto (MRW/Zoom)
                  </option>
                  <option value="Margarita / Otra Ciudad">
                    Margarita / Otra Ciudad
                  </option>
                </select>
              </div>
              <div>
                <label className="font-label-badge text-label-badge uppercase text-on-surface-variant block mb-1">
                  Referencia de Pago (Últimos 4 dígitos)
                </label>
                <input
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Opcional: Ej. 8492"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-[3px_3px_0px_#2a3235] hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                check_circle
              </span>
              <span>
                {submitting
                  ? "Procesando pedido..."
                  : `Confirmar Orden (${
                      paymentMethod === "pago_movil"
                        ? `Bs. ${totalVes}`
                        : `$${totalUsd.toFixed(2)}`
                    })`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
