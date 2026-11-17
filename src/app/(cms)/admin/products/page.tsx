import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { INITIAL_PRODUCTS, ALL_SUPPORTED_MODELS } from "@/lib/seed-data";
import { Product } from "@/types/database";
import { CmsProductManager } from "@/components/cms/CmsProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Product[] = INITIAL_PRODUCTS;
  let userEmail = "Maya Stone";

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    userEmail = user.email || "Maya Stone";

    const { data: productsData } = await supabase
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

    if (productsData && productsData.length > 0) {
      products = productsData.map((raw: Record<string, unknown>) => {
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
    }
  }

  return (
    <CmsProductManager initialProducts={products} userEmail={userEmail} />
  );
}
