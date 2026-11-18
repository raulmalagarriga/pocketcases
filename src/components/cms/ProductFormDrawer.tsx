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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // New Color Variant inputs
  const [newColorName, setNewColorName] = useState("Baby Peach");
  const [newColorHex, setNewColorHex] = useState("#FDBA74");
  const [newColorUnits, setNewColorUnits] = useState(24);

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
        },
      ],
    },
  });

  useEffect(() => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      if (
        !watchedPrimaryImage ||
        watchedPrimaryImage === DEFAULT_MOCKUP_URL
      ) {
        setValue("primary_image_url", uploadedUrl, { shouldDirty: true });
      } else {
        setValue("gallery_urls", [...watchedGallery, uploadedUrl], {
          shouldDirty: true,
        });
      }
    } finally {
      setUploadingImage(false);
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
      },
    ];
    setValue("color_variants", nextVariants, { shouldValidate: true });
    const sumUnits = nextVariants.reduce(
      (sum, item) => sum + Number(item.stock_units || 0),
      0
    );
    setValue("total_stock", sumUnits);
    setNewColorName("");
  };

  const handleRemoveColorVariant = (variantId: string) => {
    if (watchedColorVariants.length <= 1) return;
    const nextVariants = watchedColorVariants.filter(
      (c) => c.id !== variantId
    );
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

  const onSubmit = async (values: ProductFormValues) => {
    const saved = await saveProductToSupabase(values, product);
    onSaved(saved, !product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden transition-opacity">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-screen max-w-4xl bg-surface-container-lowest shadow-[-8px_0px_24px_rgba(42,50,53,0.15)] flex flex-col justify-between overflow-y-auto z-10"
        >
          {/* Drawer Header */}
          <div className="p-space-lg bg-surface-container-low flex items-center justify-between shadow-[0_2px_8px_rgba(42,50,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[2px_2px_0px_#2a3235]">
                <span className="material-symbols-outlined text-[20px]">
                  edit_note
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                    {product
                      ? `Edit: ${watchedTitle || product.title}`
                      : "Create New Product"}
                  </h2>
                  <span
                    className={`font-label-badge text-label-badge px-2 py-0.5 rounded-full font-bold ${
                      watchedIsLive
                        ? "bg-tertiary-fixed text-on-tertiary-container"
                        : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    {watchedIsLive ? "ONLINE" : "DRAFT"}
                  </span>
                </div>
                <p className="font-label-badge text-label-badge text-outline uppercase tracking-wider">
                  SKU: {watchedSku} • Last updated today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-1 font-label-md text-label-md text-primary hover:underline px-2 py-1"
                href={
                  watchedSlug || product?.slug
                    ? `/products/${watchedSlug || product?.slug}`
                    : "/"
                }
                target="_blank"
              >
                <span>View Live on Storefront</span>
                <span className="material-symbols-outlined text-[16px]">
                  open_in_new
                </span>
              </Link>
              <button
                className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
                onClick={onClose}
                type="button"
              >
                <span className="material-symbols-outlined text-[24px]">
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Drawer Content Grid (Two Columns) */}
          <div className="p-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl flex-1">
            {/* Left Column: Media Gallery Manager (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-bold block mb-1">
                  Product Media &amp; Mockups
                </label>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Upload multi-angle photos and 3D device renders (2000 ×
                  2000px, PNG or WEBP recommended).
                </p>
              </div>

              {/* Primary Featured Mockup Slot */}
              <div className="relative group rounded-DEFAULT bg-primary-fixed/20 p-2 shadow-[2px_2px_0px_#2a3235]">
                <img
                  alt={watchedTitle || "Primary Mockup"}
                  className="w-full h-56 object-cover rounded-DEFAULT"
                  src={watchedPrimaryImage || DEFAULT_MOCKUP_URL}
                />
                <div className="absolute top-4 left-4 bg-primary text-on-primary font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[1px_1px_0px_#2a3235]">
                  PRIMARY DISPLAY
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Cambiar imagen principal"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      crop
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (watchedGallery.length > 0) {
                        setValue("primary_image_url", watchedGallery[0]);
                        setValue("gallery_urls", watchedGallery.slice(1));
                      } else {
                        setValue("primary_image_url", DEFAULT_MOCKUP_URL);
                      }
                    }}
                    title="Restablecer imagen"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest text-error flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>

              {/* Thumbnail Reel (Reorderable + Upload) */}
              <div className="grid grid-cols-3 gap-2">
                {watchedGallery.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    onClick={() => {
                      // Click thumbnail to promote to Primary Display
                      const currentPrimary = watchedPrimaryImage;
                      const nextGallery = [...watchedGallery];
                      nextGallery[idx] = currentPrimary;
                      setValue("primary_image_url", url);
                      setValue("gallery_urls", nextGallery);
                    }}
                    title="Clic para usar como imagen principal"
                    className="relative rounded-lg bg-surface-container-low p-1 shadow-[1px_1px_0px_#2a3235] group cursor-pointer"
                  >
                    <img
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-20 object-cover rounded"
                      src={url}
                    />
                    <span className="material-symbols-outlined absolute top-2 right-2 text-[14px] text-on-surface-variant">
                      drag_indicator
                    </span>
                  </div>
                ))}

                {/* Upload Slot */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-surface-container-low flex flex-col items-center justify-center h-20 text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer shadow-[1px_1px_0px_#2a3235]"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    add_photo_alternate
                  </span>
                  <span className="font-label-badge text-[9px] uppercase font-bold mt-1">
                    {uploadingImage ? "Uploading..." : "+ Upload"}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Direct Image URL Input */}
              <div className="flex flex-col gap-1">
                <label className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                  Primary Image URL (or upload above)
                </label>
                <input
                  {...register("primary_image_url")}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                  type="text"
                />
                {errors.primary_image_url && (
                  <span className="text-error text-xs">
                    {errors.primary_image_url.message}
                  </span>
                )}
              </div>

              {/* Dimensions spec info pill */}
              <div className="bg-secondary-container/30 p-2.5 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  info
                </span>
                <p className="font-body-sm text-body-sm text-on-secondary-container">
                  Square aspect ratio (1:1) keeps storefront grid seamlessly
                  aligned across all devices.
                </p>
              </div>
            </div>

            {/* Right Column: Product Attributes & Pricing (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              {/* Product Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="sm:col-span-2 flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Product Title
                  </label>
                  <input
                    {...register("title", {
                      onChange: (e) => {
                        if (!product) {
                          setValue("slug", slugify(e.target.value));
                        }
                      },
                    })}
                    placeholder="e.g. Strawberry Milkshake Wave"
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-[1px_1px_0px_#2a3235]"
                    type="text"
                  />
                  {errors.title && (
                    <span className="text-error text-xs">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    SKU Code
                  </label>
                  <input
                    {...register("sku")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface uppercase focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                    type="text"
                  />
                  {errors.sku && (
                    <span className="text-error text-xs">
                      {errors.sku.message}
                    </span>
                  )}
                </div>
              </div>

              {/* URL Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="sm:col-span-2 flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Storefront URL Handle
                  </label>
                  <div className="flex items-center">
                    <span className="bg-surface-container-high px-3 py-2 rounded-l-lg font-label-badge text-label-badge text-on-surface-variant shadow-[1px_1px_0px_#2a3235]">
                      pocketcases.co/products/
                    </span>
                    <input
                      {...register("slug")}
                      className="flex-1 px-3 py-2 rounded-r-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                      type="text"
                    />
                  </div>
                  {errors.slug && (
                    <span className="text-error text-xs">
                      {errors.slug.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Category
                  </label>
                  <select
                    {...register("category_badge")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle / Protection Spec, Promo Badge Tag & Default Finish */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Subtitle / Protection Spec
                  </label>
                  <input
                    {...register("subtitle")}
                    placeholder="e.g. Doble Armadura MagSafe"
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-[1px_1px_0px_#2a3235]"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Promo Badge Tag
                  </label>
                  <select
                    {...register("promo_tag")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                  >
                    <option value="">None (Sin etiqueta)</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="HOT DROP">HOT DROP</option>
                    <option value="WAITLIST">WAITLIST</option>
                    <option value="UNPUBLISHED">UNPUBLISHED</option>
                  </select>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Default Finish
                  </label>
                  <select
                    {...register("default_finish")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                  >
                    <option value="Grip Mate">Grip Mate</option>
                    <option value="Brillo Jelly">Brillo Jelly</option>
                  </select>
                </div>
              </div>

              {/* Supported Phone Models Pills Multi-select */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                    <span>Supported iPhone &amp; Galaxy Models</span>
                    <span className="font-label-badge text-label-badge bg-secondary-fixed text-on-secondary-fixed px-2 py-0.2 rounded-full font-bold">
                      {watchedModels.length} Supported
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setValue("supported_models", ALL_SUPPORTED_MODELS, {
                          shouldValidate: true,
                        })
                      }
                      className="text-primary hover:underline font-label-badge text-[10px] uppercase font-bold"
                    >
                      Select All (13-16)
                    </button>
                    <span className="text-outline text-xs">•</span>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "supported_models",
                          [ALL_SUPPORTED_MODELS[0]],
                          { shouldValidate: true }
                        )
                      }
                      className="text-on-surface-variant hover:text-error font-label-badge text-[10px] uppercase font-bold"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {ALL_SUPPORTED_MODELS.map((modelName) => {
                    const checked = watchedModels.includes(modelName);
                    return (
                      <label
                        key={modelName}
                        onClick={() => toggleModel(modelName)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] cursor-pointer transition-colors ${
                          checked
                            ? "bg-inverse-surface text-inverse-on-surface"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="accent-primary w-3 h-3 rounded"
                        />
                        <span>{modelName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Color Variant Manager & Hex Codes */}
              <div className="bg-surface-container-low p-space-md rounded-lg shadow-[1px_1px_0px_#2a3235] flex flex-col gap-space-sm border border-outline-variant/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      palette
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Color Variant Manager &amp; Hex Codes
                    </span>
                  </div>
                  <span className="font-label-badge text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold uppercase">
                    {watchedColorVariants.length} Swatches Configured
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Configure color shades with precise hexadecimal codes,
                  individual inventory pools, and SKU suffixes.
                </p>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {watchedColorVariants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-container-lowest shadow-[1px_1px_0px_#2a3235]"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-7 h-7 rounded-full shadow-[1px_1px_0px_#2a3235] shrink-0 border border-outline-variant"
                            style={{ backgroundColor: variant.hex_code }}
                          ></div>
                          <div className="min-w-0 flex-1">
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) =>
                                handleUpdateColorVariantName(
                                  variant.id,
                                  e.target.value
                                )
                              }
                              aria-label="Color variant name"
                              className="w-full bg-transparent font-label-md text-label-md text-on-surface font-bold leading-tight focus:outline-none focus:bg-surface-container-low rounded px-1 -ml-1"
                            />
                            <p className="font-label-badge text-[10px] text-outline truncate">
                              {variant.hex_code} • SKU: {variant.sku_suffix}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded">
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
                              aria-label="Color variant stock units"
                              className="w-12 bg-surface-container-lowest text-on-surface font-label-badge text-[11px] font-bold text-center rounded px-1 py-0.5 focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                            />
                            <span className="font-label-badge text-[9px] font-bold uppercase">
                              uds
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveColorVariant(variant.id)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                            title="Remove color variant"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Color Variant Sub-Form */}
                  <div className="bg-surface-container p-2.5 rounded-lg flex flex-col gap-2 mt-1">
                    <span className="font-label-badge text-label-badge text-on-surface-variant uppercase font-bold">
                      + Add New Color Variant
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="sm:col-span-1">
                        <input
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                          placeholder="Name (e.g. Cream Puff)"
                          type="text"
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-center gap-1.5">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-8 h-8 rounded border border-outline-variant cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface uppercase focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                          placeholder="#HEX"
                          type="text"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <input
                          value={newColorUnits}
                          onChange={(e) =>
                            setNewColorUnits(Number(e.target.value))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                          placeholder="Units (e.g. 20)"
                          type="number"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <button
                          type="button"
                          onClick={handleAddColorVariant}
                          className="w-full py-1.5 px-3 rounded-lg bg-primary text-on-primary font-label-badge text-label-badge uppercase font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 flex items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                          <span>Add Color</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Cost Grid */}
              <div className="grid grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Retail Price ($ USD)
                  </label>
                  <input
                    step="0.01"
                    {...register("price_usd")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                    type="number"
                  />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Compare-at Price (Was)
                  </label>
                  <input
                    step="0.01"
                    {...register("compare_at_price_usd")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                    type="number"
                  />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-bold">
                    Unit Cost ($ USD)
                  </label>
                  <input
                    step="0.01"
                    {...register("cost_usd")}
                    className="px-3 py-2 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                    type="number"
                  />
                </div>
              </div>

              {/* Inventory & Stock Controls */}
              <div className="bg-surface-container-low p-space-md rounded-lg shadow-[1px_1px_0px_#2a3235] flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Inventory Levels &amp; Thresholds
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      {...register("track_inventory")}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <span className="font-label-badge text-label-badge text-on-surface">
                      Track live quantity
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                      Current Available Stock
                    </label>
                    <input
                      {...register("total_stock")}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                      Low Stock Threshold
                    </label>
                    <input
                      {...register("low_stock_threshold")}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                      Stock Status
                    </label>
                    <select
                      {...register("stock_status")}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none shadow-[1px_1px_0px_#2a3235]"
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
              </div>

              {/* Instant Toggle Switches Group */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Product Active on Storefront
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Visible in catalog and search listings
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register("is_live")}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-10 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Allow WhatsApp Direct Order
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Enables quick checkout button on product view
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register("allow_whatsapp_checkout")}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-10 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Display Low Stock Urgency Badge
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Pops up &ldquo;Only 3 left!&rdquo; notification pill
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register("show_low_stock_badge")}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-10 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Action Footer */}
          <div className="p-space-md bg-surface-container-low border-t-0 flex items-center justify-between shadow-[0_-2px_8px_rgba(42,50,53,0.05)]">
            <button
              className="px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
              onClick={onClose}
              type="button"
            >
              Discard Changes
            </button>
            <div className="flex items-center gap-space-sm">
              <button
                disabled={isSubmitting}
                className="px-space-lg py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                type="submit"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
