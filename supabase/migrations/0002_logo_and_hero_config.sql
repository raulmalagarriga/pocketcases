-- =============================================================================
-- POCKET CASES - OFFICIAL CONFIGURABLE LOGO & HERO BANNER CONFIG
-- Migration: 0002_logo_and_hero_config.sql
-- Ready to execute in Supabase SQL Editor
-- =============================================================================

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT NOT NULL DEFAULT '/logo.png';

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS hero_config JSONB NOT NULL DEFAULT '{
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
  }'::JSONB;

UPDATE public.store_settings
SET logo_url = '/logo.png'
WHERE id = 1
  AND (
    logo_url IS NULL
    OR logo_url = ''
    OR logo_url LIKE '%lh3.googleusercontent.com/aida/ALJJyrBY2o%'
  );

-- Allow SVG uploads in product-images bucket for vector logos
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
WHERE id = 'product-images';
