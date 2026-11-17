# Plan de Arquitectura y Desarrollo: Pocket Cases (Storefront & CMS)

> **Sistema de Diseño**: `Retro Pastel Pop` (Y2K Retro-Chic + Neo-Brutalismo Suave)  
> **Mercado Objetivo**: Venezuela (Precios en USD + Tasa BCV / Pago Móvil / Zelle / Checkout directo por WhatsApp)  
> **Stack**: Next.js 15+ (App Router), TypeScript estricto, Tailwind CSS, Supabase (`@supabase/ssr`, Auth, Postgres, Storage), Zustand, React Hook Form + Zod, Lucide React / Material Symbols.

---

## 1. Tokens de Diseño (`tailwind.config.ts` & CSS Global)

### 1.1 Tipografías y Iconografía (`app/layout.tsx` & `globals.css`)
- **Fuentes de Google Fonts (`next/font/google`)**:
  - `Plus Jakarta Sans`: Pesos `500`, `700`, `800` (Display, Headlines y Body).
  - `Space Grotesk`: Peso `700` (Labels, Badges, SKUs, Precios y Chips).
- **Iconos**:
  - Soporte dual: `Material Symbols Outlined` (cargado vía Google Fonts stylesheet para mantener 100% de fidelidad con los mockups HTML originales) + `lucide-react` para componentes interactivos adicionales.
- **Animaciones y Utilidades Base (`globals.css`)**:
  - Animación `@keyframes marquee` (`24s linear infinite`) para el Top Marquee Ticker del Storefront.
  - Ocultación de scrollbars (`::-webkit-scrollbar { display: none; }` / `.scrollbar-none`) para cintas de filtros horizontales.
  - Sombras estilo Retro Sticker (`shadow-[2px_2px_0px_#2a3235]`, `shadow-[3px_3px_0px_#2a3235]`, `shadow-[4px_4px_0px_#2a3235]`, `shadow-[4px_4px_0px_#ab2c5d]`).

### 1.2 Configuración Exacta de `tailwind.config.ts`
Extraída directamente del bloque `<script id="tailwind-config">` de ambos archivos `code.html` y `DESIGN.md`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed": "#ffd9e1",
        "surface-container": "#e7eff3",
        "on-tertiary-fixed-variant": "#07521d",
        "surface-container-low": "#edf5f9",
        "on-secondary": "#ffffff",
        "surface-container-highest": "#dce4e7",
        primary: "#ab2c5d",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        "primary-fixed-dim": "#ffb1c5",
        "primary-container": "#f06292",
        "inverse-primary": "#ffb1c5",
        "on-primary-fixed": "#3f001b",
        "on-background": "#151d20",
        "secondary-container": "#c9e7ca",
        "on-secondary-container": "#4e6952",
        "tertiary-fixed": "#abf4ac",
        "on-primary-container": "#5e002b",
        "on-secondary-fixed-variant": "#334d37",
        surface: "#f3fbfe",
        "tertiary-fixed-dim": "#90d792",
        "tertiary-container": "#5fa364",
        tertiary: "#286b33",
        "on-error": "#ffffff",
        "secondary-fixed": "#cceacd",
        "surface-dim": "#d3dbdf",
        "surface-container-high": "#e1e9ed",
        "surface-tint": "#ab2c5d",
        "surface-bright": "#f3fbfe",
        error: "#ba1a1a",
        "inverse-on-surface": "#eaf2f6",
        "on-surface-variant": "#574146",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed": "#002107",
        "surface-variant": "#dce4e7",
        "on-surface": "#151d20",
        "on-tertiary-container": "#00350f",
        "on-error-container": "#93000a",
        "on-secondary-fixed": "#07200e",
        "inverse-surface": "#2a3235",
        outline: "#8a7176",
        "outline-variant": "#ddbfc5",
        "secondary-fixed-dim": "#b1ceb2",
        "on-primary": "#ffffff",
        background: "#f3fbfe",
        secondary: "#4a654e",
        "on-primary-fixed-variant": "#8b0e45",
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      spacing: {
        gutter: "1.25rem",
        "gutter-desktop": "1.75rem",
        margin: "1rem",
        "margin-desktop": "2.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "space-2xl": "4rem",
      },
      fontFamily: {
        "display-hero": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "display-hero-mobile": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-lg-mobile": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-sm": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-md": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "label-lg": ["var(--font-space)", "Space Grotesk", "sans-serif"],
        "label-md": ["var(--font-space)", "Space Grotesk", "sans-serif"],
        "label-badge": ["var(--font-space)", "Space Grotesk", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-hero-mobile": ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "headline-sm": ["18px", { lineHeight: "24px", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "500" }],
        "label-lg": ["14px", { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "700" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "700" }],
        "label-badge": ["10px", { lineHeight: "12px", letterSpacing: "0.06em", fontWeight: "700" }],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 2. Esquema de Base de Datos (Supabase PostgreSQL, RLS & Storage)

El diseño en los archivos HTML muestra que cada producto en Pocket Cases tiene:
- Metadatos principales: Nombre, Slug (`strawberry-milkshake-wave`), SKU base (`PKT-STW-02`), subtítulo técnico (`Doble Armadura MagSafe`), badge de categoría sobre imagen (`MagSafe Tough`, `Dual Shock`, `Bio-Resina`, `Cristal Clear`, `Mirror MagSafe`, `Ultra Slim`, `Vegan Leather`), etiqueta promocional en CMS (`BESTSELLER`, `HOT DROP`, `WAITLIST`, `UNPUBLISHED`).
- Precios y Costos: `price_usd` (`$32.00`), `compare_at_price_usd` (`$38.00`), `cost_usd` (`$8.10` para cálculo automático de margen bruto `75% GM` en el CMS).
- Variantes de Color (Swatches): Nombre en español/inglés (`Amarillo Mantequilla`, `Leche de Fresa`), código Hexadecimal (`#FDE047`), sufijo SKU (`-YLW`), y stock individual (`28 in stock`).
- Modelos de Teléfono Soportados: Selector en la tarjeta (`iPhone 16 Pro`, `iPhone 15 Pro`, `Galaxy S25 Ultra`, etc.) y matriz multi-select en el drawer del CMS (`iPhone 13` hasta `iPhone 16 Pro Max`, Samsung Galaxy).
- Acabados Disponibles (Finishes): `Grip Mate` y `Brillo Jelly`.
- Controles de Inventario y Visibilidad: `stock_status` (`in_stock`, `low_stock`, `out_of_stock`, `draft`), `total_stock`, `low_stock_threshold`, `track_inventory`, `is_live` (Product Active on Storefront), `allow_whatsapp_checkout`, `show_low_stock_badge`, y texto de lista de espera (`waitlist_label`, ej. `"Vuelve en 3 días"` o `"Lista abierta"`).
- Galería Multimedia: Imagen principal (`primary_image_url`), color de fondo pastel de la tarjeta (`card_bg_class`), y galería secundaria reordenable (`gallery_urls`).

### 2.1 Tablas SQL (`supabase/migrations/0001_initial_schema.sql`)

1. **`categories`**:
   - `id` (`uuid`, PK)
   - `name` (`text`, ej. `"MagSafe Tough"`, `"Dual Shock"`, `"Bio-Resina"`, `"Heavy Duty Armor"`, `"Crystal Clear"`, `"Vegan Leather"`, `"Ultra Slim"`)
   - `slug` (`text`, unique, ej. `"magsafe"`, `"slim"`, `"collabs"`)
   - `description` (`text`)
   - `sort_order` (`int`)
   - `created_at` (`timestamptz`)

2. **`phone_models`**:
   - `id` (`uuid`, PK)
   - `brand` (`text`, `'apple' | 'samsung'`)
   - `name` (`text`, unique, ej. `'iPhone 16 Pro Max'`, `'iPhone 16 Pro'`, `'iPhone 15 Pro'`, `'Galaxy S25 Ultra'`)
   - `series` (`text`, ej. `'Serie iPhone 16 / 15'`, `'Samsung Galaxy'`)
   - `sort_order` (`int`)
   - `is_active` (`boolean`, default `true`)

3. **`products`**:
   - `id` (`uuid`, PK)
   - `sku` (`text`, unique, ej. `'PKT-FLR-01'`)
   - `title` (`text`, not null, ej. `'Retro Floral Groove'`)
   - `slug` (`text`, unique, not null, ej. `'retro-floral-groove'`)
   - `subtitle` (`text`, ej. `'Doble Armadura MagSafe'`)
   - `category_id` (`uuid`, FK -> `categories.id`)
   - `category_badge` (`text`, ej. `'MagSafe Tough'`)
   - `promo_tag` (`text`, nullable, ej. `'BESTSELLER'`, `'HOT DROP'`, `'WAITLIST'`, `'UNPUBLISHED'`)
   - `price_usd` (`numeric(10,2)`, not null)
   - `compare_at_price_usd` (`numeric(10,2)`, nullable)
   - `cost_usd` (`numeric(10,2)`, default `0.00`)
   - `primary_image_url` (`text`, not null)
   - `gallery_urls` (`text[]`, default `'{}'`)
   - `card_bg_style` (`text`, default `'secondary'`, para alternar fondos pastel en el Storefront)
   - `finishes` (`text[]`, default `ARRAY['Grip Mate', 'Brillo Jelly']`)
   - `default_finish` (`text`, default `'Grip Mate'`)
   - `total_stock` (`int`, default `0`)
   - `low_stock_threshold` (`int`, default `10`)
   - `track_inventory` (`boolean`, default `true`)
   - `stock_status` (`text`, check in `('in_stock', 'low_stock', 'out_of_stock', 'draft')`, default `'in_stock'`)
   - `is_live` (`boolean`, default `true`)
   - `allow_whatsapp_checkout` (`boolean`, default `true`)
   - `show_low_stock_badge` (`boolean`, default `false`)
   - `restock_badge_text` (`text`, nullable, ej. `'Vuelve en 3 días'`, `'Lista abierta'`)
   - `restock_select_text` (`text`, nullable, ej. `'Todos los modelos reservados'`)
   - `is_featured_hero` (`boolean`, default `false`)
   - `created_at` (`timestamptz`)
   - `updated_at` (`timestamptz`)

4. **`product_color_variants`** (Swatches de color e inventario por tono):
   - `id` (`uuid`, PK)
   - `product_id` (`uuid`, FK -> `products.id` ON DELETE CASCADE)
   - `name` (`text`, not null, ej. `'Amarillo Mantequilla'`)
   - `name_en` (`text`, nullable, ej. `'Butter Yellow'`)
   - `hex_code` (`text`, not null, ej. `'#FDE047'`)
   - `sku_suffix` (`text`, not null, ej. `'-YLW'`)
   - `stock_units` (`int`, not null, default `0`)
   - `is_default` (`boolean`, default `false`)
   - `sort_order` (`int`, default `0`)

5. **`product_phone_models`** (Relación muchos-a-muchos de compatibilidad y stock por modelo):
   - `id` (`uuid`, PK)
   - `product_id` (`uuid`, FK -> `products.id` ON DELETE CASCADE)
   - `phone_model_id` (`uuid`, FK -> `phone_models.id` ON DELETE CASCADE)
   - `stock_units` (`int`, default `10`)
   - `is_available` (`boolean`, default `true`)
   - UNIQUE(`product_id`, `phone_model_id`)

6. **`store_settings`** (Configuración global y pagos VE):
   - `id` (`int`, PK, default `1`, single-row constraint)
   - `store_name` (`text`, default `'Pocket Cases'`)
   - `whatsapp_number` (`text`, default `'584120000000'`)
   - `bcv_exchange_rate` (`numeric(10,2)`, default `45.50`)
   - `show_ves_reference` (`boolean`, default `true`)
   - `free_shipping_threshold_usd` (`numeric(10,2)`, default `35.00`)
   - `shipping_flat_rate_usd` (`numeric(10,2)`, default `4.00`)
   - `pago_movil_details` (`jsonb`, `{ "bank": "Banesco (0134)", "phone": "0412-0000000", "rif": "J-50000000-0" }`)
   - `zelle_details` (`jsonb`, `{ "email": "pagos@pocketcases.co", "holder": "Pocket Cases LLC" }`)
   - `updated_at` (`timestamptz`)

7. **`orders`** (Registro de pedidos por WhatsApp y Pasarela Manual VE):
   - `id` (`uuid`, PK)
   - `order_number` (`serial`)
   - `customer_name` (`text`)
   - `customer_phone` (`text`)
   - `customer_city` (`text`, ej. `'Caracas'`, `'Lechería'`, `'Maracaibo'`)
   - `payment_method` (`text`, `'whatsapp' | 'pago_movil' | 'zelle' | 'card'`)
   - `payment_reference` (`text`, nullable)
   - `items` (`jsonb`, not null)
   - `subtotal_usd` (`numeric(10,2)`, not null)
   - `shipping_usd` (`numeric(10,2)`, not null)
   - `total_usd` (`numeric(10,2)`, not null)
   - `exchange_rate_bcv` (`numeric(10,2)`)
   - `status` (`text`, default `'pending'`)
   - `created_at` (`timestamptz`)

8. **`waitlist_subscriptions`** (Para el botón "Avisarme cuando vuelva" / "Unirme a la lista de espera"):
   - `id` (`uuid`, PK)
   - `product_id` (`uuid`, FK -> `products.id` ON DELETE CASCADE)
   - `whatsapp_phone` (`text`, not null)
   - `phone_model` (`text`, nullable)
   - `created_at` (`timestamptz`)

### 2.2 Políticas de Seguridad Row Level Security (RLS)
- **Catálogo Público (`categories`, `phone_models`, `products`, `product_color_variants`, `product_phone_models`, `store_settings`)**:
  - `SELECT`: Permitido para roles `anon` y `authenticated` (`USING (true)`). En el Storefront se filtra por `is_live = true`, mientras que los administradores autenticados ven todos los registros (incluyendo `draft` / `UNPUBLISHED`).
  - `INSERT / UPDATE / DELETE`: Restringido exclusivamente a `authenticated` (`auth.role() = 'authenticated'`).
- **Pedidos y Lista de Espera (`orders`, `waitlist_subscriptions`)**:
  - `INSERT`: Permitido para `anon` y `authenticated` (para que cualquier visitante pueda registrar su orden al hacer checkout o anotarse en la lista de espera).
  - `SELECT / UPDATE / DELETE`: Restringido exclusivamente a `authenticated` (administradores del CMS).

### 2.3 Supabase Storage Bucket (`product-images`)
- Creación del bucket público `product-images` (`public = true`, límite de 5MB por archivo, MIME types permitidos: `image/png`, `image/jpeg`, `image/webp`).
- Políticas RLS en `storage.objects`:
  - Lectura pública (`SELECT`) para `bucket_id = 'product-images'`.
  - Subida, actualización y eliminación (`INSERT`, `UPDATE`, `DELETE`) restringidas a usuarios autenticados (`auth.role() = 'authenticated'`).

---

## 3. Estructura de Rutas (Next.js App Router) y Arquitectura Modular

```text
src/
├── app/
│   ├── layout.tsx                        # Fuentes Plus Jakarta Sans, Space Grotesk, Material Symbols
│   ├── globals.css                       # Variables base, animaciones marquee y utilidades
│   ├── (storefront)/                     # Grupo de rutas públicas del e-commerce
│   │   ├── layout.tsx                    # Navbar, TopMarquee, CartDrawer, FloatingCartPill, Footer
│   │   └── page.tsx                      # Server Component: carga inicial desde Supabase y renderiza secciones
│   └── (cms)/                            # Grupo de rutas administrativas
│       ├── admin/
│       │   ├── login/
│       │   │   └── page.tsx              # Login administrativo con Supabase Auth (estilo Retro Pastel Pop)
│       │   └── (protected)/
│       │       ├── layout.tsx            # Sidebar fija (64px/256px) + Header administrativo + Verificación SSR Auth
│       │       └── products/
│       │           └── page.tsx          # Vista principal del CMS: métricas, tabla interactiva, filtros y Drawer CRUD
├── components/
│   ├── storefront/
│   │   ├── TopMarquee.tsx                # Cinta superior animada con promesas de marca
│   │   ├── Navbar.tsx                    # Header sticky con buscador, selector de moneda USD/Bs, WhatsApp y contador de bolsa
│   │   ├── HeroSection.tsx               # Hero editorial + Mosaico interactivo 2x2 con sello rotatorio "DROP Y2K"
│   │   ├── TrustMetricsBar.tsx           # 4 tarjetas de propuesta de valor (Protección 3m, Eco-Resina, HD, Envíos)
│   │   ├── ProductCatalog.tsx            # Contenedor cliente con estado de filtrado (Serie iPhone, Samsung, MagSafe, Slim, etc.) y ordenamiento
│   │   ├── FilterBar.tsx                 # Píldoras de filtro horizontal y selector de ordenamiento
│   │   ├── ProductCard.tsx               # Tarjeta interactiva con selector de swatches, modelo de teléfono, acabado Mate/Jelly, wishlist y Quick Add
│   │   ├── CartDrawer.tsx                # Drawer lateral con barra de progreso de envío gratis ($35+), charm de regalo ($0), y Checkout WhatsApp / Pago Móvil / Zelle
│   │   ├── CheckoutModalVE.tsx           # Modal de pago adaptado a Venezuela (Tasa BCV en Bs., datos de Pago Móvil, Zelle y confirmación)
│   │   ├── WaitlistModal.tsx             # Modal rápido para capturar WhatsApp en productos agotados ("Matcha Latte Swirl", "Vanilla Dream Cloud")
│   │   ├── SocialProofReel.tsx           # Sección "#POCKETCASESENLACALLE" (Caracas, Lechería, Maracaibo)
│   │   ├── FaqSection.tsx                # Acordeón interactivo de preguntas frecuentes
│   │   └── Footer.tsx                    # Footer completo con suscripción a Pocket Club y badges de métodos de pago VE
│   └── cms/
│       ├── AdminSidebar.tsx              # Barra lateral con navegación, badge ADMIN CMS y perfil de usuario + Logout
│       ├── AdminHeader.tsx               # Barra superior con buscador global, botón "Live Store View" y alertas
│       ├── MetricsStrip.tsx              # 4 tarjetas KPI (Total Products, Live in Store, Stockout Alerts, Low Stock Warning)
│       ├── ProductTableControls.tsx      # Buscador por SKU/título, filtros por Categoría/Stock/Visibilidad y cinta de acciones por lote (Bulk Actions)
│       ├── ProductTable.tsx              # Tabla administrativa con switches en vivo ("Storefront Live"), barras de inventario, swatches y acciones rápidas
│       ├── ProductFormDrawer.tsx         # Slide-out Drawer de 2 columnas (React Hook Form + Zod) para Crear/Editar productos
│       ├── MediaGalleryManager.tsx       # Gestor de imagen principal + miniaturas y subida directa a Supabase Storage (`product-images`)
│       ├── ColorVariantManager.tsx       # Gestor dinámico de swatches con color picker, código HEX, sufijo SKU y stock por color
│       └── PhoneModelMultiSelect.tsx     # Selector rápido de modelos compatibles (Select All 13-16 / Clear)
├── store/
│   └── useCartStore.ts                   # Estado global persistente con Zustand (items, abrir/cerrar drawer, cálculo de envío gratis, moneda USD/VES)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # `createBrowserClient` (@supabase/ssr)
│   │   ├── server.ts                     # `createServerClient` (@supabase/ssr)
│   │   └── middleware.ts                 # Refresco de sesión y protección de rutas `/admin/*`
│   ├── validations/
│   │   └── productSchema.ts              # Esquema Zod estricto para validación del formulario de productos y variantes
│   └── whatsapp.ts                       # Generador de enlaces y mensajes formateados para pedidos por WhatsApp
└── types/
    └── database.ts                       # Tipos TypeScript estrictos sincronizados con el esquema SQL de Supabase
```

---

## 4. Estrategia de Moneda y Pagos para Venezuela (VE)

Basado en el análisis del Storefront (`pocket_cases_storefront_landing_page_espa_ol_ve/code.html`):

1. **Precios Base en USD ($) con Conversión Referencial BCV (Bs.)**:
   - Todos los productos se almacenan y gestionan en **USD ($)** como moneda dura en el CMS.
   - El botón de moneda en el `Navbar` (`USD ($)`) permitirá alternar o visualizar en un tooltip/subtexto el equivalente en **Bolívares (Bs.)** calculado dinámicamente según la tasa oficial `bcv_exchange_rate` configurada en `store_settings`.
2. **Medidor de Envío Gratis Nacional (`$35.00+`)**:
   - El `CartDrawer` calcula automáticamente el progreso hacia los `$35.00` USD. Si `subtotal >= 35`, muestra `"¡Desbloqueaste envío GRATIS a nivel nacional! • 100% Desbloqueado"` (por MRW / Zoom / Tealca o delivery en Caracas). Si es menor, muestra cuánto falta para desbloquearlo.
   - Incluye automáticamente el regalo promocional (`¡Charm de regalo incluido! • $0.00`) cuando hay productos en el carrito.
3. **Checkout Primario: Pedido Directo por WhatsApp (`#25D366`)**:
   - Botón principal de alta conversión `"⚡ Pagar directo por WhatsApp"`.
   - Construye dinámicamente el mensaje codificado con cada ítem del carrito (Nombre, Modelo de teléfono, Color seleccionado, Acabado Mate/Jelly, Cantidad y Precio), el Subtotal, estatus de Envío Nacional y el Total en USD (y referencia en Bs. a tasa BCV), además de registrar opcionalmente la orden en la tabla `orders` de Supabase.
4. **Checkout Secundario: Pasarela Adaptada a Venezuela (Pago Móvil / Zelle / Tarjeta)**:
   - Al hacer clic en `"Pagar con tarjeta o Pago Móvil / Zelle"`, se despliega el modal `CheckoutModalVE` (estilizado con `Retro Pastel Pop`) donde el cliente puede:
     - Ver los datos bancarios exactos de **Pago Móvil** (Banco, Teléfono, RIF y monto exacto en Bs. a tasa BCV) o **Zelle** (Correo y Titular).
     - Ingresar sus datos de envío (Nombre, WhatsApp, Ciudad/Agencia MRW o Zoom, y últimos 4 dígitos de referencia de pago).
     - Guardar la orden directamente en la tabla `orders` de Supabase y redirigir a WhatsApp con el número de orden generado para confirmación inmediata.

---

## 5. Plan de Ejecución de las Siguientes Fases

- **FASE 2 (Configuración Base y Base de Datos)**:
  1. Inicializar el proyecto Next.js 15+ con `pnpm`, TypeScript, Tailwind CSS y configurar `tailwind.config.ts` y `globals.css`.
  2. Instalar dependencias (`@supabase/ssr`, `@supabase/supabase-js`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`, `clsx`, `tailwind-merge`).
  3. Crear `supabase/migrations/0001_initial_schema.sql` con todas las tablas, políticas RLS, bucket `product-images` y **Seed Data completo** con los 9 productos exactos de ambos HTML (`Retro Floral Groove`, `Strawberry Milkshake Wave`, `Lilac Butter Checker`, `Matcha Latte Swirl`, `Sunset Sorbet Glow`, `Cosmic Cherry Pop`, `Vanilla Dream Cloud`, `Pistachio Vintage Daisy`, y `Midnight Velvet Noir` en estado Draft/Unpublished), incluyendo sus imágenes originales, variantes de color HEX, costos y modelos soportados.
- **FASE 3 (Desarrollo del Storefront)**:
  1. Implementar todos los componentes de `(storefront)` manteniendo fidelidad pixel-perfect con `pocket_cases_storefront_landing_page_espa_ol_ve/code.html`.
  2. Conectar catálogo en tiempo real a Supabase, filtros interactivos por categoría/modelo, selector de color/modelo/acabado en cada tarjeta, carrito persistente en Zustand y flujos de Checkout VE + WhatsApp.
- **FASE 4 (Desarrollo del CMS)**:
  1. Implementar autenticación con Supabase Auth (`/admin/login`) y middleware de protección.
  2. Construir `/admin/products` con fidelidad 100% a `pocket_cases_cms_product_management/code.html`: KPIs en tiempo real, filtros, acciones por lote (Cambiar estado, Descuento -15%, Agotar, Eliminar), switches inline de visibilidad/estado, exportación CSV y el Drawer interactivo de edición/creación con subida de imágenes a Supabase Storage.
