import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  ALL_SUPPORTED_MODELS,
  normalizeStoreSettings,
} from "@/lib/seed-data";
import { Product, StoreSettings } from "@/types/database";

export async function getStorefrontData(): Promise<{
  products: Product[];
  settings: StoreSettings;
}> {
  if (!isSupabaseConfigured()) {
    return {
      products: INITIAL_PRODUCTS.filter((p) => p.is_live),
      settings: INITIAL_STORE_SETTINGS,
    };
  }

  try {
    const supabase = await createClient();

    const [{ data: productsData, error: productsError }, { data: settingsData }] =
      await Promise.all([
        supabase
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
          .eq("is_live", true)
          .order("sort_order", { ascending: true }),
        supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
      ]);

    if (productsError || !productsData || productsData.length === 0) {
      return {
        products: INITIAL_PRODUCTS.filter((p) => p.is_live),
        settings: normalizeStoreSettings(settingsData as Record<string, unknown>),
      };
    }

    const mappedProducts: Product[] = productsData.map((raw: Record<string, unknown>) => {
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
        .filter((name): name is string => Boolean(name));

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

    return {
      products: mappedProducts,
      settings: normalizeStoreSettings(settingsData as Record<string, unknown>),
    };
  } catch {
    return {
      products: INITIAL_PRODUCTS.filter((p) => p.is_live),
      settings: INITIAL_STORE_SETTINGS,
    };
  }
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product | null;
  relatedProducts: Product[];
  allProducts: Product[];
  settings: StoreSettings;
}> {
  const { products, settings } = await getStorefrontData();

  let found =
    products.find((p) => p.slug === slug) ||
    INITIAL_PRODUCTS.find((p) => p.slug === slug) ||
    null;

  if (!found && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: raw } = await supabase
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
        .eq("slug", slug)
        .maybeSingle();

      if (raw) {
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
          .map(
            (m: { phone_models?: { name?: string } }) => m.phone_models?.name
          )
          .filter((name: string | undefined): name is string => Boolean(name));

        found = {
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
            supportedModels.length > 0
              ? supportedModels
              : ALL_SUPPORTED_MODELS,
        };
      }
    } catch {
      // Fallback handled above
    }
  }

  const relatedProducts = products
    .filter((p) => p.slug !== slug && p.id !== found?.id)
    .slice(0, 4);

  return {
    product: found,
    relatedProducts,
    allProducts: products,
    settings,
  };
}

