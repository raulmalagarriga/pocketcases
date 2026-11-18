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
  image_url?: string | null;
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

export interface HeroShowcaseCard {
  badge: string;
  title: string;
  price_text: string;
  image_url: string;
  search_keyword: string;
  category_filter: string;
}

export interface HeroBannerConfig {
  badge_text: string;
  headline_prefix: string;
  headline_highlight: string;
  headline_suffix: string;
  subheadline: string;
  rating_score: string;
  rating_text: string;
  primary_cta_text: string;
  secondary_cta_text: string;
  stamp_line_1: string;
  stamp_line_2: string;
  feature_bubble_title: string;
  feature_bubble_subtitle: string;
  feature_bubble_badge: string;
  card_1: HeroShowcaseCard;
  card_2: HeroShowcaseCard;
}

export interface SocialProofItem {
  id: string;
  image_url: string;
  quote: string;
  handle: string;
  rating: number;
}

export interface SocialProofConfig {
  enabled: boolean;
  hashtag: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  items: SocialProofItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqConfig {
  enabled: boolean;
  badge_text: string;
  title: string;
  items: FaqItem[];
}

export interface StoreSettings {
  id: number;
  store_name: string;
  logo_url: string;
  whatsapp_number: string;
  bcv_exchange_rate: number;
  show_ves_reference: boolean;
  free_shipping_threshold_usd: number;
  shipping_flat_rate_usd: number;
  enable_free_shipping_bar?: boolean;
  free_shipping_locked_text?: string;
  free_shipping_unlocked_text?: string;
  enable_free_gift_banner?: boolean;
  free_gift_text?: string;
  pago_movil_details: {
    bank: string;
    phone: string;
    rif: string;
  };
  zelle_details: {
    email: string;
    holder: string;
  };
  hero_config: HeroBannerConfig;
  social_proof_config?: SocialProofConfig;
  faq_config?: FaqConfig;
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

export type OrderPaymentMethod = "whatsapp" | "pago_movil" | "zelle" | "card";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "cancelled";

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  shipping_agency: string | null;
  payment_method: OrderPaymentMethod;
  payment_reference: string | null;
  items: CartItem[];
  subtotal_usd: number;
  shipping_usd: number;
  total_usd: number;
  exchange_rate_bcv: number;
  status: OrderStatus;
  created_at: string;
}

export interface WaitlistSubscription {
  id: string;
  product_id: string;
  whatsapp_phone: string;
  phone_model: string | null;
  created_at: string;
}

