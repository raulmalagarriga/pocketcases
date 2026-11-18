-- =============================================================================
-- POCKET CASES - COLOR VARIANT IMAGES + CONFIGURABLE SOCIAL PROOF & FAQ
-- Migration: 0004_variants_images_and_landing_configs.sql
-- =============================================================================

-- 1. Add image_url to product_color_variants
ALTER TABLE public.product_color_variants
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Add social_proof_config and faq_config to store_settings
ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS social_proof_config JSONB NOT NULL DEFAULT '{
    "enabled": true,
    "hashtag": "#POCKETCASESENLACALLE",
    "title": "En la Calle con Pocket Cases",
    "subtitle": "Fotos reales compartidas por nuestra comunidad en Caracas, Lechería, Maracaibo y más.",
    "cta_text": "Etiqueta a @pocketcases para aparecer",
    "cta_url": "https://instagram.com",
    "items": [
      {
        "id": "sp-1",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD_zRR7YhS3NVSrRBKEYa6u5_hHGnxMc89pxY3TZmfInVmov4-BsJusIpXe-637MsyZ7ouClHeYY_VTvrR1nC8V4eXctFAEScoW5ZuAkSrcGM3amrwmVfHZTO2HMktxplQ_2ctL0dCmr1j-TwDssKwSHHHMYPctCJ5v9gu_0vJrUpcacIDPE5NCs8SaKE0tIqId9aO3EG-QIspO_DufqPrg5wfEb3Y2sF_9iZpCeA",
        "quote": "\"¡Se me cayó bajando las escaleras y ni un solo rasguño! Es demasiado bella.\"",
        "handle": "@mia.in.ccs • Compradora Verificada",
        "rating": 5
      },
      {
        "id": "sp-2",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDKUmmJnRbu6TGrqwvH5KeQLWpDJhOta1805Mls64d2lTsZZIcIt9rfNOu9-XncnKywOLQH6GbPnrffG5OKsGyFPr0K3dSDCE-FNB-FniG43qh0o-vEkdHsqM1FT03b-B8I2BkO8tLmmyrkuVhdTN521HwcZKa3CtFROR87H9NaCx0PrLrbc-rpS-UdZv46sfTumUSVsL-M2EtuDB1G1ipk9smmCuG41vl5wjvjtA",
        "quote": "\"El agarre se siente supersuave y el MagSafe pega con muchísima fuerza.\"",
        "handle": "@chloe.designs • Compradora Verificada",
        "rating": 5
      },
      {
        "id": "sp-3",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBQauvziJMfircGLEHl-2Pw8Z4b3055oiSSx2unBQspDaU7sykP1aQo8aeaGC1ZNWLRlffEz-cr2075uxYuQM28_pH96-drzReRZtZvSlYE4QABxKFMTEafgbNodyHBwsH3lDI-6t9qbmfc2ICanwTBmOEg3b9nCCrGh7WFEMF_Q_jf_CvWEQfUbBwPgtgaNvqgn3IhjZAhapzNENlYpisTodS45DCT5c2KQ25zng",
        "quote": "\"Pagué por WhatsApp y el delivery me llegó rapidísimo, brutal el servicio.\"",
        "handle": "@elena_k • Compradora Verificada",
        "rating": 5
      },
      {
        "id": "sp-4",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD6OodEXL_Z6-BjsHPK6RVu5nf0PIBXVIMdjBuixeeraJLFqnIqYhniefgyYHm8PxjOB54XFtPG1CocgRFenTwg_tZ2EnmUfF6ZNoLZZbX_1EAzMfB22P7mN44qIl-vTqv_cTPuvessAqqfU5kPQxbrb3Io5YV7DQPH1awOiAu0u-2Ehr1J-Ylhvbl9xxK0nK7ibXGDNFANMxFMiUmqxFaSGLAOJyun5flYwN1IoA",
        "quote": "\"El espejo de atrás es tan nítido que me sirve para retocarme el maquillaje. Obsesionada.\"",
        "handle": "@hannah.rooftop • Compradora Verificada",
        "rating": 5
      }
    ]
  }'::JSONB;

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS faq_config JSONB NOT NULL DEFAULT '{
    "enabled": true,
    "badge_text": "Ayuda y Compatibilidad",
    "title": "Preguntas Frecuentes",
    "items": [
      {
        "id": "faq-1",
        "question": "¿Las fundas Pocket Cases son compatibles con cargadores MagSafe de Apple?",
        "answer": "¡Sí, totalmente! Todos los modelos marcados como \"MagSafe Tough\" y \"Mirror MagSafe\" integran un anillo magnético de neodimio de 36 imanes flush de alto poder, alineado a la perfección entre nuestras capas protectoras para asegurar un agarre súper firme con cargadores inalámbricos, soportes y cargadores rápidos Qi2."
      },
      {
        "id": "faq-2",
        "question": "¿Cómo funciona el pedido rápido por WhatsApp?",
        "answer": "Al tocar \"Pagar directo por WhatsApp\", se genera automáticamente el detalle de tu compra con los modelos y acabados seleccionados. Una asesora de Pocket Cases te atiende al instante para confirmar el modelo exacto de tu cel, coordinar el pago (vía Zelle, Pago Móvil, tarjeta o efectivo) y despachar tu pedido de una vez."
      },
      {
        "id": "faq-3",
        "question": "¿Las fundas transparentes se ponen amarillas con el tiempo?",
        "answer": "¡Para nada! Nuestra serie Crystal Clear está fabricada con policarbonato alifático premium resistente a los rayos UV con filtro de onda azul. Cero efecto amarillo, respaldado por nuestra Garantía de 1 Año Anti-Amarilleo."
      }
    ]
  }'::JSONB;

-- 3. Populate distinct image_url on existing product_color_variants
UPDATE public.product_color_variants cv
SET image_url = CASE cv.sku_suffix
  -- Product 1: Retro Floral Groove
  WHEN '-YLW' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w'
  WHEN '-BLS' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA'
  WHEN '-MNT' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw'
  WHEN '-LLC' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz06aT1HBB7QHgq-plDLUnsbDm1qJmLIAKqq0GQTD1r_P8K5hSFXisDXyIDRu7TNVSXhYkIpGiq2JoaZW1Bi_BQJkFOalu_DF1IgUjc-1oM_PWJHkf3j98a9HTttNW5-eTT6ouL637-Qf_CEq9fX1s_EoPSYG5ApIbTLV3prH37SXicBfieb_3BrxMycavaqg0J8ij-gMUEu6QjVgJ-jweOy8eRxEy9evi3Mu5hQ'
  -- Product 2: Strawberry Milkshake Wave
  WHEN '-STM' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA6u7m5nokrmgvMJnZSoO7w1v7DsVk5Q_3n-WB7SpTdkzZCMaI_958emOUsxulpHO5QfwTvSBOugqqtd4YiocNwFErRXNJ3PxFT5-nlEP9vyJRMkyTp02EIPOflLiqrbll_4H1oM8pxCAb_9Pf8V2GDWp5kL9HL7-VFCzviSWN-UHNXM9nwYWAzTO3ByEtRxkWnD1_SxuOZ_K3qNJxdv_eStFEERbdR_1LpfvdTg'
  WHEN '-CRM' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA'
  WHEN '-RSY' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA'
  -- Product 3: Lilac Butter Checker
  WHEN '-LIL' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz06aT1HBB7QHgq-plDLUnsbDm1qJmLIAKqq0GQTD1r_P8K5hSFXisDXyIDRu7TNVSXhYkIpGiq2JoaZW1Bi_BQJkFOalu_DF1IgUjc-1oM_PWJHkf3j98a9HTttNW5-eTT6ouL637-Qf_CEq9fX1s_EoPSYG5ApIbTLV3prH37SXicBfieb_3BrxMycavaqg0J8ij-gMUEu6QjVgJ-jweOy8eRxEy9evi3Mu5hQ'
  WHEN '-BTR' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvDGtqlKuHZhwUcfol5zmf2IeRyEd0TsBNAMGLbF9sgvpQsoqEvO4blj9Y2O6xJ3arqXpwTcN325LTwUOwd-ycWOpc9zn2ZTpo4glENUWVkXcEVd5t8OHap_YMMBJC9yJfnyBlodaGhFNeR34V2xeiggYUjYSVP6eFrkUQGaQMXdhsRX2EK3HiybgBTs_v8WsIIwo56ZWTyUn0FKMRbNbL9JZbtOdc1AaehrS3mA'
  WHEN '-LAV' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDprCKxlNuVFDODbR8iQ1rPlUkQBP1O8rpie_sCDOQcT0QR_J1kKJxHLluk78S7MKjn66w6bGmNgOyTa8oWPuFLPQCSL1hyodSh2KamBx78ReDXkIiZd_iemcXDOA4KV0NEm94i5OMtw-f0rc2fm20FLDR69XfLGD-uAHhmv7-bmScVyEHmX-2I2rc7OiVltAkGq_UAxxIXnQEgkwWsitVh_IzjOcLsmIy8Biilzw'
  -- Product 4: Matcha Latte Swirl
  WHEN '-MCH' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtZMstY5Hhw_fUqdnnKwwgUTCBrq49uD3c8flukXCM_FzVspVxXH-QaTdNd1yzu2ilHsDiAU3bxwbA07MUkXnu1Vd74nlbyL1EtIjNb9cgHmb96Hcqr8QWqxZFXv3Bh9CA3m0U9thh6OzUHi1fndbnMfvDXwf6QblPb8q1jmZokhXmnLjGZZDlS_NEbFVqHzb-Ro0cFqI2l0AOA0gXpsOYwx2n-ScfU2pryFYmaA'
  WHEN '-MLK' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdrerItfNYyDy-batQxdIXLC9UCouVAznWJ9M9EJWBjpMe9FfiRTdsYV0cpXmTVPoZMH99RI5QGA4ESZGXmF7Hb1xq_6_wM6Pta2iYU45JkgPlZ-kxXG_IEtXBLZJlhlowd162wG6VnT2GXZLUQa2oHSCtWn5VQADWhO98IsR2npVQkx1XPaJ2QGDfwx-0OF8wcwMODjMp23lH-7uqOyyOPaaujanIsx8p5J7kvQ'
  -- Product 5: Sunset Sorbet Glow
  WHEN '-PCH' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBplCCBimsW_P-HAj-QIxpJOqiUcrJGBQbh7YM9ioFAXRQkiJk8P-s967Lrchs2o0d3GL7WbyP2uQ2b2wreWfC06q7J0GHGYNUapyB59fEtO41KlZNFBn51Ds6eWxm8e3qhDTvfwom1eSq7r66d9V5nesRWCG4xCY_9iLhgpM0fpupEe0jZSbzlhaZpg0HzO1PZud0c1awwifupXZzlT32iLprApkRdAvfwemNc_w'
  WHEN '-GLD' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w'
  WHEN '-SUN' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA'
  WHEN '-RSG' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuADQ1ABhJhdWqSa_pm1jW7XPR0T5dZ6ojOlpUsZ1Q-oK0a8IGIomDMRHqbfeWhcH29_mXnAIaJUKdPSpvVTNKjTRozXjFf7jppSTF_2M7beNf7yhI-kkX2F8IqBJ6tEDtotekZWqYenEYWgJNUtcpEzNaLGfQxzz7d502XMG_GYGEUQXaBFN_itANhGb_i5GvnVNrVcwxQylFPvWfIs-vsgsf8I9ZkhypHFSy4fYA'
  -- Product 6: Cosmic Cherry Pop
  WHEN '-CHR' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGTbuAS2_Bdlyix431XhXGFjcVIMo_i1lD1tmvxKWD7xUOOBLBhF_P-nepVu5SoaeUIps5rIr06780ISBy0KtZNi71TMPfzpf0WG2TEOCr9TQ0o5ptwgnJKKFdjSywirwUz_NYh98SrYIHCEPy59rTw3zxfP2TWCrXD4y_UAtaEzfAjsC0QUbhbSIy9vNxxQy_88Y3rLWPGU7j5Vt0sKK93h-U9skOY75fuY8cWQ'
  WHEN '-CLR' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXHqp0eQ1syQdd7lYOliwIEoUBZr74lh1Q_dSx0Z9Aa0A78TNym37MqTxCohvokykm-jTRP03Wp6lvJDeYEm8hs6TuvYQfQcZjqLUIQA0LGDUkv4ofIYd_uGzrYqPDC7e-k1Ew6UMmcXiB8iBkjMSfE_1rJzQ-Dey4U3lwUjrpTk6Y86l_ssMHzW_B1HV40qgpfHsa5flfhHqfavL7J_O6PfEl3n2Q9AspGTitQ'
  WHEN '-BRY' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA6u7m5nokrmgvMJnZSoO7w1v7DsVk5Q_3n-WB7SpTdkzZCMaI_958emOUsxulpHO5QfwTvSBOugqqtd4YiocNwFErRXNJ3PxFT5-nlEP9vyJRMkyTp02EIPOflLiqrbll_4H1oM8pxCAb_9Pf8V2GDWp5kL9HL7-VFCzviSWN-UHNXM9nwYWAzTO3ByEtRxkWnD1_SxuOZ_K3qNJxdv_eStFEERbdR_1LpfvdTg'
  -- Product 7: Vanilla Dream Cloud
  WHEN '-VAN' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDprCKxlNuVFDODbR8iQ1rPlUkQBP1O8rpie_sCDOQcT0QR_J1kKJxHLluk78S7MKjn66w6bGmNgOyTa8oWPuFLPQCSL1hyodSh2KamBx78ReDXkIiZd_iemcXDOA4KV0NEm94i5OMtw-f0rc2fm20FLDR69XfLGD-uAHhmv7-bmScVyEHmX-2I2rc7OiVltAkGq_UAxxIXnQEgkwWsitVh_IzjOcLsmIy8Biilzw'
  WHEN '-WHT' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA'
  WHEN '-OAT' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvDGtqlKuHZhwUcfol5zmf2IeRyEd0TsBNAMGLbF9sgvpQsoqEvO4blj9Y2O6xJ3arqXpwTcN325LTwUOwd-ycWOpc9zn2ZTpo4glENUWVkXcEVd5t8OHap_YMMBJC9yJfnyBlodaGhFNeR34V2xeiggYUjYSVP6eFrkUQGaQMXdhsRX2EK3HiybgBTs_v8WsIIwo56ZWTyUn0FKMRbNbL9JZbtOdc1AaehrS3mA'
  -- Product 8: Pistachio Vintage Daisy
  WHEN '-PST' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDanXPC2QSG2vv4qnFkuTiJo9rCIcEu3qODeoYo0GdkJ-bogCtTWEBjkUfXlUwoW-yA-EfYF78Zr5eB7FRxmVYOiIH2wNKQZhXjvkooFx_6dfibc_WJONamjiFTAI-UaO-DsK4XkaAzkv4fDxm0kRDqkH7sSRiILm84OH_MlVvFaKHd6mrK5YfwF42VZVj_gg2tAUbmflzOZT4S-GMuddDmS-DbJwbZeRrewQDiAw'
  WHEN '-MTC' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtZMstY5Hhw_fUqdnnKwwgUTCBrq49uD3c8flukXCM_FzVspVxXH-QaTdNd1yzu2ilHsDiAU3bxwbA07MUkXnu1Vd74nlbyL1EtIjNb9cgHmb96Hcqr8QWqxZFXv3Bh9CA3m0U9thh6OzUHi1fndbnMfvDXwf6QblPb8q1jmZokhXmnLjGZZDlS_NEbFVqHzb-Ro0cFqI2l0AOA0gXpsOYwx2n-ScfU2pryFYmaA'
  WHEN '-BTD' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w'
  WHEN '-SGE' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw'
  -- Product 9: Midnight Velvet Noir
  WHEN '-BLK' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoO47GzVrs0Qf7u0v1pTG-Xq8nUYA71Z2vsS6c38x1Qe4hudtkCchId0cWcFXksBla8QURnf9_TGaNs5wORPabW-tUdR7v_WY8pjahhruTYcNTVC5w_DBM1o4XA3CVPuXRj10E26QuTAeSMmiSR6VJXCTtA3rlQhp7OY-IlFhTBRQXvp1qypUubN1C3isXoEhtFWsjVw30IIJidFW9is6yMRMbESjVLhwaNV6VBg'
  WHEN '-GRP' THEN 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXHqp0eQ1syQdd7lYOliwIEoUBZr74lh1Q_dSx0Z9Aa0A78TNym37MqTxCohvokykm-jTRP03Wp6lvJDeYEm8hs6TuvYQfQcZjqLUIQA0LGDUkv4ofIYd_uGzrYqPDC7e-k1Ew6UMmcXiB8iBkjMSfE_1rJzQ-Dey4U3lwUjrpTk6Y86l_ssMHzW_B1HV40qgpfHsa5flfhHqfavL7J_O6PfEl3n2Q9AspGTitQ'
  ELSE cv.image_url
END
WHERE cv.image_url IS NULL;
