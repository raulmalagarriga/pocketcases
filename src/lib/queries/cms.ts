import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  INITIAL_PRODUCTS,
  ALL_SUPPORTED_MODELS,
  INITIAL_STORE_SETTINGS,
  normalizeStoreSettings,
  normalizeProductColorVariants,
} from "@/lib/seed-data";
import {
  Order,
  Product,
  StockStatus,
  StoreSettings,
  WaitlistSubscription,
} from "@/types/database";
import { ProductFormValues } from "@/lib/validations/productSchema";

const LOCAL_CMS_STORAGE_KEY = "pocket-cases-cms-products-v1";
const LOCAL_ORDERS_STORAGE_KEY = "pocket-cases-cms-orders-v1";
const LOCAL_WAITLIST_STORAGE_KEY = "pocket-cases-cms-waitlist-v1";
const LOCAL_SETTINGS_STORAGE_KEY = "pocket-cases-cms-settings-v1";

export const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: "ord-demo-1",
    order_number: 1042,
    customer_name: "Valentina Mendoza",
    customer_phone: "584129874512",
    customer_city: "Caracas",
    shipping_agency: "Delivery Express Caracas (Chacao)",
    payment_method: "pago_movil",
    payment_reference: "Ref: #849201",
    items: [
      {
        id: "prod-1-iPhone 16 Pro-Grip Mate-#FDE047",
        productId: "prod-1",
        sku: "PKT-FLR-01",
        title: "Retro Floral Groove",
        priceUsd: 28.0,
        imageUrl: INITIAL_PRODUCTS[0].primary_image_url,
        cardBgStyle: "secondary-fixed",
        deviceModel: "iPhone 16 Pro",
        finish: "Grip Mate",
        colorName: "Amarillo Mantequilla",
        colorHex: "#FDE047",
        quantity: 1,
      },
      {
        id: "prod-2-iPhone 16 Pro-Brillo Jelly-#FDA4AF",
        productId: "prod-2",
        sku: "PKT-STW-02",
        title: "Strawberry Milkshake Wave",
        priceUsd: 32.0,
        imageUrl: INITIAL_PRODUCTS[1].primary_image_url,
        cardBgStyle: "primary-fixed",
        deviceModel: "iPhone 16 Pro",
        finish: "Brillo Jelly",
        colorName: "Leche de Fresa",
        colorHex: "#FDA4AF",
        quantity: 1,
      },
    ],
    subtotal_usd: 60.0,
    shipping_usd: 0.0,
    total_usd: 60.0,
    exchange_rate_bcv: 45.8,
    status: "confirmed",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "ord-demo-2",
    order_number: 1041,
    customer_name: "Alejandro Quintero",
    customer_phone: "584143218976",
    customer_city: "Lechería",
    shipping_agency: "Zoom (Agencia Principal Lechería)",
    payment_method: "zelle",
    payment_reference: "Zelle: #AQ-9921",
    items: [
      {
        id: "prod-5-iPhone 15 Pro Max-Brillo Jelly-#FDBA74",
        productId: "prod-5",
        sku: "PKT-SUN-05",
        title: "Sunset Sorbet Glow",
        priceUsd: 34.0,
        imageUrl: INITIAL_PRODUCTS[4].primary_image_url,
        cardBgStyle: "primary-fixed-dim",
        deviceModel: "iPhone 15 Pro Max",
        finish: "Brillo Jelly",
        colorName: "Sorbete de Durazno",
        colorHex: "#FDBA74",
        quantity: 1,
      },
    ],
    subtotal_usd: 34.0,
    shipping_usd: 4.0,
    total_usd: 38.0,
    exchange_rate_bcv: 45.8,
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "ord-demo-3",
    order_number: 1040,
    customer_name: "Mariana Urdaneta",
    customer_phone: "584246551109",
    customer_city: "Maracaibo",
    shipping_agency: "MRW (Delicias Norte)",
    payment_method: "whatsapp",
    payment_reference: "Pago Móvil Banesco #3319",
    items: [
      {
        id: "prod-6-Galaxy S25 Ultra-Grip Mate-#E11D48",
        productId: "prod-6",
        sku: "PKT-CHR-05",
        title: "Cosmic Cherry Pop",
        priceUsd: 28.0,
        imageUrl: INITIAL_PRODUCTS[5].primary_image_url,
        cardBgStyle: "primary-fixed",
        deviceModel: "Galaxy S25 Ultra",
        finish: "Grip Mate",
        colorName: "Glaseado Cereza",
        colorHex: "#E11D48",
        quantity: 2,
      },
    ],
    subtotal_usd: 56.0,
    shipping_usd: 0.0,
    total_usd: 56.0,
    exchange_rate_bcv: 45.8,
    status: "shipped",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(),
  },
];

export const INITIAL_DEMO_WAITLIST: WaitlistSubscription[] = [
  {
    id: "wl-demo-1",
    product_id: "prod-4",
    whatsapp_phone: "584125550192",
    phone_model: "iPhone 16 Pro Max",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "wl-demo-2",
    product_id: "prod-7",
    whatsapp_phone: "584148823401",
    phone_model: "iPhone 15 Pro",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "wl-demo-3",
    product_id: "prod-4",
    whatsapp_phone: "584241197732",
    phone_model: "Galaxy S25 Ultra",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "wl-demo-4",
    product_id: "prod-7",
    whatsapp_phone: "584127749011",
    phone_model: "iPhone 16 Pro",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];


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
      const variants = normalizeProductColorVariants(
        Array.isArray(raw.color_variants) ? raw.color_variants : [],
        String(raw.sku || raw.slug || ""),
        String(raw.primary_image_url || ""),
        Array.isArray(raw.gallery_urls) ? (raw.gallery_urls as string[]) : []
      );
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
    color_variants: normalizeProductColorVariants(
      values.color_variants.map((cv, idx) => ({
        ...cv,
        product_id: productId,
        name_en: cv.name_en || cv.name,
        is_default: idx === 0,
        sort_order: idx + 1,
      })),
      values.sku.toUpperCase(),
      values.primary_image_url,
      values.gallery_urls
    ),
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
            image_url: cv.image_url || constructedProduct.primary_image_url,
          }))
        );

        // Synchronize product_phone_models
        const { data: phoneModels } = await supabase
          .from("phone_models")
          .select("id, name");

        if (phoneModels && phoneModels.length > 0) {
          await supabase
            .from("product_phone_models")
            .delete()
            .eq("product_id", savedId);

          const perModelStock = Math.max(
            1,
            Math.floor(
              constructedProduct.total_stock /
                Math.max(1, values.supported_models.length)
            )
          );

          const modelRows = phoneModels
            .filter((pm: { id: string; name: string }) =>
              values.supported_models.includes(pm.name)
            )
            .map((pm: { id: string; name: string }) => ({
              product_id: savedId,
              phone_model_id: pm.id,
              is_available: true,
              stock_units: perModelStock,
            }));

          if (modelRows.length > 0) {
            await supabase.from("product_phone_models").insert(modelRows);
          }
        }
      }
    } catch {
      // Fallback to local state persistence
    }
  }

  return constructedProduct;
}

export async function batchUpdateProductsInSupabase(
  ids: string[],
  patch: Record<string, unknown>
): Promise<boolean> {
  if (!isSupabaseConfigured() || ids.length === 0) return false;
  const validIds = ids.filter((id) => !id.startsWith("prod-"));
  if (validIds.length === 0) return false;

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .in("id", validIds);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteProductInSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !id || id.startsWith("prod-")) return false;
  try {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

function getLocalCachedOrders(): Order[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Order[];
  } catch {
    return null;
  }
}

function setLocalCachedOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_ORDERS_STORAGE_KEY,
      JSON.stringify(orders)
    );
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchCmsOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Order[] = data.map((raw: Record<string, unknown>) => ({
          id: String(raw.id),
          order_number: Number(raw.order_number ?? 1000),
          customer_name: String(raw.customer_name ?? ""),
          customer_phone: String(raw.customer_phone ?? ""),
          customer_city: String(raw.customer_city ?? "Caracas"),
          shipping_agency: raw.shipping_agency
            ? String(raw.shipping_agency)
            : "Delivery / MRW / Zoom",
          payment_method: (raw.payment_method as Order["payment_method"]) ?? "whatsapp",
          payment_reference: raw.payment_reference
            ? String(raw.payment_reference)
            : null,
          items: Array.isArray(raw.items) ? (raw.items as Order["items"]) : [],
          subtotal_usd: Number(raw.subtotal_usd ?? 0),
          shipping_usd: Number(raw.shipping_usd ?? 0),
          total_usd: Number(raw.total_usd ?? 0),
          exchange_rate_bcv: Number(raw.exchange_rate_bcv ?? 45.8),
          status: (raw.status as Order["status"]) ?? "pending",
          created_at: String(raw.created_at ?? new Date().toISOString()),
        }));
        setLocalCachedOrders(mapped);
        return mapped;
      }
    } catch {
      // Fallback to local / demo orders
    }
  }

  const cached = getLocalCachedOrders();
  if (cached && cached.length > 0) return cached;
  setLocalCachedOrders(INITIAL_DEMO_ORDERS);
  return INITIAL_DEMO_ORDERS;
}

export async function updateOrderStatusInSupabase(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  const cached = getLocalCachedOrders() || INITIAL_DEMO_ORDERS;
  const updatedLocal = cached.map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  setLocalCachedOrders(updatedLocal);

  if (isSupabaseConfigured() && !orderId.startsWith("ord-demo-")) {
    try {
      const supabase = createClient();
      await supabase.from("orders").update({ status }).eq("id", orderId);
    } catch {
      // Fallback handled locally
    }
  }
}

export async function createManualOrderInSupabase(
  order: Omit<Order, "id" | "order_number" | "created_at">
): Promise<Order> {
  const cached = getLocalCachedOrders() || INITIAL_DEMO_ORDERS;
  const nextNumber =
    cached.reduce((max, o) => Math.max(max, o.order_number || 1000), 1040) + 1;

  let createdOrder: Order = {
    ...order,
    id: `ord-demo-${Date.now()}`,
    order_number: nextNumber,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_city: order.customer_city,
          shipping_agency: order.shipping_agency,
          payment_method: order.payment_method,
          payment_reference: order.payment_reference,
          items: order.items,
          subtotal_usd: order.subtotal_usd,
          shipping_usd: order.shipping_usd,
          total_usd: order.total_usd,
          exchange_rate_bcv: order.exchange_rate_bcv,
          status: order.status,
        })
        .select("*")
        .maybeSingle();

      if (!error && data) {
        createdOrder = {
          id: String(data.id),
          order_number: Number(data.order_number ?? nextNumber),
          customer_name: String(data.customer_name),
          customer_phone: String(data.customer_phone),
          customer_city: String(data.customer_city),
          shipping_agency: data.shipping_agency
            ? String(data.shipping_agency)
            : null,
          payment_method: data.payment_method as Order["payment_method"],
          payment_reference: data.payment_reference
            ? String(data.payment_reference)
            : null,
          items: Array.isArray(data.items)
            ? (data.items as Order["items"])
            : order.items,
          subtotal_usd: Number(data.subtotal_usd),
          shipping_usd: Number(data.shipping_usd),
          total_usd: Number(data.total_usd),
          exchange_rate_bcv: Number(data.exchange_rate_bcv),
          status: data.status as Order["status"],
          created_at: String(data.created_at),
        };
      }
    } catch {
      // Fallback to local
    }
  }

  setLocalCachedOrders([createdOrder, ...cached]);
  return createdOrder;
}

function getLocalCachedWaitlist(): WaitlistSubscription[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_WAITLIST_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WaitlistSubscription[];
  } catch {
    return null;
  }
}

function setLocalCachedWaitlist(list: WaitlistSubscription[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_WAITLIST_STORAGE_KEY,
      JSON.stringify(list)
    );
  } catch {
    // Ignore storage errors
  }
}

export async function fetchWaitlistSubscriptions(): Promise<
  WaitlistSubscription[]
> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("waitlist_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: WaitlistSubscription[] = data.map(
          (raw: Record<string, unknown>) => ({
            id: String(raw.id),
            product_id: String(raw.product_id),
            whatsapp_phone: String(raw.whatsapp_phone),
            phone_model: raw.phone_model ? String(raw.phone_model) : null,
            created_at: String(raw.created_at ?? new Date().toISOString()),
          })
        );
        setLocalCachedWaitlist(mapped);
        return mapped;
      }
    } catch {
      // Fallback below
    }
  }

  const cached = getLocalCachedWaitlist();
  if (cached) return cached;
  setLocalCachedWaitlist(INITIAL_DEMO_WAITLIST);
  return INITIAL_DEMO_WAITLIST;
}

export async function deleteWaitlistSubscriptionInSupabase(
  id: string
): Promise<void> {
  const cached = getLocalCachedWaitlist() || INITIAL_DEMO_WAITLIST;
  const filtered = cached.filter((item) => item.id !== id);
  setLocalCachedWaitlist(filtered);

  if (isSupabaseConfigured() && !id.startsWith("wl-demo-")) {
    try {
      const supabase = createClient();
      await supabase.from("waitlist_subscriptions").delete().eq("id", id);
    } catch {
      // Handled locally
    }
  }
}

export function getLocalCachedSettings(): StoreSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    return normalizeStoreSettings(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return null;
  }
}

function setLocalCachedSettings(settings: StoreSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    );
  } catch {
    // Ignore storage errors
  }
}

export async function fetchStoreSettingsCms(): Promise<StoreSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        const parsed = normalizeStoreSettings(data as Record<string, unknown>);
        setLocalCachedSettings(parsed);
        return parsed;
      }
    } catch {
      // Fallback below
    }
  }

  return getLocalCachedSettings() || INITIAL_STORE_SETTINGS;
}

export async function saveStoreSettingsToSupabase(
  settings: StoreSettings
): Promise<StoreSettings> {
  const normalized = normalizeStoreSettings(settings);

  setLocalCachedSettings(normalized);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const basePayload = {
        id: 1,
        store_name: normalized.store_name,
        whatsapp_number: normalized.whatsapp_number,
        bcv_exchange_rate: normalized.bcv_exchange_rate,
        show_ves_reference: normalized.show_ves_reference,
        free_shipping_threshold_usd: normalized.free_shipping_threshold_usd,
        shipping_flat_rate_usd: normalized.shipping_flat_rate_usd,
        pago_movil_details: normalized.pago_movil_details,
        zelle_details: normalized.zelle_details,
      };

      const { error } = await supabase.from("store_settings").upsert(
        {
          ...basePayload,
          logo_url: normalized.logo_url,
          hero_config: normalized.hero_config,
          enable_free_shipping_bar: normalized.enable_free_shipping_bar,
          free_shipping_locked_text: normalized.free_shipping_locked_text,
          free_shipping_unlocked_text: normalized.free_shipping_unlocked_text,
          enable_free_gift_banner: normalized.enable_free_gift_banner,
          free_gift_text: normalized.free_gift_text,
          social_proof_config: normalized.social_proof_config,
          faq_config: normalized.faq_config,
        },
        { onConflict: "id" }
      );

      if (error) {
        await supabase
          .from("store_settings")
          .upsert(basePayload, { onConflict: "id" });
      }
    } catch {
      // Fallback to local
    }
  }

  return normalized;
}

export async function updateColorVariantStockInSupabase(
  variantId: string,
  productId: string,
  newVariantStock: number,
  newTotalStock: number
): Promise<void> {
  const newStatus: StockStatus =
    newTotalStock <= 0
      ? "out_of_stock"
      : newTotalStock <= 10
      ? "low_stock"
      : "in_stock";

  if (!isSupabaseConfigured()) return;

  try {
    const supabase = createClient();
    if (!variantId.startsWith("cv-")) {
      await supabase
        .from("product_color_variants")
        .update({ stock_units: newVariantStock })
        .eq("id", variantId);
    }
    if (!productId.startsWith("prod-")) {
      await supabase
        .from("products")
        .update({
          total_stock: newTotalStock,
          stock_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);
    }
  } catch {
    // Fallback handled by caller's local state
  }
}


