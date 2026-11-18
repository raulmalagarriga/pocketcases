-- =============================================================================
-- POCKET CASES - INITIAL SCHEMA, RLS POLICIES, STORAGE & SEED DATA
-- Migration: 0001_initial_schema.sql
-- Ready to execute in Supabase SQL Editor
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 3. TABLES
-- =============================================================================

-- 3.1 Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Phone Models (iPhone 13-16 Pro Max + Samsung Galaxy)
CREATE TABLE IF NOT EXISTS public.phone_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL CHECK (brand IN ('apple', 'samsung')),
  name TEXT NOT NULL UNIQUE,
  series TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_badge TEXT NOT NULL DEFAULT 'MagSafe Tough',
  filter_tags TEXT[] NOT NULL DEFAULT ARRAY['iphone']::TEXT[],
  promo_tag TEXT, -- e.g. 'BESTSELLER', 'HOT DROP', 'WAITLIST', 'UNPUBLISHED'
  price_usd NUMERIC(10, 2) NOT NULL CHECK (price_usd >= 0),
  compare_at_price_usd NUMERIC(10, 2) CHECK (compare_at_price_usd IS NULL OR compare_at_price_usd >= 0),
  cost_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (cost_usd >= 0),
  primary_image_url TEXT NOT NULL,
  gallery_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  card_bg_style TEXT NOT NULL DEFAULT 'secondary-fixed', -- 'secondary-fixed' | 'primary-fixed' | 'surface-container' | 'primary-fixed-dim'
  finishes TEXT[] NOT NULL DEFAULT ARRAY['Grip Mate', 'Brillo Jelly']::TEXT[],
  default_finish TEXT NOT NULL DEFAULT 'Grip Mate',
  total_stock INT NOT NULL DEFAULT 0 CHECK (total_stock >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 10 CHECK (low_stock_threshold >= 0),
  track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'draft')),
  is_live BOOLEAN NOT NULL DEFAULT TRUE,
  allow_whatsapp_checkout BOOLEAN NOT NULL DEFAULT TRUE,
  show_low_stock_badge BOOLEAN NOT NULL DEFAULT FALSE,
  restock_badge_text TEXT,
  restock_select_text TEXT,
  is_featured_hero BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3.4 Product Color Variants (Swatches & Individual Color Stock)
CREATE TABLE IF NOT EXISTS public.product_color_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,          -- Español (Storefront): ej. 'Amarillo Mantequilla'
  name_en TEXT,                -- Inglés (CMS): ej. 'Butter Yellow'
  hex_code TEXT NOT NULL,      -- ej. '#FDE047'
  sku_suffix TEXT NOT NULL,    -- ej. '-YLW'
  stock_units INT NOT NULL DEFAULT 0 CHECK (stock_units >= 0),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Product Supported Phone Models (Many-to-Many Inventory Matrix)
CREATE TABLE IF NOT EXISTS public.product_phone_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  phone_model_id UUID NOT NULL REFERENCES public.phone_models(id) ON DELETE CASCADE,
  stock_units INT NOT NULL DEFAULT 10 CHECK (stock_units >= 0),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(product_id, phone_model_id)
);

-- 3.6 Store Settings (Venezuela Payments, BCV Rate, Brand Logo & Hero Banner Config)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name TEXT NOT NULL DEFAULT 'Pocket Cases',
  logo_url TEXT NOT NULL DEFAULT '/logo.png',
  whatsapp_number TEXT NOT NULL DEFAULT '584120000000',
  bcv_exchange_rate NUMERIC(10, 2) NOT NULL DEFAULT 45.80,
  show_ves_reference BOOLEAN NOT NULL DEFAULT TRUE,
  free_shipping_threshold_usd NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
  shipping_flat_rate_usd NUMERIC(10, 2) NOT NULL DEFAULT 4.00,
  enable_free_shipping_bar BOOLEAN NOT NULL DEFAULT TRUE,
  free_shipping_locked_text TEXT NOT NULL DEFAULT '¡Agrega {amount} más para envío GRATIS!',
  free_shipping_unlocked_text TEXT NOT NULL DEFAULT '¡Desbloqueaste envío GRATIS a nivel nacional!',
  enable_free_gift_banner BOOLEAN NOT NULL DEFAULT TRUE,
  free_gift_text TEXT NOT NULL DEFAULT '¡Charm de regalo incluido!',
  pago_movil_details JSONB NOT NULL DEFAULT '{"bank": "Banesco (0134)", "phone": "0412-0000000", "rif": "J-50123456-0"}'::JSONB,
  zelle_details JSONB NOT NULL DEFAULT '{"email": "pagos@pocketcases.co", "holder": "Pocket Cases Inc."}'::JSONB,
  hero_config JSONB NOT NULL DEFAULT '{
    "badge_text": "EDICIÓN 2025 • NUEVO LANZAMIENTO",
    "headline_prefix": "Viste tu cel con",
    "headline_highlight": "puro estilo",
    "headline_suffix": "brutal.",
    "subheadline": "Fundas estéticas y resistentes contra caídas, con protección militar y ese brillo retro Y2K que convierte tus fotos de espejo en sesiones de fotos.",
    "rating_score": "4.9 / 5",
    "rating_text": "de más de 12.000 clientes felices",
    "primary_cta_text": "Ver Más Vendidos",
    "secondary_cta_text": "Explorar MagSafe",
    "stamp_line_1": "DROP Y2K",
    "stamp_line_2": "GEN-5 CORE",
    "feature_bubble_title": "Amortiguación Doble Capa",
    "feature_bubble_subtitle": "Esquinas con bolsas de aire anticaída",
    "feature_bubble_badge": "Ultra Resistente",
    "card_1": {
      "badge": "MÁS VENDIDO",
      "title": "Strawberry Wave",
      "price_text": "$32.00",
      "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBU-bAWiHhlC25-gUa_bsY4bZsc0C_TsocUBjFSU_tQgwJaIj3D0ewmAYzpZ4-aoIEgFqChwtA1B_ZzDmeWwqdmtyAlOCQuhNM0Hid7QrUvYuRU_0BGpFW7-O_vche5I4zV5tjKd-DNXXU7Gsaua_CU7NsbJwXJriM4QuMQho97gF2y15XZ592b-fu-JuioG4U9wJiXvWLwvWQjr2akKE6-86wb-eiMu7fwW_NHXw",
      "search_keyword": "Strawberry",
      "category_filter": "all"
    },
    "card_2": {
      "badge": "MAGSAFE",
      "title": "Floral Groove",
      "price_text": "$28.00",
      "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA",
      "search_keyword": "",
      "category_filter": "magsafe"
    }
  }'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER set_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3.7 Orders (WhatsApp & VE Checkout Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL DEFAULT 'Caracas',
  shipping_agency TEXT DEFAULT 'Delivery / MRW / Zoom',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('whatsapp', 'pago_movil', 'zelle', 'card')),
  payment_reference TEXT,
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  subtotal_usd NUMERIC(10, 2) NOT NULL,
  shipping_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_usd NUMERIC(10, 2) NOT NULL,
  exchange_rate_bcv NUMERIC(10, 2) NOT NULL DEFAULT 45.80,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Waitlist Subscriptions ("Avisarme cuando vuelva" / "Unirme a la lista de espera")
CREATE TABLE IF NOT EXISTS public.waitlist_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  whatsapp_phone TEXT NOT NULL,
  phone_model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_color_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_phone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Storefront & CMS)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read phone_models" ON public.phone_models FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product_color_variants" ON public.product_color_variants FOR SELECT USING (true);
CREATE POLICY "Public read product_phone_models" ON public.product_phone_models FOR SELECT USING (true);
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);

-- Authenticated Admin Write Policies (CMS)
CREATE POLICY "Admin write categories" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write phone_models" ON public.phone_models
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write products" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write product_color_variants" ON public.product_color_variants
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write product_phone_models" ON public.product_phone_models
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write store_settings" ON public.store_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders & Waitlist Policies (Public Insert, Admin Read/Update/Delete)
CREATE POLICY "Public insert orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin manage orders" ON public.orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public insert waitlist" ON public.waitlist_subscriptions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin manage waitlist" ON public.waitlist_subscriptions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- 5. SUPABASE STORAGE BUCKET (product-images)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
CREATE POLICY "Public read product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated upload product-images" ON storage.objects;
CREATE POLICY "Authenticated upload product-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated update product-images" ON storage.objects;
CREATE POLICY "Authenticated update product-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated delete product-images" ON storage.objects;
CREATE POLICY "Authenticated delete product-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- =============================================================================
-- 6. SEED DATA (CATEGORIES, PHONE MODELS, SETTINGS & 9 REFERENCE PRODUCTS)
-- =============================================================================

-- 6.1 Store Settings
INSERT INTO public.store_settings (
  id, store_name, whatsapp_number, bcv_exchange_rate, show_ves_reference,
  free_shipping_threshold_usd, shipping_flat_rate_usd
)
VALUES (
  1, 'Pocket Cases', '584120000000', 45.80, true, 35.00, 4.00
)
ON CONFLICT (id) DO NOTHING;

-- 6.2 Categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('MagSafe Tough', 'magsafe-tough', 'Doble armadura con anillo magnético MagSafe de alto poder', 1),
  ('Dual Shock', 'dual-shock', 'Bordes con absorción de impactos y tecnología anti-amarilleo', 2),
  ('Bio-Resina', 'bio-resin', 'Polímero ecológico biodegradable resistente a caídas', 3),
  ('Heavy Duty Armor', 'heavy-duty-armor', 'Armadura de alta resistencia grado militar 3m', 4),
  ('Crystal Clear', 'crystal-clear', 'Tecnología Tough Transparente con filtro UV anti-amarilleo', 5),
  ('Mirror MagSafe', 'mirror-magsafe', 'Acabado espejo cromado compatible con MagSafe', 6),
  ('Ultra Slim', 'ultra-slim', 'Perfil pastel ultradelgado con agarre suave', 7),
  ('Vegan Leather', 'vegan-leather', 'Cuero vegano texturizado con detalles metálicos', 8)
ON CONFLICT (slug) DO NOTHING;

-- 6.3 Phone Models (12 iPhone Models + 2 Samsung Galaxy Models)
INSERT INTO public.phone_models (brand, name, series, sort_order) VALUES
  ('apple', 'iPhone 16 Pro Max', 'Serie iPhone 16 / 15', 1),
  ('apple', 'iPhone 16 Pro', 'Serie iPhone 16 / 15', 2),
  ('apple', 'iPhone 16 Plus', 'Serie iPhone 16 / 15', 3),
  ('apple', 'iPhone 16', 'Serie iPhone 16 / 15', 4),
  ('apple', 'iPhone 15 Pro Max', 'Serie iPhone 16 / 15', 5),
  ('apple', 'iPhone 15 Pro', 'Serie iPhone 16 / 15', 6),
  ('apple', 'iPhone 15', 'Serie iPhone 16 / 15', 7),
  ('apple', 'iPhone 14 Pro Max', 'Serie iPhone 14 / 13', 8),
  ('apple', 'iPhone 14 Pro', 'Serie iPhone 14 / 13', 9),
  ('apple', 'iPhone 14', 'Serie iPhone 14 / 13', 10),
  ('apple', 'iPhone 13 Pro Max', 'Serie iPhone 14 / 13', 11),
  ('apple', 'iPhone 13 Pro', 'Serie iPhone 14 / 13', 12),
  ('apple', 'iPhone 13', 'Serie iPhone 14 / 13', 13),
  ('samsung', 'Galaxy S25 Ultra', 'Samsung Galaxy', 14),
  ('samsung', 'Galaxy S24 Ultra', 'Samsung Galaxy', 15)
ON CONFLICT (name) DO NOTHING;

-- 6.4 Products Seed (8 Storefront Products + 1 Unpublished Draft from CMS)
DO $$
DECLARE
  cat_magsafe UUID;
  cat_dual UUID;
  cat_bio UUID;
  cat_heavy UUID;
  cat_clear UUID;
  cat_mirror UUID;
  cat_slim UUID;
  cat_leather UUID;

  p1_id UUID;
  p2_id UUID;
  p3_id UUID;
  p4_id UUID;
  p5_id UUID;
  p6_id UUID;
  p7_id UUID;
  p8_id UUID;
  p9_id UUID;
BEGIN
  SELECT id INTO cat_magsafe FROM public.categories WHERE slug = 'magsafe-tough';
  SELECT id INTO cat_dual FROM public.categories WHERE slug = 'dual-shock';
  SELECT id INTO cat_bio FROM public.categories WHERE slug = 'bio-resin';
  SELECT id INTO cat_heavy FROM public.categories WHERE slug = 'heavy-duty-armor';
  SELECT id INTO cat_clear FROM public.categories WHERE slug = 'crystal-clear';
  SELECT id INTO cat_mirror FROM public.categories WHERE slug = 'mirror-magsafe';
  SELECT id INTO cat_slim FROM public.categories WHERE slug = 'ultra-slim';
  SELECT id INTO cat_leather FROM public.categories WHERE slug = 'vegan-leather';

  -- Product 1: Retro Floral Groove
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-FLR-01',
    'Retro Floral Groove',
    'retro-floral-groove',
    'Doble Armadura MagSafe',
    cat_magsafe,
    'MagSafe Tough',
    ARRAY['iphone', 'samsung', 'magsafe'],
    'BESTSELLER',
    28.00, 36.00, 7.20,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w',
    ARRAY[
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw'
    ],
    'secondary-fixed',
    'Grip Mate',
    24, 10, 'in_stock',
    true, true, false, true, 1
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p1_id;

  -- Product 2: Strawberry Milkshake Wave
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-STW-02',
    'Strawberry Milkshake Wave',
    'strawberry-milkshake-wave',
    'Anti-Amarilleo / Absorción de impactos',
    cat_dual,
    'Dual Shock',
    ARRAY['iphone', 'samsung', 'collabs'],
    'HOT DROP',
    32.00, 38.00, 8.10,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDA6u7m5nokrmgvMJnZSoO7w1v7DsVk5Q_3n-WB7SpTdkzZCMaI_958emOUsxulpHO5QfwTvSBOugqqtd4YiocNwFErRXNJ3PxFT5-nlEP9vyJRMkyTp02EIPOflLiqrbll_4H1oM8pxCAb_9Pf8V2GDWp5kL9HL7-VFCzviSWN-UHNXM9nwYWAzTO3ByEtRxkWnD1_SxuOZ_K3qNJxdv_eStFEERbdR_1LpfvdTg',
    ARRAY[
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADQ1ABhJhdWqSa_pm1jW7XPR0T5dZ6ojOlpUsZ1Q-oK0a8IGIomDMRHqbfeWhcH29_mXnAIaJUKdPSpvVTNKjTRozXjFf7jppSTF_2M7beNf7yhI-kkX2F8IqBJ6tEDtotekZWqYenEYWgJNUtcpEzNaLGfQxzz7d502XMG_GYGEUQXaBFN_itANhGb_i5GvnVNrVcwxQylFPvWfIs-vsgsf8I9ZkhypHFSy4fYA'
    ],
    'primary-fixed',
    'Brillo Jelly',
    88, 10, 'in_stock',
    true, true, false, true, 2
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p2_id;

  -- Product 3: Lilac Butter Checker (Low Stock)
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-LIL-03',
    'Lilac Butter Checker',
    'lilac-butter-checker',
    'Polímero Bio-Resina Eco',
    cat_bio,
    'Bio-Resina',
    ARRAY['iphone', 'slim'],
    NULL,
    26.00, 30.00, 6.50,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBz06aT1HBB7QHgq-plDLUnsbDm1qJmLIAKqq0GQTD1r_P8K5hSFXisDXyIDRu7TNVSXhYkIpGiq2JoaZW1Bi_BQJkFOalu_DF1IgUjc-1oM_PWJHkf3j98a9HTttNW5-eTT6ouL637-Qf_CEq9fX1s_EoPSYG5ApIbTLV3prH37SXicBfieb_3BrxMycavaqg0J8ij-gMUEu6QjVgJ-jweOy8eRxEy9evi3Mu5hQ',
    ARRAY[
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvDGtqlKuHZhwUcfol5zmf2IeRyEd0TsBNAMGLbF9sgvpQsoqEvO4blj9Y2O6xJ3arqXpwTcN325LTwUOwd-ycWOpc9zn2ZTpo4glENUWVkXcEVd5t8OHap_YMMBJC9yJfnyBlodaGhFNeR34V2xeiggYUjYSVP6eFrkUQGaQMXdhsRX2EK3HiybgBTs_v8WsIIwo56ZWTyUn0FKMRbNbL9JZbtOdc1AaehrS3mA'
    ],
    'surface-container',
    'Grip Mate',
    3, 10, 'low_stock',
    true, true, true, false, 3
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p3_id;

  -- Product 4: Matcha Latte Swirl (Out of Stock)
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge,
    restock_badge_text, restock_select_text, is_featured_hero, sort_order
  ) VALUES (
    'PKT-MCH-04',
    'Matcha Latte Swirl',
    'matcha-latte-swirl',
    'Armadura de Alta Resistencia',
    cat_heavy,
    'Heavy Duty Armor',
    ARRAY['iphone', 'samsung'],
    'WAITLIST',
    30.00, NULL, 7.80,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtZMstY5Hhw_fUqdnnKwwgUTCBrq49uD3c8flukXCM_FzVspVxXH-QaTdNd1yzu2ilHsDiAU3bxwbA07MUkXnu1Vd74nlbyL1EtIjNb9cgHmb96Hcqr8QWqxZFXv3Bh9CA3m0U9thh6OzUHi1fndbnMfvDXwf6QblPb8q1jmZokhXmnLjGZZDlS_NEbFVqHzb-Ro0cFqI2l0AOA0gXpsOYwx2n-ScfU2pryFYmaA',
    ARRAY[
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdrerItfNYyDy-batQxdIXLC9UCouVAznWJ9M9EJWBjpMe9FfiRTdsYV0cpXmTVPoZMH99RI5QGA4ESZGXmF7Hb1xq_6_wM6Pta2iYU45JkgPlZ-kxXG_IEtXBLZJlhlowd162wG6VnT2GXZLUQa2oHSCtWn5VQADWhO98IsR2npVQkx1XPaJ2QGDfwx-0OF8wcwMODjMp23lH-7uqOyyOPaaujanIsx8p5J7kvQ'
    ],
    'secondary-container',
    'Grip Mate',
    0, 10, 'out_of_stock',
    true, true, false,
    'Vuelve en 3 días', 'Todos los modelos reservados', false, 4
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p4_id;

  -- Product 5: Sunset Sorbet Glow
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-SUN-05',
    'Sunset Sorbet Glow',
    'sunset-sorbet-glow',
    'Acabado Espejo MagSafe',
    cat_mirror,
    'Mirror MagSafe',
    ARRAY['iphone', 'magsafe', 'collabs'],
    'HOT DROP',
    34.00, 42.00, 8.50,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBplCCBimsW_P-HAj-QIxpJOqiUcrJGBQbh7YM9ioFAXRQkiJk8P-s967Lrchs2o0d3GL7WbyP2uQ2b2wreWfC06q7J0GHGYNUapyB59fEtO41KlZNFBn51Ds6eWxm8e3qhDTvfwom1eSq7r66d9V5nesRWCG4xCY_9iLhgpM0fpupEe0jZSbzlhaZpg0HzO1PZud0c1awwifupXZzlT32iLprApkRdAvfwemNc_w',
    ARRAY[]::TEXT[],
    'primary-fixed-dim',
    'Brillo Jelly',
    32, 10, 'in_stock',
    true, true, false, false, 5
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p5_id;

  -- Product 6: Cosmic Cherry Pop
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-CHR-05',
    'Cosmic Cherry Pop',
    'cosmic-cherry-pop',
    'Tecnología Tough Transparente',
    cat_clear,
    'Cristal Clear',
    ARRAY['iphone', 'samsung', 'collabs'],
    NULL,
    28.00, NULL, 6.90,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAGTbuAS2_Bdlyix431XhXGFjcVIMo_i1lD1tmvxKWD7xUOOBLBhF_P-nepVu5SoaeUIps5rIr06780ISBy0KtZNi71TMPfzpf0WG2TEOCr9TQ0o5ptwgnJKKFdjSywirwUz_NYh98SrYIHCEPy59rTw3zxfP2TWCrXD4y_UAtaEzfAjsC0QUbhbSIy9vNxxQy_88Y3rLWPGU7j5Vt0sKK93h-U9skOY75fuY8cWQ',
    ARRAY[
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXHqp0eQ1syQdd7lYOliwIEoUBZr74lh1Q_dSx0Z9Aa0A78TNym37MqTxCohvokykm-jTRP03Wp6lvJDeYEm8hs6TuvYQfQcZjqLUIQA0LGDUkv4ofIYd_uGzrYqPDC7e-k1Ew6UMmcXiB8iBkjMSfE_1rJzQ-Dey4U3lwUjrpTk6Y86l_ssMHzW_B1HV40qgpfHsa5flfhHqfavL7J_O6PfEl3n2Q9AspGTitQ'
    ],
    'primary-fixed',
    'Grip Mate',
    45, 10, 'in_stock',
    true, true, false, false, 6
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p6_id;

  -- Product 7: Vanilla Dream Cloud (Sold Out / Waitlist)
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge,
    restock_badge_text, restock_select_text, is_featured_hero, sort_order
  ) VALUES (
    'PKT-VAN-07',
    'Vanilla Dream Cloud',
    'vanilla-dream-cloud',
    'Grip Mate Suave',
    cat_slim,
    'Pastel Delgado',
    ARRAY['iphone', 'slim'],
    'WAITLIST',
    25.00, NULL, 6.20,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDprCKxlNuVFDODbR8iQ1rPlUkQBP1O8rpie_sCDOQcT0QR_J1kKJxHLluk78S7MKjn66w6bGmNgOyTa8oWPuFLPQCSL1hyodSh2KamBx78ReDXkIiZd_iemcXDOA4KV0NEm94i5OMtw-f0rc2fm20FLDR69XfLGD-uAHhmv7-bmScVyEHmX-2I2rc7OiVltAkGq_UAxxIXnQEgkwWsitVh_IzjOcLsmIy8Biilzw',
    ARRAY[]::TEXT[],
    'surface-container-high',
    'Grip Mate',
    0, 10, 'out_of_stock',
    true, true, false,
    'Lista abierta', 'Lote 04 en camino (iPhone 13–16)', false, 7
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p7_id;

  -- Product 8: Pistachio Vintage Daisy
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-PST-08',
    'Pistachio Vintage Daisy',
    'pistachio-vintage-daisy',
    'Armadura Grip Ultra Delgada',
    cat_slim,
    'Ultra Slim',
    ARRAY['iphone', 'samsung', 'slim'],
    NULL,
    29.00, 35.00, 7.40,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDanXPC2QSG2vv4qnFkuTiJo9rCIcEu3qODeoYo0GdkJ-bogCtTWEBjkUfXlUwoW-yA-EfYF78Zr5eB7FRxmVYOiIH2wNKQZhXjvkooFx_6dfibc_WJONamjiFTAI-UaO-DsK4XkaAzkv4fDxm0kRDqkH7sSRiILm84OH_MlVvFaKHd6mrK5YfwF42VZVj_gg2tAUbmflzOZT4S-GMuddDmS-DbJwbZeRrewQDiAw',
    ARRAY[]::TEXT[],
    'secondary-fixed',
    'Grip Mate',
    15, 10, 'in_stock',
    true, true, false, false, 8
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p8_id;

  -- Product 9: Midnight Velvet Noir (CMS Draft / Unpublished Product)
  INSERT INTO public.products (
    sku, title, slug, subtitle, category_id, category_badge, filter_tags, promo_tag,
    price_usd, compare_at_price_usd, cost_usd, primary_image_url, gallery_urls,
    card_bg_style, default_finish, total_stock, low_stock_threshold, stock_status,
    is_live, allow_whatsapp_checkout, show_low_stock_badge, is_featured_hero, sort_order
  ) VALUES (
    'PKT-MID-06',
    'Midnight Velvet Noir',
    'midnight-velvet-noir',
    'Cuero Vegano Texturizado',
    cat_leather,
    'Vegan Leather',
    ARRAY['iphone', 'magsafe'],
    'UNPUBLISHED',
    35.00, 42.00, 9.50,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoO47GzVrs0Qf7u0v1pTG-Xq8nUYA71Z2vsS6c38x1Qe4hudtkCchId0cWcFXksBla8QURnf9_TGaNs5wORPabW-tUdR7v_WY8pjahhruTYcNTVC5w_DBM1o4XA3CVPuXRj10E26QuTAeSMmiSR6VJXCTtA3rlQhp7OY-IlFhTBRQXvp1qypUubN1C3isXoEhtFWsjVw30IIJidFW9is6yMRMbESjVLhwaNV6VBg',
    ARRAY[]::TEXT[],
    'surface-container',
    'Grip Mate',
    12, 10, 'draft',
    false, true, false, false, 9
  )
  ON CONFLICT (sku) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p9_id;

  -- Clear existing color variants for idempotency before re-seeding
  DELETE FROM public.product_color_variants WHERE product_id IN (p1_id, p2_id, p3_id, p4_id, p5_id, p6_id, p7_id, p8_id, p9_id);

  -- Color Variants for Product 1: Retro Floral Groove
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p1_id, 'Amarillo Mantequilla', 'Butter Yellow', '#FDE047', '-YLW', 8, true, 1),
    (p1_id, 'Flor Pastel', 'Pastel Blossom', '#F472B6', '-BLS', 6, false, 2),
    (p1_id, 'Menta Glaseada', 'Mint Glaze', '#86EFAC', '-MNT', 5, false, 3),
    (p1_id, 'Lila Haze', 'Lilac Haze', '#C084FC', '-LLC', 5, false, 4);

  -- Color Variants for Product 2: Strawberry Milkshake Wave
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p2_id, 'Leche de Fresa', 'Strawberry Milk', '#FDA4AF', '-STM', 38, true, 1),
    (p2_id, 'Crema Glaseada', 'Cream Gloss', '#FFF1F2', '-CRM', 28, false, 2),
    (p2_id, 'Tono Rosado', 'Rosy Tint', '#FB7185', '-RSY', 22, false, 3);

  -- Color Variants for Product 3: Lilac Butter Checker
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p3_id, 'Sueño Lila', 'Lilac Dream', '#D8B4FE', '-LIL', 1, true, 1),
    (p3_id, 'Crema Mantequilla', 'Butter Cream', '#FEF08A', '-BTR', 1, false, 2),
    (p3_id, 'Lavanda Chill', 'Chill Lavender', '#A855F7', '-LAV', 1, false, 3);

  -- Color Variants for Product 4: Matcha Latte Swirl
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p4_id, 'Matcha Latte', 'Matcha Foam', '#86EFAC', '-MCH', 0, true, 1),
    (p4_id, 'Espuma de Leche', 'Milk Swirl', '#F1F5F9', '-MLK', 0, false, 2);

  -- Color Variants for Product 5: Sunset Sorbet Glow
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p5_id, 'Sorbete de Durazno', 'Peach Sorbet', '#FDBA74', '-PCH', 10, true, 1),
    (p5_id, 'Hora Dorada', 'Golden Hour', '#FCD34D', '-GLD', 8, false, 2),
    (p5_id, 'Brillo Atardecer', 'Sunset Glow', '#FB7185', '-SUN', 8, false, 3),
    (p5_id, 'Oro Rosa', 'Rose Gold', '#F43F5E', '-RSG', 6, false, 4);

  -- Color Variants for Product 6: Cosmic Cherry Pop
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p6_id, 'Glaseado Cereza', 'Cherry Glaze', '#E11D48', '-CHR', 20, true, 1),
    (p6_id, 'Brillo Cristal', 'Crystal Clear', '#F1F5F9', '-CLR', 15, false, 2),
    (p6_id, 'Berry Fizz', 'Berry Fizz', '#BE123C', '-BRY', 10, false, 3);

  -- Color Variants for Product 7: Vanilla Dream Cloud
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p7_id, 'Nube Vainilla', 'Vanilla Cloud', '#FEF9C3', '-VAN', 0, true, 1),
    (p7_id, 'Blanco Crema', 'Cream White', '#FFFFFF', '-WHT', 0, false, 2),
    (p7_id, 'Avena Suave', 'Soft Oat', '#E2E8F0', '-OAT', 0, false, 3);

  -- Color Variants for Product 8: Pistachio Vintage Daisy
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p8_id, 'Pistacho Daisy', 'Pistachio Daisy', '#BBF7D0', '-PST', 5, true, 1),
    (p8_id, 'Crema Matcha', 'Matcha Cream', '#86EFAC', '-MTC', 4, false, 2),
    (p8_id, 'Mantequilla Daisy', 'Butter Daisy', '#FEF08A', '-BTD', 3, false, 3),
    (p8_id, 'Bruma Salvia', 'Sage Mist', '#A7F3D0', '-SGE', 3, false, 4);

  -- Color Variants for Product 9: Midnight Velvet Noir
  INSERT INTO public.product_color_variants (product_id, name, name_en, hex_code, sku_suffix, stock_units, is_default, sort_order) VALUES
    (p9_id, 'Negro Terciopelo', 'Velvet Black', '#1E293B', '-BLK', 8, true, 1),
    (p9_id, 'Grafito Mate', 'Matte Graphite', '#475569', '-GRP', 4, false, 2);

  -- Associate all products with supported phone models
  INSERT INTO public.product_phone_models (product_id, phone_model_id, stock_units, is_available)
  SELECT p.id, pm.id,
    CASE WHEN p.stock_status = 'out_of_stock' THEN 0 ELSE GREATEST(1, p.total_stock / 5) END,
    CASE WHEN p.stock_status = 'out_of_stock' THEN false ELSE true END
  FROM public.products p
  CROSS JOIN public.phone_models pm
  ON CONFLICT (product_id, phone_model_id) DO NOTHING;

END $$;
