"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  ProductFormValues,
} from "@/lib/validations/productSchema";
import { Product } from "@/types/database";
import { ALL_SUPPORTED_MODELS } from "@/lib/seed-data";
import {
  saveProductToSupabase,
  uploadProductImage,
} from "@/lib/queries/cms";
import Link from "next/link";

interface ProductFormDrawerProps {
  isOpen: boolean;
  product: Product | null; // null = creating a new product
  onClose: () => void;
  onSaved: (savedProduct: Product, isNew: boolean) => void;
}

const DEFAULT_MOCKUP_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA";

const DEFAULT_MOCKUP_URL_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA";

const CATEGORIES_LIST = [
  "MagSafe Tough",
  "Dual Shock",
  "Bio-Resina",
  "Heavy Duty Armor",
  "Crystal Clear",
  "Mirror MagSafe",
  "Ultra Slim",
  "Vegan Leather",
];

const LABEL_CLASS =
  "block text-[11px] font-label-md font-bold uppercase tracking-wider text-slate-600 mb-1.5";
const INPUT_CLASS =
  "w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all";
const COMPACT_INPUT_CLASS =
  "w-full h-9 px-2.5 rounded-lg bg-white border border-slate-300 text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all";
const CARD_CLASS =
  "bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductFormDrawer({
  isOpen,
  product,
  onClose,
  onSaved,
}: ProductFormDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "info_pricing" | "variants_media" | "models_inventory"
  >("info_pricing");

  const primaryFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const variantFileInputRef = useRef<HTMLInputElement | null>(null);
  const newVariantFileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(
    null
  );
  const [targetVariantIdForUpload, setTargetVariantIdForUpload] = useState<
    string | null
  >(null);
  const [uploadingNewVariantImg, setUploadingNewVariantImg] = useState(false);

  // New Color Variant inputs
  const [newColorName, setNewColorName] = useState("Baby Peach");
  const [newColorHex, setNewColorHex] = useState("#FDBA74");
  const [newColorUnits, setNewColorUnits] = useState(20);
  const [newColorImageUrl, setNewColorImageUrl] = useState("");
  const [variantWarning, setVariantWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: "PKT-NEW-01",
      title: "",
      slug: "",
      subtitle: "Doble Armadura MagSafe",
      category_badge: "MagSafe Tough",
      promo_tag: "HOT DROP",
      price_usd: 32.0,
      compare_at_price_usd: 38.0,
      cost_usd: 8.1,
      primary_image_url: DEFAULT_MOCKUP_URL,
      gallery_urls: [],
      card_bg_style: "primary-fixed",
      default_finish: "Grip Mate",
      total_stock: 48,
      low_stock_threshold: 10,
      track_inventory: true,
      stock_status: "in_stock",
      is_live: true,
      allow_whatsapp_checkout: true,
      show_low_stock_badge: false,
      supported_models: ALL_SUPPORTED_MODELS,
      color_variants: [
        {
          id: "cv-init-1",
          name: "Amarillo Mantequilla",
          name_en: "Butter Yellow",
          hex_code: "#FDE047",
          sku_suffix: "-YLW",
          stock_units: 28,
          is_default: true,
          sort_order: 1,
          image_url: DEFAULT_MOCKUP_URL,
        },
        {
          id: "cv-init-2",
          name: "Flor Pastel",
          name_en: "Pastel Blossom",
          hex_code: "#F472B6",
          sku_suffix: "-BLS",
          stock_units: 20,
          is_default: false,
          sort_order: 2,
          image_url: DEFAULT_MOCKUP_URL_2,
        },
      ],
    },
  });

  useEffect(() => {
    setActiveTab("info_pricing");
    setVariantWarning(null);

    if (product) {
      reset({
        id: product.id,
        sku: product.sku,
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle,
        category_badge: product.category_badge,
        promo_tag: product.promo_tag || "",
        price_usd: product.price_usd,
        compare_at_price_usd: product.compare_at_price_usd,
        cost_usd: product.cost_usd,
        primary_image_url: product.primary_image_url,
        gallery_urls: product.gallery_urls || [],
        card_bg_style: product.card_bg_style,
        default_finish: product.default_finish,
        total_stock: product.total_stock,
        low_stock_threshold: product.low_stock_threshold,
        track_inventory: product.track_inventory,
        stock_status: product.stock_status,
        is_live: product.is_live,
        allow_whatsapp_checkout: product.allow_whatsapp_checkout,
        show_low_stock_badge: product.show_low_stock_badge,
        supported_models:
          product.supported_models?.length > 0
            ? product.supported_models
            : ALL_SUPPORTED_MODELS,
        color_variants:
          product.color_variants?.length > 0
            ? product.color_variants.map((cv) => ({
                id: cv.id,
                name: cv.name,
                name_en: cv.name_en || cv.name,
                hex_code: cv.hex_code,
                sku_suffix: cv.sku_suffix,
                stock_units: cv.stock_units,
                is_default: cv.is_default,
                sort_order: cv.sort_order,
                image_url: cv.image_url || product.primary_image_url,
              }))
            : [
                {
                  id: "cv-default",
                  name: "Original",
                  name_en: "Original",
                  hex_code: "#F06292",
                  sku_suffix: "-ORG",
                  stock_units: product.total_stock,
                  is_default: true,
                  sort_order: 1,
                  image_url: product.primary_image_url,
                },
              ],
      });
    } else {
      reset({
        sku: `PKT-DROP-${Math.floor(10 + Math.random() * 89)}`,
        title: "",
        slug: "",
        subtitle: "Anti-Amarilleo / Absorción de impactos",
        category_badge: "Dual Shock",
        promo_tag: "HOT DROP",
        price_usd: 32.0,
        compare_at_price_usd: 38.0,
        cost_usd: 8.1,
        primary_image_url: DEFAULT_MOCKUP_URL,
        gallery_urls: [],
        card_bg_style: "primary-fixed",
        default_finish: "Brillo Jelly",
        total_stock: 60,
        low_stock_threshold: 10,
        track_inventory: true,
        stock_status: "in_stock",
        is_live: true,
        allow_whatsapp_checkout: true,
        show_low_stock_badge: false,
        supported_models: ALL_SUPPORTED_MODELS,
        color_variants: [
          {
            id: "cv-new-1",
            name: "Amarillo Mantequilla",
            name_en: "Butter Yellow",
            hex_code: "#FDE047",
            sku_suffix: "-YLW",
            stock_units: 28,
            is_default: true,
            sort_order: 1,
            image_url: DEFAULT_MOCKUP_URL,
          },
          {
            id: "cv-new-2",
            name: "Flor Pastel",
            name_en: "Pastel Blossom",
            hex_code: "#F472B6",
            sku_suffix: "-BLS",
            stock_units: 32,
            is_default: false,
            sort_order: 2,
            image_url: DEFAULT_MOCKUP_URL_2,
          },
        ],
      });
    }
  }, [product, reset, isOpen]);

  if (!isOpen) return null;

  const watchedPrimaryImage = watch("primary_image_url");
  const watchedGallery = watch("gallery_urls") || [];
  const watchedModels = watch("supported_models") || [];
  const watchedColorVariants = watch("color_variants") || [];
  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedSku = watch("sku");
  const watchedIsLive = watch("is_live");
  const watchedPriceUsd = Number(watch("price_usd") || 0);
  const watchedCostUsd = Number(watch("cost_usd") || 0);

  const netProfitPerUnit = Math.max(0, watchedPriceUsd - watchedCostUsd);
  const grossMarginPct =
    watchedPriceUsd > 0
      ? Math.round(((watchedPriceUsd - watchedCostUsd) / watchedPriceUsd) * 100)
      : 0;

  // Check duplicate image URLs across color variants
  const imageCountMap = watchedColorVariants.reduce<Record<string, number>>(
    (acc, cv) => {
      const url = (cv.image_url || watchedPrimaryImage || "").trim();
      if (url) {
        acc[url] = (acc[url] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const handlePrimaryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPrimary(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setValue("primary_image_url", uploadedUrl, { shouldDirty: true });
    } finally {
      setUploadingPrimary(false);
      e.target.value = "";
    }
  };

  const handleGalleryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setValue("gallery_urls", [...watchedGallery, uploadedUrl], {
        shouldDirty: true,
      });
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleVariantFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !targetVariantIdForUpload) return;
    const targetId = targetVariantIdForUpload;
    setUploadingVariantId(targetId);
    try {
      const uploadedUrl = await uploadProductImage(file);
      handleUpdateColorVariantImage(targetId, uploadedUrl);
    } finally {
      setUploadingVariantId(null);
      setTargetVariantIdForUpload(null);
      e.target.value = "";
    }
  };

  const handleNewVariantFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNewVariantImg(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setNewColorImageUrl(uploadedUrl);
      setVariantWarning(null);
    } finally {
      setUploadingNewVariantImg(false);
      e.target.value = "";
    }
  };

  const toggleModel = (modelName: string) => {
    if (watchedModels.includes(modelName)) {
      setValue(
        "supported_models",
        watchedModels.filter((m) => m !== modelName),
        { shouldValidate: true }
      );
    } else {
      setValue("supported_models", [...watchedModels, modelName], {
        shouldValidate: true,
      });
    }
  };

  const handleAddColorVariant = () => {
    if (!newColorName.trim() || !newColorHex.trim()) return;
    const cleanHex = newColorHex.startsWith("#")
      ? newColorHex.toUpperCase()
      : `#${newColorHex.toUpperCase()}`;
    const suffix = `-${newColorName
      .trim()
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase()}`;

    const candidateImage = (
      newColorImageUrl.trim() ||
      watchedPrimaryImage ||
      DEFAULT_MOCKUP_URL
    ).trim();

    const isDuplicateImg = watchedColorVariants.some(
      (cv) => (cv.image_url || watchedPrimaryImage || "").trim() === candidateImage
    );
    if (isDuplicateImg) {
      setVariantWarning(
        "Nota: La nueva variante tenía la misma foto que otro color. Sube o asigna una fotografía propia para cada tono."
      );
    } else {
      setVariantWarning(null);
    }

    const nextVariants = [
      ...watchedColorVariants,
      {
        id: `cv-${Date.now()}`,
        name: newColorName.trim(),
        name_en: newColorName.trim(),
        hex_code: cleanHex,
        sku_suffix: suffix || "-CLR",
        stock_units: Number(newColorUnits) || 0,
        is_default: watchedColorVariants.length === 0,
        sort_order: watchedColorVariants.length + 1,
        image_url: candidateImage,
      },
    ];
    setValue("color_variants", nextVariants, { shouldValidate: true });
    const sumUnits = nextVariants.reduce(
      (sum, item) => sum + Number(item.stock_units || 0),
      0
    );
    setValue("total_stock", sumUnits);
    setNewColorName("");
    setNewColorImageUrl("");
  };

  const handleRemoveColorVariant = (variantId: string) => {
    if (watchedColorVariants.length <= 1) return;
    const nextVariants = watchedColorVariants.filter((c) => c.id !== variantId);
    setValue("color_variants", nextVariants, { shouldValidate: true });
    const sumUnits = nextVariants.reduce(
      (sum, item) => sum + Number(item.stock_units || 0),
      0
    );
    setValue("total_stock", sumUnits);
  };

  const handleUpdateColorVariantStock = (variantId: string, units: number) => {
    const safeUnits = Math.max(0, Number.isNaN(units) ? 0 : units);
    const nextVariants = watchedColorVariants.map((c) =>
      c.id === variantId ? { ...c, stock_units: safeUnits } : c
    );
    setValue("color_variants", nextVariants, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const sumUnits = nextVariants.reduce(
      (sum, item) => sum + Number(item.stock_units || 0),
      0
    );
    setValue("total_stock", sumUnits, { shouldDirty: true });
  };

  const handleUpdateColorVariantName = (variantId: string, name: string) => {
    const nextVariants = watchedColorVariants.map((c) =>
      c.id === variantId ? { ...c, name, name_en: name } : c
    );
    setValue("color_variants", nextVariants, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleUpdateColorVariantHex = (variantId: string, hex: string) => {
    const nextVariants = watchedColorVariants.map((c) =>
      c.id === variantId ? { ...c, hex_code: hex } : c
    );
    setValue("color_variants", nextVariants, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleUpdateColorVariantImage = (
    variantId: string,
    imageUrl: string
  ) => {
    const nextVariants = watchedColorVariants.map((c) =>
      c.id === variantId ? { ...c, image_url: imageUrl } : c
    );
    setValue("color_variants", nextVariants, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setVariantWarning(null);
  };

  const onSubmit = async (values: ProductFormValues) => {
    const saved = await saveProductToSupabase(values, product);
    onSaved(saved, !product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-screen max-w-3xl bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden z-10"
        >
          {/* Sticky Top Header + Tabs */}
          <div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0 shrink-0">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-[20px]">
                    edit_note
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-lg text-on-surface font-extrabold truncate">
                      {product
                        ? `Editar: ${watchedTitle || product.title}`
                        : "Crear Nuevo Producto"}
                    </h2>
                    <span
                      className={`font-label-badge text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                        watchedIsLive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {watchedIsLive ? "ACTIVO" : "BORRADOR"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    SKU: <span className="font-mono font-bold">{watchedSku}</span>{" "}
                    • {watchedColorVariants.length} variantes de color
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  href={
                    watchedSlug || product?.slug
                      ? `/products/${watchedSlug || product?.slug}`
                      : "/"
                  }
                  target="_blank"
                >
                  <span>Ver en Tienda</span>
                  <span className="material-symbols-outlined text-[15px]">
                    open_in_new
                  </span>
                </Link>
                <button
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  onClick={onClose}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Clean Navigation Tabs */}
            <div className="flex items-center gap-1 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("info_pricing")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "info_pricing"
                    ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg"
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  sell
                </span>
                <span>1. Información y Precios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("variants_media")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "variants_media"
                    ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg"
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  palette
                </span>
                <span>
                  2. Variantes de Color e Imágenes ({watchedColorVariants.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("models_inventory")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "models_inventory"
                    ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg"
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  smartphone
                </span>
                <span>3. Modelos Compatibles e Inventario</span>
              </button>
            </div>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* TAB 1: INFORMACIÓN Y PRECIOS */}
            {activeTab === "info_pricing" && (
              <>
                {/* Card 1: Datos Principales */}
                <div className={CARD_CLASS}>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Datos Principales del Producto
                      </h3>
                      <p className="text-xs text-slate-500">
                        Título, código SKU, categoría y enlace permanente en la
                        tienda
                      </p>
                    </div>
                  </div>

                  {/* Row 1: Title (2 cols) + SKU (1 col) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>Product Title</label>
                      <input
                        {...register("title", {
                          onChange: (e) => {
                            if (!product) {
                              setValue("slug", slugify(e.target.value));
                            }
                          },
                        })}
                        placeholder="Ej. Strawberry Milkshake Wave"
                        className={INPUT_CLASS}
                        type="text"
                      />
                      {errors.title && (
                        <span className="text-error text-xs mt-1 block">
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>SKU Code</label>
                      <input
                        {...register("sku")}
                        className={`${INPUT_CLASS} uppercase font-mono`}
                        type="text"
                      />
                      {errors.sku && (
                        <span className="text-error text-xs mt-1 block">
                          {errors.sku.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Subtitle (1 col) + Categoría (1 col) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLASS}>
                        Subtitle / Especificación
                      </label>
                      <input
                        {...register("subtitle")}
                        placeholder="Ej. Doble Armadura MagSafe"
                        className={INPUT_CLASS}
                        type="text"
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>Categoría</label>
                      <select
                        {...register("category_badge")}
                        className={INPUT_CLASS}
                      >
                        {CATEGORIES_LIST.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: URL Slug (2 cols) + Etiqueta Promo (1 col) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>URL Slug (Handle)</label>
                      <div className="h-10 flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary transition-all">
                        <span className="bg-slate-100 px-3 h-full flex items-center text-xs text-slate-500 border-r border-slate-300 select-none shrink-0">
                          /products/
                        </span>
                        <input
                          {...register("slug")}
                          className="flex-1 h-full px-3 text-sm text-on-surface bg-white focus:outline-none"
                          placeholder="strawberry-milkshake-wave"
                          type="text"
                        />
                      </div>
                      {errors.slug && (
                        <span className="text-error text-xs mt-1 block">
                          {errors.slug.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>Etiqueta Promo</label>
                      <select {...register("promo_tag")} className={INPUT_CLASS}>
                        <option value="">Ninguna (Sin etiqueta)</option>
                        <option value="BESTSELLER">BESTSELLER</option>
                        <option value="HOT DROP">HOT DROP</option>
                        <option value="WAITLIST">WAITLIST</option>
                        <option value="UNPUBLISHED">UNPUBLISHED</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card 2: Precios y Margen ($ USD) */}
                <div className={CARD_CLASS}>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      Precios y Margen ($ USD)
                    </h3>
                    <p className="text-xs text-slate-500">
                      El equivalente en Bolívares se calcula automáticamente con
                      la tasa BCV configurada
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={LABEL_CLASS}>
                        Precio de Venta ($ USD)
                      </label>
                      <input
                        step="0.01"
                        {...register("price_usd")}
                        className={INPUT_CLASS}
                        type="number"
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>
                        Precio Anterior (Compare-at)
                      </label>
                      <input
                        step="0.01"
                        {...register("compare_at_price_usd")}
                        className={INPUT_CLASS}
                        type="number"
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>
                        Costo Unitario ($ USD)
                      </label>
                      <input
                        step="0.01"
                        {...register("cost_usd")}
                        className={INPUT_CLASS}
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Clean Margin Summary Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">
                        monitoring
                      </span>
                      <span>Rentabilidad estimada por unidad:</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700">
                        Ganancia Neta:{" "}
                        <strong className="text-slate-900">
                          ${netProfitPerUnit.toFixed(2)} USD
                        </strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        Margen Bruto: {grossMarginPct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Visibilidad y Opciones de Venta */}
                <div className={CARD_CLASS}>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      Visibilidad y Opciones de Venta
                    </h3>
                    <p className="text-xs text-slate-500">
                      Controla cómo aparece este producto en el catálogo público
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="py-3 first:pt-0 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Producto Activo en Storefront
                        </p>
                        <p className="text-xs text-slate-500">
                          Visible en el catálogo público y resultados de búsqueda
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          {...register("is_live")}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                      </label>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Permitir Compra Directa por WhatsApp
                        </p>
                        <p className="text-xs text-slate-500">
                          Habilita el botón de pedido inmediato vía WhatsApp en
                          la vista del producto
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          {...register("allow_whatsapp_checkout")}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                      </label>
                    </div>

                    <div className="py-3 last:pb-0 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Mostrar Insignia de Urgencia (Bajo Stock)
                        </p>
                        <p className="text-xs text-slate-500">
                          Muestra la etiqueta destacada de últimas unidades
                          disponibles
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          {...register("show_low_stock_badge")}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: VARIANTES DE COLOR E IMÁGENES */}
            {activeTab === "variants_media" && (
              <>
                {/* Hidden File Input for Per-Variant Photo Upload */}
                <input
                  ref={variantFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleVariantFileChange}
                  className="hidden"
                />

                {/* Card 1: Variantes de Color — Cada color con su propia foto, HEX y stock */}
                <div className={CARD_CLASS}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Variantes de Color — Cada color con su propia foto, HEX
                        y stock
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cada variante de color tiene su propia fotografía que
                        cambia automáticamente cuando el cliente selecciona el
                        tono en la tienda.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 self-start sm:self-auto">
                      {watchedColorVariants.length} Tonos Activos
                    </span>
                  </div>

                  {variantWarning && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">
                        warning
                      </span>
                      <span>{variantWarning}</span>
                    </div>
                  )}

                  {/* Color Variants List */}
                  <div className="space-y-3">
                    {watchedColorVariants.map((variant) => {
                      const effectiveImg = (
                        variant.image_url ||
                        watchedPrimaryImage ||
                        DEFAULT_MOCKUP_URL
                      ).trim();
                      const sharesImageWithAnother =
                        watchedColorVariants.length > 1 &&
                        (imageCountMap[effectiveImg] || 0) > 1;
                      const isUploadingThis = uploadingVariantId === variant.id;

                      return (
                        <div
                          key={variant.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            {/* Variant Image Slot */}
                            <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0 relative group">
                              <img
                                src={effectiveImg}
                                alt={variant.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetVariantIdForUpload(variant.id);
                                  variantFileInputRef.current?.click();
                                }}
                                className="absolute inset-0 bg-slate-900/65 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                                title="Subir fotografía para este color"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  photo_camera
                                </span>
                                <span>
                                  {isUploadingThis ? "..." : "Cambiar Foto"}
                                </span>
                              </button>
                            </div>

                            {/* Fields Grid (12 cols) */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 flex-1 items-end">
                              {/* Color Picker + HEX (3 cols) */}
                              <div className="sm:col-span-3">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                  Color HEX
                                </label>
                                <div className="flex items-center gap-1.5 h-9">
                                  <input
                                    type="color"
                                    value={
                                      /^#[0-9A-Fa-f]{6}$/.test(variant.hex_code)
                                        ? variant.hex_code
                                        : "#F06292"
                                    }
                                    onChange={(e) =>
                                      handleUpdateColorVariantHex(
                                        variant.id,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    className="w-9 h-9 rounded-lg border border-slate-300 bg-white p-0.5 cursor-pointer shrink-0"
                                  />
                                  <input
                                    type="text"
                                    value={variant.hex_code}
                                    onChange={(e) =>
                                      handleUpdateColorVariantHex(
                                        variant.id,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    className={`${COMPACT_INPUT_CLASS} font-mono uppercase text-xs`}
                                  />
                                </div>
                              </div>

                              {/* Nombre del Color (4 cols) */}
                              <div className="sm:col-span-4">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                  Nombre del Color
                                </label>
                                <input
                                  type="text"
                                  value={variant.name}
                                  onChange={(e) =>
                                    handleUpdateColorVariantName(
                                      variant.id,
                                      e.target.value
                                    )
                                  }
                                  className={COMPACT_INPUT_CLASS}
                                  placeholder="Ej. Flor Pastel"
                                />
                              </div>

                              {/* URL de Imagen de la Variante (3 cols) */}
                              <div className="sm:col-span-3">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                  Foto URL del Color
                                </label>
                                <input
                                  type="text"
                                  value={variant.image_url || ""}
                                  onChange={(e) =>
                                    handleUpdateColorVariantImage(
                                      variant.id,
                                      e.target.value
                                    )
                                  }
                                  className={`${COMPACT_INPUT_CLASS} text-xs`}
                                  placeholder="URL o sube foto"
                                />
                              </div>

                              {/* Stock (2 cols) */}
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                  Stock
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  value={variant.stock_units}
                                  onChange={(e) =>
                                    handleUpdateColorVariantStock(
                                      variant.id,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  className={`${COMPACT_INPUT_CLASS} text-center font-bold`}
                                />
                              </div>
                            </div>

                            {/* Delete Variant Button */}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveColorVariant(variant.id)
                              }
                              disabled={watchedColorVariants.length <= 1}
                              className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 self-end disabled:opacity-40"
                              title="Eliminar variante de color"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>

                          {sharesImageWithAnother && (
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800">
                              <span>
                                ⚠️ Esta variante comparte la misma URL de imagen
                                que otro color. Sube una imagen distinta para
                                este tono.
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetVariantIdForUpload(variant.id);
                                  variantFileInputRef.current?.click();
                                }}
                                className="font-bold underline hover:text-amber-950 shrink-0"
                              >
                                Subir foto propia
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* + Agregar Nueva Variante de Color Box */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        + Agregar Nueva Variante de Color
                      </span>
                      {newColorImageUrl && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            check_circle
                          </span>
                          Foto asignada para el nuevo color
                        </span>
                      )}
                    </div>

                    <input
                      ref={newVariantFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleNewVariantFileChange}
                      className="hidden"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      {/* Nombre del Nuevo Color (3 cols) */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Nombre del Color
                        </label>
                        <input
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className={COMPACT_INPUT_CLASS}
                          placeholder="Ej. Baby Peach"
                          type="text"
                        />
                      </div>

                      {/* Color Picker + HEX (3 cols) */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Tono #HEX
                        </label>
                        <div className="flex items-center gap-1.5 h-9">
                          <input
                            type="color"
                            value={
                              /^#[0-9A-Fa-f]{6}$/.test(newColorHex)
                                ? newColorHex
                                : "#FDBA74"
                            }
                            onChange={(e) =>
                              setNewColorHex(e.target.value.toUpperCase())
                            }
                            className="w-9 h-9 rounded-lg border border-slate-300 bg-white p-0.5 cursor-pointer shrink-0"
                          />
                          <input
                            value={newColorHex}
                            onChange={(e) =>
                              setNewColorHex(e.target.value.toUpperCase())
                            }
                            className={`${COMPACT_INPUT_CLASS} font-mono uppercase text-xs`}
                            placeholder="#HEX"
                            type="text"
                          />
                        </div>
                      </div>

                      {/* Stock Units (2 cols) */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Unidades
                        </label>
                        <input
                          value={newColorUnits}
                          onChange={(e) =>
                            setNewColorUnits(Number(e.target.value))
                          }
                          className={COMPACT_INPUT_CLASS}
                          placeholder="20"
                          type="number"
                          min={0}
                        />
                      </div>

                      {/* Upload Photo + Add Variant Buttons (4 cols) */}
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            newVariantFileInputRef.current?.click()
                          }
                          className="h-9 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            upload
                          </span>
                          <span>
                            {uploadingNewVariantImg
                              ? "..."
                              : newColorImageUrl
                              ? "Foto OK"
                              : "Subir Foto"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleAddColorVariant}
                          className="h-9 flex-1 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 flex items-center justify-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>

                    {/* Optional direct URL input for the new variant photo */}
                    <div>
                      <input
                        type="text"
                        value={newColorImageUrl}
                        onChange={(e) => setNewColorImageUrl(e.target.value)}
                        placeholder="O pega aquí la URL de la fotografía específica para este nuevo color..."
                        className={`${COMPACT_INPUT_CLASS} text-xs`}
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Portada Principal y Galería Adicional del Producto */}
                <div className={CARD_CLASS}>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      Portada Principal y Galería Adicional del Producto
                    </h3>
                    <p className="text-xs text-slate-500">
                      Imagen principal de respaldo y ángulos adicionales para la
                      galería de detalle
                    </p>
                  </div>

                  <input
                    ref={primaryFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handlePrimaryFileChange}
                    className="hidden"
                  />

                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleGalleryFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 relative">
                      <img
                        src={watchedPrimaryImage || DEFAULT_MOCKUP_URL}
                        alt={watchedTitle || "Portada"}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-slate-900/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Portada
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => primaryFileInputRef.current?.click()}
                          className="h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-95 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            upload
                          </span>
                          <span>
                            {uploadingPrimary
                              ? "Subiendo..."
                              : "Subir Portada"}
                          </span>
                        </button>
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>
                          URL de Portada Principal
                        </label>
                        <input
                          {...register("primary_image_url")}
                          className={INPUT_CLASS}
                          type="text"
                        />
                        {errors.primary_image_url && (
                          <span className="text-error text-xs mt-1 block">
                            {errors.primary_image_url.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gallery Strip */}
                  <div className="pt-2">
                    <label className={LABEL_CLASS}>
                      Miniaturas Adicionales de Galería ({watchedGallery.length}
                      )
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {watchedGallery.map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          className="relative group h-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden"
                        >
                          <img
                            src={url}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const currentPrimary = watchedPrimaryImage;
                                const nextGallery = [...watchedGallery];
                                nextGallery[idx] = currentPrimary;
                                setValue("primary_image_url", url);
                                setValue("gallery_urls", nextGallery);
                              }}
                              title="Usar como portada"
                              className="w-7 h-7 rounded bg-white text-slate-800 flex items-center justify-center hover:bg-slate-100"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                star
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setValue(
                                  "gallery_urls",
                                  watchedGallery.filter((_, i) => i !== idx),
                                  { shouldDirty: true }
                                );
                              }}
                              title="Eliminar miniatura"
                              className="w-7 h-7 rounded bg-white text-rose-600 flex items-center justify-center hover:bg-rose-50"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="h-20 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          add_photo_alternate
                        </span>
                        <span className="text-[10px] font-bold uppercase">
                          {uploadingGallery
                            ? "Subiendo..."
                            : "+ Subir Miniatura"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: MODELOS COMPATIBLES E INVENTARIO */}
            {activeTab === "models_inventory" && (
              <>
                {/* Card 1: Control de Stock General */}
                <div className={CARD_CLASS}>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Control de Stock General y Acabado
                      </h3>
                      <p className="text-xs text-slate-500">
                        Disponibilidad global, umbral de alerta y acabado
                        predeterminado
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        {...register("track_inventory")}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                        type="checkbox"
                      />
                      <span>Monitorear inventario</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={LABEL_CLASS}>
                        Stock Total Disponible
                      </label>
                      <input
                        {...register("total_stock")}
                        className={INPUT_CLASS}
                        type="number"
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>
                        Alerta de Bajo Stock
                      </label>
                      <input
                        {...register("low_stock_threshold")}
                        className={INPUT_CLASS}
                        type="number"
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>
                        Estado de Inventario
                      </label>
                      <select
                        {...register("stock_status")}
                        className={INPUT_CLASS}
                      >
                        <option value="in_stock">In Stock (Activo)</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">
                          Out of Stock (Agotado)
                        </option>
                        <option value="draft">Draft (Borrador)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className={LABEL_CLASS}>Acabado por Defecto</label>
                      <select
                        {...register("default_finish")}
                        className={INPUT_CLASS}
                      >
                        <option value="Grip Mate">Grip Mate</option>
                        <option value="Brillo Jelly">Brillo Jelly</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card 2: Modelos de Teléfono Compatibles */}
                <div className={CARD_CLASS}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">
                        Modelos de Teléfono Compatibles (iPhone &amp; Samsung
                        Galaxy)
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        {watchedModels.length} Seleccionados
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setValue("supported_models", ALL_SUPPORTED_MODELS, {
                            shouldValidate: true,
                          })
                        }
                        className="text-primary hover:underline text-xs font-bold"
                      >
                        Seleccionar Todos
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            "supported_models",
                            [ALL_SUPPORTED_MODELS[0]],
                            { shouldValidate: true }
                          )
                        }
                        className="text-slate-500 hover:text-rose-600 text-xs font-bold"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_SUPPORTED_MODELS.map((modelName) => {
                      const checked = watchedModels.includes(modelName);
                      return (
                        <button
                          key={modelName}
                          type="button"
                          onClick={() => toggleModel(modelName)}
                          className={`h-9 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                            checked
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{modelName}</span>
                          {checked && (
                            <span className="material-symbols-outlined text-[15px] text-primary-fixed shrink-0">
                              check
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sticky Drawer Footer */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button
              disabled={isSubmitting}
              className="h-10 px-6 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-95 transition-opacity disabled:opacity-60 flex items-center gap-1.5"
              type="submit"
            >
              <span className="material-symbols-outlined text-[17px]">
                save
              </span>
              <span>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
