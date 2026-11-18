import {
  Product,
  StoreSettings,
  PhoneModel,
  Category,
  HeroBannerConfig,
  SocialProofConfig,
  FaqConfig,
} from "@/types/database";

export const DEFAULT_SOCIAL_PROOF_CONFIG: SocialProofConfig = {
  enabled: true,
  hashtag: "#POCKETCASESENLACALLE",
  title: "En la Calle con Pocket Cases",
  subtitle:
    "Fotos reales compartidas por nuestra comunidad en Caracas, Lechería, Maracaibo y más.",
  cta_text: "Etiqueta a @pocketcases para aparecer",
  cta_url: "https://instagram.com",
  items: [
    {
      id: "sp-1",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD_zRR7YhS3NVSrRBKEYa6u5_hHGnxMc89pxY3TZmfInVmov4-BsJusIpXe-637MsyZ7ouClHeYY_VTvrR1nC8V4eXctFAEScoW5ZuAkSrcGM3amrwmVfHZTO2HMktxplQ_2ctL0dCmr1j-TwDssKwSHHHMYPctCJ5v9gu_0vJrUpcacIDPE5NCs8SaKE0tIqId9aO3EG-QIspO_DufqPrg5wfEb3Y2sF_9iZpCeA",
      quote:
        '"¡Se me cayó bajando las escaleras y ni un solo rasguño! Es demasiado bella."',
      handle: "@mia.in.ccs • Compradora Verificada",
      rating: 5,
    },
    {
      id: "sp-2",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDKUmmJnRbu6TGrqwvH5KeQLWpDJhOta1805Mls64d2lTsZZIcIt9rfNOu9-XncnKywOLQH6GbPnrffG5OKsGyFPr0K3dSDCE-FNB-FniG43qh0o-vEkdHsqM1FT03b-B8I2BkO8tLmmyrkuVhdTN521HwcZKa3CtFROR87H9NaCx0PrLrbc-rpS-UdZv46sfTumUSVsL-M2EtuDB1G1ipk9smmCuG41vl5wjvjtA",
      quote:
        '"El agarre se siente supersuave y el MagSafe pega con muchísima fuerza."',
      handle: "@chloe.designs • Compradora Verificada",
      rating: 5,
    },
    {
      id: "sp-3",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBQauvziJMfircGLEHl-2Pw8Z4b3055oiSSx2unBQspDaU7sykP1aQo8aeaGC1ZNWLRlffEz-cr2075uxYuQM28_pH96-drzReRZtZvSlYE4QABxKFMTEafgbNodyHBwsH3lDI-6t9qbmfc2ICanwTBmOEg3b9nCCrGh7WFEMF_Q_jf_CvWEQfUbBwPgtgaNvqgn3IhjZAhapzNENlYpisTodS45DCT5c2KQ25zng",
      quote:
        '"Pagué por WhatsApp y el delivery me llegó rapidísimo, brutal el servicio."',
      handle: "@elena_k • Compradora Verificada",
      rating: 5,
    },
    {
      id: "sp-4",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD6OodEXL_Z6-BjsHPK6RVu5nf0PIBXVIMdjBuixeeraJLFqnIqYhniefgyYHm8PxjOB54XFtPG1CocgRFenTwg_tZ2EnmUfF6ZNoLZZbX_1EAzMfB22P7mN44qIl-vTqv_cTPuvessAqqfU5kPQxbrb3Io5YV7DQPH1awOiAu0u-2Ehr1J-Ylhvbl9xxK0nK7ibXGDNFANMxFMiUmqxFaSGLAOJyun5flYwN1IoA",
      quote:
        '"El espejo de atrás es tan nítido que me sirve para retocarme el maquillaje. Obsesionada."',
      handle: "@hannah.rooftop • Compradora Verificada",
      rating: 5,
    },
  ],
};

export const DEFAULT_FAQ_CONFIG: FaqConfig = {
  enabled: true,
  badge_text: "Ayuda y Compatibilidad",
  title: "Preguntas Frecuentes",
  items: [
    {
      id: "faq-1",
      question:
        "¿Las fundas Pocket Cases son compatibles con cargadores MagSafe de Apple?",
      answer:
        '¡Sí, totalmente! Todos los modelos marcados como "MagSafe Tough" y "Mirror MagSafe" integran un anillo magnético de neodimio de 36 imanes flush de alto poder, alineado a la perfección entre nuestras capas protectoras para asegurar un agarre súper firme con cargadores inalámbricos, soportes y cargadores rápidos Qi2.',
    },
    {
      id: "faq-2",
      question: "¿Cómo funciona el pedido rápido por WhatsApp?",
      answer:
        'Al tocar "Pagar directo por WhatsApp", se genera automáticamente el detalle de tu compra con los modelos y acabados seleccionados. Una asesora de Pocket Cases te atiende al instante para confirmar el modelo exacto de tu cel, coordinar el pago (vía Zelle, Pago Móvil, tarjeta o efectivo) y despachar tu pedido de una vez.',
    },
    {
      id: "faq-3",
      question: "¿Las fundas transparentes se ponen amarillas con el tiempo?",
      answer:
        "¡Para nada! Nuestra serie Crystal Clear está fabricada con policarbonato alifático premium resistente a los rayos UV con filtro de onda azul. Cero efecto amarillo, respaldado por nuestra Garantía de 1 Año Anti-Amarilleo.",
    },
  ],
};

export const DEFAULT_HERO_CONFIG: HeroBannerConfig = {
  badge_text: "EDICIÓN 2025 • NUEVO LANZAMIENTO",
  headline_prefix: "Viste tu cel con",
  headline_highlight: "puro estilo",
  headline_suffix: "brutal.",
  subheadline:
    "Fundas estéticas y resistentes contra caídas, con protección militar y ese brillo retro Y2K que convierte tus fotos de espejo en sesiones de fotos.",
  rating_score: "4.9 / 5",
  rating_text: "de más de 12.000 clientes felices",
  primary_cta_text: "Ver Más Vendidos",
  secondary_cta_text: "Explorar MagSafe",
  stamp_line_1: "DROP Y2K",
  stamp_line_2: "GEN-5 CORE",
  feature_bubble_title: "Amortiguación Doble Capa",
  feature_bubble_subtitle: "Esquinas con bolsas de aire anticaída",
  feature_bubble_badge: "Ultra Resistente",
  card_1: {
    badge: "MÁS VENDIDO",
    title: "Strawberry Wave",
    price_text: "$32.00",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU-bAWiHhlC25-gUa_bsY4bZsc0C_TsocUBjFSU_tQgwJaIj3D0ewmAYzpZ4-aoIEgFqChwtA1B_ZzDmeWwqdmtyAlOCQuhNM0Hid7QrUvYuRU_0BGpFW7-O_vche5I4zV5tjKd-DNXXU7Gsaua_CU7NsbJwXJriM4QuMQho97gF2y15XZ592b-fu-JuioG4U9wJiXvWLwvWQjr2akKE6-86wb-eiMu7fwW_NHXw",
    search_keyword: "Strawberry",
    category_filter: "all",
  },
  card_2: {
    badge: "MAGSAFE",
    title: "Floral Groove",
    price_text: "$28.00",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA",
    search_keyword: "",
    category_filter: "magsafe",
  },
};

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  id: 1,
  store_name: "Pocket Cases",
  logo_url: "/logo.png",
  whatsapp_number:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "584120000000",
  bcv_exchange_rate: 45.8,
  show_ves_reference: true,
  free_shipping_threshold_usd: 35.0,
  shipping_flat_rate_usd: 4.0,
  enable_free_shipping_bar: true,
  free_shipping_locked_text: "¡Agrega {amount} más para envío GRATIS!",
  free_shipping_unlocked_text: "¡Desbloqueaste envío GRATIS a nivel nacional!",
  enable_free_gift_banner: true,
  free_gift_text: "¡Charm de regalo incluido!",
  pago_movil_details: {
    bank: "Banesco (0134)",
    phone: "0412-0000000",
    rif: "J-50123456-0",
  },
  zelle_details: {
    email: "pagos@pocketcases.co",
    holder: "Pocket Cases Inc.",
  },
  hero_config: DEFAULT_HERO_CONFIG,
  social_proof_config: DEFAULT_SOCIAL_PROOF_CONFIG,
  faq_config: DEFAULT_FAQ_CONFIG,
};

export function normalizeStoreSettings(
  raw?: Partial<StoreSettings> | Record<string, unknown> | null
): StoreSettings {
  if (!raw || typeof raw !== "object") {
    return INITIAL_STORE_SETTINGS;
  }

  const rawLogo =
    typeof raw.logo_url === "string" ? raw.logo_url.trim() : "";
  const logo_url =
    !rawLogo ||
    rawLogo.includes("lh3.googleusercontent.com/aida/ALJJyrBY2o")
      ? "/logo.png"
      : rawLogo;

  const rawHero =
    raw.hero_config && typeof raw.hero_config === "object"
      ? (raw.hero_config as Partial<HeroBannerConfig>)
      : {};

  const hero_config: HeroBannerConfig = {
    ...DEFAULT_HERO_CONFIG,
    ...rawHero,
    card_1: {
      ...DEFAULT_HERO_CONFIG.card_1,
      ...(rawHero.card_1 && typeof rawHero.card_1 === "object"
        ? rawHero.card_1
        : {}),
    },
    card_2: {
      ...DEFAULT_HERO_CONFIG.card_2,
      ...(rawHero.card_2 && typeof rawHero.card_2 === "object"
        ? rawHero.card_2
        : {}),
    },
  };

  const rawSocialProof =
    raw.social_proof_config && typeof raw.social_proof_config === "object"
      ? (raw.social_proof_config as Partial<SocialProofConfig>)
      : {};

  const social_proof_config: SocialProofConfig = {
    ...DEFAULT_SOCIAL_PROOF_CONFIG,
    ...rawSocialProof,
    items:
      Array.isArray(rawSocialProof.items) && rawSocialProof.items.length > 0
        ? rawSocialProof.items
        : DEFAULT_SOCIAL_PROOF_CONFIG.items,
  };

  const rawFaq =
    raw.faq_config && typeof raw.faq_config === "object"
      ? (raw.faq_config as Partial<FaqConfig>)
      : {};

  const faq_config: FaqConfig = {
    ...DEFAULT_FAQ_CONFIG,
    ...rawFaq,
    items:
      Array.isArray(rawFaq.items) && rawFaq.items.length > 0
        ? rawFaq.items
        : DEFAULT_FAQ_CONFIG.items,
  };

  const rawPagoMovil =
    raw.pago_movil_details && typeof raw.pago_movil_details === "object"
      ? (raw.pago_movil_details as StoreSettings["pago_movil_details"])
      : INITIAL_STORE_SETTINGS.pago_movil_details;

  const rawZelle =
    raw.zelle_details && typeof raw.zelle_details === "object"
      ? (raw.zelle_details as StoreSettings["zelle_details"])
      : INITIAL_STORE_SETTINGS.zelle_details;

  return {
    id: 1,
    store_name:
      typeof raw.store_name === "string" && raw.store_name.trim()
        ? raw.store_name
        : INITIAL_STORE_SETTINGS.store_name,
    logo_url,
    whatsapp_number:
      typeof raw.whatsapp_number === "string" && raw.whatsapp_number.trim()
        ? raw.whatsapp_number
        : INITIAL_STORE_SETTINGS.whatsapp_number,
    bcv_exchange_rate: Number(
      raw.bcv_exchange_rate ?? INITIAL_STORE_SETTINGS.bcv_exchange_rate
    ),
    show_ves_reference:
      raw.show_ves_reference !== undefined
        ? Boolean(raw.show_ves_reference)
        : INITIAL_STORE_SETTINGS.show_ves_reference,
    free_shipping_threshold_usd: Number(
      raw.free_shipping_threshold_usd ??
        INITIAL_STORE_SETTINGS.free_shipping_threshold_usd
    ),
    shipping_flat_rate_usd: Number(
      raw.shipping_flat_rate_usd ??
        INITIAL_STORE_SETTINGS.shipping_flat_rate_usd
    ),
    enable_free_shipping_bar:
      raw.enable_free_shipping_bar !== undefined
        ? Boolean(raw.enable_free_shipping_bar)
        : INITIAL_STORE_SETTINGS.enable_free_shipping_bar,
    free_shipping_locked_text:
      typeof raw.free_shipping_locked_text === "string" &&
      raw.free_shipping_locked_text.trim()
        ? raw.free_shipping_locked_text
        : INITIAL_STORE_SETTINGS.free_shipping_locked_text,
    free_shipping_unlocked_text:
      typeof raw.free_shipping_unlocked_text === "string" &&
      raw.free_shipping_unlocked_text.trim()
        ? raw.free_shipping_unlocked_text
        : INITIAL_STORE_SETTINGS.free_shipping_unlocked_text,
    enable_free_gift_banner:
      raw.enable_free_gift_banner !== undefined
        ? Boolean(raw.enable_free_gift_banner)
        : INITIAL_STORE_SETTINGS.enable_free_gift_banner,
    free_gift_text:
      typeof raw.free_gift_text === "string" && raw.free_gift_text.trim()
        ? raw.free_gift_text
        : INITIAL_STORE_SETTINGS.free_gift_text,
    pago_movil_details: {
      ...INITIAL_STORE_SETTINGS.pago_movil_details,
      ...rawPagoMovil,
    },
    zelle_details: {
      ...INITIAL_STORE_SETTINGS.zelle_details,
      ...rawZelle,
    },
    hero_config,
    social_proof_config,
    faq_config,
  };
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "MagSafe Tough", slug: "magsafe-tough", description: "Doble armadura con anillo magnético MagSafe", sort_order: 1 },
  { id: "cat-2", name: "Dual Shock", slug: "dual-shock", description: "Absorción de impactos y anti-amarilleo", sort_order: 2 },
  { id: "cat-3", name: "Bio-Resina", slug: "bio-resin", description: "Polímero ecológico biodegradable", sort_order: 3 },
  { id: "cat-4", name: "Heavy Duty Armor", slug: "heavy-duty-armor", description: "Armadura de alta resistencia 3m", sort_order: 4 },
  { id: "cat-5", name: "Crystal Clear", slug: "crystal-clear", description: "Tecnología Tough Transparente UV", sort_order: 5 },
  { id: "cat-6", name: "Mirror MagSafe", slug: "mirror-magsafe", description: "Acabado espejo cromado MagSafe", sort_order: 6 },
  { id: "cat-7", name: "Ultra Slim", slug: "ultra-slim", description: "Perfil pastel ultradelgado", sort_order: 7 },
  { id: "cat-8", name: "Vegan Leather", slug: "vegan-leather", description: "Cuero vegano texturizado", sort_order: 8 },
];

export const INITIAL_PHONE_MODELS: PhoneModel[] = [
  { id: "pm-1", brand: "apple", name: "iPhone 16 Pro Max", series: "Serie iPhone 16 / 15", sort_order: 1, is_active: true },
  { id: "pm-2", brand: "apple", name: "iPhone 16 Pro", series: "Serie iPhone 16 / 15", sort_order: 2, is_active: true },
  { id: "pm-3", brand: "apple", name: "iPhone 16 Plus", series: "Serie iPhone 16 / 15", sort_order: 3, is_active: true },
  { id: "pm-4", brand: "apple", name: "iPhone 16", series: "Serie iPhone 16 / 15", sort_order: 4, is_active: true },
  { id: "pm-5", brand: "apple", name: "iPhone 15 Pro Max", series: "Serie iPhone 16 / 15", sort_order: 5, is_active: true },
  { id: "pm-6", brand: "apple", name: "iPhone 15 Pro", series: "Serie iPhone 16 / 15", sort_order: 6, is_active: true },
  { id: "pm-7", brand: "apple", name: "iPhone 15", series: "Serie iPhone 16 / 15", sort_order: 7, is_active: true },
  { id: "pm-8", brand: "apple", name: "iPhone 14 Pro Max", series: "Serie iPhone 14 / 13", sort_order: 8, is_active: true },
  { id: "pm-9", brand: "apple", name: "iPhone 14 Pro", series: "Serie iPhone 14 / 13", sort_order: 9, is_active: true },
  { id: "pm-10", brand: "apple", name: "iPhone 14", series: "Serie iPhone 14 / 13", sort_order: 10, is_active: true },
  { id: "pm-11", brand: "apple", name: "iPhone 13 Pro Max", series: "Serie iPhone 14 / 13", sort_order: 11, is_active: true },
  { id: "pm-12", brand: "apple", name: "iPhone 13 Pro", series: "Serie iPhone 14 / 13", sort_order: 12, is_active: true },
  { id: "pm-13", brand: "apple", name: "iPhone 13", series: "Serie iPhone 14 / 13", sort_order: 13, is_active: true },
  { id: "pm-14", brand: "samsung", name: "Galaxy S25 Ultra", series: "Samsung Galaxy", sort_order: 14, is_active: true },
];

export const DEFAULT_CARD_MODELS = [
  "iPhone 16 Pro",
  "iPhone 15 Pro",
  "iPhone 14 Pro",
  "iPhone 13 Pro",
  "Galaxy S25 Ultra",
];


export const ALL_SUPPORTED_MODELS = INITIAL_PHONE_MODELS.map((m) => m.name);

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "PKT-FLR-01",
    title: "Retro Floral Groove",
    slug: "retro-floral-groove",
    subtitle: "Doble Armadura MagSafe",
    category_id: "cat-1",
    category_badge: "MagSafe Tough",
    filter_tags: ["iphone", "samsung", "magsafe"],
    promo_tag: "BESTSELLER",
    price_usd: 28.0,
    compare_at_price_usd: 36.0,
    cost_usd: 7.2,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw",
    ],
    card_bg_style: "secondary-fixed",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 24,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "in_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: true,
    sort_order: 1,
    created_at: "2025-01-10T12:00:00Z",
    updated_at: "2025-01-10T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-1-1",
        product_id: "prod-1",
        name: "Amarillo Mantequilla",
        name_en: "Butter Yellow",
        hex_code: "#FDE047",
        sku_suffix: "-YLW",
        stock_units: 8,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w",
      },
      {
        id: "cv-1-2",
        product_id: "prod-1",
        name: "Flor Pastel",
        name_en: "Pastel Blossom",
        hex_code: "#F472B6",
        sku_suffix: "-BLS",
        stock_units: 6,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA",
      },
      {
        id: "cv-1-3",
        product_id: "prod-1",
        name: "Menta Glaseada",
        name_en: "Mint Glaze",
        hex_code: "#86EFAC",
        sku_suffix: "-MNT",
        stock_units: 5,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw",
      },
      {
        id: "cv-1-4",
        product_id: "prod-1",
        name: "Lila Haze",
        name_en: "Lilac Haze",
        hex_code: "#C084FC",
        sku_suffix: "-LLC",
        stock_units: 5,
        is_default: false,
        sort_order: 4,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBz06aT1HBB7QHgq-plDLUnsbDm1qJmLIAKqq0GQTD1r_P8K5hSFXisDXyIDRu7TNVSXhYkIpGiq2JoaZW1Bi_BQJkFOalu_DF1IgUjc-1oM_PWJHkf3j98a9HTttNW5-eTT6ouL637-Qf_CEq9fX1s_EoPSYG5ApIbTLV3prH37SXicBfieb_3BrxMycavaqg0J8ij-gMUEu6QjVgJ-jweOy8eRxEy9evi3Mu5hQ",
      },
    ],
  },
  {
    id: "prod-2",
    sku: "PKT-STW-02",
    title: "Strawberry Milkshake Wave",
    slug: "strawberry-milkshake-wave",
    subtitle: "Anti-Amarilleo / Absorción de impactos",
    category_id: "cat-2",
    category_badge: "Dual Shock",
    filter_tags: ["iphone", "samsung", "collabs"],
    promo_tag: "HOT DROP",
    price_usd: 32.0,
    compare_at_price_usd: 38.0,
    cost_usd: 8.1,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA6u7m5nokrmgvMJnZSoO7w1v7DsVk5Q_3n-WB7SpTdkzZCMaI_958emOUsxulpHO5QfwTvSBOugqqtd4YiocNwFErRXNJ3PxFT5-nlEP9vyJRMkyTp02EIPOflLiqrbll_4H1oM8pxCAb_9Pf8V2GDWp5kL9HL7-VFCzviSWN-UHNXM9nwYWAzTO3ByEtRxkWnD1_SxuOZ_K3qNJxdv_eStFEERbdR_1LpfvdTg",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADQ1ABhJhdWqSa_pm1jW7XPR0T5dZ6ojOlpUsZ1Q-oK0a8IGIomDMRHqbfeWhcH29_mXnAIaJUKdPSpvVTNKjTRozXjFf7jppSTF_2M7beNf7yhI-kkX2F8IqBJ6tEDtotekZWqYenEYWgJNUtcpEzNaLGfQxzz7d502XMG_GYGEUQXaBFN_itANhGb_i5GvnVNrVcwxQylFPvWfIs-vsgsf8I9ZkhypHFSy4fYA",
    ],
    card_bg_style: "primary-fixed",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Brillo Jelly",
    total_stock: 88,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "in_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: true,
    sort_order: 2,
    created_at: "2025-01-11T12:00:00Z",
    updated_at: "2025-01-11T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-2-1",
        product_id: "prod-2",
        name: "Leche de Fresa",
        name_en: "Strawberry Milk",
        hex_code: "#FDA4AF",
        sku_suffix: "-STM",
        stock_units: 38,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDA6u7m5nokrmgvMJnZSoO7w1v7DsVk5Q_3n-WB7SpTdkzZCMaI_958emOUsxulpHO5QfwTvSBOugqqtd4YiocNwFErRXNJ3PxFT5-nlEP9vyJRMkyTp02EIPOflLiqrbll_4H1oM8pxCAb_9Pf8V2GDWp5kL9HL7-VFCzviSWN-UHNXM9nwYWAzTO3ByEtRxkWnD1_SxuOZ_K3qNJxdv_eStFEERbdR_1LpfvdTg",
      },
      {
        id: "cv-2-2",
        product_id: "prod-2",
        name: "Crema Glaseada",
        name_en: "Cream Gloss",
        hex_code: "#FFF1F2",
        sku_suffix: "-CRM",
        stock_units: 28,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA",
      },
      {
        id: "cv-2-3",
        product_id: "prod-2",
        name: "Tono Rosado",
        name_en: "Rosy Tint",
        hex_code: "#FB7185",
        sku_suffix: "-RSY",
        stock_units: 22,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA",
      },
    ],
  },
  {
    id: "prod-3",
    sku: "PKT-LIL-03",
    title: "Lilac Butter Checker",
    slug: "lilac-butter-checker",
    subtitle: "Polímero Bio-Resina Eco",
    category_id: "cat-3",
    category_badge: "Bio-Resina",
    filter_tags: ["iphone", "slim"],
    promo_tag: null,
    price_usd: 26.0,
    compare_at_price_usd: 30.0,
    cost_usd: 6.5,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBz06aT1HBB7QHgq-plDLUnsbDm1qJmLIAKqq0GQTD1r_P8K5hSFXisDXyIDRu7TNVSXhYkIpGiq2JoaZW1Bi_BQJkFOalu_DF1IgUjc-1oM_PWJHkf3j98a9HTttNW5-eTT6ouL637-Qf_CEq9fX1s_EoPSYG5ApIbTLV3prH37SXicBfieb_3BrxMycavaqg0J8ij-gMUEu6QjVgJ-jweOy8eRxEy9evi3Mu5hQ",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDvDGtqlKuHZhwUcfol5zmf2IeRyEd0TsBNAMGLbF9sgvpQsoqEvO4blj9Y2O6xJ3arqXpwTcN325LTwUOwd-ycWOpc9zn2ZTpo4glENUWVkXcEVd5t8OHap_YMMBJC9yJfnyBlodaGhFNeR34V2xeiggYUjYSVP6eFrkUQGaQMXdhsRX2EK3HiybgBTs_v8WsIIwo56ZWTyUn0FKMRbNbL9JZbtOdc1AaehrS3mA",
    ],
    card_bg_style: "surface-container",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 3,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "low_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: true,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: false,
    sort_order: 3,
    created_at: "2025-01-12T12:00:00Z",
    updated_at: "2025-01-12T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-3-1",
        product_id: "prod-3",
        name: "Sueño Lila",
        name_en: "Lilac Dream",
        hex_code: "#D8B4FE",
        sku_suffix: "-LIL",
        stock_units: 1,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBz06aT1HBB7QHgq-plDLUnsbDm1qJmLIAKqq0GQTD1r_P8K5hSFXisDXyIDRu7TNVSXhYkIpGiq2JoaZW1Bi_BQJkFOalu_DF1IgUjc-1oM_PWJHkf3j98a9HTttNW5-eTT6ouL637-Qf_CEq9fX1s_EoPSYG5ApIbTLV3prH37SXicBfieb_3BrxMycavaqg0J8ij-gMUEu6QjVgJ-jweOy8eRxEy9evi3Mu5hQ",
      },
      {
        id: "cv-3-2",
        product_id: "prod-3",
        name: "Crema Mantequilla",
        name_en: "Butter Cream",
        hex_code: "#FEF08A",
        sku_suffix: "-BTR",
        stock_units: 1,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDvDGtqlKuHZhwUcfol5zmf2IeRyEd0TsBNAMGLbF9sgvpQsoqEvO4blj9Y2O6xJ3arqXpwTcN325LTwUOwd-ycWOpc9zn2ZTpo4glENUWVkXcEVd5t8OHap_YMMBJC9yJfnyBlodaGhFNeR34V2xeiggYUjYSVP6eFrkUQGaQMXdhsRX2EK3HiybgBTs_v8WsIIwo56ZWTyUn0FKMRbNbL9JZbtOdc1AaehrS3mA",
      },
      {
        id: "cv-3-3",
        product_id: "prod-3",
        name: "Lavanda Chill",
        name_en: "Chill Lavender",
        hex_code: "#A855F7",
        sku_suffix: "-LAV",
        stock_units: 1,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDprCKxlNuVFDODbR8iQ1rPlUkQBP1O8rpie_sCDOQcT0QR_J1kKJxHLluk78S7MKjn66w6bGmNgOyTa8oWPuFLPQCSL1hyodSh2KamBx78ReDXkIiZd_iemcXDOA4KV0NEm94i5OMtw-f0rc2fm20FLDR69XfLGD-uAHhmv7-bmScVyEHmX-2I2rc7OiVltAkGq_UAxxIXnQEgkwWsitVh_IzjOcLsmIy8Biilzw",
      },
    ],
  },
  {
    id: "prod-4",
    sku: "PKT-MCH-04",
    title: "Matcha Latte Swirl",
    slug: "matcha-latte-swirl",
    subtitle: "Armadura de Alta Resistencia",
    category_id: "cat-4",
    category_badge: "Heavy Duty Armor",
    filter_tags: ["iphone", "samsung"],
    promo_tag: "WAITLIST",
    price_usd: 30.0,
    compare_at_price_usd: null,
    cost_usd: 7.8,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtZMstY5Hhw_fUqdnnKwwgUTCBrq49uD3c8flukXCM_FzVspVxXH-QaTdNd1yzu2ilHsDiAU3bxwbA07MUkXnu1Vd74nlbyL1EtIjNb9cgHmb96Hcqr8QWqxZFXv3Bh9CA3m0U9thh6OzUHi1fndbnMfvDXwf6QblPb8q1jmZokhXmnLjGZZDlS_NEbFVqHzb-Ro0cFqI2l0AOA0gXpsOYwx2n-ScfU2pryFYmaA",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrerItfNYyDy-batQxdIXLC9UCouVAznWJ9M9EJWBjpMe9FfiRTdsYV0cpXmTVPoZMH99RI5QGA4ESZGXmF7Hb1xq_6_wM6Pta2iYU45JkgPlZ-kxXG_IEtXBLZJlhlowd162wG6VnT2GXZLUQa2oHSCtWn5VQADWhO98IsR2npVQkx1XPaJ2QGDfwx-0OF8wcwMODjMp23lH-7uqOyyOPaaujanIsx8p5J7kvQ",
    ],
    card_bg_style: "secondary-container",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 0,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "out_of_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: "Vuelve en 3 días",
    restock_select_text: "Todos los modelos reservados",
    is_featured_hero: false,
    sort_order: 4,
    created_at: "2025-01-13T12:00:00Z",
    updated_at: "2025-01-13T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-4-1",
        product_id: "prod-4",
        name: "Matcha Latte",
        name_en: "Matcha Foam",
        hex_code: "#86EFAC",
        sku_suffix: "-MCH",
        stock_units: 0,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBtZMstY5Hhw_fUqdnnKwwgUTCBrq49uD3c8flukXCM_FzVspVxXH-QaTdNd1yzu2ilHsDiAU3bxwbA07MUkXnu1Vd74nlbyL1EtIjNb9cgHmb96Hcqr8QWqxZFXv3Bh9CA3m0U9thh6OzUHi1fndbnMfvDXwf6QblPb8q1jmZokhXmnLjGZZDlS_NEbFVqHzb-Ro0cFqI2l0AOA0gXpsOYwx2n-ScfU2pryFYmaA",
      },
      {
        id: "cv-4-2",
        product_id: "prod-4",
        name: "Espuma de Leche",
        name_en: "Milk Swirl",
        hex_code: "#F1F5F9",
        sku_suffix: "-MLK",
        stock_units: 0,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrerItfNYyDy-batQxdIXLC9UCouVAznWJ9M9EJWBjpMe9FfiRTdsYV0cpXmTVPoZMH99RI5QGA4ESZGXmF7Hb1xq_6_wM6Pta2iYU45JkgPlZ-kxXG_IEtXBLZJlhlowd162wG6VnT2GXZLUQa2oHSCtWn5VQADWhO98IsR2npVQkx1XPaJ2QGDfwx-0OF8wcwMODjMp23lH-7uqOyyOPaaujanIsx8p5J7kvQ",
      },
    ],
  },
  {
    id: "prod-5",
    sku: "PKT-SUN-05",
    title: "Sunset Sorbet Glow",
    slug: "sunset-sorbet-glow",
    subtitle: "Acabado Espejo MagSafe",
    category_id: "cat-6",
    category_badge: "Mirror MagSafe",
    filter_tags: ["iphone", "magsafe", "collabs"],
    promo_tag: "HOT DROP",
    price_usd: 34.0,
    compare_at_price_usd: 42.0,
    cost_usd: 8.5,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBplCCBimsW_P-HAj-QIxpJOqiUcrJGBQbh7YM9ioFAXRQkiJk8P-s967Lrchs2o0d3GL7WbyP2uQ2b2wreWfC06q7J0GHGYNUapyB59fEtO41KlZNFBn51Ds6eWxm8e3qhDTvfwom1eSq7r66d9V5nesRWCG4xCY_9iLhgpM0fpupEe0jZSbzlhaZpg0HzO1PZud0c1awwifupXZzlT32iLprApkRdAvfwemNc_w",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU-bAWiHhlC25-gUa_bsY4bZsc0C_TsocUBjFSU_tQgwJaIj3D0ewmAYzpZ4-aoIEgFqChwtA1B_ZzDmeWwqdmtyAlOCQuhNM0Hid7QrUvYuRU_0BGpFW7-O_vche5I4zV5tjKd-DNXXU7Gsaua_CU7NsbJwXJriM4QuMQho97gF2y15XZ592b-fu-JuioG4U9wJiXvWLwvWQjr2akKE6-86wb-eiMu7fwW_NHXw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADQ1ABhJhdWqSa_pm1jW7XPR0T5dZ6ojOlpUsZ1Q-oK0a8IGIomDMRHqbfeWhcH29_mXnAIaJUKdPSpvVTNKjTRozXjFf7jppSTF_2M7beNf7yhI-kkX2F8IqBJ6tEDtotekZWqYenEYWgJNUtcpEzNaLGfQxzz7d502XMG_GYGEUQXaBFN_itANhGb_i5GvnVNrVcwxQylFPvWfIs-vsgsf8I9ZkhypHFSy4fYA",
    ],
    card_bg_style: "primary-fixed-dim",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Brillo Jelly",
    total_stock: 32,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "in_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: false,
    sort_order: 5,
    created_at: "2025-01-14T12:00:00Z",
    updated_at: "2025-01-14T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-5-1",
        product_id: "prod-5",
        name: "Sorbete de Durazno",
        name_en: "Peach Sorbet",
        hex_code: "#FDBA74",
        sku_suffix: "-PCH",
        stock_units: 10,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBplCCBimsW_P-HAj-QIxpJOqiUcrJGBQbh7YM9ioFAXRQkiJk8P-s967Lrchs2o0d3GL7WbyP2uQ2b2wreWfC06q7J0GHGYNUapyB59fEtO41KlZNFBn51Ds6eWxm8e3qhDTvfwom1eSq7r66d9V5nesRWCG4xCY_9iLhgpM0fpupEe0jZSbzlhaZpg0HzO1PZud0c1awwifupXZzlT32iLprApkRdAvfwemNc_w",
      },
      {
        id: "cv-5-2",
        product_id: "prod-5",
        name: "Hora Dorada",
        name_en: "Golden Hour",
        hex_code: "#FCD34D",
        sku_suffix: "-GLD",
        stock_units: 8,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w",
      },
      {
        id: "cv-5-3",
        product_id: "prod-5",
        name: "Brillo Atardecer",
        name_en: "Sunset Glow",
        hex_code: "#FB7185",
        sku_suffix: "-SUN",
        stock_units: 8,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmOfzZaA4Vc6Ya8AuHP4mkN7PQ5tR75FJZFpe_0JcvVMaNu6QjXFhfpORmoukcG9cS9V_3BhkuR6pMc1cgOioE1Naz8uoiW_4BeKtRc3yK1BWPesoLaKKCUEvW6MjPGKvwpzLzrU3gyJAtv0f4FjAJjWgo6LWiof6JaqXonmb3JmTNsMZ-sREZAMrs37-KCQTpbSedv1TPZut2GBbW0BlhzZHfCiBE44NygXwA",
      },
      {
        id: "cv-5-4",
        product_id: "prod-5",
        name: "Oro Rosa",
        name_en: "Rose Gold",
        hex_code: "#F43F5E",
        sku_suffix: "-RSG",
        stock_units: 6,
        is_default: false,
        sort_order: 4,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuADQ1ABhJhdWqSa_pm1jW7XPR0T5dZ6ojOlpUsZ1Q-oK0a8IGIomDMRHqbfeWhcH29_mXnAIaJUKdPSpvVTNKjTRozXjFf7jppSTF_2M7beNf7yhI-kkX2F8IqBJ6tEDtotekZWqYenEYWgJNUtcpEzNaLGfQxzz7d502XMG_GYGEUQXaBFN_itANhGb_i5GvnVNrVcwxQylFPvWfIs-vsgsf8I9ZkhypHFSy4fYA",
      },
    ],
  },
  {
    id: "prod-6",
    sku: "PKT-CHR-05",
    title: "Cosmic Cherry Pop",
    slug: "cosmic-cherry-pop",
    subtitle: "Tecnología Tough Transparente",
    category_id: "cat-5",
    category_badge: "Cristal Clear",
    filter_tags: ["iphone", "samsung", "collabs"],
    promo_tag: null,
    price_usd: 28.0,
    compare_at_price_usd: null,
    cost_usd: 6.9,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGTbuAS2_Bdlyix431XhXGFjcVIMo_i1lD1tmvxKWD7xUOOBLBhF_P-nepVu5SoaeUIps5rIr06780ISBy0KtZNi71TMPfzpf0WG2TEOCr9TQ0o5ptwgnJKKFdjSywirwUz_NYh98SrYIHCEPy59rTw3zxfP2TWCrXD4y_UAtaEzfAjsC0QUbhbSIy9vNxxQy_88Y3rLWPGU7j5Vt0sKK93h-U9skOY75fuY8cWQ",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLXHqp0eQ1syQdd7lYOliwIEoUBZr74lh1Q_dSx0Z9Aa0A78TNym37MqTxCohvokykm-jTRP03Wp6lvJDeYEm8hs6TuvYQfQcZjqLUIQA0LGDUkv4ofIYd_uGzrYqPDC7e-k1Ew6UMmcXiB8iBkjMSfE_1rJzQ-Dey4U3lwUjrpTk6Y86l_ssMHzW_B1HV40qgpfHsa5flfhHqfavL7J_O6PfEl3n2Q9AspGTitQ",
    ],
    card_bg_style: "primary-fixed",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 45,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "in_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: false,
    sort_order: 6,
    created_at: "2025-01-15T12:00:00Z",
    updated_at: "2025-01-15T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-6-1",
        product_id: "prod-6",
        name: "Glaseado Cereza",
        name_en: "Cherry Glaze",
        hex_code: "#E11D48",
        sku_suffix: "-CHR",
        stock_units: 20,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAGTbuAS2_Bdlyix431XhXGFjcVIMo_i1lD1tmvxKWD7xUOOBLBhF_P-nepVu5SoaeUIps5rIr06780ISBy0KtZNi71TMPfzpf0WG2TEOCr9TQ0o5ptwgnJKKFdjSywirwUz_NYh98SrYIHCEPy59rTw3zxfP2TWCrXD4y_UAtaEzfAjsC0QUbhbSIy9vNxxQy_88Y3rLWPGU7j5Vt0sKK93h-U9skOY75fuY8cWQ",
      },
      {
        id: "cv-6-2",
        product_id: "prod-6",
        name: "Brillo Cristal",
        name_en: "Crystal Clear",
        hex_code: "#F1F5F9",
        sku_suffix: "-CLR",
        stock_units: 15,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDLXHqp0eQ1syQdd7lYOliwIEoUBZr74lh1Q_dSx0Z9Aa0A78TNym37MqTxCohvokykm-jTRP03Wp6lvJDeYEm8hs6TuvYQfQcZjqLUIQA0LGDUkv4ofIYd_uGzrYqPDC7e-k1Ew6UMmcXiB8iBkjMSfE_1rJzQ-Dey4U3lwUjrpTk6Y86l_ssMHzW_B1HV40qgpfHsa5flfhHqfavL7J_O6PfEl3n2Q9AspGTitQ",
      },
      {
        id: "cv-6-3",
        product_id: "prod-6",
        name: "Berry Fizz",
        name_en: "Berry Fizz",
        hex_code: "#BE123C",
        sku_suffix: "-BRY",
        stock_units: 10,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDA6u7m5nokrmgvMJnZSoO7w1v7DsVk5Q_3n-WB7SpTdkzZCMaI_958emOUsxulpHO5QfwTvSBOugqqtd4YiocNwFErRXNJ3PxFT5-nlEP9vyJRMkyTp02EIPOflLiqrbll_4H1oM8pxCAb_9Pf8V2GDWp5kL9HL7-VFCzviSWN-UHNXM9nwYWAzTO3ByEtRxkWnD1_SxuOZ_K3qNJxdv_eStFEERbdR_1LpfvdTg",
      },
    ],
  },
  {
    id: "prod-7",
    sku: "PKT-VAN-07",
    title: "Vanilla Dream Cloud",
    slug: "vanilla-dream-cloud",
    subtitle: "Grip Mate Suave",
    category_id: "cat-7",
    category_badge: "Pastel Delgado",
    filter_tags: ["iphone", "slim"],
    promo_tag: "WAITLIST",
    price_usd: 25.0,
    compare_at_price_usd: null,
    cost_usd: 6.2,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDprCKxlNuVFDODbR8iQ1rPlUkQBP1O8rpie_sCDOQcT0QR_J1kKJxHLluk78S7MKjn66w6bGmNgOyTa8oWPuFLPQCSL1hyodSh2KamBx78ReDXkIiZd_iemcXDOA4KV0NEm94i5OMtw-f0rc2fm20FLDR69XfLGD-uAHhmv7-bmScVyEHmX-2I2rc7OiVltAkGq_UAxxIXnQEgkwWsitVh_IzjOcLsmIy8Biilzw",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA",
    ],
    card_bg_style: "surface-container-high",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 0,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "out_of_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: "Lista abierta",
    restock_select_text: "Lote 04 en camino (iPhone 13–16)",
    is_featured_hero: false,
    sort_order: 7,
    created_at: "2025-01-16T12:00:00Z",
    updated_at: "2025-01-16T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-7-1",
        product_id: "prod-7",
        name: "Nube Vainilla",
        name_en: "Vanilla Cloud",
        hex_code: "#FEF9C3",
        sku_suffix: "-VAN",
        stock_units: 0,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDprCKxlNuVFDODbR8iQ1rPlUkQBP1O8rpie_sCDOQcT0QR_J1kKJxHLluk78S7MKjn66w6bGmNgOyTa8oWPuFLPQCSL1hyodSh2KamBx78ReDXkIiZd_iemcXDOA4KV0NEm94i5OMtw-f0rc2fm20FLDR69XfLGD-uAHhmv7-bmScVyEHmX-2I2rc7OiVltAkGq_UAxxIXnQEgkwWsitVh_IzjOcLsmIy8Biilzw",
      },
      {
        id: "cv-7-2",
        product_id: "prod-7",
        name: "Blanco Crema",
        name_en: "Cream White",
        hex_code: "#FFFFFF",
        sku_suffix: "-WHT",
        stock_units: 0,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDPJzbgU-02_BVyJCLt7cVdXWf3F-ndekRHY7ZS5lfxlhX46pJ2b_PEV8eVPn75rnvZquerkrRuzALZxKgoUJENnbVuZvn5_AQXNiB_N3zA3VBSsY_afWTW-1CTub6rxQrg2uylgPPjggGcgqbd0mcCbJOAHhkz037nSiH4emSlZxbwFZ-SbbGB68zQyBU-AJmw3enmbbJcX4kHwb5kCIjdoIWmk6Ys_BB6MCRgZA",
      },
      {
        id: "cv-7-3",
        product_id: "prod-7",
        name: "Avena Suave",
        name_en: "Soft Oat",
        hex_code: "#E2E8F0",
        sku_suffix: "-OAT",
        stock_units: 0,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDvDGtqlKuHZhwUcfol5zmf2IeRyEd0TsBNAMGLbF9sgvpQsoqEvO4blj9Y2O6xJ3arqXpwTcN325LTwUOwd-ycWOpc9zn2ZTpo4glENUWVkXcEVd5t8OHap_YMMBJC9yJfnyBlodaGhFNeR34V2xeiggYUjYSVP6eFrkUQGaQMXdhsRX2EK3HiybgBTs_v8WsIIwo56ZWTyUn0FKMRbNbL9JZbtOdc1AaehrS3mA",
      },
    ],
  },
  {
    id: "prod-8",
    sku: "PKT-PST-08",
    title: "Pistachio Vintage Daisy",
    slug: "pistachio-vintage-daisy",
    subtitle: "Armadura Grip Ultra Delgada",
    category_id: "cat-7",
    category_badge: "Ultra Slim",
    filter_tags: ["iphone", "samsung", "slim"],
    promo_tag: null,
    price_usd: 29.0,
    compare_at_price_usd: 35.0,
    cost_usd: 7.4,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDanXPC2QSG2vv4qnFkuTiJo9rCIcEu3qODeoYo0GdkJ-bogCtTWEBjkUfXlUwoW-yA-EfYF78Zr5eB7FRxmVYOiIH2wNKQZhXjvkooFx_6dfibc_WJONamjiFTAI-UaO-DsK4XkaAzkv4fDxm0kRDqkH7sSRiILm84OH_MlVvFaKHd6mrK5YfwF42VZVj_gg2tAUbmflzOZT4S-GMuddDmS-DbJwbZeRrewQDiAw",
    gallery_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw",
    ],
    card_bg_style: "secondary-fixed",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 15,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "in_stock",
    is_live: true,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: false,
    sort_order: 8,
    created_at: "2025-01-17T12:00:00Z",
    updated_at: "2025-01-17T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-8-1",
        product_id: "prod-8",
        name: "Pistacho Daisy",
        name_en: "Pistachio Daisy",
        hex_code: "#BBF7D0",
        sku_suffix: "-PST",
        stock_units: 5,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDanXPC2QSG2vv4qnFkuTiJo9rCIcEu3qODeoYo0GdkJ-bogCtTWEBjkUfXlUwoW-yA-EfYF78Zr5eB7FRxmVYOiIH2wNKQZhXjvkooFx_6dfibc_WJONamjiFTAI-UaO-DsK4XkaAzkv4fDxm0kRDqkH7sSRiILm84OH_MlVvFaKHd6mrK5YfwF42VZVj_gg2tAUbmflzOZT4S-GMuddDmS-DbJwbZeRrewQDiAw",
      },
      {
        id: "cv-8-2",
        product_id: "prod-8",
        name: "Crema Matcha",
        name_en: "Matcha Cream",
        hex_code: "#86EFAC",
        sku_suffix: "-MTC",
        stock_units: 4,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBtZMstY5Hhw_fUqdnnKwwgUTCBrq49uD3c8flukXCM_FzVspVxXH-QaTdNd1yzu2ilHsDiAU3bxwbA07MUkXnu1Vd74nlbyL1EtIjNb9cgHmb96Hcqr8QWqxZFXv3Bh9CA3m0U9thh6OzUHi1fndbnMfvDXwf6QblPb8q1jmZokhXmnLjGZZDlS_NEbFVqHzb-Ro0cFqI2l0AOA0gXpsOYwx2n-ScfU2pryFYmaA",
      },
      {
        id: "cv-8-3",
        product_id: "prod-8",
        name: "Mantequilla Daisy",
        name_en: "Butter Daisy",
        hex_code: "#FEF08A",
        sku_suffix: "-BTD",
        stock_units: 3,
        is_default: false,
        sort_order: 3,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5ZM8Po1lr2uzdc_s3c7FfBxZINKKv6hmKDTerFZjVVo9a65yE8_FgcCXKw1HJLBzpEVZ7TO3BcrO-zOaPrj_sNp9cI0GHKqYPq-BVxzutnNC57doEAJAufSwbXJ5umh90ZnjW7beDXXyTv6dR28TGB7UOyw1WUrcGsJM1QCH2uobCro-XmNgY57MW8yjkZDfvQp5uS_NSy9lb8_g9NlTKDVCZhwuFo-excQe2w",
      },
      {
        id: "cv-8-4",
        product_id: "prod-8",
        name: "Bruma Salvia",
        name_en: "Sage Mist",
        hex_code: "#A7F3D0",
        sku_suffix: "-SGE",
        stock_units: 3,
        is_default: false,
        sort_order: 4,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA1bmxqyGmJHdRVSACui3dlyVMWJYdC5lxiyR2pwGOvV6k6N46xpFNTfl4h5gD09L_yHugmxsLOAEVP1LoLyEZU0lWj7ZVqhaqQdf9U6vu0s4O9gXvAeTt9Rf5ASOMR8jGsCczgLWKZoIIYKX2S9dR5yxHm-HJIIIdin8A4Lbhafp1O879A6sK86OZtFToF8xBHmnDfadp2_jJF8iuZl0SIjTQ-Its68jQ9kjRNuw",
      },
    ],
  },
  {
    id: "prod-9",
    sku: "PKT-MID-06",
    title: "Midnight Velvet Noir",
    slug: "midnight-velvet-noir",
    subtitle: "Cuero Vegano Texturizado",
    category_id: "cat-8",
    category_badge: "Vegan Leather",
    filter_tags: ["iphone", "magsafe"],
    promo_tag: "UNPUBLISHED",
    price_usd: 35.0,
    compare_at_price_usd: 42.0,
    cost_usd: 9.5,
    primary_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoO47GzVrs0Qf7u0v1pTG-Xq8nUYA71Z2vsS6c38x1Qe4hudtkCchId0cWcFXksBla8QURnf9_TGaNs5wORPabW-tUdR7v_WY8pjahhruTYcNTVC5w_DBM1o4XA3CVPuXRj10E26QuTAeSMmiSR6VJXCTtA3rlQhp7OY-IlFhTBRQXvp1qypUubN1C3isXoEhtFWsjVw30IIJidFW9is6yMRMbESjVLhwaNV6VBg",
    gallery_urls: [],
    card_bg_style: "surface-container",
    finishes: ["Grip Mate", "Brillo Jelly"],
    default_finish: "Grip Mate",
    total_stock: 12,
    low_stock_threshold: 10,
    track_inventory: true,
    stock_status: "draft",
    is_live: false,
    allow_whatsapp_checkout: true,
    show_low_stock_badge: false,
    restock_badge_text: null,
    restock_select_text: null,
    is_featured_hero: false,
    sort_order: 9,
    created_at: "2025-01-18T12:00:00Z",
    updated_at: "2025-01-18T12:00:00Z",
    supported_models: ALL_SUPPORTED_MODELS,
    color_variants: [
      {
        id: "cv-9-1",
        product_id: "prod-9",
        name: "Negro Terciopelo",
        name_en: "Velvet Black",
        hex_code: "#1E293B",
        sku_suffix: "-BLK",
        stock_units: 8,
        is_default: true,
        sort_order: 1,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBoO47GzVrs0Qf7u0v1pTG-Xq8nUYA71Z2vsS6c38x1Qe4hudtkCchId0cWcFXksBla8QURnf9_TGaNs5wORPabW-tUdR7v_WY8pjahhruTYcNTVC5w_DBM1o4XA3CVPuXRj10E26QuTAeSMmiSR6VJXCTtA3rlQhp7OY-IlFhTBRQXvp1qypUubN1C3isXoEhtFWsjVw30IIJidFW9is6yMRMbESjVLhwaNV6VBg",
      },
      {
        id: "cv-9-2",
        product_id: "prod-9",
        name: "Grafito Mate",
        name_en: "Matte Graphite",
        hex_code: "#475569",
        sku_suffix: "-GRP",
        stock_units: 4,
        is_default: false,
        sort_order: 2,
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDLXHqp0eQ1syQdd7lYOliwIEoUBZr74lh1Q_dSx0Z9Aa0A78TNym37MqTxCohvokykm-jTRP03Wp6lvJDeYEm8hs6TuvYQfQcZjqLUIQA0LGDUkv4ofIYd_uGzrYqPDC7e-k1Ew6UMmcXiB8iBkjMSfE_1rJzQ-Dey4U3lwUjrpTk6Y86l_ssMHzW_B1HV40qgpfHsa5flfhHqfavL7J_O6PfEl3n2Q9AspGTitQ",
      },
    ],
  },
];

export function normalizeProductColorVariants(
  rawVariants: unknown[],
  productSkuOrSlug: string,
  primaryImageUrl: string,
  galleryUrls: string[] = []
): Product["color_variants"] {
  const seedProduct = INITIAL_PRODUCTS.find(
    (p) => p.sku === productSkuOrSlug || p.slug === productSkuOrSlug
  );
  const allCatalogImages = INITIAL_PRODUCTS.flatMap((p) => [
    p.primary_image_url,
    ...(p.gallery_urls || []),
  ]).filter(Boolean);

  const fallbackPool = Array.from(
    new Set([
      primaryImageUrl,
      ...(galleryUrls || []),
      ...(seedProduct?.color_variants.map((cv) => cv.image_url) || []),
      ...allCatalogImages,
    ].filter((u): u is string => Boolean(u)))
  );

  return [...rawVariants]
    .sort(
      (a, b) =>
        Number((a as { sort_order?: number }).sort_order ?? 0) -
        Number((b as { sort_order?: number }).sort_order ?? 0)
    )
    .map((v, idx) => {
      const variant = v as Product["color_variants"][number];
      const existingUrl =
        typeof variant.image_url === "string" && variant.image_url.trim()
          ? variant.image_url.trim()
          : null;

      if (existingUrl) {
        return { ...variant, image_url: existingUrl };
      }

      const seedVariant = seedProduct?.color_variants.find(
        (sv) =>
          sv.sku_suffix === variant.sku_suffix ||
          sv.name.toLowerCase() === String(variant.name || "").toLowerCase() ||
          sv.sort_order === variant.sort_order
      );

      const fallbackImage =
        seedVariant?.image_url ||
        fallbackPool[idx % Math.max(1, fallbackPool.length)] ||
        primaryImageUrl;

      return {
        ...variant,
        image_url: fallbackImage,
      };
    });
}

