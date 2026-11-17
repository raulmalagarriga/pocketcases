export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "draft";

export type CardBgStyle =
  | "secondary-fixed"
  | "primary-fixed"
  | "surface-container"
  | "primary-fixed-dim"
  | "secondary-container"
  | "surface-container-high";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface PhoneModel {
  id: string;
  brand: "apple" | "samsung";
  name: string;
  series: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductColorVariant {
  id: string;
  product_id: string;
  name: string;
  name_en: string | null;
  hex_code: string;
  sku_suffix: string;
  stock_units: number;
  is_default: boolean;
  sort_order: number;
}

export interface ProductPhoneModel {
  id: string;
  product_id: string;
  phone_model_id: string;
  stock_units: number;
  is_available: boolean;
  phone_model?: PhoneModel;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  subtitle: string;
  category_id: string | null;
  category_badge: string;
  filter_tags: string[];
  promo_tag: string | null;
  price_usd: number;
  compare_at_price_usd: number | null;
  cost_usd: number;
  primary_image_url: string;
  gallery_urls: string[];
  card_bg_style: CardBgStyle;
  finishes: string[];
  default_finish: string;
  total_stock: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  stock_status: StockStatus;
  is_live: boolean;
  allow_whatsapp_checkout: boolean;
  show_low_stock_badge: boolean;
  restock_badge_text: string | null;
  restock_select_text: string | null;
  is_featured_hero: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  color_variants: ProductColorVariant[];
  supported_models: string[];
}

export interface StoreSettings {
  id: number;
  store_name: string;
  whatsapp_number: string;
  bcv_exchange_rate: number;
  show_ves_reference: boolean;
  free_shipping_threshold_usd: number;
  shipping_flat_rate_usd: number;
  pago_movil_details: {
    bank: string;
    phone: string;
    rif: string;
  };
  zelle_details: {
    email: string;
    holder: string;
  };
}

export interface CartItem {
  id: string; // composite key: `${productId}-${deviceModel}-${finish}-${colorHex}`
  productId: string;
  sku: string;
  title: string;
  priceUsd: number;
  imageUrl: string;
  cardBgStyle: CardBgStyle;
  deviceModel: string;
  finish: string;
  colorName: string;
  colorHex: string;
  quantity: number;
}
