"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HeroBannerConfig,
  HeroShowcaseCard,
  Product,
  StoreSettings,
} from "@/types/database";
import { DEFAULT_HERO_CONFIG, normalizeStoreSettings } from "@/lib/seed-data";
import {
  saveStoreSettingsToSupabase,
  uploadProductImage,
} from "@/lib/queries/cms";

interface StoreSettingsViewProps {
  settings: StoreSettings;
  products?: Product[];
  onUpdateSettings: (nextSettings: StoreSettings) => void;
  onShowToast: (msg: string) => void;
}

export function StoreSettingsView({
  settings,
  products = [],
  onUpdateSettings,
  onShowToast,
}: StoreSettingsViewProps) {
  const [formState, setFormState] = useState<StoreSettings>(() =>
    normalizeStoreSettings(settings)
  );
  const [activeTab, setActiveTab] = useState<"brand_payments" | "hero_banner">(
    "brand_payments"
  );
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCard1, setUploadingCard1] = useState(false);
  const [uploadingCard2, setUploadingCard2] = useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const card1InputRef = useRef<HTMLInputElement | null>(null);
  const card2InputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormState(normalizeStoreSettings(settings));
  }, [settings]);

  const hero = formState.hero_config || DEFAULT_HERO_CONFIG;

  const updateHeroField = <K extends keyof HeroBannerConfig>(
    key: K,
    value: HeroBannerConfig[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      hero_config: {
        ...(prev.hero_config || DEFAULT_HERO_CONFIG),
        [key]: value,
      },
    }));
  };

  const updateHeroCard = (
    cardKey: "card_1" | "card_2",
    patch: Partial<HeroShowcaseCard>
  ) => {
    setFormState((prev) => {
      const currentHero = prev.hero_config || DEFAULT_HERO_CONFIG;
      return {
        ...prev,
        hero_config: {
          ...currentHero,
          [cardKey]: {
            ...currentHero[cardKey],
            ...patch,
          },
        },
      };
    });
  };

  const handleAutocompleteCardFromProduct = (
    cardKey: "card_1" | "card_2",
    productId: string
  ) => {
    if (!productId) return;
    const found = products.find((p) => p.id === productId);
    if (!found) return;

    updateHeroCard(cardKey, {
      title: found.title,
      price_text: `$${found.price_usd.toFixed(2)}`,
      image_url: found.primary_image_url,
      search_keyword: found.title,
      badge:
        found.promo_tag && found.promo_tag !== "UNPUBLISHED"
          ? found.promo_tag
          : found.category_badge.toUpperCase(),
    });
    onShowToast(
      `Tarjeta ${cardKey === "card_1" ? "1" : "2"} autocompletada con "${
        found.title
      }"`
    );
  };

  const handleUploadLogoFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadProductImage(file);
      setFormState((prev) => ({ ...prev, logo_url: url }));
      onShowToast(
        "Nuevo logo cargado. Haz clic en 'Save Store Settings' para publicar."
      );
    } catch {
      onShowToast("Error al subir el archivo del logo.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleUploadCardImage = async (
    cardKey: "card_1" | "card_2",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (cardKey === "card_1") setUploadingCard1(true);
    else setUploadingCard2(true);

    try {
      const url = await uploadProductImage(file);
      updateHeroCard(cardKey, { image_url: url });
      onShowToast(
        `Imagen subida para Tarjeta Destacada ${
          cardKey === "card_1" ? "1" : "2"
        }`
      );
    } catch {
      onShowToast("Error al subir la imagen de la tarjeta.");
    } finally {
      if (cardKey === "card_1") setUploadingCard1(false);
      else setUploadingCard2(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await saveStoreSettingsToSupabase(formState);
    onUpdateSettings(saved);
    setSaving(false);
    onShowToast(
      `Configuración de marca, Banner Hero y Tasa BCV (Bs. ${saved.bcv_exchange_rate.toFixed(
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
            Identidad de Marca, Banner Principal (Hero) &amp; Pagos Venezuela
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-space-lg py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>
            {saving ? "Guardando en Supabase..." : "Save Store Settings"}
          </span>
        </button>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-lowest p-2 rounded-DEFAULT shadow-[2px_2px_0px_#2a3235] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("brand_payments")}
          className={
            activeTab === "brand_payments"
              ? "flex items-center gap-2 px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235] transition-all"
              : "flex items-center gap-2 px-space-lg py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-all"
          }
        >
          <span className="material-symbols-outlined text-[18px]">
            branding_watermark
          </span>
          <span>1. Marca, Logo, Pagos VE y Envíos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero_banner")}
          className={
            activeTab === "hero_banner"
              ? "flex items-center gap-2 px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235] transition-all"
              : "flex items-center gap-2 px-space-lg py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-all"
          }
        >
          <span className="material-symbols-outlined text-[18px]">
            view_carousel
          </span>
          <span>2. Configurador del Banner Principal (Hero Section)</span>
        </button>
      </div>

      {activeTab === "brand_payments" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
          {/* Card 0 (Full Width): Identidad de Marca y Logo Oficial */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
                  <span className="material-symbols-outlined text-[18px]">
                    image
                  </span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                    Identidad de Marca y Logo (Header / Footer / Admin)
                  </h2>
                  <p className="font-label-badge text-[11px] text-on-surface-variant">
                    El logo oficial ya incluye el texto &ldquo;pocket CASES&rdquo;, por lo
                    que se muestra limpio sin texto redundante al lado
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormState((prev) => ({ ...prev, logo_url: "/logo.png" }));
                  onShowToast("Logo restaurado al oficial por defecto (/logo.png)");
                }}
                className="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] transition-all self-start sm:self-auto"
              >
                Restaurar Logo por Defecto (/logo.png)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
              {/* Live Logo Preview Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low border-2 border-dashed border-outline-variant shadow-[inner_0_2px_4px_rgba(0,0,0,0.04)]">
                <span className="font-label-badge text-[10px] uppercase text-on-surface-variant mb-2">
                  Vista Previa en Vivo (Navbar / Admin)
                </span>
                <div className="p-3 bg-surface-container-lowest rounded-xl shadow-[2px_2px_0px_#2a3235] flex items-center justify-center">
                  <img
                    src={formState.logo_url || "/logo.png"}
                    onError={(e) => {
                      e.currentTarget.src = "/logo.png";
                    }}
                    alt={formState.store_name || "Pocket Cases"}
                    className="h-14 w-auto object-contain rounded-lg shrink-0"
                  />
                </div>
              </div>

              {/* Upload & URL Controls */}
              <div className="md:col-span-8 flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/webp,image/jpeg,image/svg+xml,image/gif"
                    onChange={handleUploadLogoFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingLogo}
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235] hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      upload
                    </span>
                    <span>
                      {uploadingLogo
                        ? "Subiendo a Supabase Storage..."
                        : "Subir Nuevo Logo (PNG / WEBP / SVG)"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        logo_url: "/logo-full.png",
                      }))
                    }
                    className="px-space-md py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-all"
                  >
                    Usar Versión Cuadrada (/logo-full.png)
                  </button>
                </div>

                <div>
                  <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                    URL o Ruta del Logo Activo (`logo_url`)
                  </label>
                  <input
                    type="text"
                    value={formState.logo_url || "/logo.png"}
                    onChange={(e) =>
                      setFormState({ ...formState, logo_url: e.target.value })
                    }
                    placeholder="/logo.png o https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

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
                  Atributo alt de la marca y número oficial para recibir pedidos
                </p>
              </div>
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                Nombre de la Tienda (Accesibilidad / SEO Title)
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
                  setFormState({
                    ...formState,
                    whatsapp_number: e.target.value,
                  })
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
                  Cuenta Zelle &amp; Envíos Nacionales (MRW / Zoom / Delivery)
                </h2>
                <p className="font-label-badge text-[11px] text-on-surface-variant">
                  Pagos en divisas y configuración de barra de delivery gratis /
                  regalo en el carrito
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

            {/* Toggle: Mostrar Barra de Envío Gratis en el Carrito */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-secondary-fixed/40 cursor-pointer shadow-[1px_1px_0px_#2a3235] mt-1">
              <div className="pr-3">
                <span className="font-label-md text-label-md text-on-surface font-bold block">
                  Mostrar Barra de Envío Gratis en el Carrito (
                  <code className="text-xs">enable_free_shipping_bar</code>)
                </span>
                <span className="font-label-badge text-[11px] text-on-surface-variant">
                  Si lo desactivas, se oculta la barra verde de progreso de
                  delivery gratis en el carrito
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.enable_free_shipping_bar !== false}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    enable_free_shipping_bar: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-primary rounded cursor-pointer shrink-0"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-1">
              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Monto mínimo para Envío Gratis ($ USD)
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
                  Costo de Envío Estándar ($ USD)
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

            {formState.enable_free_shipping_bar !== false && (
              <div className="grid grid-cols-1 gap-space-sm pt-1">
                <div>
                  <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                    Texto cuando falta monto — usa{" "}
                    <code className="text-primary font-bold">{"{amount}"}</code>{" "}
                    para el monto faltante
                  </label>
                  <input
                    type="text"
                    value={
                      formState.free_shipping_locked_text ||
                      "¡Agrega {amount} más para envío GRATIS!"
                    }
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        free_shipping_locked_text: e.target.value,
                      })
                    }
                    placeholder="¡Agrega {amount} más para envío GRATIS!"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                    Texto cuando desbloquea Envío Gratis
                  </label>
                  <input
                    type="text"
                    value={
                      formState.free_shipping_unlocked_text ||
                      "¡Desbloqueaste envío GRATIS a nivel nacional!"
                    }
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        free_shipping_unlocked_text: e.target.value,
                      })
                    }
                    placeholder="¡Desbloqueaste envío GRATIS a nivel nacional!"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Toggle: Mostrar Banner de Regalo en el Carrito */}
            <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-space-sm">
              <label className="flex items-center justify-between p-3 rounded-lg bg-tertiary-fixed/30 cursor-pointer shadow-[1px_1px_0px_#2a3235]">
                <div className="pr-3">
                  <span className="font-label-md text-label-md text-on-surface font-bold block">
                    Mostrar Banner de Regalo en el Carrito (
                    <code className="text-xs">enable_free_gift_banner</code>)
                  </span>
                  <span className="font-label-badge text-[11px] text-on-surface-variant">
                    Activa o desactiva la píldora de regalo incluido al final de
                    los productos en el carrito
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formState.enable_free_gift_banner !== false}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      enable_free_gift_banner: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-primary rounded cursor-pointer shrink-0"
                />
              </label>

              {formState.enable_free_gift_banner !== false && (
                <div>
                  <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                    Texto del Banner de Regalo (<code className="text-xs">free_gift_text</code>)
                  </label>
                  <input
                    type="text"
                    value={
                      formState.free_gift_text || "¡Charm de regalo incluido!"
                    }
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        free_gift_text: e.target.value,
                      })
                    }
                    placeholder="¡Charm de regalo incluido!"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "hero_banner" && (
        <div className="flex flex-col gap-space-lg">
          {/* Editorial Copy & CTAs Configurator */}
          <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
                  <span className="material-symbols-outlined text-[18px]">
                    edit_note
                  </span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                    Textos Editoriales, Titular Principal y Botones CTA del Hero
                  </h2>
                  <p className="font-label-badge text-[11px] text-on-surface-variant">
                    Personaliza el mensaje principal, insignia superior, sello
                    rotatorio Y2K y textos de llamada a la acción
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormState((prev) => ({
                    ...prev,
                    hero_config: DEFAULT_HERO_CONFIG,
                  }));
                  onShowToast(
                    "Textos y tarjetas del Hero restaurados a los valores originales"
                  );
                }}
                className="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] transition-all self-start sm:self-auto"
              >
                Restaurar Hero por Defecto
              </button>
            </div>

            {/* Live Mini Headline Preview */}
            <div className="p-space-md rounded-lg bg-surface-container-low shadow-[1px_1px_0px_#2a3235] flex flex-col gap-1">
              <span className="font-label-badge text-[10px] uppercase text-on-surface-variant">
                Vista Previa del Titular:
              </span>
              <p className="font-headline-md text-headline-md text-on-surface font-extrabold">
                {hero.headline_prefix}{" "}
                <span className="text-primary underline decoration-wavy">
                  {hero.headline_highlight}
                </span>{" "}
                {hero.headline_suffix}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="md:col-span-3">
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Píldora Superior (`badge_text`)
                </label>
                <input
                  type="text"
                  value={hero.badge_text}
                  onChange={(e) =>
                    updateHeroField("badge_text", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Titular - Prefijo (`headline_prefix`)
                </label>
                <input
                  type="text"
                  value={hero.headline_prefix}
                  onChange={(e) =>
                    updateHeroField("headline_prefix", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-badge text-label-badge text-primary font-bold uppercase mb-1.5">
                  Titular - Texto Destacado Rosa (`headline_highlight`)
                </label>
                <input
                  type="text"
                  value={hero.headline_highlight}
                  onChange={(e) =>
                    updateHeroField("headline_highlight", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-primary-fixed/30 font-headline-sm text-body-md text-primary font-extrabold shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Titular - Cierre (`headline_suffix`)
                </label>
                <input
                  type="text"
                  value={hero.headline_suffix}
                  onChange={(e) =>
                    updateHeroField("headline_suffix", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Subtítulo Descriptivo (`subheadline`)
                </label>
                <textarea
                  rows={2}
                  value={hero.subheadline}
                  onChange={(e) =>
                    updateHeroField("subheadline", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Puntaje Estrellas (`rating_score`)
                </label>
                <input
                  type="text"
                  value={hero.rating_score}
                  onChange={(e) =>
                    updateHeroField("rating_score", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Texto Social Proof (`rating_text`)
                </label>
                <input
                  type="text"
                  value={hero.rating_text}
                  onChange={(e) =>
                    updateHeroField("rating_text", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Botón CTA Primario (`primary_cta_text`)
                </label>
                <input
                  type="text"
                  value={hero.primary_cta_text}
                  onChange={(e) =>
                    updateHeroField("primary_cta_text", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Botón CTA Secundario (`secondary_cta_text`)
                </label>
                <input
                  type="text"
                  value={hero.secondary_cta_text}
                  onChange={(e) =>
                    updateHeroField("secondary_cta_text", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                    Sello Línea 1
                  </label>
                  <input
                    type="text"
                    value={hero.stamp_line_1}
                    onChange={(e) =>
                      updateHeroField("stamp_line_1", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                  />
                </div>
                <div>
                  <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                    Sello Línea 2
                  </label>
                  <input
                    type="text"
                    value={hero.stamp_line_2}
                    onChange={(e) =>
                      updateHeroField("stamp_line_2", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Feature Bubble Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-2 border-t border-outline-variant/30">
              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Burbuja Inferior - Título (`feature_bubble_title`)
                </label>
                <input
                  type="text"
                  value={hero.feature_bubble_title}
                  onChange={(e) =>
                    updateHeroField("feature_bubble_title", e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                />
              </div>
              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Burbuja Inferior - Subtítulo (`feature_bubble_subtitle`)
                </label>
                <input
                  type="text"
                  value={hero.feature_bubble_subtitle}
                  onChange={(e) =>
                    updateHeroField("feature_bubble_subtitle", e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                />
              </div>
              <div>
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1.5">
                  Burbuja Inferior - Badge (`feature_bubble_badge`)
                </label>
                <input
                  type="text"
                  value={hero.feature_bubble_badge}
                  onChange={(e) =>
                    updateHeroField("feature_bubble_badge", e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                />
              </div>
            </div>
          </div>

          {/* 2 Hero Showcase Mosaic Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {(
              [
                {
                  key: "card_1" as const,
                  label: "Tarjeta Destacada 1 (Izquierda - Rosa Pastel)",
                  bgClass: "bg-primary-fixed",
                  Uploading: uploadingCard1,
                  inputRef: card1InputRef,
                },
                {
                  key: "card_2" as const,
                  label: "Tarjeta Destacada 2 (Derecha - Verde Salvia)",
                  bgClass: "bg-secondary-fixed",
                  Uploading: uploadingCard2,
                  inputRef: card2InputRef,
                },
              ] as const
            ).map(({ key, label, bgClass, Uploading, inputRef }) => {
              const card = hero[key] || DEFAULT_HERO_CONFIG[key];
              return (
                <div
                  key={key}
                  className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col gap-space-md"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full ${bgClass} shadow-[1px_1px_0px_#2a3235]`}
                      />
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                        {label}
                      </h3>
                    </div>
                  </div>

                  {/* Quick Autocomplete from Catalog Product */}
                  <div className="p-3 rounded-lg bg-secondary-container/30 shadow-[1px_1px_0px_#2a3235]">
                    <label className="block font-label-badge text-[10px] text-on-surface font-bold uppercase mb-1">
                      ⚡ Autocompletar con producto del catálogo:
                    </label>
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        handleAutocompleteCardFromProduct(key, e.target.value);
                        e.target.value = "";
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface shadow-[1px_1px_0px_#2a3235] cursor-pointer"
                    >
                      <option value="">
                        Seleccionar producto para rellenar tarjeta...
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (${p.price_usd.toFixed(2)}) — {p.sku}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Card Visual Preview + Image Upload */}
                  <div className="flex items-center gap-space-md">
                    <div
                      className={`w-28 h-32 rounded-lg ${bgClass} p-2 flex flex-col items-center justify-center shrink-0 shadow-[2px_2px_0px_#2a3235]`}
                    >
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full h-full object-cover rounded bg-surface-container-lowest"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/webp,image/jpeg,image/gif"
                        onChange={(e) => handleUploadCardImage(key, e)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={Uploading}
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary text-on-primary font-label-badge text-label-badge font-bold shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          upload
                        </span>
                        <span>
                          {Uploading
                            ? "Subiendo imagen..."
                            : "Subir Imagen Propia"}
                        </span>
                      </button>

                      <div>
                        <label className="block font-label-badge text-[10px] text-on-surface-variant uppercase mb-1">
                          URL de Imagen
                        </label>
                        <input
                          type="text"
                          value={card.image_url}
                          onChange={(e) =>
                            updateHeroCard(key, { image_url: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded bg-surface-container-low font-body-sm text-xs text-on-surface shadow-[1px_1px_0px_#2a3235]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    <div>
                      <label className="block font-label-badge text-[10px] text-on-surface-variant uppercase mb-1">
                        Etiqueta Superior (`badge`)
                      </label>
                      <input
                        type="text"
                        value={card.badge}
                        onChange={(e) =>
                          updateHeroCard(key, { badge: e.target.value })
                        }
                        placeholder="MÁS VENDIDO"
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                      />
                    </div>
                    <div>
                      <label className="block font-label-badge text-[10px] text-on-surface-variant uppercase mb-1">
                        Título (`title`)
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) =>
                          updateHeroCard(key, { title: e.target.value })
                        }
                        placeholder="Strawberry Wave"
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface font-bold shadow-[1px_1px_0px_#2a3235]"
                      />
                    </div>
                    <div>
                      <label className="block font-label-badge text-[10px] text-on-surface-variant uppercase mb-1">
                        Precio (`price_text`)
                      </label>
                      <input
                        type="text"
                        value={card.price_text}
                        onChange={(e) =>
                          updateHeroCard(key, { price_text: e.target.value })
                        }
                        placeholder="$32.00"
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-primary font-extrabold shadow-[1px_1px_0px_#2a3235]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label className="block font-label-badge text-[10px] text-on-surface-variant uppercase mb-1">
                        Filtro Categoría al Hacer Clic
                      </label>
                      <select
                        value={card.category_filter}
                        onChange={(e) =>
                          updateHeroCard(key, {
                            category_filter: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                      >
                        <option value="all">Todos los Modelos (all)</option>
                        <option value="magsafe">MagSafe (magsafe)</option>
                        <option value="iphone">Serie iPhone (iphone)</option>
                        <option value="samsung">Samsung Galaxy (samsung)</option>
                        <option value="collabs">Ediciones / Drops (collabs)</option>
                        <option value="slim">Ultra Delgados (slim)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-badge text-[10px] text-on-surface-variant uppercase mb-1">
                        Búsqueda al Hacer Clic (opcional)
                      </label>
                      <input
                        type="text"
                        value={card.search_keyword}
                        onChange={(e) =>
                          updateHeroCard(key, {
                            search_keyword: e.target.value,
                          })
                        }
                        placeholder="Ej. Strawberry (o vacío)"
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
}
