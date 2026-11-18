import { z } from "zod";

export const colorVariantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre del color es obligatorio"),
  name_en: z.string().nullable().optional(),
  hex_code: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Código HEX inválido"),
  sku_suffix: z.string().min(1, "Sufijo SKU requerido"),
  stock_units: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  is_default: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  image_url: z.string().nullable().optional(),
});

export const productFormSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(2, "El SKU es obligatorio (ej. PKT-STW-02)"),
  title: z.string().min(2, "El título del producto es obligatorio"),
  slug: z
    .string()
    .min(2, "El slug URL es obligatorio")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  subtitle: z.string().default("Doble Armadura MagSafe"),
  category_badge: z.string().min(1, "Selecciona una categoría"),
  promo_tag: z.string().nullable().optional(),
  price_usd: z.coerce
    .number()
    .min(0.01, "El precio de venta debe ser mayor a 0"),
  compare_at_price_usd: z
    .union([z.coerce.number().min(0), z.literal(""), z.null()])
    .optional()
    .transform((val) =>
      val === "" || val === null || val === undefined || Number(val) <= 0
        ? null
        : Number(val)
    ),
  cost_usd: z.coerce.number().min(0, "El costo no puede ser negativo"),
  primary_image_url: z.string().min(1, "La imagen principal es obligatoria"),
  gallery_urls: z.array(z.string()).default([]),
  card_bg_style: z
    .enum([
      "secondary-fixed",
      "primary-fixed",
      "surface-container",
      "primary-fixed-dim",
      "secondary-container",
      "surface-container-high",
    ])
    .default("primary-fixed"),
  default_finish: z.string().default("Grip Mate"),
  total_stock: z.coerce.number().int().min(0, "Stock inválido"),
  low_stock_threshold: z.coerce.number().int().min(0).default(10),
  track_inventory: z.boolean().default(true),
  stock_status: z
    .enum(["in_stock", "low_stock", "out_of_stock", "draft"])
    .default("in_stock"),
  is_live: z.boolean().default(true),
  allow_whatsapp_checkout: z.boolean().default(true),
  show_low_stock_badge: z.boolean().default(false),
  supported_models: z
    .array(z.string())
    .min(1, "Selecciona al menos un modelo compatible"),
  color_variants: z
    .array(colorVariantSchema)
    .min(1, "Agrega al menos una variante de color"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
