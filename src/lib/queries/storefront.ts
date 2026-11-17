import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  ALL_SUPPORTED_MODELS,
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
        settings: (settingsData as StoreSettings) || INITIAL_STORE_SETTINGS,
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
      settings: settingsData
        ? {
            ...(settingsData as StoreSettings),
            bcv_exchange_rate: Number(settingsData.bcv_exchange_rate ?? 45.8),
            free_shipping_threshold_usd: Number(
              settingsData.free_shipping_threshold_usd ?? 35
            ),
            shipping_flat_rate_usd: Number(
              settingsData.shipping_flat_rate_usd ?? 4
            ),
          }
        : INITIAL_STORE_SETTINGS,
    };
  } catch {
    return {
      products: INITIAL_PRODUCTS.filter((p) => p.is_live),
      settings: INITIAL_STORE_SETTINGS,
    };
  }
}
