"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaqConfig,
  FaqItem,
  HeroBannerConfig,
  HeroShowcaseCard,
  Product,
  SocialProofConfig,
  SocialProofItem,
  StoreSettings,
} from "@/types/database";
import {
  DEFAULT_FAQ_CONFIG,
  DEFAULT_HERO_CONFIG,
  DEFAULT_SOCIAL_PROOF_CONFIG,
  normalizeStoreSettings,
} from "@/lib/seed-data";
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

const LABEL_CLASS =
  "block text-[11px] font-label-md font-bold uppercase tracking-wider text-slate-600 mb-1.5";
const INPUT_CLASS =
  "w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all";
const TEXTAREA_CLASS =
  "w-full p-3 rounded-lg bg-white border border-slate-300 text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all";
const CARD_CLASS =
  "bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5";

export function StoreSettingsView({
  settings,
  products = [],
  onUpdateSettings,
  onShowToast,
}: StoreSettingsViewProps) {
  const [formState, setFormState] = useState<StoreSettings>(() =>
    normalizeStoreSettings(settings)
  );
  const [activeTab, setActiveTab] = useState<
    "brand_payments" | "shipping_cart" | "hero_banner" | "social_faq"
  >("brand_payments");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCard1, setUploadingCard1] = useState(false);
  const [uploadingCard2, setUploadingCard2] = useState(false);
  const [uploadingSocialId, setUploadingSocialId] = useState<string | null>(
    null
  );
  const [targetSocialIdForUpload, setTargetSocialIdForUpload] = useState<
    string | null
  >(null);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const card1InputRef = useRef<HTMLInputElement | null>(null);
  const card2InputRef = useRef<HTMLInputElement | null>(null);
  const socialPhotoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormState(normalizeStoreSettings(settings));
  }, [settings]);

  const hero = formState.hero_config || DEFAULT_HERO_CONFIG;
  const socialProof =
    formState.social_proof_config || DEFAULT_SOCIAL_PROOF_CONFIG;
  const faqConfig = formState.faq_config || DEFAULT_FAQ_CONFIG;

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

  const updateSocialProofField = <K extends keyof SocialProofConfig>(
    key: K,
    value: SocialProofConfig[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      social_proof_config: {
        ...(prev.social_proof_config || DEFAULT_SOCIAL_PROOF_CONFIG),
        [key]: value,
      },
    }));
  };

  const updateSocialProofItem = (
    itemId: string,
    patch: Partial<SocialProofItem>
  ) => {
    const current =
      formState.social_proof_config || DEFAULT_SOCIAL_PROOF_CONFIG;
    updateSocialProofField(
      "items",
      current.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      )
    );
  };

  const handleAddSocialProofItem = () => {
    const current =
      formState.social_proof_config || DEFAULT_SOCIAL_PROOF_CONFIG;
    const newItem: SocialProofItem = {
      id: `sp-${Date.now()}`,
      image_url:
        DEFAULT_SOCIAL_PROOF_CONFIG.items[0]?.image_url ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD_zRR7YhS3NVSrRBKEYa6u5_hHGnxMc89pxY3TZmfInVmov4-BsJusIpXe-637MsyZ7ouClHeYY_VTvrR1nC8V4eXctFAEScoW5ZuAkSrcGM3amrwmVfHZTO2HMktxplQ_2ctL0dCmr1j-TwDssKwSHHHMYPctCJ5v9gu_0vJrUpcacIDPE5NCs8SaKE0tIqId9aO3EG-QIspO_DufqPrg5wfEb3Y2sF_9iZpCeA",
      quote: '"¡Demasiado brutal la calidad y el brillo! Llegó súper rápido."',
      handle: "@cliente.ve • Compradora Verificada",
      rating: 5,
    };
    updateSocialProofField("items", [...current.items, newItem]);
  };

  const handleRemoveSocialProofItem = (itemId: string) => {
    const current =
      formState.social_proof_config || DEFAULT_SOCIAL_PROOF_CONFIG;
    if (current.items.length <= 1) return;
    updateSocialProofField(
      "items",
      current.items.filter((item) => item.id !== itemId)
    );
  };

  const handleUploadSocialPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !targetSocialIdForUpload) return;
    const targetId = targetSocialIdForUpload;
    setUploadingSocialId(targetId);
    try {
      const url = await uploadProductImage(file);
      updateSocialProofItem(targetId, { image_url: url });
      onShowToast("Foto de cliente subida correctamente.");
    } catch {
      onShowToast("Error al subir la foto del cliente.");
    } finally {
      setUploadingSocialId(null);
      setTargetSocialIdForUpload(null);
      e.target.value = "";
    }
  };

  const updateFaqField = <K extends keyof FaqConfig>(
    key: K,
    value: FaqConfig[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      faq_config: {
        ...(prev.faq_config || DEFAULT_FAQ_CONFIG),
        [key]: value,
      },
    }));
  };

  const updateFaqItem = (itemId: string, patch: Partial<FaqItem>) => {
    const current = formState.faq_config || DEFAULT_FAQ_CONFIG;
    updateFaqField(
      "items",
      current.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      )
    );
  };

  const handleAddFaqItem = () => {
    const current = formState.faq_config || DEFAULT_FAQ_CONFIG;
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      question: "¿Cuánto tardan los envíos nacionales por MRW o Zoom?",
      answer:
        "Despachamos el mismo día hábil tras confirmar tu pago. Los envíos nacionales a cualquier ciudad de Venezuela tardan entre 24 y 48 horas hábiles.",
    };
    updateFaqField("items", [...current.items, newItem]);
  };

  const handleRemoveFaqItem = (itemId: string) => {
    const current = formState.faq_config || DEFAULT_FAQ_CONFIG;
    if (current.items.length <= 1) return;
    updateFaqField(
      "items",
      current.items.filter((item) => item.id !== itemId)
    );
  };

  const handleMoveFaqItem = (index: number, direction: -1 | 1) => {
    const current = formState.faq_config || DEFAULT_FAQ_CONFIG;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.items.length) return;
    const itemsCopy = [...current.items];
    const [moved] = itemsCopy.splice(index, 1);
    itemsCopy.splice(nextIndex, 0, moved);
    updateFaqField("items", itemsCopy);
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
        "Nuevo logo cargado. Haz clic en 'Guardar Configuración' para publicar."
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
      `Configuración de la tienda y Tasa BCV (Bs. ${saved.bcv_exchange_rate.toFixed(
        2
      )}) guardada correctamente`
    );
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[13px] text-slate-400">
              chevron_right
            </span>
            <span className="text-primary">Store Settings</span>
          </nav>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">
            Configuración General de la Tienda
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra identidad de marca, tasa BCV, pagos Venezuela, carrito,
            Hero banner, Social Proof y FAQs.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="h-10 px-5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 transition-opacity disabled:opacity-60 flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>
            {saving ? "Guardando..." : "Guardar Configuración"}
          </span>
        </button>
      </div>

      {/* 4 Clean Section Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("brand_payments")}
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === "brand_payments"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">
            account_balance
          </span>
          <span>1. Marca, Moneda BCV y Pagos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shipping_cart")}
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === "shipping_cart"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">
            local_shipping
          </span>
          <span>2. Envíos y Carrito</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero_banner")}
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === "hero_banner"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">
            view_carousel
          </span>
          <span>3. Banner Principal (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social_faq")}
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === "social_faq"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">quiz</span>
          <span>4. Social Proof (#EnLaCalle) y FAQs</span>
        </button>
      </div>

      {/* TAB 1: MARCA, MONEDA BCV Y PAGOS */}
      {activeTab === "brand_payments" && (
        <div className="space-y-6">
          {/* Card 1: Logo e Identidad de la Tienda */}
          <div className={CARD_CLASS}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Logo e Identidad de la Tienda
                </h2>
                <p className="text-xs text-slate-500">
                  El logo oficial ya incluye el texto &ldquo;pocket CASES&rdquo; y se
                  muestra en el Header, Footer y Panel Admin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormState((prev) => ({ ...prev, logo_url: "/logo.png" }));
                  onShowToast("Logo restaurado a /logo.png");
                }}
                className="h-9 px-3.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors self-start sm:self-auto"
              >
                Restaurar /logo.png
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Logo Preview Box */}
              <div className="w-full md:w-56 h-28 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Vista Previa
                </span>
                <img
                  src={formState.logo_url || "/logo.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                  alt={formState.store_name || "Pocket Cases"}
                  className="h-12 w-auto object-contain"
                />
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
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
                    className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5 transition-opacity disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      upload
                    </span>
                    <span>
                      {uploadingLogo ? "Subiendo..." : "Subir Nuevo Logo"}
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
                    className="h-9 px-3.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Usar /logo-full.png
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Nombre de la Tienda</label>
                    <input
                      type="text"
                      value={formState.store_name}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          store_name: e.target.value,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>
                      WhatsApp Oficial (Sin +)
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
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>URL del Logo</label>
                    <input
                      type="text"
                      value={formState.logo_url || "/logo.png"}
                      onChange={(e) =>
                        setFormState({ ...formState, logo_url: e.target.value })
                      }
                      placeholder="/logo.png"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tasa Oficial BCV (Bs. / USD) */}
          <div className={CARD_CLASS}>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800">
                Tasa Oficial BCV (Bs. / USD)
              </h2>
              <p className="text-xs text-slate-500">
                Calcula en tiempo real la referencia en Bolívares en las
                tarjetas de producto y carrito.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className={LABEL_CLASS}>
                  Tasa de Cambio BCV (Bs. por $1 USD)
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
                  className={`${INPUT_CLASS} font-bold`}
                />
              </div>

              <div className="h-10 px-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-medium">
                  Ejemplo Case de $28.00 USD:
                </span>
                <strong className="text-emerald-900 font-extrabold">
                  Bs. {(28 * (formState.bcv_exchange_rate || 45.8)).toFixed(2)}{" "}
                  BCV
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Mostrar equivalencia en Bolívares (Bs.) en la tienda
                </p>
                <p className="text-xs text-slate-500">
                  Muestra el precio equivalente en Bs. junto al monto en dólares
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formState.show_ves_reference}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      show_ves_reference: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
              </label>
            </div>
          </div>

          {/* Card 3: Métodos de Pago Venezuela — Pago Móvil y Zelle */}
          <div className={CARD_CLASS}>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800">
                Métodos de Pago Venezuela — Pago Móvil y Zelle
              </h2>
              <p className="text-xs text-slate-500">
                Credenciales bancarias mostradas al cliente durante el checkout
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Pago Móvil */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    smartphone
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">
                    Pago Móvil Interbancario
                  </h3>
                </div>

                <div>
                  <label className={LABEL_CLASS}>Banco Receptor (Código)</label>
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
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLASS}>Teléfono Afiliado</label>
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
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>RIF / Cédula</label>
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
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Zelle */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">
                    payments
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">
                    Transferencia Zelle ($ USD)
                  </h3>
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    Correo Electrónico Zelle
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
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>Titular de la Cuenta</label>
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
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENVÍOS Y CARRITO */}
      {activeTab === "shipping_cart" && (
        <div className="space-y-6">
          {/* Card 1: Barra de Progreso de Delivery Gratis */}
          <div className={CARD_CLASS}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Barra de Progreso de Delivery Gratis en el Carrito
                </h2>
                <p className="text-xs text-slate-500">
                  Motiva a los clientes a incrementar su ticket promedio para
                  desbloquear envío gratis.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formState.enable_free_shipping_bar !== false}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      enable_free_shipping_bar: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>
                  Monto Mínimo para Envío Gratis ($ USD)
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
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  Tarifa Plana de Envío Nacional ($ USD)
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
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>
                  Texto cuando falta monto (usa {"{amount}"})
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
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Banner de Regalo Promocional en el Carrito */}
          <div className={CARD_CLASS}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Banner de Regalo Promocional en el Carrito
                </h2>
                <p className="text-xs text-slate-500">
                  Muestra una insignia de regalo incluido debajo de los ítems
                  del carrito.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formState.enable_free_gift_banner !== false}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      enable_free_gift_banner: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
              </label>
            </div>

            <div>
              <label className={LABEL_CLASS}>
                Texto del Regalo Promocional
              </label>
              <input
                type="text"
                value={formState.free_gift_text || "¡Charm de regalo incluido!"}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    free_gift_text: e.target.value,
                  })
                }
                placeholder="¡Charm de regalo incluido!"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BANNER PRINCIPAL (HERO) */}
      {activeTab === "hero_banner" && (
        <div className="space-y-6">
          {/* Card 1: Textos Editoriales y Botones del Hero */}
          <div className={CARD_CLASS}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Textos Editoriales y Botones del Hero
                </h2>
                <p className="text-xs text-slate-500">
                  Personaliza el titular principal, botones CTA, sello rotatorio
                  y burbuja flotante.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormState((prev) => ({
                    ...prev,
                    hero_config: DEFAULT_HERO_CONFIG,
                  }));
                  onShowToast("Textos del Hero restaurados por defecto");
                }}
                className="h-9 px-3.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors self-start sm:self-auto"
              >
                Restaurar Hero por Defecto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className={LABEL_CLASS}>Texto de Píldora Superior</label>
                <input
                  type="text"
                  value={hero.badge_text}
                  onChange={(e) =>
                    updateHeroField("badge_text", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Título (Prefijo)</label>
                <input
                  type="text"
                  value={hero.headline_prefix}
                  onChange={(e) =>
                    updateHeroField("headline_prefix", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Palabra Resaltada (Rosa)</label>
                <input
                  type="text"
                  value={hero.headline_highlight}
                  onChange={(e) =>
                    updateHeroField("headline_highlight", e.target.value)
                  }
                  className={`${INPUT_CLASS} font-bold text-primary`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Título (Sufijo)</label>
                <input
                  type="text"
                  value={hero.headline_suffix}
                  onChange={(e) =>
                    updateHeroField("headline_suffix", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-3">
                <label className={LABEL_CLASS}>Subtítulo</label>
                <input
                  type="text"
                  value={hero.subheadline}
                  onChange={(e) =>
                    updateHeroField("subheadline", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Puntuación (4.9 / 5)</label>
                <input
                  type="text"
                  value={hero.rating_score}
                  onChange={(e) =>
                    updateHeroField("rating_score", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Texto de Reseñas</label>
                <input
                  type="text"
                  value={hero.rating_text}
                  onChange={(e) =>
                    updateHeroField("rating_text", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Texto Botón Primario</label>
                <input
                  type="text"
                  value={hero.primary_cta_text}
                  onChange={(e) =>
                    updateHeroField("primary_cta_text", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Texto Botón Secundario</label>
                <input
                  type="text"
                  value={hero.secondary_cta_text}
                  onChange={(e) =>
                    updateHeroField("secondary_cta_text", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={LABEL_CLASS}>Sello Línea 1</label>
                  <input
                    type="text"
                    value={hero.stamp_line_1}
                    onChange={(e) =>
                      updateHeroField("stamp_line_1", e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Sello Línea 2</label>
                  <input
                    type="text"
                    value={hero.stamp_line_2}
                    onChange={(e) =>
                      updateHeroField("stamp_line_2", e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className={LABEL_CLASS}>Burbuja Título</label>
                <input
                  type="text"
                  value={hero.feature_bubble_title}
                  onChange={(e) =>
                    updateHeroField("feature_bubble_title", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Burbuja Subtítulo</label>
                <input
                  type="text"
                  value={hero.feature_bubble_subtitle}
                  onChange={(e) =>
                    updateHeroField("feature_bubble_subtitle", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Burbuja Badge</label>
                <input
                  type="text"
                  value={hero.feature_bubble_badge}
                  onChange={(e) =>
                    updateHeroField("feature_bubble_badge", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Tarjetas Destacadas del Mosaico (Izquierda y Derecha) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(
              [
                {
                  key: "card_1" as const,
                  label: "Tarjeta Destacada 1 (Izquierda)",
                  Uploading: uploadingCard1,
                  inputRef: card1InputRef,
                },
                {
                  key: "card_2" as const,
                  label: "Tarjeta Destacada 2 (Derecha)",
                  Uploading: uploadingCard2,
                  inputRef: card2InputRef,
                },
              ] as const
            ).map(({ key, label, Uploading, inputRef }) => {
              const card = hero[key] || DEFAULT_HERO_CONFIG[key];
              return (
                <div key={key} className={CARD_CLASS}>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      {label}
                    </h3>
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>
                      ⚡ Autocompletar con producto del catálogo
                    </label>
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        handleAutocompleteCardFromProduct(key, e.target.value);
                        e.target.value = "";
                      }}
                      className={INPUT_CLASS}
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

                  <div className="flex items-start gap-4">
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-20 h-24 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                    />
                    <div className="flex-1 space-y-3">
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
                        className="h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          upload
                        </span>
                        <span>{Uploading ? "Subiendo..." : "Subir Foto"}</span>
                      </button>

                      <div>
                        <label className={LABEL_CLASS}>URL de Imagen</label>
                        <input
                          type="text"
                          value={card.image_url}
                          onChange={(e) =>
                            updateHeroCard(key, { image_url: e.target.value })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={LABEL_CLASS}>Etiqueta Superior</label>
                      <input
                        type="text"
                        value={card.badge}
                        onChange={(e) =>
                          updateHeroCard(key, { badge: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Título</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) =>
                          updateHeroCard(key, { title: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Precio</label>
                      <input
                        type="text"
                        value={card.price_text}
                        onChange={(e) =>
                          updateHeroCard(key, { price_text: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLASS}>Filtro Categoría</label>
                      <select
                        value={card.category_filter}
                        onChange={(e) =>
                          updateHeroCard(key, {
                            category_filter: e.target.value,
                          })
                        }
                        className={INPUT_CLASS}
                      >
                        <option value="all">Todos los Modelos (all)</option>
                        <option value="magsafe">MagSafe (magsafe)</option>
                        <option value="iphone">Serie iPhone (iphone)</option>
                        <option value="samsung">
                          Samsung Galaxy (samsung)
                        </option>
                        <option value="collabs">
                          Ediciones / Drops (collabs)
                        </option>
                        <option value="slim">Ultra Delgados (slim)</option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>
                        Palabra de Búsqueda (Opcional)
                      </label>
                      <input
                        type="text"
                        value={card.search_keyword}
                        onChange={(e) =>
                          updateHeroCard(key, {
                            search_keyword: e.target.value,
                          })
                        }
                        placeholder="Ej. Strawberry"
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL PROOF (#ENLACALLE) Y FAQS */}
      {activeTab === "social_faq" && (
        <div className="space-y-6">
          {/* Hidden File Input for Social Proof Customer Photo Upload */}
          <input
            ref={socialPhotoInputRef}
            type="file"
            accept="image/png,image/webp,image/jpeg,image/gif"
            onChange={handleUploadSocialPhoto}
            className="hidden"
          />

          {/* Block A: Sección "En la Calle con Pocket Cases" (social_proof_config) */}
          <div className={CARD_CLASS}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">
                    Sección &ldquo;En la Calle con Pocket Cases&rdquo; (#POCKETCASESENLACALLE)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {socialProof.items.length} Fotos
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configura las fotografías reales de clientes, testimonios y
                  enlace a Instagram en la landing page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  Mostrar Sección en la Landing Page
                </span>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={socialProof.enabled !== false}
                    onChange={(e) =>
                      updateSocialProofField("enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Hashtag Superior</label>
                <input
                  type="text"
                  value={socialProof.hashtag}
                  onChange={(e) =>
                    updateSocialProofField("hashtag", e.target.value)
                  }
                  placeholder="#POCKETCASESENLACALLE"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Título de la Sección</label>
                <input
                  type="text"
                  value={socialProof.title}
                  onChange={(e) =>
                    updateSocialProofField("title", e.target.value)
                  }
                  placeholder="En la Calle con Pocket Cases"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Subtítulo</label>
                <input
                  type="text"
                  value={socialProof.subtitle}
                  onChange={(e) =>
                    updateSocialProofField("subtitle", e.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  Texto del Botón Instagram
                </label>
                <input
                  type="text"
                  value={socialProof.cta_text}
                  onChange={(e) =>
                    updateSocialProofField("cta_text", e.target.value)
                  }
                  placeholder="Etiqueta a @pocketcases para aparecer"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>URL de Instagram</label>
                <input
                  type="text"
                  value={socialProof.cta_url}
                  onChange={(e) =>
                    updateSocialProofField("cta_url", e.target.value)
                  }
                  placeholder="https://instagram.com/..."
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {/* Grid de Tarjetas de Clientes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tarjetas de Clientes y Reseñas ({socialProof.items.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddSocialProofItem}
                  className="h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add_a_photo
                  </span>
                  <span>+ Agregar Foto de Cliente</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {socialProof.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex gap-4 items-start"
                  >
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.handle}
                        className="w-20 h-24 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTargetSocialIdForUpload(item.id);
                          socialPhotoInputRef.current?.click();
                        }}
                        className="w-20 h-7 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          upload
                        </span>
                        <span>
                          {uploadingSocialId === item.id ? "..." : "Subir Foto"}
                        </span>
                      </button>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Usuario / Ciudad
                          </label>
                          <input
                            type="text"
                            value={item.handle}
                            onChange={(e) =>
                              updateSocialProofItem(item.id, {
                                handle: e.target.value,
                              })
                            }
                            placeholder="@mia.in.ccs • Compradora Verificada"
                            className={INPUT_CLASS}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialProofItem(item.id)}
                          disabled={socialProof.items.length <= 1}
                          className="mt-5 h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center shrink-0 disabled:opacity-40"
                          title="Eliminar tarjeta"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Testimonio / Reseña
                        </label>
                        <input
                          type="text"
                          value={item.quote}
                          onChange={(e) =>
                            updateSocialProofItem(item.id, {
                              quote: e.target.value,
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          URL de la Foto
                        </label>
                        <input
                          type="text"
                          value={item.image_url}
                          onChange={(e) =>
                            updateSocialProofItem(item.id, {
                              image_url: e.target.value,
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block B: Sección "Preguntas Frecuentes (FAQs)" (faq_config) */}
          <div className={CARD_CLASS}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">
                    Sección &ldquo;Preguntas Frecuentes (FAQs)&rdquo;
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    Cerradas por defecto en la landing page
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Agrega, edita o reordena las preguntas frecuentes. En la
                  tienda todas inician cerradas hasta que el usuario hace clic.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  Mostrar Preguntas Frecuentes en la Landing Page
                </span>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={faqConfig.enabled !== false}
                    onChange={(e) =>
                      updateFaqField("enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Subtítulo Superior</label>
                <input
                  type="text"
                  value={faqConfig.badge_text}
                  onChange={(e) => updateFaqField("badge_text", e.target.value)}
                  placeholder="Ayuda y Compatibilidad"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Título Principal</label>
                <input
                  type="text"
                  value={faqConfig.title}
                  onChange={(e) => updateFaqField("title", e.target.value)}
                  placeholder="Preguntas Frecuentes"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {/* Lista de Preguntas y Respuestas */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Lista de Preguntas y Respuestas ({faqConfig.items.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddFaqItem}
                  className="h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  <span>+ Agregar Nueva Pregunta</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqConfig.items.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                  >
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className={LABEL_CLASS}>
                          Pregunta #{idx + 1}
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) =>
                            updateFaqItem(faq.id, { question: e.target.value })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveFaqItem(idx, -1)}
                          disabled={idx === 0}
                          className="h-10 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40"
                          title="Subir pregunta"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_upward
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFaqItem(idx, 1)}
                          disabled={idx === faqConfig.items.length - 1}
                          className="h-10 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40"
                          title="Bajar pregunta"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_downward
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaqItem(faq.id)}
                          disabled={faqConfig.items.length <= 1}
                          className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center disabled:opacity-40"
                          title="Eliminar pregunta"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>Respuesta</label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) =>
                          updateFaqItem(faq.id, { answer: e.target.value })
                        }
                        className={TEXTAREA_CLASS}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
