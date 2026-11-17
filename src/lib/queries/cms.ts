import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { INITIAL_PRODUCTS, ALL_SUPPORTED_MODELS } from "@/lib/seed-data";
import { Product } from "@/types/database";
import { ProductFormValues } from "@/lib/validations/productSchema";

const LOCAL_CMS_STORAGE_KEY = "pocket-cases-cms-products-v1";

export function getLocalCachedProducts(): Product[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_CMS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

export function setLocalCachedProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_CMS_STORAGE_KEY,
      JSON.stringify(products)
    );
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchCmsProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    const cached = getLocalCachedProducts();
    return cached || INITIAL_PRODUCTS;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        color_variants:product_color_variants(*),
        product_phone_models(
          is_available,
          phone_models(name)
        )
      `
      )
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalCachedProducts() || INITIAL_PRODUCTS;
    }

    return data.map((raw: Record<string, unknown>) => {
      const variants = Array.isArray(raw.color_variants)
        ? [...raw.color_variants].sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          )
        : [];
      const modelLinks = Array.isArray(raw.product_phone_models)
        ? raw.product_phone_models
        : [];
      const supportedModels = modelLinks
        .filter((m: { is_available?: boolean }) => m.is_available !== false)
        .map((m: { phone_models?: { name?: string } }) => m.phone_models?.name)
        .filter((n): n is string => Boolean(n));

      return {
        ...(raw as unknown as Product),
        price_usd: Number(raw.price_usd ?? 0),
        compare_at_price_usd:
          raw.compare_at_price_usd !== null &&
          raw.compare_at_price_usd !== undefined
            ? Number(raw.compare_at_price_usd)
            : null,
        cost_usd: Number(raw.cost_usd ?? 0),
        color_variants: variants,
        supported_models:
          supportedModels.length > 0 ? supportedModels : ALL_SUPPORTED_MODELS,
      };
    });
  } catch {
    return getLocalCachedProducts() || INITIAL_PRODUCTS;
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "png";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${ext}`;
      const filePath = `catalog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch {
      // Fallback to Data URL reader below
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function saveProductToSupabase(
  values: ProductFormValues,
  existingProduct?: Product | null
): Promise<Product> {
  const now = new Date().toISOString();
  const productId =
    existingProduct?.id ||
    values.id ||
    `prod-${Date.now().toString(36)}`;

  const filterTags: string[] = ["iphone"];
  if (values.supported_models.some((m) => m.toLowerCase().includes("galaxy"))) {
    filterTags.push("samsung");
  }
  if (values.category_badge.toLowerCase().includes("magsafe")) {
    filterTags.push("magsafe");
  }
  if (
    values.category_badge.toLowerCase().includes("slim") ||
    values.category_badge.toLowerCase().includes("resina")
  ) {
    filterTags.push("slim");
  }

  const constructedProduct: Product = {
    id: productId,
    sku: values.sku.toUpperCase(),
    title: values.title,
    slug: values.slug,
    subtitle: values.subtitle,
    category_id: existingProduct?.category_id || "cat-1",
    category_badge: values.category_badge,
    filter_tags: filterTags,
    promo_tag:
      values.stock_status === "draft"
        ? "UNPUBLISHED"
        : values.stock_status === "out_of_stock"
        ? "WAITLIST"
        : values.promo_tag || null,
    price_usd: Number(values.price_usd),
    compare_at_price_usd: values.compare_at_price_usd
      ? Number(values.compare_at_price_usd)
      : null,
    cost_usd: Number(values.cost_usd),
    primary_image_url: values.primary_image_url,
    gallery_urls: values.gallery_urls,
    card_bg_style: values.card_bg_style,
    finishes: existingProduct?.finishes || ["Grip Mate", "Brillo Jelly"],
    default_finish: values.default_finish,
    total_stock: Number(values.total_stock),
    low_stock_threshold: Number(values.low_stock_threshold),
    track_inventory: values.track_inventory,
    stock_status: values.stock_status,
    is_live: values.is_live,
    allow_whatsapp_checkout: values.allow_whatsapp_checkout,
    show_low_stock_badge: values.show_low_stock_badge,
    restock_badge_text: existingProduct?.restock_badge_text || null,
    restock_select_text: existingProduct?.restock_select_text || null,
    is_featured_hero: existingProduct?.is_featured_hero || false,
    sort_order: existingProduct?.sort_order || 1,
    created_at: existingProduct?.created_at || now,
    updated_at: now,
    supported_models: values.supported_models,
    color_variants: values.color_variants.map((cv, idx) => ({
      ...cv,
      product_id: productId,
      name_en: cv.name_en || cv.name,
      is_default: idx === 0,
      sort_order: idx + 1,
    })),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const payload = {
        sku: constructedProduct.sku,
        title: constructedProduct.title,
        slug: constructedProduct.slug,
        subtitle: constructedProduct.subtitle,
        category_badge: constructedProduct.category_badge,
        filter_tags: constructedProduct.filter_tags,
        promo_tag: constructedProduct.promo_tag,
        price_usd: constructedProduct.price_usd,
        compare_at_price_usd: constructedProduct.compare_at_price_usd,
        cost_usd: constructedProduct.cost_usd,
        primary_image_url: constructedProduct.primary_image_url,
        gallery_urls: constructedProduct.gallery_urls,
        card_bg_style: constructedProduct.card_bg_style,
        default_finish: constructedProduct.default_finish,
        total_stock: constructedProduct.total_stock,
        low_stock_threshold: constructedProduct.low_stock_threshold,
        track_inventory: constructedProduct.track_inventory,
        stock_status: constructedProduct.stock_status,
        is_live: constructedProduct.is_live,
        allow_whatsapp_checkout: constructedProduct.allow_whatsapp_checkout,
        show_low_stock_badge: constructedProduct.show_low_stock_badge,
      };

      let savedId = constructedProduct.id;

      if (existingProduct && !existingProduct.id.startsWith("prod-")) {
        await supabase.from("products").update(payload).eq("id", existingProduct.id);
      } else {
        const { data: inserted } = await supabase
          .from("products")
          .upsert({ ...payload }, { onConflict: "sku" })
          .select("id")
          .maybeSingle();
        if (inserted?.id) {
          savedId = inserted.id;
          constructedProduct.id = savedId;
        }
      }

      if (!savedId.startsWith("prod-")) {
        await supabase
          .from("product_color_variants")
          .delete()
          .eq("product_id", savedId);

        await supabase.from("product_color_variants").insert(
          constructedProduct.color_variants.map((cv, idx) => ({
            product_id: savedId,
            name: cv.name,
            name_en: cv.name_en || cv.name,
            hex_code: cv.hex_code,
            sku_suffix: cv.sku_suffix,
            stock_units: cv.stock_units,
            is_default: idx === 0,
            sort_order: idx + 1,
          }))
        );
      }
    } catch {
      // Fallback to local state persistence
    }
  }

  return constructedProduct;
}
