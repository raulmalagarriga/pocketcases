"use client";

import React, { useEffect, useState } from "react";
import { StoreSettings } from "@/types/database";
import { saveStoreSettingsToSupabase } from "@/lib/queries/cms";

interface StoreSettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (nextSettings: StoreSettings) => void;
  onShowToast: (msg: string) => void;
}

export function StoreSettingsView({
  settings,
  onUpdateSettings,
  onShowToast,
}: StoreSettingsViewProps) {
  const [formState, setFormState] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await saveStoreSettingsToSupabase(formState);
    onUpdateSettings(saved);
    setSaving(false);
    onShowToast(
      `Configuración de tienda y Tasa BCV (Bs. ${saved.bcv_exchange_rate.toFixed(
        2
      )}) guardada en Supabase`
    );
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-space-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <nav className="flex items-center gap-2 font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[12px] text-outline">
              chevron_right
            </span>
            <span className="text-primary font-bold">Store Settings</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Venezuela Payments, BCV Exchange Rate &amp; Storefront Config
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-space-lg py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>
            {saving ? "Guardando en Supabase..." : "Save Store Settings"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Card 1: Moneda y Tasa BCV (Venezuela) */}
        <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/30">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                currency_exchange
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Moneda y Tasa BCV (Venezuela)
              </h2>
              <p className="font-label-badge text-[11px] text-on-surface-variant">
                Calcula automáticamente el monto en Bolívares en el carrito y
                catálogo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Tasa Oficial BCV (Bs. / $1 USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={formState.bcv_exchange_rate}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    bcv_exchange_rate: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-headline-sm text-body-md text-on-surface font-extrabold shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="p-3 rounded-lg bg-secondary-container/40 shadow-[1px_1px_0px_#2a3235]">
                <span className="font-label-badge text-[10px] text-on-surface-variant uppercase block">
                  Ejemplo Case $28.00 USD:
                </span>
                <span className="font-headline-sm text-body-md text-tertiary font-extrabold">
                  Bs. {(28 * (formState.bcv_exchange_rate || 45.8)).toFixed(2)}{" "}
                  BCV
                </span>
              </div>
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer shadow-[1px_1px_0px_#2a3235]">
            <div>
              <span className="font-label-md text-label-md text-on-surface font-bold block">
                Mostrar referencia en Bolívares BCV en el Storefront
              </span>
              <span className="font-label-badge text-[11px] text-on-surface-variant">
                Muestra el equivalente en Bs. junto al precio en USD en el
                drawer de carrito
              </span>
            </div>
            <input
              type="checkbox"
              checked={formState.show_ves_reference}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  show_ves_reference: e.target.checked,
                })
              }
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Card 2: General & WhatsApp Concierge */}
        <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/30">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                chat
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                General &amp; WhatsApp Checkout
              </h2>
              <p className="font-label-badge text-[11px] text-on-surface-variant">
                Identidad de la marca y número oficial para recibir pedidos
              </p>
            </div>
          </div>

          <div>
            <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
              Nombre de la Tienda (Store Name)
            </label>
            <input
              type="text"
              value={formState.store_name}
              onChange={(e) =>
                setFormState({ ...formState, store_name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
              Número Oficial de WhatsApp (Formato Internacional sin +)
            </label>
            <input
              type="text"
              value={formState.whatsapp_number}
              onChange={(e) =>
                setFormState({ ...formState, whatsapp_number: e.target.value })
              }
              placeholder="584120000000"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Card 3: Datos de Pago Móvil */}
        <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/30">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                account_balance
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Datos de Pago Móvil Interbancario
              </h2>
              <p className="font-label-badge text-[11px] text-on-surface-variant">
                Credenciales bancarias para cobros en Bolívares
              </p>
            </div>
          </div>

          <div>
            <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
              Banco Receptor (Código)
            </label>
            <input
              type="text"
              value={formState.pago_movil_details.bank}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  pago_movil_details: {
                    ...formState.pago_movil_details,
                    bank: e.target.value,
                  },
                })
              }
              placeholder="Banesco (0134)"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Teléfono afiliado
              </label>
              <input
                type="text"
                value={formState.pago_movil_details.phone}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    pago_movil_details: {
                      ...formState.pago_movil_details,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="0412-0000000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                RIF / Cédula
              </label>
              <input
                type="text"
                value={formState.pago_movil_details.rif}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    pago_movil_details: {
                      ...formState.pago_movil_details,
                      rif: e.target.value,
                    },
                  })
                }
                placeholder="J-50123456-0"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Datos de Zelle & Envíos Nacionales */}
        <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/30">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                local_shipping
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Cuenta Zelle &amp; Envíos Nacionales (MRW / Zoom)
              </h2>
              <p className="font-label-badge text-[11px] text-on-surface-variant">
                Pagos en divisas y reglas de envío gratis en toda Venezuela
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Correo Zelle
              </label>
              <input
                type="email"
                value={formState.zelle_details.email}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    zelle_details: {
                      ...formState.zelle_details,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="pagos@pocketcases.co"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Titular Zelle
              </label>
              <input
                type="text"
                value={formState.zelle_details.holder}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    zelle_details: {
                      ...formState.zelle_details,
                      holder: e.target.value,
                    },
                  })
                }
                placeholder="Pocket Cases Inc."
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-1">
            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Meta de Envío Gratis ($ USD)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formState.free_shipping_threshold_usd}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    free_shipping_threshold_usd: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-headline-sm text-body-md text-on-surface font-extrabold shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Tarifa Plana Envío MRW/Zoom ($ USD)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formState.shipping_flat_rate_usd}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    shipping_flat_rate_usd: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-headline-sm text-body-md text-on-surface font-extrabold shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
