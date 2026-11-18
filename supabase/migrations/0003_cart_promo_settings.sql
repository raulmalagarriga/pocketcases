-- =============================================================================
-- POCKET CASES - CART PROMO SETTINGS (FREE SHIPPING BAR & FREE GIFT BANNER)
-- Migration: 0003_cart_promo_settings.sql
-- =============================================================================

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS enable_free_shipping_bar BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS free_shipping_locked_text TEXT NOT NULL DEFAULT '¡Agrega {amount} más para envío GRATIS!',
  ADD COLUMN IF NOT EXISTS free_shipping_unlocked_text TEXT NOT NULL DEFAULT '¡Desbloqueaste envío GRATIS a nivel nacional!',
  ADD COLUMN IF NOT EXISTS enable_free_gift_banner BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS free_gift_text TEXT NOT NULL DEFAULT '¡Charm de regalo incluido!';
